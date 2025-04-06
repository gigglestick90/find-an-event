// app/page.tsx
"use client"; // Make the page a client component for hooks and map interaction

import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import { allLocations, LocationData } from '@/data/locations'; // Import LocationData interface
import { useAppStore } from '@/lib/store';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"; // Keep for Map/List toggle
import LocationCard from '@/components/location/LocationCard';
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapIcon, ListIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"; // Keep for Dialog, add for filters
import { Skeleton } from "@/components/ui/skeleton";

// Dynamically import the MapDisplay component
const MapDisplay = dynamic(() => import('@/components/map/MapDisplay'), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />
});

// Define the Category type based on LocationData plus 'All'
type Category = LocationData['category'] | 'All';

export default function HomePage() {
  // State for view toggle
  const [currentView, setCurrentView] = useState<'map' | 'list'>('map');
  // State for detail dialog
  const [selectedLocationDetail, setSelectedLocationDetail] = useState<LocationData | null>(null);

  // Get state from store - auth state is now managed centrally
  const selectedCategory = useAppStore((state) => state.selectedCategory);
  const attendedEventIds = useAppStore((state) => state.attendedEventIds);
  // Remove unused user variable since we don't need it in this component

  // Filter locations for the LIST view (only by category)
  const locationsForList = useMemo(() => {
    if (selectedCategory === "All") {
      return allLocations;
    }
    return allLocations.filter((loc) => loc.category === selectedCategory);
  }, [selectedCategory]);

  // Filter locations for the MAP view (category AND not attended)
  const locationsForMap = useMemo(() => {
    return locationsForList.filter(loc => !attendedEventIds.includes(loc.id));
  }, [locationsForList, attendedEventIds]);

  // Memoize map component using the map-specific list
  const mapComponent = useMemo(() => <MapDisplay locations={locationsForMap} />, [locationsForMap]);

  // --- Get Unique Categories for Mobile Filters ---
  const categories = useMemo(() => {
    const uniqueCategories = new Set(allLocations.map(loc => loc.category));
    return ["All", ...Array.from(uniqueCategories)];
  }, []);

  // Get action from store
  const setSelectedCategory = useAppStore((state) => state.setSelectedCategory);

  // --- Handlers ---
  const handleShowDetails = (location: LocationData) => {
    setSelectedLocationDetail(location);
  };

  const handleCloseDetails = () => {
    setSelectedLocationDetail(null);
  };

  const handleViewChange = (value: string) => {
    if (value === 'map' || value === 'list') {
      setCurrentView(value);
    }
  };

  // --- Render Logic ---
  return (
    // Ensure this top-level div fills the height provided by the layout
    <div className="flex flex-col h-full w-full">

      {/* View Toggle - Add slight vertical padding and make sticky */}
      <div className="p-2 py-3 border-b flex justify-center bg-background/90 backdrop-blur-sm sticky top-0 z-10">
        <ToggleGroup
          type="single"
          value={currentView}
          onValueChange={handleViewChange}
          aria-label="View toggle"
          className="shadow-sm" // Add subtle shadow
        >
          <ToggleGroupItem value="map" aria-label="Map view" className="transition-colors hover:bg-accent hover:text-accent-foreground">
            <MapIcon className="h-4 w-4 mr-2" /> Map
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view" className="transition-colors hover:bg-accent hover:text-accent-foreground">
            <ListIcon className="h-4 w-4 mr-2" /> List
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Mobile Category Filters (Hidden on md and up) - Make sticky below toggle */}
      <div className="p-2 py-3 border-b flex justify-center flex-wrap gap-2 md:hidden bg-background/90 backdrop-blur-sm sticky top-[60px] z-10"> {/* Adjust top based on toggle height */}
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm" // Smaller buttons for mobile
            className="rounded-full h-8 w-auto px-3 transition-colors hover:bg-primary/10 shadow-sm" // Add hover effect and shadow
            onClick={() => setSelectedCategory(category as Category)} // Cast to the specific Category type
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Content Area (Map or List) - Ensure this takes remaining space */}
      <div className="flex-1 overflow-y-auto"> {/* Use flex-1 and allow vertical scroll */}
        {currentView === 'map' ? (
          // Ensure map container takes full height of its parent
          <div className="h-full w-full">
            {mapComponent} {/* Map uses locationsForMap */}
          </div>
        ) : (
          // Ensure ScrollArea takes full height for list view
          <ScrollArea className="h-full w-full p-4">
            {/* Use flex for centering on mobile, grid for larger screens */}
            <div className="flex flex-col items-center gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:items-stretch"> {/* Added xl breakpoint */}
              {locationsForList.length > 0 ? (
                 // List uses locationsForList
                locationsForList.map(location => (
                  <LocationCard
                    key={location.id}
                    location={location}
                    onShowDetails={() => handleShowDetails(location)}
                    // Add transition and hover effect
                    className="transition-transform duration-150 ease-in-out hover:scale-[1.02] hover:shadow-md"
                  />
                ))
              ) : (
                <p className="col-span-full text-center text-muted-foreground py-10">
                  No locations found{selectedCategory !== 'All' ? ` for "${selectedCategory}"` : ''}.
                </p>
              )}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog
        open={selectedLocationDetail !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            handleCloseDetails();
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          {selectedLocationDetail && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedLocationDetail?.name}</DialogTitle>
                <DialogDescription>
                  {selectedLocationDetail?.neighborhood
                    ? `${selectedLocationDetail?.category} - ${selectedLocationDetail?.neighborhood}`
                    : selectedLocationDetail?.category}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm text-muted-foreground">
                  {selectedLocationDetail?.description || "No description available."}
                </p>
                <p className="text-sm mt-2">
                  Coordinates: {selectedLocationDetail?.coordinates?.lat?.toFixed(5)}, {selectedLocationDetail?.coordinates?.lng?.toFixed(5)}
                </p>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
