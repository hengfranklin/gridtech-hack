'use client';

import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import { UtilityTerritory } from '@/data/utility-territories';

interface LeafletMapProps {
  territories: UtilityTerritory[];
  dacAreas: { name: string; coordinates: [number, number][] }[];
  selectedRegion: string | null;
  userUtility: string | null;
  onRegionSelect: (provider: string) => void;
}

export default function LeafletMap({ territories, dacAreas, selectedRegion, userUtility, onRegionSelect }: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<Map<string, L.Polygon>>(new Map());
  const dacLayersRef = useRef<L.Polygon[]>([]);
  const onRegionSelectRef = useRef(onRegionSelect);
  onRegionSelectRef.current = onRegionSelect;

  // Load Leaflet CSS via head link
  useEffect(() => {
    const id = 'leaflet-css';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [42.0, -75.5],
      zoom: 7,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Draw territory polygons
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    layersRef.current.forEach((layer) => layer.remove());
    layersRef.current.clear();

    territories.forEach((territory) => {
      const latLngs = territory.coordinates.map((ring) =>
        ring.map(([lng, lat]) => [lat, lng] as [number, number])
      );

      const isSelected = territory.provider === selectedRegion;
      const isUser = territory.provider === userUtility;

      const polygon = L.polygon(latLngs, {
        color: isUser ? '#f59e0b' : territory.color,
        weight: isSelected ? 3 : isUser ? 3 : 1.5,
        fillColor: territory.color,
        fillOpacity: isSelected ? 0.35 : 0.15,
        dashArray: isUser && !isSelected ? '5,5' : undefined,
      });

      polygon.bindTooltip(territory.name, { sticky: true });

      polygon.on('click', () => {
        onRegionSelectRef.current(territory.provider);
      });

      polygon.addTo(map);
      layersRef.current.set(territory.provider, polygon);
    });
  }, [territories, selectedRegion, userUtility]);

  // Draw DAC overlays
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    dacLayersRef.current.forEach((layer) => layer.remove());
    dacLayersRef.current = [];

    dacAreas.forEach((area) => {
      const latLngs = area.coordinates.map(([lng, lat]) => [lat, lng] as [number, number]);

      const polygon = L.polygon(latLngs, {
        color: '#f59e0b',
        weight: 2,
        fillColor: '#fbbf24',
        fillOpacity: 0.4,
        dashArray: '4,4',
      });

      polygon.bindTooltip(`DAC: ${area.name}`, { sticky: true });
      polygon.addTo(map);
      dacLayersRef.current.push(polygon);
    });
  }, [dacAreas]);

  // Zoom to selected region
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedRegion) return;

    const layer = layersRef.current.get(selectedRegion);
    if (layer) {
      map.fitBounds(layer.getBounds(), { padding: [50, 50], maxZoom: 10 });
    }
  }, [selectedRegion]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
