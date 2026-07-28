'use client';

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-[#E7E5D8] bg-[#FBFAF3] py-12 px-6 sm:px-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          
          {/* Brand */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 font-black text-[18px] text-[#15150F]">
              <div className="w-[26px] h-[26px] rounded-[7px] bg-[#15150F] text-[#CCFF00] flex items-center justify-center font-black text-[14px]">
                b
              </div>
              Bluehour
            </div>
            <p className="text-[13px] text-[#5B5B52] leading-relaxed max-w-[280px]">
              AI travel companion for web3 nomads.<br />
              Powered by Robinhood Chain.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-12 text-[13.5px]">
            <div className="space-y-2">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#B4B2A4]">Explore</div>
              <div className="flex flex-col gap-1.5 text-[#5B5B52]">
                <Link href="/discover" className="hover:text-[#15150F] transition-colors">Discover</Link>
                <Link href="/ai-agent" className="hover:text-[#15150F] transition-colors">AI agent</Link>
                <Link href="/map" className="hover:text-[#15150F] transition-colors">Map explorer</Link>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#B4B2A4]">Account</div>
              <div className="flex flex-col gap-1.5 text-[#5B5B52]">
                <Link href="/profile" className="hover:text-[#15150F] transition-colors">Profile & $HOUR</Link>
                <Link href="/routes/create" className="hover:text-[#15150F] transition-colors">Create route</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#E7E5D8] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#B4B2A4]">
          <span>© 2026 Bluehour. Powered by Robinhood Chain.</span>
          <span className="bg-[#CCFF00] text-[#3A4A00] px-3 py-1 rounded-full font-extrabold text-[10.5px] uppercase tracking-wider">
            Robinhood Chain L2
          </span>
        </div>
      </div>
    </footer>
  );
};
