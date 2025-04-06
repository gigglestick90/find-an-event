// components/layout/Header.tsx
"use client"; // Needed for client-side interaction like linking, forms, and state hooks
import React from 'react'; // Remove unused imports
import { Button } from "@/components/ui/button";
import { type User } from '@supabase/supabase-js'; // Keep User type
import { createClient } from '@/utils/supabase/client'; // Need client-side Supabase client
import Link from 'next/link';
import { signout } from '@/app/auth/signout/actions'; // Keep signout action
import { useAppStore } from '@/lib/store'; // Add store import
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // Keep Sheet components
import { MenuIcon, MapPinIcon } from 'lucide-react'; // Keep icons
import Sidebar from './Sidebar'; // Keep Sidebar import

// Define props for the Header, accepting the initial user state
interface HeaderProps {
  user: User | null;
}

export default function Header({ user }: HeaderProps) {
  // Use the user prop directly from the store, which is now kept in sync
  // No need for local state or auth listener as it's handled by StoreInitializer
  
  // Get user from store to ensure it's always up-to-date
  const storeUser = useAppStore(state => state.user);
  
  // Use the store user if available, otherwise fall back to the prop
  // This ensures we have the most up-to-date user state
  const currentUser = storeUser || user;

  // The rest of the component uses the local 'user' state
  return (
    // Add padding, subtle gradient, and shadow
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-b from-background via-background/95 to-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      {/* Use max-w-7xl for wider container on large screens, adjust height */}
      <div className="container flex h-16 items-center max-w-7xl px-4 sm:px-6 lg:px-8">
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

        {/* App Title/Logo - Add Pittsburgh emphasis */}
        <div className="flex items-center"> {/* Title container */}
          <Link href="/" className="flex items-center space-x-2">
            <MapPinIcon className="h-5 w-5 text-primary hidden sm:inline" /> {/* Added icon */}
            <span className="font-bold text-lg">Find an Event</span>
            <span className="text-muted-foreground text-lg hidden sm:inline">| Pittsburgh</span>
          </Link>
        </div>

        {/* Auth Section - Use ml-auto to push to the right */}
        <div className="ml-auto flex items-center space-x-2"> {/* This ml-auto should push this div right */}
          {currentUser ? (
            <>
              <span className="text-sm font-medium hidden sm:inline" title={currentUser.email ?? 'User'}>
                {currentUser.email}
              </span>
              {/* Logout Button using a form */}
              <form action={signout}>
                <Button type="submit" variant="outline" size="sm" className="transition-colors hover:bg-destructive/10 hover:text-destructive">
                  Logout
                </Button>
              </form>
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