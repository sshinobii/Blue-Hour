'use client';

import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { Route } from '@/lib/db';

import 'maplibre-gl/dist/maplibre-gl.css';

interface MapComponentProps {
  route?: Route | null;
  routes?: Route[];
  activeStopIndex?: number;
  onSelectRoute?: (route: Route) => void;
  onSelectStop?: (index: number) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Rail: '#15150F',
  Coast: '#0066CC',
  Hiking: '#008844',
  Nature: '#008844',
  'Night city': '#8800CC',
  Default: '#15150F',
};

export const MapComponent: React.FC<MapComponentProps> = ({
  route,
  routes,
  activeStopIndex = 0,
  onSelectRoute,
  onSelectStop,
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
            attribution: '© OpenStreetMap',
          },
        },
        layers: [
          {
            id: 'osm-layer',
            type: 'raster',
            source: 'osm-tiles',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: [20, 45],
      zoom: 2.5,
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
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const routesToRender: Route[] = routes && routes.length > 0 ? routes : route ? [route] : [];
    if (routesToRender.length === 0) return;

    const drawRoutes = () => {
      routesToRender.forEach((r, rIdx) => {
        if (!r.stops || r.stops.length === 0) return;

        const lineId = `route-line-${r.id}`;
        const layerId = `route-layer-${r.id}`;

        if (map.getLayer(layerId)) map.removeLayer(layerId);
        if (map.getSource(lineId)) map.removeSource(lineId);

        const lineColor = CATEGORY_COLORS[r.category || 'Default'] || CATEGORY_COLORS.Default;

        map.addSource(lineId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: r.stops.map((s) => [s.lng, s.lat]),
            },
          },
        });

        map.addLayer({
          id: layerId,
          type: 'line',
          source: lineId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': lineColor,
            'line-width': 2.5,
            'line-opacity': route && route.id === r.id ? 1 : 0.75,
            'line-dasharray': [3, 2],
          },
        });

        r.stops.forEach((stop, index) => {
          const el = document.createElement('div');
          const isSelected = route ? route.id === r.id && index === activeStopIndex : false;
          el.className = `custom-light-marker ${isSelected ? 'active' : ''}`;
          el.style.backgroundColor = lineColor;

          el.addEventListener('click', () => {
            if (onSelectRoute) onSelectRoute(r);
            if (onSelectStop) onSelectStop(index);
          });

          const marker = new maplibregl.Marker({ element: el })
            .setLngLat([stop.lng, stop.lat])
            .addTo(map);

          markersRef.current.push(marker);
        });
      });

      // Fit bounds to all stops
      const bounds = new maplibregl.LngLatBounds();
      routesToRender.forEach((r) => {
        r.stops?.forEach((s) => bounds.extend([s.lng, s.lat]));
      });

      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, {
          padding: { top: 70, bottom: 70, left: 50, right: 50 },
          maxZoom: 10,
        });
      }
    };

    if (map.loaded()) {
      drawRoutes();
    } else {
      map.once('load', drawRoutes);
    }
  }, [route, routes, activeStopIndex, onSelectRoute, onSelectStop]);

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
          transform: scale(1.4);
          box-shadow: 0 0 0 5px rgba(204, 255, 0, 0.6);
        }
      `}</style>
    </div>
  );
};

export default MapComponent;
