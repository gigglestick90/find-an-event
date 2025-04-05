// lib/store.ts
import { create } from 'zustand';

// Define the categories type plus 'All'
export type Category = 'All' | 'Restaurant' | 'Hiking' | 'Games' | 'Museum' | 'Sports' | 'Shopping' | 'Park' | 'Entertainment';

// Define the combined state structure and actions
interface AppState {
  // Existing filter state
  selectedCategory: Category;
  setSelectedCategory: (category: Category) => void;

  // New state for attended events
  attendedEventIds: string[];
  initializeAttended: () => void; // Action to load from localStorage
  toggleAttendedEvent: (id: string) => void; // Action to add/remove event ID
}

// Key for localStorage
const ATTENDED_EVENTS_STORAGE_KEY = 'attendedEvents';

// Create the Zustand store
// Rename the hook for clarity as it now manages more than just filters
export const useAppStore = create<AppState>((set, get) => ({
  // --- Existing Filter State ---
  selectedCategory: 'All',
  setSelectedCategory: (category: Category) => set({ selectedCategory: category }),

  // --- New Attended Events State & Actions ---
  attendedEventIds: [], // Initial state (empty until initialized)

  initializeAttended: () => {
    // Ensure this runs only on the client-side
    if (typeof window !== 'undefined') {
      const storedIds = localStorage.getItem(ATTENDED_EVENTS_STORAGE_KEY);
      let initialIds: string[] = []; // Default to empty array

      if (storedIds) {
        try {
          const parsedIds = JSON.parse(storedIds);
          // Basic validation: check if it's an array of strings
          if (Array.isArray(parsedIds) && parsedIds.every((item: unknown): item is string => typeof item === 'string')) {
             initialIds = parsedIds;
          } else {
             console.error("Invalid data found in localStorage for attended events. Expected an array of strings. Clearing.");
             localStorage.removeItem(ATTENDED_EVENTS_STORAGE_KEY); // Clear invalid data
          }
        } catch (error) {
          console.error("Failed to parse attended events from localStorage. Clearing.", error);
          localStorage.removeItem(ATTENDED_EVENTS_STORAGE_KEY); // Clear corrupted data
        }
      }
      // Set the state after processing localStorage
      set({ attendedEventIds: initialIds });
    }
  },

  toggleAttendedEvent: (id: string) => {
    const currentIds = get().attendedEventIds;
    const isAttended = currentIds.includes(id);
    let newIds: string[];

    if (isAttended) {
      // Remove the id
      newIds = currentIds.filter((eventId: string) => eventId !== id);
    } else {
      // Add the id
      newIds = [...currentIds, id];
    }

    // Update state
    set({ attendedEventIds: newIds });

    // Update localStorage (only on client)
    if (typeof window !== 'undefined') {
       try {
         localStorage.setItem(ATTENDED_EVENTS_STORAGE_KEY, JSON.stringify(newIds));
       } catch (error) {
         console.error("Failed to save attended events to localStorage:", error);
         // Potentially notify user or implement fallback
       }
    }
  },
}));