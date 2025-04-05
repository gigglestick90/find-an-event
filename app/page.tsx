// app/page.tsx
"use client"; // Make the page a client component for hooks and map interaction

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { allLocations, LocationData } from '@/data/locations';
import { useAppStore } from '@/lib/store';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamically import the MapDisplay component
const MapDisplay = dynamic(() => import('@/components/map/MapDisplay'), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />
});

export default function HomePage() {
  // State for view toggle
  const [currentView, setCurrentView] = useState<'map' | 'list'>('map');
  // State for detail dialog
  const [selectedLocationDetail, setSelectedLocationDetail] = useState<LocationData | null>(null);

  // Get state from store
  const selectedCategory = useAppStore((state) => state.selectedCategory);
  const attendedEventIds = useAppStore((state) => state.attendedEventIds);

  // Initialize attended events from localStorage on mount
  useEffect(() => {
    useAppStore.getState().initializeAttended();
  }, []);

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
  }, [locationsForList, attendedEventIds]); // Depends on list and attended IDs

  // Memoize map component using the map-specific list
  const mapComponent = useMemo(() => <MapDisplay locations={locationsForMap} />, [locationsForMap]);

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
    <div className="flex flex-col h-full w-full">

      {/* View Toggle */}
      <div className="p-2 border-b flex justify-center">
        <ToggleGroup
          type="single"
          value={currentView}
          onValueChange={handleViewChange}
          aria-label="View toggle"
        >
          <ToggleGroupItem value="map" aria-label="Map view">
            <MapIcon className="h-4 w-4 mr-2" /> Map
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view">
            <ListIcon className="h-4 w-4 mr-2" /> List
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Content Area (Map or List) */}
      <div className="flex-grow overflow-hidden">
        {currentView === 'map' ? (
          <div className="h-full w-full">
            {mapComponent} {/* Map uses locationsForMap */}
          </div>
        ) : (
          <ScrollArea className="h-full w-full p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {locationsForList.length > 0 ? (
                 // List uses locationsForList
                locationsForList.map(location => (
                  <LocationCard
                    key={location.id}
                    location={location}
                    onShowDetails={() => handleShowDetails(location)}
                    // LocationCard itself will handle its attended state styling
                  />
                ))
              ) : (
                <p className="col-span-full text-center text-muted-foreground">
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
