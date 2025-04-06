// components/layout/Sidebar.tsx
    "use client"; // Client component is needed for hooks and store interaction
import React, { useState, useEffect } from 'react'; // Re-add useState, useEffect
// import { useRouter } from 'next/navigation'; // Remove router
import { Button } from "@/components/ui/button";
import { useAppStore, Category } from '@/lib/store'; // Keep store hook for categories
import { type User } from '@supabase/supabase-js'; // Keep User type
import { createClient } from '@/utils/supabase/client'; // Keep only one import
// import { signout } from '@/app/auth/signout/actions'; // Signout action not used here

    // Define the categories
    // Use the Category type for the list
    const categories: Category[] = ["All", "Restaurant", "Hiking", "Games", "Museum", "Sports", "Shopping", "Park", "Entertainment"];

    // Define props for the Sidebar - Add user prop back
    interface SidebarProps {
       user: User | null; // User object from Supabase, or null if not logged in
    }

    // Simple Sidebar component
    // Update component signature to accept props
    export default function Sidebar({ user: initialUser }: SidebarProps) { // Accept prop again
      // Local state for user, initialized by the prop passed from layout
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_user, setUser] = useState<User | null>(initialUser); // Keep state for auth listener, disable lint rule for now
      // Get category state from store
      const selectedCategory = useAppStore((state) => state.selectedCategory);
      const setSelectedCategory = useAppStore((state) => state.setSelectedCategory);

      useEffect(() => {
        // Initialize Supabase client on the client-side
        const supabase = createClient();

        // Listen for changes to authentication state
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            const currentUser = session?.user ?? null;
            // Update local user state on SIGNED_IN, SIGNED_OUT,
            // or INITIAL_SESSION *if* a user exists in the session.
            if (event === 'SIGNED_IN') {
              console.log("Sidebar detected SIGNED_IN, setting user:", currentUser?.id);
              setUser(currentUser);
            } else if (event === 'SIGNED_OUT') {
              console.log("Sidebar detected SIGNED_OUT, setting user to null");
              setUser(null);
            } else if (event === 'INITIAL_SESSION' && currentUser) {
              // Handle case where initial session check finds a user
              console.log("Sidebar detected INITIAL_SESSION with user, setting user:", currentUser?.id);
              setUser(currentUser);
            } else {
              // Optionally log other events
              console.log("Sidebar received other auth event:", event, currentUser?.id);
            }
          }
        );

        // Cleanup subscription on component unmount
        return () => {
          subscription?.unsubscribe();
        };
      }, []); // Empty dependency array ensures this runs once on mount

      // Component logic uses local 'user' state if needed, and store state for categories
      return (
        <div className="flex flex-col space-y-2 p-4 h-full w-full bg-muted/40 border-r"> {/* Added border */}
          <h2 className="text-lg font-semibold mb-4 px-2">Categories</h2> {/* Added padding */}
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "secondary" : "ghost"}
              className="w-full justify-start"
              // Call the store's setter directly with the category
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
          {/* Auth Section Removed - Handled by Header */}
          {/* We could potentially add user info here later if needed, reading from the 'user' variable above */}
        </div>
      );
    }