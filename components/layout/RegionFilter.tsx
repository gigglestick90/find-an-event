"use client";

import React from 'react';
import { useAppStore } from '@/lib/store';
import { allLocations, Region } from '@/data/locations';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useIsMobile } from '@/hooks/use-mobile'; // Assuming you have this hook

// Get unique regions including 'All'
const regions: (Region | 'All')[] = [
  'All',
  ...Array.from(new Set(allLocations.map(loc => loc.region))).sort() // Sort regions alphabetically
];

export default function RegionFilter() {
  const isMobile = useIsMobile();
  const selectedRegion = useAppStore((state) => state.selectedRegion);
  const setSelectedRegion = useAppStore((state) => state.setSelectedRegion);

  if (isMobile) {
    return (
      <div className="w-full px-4"> {/* Add padding for mobile select */}
        <Select
          value={selectedRegion}
          onValueChange={(value: string) => setSelectedRegion(value as Region | 'All')}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Region" />
          </SelectTrigger>
          <SelectContent>
            {regions.map(region => (
              <SelectItem key={region} value={region}>
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  // Desktop View
  return (
    <div className="flex items-center justify-center flex-wrap gap-x-1 gap-y-2 px-4"> {/* Allow wrapping and add padding */}
      {regions.map((region, index) => (
        <React.Fragment key={region}>
          <Button
            variant={selectedRegion === region ? "default" : "ghost"}
            size="sm"
            className={cn(
              "h-8 px-3 rounded-md transition-colors", // Consistent styling
              selectedRegion !== region && "text-muted-foreground hover:bg-accent hover:text-accent-foreground" // Style for non-selected
            )}
            onClick={() => setSelectedRegion(region)}
          >
            {region}
          </Button>
          {index < regions.length - 1 && (
            <span className="text-muted-foreground mx-1">|</span> // Separator
          )}
        </React.Fragment>
      ))}
    </div>
  );
}