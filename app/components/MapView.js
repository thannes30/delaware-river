'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import { useRouter } from 'next/navigation';

export default function MapView({ locations, center, zoom }) {
  const router = useRouter();

  return (
    <MapContainer center={center} zoom={zoom} className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((location) => (
        <CircleMarker
          key={location.name}
          center={[location.lat, location.lng]}
          radius={10}
          pathOptions={{ color: '#1a56db', fillColor: '#1a56db', fillOpacity: 0.7 }}
          eventHandlers={{ click: () => router.push(location.route) }}
        >
          <Tooltip>{location.name}</Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
