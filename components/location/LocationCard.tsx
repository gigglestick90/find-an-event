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
import React, { useState } from "react"; // Import useState
import { Navigation } from 'lucide-react'; // Import the Navigation icon
import { cn } from "@/lib/utils"; // Import the cn utility

// Define props for the component
interface LocationCardProps {
  location: LocationData;
  onShowDetails: () => void;
  className?: string; // Add optional className prop
}

// The LocationCard component
export default function LocationCard({ location, onShowDetails, className }: LocationCardProps) { // Destructure className
  // Get state and actions from the Zustand store
  const attendedEventIds = useAppStore((state) => state.attendedEventIds);
  const toggleAttendedEvent = useAppStore((state) => state.toggleAttendedEvent); // Now async
  const user = useAppStore((state) => state.user); // Get user state to potentially disable button if not logged in
  const [loading, setLoading] = useState(false); // Add loading state for the button

  // Check if the current location is marked as attended
  const isAttended = attendedEventIds.includes(location.id);

  // Handler for the attend button click
  // Make the handler async
  const handleAttendClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // IMPORTANT: Prevent the Card's onClick from firing
    // Use both stopPropagation and preventDefault for maximum isolation
    e.stopPropagation();
    e.preventDefault();

    // Log to verify the handler is being called
    console.log("Mark attended button clicked for:", location.name);

    if (!user) {
      // Optionally redirect to login or show a message if user isn't logged in
      alert("Please log in to mark events as attended.");
      return;
    }

    setLoading(true); // Set loading state
    try {
      await toggleAttendedEvent(location.id); // Await the async action
    } catch (error) {
      // Error handling is mostly done in the store, but you could add component-specific feedback here
      console.error("Error toggling attended event from card:", error);
    } finally {
      setLoading(false); // Reset loading state regardless of success/failure
    }
  };

  return (
    <Card
      // Apply conditional styling for attended events using cn
      // Merge incoming className with existing classes
      className={cn(
        "w-[300px] shadow-md hover:shadow-lg transition-shadow flex flex-col justify-between h-full",
        isAttended && "opacity-60 bg-muted/50", // Apply reduced opacity and slight grey background if attended
        className // Apply the passed className
      )}
      // Remove onClick from the Card itself
      aria-live="polite" // Announce changes for screen readers
    >
      {/* Clickable area for card details */}
      <div
        className="cursor-pointer flex-1"
        onClick={onShowDetails}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onShowDetails()}
        aria-label={`Show details for ${location.name}`}
      >
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
      {/* Non-clickable footer with buttons */}
      <CardFooter className="flex justify-between items-center pt-4 border-t mt-auto gap-2 pointer-events-auto">
        <Badge variant="outline">{location.category}</Badge>
        <div className="flex items-center gap-2 card-footer-buttons">
          {/* Maps button */}
          <Button
            variant="ghost"
            size="icon"
            asChild
          >
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.name + ", Pittsburgh, PA")}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Get directions to ${location.name}`}
              title="Get Directions"
              onClick={(e) => e.stopPropagation()} // Stop propagation here
            >
              <Navigation className="h-4 w-4" />
            </a>
          </Button>
          
          {/* Attend button - completely separate from card click */}
          <Button
            variant={isAttended ? "secondary" : "outline"}
            size="sm"
            onClick={handleAttendClick}
            tabIndex={0}
            aria-label={isAttended ? `Mark ${location.name} as not attended` : `Mark ${location.name} as attended`}
            disabled={loading || !user}
            title={!user ? "Log in to mark attendance" : undefined}
            // Make button more prominent and clearly separate
            className="font-medium relative z-50 hover:z-50 focus:z-50"
          >
            {loading ? "Saving..." : (isAttended ? "Attended ✓" : "Mark Attended")}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}