import React, { useEffect, useRef } from 'react';
import L from 'leaflet'; // Import Leaflet

interface MapDisplayProps {
  latitude: number;
  longitude: number;
  zoomLevel?: number;
  popupText: string;
}

const MapDisplay: React.FC<MapDisplayProps> = ({ latitude, longitude, zoomLevel = 13, popupText }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) { // Initialize map only once
      const map = L.map(mapContainerRef.current).setView([latitude, longitude], zoomLevel);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      L.marker([latitude, longitude]).addTo(map)
        .bindPopup(popupText)
        .openPopup();
    }

    // Optional: Update view if props change dynamically (not strictly needed for this static case)
    // if (mapInstanceRef.current) {
    //   mapInstanceRef.current.setView([latitude, longitude], zoomLevel);
    // }

    return () => {
      // Clean up map instance when component unmounts
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, zoomLevel, popupText]); // Dependencies for re-initializing if needed

  return <div ref={mapContainerRef} style={{ height: '200px', width: '100%', borderRadius: '0.375rem' }} aria-label={`Carte indiquant l'adresse: ${popupText}`}></div>;
};

export default MapDisplay;