'use client';

import dynamic from 'next/dynamic';

// Leaflet touches `window` on import, so it can only load in the browser.
const MapView = dynamic(() => import('./MapView'), { ssr: false });

const locations = [
  { name: 'Hale Eddy, NY', route: '/haleeddy', lat: 42.0, lng: -75.38 },
  { name: 'Callicoon, NY', route: '/callicoon', lat: 41.76, lng: -75.05 },
  { name: 'Barryville, NY', route: '/barryville', lat: 41.47, lng: -74.91 },
  { name: 'Port Jervis, NY', route: '/portjervis', lat: 41.37, lng: -74.69 },
  { name: 'Montague, NJ', route: '/montague', lat: 41.29, lng: -74.78 },
];

export default function LocationsMap() {
  return (
    <div className="h-[calc(100vh-14rem)] min-h-96 overflow-hidden rounded-xl border border-slate-200 shadow-sm">
      <MapView locations={locations} center={[41.47, -74.91]} zoom={9} />
    </div>
  );
}
