// components/map/MapDisplay.tsx
"use client"; // Map components often need to be client components

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import L from 'leaflet'; // Import Leaflet library

// Icon paths are now relative to the 'public' directory
// No need to import them directly

// --- FIX START ---
// Fix Leaflet's default icon path issue with build tools like Webpack/Next.js
// See: https://github.com/PaulLeCam/react-leaflet/issues/453#issuecomment-410450387
// And: https://github.com/Leaflet/Leaflet/issues/4968#issuecomment-278078878
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/images/marker-icon-2x.png', // Path relative to public folder
    iconUrl: '/images/marker-icon.png',         // Path relative to public folder
    shadowUrl: '/images/marker-shadow.png',     // Path relative to public folder
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});
// --- FIX END ---

import { LocationData } from '@/data/locations'; // Import the correct type

// Props definition using the imported type
interface MapDisplayProps {
    locations: LocationData[]; // Array of locations to display
}

// Pittsburgh coordinates (approx center)
const pittsburghCoords: L.LatLngExpression = [40.4406, -79.9959]; // Use LatLngExpression type

export default function MapDisplay({ locations }: MapDisplayProps) {
    // Ensure this component only renders on the client side where 'window' is available
    if (typeof window === 'undefined') {
        // You could return a placeholder or loading skeleton here
        return <div style={{ height: '100%', width: '100%', background: '#e0e0e0' }}>Loading map...</div>;
    }

    // Default icon options are set globally above, no need to create a specific instance here.
    return (
        <MapContainer
            center={pittsburghCoords}
            zoom={12}
            style={{ height: '100%', width: '100%' }} // Ensure container has dimensions
            scrollWheelZoom={true} // Enable scroll wheel zoom
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {locations.map(location => (
                <Marker
                    key={location.id}
                    position={[location.coordinates.lat, location.coordinates.lng]}
                    // No explicit icon prop needed; defaults will be used.
                >
                    <Popup>
                        <b>{location.name}</b><br />
                        Category: {location.category}<br />
                        {location.description && <>{location.description}<br /></>}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}