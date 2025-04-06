# Find an Event - Codebase Integration Guide

## 1. Introduction

Welcome to the Find an Event codebase! This application helps users discover events and locations (restaurants, hiking trails, games, etc.) in Pittsburgh. It's built using:

*   **Framework:** Next.js (App Router)
*   **UI Library:** ShadCN UI (built on Radix UI and Tailwind CSS)
*   **State Management:** Zustand
*   **Mapping:** React Leaflet
*   **Language:** TypeScript

This guide serves as a reference for developers integrating new features or modifying existing ones, ensuring consistency and adherence to established patterns.

## 2. Core Concepts & Architecture

### 2.1. Next.js App Router

The application utilizes the Next.js App Router paradigm. All routes, pages, and layouts are defined within the `app/` directory.

*   **Root Layout (`app/layout.tsx`):** Defines the main HTML structure, includes global styles (`app/globals.css`), sets up fonts (Geist Sans), and establishes the primary page layout using ShadCN's `ResizablePanelGroup`. It renders the `Sidebar` component in the left panel and the main page content (`children`) in the right panel.
*   **Main Page (`app/page.tsx`):** This is the entry point for the main user interface. It's a **Client Component** (`"use client"`) because it manages state, uses hooks, and interacts with the map component. It handles toggling between the Map view and List view, fetches state from the Zustand store, filters location data, and renders the appropriate components.

### 2.2. UI Library: ShadCN UI

We leverage ShadCN UI for our component library.

*   **Location:** Components are typically added via the ShadCN CLI and reside in `components/ui/`.
*   **Usage:** Import components directly from their path (e.g., `import { Button } from "@/components/ui/button";`).
*   **Composition:** ShadCN components are designed to be composed together to build complex UIs.

### 2.3. Styling: Tailwind CSS

Styling is primarily handled using Tailwind CSS.

*   **Global Styles (`app/globals.css`):** Contains base Tailwind directives and any global custom styles.
*   **Utility Classes:** Components are styled using Tailwind utility classes directly in the `className` prop.
*   **`cn` Utility (`lib/utils.ts`):** This helper function combines `clsx` and `tailwind-merge`. **Always use `cn`** when applying conditional or combined classes to ensure proper merging and avoid style conflicts.
    ```typescript
    import { cn } from "@/lib/utils";

    // Example usage in a component
    <div className={cn("p-4 border", isActive && "bg-blue-100", className)}>
      Content
    </div>
    ```

### 2.4. Analytics
*   **Speed Insights (`@vercel/speed-insights/next`):** Speed Insights gathered from Vercel in layout.tsx. Speed Insights added before closing body.
*   **Analytics (`@vercel/analytics/next`):** Analytics gathered from Vercel in layout.tsx. Analytics added before closing body.

## 3. File Structure Conventions

Adhere to the following structure for consistency:

*   `app/`: Next.js App Router files (layouts, pages, loading states, error boundaries).
    *   `layout.tsx`: Root layout for the application.
    *   `page.tsx`: The main page component for the root route.
    *   `globals.css`: Global CSS styles.
*   `components/`: Reusable React components.
    *   `layout/`: Components specific to the overall page structure (e.g., `Sidebar.tsx`).
    *   `location/`: Components related to displaying location information (e.g., `LocationCard.tsx`).
    *   `map/`: Components related to the map display (e.g., `MapDisplay.tsx`).
    *   `ui/`: ShadCN UI components (managed by the CLI, generally not manually edited unless customizing).
*   `data/`: Static data sources and type definitions.
    *   `locations.ts`: Defines the `LocationData` interface and exports the `allLocations` array.
*   `hooks/`: Custom React hooks.
    *   `use-mobile.ts`: Example hook for detecting mobile viewports.
*   `lib/`: Core logic, utility functions, and state management setup.
    *   `utils.ts`: Contains utility functions like `cn`.
    *   `store.ts`: Zustand store definition and hooks.
*   `public/`: Static assets (images, icons, etc.) accessible directly via URL.

## 4. State Management (Zustand)

Global application state is managed using Zustand.

*   **Store Definition (`lib/store.ts`):** Defines the state shape (`AppState` interface), initial state, and actions.
*   **Hook (`useAppStore`):** Exported from `lib/store.ts`. Use this hook in components to access state and actions.
*   **State Slices:**
    *   `selectedCategory`: Stores the currently selected category filter (`'All'`, `'Restaurant'`, etc.).
    *   `attendedEventIds`: An array of strings holding the IDs of locations marked as attended.
