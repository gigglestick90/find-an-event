// components/layout/Header.tsx
"use client"; // Needed for client-side interaction like linking, forms, and state hooks
import React from 'react';
import { Button } from "@/components/ui/button";
import { type User } from '@supabase/supabase-js';
import Link from 'next/link';
import { signout } from '@/app/auth/signout/actions';
import { useAppStore } from '@/lib/store';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon, MapPinIcon } from 'lucide-react';
import Sidebar from './Sidebar';
import { allLocations, Region } from '@/data/locations'; // Import Region and locations
import { cn } from "@/lib/utils"; // Import cn utility
// We won't import RegionFilter component, but reuse its logic for desktop

// Define props for the Header, accepting the initial user state
interface HeaderProps {
  user: User | null;
}

export default function Header({ user }: HeaderProps) {
  // Use the user prop directly from the store, which is now kept in sync
  // No need for local state or auth listener as it's handled by StoreInitializer
  
  // Get state and actions from store
  const storeUser = useAppStore(state => state.user);
  const selectedRegion = useAppStore((state) => state.selectedRegion);
  const setSelectedRegion = useAppStore((state) => state.setSelectedRegion);

  // Determine current user
  const currentUser = storeUser || user;

  // Define the specific order for regions
  const regions: (Region | 'All')[] = [
    'All',
    'City of Pittsburgh',
    'East Suburbs / East',
    'North Hills / North',
    'South Hills / South',
    'Airport Area / West'
  ]; // Removed trailing comma and dependency array

  // The rest of the component uses the local 'user' state
  return (
    // Add padding, subtle gradient, and shadow
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-b from-background via-background/95 to-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      {/* Use max-w-full to extend across the entire width */}
      <div className="w-full flex h-16 items-center px-4 sm:px-6 lg:px-8">
        {/* Mobile Sidebar Toggle */}
        <div className="md:hidden mr-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Toggle Sidebar</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 z-[100]">
              {/* Render Sidebar content inside the sheet - Pass user prop */}
              {/* Pass the local user state to the Sidebar */}
              <Sidebar user={currentUser} />
            </SheetContent>
          </Sheet>
        </div>

        {/* App Title & Region Filter (Desktop) */}
        <div className="hidden md:flex items-center space-x-2 flex-grow"> {/* Use flex-grow to push auth right */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0"> {/* Title part */}
            <MapPinIcon className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg">Find an Event</span>
          </Link>
          {/* Desktop Region Filter Buttons */}
          <div className="flex items-center justify-center flex-wrap gap-x-1 ml-4"> {/* Filter buttons part */}
            {regions.map((region, index) => (
              <React.Fragment key={region}>
                <Button
                  variant={selectedRegion === region ? "secondary" : "ghost"} // Use secondary for selected
                  size="sm"
                  className={cn(
                    "h-8 px-2 rounded-md transition-colors text-sm", // Smaller padding, text size
                    selectedRegion !== region && "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                  onClick={() => setSelectedRegion(region)}
                >
                  {region}
                </Button>
                {index < regions.length - 1 && (
                  <span className="text-muted-foreground mx-1">|</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Mobile App Title (Simpler) */}
        <div className="flex md:hidden items-center flex-grow"> {/* Title container for mobile */}
          <Link href="/" className="flex items-center space-x-2">
            <MapPinIcon className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg">Find an Event</span>
          </Link>
        </div>

        {/* Auth Section - Positioned at the far right edge of the screen */}
        <div className="flex-shrink-0 flex items-center space-x-2 ml-auto"> {/* Using ml-auto with full-width container */}
          {currentUser ? (
            <>
              <span className="text-sm font-medium hidden sm:inline" title={currentUser.email ?? 'User'}>
                {currentUser.email}
              </span>
              {/* Logout Button with client-side handler */}
              <Button
                onClick={async () => {
                  // First, clear the user in the client-side store
                  useAppStore.setState({ user: null, attendedEventIds: [] });
                  
                  // Then call the server action to complete the logout
                  await signout();
                }}
                variant="outline"
                size="sm"
                className="transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                Logout
              </Button>
            </>
          ) : (
            // Standard asChild pattern for Button with Link
            <Button asChild size="sm" variant="default">
              <Link href="/login">Login / Sign Up</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}