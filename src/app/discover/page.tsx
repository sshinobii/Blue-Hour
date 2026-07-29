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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5 mb-3">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Discover</h1>
              <p className="text-[#5B5B52] text-[14.5px] max-w-[480px] leading-relaxed">
                Routes from Wren and from other wanderers — every trail here was walked, ridden, or wandered by
                someone first. Think Tripadvisor, but for the roads nobody reviews.
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

          {/* Cards Grid */}
          {loading ? (
            <div className="py-20 text-center text-[#5B5B52]">Loading routes...</div>
          ) : routes.length === 0 ? (
            <div className="py-20 text-center text-[#5B5B52]">No routes found in this category.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {routes.map((route, idx) => {
                const gradients = [
                  'from-[#FFD9A0] to-[#F6A6B0]',
                  'from-[#BFE9E0] to-[#8FCBE0]',
                  'from-[#FFE7A0] to-[#F2C6DE]'
                ];
                const gradientClass = gradients[idx % gradients.length];

                return (
                  <Link key={route.id} href={`/routes/${route.id}`} className="card-light block group">
                    <div className={`h-[160px] relative bg-gradient-to-br ${gradientClass}`}>
                      <div className="absolute top-3 left-3 bg-white text-[#3A4A00] text-[10.5px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full">
                        {route.category || 'Route'}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-[16px] font-bold mb-2 group-hover:text-[#3A4A00] transition-colors">
                        {route.title}
                      </h3>
                      <p className="text-[13px] text-[#5B5B52] leading-relaxed mb-4 line-clamp-2 min-h-[40px]">
                        {route.description}
                      </p>
                      <div className="flex justify-between text-[12.5px] text-[#B4B2A4] border-t border-[#E7E5D8] pt-3">
                        <span>{route.days ? `${route.days} days` : 'Flexible'}</span>
                        <span className="text-[#B4B2A4] font-medium">
                          {route.budget_amount ? `~${route.budget_currency === 'EUR' ? '€' : '$'}${route.budget_amount}` : 'Free'}
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
