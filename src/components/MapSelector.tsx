import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapSelectorProps {
  onLocationSelect: (lat: string, lng: string) => void;
}

function MapEvents({ onLocationSelect }: MapSelectorProps) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat.toFixed(6), lng.toFixed(6));
    },
  });
  return null;
}

const MapSelector = ({ onLocationSelect }: MapSelectorProps) => {
  const [position, setPosition] = React.useState<[number, number] | null>(null);

  const handleMapClick = (lat: string, lng: string) => {
    setPosition([parseFloat(lat), parseFloat(lng)]);
    onLocationSelect(lat, lng);
  };

  return (
    <div className="space-y-4">
      <div className="w-full h-[400px] rounded-lg border overflow-hidden">
        <MapContainer
          center={[0, 0]}
          zoom={2}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapEvents onLocationSelect={handleMapClick} />
          {position && <Marker position={position} />}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapSelector;