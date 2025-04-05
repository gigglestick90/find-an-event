// components/layout/Sidebar.tsx
    "use client"; // Client component is needed for hooks and store interaction

    import React from 'react'; // No longer need useState
    import { Button } from "@/components/ui/button";
    import { useAppStore, Category } from '@/lib/store'; // Import UPDATED store and Category type

    // Define the categories
    // Use the Category type for the list
    const categories: Category[] = ["All", "Restaurant", "Hiking", "Games", "Museum", "Sports", "Shopping", "Park", "Entertainment"];

    // Define the props if the sidebar needs to communicate outwards (optional for now)
    // interface SidebarProps {
    //   onSelectCategory: (category: string) => void;
    // }

    // Simple Sidebar component
    export default function Sidebar() {
      // Get state and action from the store using the UPDATED hook name
      const selectedCategory = useAppStore((state) => state.selectedCategory);
      const setSelectedCategory = useAppStore((state) => state.setSelectedCategory);

      // No need for local handleCategoryClick function anymore
      // We'll call the store's action directly in onClick

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
          {/* You can add more navigation or filters here later */}
        </div>
      );
    }