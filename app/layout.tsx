import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils"; // Import cn utility
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"; // Import Resizable components
import Sidebar from "@/components/layout/Sidebar"; // Import Sidebar
import Header from "@/components/layout/Header"; // Import Header
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
// import StoreInitializer from '@/components/layout/StoreInitializer'; // Remove initializer import
import { createClient } from '@/utils/supabase/server'; // Re-add server client import

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Find an Event - Pittsburgh", // Updated title
  description: "Discover restaurants, hiking, and games in Pittsburgh", // Updated description
};

// Make the layout async to fetch user data
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Re-fetch user here to pass as prop
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn( // Use cn for class management
          "min-h-screen bg-background font-sans antialiased flex flex-col", // Add flex flex-col
          geistSans.variable // Keep the font variable
          // geistMono.variable // Removed mono font for now unless needed
        )}
      >
        {/* Remove store initializer component */}
        {/* <StoreInitializer /> */}
        {/* Add Header - Pass user data */}
        {/* Pass user prop back to Header */}
        <Header user={user} />

        {/* Resizable Layout - Let it grow to fill space */}
        <ResizablePanelGroup
          direction="horizontal"
          className="flex-1 border overflow-hidden" // Add overflow-hidden to prevent body scroll
        >
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="hidden md:block"> {/* Hide on mobile */}
            {/* Sidebar Area */}
            {/* Pass user prop back to Sidebar (will fix Sidebar component next) */}
            <Sidebar user={user} />
            {/* Removed duplicate Sidebar instance */}
          </ResizablePanel>
          <ResizableHandle withHandle className="hidden md:flex" /> {/* Keep hidden on mobile */}
          <ResizablePanel defaultSize={80} className="flex flex-col"> {/* Remove h-full here */}
            {/* Main Content Area */}
            {/* Apply flex-1 to children wrapper if needed */}
            {children}
          </ResizablePanel>
        </ResizablePanelGroup>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
