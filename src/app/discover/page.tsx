'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { dbClient, Route } from '@/lib/db';

export default function DiscoverPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRoutes = async () => {
      setLoading(true);
      const data = await dbClient.getRoutes(activeCategory);
      setRoutes(data);
      setLoading(false);
    };

    fetchRoutes();
  }, [activeCategory]);

  const categories = ['All', 'Hiking', 'Rail', 'Coast', 'Night city'];

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFAF3] text-[#15150F]">
      <Navbar />

      <main className="flex-1">
        <section className="screen py-10 md:py-16">
          {/* Header & Filter row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5 mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Discover</h1>
              <p className="text-[#5B5B52] text-[15px] max-w-[560px] leading-relaxed">
                Every trail here started as someone&apos;s mood - a rainy afternoon, a name they couldn&apos;t stop thinking about, a road with no signs. Wander in.
              </p>
            </div>
            <Link
              href="/routes/create"
              className="bg-[#15150F] text-[#CCFF00] font-bold py-2.5 px-5 rounded-full text-[13.5px] hover:opacity-90 transition-all whitespace-nowrap"
            >
              + Publish your route
            </Link>
          </div>

          <div className="flex gap-2.5 flex-wrap mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[13px] px-4 py-1.5 rounded-full border transition-all font-medium ${
                  activeCategory === cat
                    ? 'bg-[#15150F] text-[#CCFF00] border-[#15150F] font-bold'
                    : 'border-[#E7E5D8] text-[#5B5B52] bg-white hover:border-[#B4B2A4]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Editorial Asymmetric Cards Layout */}
          {loading ? (
            <div className="py-20 text-center text-[#5B5B52]">Loading routes...</div>
          ) : routes.length === 0 ? (
            <div className="py-20 text-center text-[#5B5B52]">No routes found in this category.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {routes.map((route, idx) => {
                // Vary grid column spans for asymmetric layout
                const isHero = idx === 0;
                const colSpanClass = isHero ? 'md:col-span-8' : idx % 3 === 1 ? 'md:col-span-4' : 'md:col-span-6';
                const imageHeightClass = isHero ? 'h-[220px]' : 'h-[160px]';

                return (
                  <Link
                    key={route.id}
                    href={`/routes/${route.id}`}
                    className={`${colSpanClass} bg-white border border-[#E7E5D8] rounded-[24px] overflow-hidden group hover:border-[#15150F] transition-all flex flex-col justify-between p-6 relative shadow-xs`}
                  >
                    <div className={`${imageHeightClass} bg-[#FBFAF3] border border-[#E7E5D8] rounded-[18px] flex items-center justify-center p-4 mb-5 relative overflow-hidden`}>
                      <svg className="w-12 h-12 text-[#15150F] group-hover:scale-105 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                      </svg>
                      <div className="absolute top-3 left-3 bg-[#CCFF00] text-[#3A4A00] text-[10.5px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full">
                        {route.category || 'Route'}
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className={`${isHero ? 'text-2xl' : 'text-[18px]'} font-black mb-2 text-[#15150F] group-hover:text-[#3A4A00] transition-colors`}>
                          {route.title}
                        </h3>
                        <p className="text-[13.5px] text-[#5B5B52] leading-relaxed mb-5 line-clamp-2">
                          {route.description}
                        </p>
                      </div>
                      <div className="flex justify-between items-center text-[12.5px] text-[#B4B2A4] border-t border-[#E7E5D8] pt-3">
                        <span>{route.days ? `${route.days} days` : 'Flexible'}</span>
                        <span className="font-bold text-[#15150F]">
                          {route.budget_amount ? `€${route.budget_amount}` : 'Free'}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