*   **Actions:**
    *   `setSelectedCategory(category: Category)`: Updates the selected category.
    *   `initializeAttended()`: Loads attended IDs from `localStorage` (must be called client-side, e.g., in `useEffect`).
    *   `toggleAttendedEvent(id: string)`: Adds or removes an ID from `attendedEventIds` and updates `localStorage`.
*   **Persistence:** `attendedEventIds` are persisted in `localStorage` under the key `attendedEvents`. The store handles loading and saving automatically within its actions (client-side only).
*   **Usage Example (in a Client Component):**
    ```typescript
    "use client";

    import { useAppStore } from '@/lib/store';
    import { useEffect } from 'react';

    function MyComponent() {
      // Select specific state parts
      const selectedCategory = useAppStore((state) => state.selectedCategory);
      const attendedEventIds = useAppStore((state) => state.attendedEventIds);

      // Get actions
      const setSelectedCategory = useAppStore((state) => state.setSelectedCategory);
      const toggleAttendedEvent = useAppStore((state) => state.toggleAttendedEvent);

      // Initialize state from localStorage on mount
      useEffect(() => {
        useAppStore.getState().initializeAttended();
      }, []);

      const handleCategoryChange = (newCategory) => {
        setSelectedCategory(newCategory);
      };

      const handleAttendToggle = (eventId) => {
        toggleAttendedEvent(eventId);
      };

      // ... render logic using state and actions
    }
    ```

## 5. Data Handling

Currently, location data is static.

*   **Source:** `data/locations.ts` exports the `allLocations` array.
*   **Structure:** Data adheres to the `LocationData` interface defined in the same file.
    ```typescript
    export interface LocationData {
      id: string;
      name: string;
      category: 'Restaurant' | 'Hiking' | 'Games' | /* ...other categories */;
      coordinates: { lat: number; lng: number };
      description?: string;
      neighborhood?: string;
      website?: string;
    }
    ```
*   **Integration:** Components import `allLocations` and the `LocationData` type directly. Filtering happens client-side within components (e.g., `app/page.tsx`) using `useMemo`.

*(Future Considerations: If integrating an API, data fetching logic (e.g., using `fetch`, SWR, or React Query) would likely reside in service functions or potentially within Server Components/Route Handlers, depending on the approach.)*

## 6. Key Components & Usage Patterns

*   **`components/layout/Sidebar.tsx`:**
    *   Displays category buttons.
    *   Reads `selectedCategory` from `useAppStore`.
    *   Calls `setSelectedCategory` action on button click.
*   **`components/location/LocationCard.tsx`:**
    *   Displays details for a single `LocationData` object.
    *   Reads `attendedEventIds` from `useAppStore` to determine attended status.
    *   Calls `toggleAttendedEvent` action when the "Mark Attended" button is clicked.
    *   Calls the `onShowDetails` prop (passed from parent) when the card is clicked.
    *   Uses `cn` for conditional styling based on `isAttended`.
*   **`components/map/MapDisplay.tsx`:**
    *   Renders the Leaflet map.
    *   Receives an array of `locations` (filtered by the parent) as a prop.
    *   Maps `locations` to `Marker` components.
    *   Includes necessary Leaflet CSS and icon path fixes.
    *   **Important:** Dynamically imported in `app/page.tsx` with `ssr: false` as Leaflet relies on browser APIs.
*   **ShadCN UI Components (`components/ui/`):**
    *   Import directly, e.g., `import { Dialog, DialogContent, ... } from "@/components/ui/dialog";`.
    *   Follow ShadCN documentation for usage and props.

## 7. Standard Hooks & Utilities

*   **`useAppStore` (`lib/store.ts`):** Access global Zustand state and actions.
*   **`cn` (`lib/utils.ts`):** Combine and merge Tailwind CSS classes.
*   **React Hooks:** `useState`, `useEffect`, `useMemo`, `useCallback` as needed for component logic.
*   **`dynamic` (`next/dynamic`):** Use for importing components that should only run client-side (like `MapDisplay`).
    ```typescript
    import dynamic from 'next/dynamic';

    const MapDisplay = dynamic(() => import('@/components/map/MapDisplay'), {
      ssr: false,
      loading: () => <p>Loading Map...</p> // Optional loading component
    });
    ```
*   **`useIsMobile` (`hooks/use-mobile.ts`):** Detect if the viewport matches mobile dimensions (currently defined as < 768px).

## 8. Integration Guidelines & Code Patterns

### 8.1. Adding a New Filter (e.g., Filter by Neighborhood)

