'use client';

import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { Route } from '@/lib/db';

import 'maplibre-gl/dist/maplibre-gl.css';

interface MapComponentProps {
  route: Route | null;
  activeStopIndex: number;
  onSelectStop: (index: number) => void;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  route,
  activeStopIndex,
  onSelectStop
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap'
          }
        },
        layers: [
          {
            id: 'osm-layer',
            type: 'raster',
            source: 'osm-tiles',
            minzoom: 0,
            maxzoom: 19
          }
        ]
      },
      center: [20, 45],
      zoom: 2.5
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !route || !route.stops || route.stops.length === 0) return;

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    if (map.getLayer('route-layer')) map.removeLayer('route-layer');
    if (map.getSource('route-line')) map.removeSource('route-line');

    route.stops.forEach((stop, index) => {
      const el = document.createElement('div');
      el.className = `custom-light-marker ${index === activeStopIndex ? 'active' : ''}`;
      el.addEventListener('click', () => {
        onSelectStop(index);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([stop.lng, stop.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });

    const drawLine = () => {
      if (map.getSource('route-line') || !route.stops) return;

      map.addSource('route-line', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: route.stops.map(s => [s.lng, s.lat])
          }
        }
      });

      map.addLayer({
        id: 'route-layer',
        type: 'line',
        source: 'route-line',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#15150F',
          'line-width': 2,
          'line-opacity': 0.8,
          'line-dasharray': [2, 2]
        }
      });
    };

    if (map.loaded()) {
      drawLine();
    } else {
      map.once('load', drawLine);
    }

    const bounds = new maplibregl.LngLatBounds();
    route.stops.forEach(s => bounds.extend([s.lng, s.lat]));
    map.fitBounds(bounds, {
      padding: { top: 70, bottom: 70, left: 50, right: 50 },
      maxZoom: 11
    });

  }, [route, activeStopIndex, onSelectStop]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full bg-[#FBFAF3]" />
      <style>{`
        .custom-light-marker {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #15150F;
          border: 3px solid #CCFF00;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .custom-light-marker.active {
          transform: scale(1.3);
          box-shadow: 0 0 0 4px rgba(204, 255, 0, 0.5);
        }
      `}</style>
    </div>
  );
};

export default MapComponent;
