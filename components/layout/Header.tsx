// components/layout/Header.tsx
"use client"; // Needed for client-side interaction like linking, forms, and state hooks
import React, { useState, useEffect } from 'react'; // Need state and effect
import { Button } from "@/components/ui/button";
import { type User } from '@supabase/supabase-js'; // Keep User type
import { createClient } from '@/utils/supabase/client'; // Need client-side Supabase client
import Link from 'next/link';
import { signout } from '@/app/auth/signout/actions'; // Keep signout action
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // Keep Sheet components
import { MenuIcon, MapPinIcon } from 'lucide-react'; // Keep icons
import Sidebar from './Sidebar'; // Keep Sidebar import

// Define props for the Header, accepting the initial user state
interface HeaderProps {
  user: User | null;
}

export default function Header({ user: initialUser }: HeaderProps) { // Accept prop
  // Local state for user, initialized by the prop passed from layout
  const [user, setUser] = useState<User | null>(initialUser);

  useEffect(() => {
    // Initialize Supabase client on the client-side
    const supabase = createClient();

    // Listen for changes to authentication state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const currentUser = session?.user ?? null;
        // Update local user state on SIGNED_IN, SIGNED_OUT,
        // or INITIAL_SESSION *if* a user exists in the session.
        if (event === 'SIGNED_IN') {
          console.log("Header detected SIGNED_IN, setting user:", currentUser?.id);
          setUser(currentUser);
        } else if (event === 'SIGNED_OUT') {
          console.log("Header detected SIGNED_OUT, setting user to null");
          setUser(null);
        } else if (event === 'INITIAL_SESSION' && currentUser) {
          // Handle case where initial session check finds a user
          // (might happen after redirect/cookie propagation)
          console.log("Header detected INITIAL_SESSION with user, setting user:", currentUser?.id);
          setUser(currentUser);
        } else {
          // Optionally log other events like USER_UPDATED, PASSWORD_RECOVERY etc.
           console.log("Header received other auth event:", event, currentUser?.id);
        }
      }
    );

    // Cleanup subscription on component unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []); // Empty dependency array ensures this runs once on mount

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
            <SheetContent side="left" className="p-0 w-72">
              {/* Render Sidebar content inside the sheet - Pass user prop */}
              {/* Pass the local user state to the Sidebar */}
              <Sidebar user={user} />
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
          {user ? (
            <>
              <span className="text-sm font-medium hidden sm:inline" title={user.email ?? 'User'}>
                {user.email}
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