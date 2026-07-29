'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { dbClient, Route } from '@/lib/db';

export default function HomePage() {
  const router = useRouter();
  const [promptInput, setPromptInput] = useState('');
  const [liveRoutes, setLiveRoutes] = useState<Route[]>([]);

  useEffect(() => {
    const loadRoutes = async () => {
      const r = await dbClient.getRoutes();
      setLiveRoutes(r);
    };
    loadRoutes();
  }, []);

  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (promptInput.trim()) {
      router.push(`/ai-agent?prompt=${encodeURIComponent(promptInput.trim())}`);
    } else {
      router.push('/ai-agent');
    }
  };

  const handleChipClick = (promptText: string) => {
    router.push(`/ai-agent?prompt=${encodeURIComponent(promptText)}`);
  };

  const featuredRoute = liveRoutes[0] || {
    id: 'ghost-romania',
    title: 'Carpathian Ridge & Night Rail',
    stops: [1, 2, 3],
    creator_id: 'usr_aura',
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFAF3] text-[#15150F]">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="screen border-b border-[#E7E5D8] py-12 md:py-16">
          {/* Top Tag Pill */}
          <div className="inline-flex items-center gap-2 bg-[#CCFF00] text-[#3A4A00] font-black text-[11px] uppercase tracking-wider px-3.5 py-1 rounded-full mb-5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#3A4A00] animate-pulse" />
            AI travel agent · Robinhood Chain
          </div>

          {/* H1 Headline with lime highlight rect */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.12] tracking-tight mb-6 max-w-[820px]">
            Find the route no tourist has{' '}
            <span className="bg-[#CCFF00] text-[#3A4A00] px-3 py-0.5 rounded-xl inline-block shadow-xs">
              found yet.
            </span>
          </h1>

          <p className="text-[#5B5B52] text-lg max-w-[620px] leading-relaxed mb-8">
            Tell Wren how you feel — restless, foggy, hungry for silence. It hands back a real route nobody&apos;s written about yet. Go find it, prove you stood there, let the road pay you back.
          </p>

          {/* PROMPT BAR WITH LIME HIGHLIGHT */}
          <form onSubmit={handlePlanSubmit} className="flex gap-2 bg-white border-[2px] border-[#15150F] rounded-[18px] p-2 max-w-[680px] shadow-sm">
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="foggy alpine rail and cabins, under €700, 7 days"
              className="flex-1 bg-transparent border-none text-[#15150F] text-[15px] px-3.5 py-2.5 outline-none placeholder-[#B4B2A4]"
            />
            <button
              type="submit"
              className="bg-[#15150F] text-[#CCFF00] border-none rounded-[12px] px-6 py-2.5 font-extrabold text-[14px] cursor-pointer hover:bg-[#CCFF00] hover:text-[#3A4A00] transition-all flex items-center gap-1 shadow-xs"
            >
              Plan it →
            </button>
          </form>

          {/* CHIPS */}
          <div className="flex gap-2.5 mt-4 flex-wrap mb-10">
            <button
              onClick={() => handleChipClick('unmarked forest paths & mountain cabins')}
              className="chip-item hover:border-[#CCFF00]"
            >
              unmarked forest paths & mountain cabins
            </button>
            <button
              onClick={() => handleChipClick('rainy cafés and trains across Japan')}
              className="chip-item hover:border-[#CCFF00]"
            >
              rainy cafés and trains across Japan
            </button>
            <button
              onClick={() => handleChipClick('hidden beach towns, zero tourists')}
              className="chip-item hover:border-[#CCFF00]"
            >
              hidden beach towns, zero tourists
            </button>
          </div>

          {/* FULL-WIDTH MAP PREVIEW PANEL */}
          <div className="w-full h-[340px] bg-[#F4F3E8] border border-[#E7E5D8] rounded-[24px] relative overflow-hidden p-6 flex flex-col justify-between shadow-xs">
            {/* Top-Left Live Counter Badge */}
            <div className="bg-white border border-[#E7E5D8] rounded-full px-4 py-1.5 text-[12.5px] font-bold text-[#15150F] shadow-xs self-start flex items-center gap-2 z-10">
              <span className="w-2 h-2 rounded-full bg-[#CCFF00] border border-[#15150F]" />
              <span>{liveRoutes.length || 12} routes live now</span>
            </div>

            {/* SVG Dashed Polyline Network */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              {/* Background routes (30% opacity) */}
              <path d="M 50,220 Q 200,80 380,260 T 700,120 T 1100,280" fill="none" stroke="#15150F" strokeWidth="2" strokeDasharray="6 6" strokeOpacity="0.25" />
              <path d="M 120,60 Q 300,300 550,140 T 900,200" fill="none" stroke="#15150F" strokeWidth="2" strokeDasharray="6 6" strokeOpacity="0.25" />
              
              {/* Featured Route Line (Opaque) */}
              <path d="M 80,180 Q 240,40 460,200 T 820,100 T 1120,220" fill="none" stroke="#15150F" strokeWidth="2.5" strokeDasharray="8 6" />

              {/* Stop Dot Markers */}
              <circle cx="80" cy="180" r="5" fill="#15150F" stroke="#CCFF00" strokeWidth="2" />
              <circle cx="240" cy="100" r="5" fill="#15150F" stroke="#CCFF00" strokeWidth="2" />
              <circle cx="460" cy="200" r="9" fill="#CCFF00" stroke="#15150F" strokeWidth="3" />
              <circle cx="820" cy="100" r="5" fill="#15150F" stroke="#CCFF00" strokeWidth="2" />
              <circle cx="1120" cy="220" r="5" fill="#15150F" stroke="#CCFF00" strokeWidth="2" />
            </svg>

            {/* Bottom-Left Floating Route Caption Card */}
            <div className="bg-white border border-[#E7E5D8] rounded-[16px] p-4 max-w-sm shadow-md z-10">
              <div className="text-[13.5px] font-bold text-[#15150F] mb-0.5">
                {featuredRoute.title}
              </div>
              <div className="text-[12px] text-[#5B5B52] flex items-center justify-between">
                <span>by @Aura_Wanderer</span>
                <span className="font-bold text-[#3A4A00] bg-[#CCFF00] px-2.5 py-0.5 rounded-full text-[11px]">
                  3/3 stops proved
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* NOMAD MARQUEE STRIP */}
        <div className="w-full bg-[#CCFF00] border-b border-[#E7E5D8] overflow-hidden py-3">
          <div className="marquee-track">
            {[0, 1].map((rep) => (
              <div key={rep} className="flex items-center gap-8 pr-8 shrink-0">
                {['NOMADS', 'WANDERERS', 'DREAMERS', 'FIRST DISCOVERERS', 'ON ROBINHOOD CHAIN'].map((word) => (
                  <span key={word + rep} className="text-[#3A4A00] font-black text-[13px] tracking-wider uppercase whitespace-nowrap">
                    {word} <span className="text-[#3A4A00]/40 ml-8">·</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* MEET WREN — MASCOT & AGENT LORE SHOWCASE SECTION */}
        <section className="screen border-b border-[#E7E5D8] py-14 md:py-20 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Mascot Image Display */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/wren-mascot.png"
                  alt="Wren, the Bluehour AI Falcon Companion"
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

            {/* Lore & Agent Copy */}
            <div className="md:col-span-7 space-y-5">
              <div className="inline-block bg-[#CCFF00] text-[#3A4A00] text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full">
                AI Companion Lore
              </div>
              <h2 className="text-3xl md:text-4xl font-black leading-tight text-[#15150F]">
                Meet Wren. Your migratory AI guide.
              </h2>
              <p className="text-[#5B5B52] text-[16px] leading-relaxed">
                Wren is a hooded falcon migratory companion who&apos;s flown over a hundred ridgelines and secret alleys. Tell Wren how you feel — foggy, restless, or hungry for quiet — and it plots an unmapped journey tailored to your mood.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/ai-agent"
                  className="bg-[#15150F] text-[#CCFF00] font-extrabold px-6 py-3 rounded-full text-[14px] hover:bg-[#CCFF00] hover:text-[#3A4A00] transition-all inline-block shadow-xs"
                >
                  Discover Wren&apos;s story →
                </Link>
                <Link
                  href="/profile"
                  className="bg-[#CCFF00] text-[#3A4A00] font-extrabold px-6 py-3 rounded-full text-[14px] hover:bg-[#15150F] hover:text-[#CCFF00] transition-all inline-block shadow-xs"
                >
                  Chat with Wren
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* WEB3 AGENTIC INFRASTRUCTURE SECTION */}
        <section className="screen border-b border-[#E7E5D8] py-14 md:py-20">
          <div className="text-center max-w-[700px] mx-auto mb-12 space-y-3">
            <div className="inline-block bg-[#CCFF00] text-[#3A4A00] text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full">
              Built on Robinhood Chain
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#15150F]">
              The best chain for the agentic economy.
            </h2>
            <p className="text-[#5B5B52] text-[16px] leading-relaxed">
              Powered by x402 gasless micropayments and Robinhood Chain infrastructure — built so AI agents and nomads can transact autonomously.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature Card 1: x402 Micropayments */}
            <div className="bg-white border-[1.5px] border-[#15150F] rounded-[24px] p-8 space-y-4 shadow-sm hover:border-[#CCFF00] transition-all">
              <div className="w-12 h-12 rounded-[14px] bg-[#CCFF00] text-[#3A4A00] flex items-center justify-center shadow-xs">
                <svg className="w-6 h-6 text-[#3A4A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-[#15150F]">x402 Micropayments Protocol</h3>
              <p className="text-[#5B5B52] text-[14.5px] leading-relaxed">
                Seamless agent-to-server micropayments via EIP-3009 gasless signatures in USDG. Wren pays for compute and unlocks premium routing in the background with zero wallet popups.
              </p>
              <div className="pt-2 flex items-center gap-2 text-[12px] font-bold text-[#3A4A00] bg-[#CCFF00]/40 px-3 py-1.5 rounded-lg w-fit">
                <span>✓ HTTP 402 Standard · Gasless USDG</span>
              </div>
            </div>

            {/* Feature Card 2: Robinhood Chain */}
            <div className="bg-white border-[1.5px] border-[#15150F] rounded-[24px] p-8 space-y-4 shadow-sm hover:border-[#CCFF00] transition-all">
              <div className="w-12 h-12 rounded-[14px] bg-[#15150F] text-[#CCFF00] flex items-center justify-center shadow-xs">
                <svg className="w-6 h-6 text-[#CCFF00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m-0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.086-1.04-8.435-2.797m0 0A8.959 8.959 0 013 12c0-.778.099-1.533.284-2.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-[#15150F]">Robinhood Chain</h3>
              <p className="text-[#5B5B52] text-[14.5px] leading-relaxed">
                Engineered for instant EVM execution, sub-penny fees, and gas-sponsored relayers. The ideal blockchain ecosystem for autonomous AI agents and web3 travelers.
              </p>
              <div className="pt-2 flex items-center gap-2 text-[12px] font-bold text-[#15150F] bg-[#FBFAF3] border border-[#E7E5D8] px-3 py-1.5 rounded-lg w-fit">
                <span>✓ Chain ID: 98865 · Instant EVM Finality</span>
              </div>
            </div>
          </div>
        </section>

        {/* REWARD SYSTEM EXPLAINER SECTION */}
        <section className="screen border-b border-[#E7E5D8] py-14 md:py-16">
          <div className="bg-[#15150F] text-white rounded-[24px] p-8 md:p-12 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#CCFF00]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="max-w-[760px] space-y-6">
              <div className="inline-block bg-[#CCFF00] text-[#3A4A00] text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full">
                Onchain Settlement · Robinhood Chain
              </div>
              <h2 className="text-3xl md:text-4xl font-black leading-tight text-white">
                How Rewards Work
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="bg-white/10 border border-white/15 rounded-[16px] p-6 backdrop-blur-xs space-y-3">
                  <div className="flex items-center gap-2.5 text-[#CCFF00] font-extrabold text-[16px]">
                    <svg className="w-5 h-5 text-[#CCFF00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.818V8.05a1 1 0 00-1.447-.894L15 7m0 10V7m0 0L9 4" />
                    </svg>
                    <span>As a Traveler</span>
                  </div>
                  <p className="text-[14px] text-[#E7E5D8] leading-relaxed">
                    Find a route — from Wren, or from a wanderer who walked it before you. Take it stop by stop, and leave proof: a photo where you actually stood. Finish it and the road pays you back, settled onchain in USDC.
                  </p>
                </div>

                <div className="bg-white/10 border border-white/15 rounded-[16px] p-6 backdrop-blur-xs space-y-3">
                  <div className="flex items-center gap-2.5 text-[#CCFF00] font-extrabold text-[15px]">
                    <svg className="w-5 h-5 text-[#CCFF00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                    </svg>
                    <span>As a Creator</span>
                  </div>
                  <p className="text-[14px] text-[#E7E5D8] leading-relaxed">
                    Publish a route only you know. Every time someone else finds it and finishes it, you earn a share — for as long as people keep discovering what you found first.
                  </p>
                </div>
              </div>

              <div className="text-[12.5px] text-[#B4B2A4] pt-1 flex items-center gap-2">
                <span className="text-[#CCFF00]">✓</span> 
                <b>Why photo proof over points?</b> A route only pays out when real photos back it up — keeping creator royalties honest and farm-free.
              </div>
            </div>
          </div>
        </section>

        {/* LORE SECTION: THE BLUE HOUR */}
        <section className="screen border-b border-[#E7E5D8] py-14 md:py-20 bg-[#F4F3E8]/60">
          <div className="max-w-[820px] mx-auto text-center">
            <div className="tag-badge mx-auto mb-3">Brand Lore</div>
            <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">The Blue Hour</h2>
            <p className="text-[#5B5B52] text-[17px] leading-relaxed italic">
              &quot;The blue hour is that quiet window right after sunset when the sky turns indigo and the trails go silent. It’s when the day’s journey turns into stories around small fires.&quot;
            </p>
          </div>
        </section>

        {/* ASYMMETRIC EDITORIAL DISCOVER FEED SECTION */}
        <section className="screen border-b border-[#E7E5D8] py-14 md:py-20">
          <div className="flex justify-between items-baseline mb-8">
            <div>
              <h2 className="text-3xl font-black mb-1">Discover unusual trails</h2>
              <p className="text-[#5B5B52] text-[14px]">Where do you want to disappear to?</p>
            </div>
            <Link href="/discover" className="text-[14px] font-bold text-[#15150F] hover:underline">
              View all routes →
            </Link>
          </div>

          {/* Asymmetric 2+1 Layout Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Card 1: Large Featured 2-Column Span */}
            <Link href="/routes/ghost-romania" className="md:col-span-8 bg-white border border-[#E7E5D8] rounded-[24px] overflow-hidden group hover:border-[#CCFF00] transition-all flex flex-col justify-between p-6 md:p-8 relative shadow-xs">
              <div className="h-[220px] bg-[#FBFAF3] border border-[#E7E5D8] rounded-[18px] flex items-center justify-center p-6 mb-6 relative overflow-hidden">
                <svg className="w-16 h-16 text-[#15150F] group-hover:scale-105 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>
                <div className="absolute top-4 left-4 bg-[#CCFF00] text-[#3A4A00] text-[11px] font-black tracking-wider uppercase px-3 py-1 rounded-full shadow-xs">
                  Featured Trail
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black mb-2 text-[#15150F]">Carpathian Ridge & Night Rail</h3>
                <p className="text-[14.5px] text-[#5B5B52] leading-relaxed mb-6">
                  Unmarked forest paths, wooden sleeper coaches, foggy mountain cabins.
                </p>
                <div className="flex items-center justify-between text-[13px] text-[#B4B2A4] border-t border-[#E7E5D8] pt-4">
                  <span>8 days · 3 stops</span>
                  <span className="font-extrabold text-[#15150F] text-[15px]">€650 budget</span>
                </div>
              </div>
            </Link>

            {/* Right Side Column */}
            <div className="md:col-span-4 space-y-6 flex flex-col justify-between">
              {/* Card 2: Coastal */}
              <Link href="/routes/italy-coast" className="bg-white border border-[#E7E5D8] rounded-[24px] p-6 hover:border-[#CCFF00] transition-all block flex-1 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-[#FBFAF3] border border-[#E7E5D8] text-[#5B5B52] text-[10.5px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                      Coastal Path
                    </span>
                    <span className="text-[12px] font-bold text-[#3A4A00] bg-[#CCFF00] px-2.5 py-0.5 rounded-full">
                      USDC Payout
                    </span>
                  </div>
                  <h3 className="text-[18px] font-black mb-2">Hidden Coastal Towns of Calabria</h3>
                  <p className="text-[13px] text-[#5B5B52] leading-relaxed mb-4">
                    Seaside cliff trails, zero tourists, €1.20 espresso on Calabria&apos;s shore.
                  </p>
                </div>
                <div className="flex justify-between text-[12.5px] text-[#B4B2A4] border-t border-[#E7E5D8] pt-3">
                  <span>7 days</span>
                  <b className="text-[#15150F]">€850</b>
                </div>
              </Link>

              {/* Card 3: Tokyo Cafe */}
              <Link href="/routes/tokyo-cafe" className="bg-white border border-[#E7E5D8] rounded-[24px] p-6 hover:border-[#CCFF00] transition-all block flex-1 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-[#FBFAF3] border border-[#E7E5D8] text-[#5B5B52] text-[10.5px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                      Night City
                    </span>
                    <span className="text-[12px] font-bold text-[#3A4A00] bg-[#CCFF00] px-2.5 py-0.5 rounded-full">
                      USDC Payout
                    </span>
                  </div>
                  <h3 className="text-[18px] font-black mb-2">Rainy Tokyo Café & Vinyl Alleys</h3>
                  <p className="text-[13px] text-[#5B5B52] leading-relaxed mb-4">
                    Basement vinyl bars, narrow alleys, steam over midnight ramen.
                  </p>
                </div>
                <div className="flex justify-between text-[12.5px] text-[#B4B2A4] border-t border-[#E7E5D8] pt-3">
                  <span>10 days</span>
                  <b className="text-[#15150F]">€1,200</b>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