1.  **Update State (`lib/store.ts`):**
    *   Add `selectedNeighborhood: string | 'All'` to `AppState`.
    *   Add `setSelectedNeighborhood: (neighborhood: string | 'All') => void` action.
    *   Initialize `selectedNeighborhood: 'All'` in the store creation.
    *   Implement the `setSelectedNeighborhood` action: `set({ selectedNeighborhood: neighborhood })`.
2.  **Update UI (`components/layout/Sidebar.tsx` or a new component):**
    *   Add UI elements (e.g., a dropdown or list) to select a neighborhood.
    *   Get unique neighborhoods from `allLocations`.
    *   Read `selectedNeighborhood` from the store.
    *   Call `setSelectedNeighborhood` action on selection change.
3.  **Update Filtering Logic (`app/page.tsx`):**
    *   Read `selectedNeighborhood` from the store.
    *   Modify the `useMemo` hooks (`locationsForList`, `locationsForMap`) to include filtering by `selectedNeighborhood` if it's not `'All'`.
4.  **Update Data (`data/locations.ts`):**
    *   Ensure all relevant `LocationData` objects have the `neighborhood` property populated.

### 8.2. Adding New Location Data

1.  **Modify Interface (Optional):** If adding new fields (e.g., `openingHours`), update the `LocationData` interface in `data/locations.ts`.
2.  **Add Data:** Add the new location object(s) to the `allLocations` array in `data/locations.ts`, ensuring it conforms to the `LocationData` interface.
3.  **Update UI:** Modify components (`LocationCard.tsx`, `MapDisplay.tsx` Popup, Details Dialog in `app/page.tsx`) to display any new fields if necessary.

### 8.3. Creating a New Reusable Component

1.  **Location:** Place the new component file (e.g., `NewFeatureCard.tsx`) in the appropriate subdirectory under `components/` (e.g., `components/feature/`).
2.  **Client Component:** Add `"use client";` at the top if the component uses hooks, state, event listeners, or browser APIs.
3.  **UI:** Utilize ShadCN UI components (`@/components/ui/`) where possible for consistency.
4.  **Styling:** Use Tailwind CSS utility classes via the `cn` function.
5.  **State:** If global state is needed, import and use `useAppStore`. For local state, use `useState`.
6.  **Props:** Define clear `interface` for props.

## 9. Common Pitfalls & Anti-Patterns

*   **Forgetting `"use client"`:** Components using hooks (`useState`, `useEffect`, `useAppStore`), event handlers (`onClick`), or browser APIs (`localStorage`, `window`) **must** be Client Components. Forgetting this directive leads to errors.
*   **Direct DOM Manipulation:** Avoid accessing or manipulating the DOM directly. Use React state, props, and refs to manage UI updates.
*   **Not Using `cn`:** Manually concatenating class strings or using complex ternary operators for classes can lead to messy code and hard-to-debug Tailwind style conflicts. Always use `cn`.
*   **Mutating Zustand State Directly:** Never modify state retrieved from `useAppStore` directly. Always use the actions provided by the store (e.g., `setSelectedCategory(...)`).
*   **Blocking Event Propagation:** When nesting clickable elements (like the "Mark Attended" button inside the clickable `LocationCard`), use `event.stopPropagation()` in the inner element's handler to prevent the outer handler from firing unintentionally.
*   **Server-Side Rendering Issues:** Libraries like Leaflet rely on the `window` object. Ensure components using them are marked `"use client"` and ideally dynamically imported with `ssr: false`. Use `typeof window !== 'undefined'` checks before accessing browser-specific APIs if necessary.
*   **Inconsistent Data Structures:** Always ensure data conforms to the defined TypeScript interfaces (e.g., `LocationData`).
*   **Prop Drilling:** If state needs to be shared across multiple, non-adjacent components, use the Zustand store (`useAppStore`) instead of passing props down through many levels.
*   **Ignoring `localStorage` Errors:** Accessing `localStorage` can fail (e.g., private browsing, storage limits, corrupted data). Always wrap `localStorage.getItem/setItem` calls in `try...catch` blocks and include checks for `typeof window !== 'undefined'`. Handle potential `JSON.parse` errors.
*   **Mixing Concerns:** Keep components focused. Separate data fetching/transformation logic from pure UI rendering where practical. Use `useMemo` to optimize expensive calculations or filtering.
*   **Not Initializing Persisted State:** Remember to call initialization actions (like `initializeAttended`) in a `useEffect` hook (client-side) to load data from `localStorage` when the app starts.