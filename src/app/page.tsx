'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { dbClient, Route } from '@/lib/db';

// ─── Inline SVG Illustrations ────────────────────────────────────────────────

function RouteMapIllustration() {
  return (
    <svg viewBox="0 0 480 260" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* Grid dots background */}
      {Array.from({ length: 8 }).map((_, row) =>
        Array.from({ length: 16 }).map((_, col) => (
          <circle key={`${row}-${col}`} cx={col * 32 + 8} cy={row * 34 + 8} r="1.5" fill="#15150F" opacity="0.08" />
        ))
      )}
      {/* Route paths */}
      <path d="M 40,180 Q 100,60 200,140 T 380,80 T 460,160" fill="none" stroke="#15150F" strokeWidth="1.5" strokeDasharray="6 5" strokeOpacity="0.2" />
      <path d="M 20,100 Q 130,220 260,100 T 460,180" fill="none" stroke="#15150F" strokeWidth="1.5" strokeDasharray="6 5" strokeOpacity="0.15" />

      {/* Main featured route */}
      <path d="M 60,200 C 120,120 180,80 260,130 C 330,170 380,60 440,100" fill="none" stroke="#15150F" strokeWidth="2.5" strokeDasharray="9 5" />

      {/* Stop dots */}
      <circle cx="60" cy="200" r="6" fill="#CCFF00" stroke="#15150F" strokeWidth="2.5" />
      <circle cx="260" cy="130" r="10" fill="#CCFF00" stroke="#15150F" strokeWidth="3" />
      <circle cx="440" cy="100" r="6" fill="#15150F" stroke="#CCFF00" strokeWidth="2.5" />

      {/* Small inactive stops */}
      <circle cx="150" cy="140" r="4" fill="white" stroke="#15150F" strokeWidth="1.5" />
      <circle cx="340" cy="90" r="4" fill="white" stroke="#15150F" strokeWidth="1.5" />

      {/* Neon accent pin at active stop */}
      <rect x="248" y="104" width="24" height="18" rx="5" fill="#CCFF00" />
      <text x="260" y="117" textAnchor="middle" fontSize="9" fontWeight="800" fill="#3A4A00">YOU</text>
      <polygon points="260,122 254,128 266,128" fill="#CCFF00" />

      {/* Mountain silhouettes in background */}
      <path d="M 300,200 L 340,140 L 380,200 Z" fill="#15150F" opacity="0.06" />
      <path d="M 360,200 L 410,120 L 460,200 Z" fill="#15150F" opacity="0.04" />
      <path d="M 30,200 L 80,150 L 130,200 Z" fill="#15150F" opacity="0.05" />
    </svg>
  );
}

function WanderingFigureIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* Background circle */}
      <circle cx="100" cy="100" r="90" fill="#CCFF00" opacity="0.12" />
      <circle cx="100" cy="100" r="70" fill="#CCFF00" opacity="0.08" />

      {/* Wanderer figure */}
      {/* Head */}
      <circle cx="100" cy="55" r="14" fill="#15150F" />
      {/* Body */}
      <rect x="91" y="70" width="18" height="36" rx="6" fill="#15150F" />
      {/* Backpack */}
      <rect x="103" y="73" width="12" height="22" rx="4" fill="#CCFF00" />
      {/* Left arm with walking stick */}
      <line x1="91" y1="80" x2="72" y2="105" stroke="#15150F" strokeWidth="4" strokeLinecap="round" />
      <line x1="72" y1="105" x2="68" y2="140" stroke="#15150F" strokeWidth="3" strokeLinecap="round" />
      {/* Right arm */}
      <line x1="109" y1="80" x2="122" y2="98" stroke="#15150F" strokeWidth="4" strokeLinecap="round" />
      {/* Legs */}
      <line x1="97" y1="106" x2="85" y2="140" stroke="#15150F" strokeWidth="5" strokeLinecap="round" />
      <line x1="103" y1="106" x2="118" y2="138" stroke="#15150F" strokeWidth="5" strokeLinecap="round" />
      {/* Shoes */}
      <ellipse cx="83" cy="142" rx="9" ry="5" fill="#15150F" />
      <ellipse cx="120" cy="140" rx="9" ry="5" fill="#15150F" />

      {/* Stars/sparkles around */}
      <text x="140" y="45" fontSize="14" fill="#CCFF00">✦</text>
      <text x="48" y="72" fontSize="10" fill="#CCFF00" opacity="0.7">✦</text>
      <text x="155" y="110" fontSize="8" fill="#CCFF00" opacity="0.6">✦</text>
    </svg>
  );
}

