// components/layout/Sidebar.tsx
"use client"; // Client component is needed for hooks and store interaction
import React from 'react'; // Remove unused imports
import { Button } from "@/components/ui/button";
import { useAppStore, Category } from '@/lib/store'; // Keep store hook for categories
import { type User } from '@supabase/supabase-js'; // Keep User type

// Define the categories
    // Use the Category type for the list
    const categories: Category[] = ["All", "Restaurant", "Hiking", "Games", "Museum", "Sports", "Shopping", "Park", "Entertainment"];

    // Define props for the Sidebar - Add user prop back
    interface SidebarProps {
       user: User | null; // User object from Supabase, or null if not logged in
    }

    // Simple Sidebar component
    export default function Sidebar({ user }: SidebarProps) {
      // Get user from store to ensure it's always up-to-date
      const storeUser = useAppStore(state => state.user);
      // Use the store user if available, otherwise fall back to the prop
      const currentUser = storeUser || user;
      
      // Get category state from store
      const selectedCategory = useAppStore((state) => state.selectedCategory);
      const setSelectedCategory = useAppStore((state) => state.setSelectedCategory);

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