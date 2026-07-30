'use client';

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-[#E7E5D8] bg-[#FBFAF3] py-14 px-6 sm:px-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-start justify-between gap-10">

          {/* Brand block */}
          <div className="space-y-3 max-w-[300px]">
            <div className="flex items-center gap-2.5 font-black text-[18px] text-[#15150F]">
              <div className="w-8 h-8 rounded-[9px] bg-[#15150F] flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/wren-mascot.png" alt="Bluehour" className="w-full h-full object-cover" />
              </div>
              Bluehour
            </div>
            <p className="text-[13px] text-[#5B5B52] leading-relaxed">
              Where do you want to disappear?<br />
              AI travel companion for web3 nomads.<br />
              Powered by Robinhood Chain.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="w-2 h-2 rounded-full bg-[#CCFF00] border border-[#3A4A00] animate-pulse" />
              <span className="text-[11.5px] text-[#B4B2A4] font-bold">Robinhood Chain · Chain ID 98865</span>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-12 text-[13.5px]">
            <div className="space-y-3">
              <div className="text-[10.5px] font-extrabold uppercase tracking-widest text-[#B4B2A4]">Explore</div>
              <div className="flex flex-col gap-2 text-[#5B5B52]">
                <Link href="/discover" className="hover:text-[#15150F] transition-colors">Discover trails</Link>
                <Link href="/ai-agent" className="hover:text-[#15150F] transition-colors">Meet Wren</Link>
                <Link href="/map" className="hover:text-[#15150F] transition-colors">Map explorer</Link>
                <Link href="/routes/create" className="hover:text-[#15150F] transition-colors">Publish a route</Link>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-[10.5px] font-extrabold uppercase tracking-widest text-[#B4B2A4]">Nomad</div>
              <div className="flex flex-col gap-2 text-[#5B5B52]">
                <Link href="/profile" className="hover:text-[#15150F] transition-colors">Profile & atlas</Link>
                <Link href="/rewards" className="hover:text-[#15150F] transition-colors">How rewards work</Link>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-[10.5px] font-extrabold uppercase tracking-widest text-[#B4B2A4]">Tech</div>
              <div className="flex flex-col gap-2 text-[#5B5B52]">
                <span className="text-[#B4B2A4]">x402 AI payments</span>
                <span className="text-[#B4B2A4]">EIP-3009 gasless USDG</span>
                <span className="text-[#B4B2A4]">EXIF photo proof</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#E7E5D8] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#B4B2A4]">
          <span>© 2026 Bluehour. The road pays you back.</span>
          <div className="flex items-center gap-2">
            <span className="bg-[#CCFF00] text-[#3A4A00] px-3 py-1 rounded-full font-extrabold text-[10px] uppercase tracking-widest">
              Robinhood Chain L2
            </span>
            <span className="bg-[#15150F] text-[#CCFF00] px-3 py-1 rounded-full font-extrabold text-[10px] uppercase tracking-widest">
              x402 Ready
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
