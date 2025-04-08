import { create } from 'zustand';
import { createClient } from '@/utils/supabase/client'; // Import Supabase client-side utility
import { type User } from '@supabase/supabase-js'; // Import User type

// Define the categories type plus 'All'
import { Region } from '@/data/locations'; // Import Region type
export type Category = 'All' | 'Restaurant' | 'Hiking' | 'Games' | 'Museum' | 'Sports' | 'Shopping' | 'Park' | 'Entertainment';
// Define the combined state structure and actions
interface AppState {
  // Filter state
  selectedCategory: Category;
  selectedRegion: Region | 'All'; // Add state for selected region
  setSelectedCategory: (category: Category) => void;
  setSelectedRegion: (region: Region | 'All') => void; // Add action for region

  // Auth & Profile state
  user: User | null; // Store the logged-in Supabase user object
  attendedEventIds: string[]; // Store attended IDs from the user's profile
  loadingProfile: boolean; // Flag to indicate profile loading state
  
  // Actions
  initializeAuthListener: () => () => void; // Renamed: Sets up Supabase auth listener, returns unsubscribe function
  setUserAndProfile: (user: User | null) => Promise<void>; // Fetches profile and sets state
  toggleAttendedEvent: (id: string) => Promise<void>; // Now async to handle DB update
}

// Create the Zustand store
export const useAppStore = create<AppState>((set, get) => {
  // Create a single Supabase client instance for the store's lifecycle
  const supabase = createClient(); 

  return {
    // --- Filter State ---
    selectedCategory: 'All',
    selectedRegion: 'All', // Initialize region state
    setSelectedCategory: (category: Category) => {
      console.log('Setting category to:', category);
      set({ selectedCategory: category });
    },
    setSelectedRegion: (region: Region | 'All') => {
      console.log('Setting region to:', region);
      set({ selectedRegion: region });
    }, // Implement region action

    // --- Auth & Profile State ---
    user: null, // Initial user state
    attendedEventIds: [], // Initial attended events
    loadingProfile: true, // Start in loading state

    // --- Actions ---
    initializeAuthListener: () => {
      console.log("Setting up Supabase auth listener...");
      
      // Immediately check current session on initialization
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          console.log("Found existing session for user:", session.user.id);
          get().setUserAndProfile(session.user);
        } else {
          console.log("No existing session found");
        }
      });
      
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        
        // Force revalidation on auth events
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
          const currentUser = session?.user ?? null;
          await get().setUserAndProfile(currentUser);
        }
      });

      // Return the unsubscribe function
      return () => {
        console.log("Unsubscribing Supabase auth listener.");
        authListener?.subscription.unsubscribe();
      };
    },

    setUserAndProfile: async (user: User | null) => {
        set({ user: user, loadingProfile: true }); // Set user immediately, start loading profile
        if (user) {
            console.log("Fetching profile for user:", user.id);
            try {
                const { data, error, status } = await supabase
                    .from('profiles')
                    .select(`attended_event_ids`)
                    .eq('id', user.id)
                    .single();

                if (error && status !== 406) { // 406 means no row found, which is okay initially
                    console.error('Error fetching profile:', error);
                    set({ attendedEventIds: [], loadingProfile: false }); // Reset on error
                } else if (data) {
                    console.log("Profile data fetched:", data);
                    // Ensure data.attended_event_ids is an array, default to empty if null/undefined
                    const attendedIds = Array.isArray(data.attended_event_ids) ? data.attended_event_ids : [];
                    set({ attendedEventIds: attendedIds, loadingProfile: false });
                } else {
                     console.log("No profile found for user, using empty attended list.");
                     set({ attendedEventIds: [], loadingProfile: false }); // No profile yet, use empty array
                }
            } catch (error) {
                console.error('Unexpected error fetching profile:', error);
                set({ attendedEventIds: [], loadingProfile: false }); // Reset on unexpected error
            }
        } else {
            console.log("User logged out, clearing attended events.");
            set({ attendedEventIds: [], loadingProfile: false }); // Clear attended events if user logs out
        }
    },

    toggleAttendedEvent: async (id: string) => {
      const user = get().user;
      const currentIds = get().attendedEventIds;

      if (!user) {
        console.warn("User must be logged in to toggle attended events.");
        
        // Check if we're in a browser environment before showing alert
        if (typeof window !== 'undefined') {
          alert("Please log in to mark events as attended.");
        }
        
        // Re-check authentication state from Supabase directly
        try {
          const { data } = await supabase.auth.getSession();
          if (data.session?.user) {
            // If we have a valid session but store doesn't have user,
            // update the store with the current user
            console.log("Found valid session but store user state was null. Updating...");
            await get().setUserAndProfile(data.session.user);
            
            // Try again with the updated user state
            return get().toggleAttendedEvent(id);
          }
        } catch (sessionError) {
          console.error("Error checking session:", sessionError);
        }
        
        return;
      }

      const isAttended = currentIds.includes(id);
      const newIds = isAttended
        ? currentIds.filter((eventId) => eventId !== id)
        : [...currentIds, id];

      // Optimistically update local state for better UX
      set({ attendedEventIds: newIds });

      // Update the database
      console.log(`Updating profile for user ${user.id} with attended IDs:`, newIds);
      try {
          const { error } = await supabase
            .from('profiles')
            .update({ attended_event_ids: newIds, updated_at: new Date().toISOString() })
            .eq('id', user.id);

          if (error) {
            console.error('Error updating attended events in DB:', error);
            // Revert optimistic update if it failed
            set({ attendedEventIds: currentIds });
            
            // Check for auth errors specifically
            if (error.code === 'PGRST301' || error.message.includes('JWT')) {
              console.warn("Authentication error detected. Refreshing session...");
              // Try to refresh the session
              const { data: refreshData } = await supabase.auth.refreshSession();
              if (refreshData.session) {
                console.log("Session refreshed successfully. Retrying operation...");
                // Try the operation again with the refreshed session
                return get().toggleAttendedEvent(id);
              } else {
                if (typeof window !== 'undefined') {
                  alert("Your session has expired. Please log in again.");
                }
              }
            } else {
              // For other errors, show the message
              if (typeof window !== 'undefined') {
                alert(`Error saving attendance: ${error.message}`);
              }
            }
            return;
          }

          console.log("Successfully updated attended events in DB.");
          // State is already updated from optimistic update

      } catch (error) {
           console.error('Unexpected error updating profile:', error);
           // Revert optimistic update
           set({ attendedEventIds: currentIds });
           if (typeof window !== 'undefined') {
             alert(`An unexpected error occurred while saving attendance.`);
           }
      }
    },
  };
});

// Note: The initialization (`initializeAuthListener`) needs to be called 
// from a client component, typically in a top-level layout or provider,
// using useEffect.