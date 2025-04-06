"use client";

import { useAppStore } from "@/lib/store";
import { useEffect } from "react";

/**
 * StoreInitializer component
 * 
 * This component initializes the Zustand store's auth listener
 * and ensures it's only done once at the app root level.
 * It should be placed in the root layout component.
 */
export default function StoreInitializer() {
  useEffect(() => {
    // Initialize the auth listener and get the cleanup function
    const unsubscribe = useAppStore.getState().initializeAuthListener();
    
    // Clean up the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []); // Empty dependency array ensures this runs once on mount

  // This component doesn't render anything
  return null;
}