'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function RewardsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBFAF3] text-[#15150F]">
      <Navbar />

      <main className="flex-1">
        {/* HERO HEADER */}
        <section className="screen border-b border-[#E7E5D8] py-14 md:py-20">
          <div className="tag-badge">Onchain Economy · Robinhood Chain</div>
          
          <h1 className="text-4xl md:text-6xl font-black leading-[1.12] tracking-tight mb-6 max-w-[780px]">
            Rewards for real trails.<br />
            <span className="bg-[#CCFF00] text-[#3A4A00] px-2.5 py-0.5 rounded-lg inline-block">
              Royalties for creators.
            </span>
          </h1>

          <p className="text-[#5B5B52] text-lg max-w-[620px] leading-relaxed mb-8">
            Bluehour rewards travelers for discovering off-the-beaten-path locations and pays creators an ongoing royalty every time a new wanderer completes their route.
          </p>
        </section>

        {/* ASYMMETRIC TWO-COLUMN REWARD ROLES */}
        <section className="screen border-b border-[#E7E5D8] py-14 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Traveler Card */}
            <div className="bg-white border border-[#E7E5D8] rounded-[24px] p-8 space-y-6 flex flex-col justify-between shadow-xs">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-[12px] bg-[#15150F] text-[#CCFF00] flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.818V8.05a1 1 0 00-1.447-.894L15 7m0 10V7m0 0L9 4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-black">1. Traveler Payouts</h2>
                <p className="text-[#5B5B52] text-[14.5px] leading-relaxed">
                  Find a route (from Wren or another wanderer). Take the journey, visit each stop physically, and upload a photo.
                </p>

                <div className="space-y-2.5 pt-2">
                  <div className="flex items-start gap-3 text-[13.5px] text-[#15150F]">
                    <span className="text-[#3A4A00] bg-[#CCFF00] px-2 py-0.5 rounded-full font-bold text-[11px] shrink-0 mt-0.5">EXIF</span>
                    <span>Geo-coordinates and timestamp are verified against stop locations.</span>
                  </div>
                  <div className="flex items-start gap-3 text-[13.5px] text-[#15150F]">
                    <span className="text-[#3A4A00] bg-[#CCFF00] px-2 py-0.5 rounded-full font-bold text-[11px] shrink-0 mt-0.5">180 $HOUR</span>
                    <span>100% route completion triggers an instant settlement payout to your embedded wallet.</span>
                  </div>
                </div>
              </div>

              <Link href="/discover" className="bg-[#15150F] text-[#CCFF00] text-center font-bold py-3 rounded-[12px] text-[13.5px] block">
                Find a trail to complete →
              </Link>
            </div>

            {/* Creator Royalty Card */}
            <div className="bg-white border border-[#E7E5D8] rounded-[24px] p-8 space-y-6 flex flex-col justify-between shadow-xs">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-[12px] bg-[#CCFF00] text-[#3A4A00] flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                  </svg>
                </div>
                <h2 className="text-2xl font-black">2. Ongoing Creator Royalties</h2>
                <p className="text-[#5B5B52] text-[14.5px] leading-relaxed">
                  Publish your own authentic routes with real stops. Instead of a one-time reward, your route becomes an ongoing income stream.
                </p>

                <div className="space-y-2.5 pt-2">
                  <div className="flex items-start gap-3 text-[13.5px] text-[#15150F]">
                    <span className="text-[#3A4A00] bg-[#CCFF00] px-2 py-0.5 rounded-full font-bold text-[11px] shrink-0 mt-0.5">15% Royalty</span>
                    <span>Every time a new unique wallet completes your route, you earn 27 $HOUR automatically.</span>
                  </div>
                  <div className="flex items-start gap-3 text-[13.5px] text-[#15150F]">
                    <span className="text-[#3A4A00] bg-[#CCFF00] px-2 py-0.5 rounded-full font-bold text-[11px] shrink-0 mt-0.5">Farm-Free</span>
                    <span>Photo proof verification prevents sybil attacks, keeping creator royalties honest.</span>
                  </div>
                </div>
              </div>

              <Link href="/routes/create" className="bg-[#CCFF00] text-[#3A4A00] text-center font-extrabold py-3 rounded-[12px] text-[13.5px] block">
                Publish a route & earn royalties →
              </Link>
            </div>
          </div>
        </section>

        {/* PROOF INTEGRITY SECTION */}
        <section className="screen border-b border-[#E7E5D8] py-14 md:py-16">
          <div className="bg-[#15150F] text-white rounded-[24px] p-8 md:p-12 relative overflow-hidden">
            <div className="max-w-[760px] space-y-4">
              <div className="text-[#CCFF00] font-mono text-[12px] uppercase tracking-wider">Proof Integrity</div>
              <h2 className="text-3xl font-black">Why Photo Proof Over Points?</h2>
              <p className="text-[#E7E5D8] text-[15px] leading-relaxed">
                Points systems can be gamed from a desk. Bluehour requires EXIF metadata matching physical coordinates within ~150 meters. Real photos create authentic memories for travelers and guarantee that creator royalties are backed by actual human journeys.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
