import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils"; // Import cn utility
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"; // Import Resizable components
import Sidebar from "@/components/layout/Sidebar"; // Import Sidebar (will create next)

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Find an Event - Pittsburgh", // Updated title
  description: "Discover restaurants, hiking, and games in Pittsburgh", // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn( // Use cn for class management
          "min-h-screen bg-background font-sans antialiased", // Standard classes
          geistSans.variable // Keep the font variable
          // geistMono.variable // Removed mono font for now unless needed
        )}
      >
        {/* Resizable Layout */}
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-screen max-w-full rounded-lg border" // Basic styling
        >
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="hidden md:block"> {/* Hide on mobile */}
            {/* Sidebar Area */}
            <Sidebar /> {/* Use the Sidebar component */}
          </ResizablePanel>
          <ResizableHandle withHandle className="hidden md:flex" /> {/* Hide on mobile */}
          <ResizablePanel defaultSize={80} className="flex flex-col"> {/* Add flex-col to panel */}
            {/* Main Content Area - Pages render directly in the panel */}
            {/* Padding etc. should be handled by the page component (app/page.tsx) */}
            {children}
          </ResizablePanel>
        </ResizablePanelGroup>
      </body>
    </html>
  );
}
