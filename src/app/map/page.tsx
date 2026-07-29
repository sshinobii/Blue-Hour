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
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [holderBoostedOnly, setHolderBoostedOnly] = useState<boolean>(false);

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

  const filteredRoutes = routes.filter((r) => {
    if (selectedCategory !== 'All' && r.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    return true;
  });

  const categories = ['All', 'Rail', 'Coast', 'Hiking', 'Night city'];

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFAF3] text-[#15150F]">
      <Navbar />

      <main className="flex-1">
        <section className="screen py-10 md:py-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight">Map explorer</h1>
                <div className="bg-white border border-[#E7E5D8] rounded-full px-3.5 py-1 text-[12px] font-extrabold text-[#15150F] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#CCFF00] border border-[#15150F]" />
                  <span>{filteredRoutes.length} routes live now</span>
                </div>
              </div>
              <p className="text-[13.5px] text-[#5B5B52] mt-1">
                Explore all community routes simultaneously. Click any line or marker to open trail details.
              </p>
            </div>

            {/* Filter Bar */}
            <div className="flex gap-2 flex-wrap items-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[12.5px] px-3.5 py-1.5 rounded-full border transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#15150F] text-[#CCFF00] border-[#15150F] font-bold'
                      : 'border-[#E7E5D8] text-[#5B5B52] bg-white'
                  }`}
                >
                  {cat}
                </button>
              ))}

              <button
                onClick={() => setHolderBoostedOnly((v) => !v)}
                className={`text-[12.5px] px-3.5 py-1.5 rounded-full font-bold border transition-all flex items-center gap-1.5 ${
                  holderBoostedOnly
                    ? 'bg-[#CCFF00] text-[#3A4A00] border-[#15150F]'
                    : 'bg-white border-[#E7E5D8] text-[#5B5B52]'
                }`}
              >
                <span>⚡</span> Holder-boosted
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] border border-[#E7E5D8] rounded-[20px] overflow-hidden min-h-[550px]">
            {/* Sidebar */}
            <div className="bg-white p-6 border-r border-[#E7E5D8] flex flex-col justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-[#B4B2A4] font-extrabold mb-3">
                  Selected Route Detail
                </div>

                {selectedRoute ? (
                  <>
                    <h2 className="text-[19px] font-black mb-1.5">{selectedRoute.title}</h2>
                    <p className="text-[12.5px] text-[#5B5B52] mb-4 leading-relaxed">
                      {selectedRoute.description}
                    </p>

                    <div className="flex gap-2 mb-5">
                      <span className="text-[11.5px] font-bold px-3 py-1 rounded-full bg-[#FBFAF3] border border-[#E7E5D8] text-[#15150F]">
                        €{selectedRoute.budget_amount || 650}
                      </span>
                      <span className="text-[11.5px] font-bold px-3 py-1 rounded-full bg-[#FBFAF3] border border-[#E7E5D8] text-[#15150F]">
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
                            <span className="text-[11.5px] text-[#B4B2A4]">
                              {stop.day_range || `Stop ${idx + 1}`} · {stop.description}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-[13px] text-[#5B5B52]">Select a route on the map to view details.</div>
                )}
              </div>

              <div className="pt-4 border-t border-[#E7E5D8] text-[11.5px] text-[#B4B2A4]">
                Showing {filteredRoutes.length} of {routes.length} community routes.
              </div>
            </div>

            {/* Map Canvas - Renders ALL routes simultaneously */}
            <div className="relative min-h-[450px]">
              <MapComponent
                route={selectedRoute}
                routes={filteredRoutes}
                activeStopIndex={activeStopIndex}
                onSelectRoute={(r) => {
                  setSelectedRoute(r);
                  setActiveStopIndex(0);
                }}
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