function TokenFlowIllustration() {
  return (
    <svg viewBox="0 0 320 120" className="w-full" xmlns="http://www.w3.org/2000/svg">
      {/* Nodes */}
      <circle cx="40" cy="60" r="24" fill="#CCFF00" stroke="#15150F" strokeWidth="2" />
      <text x="40" y="55" textAnchor="middle" fontSize="8" fontWeight="800" fill="#3A4A00">WREN</text>
      <text x="40" y="67" textAnchor="middle" fontSize="7" fill="#3A4A00">AI agent</text>

      <path d="M 65,60 L 120,60" stroke="#15150F" strokeWidth="2" markerEnd="url(#arr)" strokeDasharray="4 3" />
      <text x="92" y="53" textAnchor="middle" fontSize="8" fill="#5B5B52">x402</text>
      <text x="92" y="73" textAnchor="middle" fontSize="7.5" fill="#CCFF00" fontWeight="700">$0.25 USDG</text>

      <circle cx="148" cy="60" r="24" fill="#15150F" stroke="#CCFF00" strokeWidth="2" />
      <text x="148" y="55" textAnchor="middle" fontSize="8" fontWeight="800" fill="#CCFF00">SERVER</text>
      <text x="148" y="67" textAnchor="middle" fontSize="7" fill="#CCFF00" opacity="0.7">compute</text>

      <path d="M 173,60 L 228,60" stroke="#15150F" strokeWidth="2" strokeDasharray="4 3" />
      <text x="200" y="53" textAnchor="middle" fontSize="8" fill="#5B5B52">route</text>
      <text x="200" y="73" textAnchor="middle" fontSize="7.5" fill="#3A4A00" fontWeight="700">settled</text>

      <circle cx="256" cy="60" r="24" fill="#CCFF00" stroke="#15150F" strokeWidth="2" />
      <text x="256" y="55" textAnchor="middle" fontSize="8" fontWeight="800" fill="#3A4A00">NOMAD</text>
      <text x="256" y="67" textAnchor="middle" fontSize="7" fill="#3A4A00">wallet</text>

      <defs>
        <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 Z" fill="#15150F" />
        </marker>
      </defs>
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HomePage() {
  const router = useRouter();
  const [promptInput, setPromptInput] = useState('');
  const [liveRoutes, setLiveRoutes] = useState<Route[]>([]);
  const [tick, setTick] = useState(0);
  const [copiedCa, setCopiedCa] = useState(false);

  const TOKEN_CA = '0x020c2252a8880e0e882957ee95421ca0f26e2742';

  const handleCopyCa = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(TOKEN_CA);
      setCopiedCa(true);
      setTimeout(() => setCopiedCa(false), 2000);
    }
  };

  useEffect(() => {
    const loadRoutes = async () => {
      const r = await dbClient.getRoutes();
      setLiveRoutes(r);
    };
    loadRoutes();
    // Subtle live counter pulse
    const interval = setInterval(() => setTick((t) => t + 1), 5000);
    return () => clearInterval(interval);
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
    id: 'kumano-trek',
    title: 'Kumano Kodo Ancient Forest Trek',
    stops: [1, 2, 3],
    creator_id: 'usr_aura',
  };

  const routeCount = liveRoutes.length || 24;

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFAF3] text-[#15150F]">
      <Navbar />

      <main className="flex-1">

        {/* ─── HERO ─────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-b border-[#E7E5D8]">
          {/* Large neon glow blob top-right */}
          <div className="pointer-events-none absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-[#CCFF00] opacity-[0.09] blur-[80px]" />

          <div className="screen py-14 md:py-20 border-b-0">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_400px] gap-12 items-center">
              {/* Left copy */}
              <div>
                <div className="inline-flex items-center gap-2 bg-[#CCFF00] text-[#3A4A00] font-black text-[10.5px] uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-6 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-[#3A4A00] animate-pulse" />
                  AI travel agent · Robinhood Chain
                </div>

                <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.05] tracking-tight mb-5">
                  Where do you<br />
                  want to{' '}
                  <span className="relative inline-block">
                    <span className="relative z-10">disappear?</span>
                    <span className="absolute inset-0 -skew-x-2 bg-[#CCFF00] rounded-md z-0 -mx-1" />
                  </span>
                </h1>

                <p className="text-[#5B5B52] text-[17px] max-w-[520px] leading-relaxed mb-8">
                  The AI travel companion for web3 nomads. Tell Wren a mood — restless, foggy, hungry for silence — and it plots a route nobody&apos;s written about yet. Go find it. Prove you were there. Let the road pay you back.
                </p>

                {/* Prompt bar */}
                <form onSubmit={handlePlanSubmit} className="flex gap-2 bg-white border-2 border-[#15150F] rounded-[20px] p-2 max-w-[640px] shadow-sm mb-4">
                  <input
                    type="text"
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    placeholder="foggy alpine rail, under €700, 7 days..."
                    className="flex-1 bg-transparent border-none text-[#15150F] text-[15px] px-4 py-2.5 outline-none placeholder-[#B4B2A4]"
                  />
                  <button
                    type="submit"
                    className="bg-[#15150F] text-[#CCFF00] rounded-[14px] px-7 py-2.5 font-extrabold text-[14px] cursor-pointer hover:bg-[#CCFF00] hover:text-[#3A4A00] transition-all flex items-center gap-1.5 whitespace-nowrap"
                  >
                    Plan it →
                  </button>
                </form>

                {/* Mood chips */}
                <div className="flex gap-2 flex-wrap">
                  {[
                    'unmarked forest paths & mountain cabins',
                    'high alpine ridge walks & wooden shelters',
                    'coastal cliff trekking, zero tourists',
                    'ancient forest trails on foot',
                  ].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleChipClick(chip)}
                      className="chip-item text-[12px] hover:border-[#CCFF00] hover:bg-[#CCFF00]/10 hover:text-[#3A4A00]"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: animated route map */}
              <div className="hidden md:flex items-center justify-center">
                <div className="relative w-full max-w-[420px] bg-white border border-[#E7E5D8] rounded-[28px] p-5 shadow-md overflow-hidden">
                  {/* Live badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-[#CCFF00] border border-[#3A4A00] animate-pulse" />
                    <span className="text-[11.5px] font-bold text-[#15150F]">{routeCount} mystery routes live</span>
                  </div>
                  <div className="w-full h-[200px]">
                    <RouteMapIllustration />
                  </div>
                  {/* Bottom info card */}
                  <div className="mt-4 bg-[#FBFAF3] border border-[#E7E5D8] rounded-[14px] px-4 py-3 flex items-center justify-between">
                    <div>
                      <div className="text-[12.5px] font-black text-[#15150F]">{featuredRoute.title}</div>
                      <div className="text-[11px] text-[#B4B2A4]">3 stops proved · USDC settled</div>
                    </div>
                    <div className="bg-[#CCFF00] text-[#3A4A00] text-[10.5px] font-black px-3 py-1 rounded-full">✓ Live</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* $HOUR TOKEN CONTRACT ADDRESS BANNER */}
          <div className="bg-[#15150F] text-white py-3.5 px-6 border-t border-b border-[#E7E5D8] flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-[#CCFF00] text-[#3A4A00] font-black text-[11.5px] px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                $HOUR Token
              </div>
              <span className="text-[13px] font-bold text-[#E7E5D8]">
                Robinhood Chain CA:
              </span>
              <code className="text-[#CCFF00] font-mono text-[12.5px] bg-white/10 px-3 py-1 rounded-lg border border-white/15 tracking-tight select-all">
                {TOKEN_CA}
              </code>
            </div>
            <button
              onClick={handleCopyCa}
              className="bg-[#CCFF00] text-[#3A4A00] font-black text-[12px] px-4 py-1.5 rounded-full hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              {copiedCa ? '✓ Copied to clipboard' : 'Copy CA'}
            </button>
          </div>

          {/* Neon ticker strip */}
          <div className="w-full bg-[#CCFF00] border-y border-[#15150F]/10 overflow-hidden py-3">
            <div className="marquee-track">
              {[0, 1].map((rep) => (
                <div key={rep} className="flex items-center gap-10 pr-10 shrink-0">
                  {['WHERE DO YOU WANT TO DISAPPEAR?', 'WEB3 NOMADS', 'MYSTERY ROUTES', 'ONCHAIN REWARDS', 'ROBINHOOD CHAIN', 'PHOTO PROOF', 'SHARE THE TRAIL'].map((word) => (
                    <span key={word + rep} className="text-[#3A4A00] font-black text-[12px] tracking-widest uppercase whitespace-nowrap">
                      {word} <span className="text-[#3A4A00]/30 ml-10">◆</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── MEET WREN ────────────────────────────────────────────────── */}
        <section className="screen border-b border-[#E7E5D8] py-16 md:py-24 bg-white border-b-0">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            {/* Mascot */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[340px]">
                {/* Neon glow ring behind mascot */}
                <div className="absolute inset-0 rounded-full bg-[#CCFF00] opacity-20 blur-2xl scale-75" />
                <div className="relative aspect-square flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/wren-mascot.png"
                    alt="Wren, the Bluehour AI travel companion"
                    className="w-full h-full object-contain wren-float"
                  />
                </div>
                {/* Floating mood badges */}
                <div className="absolute -top-2 -right-4 bg-[#CCFF00] text-[#3A4A00] text-[11px] font-black px-3 py-1.5 rounded-full shadow-md rotate-3 whitespace-nowrap">
                  38 sec to a route ⚡
                </div>
                <div className="absolute -bottom-2 -left-4 bg-[#15150F] text-[#CCFF00] text-[11px] font-black px-3 py-1.5 rounded-full shadow-md -rotate-2 whitespace-nowrap">
                  No tourist traps ✓
                </div>
              </div>
            </div>

            {/* Copy */}
            <div className="md:col-span-7 space-y-5">
              <div className="inline-block bg-[#CCFF00] text-[#3A4A00] text-[10.5px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full">
                AI Companion
              </div>
              <h2 className="text-3xl md:text-5xl font-black leading-[1.1] text-[#15150F]">
                Meet Wren.<br />
                <span className="text-[#5B5B52] font-black">Your migratory guide.</span>
              </h2>
              <p className="text-[#5B5B52] text-[16px] leading-relaxed max-w-[480px]">
                Wren is a hooded falcon who&apos;s flown a hundred ridgelines and still gets excited about the next one. Tell it a mood — foggy, restless, hungry for quiet — and it plots an unmapped journey tailored to you. Not a brochure. A real route.
              </p>

              {/* Features row */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { label: 'Only talks travel', sub: 'Ask about politics: "That\'s not my trail."' },
                  { label: 'Plots the whole thing', sub: 'Stops, coords, days — ready to publish.' },
                  { label: 'Lives in your profile', sub: 'No separate chat page to hunt for.' },
                ].map((f) => (
                  <div key={f.label} className="bg-[#FBFAF3] border border-[#E7E5D8] rounded-[14px] p-4">
                    <div className="text-[12.5px] font-black text-[#15150F] mb-1">{f.label}</div>
                    <div className="text-[11.5px] text-[#B4B2A4] leading-relaxed">{f.sub}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/ai-agent"
                  className="bg-[#15150F] text-[#CCFF00] font-extrabold px-6 py-3 rounded-full text-[14px] hover:bg-[#CCFF00] hover:text-[#3A4A00] transition-all inline-block shadow-xs"
                >
                  Meet Wren →
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

        {/* ─── x402 AI PAYMENTS ─────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-b border-[#E7E5D8]">
          <div className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#CCFF00] opacity-[0.07] blur-[80px]" />
          <div className="screen py-16 md:py-24 border-b-0">
            <div className="text-center max-w-[660px] mx-auto mb-14">
              <div className="inline-block bg-[#CCFF00] text-[#3A4A00] text-[10.5px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-5">
                Built on Robinhood Chain
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-[#15150F] mb-4">
                The agentic economy,<br />running on rails.
              </h2>
              <p className="text-[#5B5B52] text-[16px] leading-relaxed">
                Wren pays for its own compute via x402 gasless micropayments — HTTP 402 protocol, USDG settlement, no wallet popups. Built on Robinhood Chain: sub-penny fees, instant EVM finality.
              </p>
            </div>

            {/* x402 flow diagram */}
            <div className="bg-[#15150F] rounded-[28px] p-8 md:p-10 mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[280px] h-[280px] bg-[#CCFF00]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-[#CCFF00]/5 rounded-full blur-3xl pointer-events-none" />

              <div className="inline-block bg-[#CCFF00] text-[#3A4A00] text-[10.5px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-6">
                x402 Payment Flow
              </div>

              <div className="w-full max-w-[560px]">
                <TokenFlowIllustration />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
                {[
                  { step: '01', title: 'Wren sends x402 request', desc: 'AI agent calls the route generation endpoint — server responds HTTP 402 with USDG payment challenge.' },
                  { step: '02', title: 'Gasless micropayment', desc: 'EIP-3009 signature signs $0.25 USDG — no gas, no wallet popup. Settled instantly via Robinhood Chain facilitator.' },
                  { step: '03', title: 'Route unlocked', desc: 'Server verifies payment, returns deep route data. Full audit trail onchain. Nomad gets the trail, nobody gets spammed.' },
                ].map((s) => (
                  <div key={s.step} className="bg-white/8 border border-white/10 rounded-[16px] p-5">
                    <div className="text-[#CCFF00] font-black text-[11px] tracking-widest mb-2">{s.step}</div>
                    <div className="text-white font-bold text-[14px] mb-2">{s.title}</div>
                    <div className="text-[#B4B2A4] text-[12.5px] leading-relaxed">{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chain specs row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Chain ID', value: '98865', sub: 'Robinhood Chain' },
                { label: 'Settlement', value: 'USDG', sub: 'Gasless EIP-3009' },
                { label: 'AI payment', value: '$0.25', sub: 'per deep route' },
                { label: 'Finality', value: '<1s', sub: 'instant EVM' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white border border-[#E7E5D8] rounded-[18px] p-5 hover:border-[#CCFF00] transition-all">
                  <div className="text-[11px] uppercase tracking-widest text-[#B4B2A4] font-bold mb-1">{stat.label}</div>
                  <div className="text-[22px] font-black text-[#15150F]">{stat.value}</div>
                  <div className="text-[11.5px] text-[#5B5B52]">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── HOW REWARDS WORK ─────────────────────────────────────────── */}
        <section className="screen border-b border-[#E7E5D8] py-16 md:py-24 border-b-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-14">
            <div>
              <div className="inline-block bg-[#CCFF00] text-[#3A4A00] text-[10.5px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-5">
                Onchain Economy
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-[#15150F] leading-[1.1]">
                The road pays<br />you back.
              </h2>
            </div>
            <div>
              <p className="text-[#5B5B52] text-[16px] leading-relaxed">
                Share a mystery route. Every time a new wanderer finds it, finishes it, and proves they were there — you earn an automatic creator royalty, settled onchain. Photo proof keeps it farm-free and honest.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: '1',
                title: 'Ask Wren for a trail',
                desc: 'Describe a mood, a budget, a vibe. Wren plots a route with real stops and coordinates nobody else has published.',
                accent: '#CCFF00',
                accentInk: '#3A4A00',
              },
              {
                num: '2',
                title: 'Walk it. Prove it.',
                desc: 'Take the route stop by stop. Upload a photo at each location — EXIF geo-data verifies you actually stood there.',
                accent: '#15150F',
                accentInk: '#CCFF00',
              },
              {
                num: '3',
                title: 'Get paid onchain.',
                desc: 'Complete the route and a USDC payout settles to your embedded wallet. Publish it and earn royalties forever.',
                accent: '#CCFF00',
                accentInk: '#3A4A00',
              },
            ].map((step) => (
              <div key={step.num} className="bg-white border border-[#E7E5D8] rounded-[24px] p-7 hover:border-[#CCFF00] transition-all group">
                <div
                  className="w-12 h-12 rounded-[14px] flex items-center justify-center font-black text-[20px] mb-5 transition-transform group-hover:scale-105"
                  style={{ background: step.accent, color: step.accentInk }}
                >
                  {step.num}
                </div>
                <h3 className="text-[17px] font-black text-[#15150F] mb-3">{step.title}</h3>
                <p className="text-[13.5px] text-[#5B5B52] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/rewards"
              className="bg-[#15150F] text-[#CCFF00] font-extrabold px-8 py-4 rounded-full text-[15px] hover:bg-[#CCFF00] hover:text-[#3A4A00] transition-all inline-block shadow-xs"
            >
              How rewards work →
            </Link>
            <Link
              href="/routes/create"
              className="bg-white border-2 border-[#15150F] text-[#15150F] font-extrabold px-8 py-4 rounded-full text-[15px] hover:bg-[#15150F] hover:text-[#CCFF00] transition-all inline-block"
            >
              Publish a mystery route
            </Link>
          </div>
        </section>

        {/* ─── DISCOVER EDITORIAL FEED ──────────────────────────────────── */}
        <section className="screen border-b border-[#E7E5D8] py-16 md:py-24 bg-[#F4F3E8]/50 border-b-0">
          <div className="flex justify-between items-baseline mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-black mb-1">Mystery routes</h2>
              <p className="text-[#5B5B52] text-[14.5px]">Share your route. Disappear together.</p>
            </div>
            <Link href="/discover" className="text-[13.5px] font-bold text-[#15150F] hover:underline">
              All routes →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Big card */}
            <Link href="/routes/kumano-trek" className="md:col-span-7 bg-white border border-[#E7E5D8] rounded-[28px] overflow-hidden group hover:border-[#CCFF00] transition-all shadow-xs flex flex-col">
              <div className="h-[200px] bg-[#F4F3E8] relative overflow-hidden flex items-end p-6">
                {/* SVG illustration */}
                <div className="absolute inset-0 opacity-60">
                  <svg viewBox="0 0 600 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 0,160 Q 100,80 200,140 T 400,100 T 600,140" fill="none" stroke="#15150F" strokeWidth="2" strokeDasharray="8 6" strokeOpacity="0.4" />
                    <circle cx="60" cy="148" r="5" fill="#CCFF00" stroke="#15150F" strokeWidth="2" />
                    <circle cx="220" cy="130" r="8" fill="#CCFF00" stroke="#15150F" strokeWidth="2.5" />
                    <circle cx="400" cy="108" r="5" fill="#CCFF00" stroke="#15150F" strokeWidth="2" />
                    <path d="M 380,200 L 420,140 L 460,200 Z" fill="#15150F" opacity="0.1" />
                    <path d="M 430,200 L 480,120 L 530,200 Z" fill="#15150F" opacity="0.08" />
                    <path d="M 500,200 L 550,150 L 600,200 Z" fill="#15150F" opacity="0.06" />
                  </svg>
                </div>
                <div className="absolute top-4 left-4 bg-[#CCFF00] text-[#3A4A00] text-[10.5px] font-black tracking-wider uppercase px-3 py-1 rounded-full shadow-xs z-10">
                  Featured Trail
                </div>
              </div>
              <div className="p-7 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-black mb-2 text-[#15150F] group-hover:text-[#3A4A00] transition-colors">Kumano Kodo Ancient Forest Trek</h3>
                  <p className="text-[14px] text-[#5B5B52] leading-relaxed">Ancient stone paths, high mountain ridges, cedar forest shelters, and quiet waterfall passes walked entirely on foot.</p>
                </div>
                <div className="flex items-center justify-between text-[12.5px] text-[#B4B2A4] border-t border-[#E7E5D8] pt-4 mt-5">
                  <span>8 days · 3 stops</span>
                  <span className="font-extrabold text-[#15150F] text-[14px]">€650</span>
                </div>
              </div>
            </Link>

            {/* Right column */}
            <div className="md:col-span-5 flex flex-col gap-6">
              <Link href="/routes/italy-coast" className="bg-white border border-[#E7E5D8] rounded-[28px] p-6 hover:border-[#CCFF00] transition-all shadow-xs flex-1 flex flex-col justify-between group">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-[#FBFAF3] border border-[#E7E5D8] text-[#5B5B52] text-[10.5px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">Coastal</span>
                    <span className="text-[11.5px] font-bold text-[#3A4A00] bg-[#CCFF00] px-2.5 py-0.5 rounded-full">USDC payout</span>
                  </div>
                  <h3 className="text-[18px] font-black mb-2 group-hover:text-[#3A4A00] transition-colors">Hidden Coastal Towns of Calabria</h3>
                  <p className="text-[13px] text-[#5B5B52] leading-relaxed">Cliffside trails, €1.20 espresso, zero tourists on Calabria&apos;s untouched shore.</p>
                </div>
                <div className="flex justify-between text-[12px] text-[#B4B2A4] border-t border-[#E7E5D8] pt-3 mt-4">
                  <span>7 days</span>
                  <b className="text-[#15150F]">€850</b>
                </div>
              </Link>

              <Link href="/routes/tokyo-cafe" className="bg-white border border-[#E7E5D8] rounded-[28px] p-6 hover:border-[#CCFF00] transition-all shadow-xs flex-1 flex flex-col justify-between group">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-[#FBFAF3] border border-[#E7E5D8] text-[#5B5B52] text-[10.5px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">Night City</span>
                    <span className="text-[11.5px] font-bold text-[#3A4A00] bg-[#CCFF00] px-2.5 py-0.5 rounded-full">USDC payout</span>
                  </div>
                  <h3 className="text-[18px] font-black mb-2 group-hover:text-[#3A4A00] transition-colors">Rainy Tokyo Cafe & Vinyl Alleys</h3>
                  <p className="text-[13px] text-[#5B5B52] leading-relaxed">Basement vinyl bars, narrow alleys, steam over midnight ramen in hidden Tokyo.</p>
                </div>
                <div className="flex justify-between text-[12px] text-[#B4B2A4] border-t border-[#E7E5D8] pt-3 mt-4">
                  <span>10 days</span>
                  <b className="text-[#15150F]">€1,200</b>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ─── BRAND MANIFESTO / BLUE HOUR ─────────────────────────────── */}
        <section className="relative overflow-hidden border-b border-[#E7E5D8]">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#15150F] via-[#1E1E14] to-[#15150F]" />
          {/* Neon glow accents */}
          <div className="pointer-events-none absolute top-10 right-10 w-[300px] h-[300px] rounded-full bg-[#CCFF00] opacity-[0.08] blur-[60px]" />
          <div className="pointer-events-none absolute bottom-0 left-0 w-[200px] h-[200px] rounded-full bg-[#CCFF00] opacity-[0.05] blur-[50px]" />

          <div className="screen py-16 md:py-28 border-b-0 relative z-10">
            <div className="max-w-[760px]">
              <div className="inline-block bg-[#CCFF00] text-[#3A4A00] text-[10.5px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-8">
                The Blue Hour
              </div>
              <blockquote className="text-4xl md:text-6xl font-black text-white leading-[1.1] mb-8">
                &ldquo;That quiet window<br />
                after sunset when<br />
                the trails go{' '}
                <span className="text-[#CCFF00]">silent.</span>&rdquo;
              </blockquote>
              <p className="text-[#B4B2A4] text-[16px] leading-relaxed max-w-[560px] mb-8">
                When the sky turns indigo and the day&apos;s journey becomes a story. Bluehour is built for the nomads who seek that window — the undiscovered hours, the off-map trails, the routes that pay forward.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link href="/discover" className="bg-[#CCFF00] text-[#3A4A00] font-extrabold px-7 py-3.5 rounded-full text-[14px] hover:opacity-90 transition-all inline-block">
                  Start wandering →
                </Link>
                <Link href="/rewards" className="border border-white/20 text-white font-bold px-7 py-3.5 rounded-full text-[14px] hover:bg-white/10 transition-all inline-block">
                  How it works
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── WANDERER ILLUSTRATION CTA ────────────────────────────────── */}
        <section className="screen py-16 md:py-20 border-b-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-black mb-4 leading-[1.15]">
                Share your mystery route.<br />
                <span className="text-[#CCFF00] bg-[#15150F] px-3 py-1 rounded-lg inline-block">Earn forever.</span>
              </h2>
              <p className="text-[#5B5B52] text-[15px] leading-relaxed mb-6 max-w-[440px]">
                Know a trail nobody talks about? Publish it on Bluehour. Every wanderer who completes it sends a royalty to your wallet — onchain, automatic, farm-free.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link href="/routes/create" className="bg-[#15150F] text-[#CCFF00] font-extrabold px-6 py-3 rounded-full text-[14px] hover:bg-[#CCFF00] hover:text-[#3A4A00] transition-all">
                  Publish a trail →
                </Link>
                <Link href="/profile" className="border border-[#E7E5D8] text-[#5B5B52] font-bold px-6 py-3 rounded-full text-[14px] hover:border-[#15150F] hover:text-[#15150F] transition-all">
                  My atlas
                </Link>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative w-[260px] h-[260px]">
                <WanderingFigureIllustration />
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
