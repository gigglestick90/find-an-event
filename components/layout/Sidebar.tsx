// components/layout/Sidebar.tsx
"use client"; // Client component is needed for hooks and store interaction
import React from 'react'; // Remove unused imports
import { Button } from "@/components/ui/button";
import { useAppStore, Category } from '@/lib/store'; // Keep store hook for categories
import { type User } from '@supabase/supabase-js'; // Keep User type
import { useIsMobile } from '@/hooks/use-mobile';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Region } from '@/data/locations';
// Define the specific order for regions
const regions: (Region | 'All')[] = [
    'All',
    'City of Pittsburgh',
    'East Suburbs / East',
    'North Hills / North',
    'South Hills / South',
    'Airport Area / West'
];

// Define the categories
// Use the Category type for the list
const categories: Category[] = ["All", "Restaurant", "Hiking", "Games", "Museum", "Sports", "Shopping", "Park", "Entertainment"];

    // Define props for the Sidebar - Add user prop back
    interface SidebarProps {
       user: User | null; // User object from Supabase, or null if not logged in
    }

    // Simple Sidebar component
    export default function Sidebar({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      user
    }: SidebarProps) {
      // We're keeping the user-related code for future use but not using it currently
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const storeUser = useAppStore(state => state.user);
      // No need to create currentUser variable since we're not using it
      
      // Get state from store
      const selectedCategory = useAppStore((state) => state.selectedCategory);
      const setSelectedCategory = useAppStore((state) => state.setSelectedCategory);
      const selectedRegion = useAppStore((state) => state.selectedRegion);
      const setSelectedRegion = useAppStore((state) => state.setSelectedRegion);
      
      // Check if on mobile device
      const isMobile = useIsMobile();

      // Component logic uses local 'user' state if needed, and store state for categories
      return (
        <div className="flex flex-col space-y-2 p-4 h-full w-full bg-muted/40 border-r"> {/* Added border */}
          <h2 className="text-lg font-semibold mb-4 px-2">Categories</h2> {/* Added padding */}
          
          {/* Mobile-only Region Filter */}
          {isMobile && (
            <div className="mb-6 relative">
              <h3 className="text-sm font-medium mb-2 px-2">Filter by Region</h3>
              <div className="relative z-50">
                <Select
                  defaultValue={selectedRegion}
                  value={selectedRegion}
                  onValueChange={(value) => {
                    // Explicitly cast the value and update only the region
                    setSelectedRegion(value as Region | 'All');
                  }}
                >
                  <SelectTrigger className="w-full bg-background border-input hover:bg-accent hover:text-accent-foreground">
                    <SelectValue placeholder="Select Region">
                      {selectedRegion}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    className="z-[100] min-w-[200px]"
                    sideOffset={4}
                  >
                    {regions.map(region => (
                      <SelectItem
                        key={region}
                        value={region}
                        className="cursor-pointer hover:bg-accent"
                      >
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "secondary" : "ghost"}
              className="w-full justify-start"
              // Ensure we only update the category and don't affect the region
              onClick={() => {
                // Only update the category, preserving the current region selection
                setSelectedCategory(category);
              }}
            >
              {category}
            </Button>
          ))}
          {/* Auth Section Removed - Handled by Header */}
          {/* We could potentially add user info here later if needed, reading from the 'user' variable above */}
        </div>
      );
    }