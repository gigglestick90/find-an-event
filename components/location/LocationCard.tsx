// components/location/LocationCard.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LocationData } from "@/data/locations";
import { useAppStore } from "@/lib/store";
import React from "react";
import { cn } from "@/lib/utils"; // Import the cn utility

// Define props for the component
interface LocationCardProps {
  location: LocationData;
  onShowDetails: () => void;
}

// The LocationCard component
export default function LocationCard({ location, onShowDetails }: LocationCardProps) {
  // Get state and actions from the Zustand store
  const attendedEventIds = useAppStore((state) => state.attendedEventIds);
  const toggleAttendedEvent = useAppStore((state) => state.toggleAttendedEvent);

  // Check if the current location is marked as attended
  const isAttended = attendedEventIds.includes(location.id);

  // Handler for the attend button click
  const handleAttendClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // IMPORTANT: Prevent the Card's onClick from firing
    toggleAttendedEvent(location.id);
  };

  return (
    <Card
      // Apply conditional styling for attended events using cn
      className={cn(
        "w-[300px] shadow-md hover:shadow-lg transition-shadow cursor-pointer flex flex-col justify-between h-full",
        isAttended && "opacity-60 bg-muted/50" // Apply reduced opacity and slight grey background if attended
      )}
      onClick={onShowDetails}
      aria-live="polite" // Announce changes for screen readers
    >
      <div> {/* Wrap Header and Content */}
        <CardHeader>
          <CardTitle>{location.name}</CardTitle>
          <CardDescription>
            {location.neighborhood || `Coords: ${location.coordinates.lat.toFixed(4)}, ${location.coordinates.lng.toFixed(4)}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground min-h-[40px]">
            {location.description || "No description available."}
          </p>
        </CardContent>
      </div>
      <CardFooter className="flex justify-between items-center pt-4 border-t mt-auto">
        <Badge variant="outline">{location.category}</Badge>
        <Button
          variant={isAttended ? "secondary" : "outline"}
          size="sm"
          onClick={handleAttendClick}
          aria-label={isAttended ? `Mark ${location.name} as not attended` : `Mark ${location.name} as attended`}
          // Optionally disable the button slightly if attended, though toggling might still be desired
          // className={cn(isAttended && "opacity-80")}
        >
          {isAttended ? "Attended ✓" : "Mark Attended"}
        </Button>
      </CardFooter>
    </Card>
  );
}