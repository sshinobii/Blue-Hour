'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { dbClient, Route } from '@/lib/db';
import { MapComponent } from '@/components/MapComponent';

export default function MapExplorerPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [activeStopIndex, setActiveStopIndex] = useState<number>(0);

  useEffect(() => {
    const loadRoutes = async () => {
      const data = await dbClient.getRoutes();
      setRoutes(data);
      if (data.length > 0) {
        setSelectedRoute(data[0]);
      }
    };
    loadRoutes();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFAF3] text-[#15150F]">
      <Navbar />

      <main className="flex-1">
        <section className="screen py-10 md:py-16">
          <div className="flex justify-between items-baseline mb-6">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">Map explorer</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] border border-[#E7E5D8] rounded-[20px] overflow-hidden min-h-[500px]">
            {/* Sidebar */}
            <div className="bg-white p-6 border-r border-[#E7E5D8] flex flex-col">
              {/* Route Selector Dropdown */}
              {routes.length > 0 && (
                <select
                  value={selectedRoute?.id || ''}
                  onChange={(e) => {
                    const r = routes.find((rt) => rt.id === e.target.value);
                    if (r) setSelectedRoute(r);
                  }}
                  className="w-full bg-[#F1EFE1] border-none rounded-[12px] p-3 text-[13px] font-bold text-[#15150F] outline-none mb-4"
                >
                  {routes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title}
                    </option>
                  ))}
                </select>
              )}

              {selectedRoute && (
                <>
                  <h2 className="text-[19px] font-black mb-1.5">{selectedRoute.title}</h2>
                  <p className="text-[12.5px] text-[#5B5B52] mb-4 leading-relaxed">
                    {selectedRoute.description}
                  </p>

                  <div className="flex gap-2 mb-5">
                    <span className="text-[11.5px] font-bold px-3 py-1 rounded-full bg-[#F1EFE1] text-[#15150F]">
                      €{selectedRoute.budget_amount || 650}
                    </span>
                    <span className="text-[11.5px] font-bold px-3 py-1 rounded-full bg-[#F1EFE1] text-[#15150F]">
                      {selectedRoute.days || 8} days
                    </span>
                    <span className="text-[11.5px] font-bold px-3 py-1 rounded-full bg-[#CCFF00] text-[#3A4A00]">
                      {selectedRoute.stops?.length || 0} stops
                    </span>
                  </div>

                  <div className="text-[11px] uppercase tracking-wider text-[#B4B2A4] mb-3 font-extrabold">
                    Timeline stops
                  </div>

                  <div className="space-y-2 overflow-y-auto max-h-[280px] pr-1">
                    {selectedRoute.stops?.map((stop, idx) => (
                      <div
                        key={stop.id}
                        onClick={() => setActiveStopIndex(idx)}
                        className={`flex gap-3 p-3 rounded-[14px] cursor-pointer transition-all ${
                          activeStopIndex === idx
                            ? 'bg-[#F4F8E0] border border-[#CCFF00]'
                            : 'hover:bg-[#FBFAF3]'
                        }`}
                      >
                        <div className="w-[26px] h-[26px] rounded-full bg-[#15150F] text-[#CCFF00] text-[12px] font-extrabold flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </div>
                        <div>
                          <b className="block text-[13.5px] text-[#15150F]">{stop.name}</b>
                          <span className="text-[11.5px] text-[#B4B2A4]">{stop.day_range || `Stop ${idx + 1}`} · {stop.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Map Canvas */}
            <div className="relative min-h-[400px]">
              <MapComponent
                route={selectedRoute}
                activeStopIndex={activeStopIndex}
                onSelectStop={setActiveStopIndex}
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
