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
import React, { useState } from "react";
import { Navigation, Star } from 'lucide-react'; // Import Navigation and Star icons
import { cn } from "@/lib/utils"; // Import the cn utility
import { createClient } from '@/utils/supabase/client'; // Import Supabase client
// Define props for the component
interface LocationCardProps {
  location: LocationData;
  onShowDetails: () => void;
  className?: string; // Add optional className prop
}

// Custom star rating component
const StarRating = ({ rating }: { rating: number }) => {
  // Calculate full and partial stars
  const fullStars = Math.floor(rating);
  const partialStar = rating % 1;
  const emptyStars = 5 - fullStars - (partialStar > 0 ? 1 : 0);

  return (
    <div className="flex items-center">
      <div className="flex">
        {/* Full stars */}
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        
        {/* Partial star */}
        {partialStar > 0 && (
          <div className="relative w-4 h-4">
            {/* Empty star as background */}
            <Star className="w-4 h-4 text-gray-300 absolute top-0 left-0" />
            {/* Filled star with clip-path for partial fill */}
            <div style={{ width: `${partialStar * 100}%`, overflow: 'hidden' }} className="absolute top-0 left-0 h-4">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        )}
        
        {/* Empty stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
        ))}
      </div>
      <span className="ml-2 text-xs text-muted-foreground">{rating.toFixed(1)}</span>
    </div>
  );
};

// The LocationCard component
export default function LocationCard({ location, onShowDetails, className }: LocationCardProps) { // Destructure className
  // Get state and actions from the Zustand store
  const attendedEventIds = useAppStore((state) => state.attendedEventIds);
  const toggleAttendedEvent = useAppStore((state) => state.toggleAttendedEvent); // Now async
  const user = useAppStore((state) => state.user); // Get user state to potentially disable button if not logged in
  const [loading, setLoading] = useState(false); // Add loading state for the button
  // Check if the current location is marked as attended
  const isAttended = attendedEventIds.includes(location.id);

  // Enhanced handler for the attend button click with better error handling
  const handleAttendClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // IMPORTANT: Prevent the Card's onClick from firing
    e.stopPropagation();
    
    // Log to verify the handler is being called
    console.log("Mark attended button clicked for:", location.name);
    
    // Check if we have a user in the store
    if (!user) {
      console.warn("User not found in store when attempting to mark attendance");
      
      // Try to get the Supabase client to check auth status directly
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getSession();
        
        if (data.session?.user) {
          console.log("Found valid session but store user state was null");
          // We have a valid session but the store doesn't have the user
          // This indicates a synchronization issue between server and client state
          
          // Continue with the toggle operation - the store's toggleAttendedEvent
          // function will handle re-checking auth and updating the store
        } else {
          // No valid session found
          alert("Please log in to mark events as attended.");
          return;
        }
      } catch (authError) {
        console.error("Error checking authentication:", authError);
        alert("There was a problem verifying your login status. Please try refreshing the page.");
        return;
      }
    }

    setLoading(true); // Set loading state
    try {
      await toggleAttendedEvent(location.id); // Await the async action
      // The toggleAttendedEvent function now handles all error cases internally
    } catch (error) {
      console.error("Error toggling attended event from card:", error);
      alert("There was a problem saving your attendance. Please try again.");
    } finally {
      setLoading(false); // Reset loading state regardless of success/failure
    }
  };


  return (
    <Card
      // Apply conditional styling for attended events using cn
      // Merge incoming className with existing classes
      className={cn(
        "w-[300px] shadow-md hover:shadow-lg transition-shadow cursor-pointer flex flex-col justify-between h-full",
        isAttended && "opacity-60 bg-muted/50", // Apply reduced opacity and slight grey background if attended
        className // Apply the passed className
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
        {/* Moved Rating Section - Placed after content, before footer */}
        {typeof location.googleRating === 'number' && (
          <div className="px-6 pb-4 pt-2"> {/* Add padding */}
            <StarRating rating={location.googleRating} />
          </div>
        )}
      </div>
      {/* Footer now only contains badge and buttons */}
      <CardFooter className="flex justify-between items-center pt-4 border-t mt-auto gap-2">
        <Badge variant="outline">{location.category}</Badge>
        <div className="flex items-center gap-2"> {/* Group buttons */}
          {/* Maps button with stopPropagation */}
          <Button variant="ghost" size="icon" asChild onClick={(e) => e.stopPropagation()}>
            <a
              // Use URL encoding for the location name and add city context
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.name + ", Pittsburgh, PA")}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Get directions to ${location.name}`}
              title="Get Directions" // Tooltip text
            >
              <Navigation className="h-4 w-4" />
            </a>
          </Button>
          
          {/* Simplified wrapper for the Attend button */}
          <div onClick={(e) => e.stopPropagation()} className="inline-block">
            <Button
              variant={isAttended ? "secondary" : "outline"}
              size="sm"
              onClick={handleAttendClick}
              aria-label={isAttended ? `Mark ${location.name} as not attended` : `Mark ${location.name} as attended`}
              disabled={loading} // Only disable button while loading, not based on user state
              title={!user ? "Log in to mark attendance" : undefined} // Keep tooltip for user information
            >
              {loading ? "Saving..." : (isAttended ? "Attended ✓" : "Mark Attended")}
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}