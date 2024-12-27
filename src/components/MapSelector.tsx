import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapSelectorProps {
  onLocationSelect: (lat: string, lng: string) => void;
}

const MapSelector = ({ onLocationSelect }: MapSelectorProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [mapToken, setMapToken] = useState('');

  useEffect(() => {
    if (!mapContainer.current || !mapToken) return;

    mapboxgl.accessToken = mapToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [0, 0],
      zoom: 1
    });

    map.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      
      if (marker.current) {
        marker.current.remove();
      }
      
      marker.current = new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(map.current!);

      onLocationSelect(lat.toFixed(6), lng.toFixed(6));
    });

    return () => {
      map.current?.remove();
    };
  }, [mapToken]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="mapToken" className="text-sm font-medium">
          Mapbox Token
        </label>
        <input
          id="mapToken"
          type="password"
          value={mapToken}
          onChange={(e) => setMapToken(e.target.value)}
          placeholder="Enter your Mapbox public token"
          className="w-full p-2 border rounded"
        />
      </div>
      <div ref={mapContainer} className="w-full h-[400px] rounded-lg border" />
    </div>
  );
};

export default MapSelector;