'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useWallet } from '@/context/WalletContext';
import { dbClient, Route, RewardLedgerItem } from '@/lib/db';

export default function ProfilePage() {
  const { publicKey, hourBalance, tier, profile } = useWallet();

  const [createdRoutes, setCreatedRoutes] = useState<Route[]>([]);
  const [ledger, setLedger] = useState<RewardLedgerItem[]>([]);

  useEffect(() => {
    const loadProfileData = async () => {
      const routes = await dbClient.getRoutes();
      setCreatedRoutes(routes);
      const userId = publicKey || 'usr_aura';
      const ldg = await dbClient.getRewardLedger(userId);
      setLedger(ldg);
    };

    loadProfileData();
  }, [publicKey]);

  const displayAddress = publicKey
    ? `${publicKey.slice(0, 5)}...${publicKey.slice(-4)}`
    : '0x8f2c...c91a';

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFAF3] text-[#15150F]">
      <Navbar />

      <main className="flex-1">
        <section className="screen py-10 md:py-16">
          <div className="flex justify-between items-baseline mb-8">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">Profile</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-7">
            {/* Left Profile Card */}
            <div className="bg-white border border-[#E7E5D8] rounded-[20px] p-6">
              <div className="w-[64px] h-[64px] rounded-[16px] bg-[#15150F] text-[#CCFF00] flex items-center justify-center font-black text-[22px] mb-4">
                A
              </div>
              <h2 className="text-[19px] font-black mb-0.5">{profile?.display_name || 'Aura_Wanderer'}</h2>
              <div className="text-[12.5px] text-[#B4B2A4] font-mono mb-5">
                {displayAddress} · Robinhood Chain
              </div>

              {/* Token Box */}
              <div className="bg-[#CCFF00] rounded-[14px] p-4 mb-4 text-[#3A4A00]">
                <div className="flex justify-between items-baseline text-[12px] mb-1">
                  <span>$HOUR balance</span>
                  <span className="font-semibold">live price</span>
                </div>
                <div className="text-[26px] font-black mb-1">
                  {hourBalance.toLocaleString()} HOUR
                </div>
                <div className="flex justify-between text-[12px] font-bold border-t border-[#3A4A00]/20 pt-2">
                  <span>Staked: 2,000</span>
                  <span>Unstaked: {(hourBalance - 2000 > 0 ? hourBalance - 2000 : 0).toLocaleString()}</span>
                </div>
              </div>

              {/* Tier Row */}
              <div className="flex items-center gap-2.5 text-[13px] text-[#5B5B52] pt-3 border-t border-[#E7E5D8]">
                <b>Tier: {tier}</b>
                <div className="flex-1 h-[6px] bg-[#E7E5D8] rounded-full overflow-hidden">
                  <div className="h-full bg-[#15150F]" style={{ width: '62%' }} />
                </div>
                <span className="text-[12px] font-bold">62%</span>
              </div>
            </div>

            {/* Right Journeys & Ledger Column */}
            <div className="space-y-4">
              <div className="text-[12px] uppercase tracking-wider text-[#B4B2A4] font-extrabold mb-1">
                Your Journeys & Saved Routes
              </div>

              {createdRoutes.map((route) => (
                <div key={route.id} className="flex justify-between items-center bg-white border border-[#E7E5D8] rounded-[14px] p-4">
                  <div>
                    <b className="block text-[14.5px] text-[#15150F]">{route.title}</b>
                    <span className="text-[12.5px] text-[#B4B2A4]">
                      {route.stops?.length || 0} stops · Category: {route.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href={`/routes/${route.id}`}
                      className="bg-[#CCFF00] text-[#3A4A00] text-[11.5px] px-3.5 py-1.5 rounded-full font-bold hover:opacity-90 transition-all"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}

              {/* Reward Ledger Audit Trail */}
              {ledger.length > 0 && (
                <div className="pt-6">
                  <div className="text-[12px] uppercase tracking-wider text-[#B4B2A4] font-extrabold mb-3">
                    Onchain Reward Ledger (Robinhood Chain)
                  </div>
                  <div className="bg-white border border-[#E7E5D8] rounded-[16px] divide-y divide-[#E7E5D8]">
                    {ledger.map((item) => (
                      <div key={item.id} className="p-3.5 flex justify-between items-center text-[13px]">
                        <div>
                          <b className="block text-[#15150F] capitalize">{item.type.replace(/_/g, ' ')}</b>
                          <a
                            href={`https://explorer.robinhood.com/tx/${item.tx_hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11.5px] text-[#B4B2A4] font-mono hover:text-[#15150F] hover:underline"
                          >
                            {item.tx_hash} ↗
                          </a>
                        </div>
                        <div className="text-right">
                          <b className="text-[#3A4A00] font-black">+{item.amount} $HOUR</b>
                          <span className="block text-[11px] text-[#B4B2A4] capitalize">{item.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
