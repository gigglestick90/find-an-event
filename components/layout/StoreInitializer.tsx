"use client";

import { useAppStore } from "@/lib/store";
import { useEffect } from "react";
import { type User } from '@supabase/supabase-js';

/**
 * StoreInitializer component
 *
 * This component initializes the Zustand store's auth listener
 * and ensures it's only done once at the app root level.
 * It should be placed in the root layout component.
 *
 * It also accepts the server-side user data as a prop to ensure
 * the client-side store is immediately synchronized with the server state.
 */
export default function StoreInitializer({ serverUser }: { serverUser: User | null }) {
  useEffect(() => {
    // First, immediately set the user in the store from server data
    // This ensures the store has the correct user state before any client interactions
    if (serverUser) {
      console.log("Initializing store with server user data:", serverUser.id);
      useAppStore.getState().setUserAndProfile(serverUser);
    }
    
    // Then initialize the auth listener and get the cleanup function
    console.log("Initializing auth listener in StoreInitializer");
    const unsubscribe = useAppStore.getState().initializeAuthListener();
    
    // Clean up the listener when the component unmounts
    return () => {
      console.log("Cleaning up auth listener in StoreInitializer");
      unsubscribe();
    };
  }, [serverUser]); // Add serverUser as a dependency

  // This component doesn't render anything
  return null;
}