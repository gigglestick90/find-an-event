import { create } from 'zustand';
import { createClient } from '@/utils/supabase/client'; // Import Supabase client-side utility
import { type User } from '@supabase/supabase-js'; // Import User type

// Define the categories type plus 'All'
export type Category = 'All' | 'Restaurant' | 'Hiking' | 'Games' | 'Museum' | 'Sports' | 'Shopping' | 'Park' | 'Entertainment';

// Define the combined state structure and actions
interface AppState {
  // Filter state
  selectedCategory: Category;
  setSelectedCategory: (category: Category) => void;

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
    setSelectedCategory: (category: Category) => set({ selectedCategory: category }),

    // --- Auth & Profile State ---
    user: null, // Initial user state
    attendedEventIds: [], // Initial attended events
    loadingProfile: true, // Start in loading state

    // --- Actions ---
    initializeAuthListener: () => {
      console.log("Setting up Supabase auth listener...");
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        const currentUser = session?.user ?? null;
        // Call setUserAndProfile whenever auth state changes
        await get().setUserAndProfile(currentUser); 
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
        // Optionally: trigger a login prompt or redirect
        return; 
      }

      const isAttended = currentIds.includes(id);
      const newIds = isAttended
        ? currentIds.filter((eventId) => eventId !== id)
        : [...currentIds, id];

      // 1. Optimistically update local state for better UX (optional)
      // set({ attendedEventIds: newIds }); 

      // 2. Update the database
      console.log(`Updating profile for user ${user.id} with attended IDs:`, newIds);
      try {
          const { error } = await supabase
            .from('profiles')
            .update({ attended_event_ids: newIds, updated_at: new Date().toISOString() })
            .eq('id', user.id);

          if (error) {
            console.error('Error updating attended events in DB:', error);
            // Optional: Revert optimistic update if it failed
            // set({ attendedEventIds: currentIds }); 
            // Optional: Show error to user
            alert(`Error saving attendance: ${error.message}`);
            return; // Stop if DB update failed
          }

          // 3. If DB update succeeds, *ensure* local state matches
          // (If not doing optimistic update, set state here)
          console.log("Successfully updated attended events in DB.");
          set({ attendedEventIds: newIds }); 

      } catch (error) {
           console.error('Unexpected error updating profile:', error);
           // Optional: Revert optimistic update
           // set({ attendedEventIds: currentIds }); 
           alert(`An unexpected error occurred while saving attendance.`);
      }
    },
  };
});

// Note: The initialization (`initializeAuthListener`) needs to be called 
// from a client component, typically in a top-level layout or provider,
// using useEffect.