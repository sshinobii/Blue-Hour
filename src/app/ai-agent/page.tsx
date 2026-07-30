'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useWallet } from '@/context/WalletContext';
import { SignInModal } from '@/components/SignInModal';

// ─── Inline SVG: Wren Lore Orbit ──────────────────────────────────────────────
function WrenOrbitIllustration() {
  return (
    <svg viewBox="0 0 320 320" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* Orbit rings */}
      <circle cx="160" cy="160" r="130" fill="none" stroke="#CCFF00" strokeWidth="1" strokeDasharray="4 8" strokeOpacity="0.3" />
      <circle cx="160" cy="160" r="100" fill="none" stroke="#15150F" strokeWidth="0.8" strokeDasharray="3 6" strokeOpacity="0.12" />

      {/* Neon glow center */}
      <circle cx="160" cy="160" r="55" fill="#CCFF00" opacity="0.15" />
      <circle cx="160" cy="160" r="40" fill="#CCFF00" opacity="0.18" />

      {/* Orbiting concept dots */}
      {/* Route dot */}
      <circle cx="260" cy="100" r="12" fill="#CCFF00" stroke="#15150F" strokeWidth="2" />
      <text x="260" y="104" textAnchor="middle" fontSize="8" fontWeight="800" fill="#3A4A00">ROUTE</text>

      {/* Proof dot */}
      <circle cx="80" cy="240" r="12" fill="#15150F" stroke="#CCFF00" strokeWidth="2" />
      <text x="80" y="244" textAnchor="middle" fontSize="8" fontWeight="800" fill="#CCFF00">PROOF</text>

      {/* Reward dot */}
      <circle cx="270" cy="230" r="12" fill="#CCFF00" stroke="#15150F" strokeWidth="2" />
      <text x="270" y="234" textAnchor="middle" fontSize="7.5" fontWeight="800" fill="#3A4A00">USDC</text>

      {/* Mood dot */}
      <circle cx="60" cy="90" r="12" fill="#15150F" stroke="#CCFF00" strokeWidth="2" />
      <text x="60" y="94" textAnchor="middle" fontSize="7.5" fontWeight="800" fill="#CCFF00">MOOD</text>

      {/* Center W text */}
      <text x="160" y="170" textAnchor="middle" fontSize="44" fontWeight="900" fill="#15150F" letterSpacing="-1">W</text>
      <text x="160" y="185" textAnchor="middle" fontSize="10" fontWeight="700" fill="#5B5B52">WREN</text>

      {/* Connecting lines from center to orbs */}
      <line x1="160" y1="120" x2="248" y2="103" stroke="#CCFF00" strokeWidth="1" strokeOpacity="0.4" />
      <line x1="160" y1="200" x2="92" y2="235" stroke="#CCFF00" strokeWidth="1" strokeOpacity="0.4" />
      <line x1="190" y1="180" x2="258" y2="225" stroke="#CCFF00" strokeWidth="1" strokeOpacity="0.4" />
      <line x1="130" y1="130" x2="72" y2="95" stroke="#CCFF00" strokeWidth="1" strokeOpacity="0.4" />
    </svg>
  );
}

// ─── Sample Wren conversation ──────────────────────────────────────────────────
const DEMO_MESSAGES = [
  { sender: 'user', text: 'I want something foggy, slow trains, mountain towns, under €700, 7 days' },
  { sender: 'wren', text: 'Here\'s what I\'m seeing for you: Kyoto → Takayama → Kanazawa by local sleeper train. Three alpine stops, three distinct energy types — ancient cedar, mountain fog, and lantern alleys.' },
  { sender: 'wren', text: 'Day 1-2: Kyoto back alleys after midnight. Day 3: slow train through Japanese Alps. Day 4-5: Takayama wooden tea houses & morning markets. Day 6-7: Kanazawa castle gardens & vinyl bars. Total budget: €640 with a €60 buffer.' },
];

// ─── Main Content ─────────────────────────────────────────────────────────────
function WrenLoreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { connected } = useWallet();
  const [signInOpen, setSignInOpen] = useState(false);
  const [demoVisible, setDemoVisible] = useState(0);

  const initialPrompt = searchParams.get('prompt') || '';

  // Animate demo messages appearing
  useEffect(() => {
    if (demoVisible < DEMO_MESSAGES.length) {
      const timer = setTimeout(() => setDemoVisible((v) => v + 1), 900);
      return () => clearTimeout(timer);
    }
  }, [demoVisible]);

  const goToChat = () => {
    if (!connected) {
      setSignInOpen(true);
      return;
    }
    const target = initialPrompt
      ? `/profile?prompt=${encodeURIComponent(initialPrompt)}`
      : '/profile';
    router.push(target);
  };

  return (
    <div className="screen py-12 md:py-20">

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-12 items-center mb-20">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#CCFF00] text-[#3A4A00] font-black text-[10.5px] uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-[#3A4A00] animate-pulse" />
            Meet the agent
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-[1.05]">
            Wren doesn&apos;t book flights.<br />
            <span className="text-[#5B5B52]">Wren finds the trail</span><br />
            <span className="relative inline-block">
              nobody wrote about yet.
              <span className="absolute bottom-1 left-0 w-full h-3 bg-[#CCFF00] -z-10 rounded" />
            </span>
          </h1>
          <p className="text-[#5B5B52] text-[16px] leading-relaxed max-w-[540px] mb-8">
            A small migratory companion who&apos;s seen a hundred ridgelines and still gets excited about the next one. Tell Wren a mood — foggy, hungry, restless, slow — and it plots a route with real stops, not a brochure. Pays for its own compute via x402. No seed phrases.
          </p>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={goToChat}
              className="bg-[#15150F] text-[#CCFF00] font-bold py-3.5 px-8 rounded-full text-[15px] hover:bg-[#CCFF00] hover:text-[#3A4A00] transition-all"
            >
              {connected ? 'Chat with Wren in your atlas →' : 'Sign in to chat with Wren →'}
            </button>
          </div>
        </div>

        {/* Orbit illustration */}
        <div className="hidden md:flex items-center justify-center">
          <div className="relative w-[280px] h-[280px]">
            <WrenOrbitIllustration />
          </div>
        </div>
      </div>

      {/* ── LIVE DEMO CHAT ─────────────────────────────────────────────── */}
      <div className="mb-20">
        <div className="inline-block bg-[#CCFF00] text-[#3A4A00] text-[10.5px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-6">
          See it in action
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-black mb-3 text-[#15150F]">One message. A full trail back.</h2>
            <p className="text-[#5B5B52] text-[15px] leading-relaxed mb-6 max-w-[420px]">
              No forms. No dropdowns. Just describe what you&apos;re feeling and Wren returns a real itinerary — stops, coordinates, budget, timing — ready to publish or take yourself.
            </p>
            <div className="space-y-3">
              {[
                { label: '38 sec', sub: 'avg. time to a full route' },
                { label: '30 / day', sub: 'chat messages, signed in' },
                { label: 'x402', sub: 'AI compute micropayment' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-4 bg-white border border-[#E7E5D8] rounded-[14px] px-5 py-3.5">
                  <div className="text-[20px] font-black text-[#15150F] w-20 shrink-0">{stat.label}</div>
                  <div className="text-[13px] text-[#5B5B52]">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Demo chat window */}
          <div className="bg-white border border-[#E7E5D8] rounded-[24px] overflow-hidden shadow-md">
            <div className="bg-[#15150F] px-5 py-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#CCFF00] border-2 border-[#CCFF00] flex items-center justify-center overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/wren-mascot.png" alt="Wren" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-white font-black text-[14px]">Wren</div>
                <div className="text-[#CCFF00] text-[10.5px] font-bold">● Active · x402 enabled</div>
              </div>
            </div>
            <div className="p-5 space-y-3 min-h-[260px]">
              {DEMO_MESSAGES.slice(0, demoVisible).map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div
                    className={`max-w-[82%] px-4 py-3 rounded-[14px] text-[13px] leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#15150F] text-[#CCFF00] font-medium rounded-br-sm'
                        : 'bg-[#F4F3E8] text-[#15150F] border border-[#E7E5D8] rounded-bl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {demoVisible < DEMO_MESSAGES.length && (
                <div className="flex justify-start">
                  <div className="bg-[#F4F3E8] border border-[#E7E5D8] px-4 py-3 rounded-[14px] flex gap-1.5 items-center">
                    <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>
            <div className="border-t border-[#E7E5D8] px-5 py-3.5">
              <button
                onClick={goToChat}
                className="w-full bg-[#CCFF00] text-[#3A4A00] font-black py-3 rounded-[12px] text-[13.5px] hover:opacity-90 transition-all"
              >
                {connected ? 'Open your Wren chat →' : 'Sign in to try Wren →'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── CHARACTER CARDS ─────────────────────────────────────────────── */}
      <div className="mb-20">
        <h2 className="text-2xl font-black mb-6 text-[#15150F]">Who is Wren?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: '🦅',
              title: 'Only talks travel',
              desc: 'Routes, trails, weather on the road, packing, timing, the feeling of finding somewhere first. Ask about politics: "That\'s not my trail."',
            },
            {
              icon: '🗺️',
              title: 'Plots the whole thing',
              desc: 'One message, a full itinerary back — stops, coordinates, rough days — saved to your atlas, ready to publish or take yourself.',
            },
            {
              icon: '⚡',
              title: 'Pays its own way',
              desc: 'Wren uses x402 gasless micropayments to cover AI compute costs. $0.25 USDG per deep route. No wallet popups, no gas, settled onchain.',
            },
          ].map((card) => (
            <div key={card.title} className="bg-white border border-[#E7E5D8] rounded-[20px] p-6 border-t-[3px] border-t-[#CCFF00] hover:border-[#CCFF00] transition-all group">
              <div className="text-[28px] mb-4">{card.icon}</div>
              <h3 className="text-[16px] font-black mb-2 text-[#15150F]">{card.title}</h3>
              <p className="text-[13.5px] text-[#5B5B52] leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── BOTTOM CTA ──────────────────────────────────────────────────── */}
      <div className="bg-[#15150F] rounded-[28px] p-10 md:p-14 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#CCFF00] opacity-10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-[#CCFF00] opacity-5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="text-[#CCFF00] text-[11px] font-black uppercase tracking-widest mb-4">Where do you want to disappear?</div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-5 leading-[1.1]">
            Tell Wren a vibe.<br />
            Get a real trail back.
          </h2>
          <p className="text-[#B4B2A4] text-[15px] max-w-[480px] mx-auto mb-8 leading-relaxed">
            A mood, a budget, a feeling. Wren returns a full route — stops, coordinates, days — in under a minute. No forms. No tourist traps.
          </p>
          <button
            onClick={goToChat}
            className="bg-[#CCFF00] text-[#3A4A00] font-black py-4 px-10 rounded-full text-[16px] hover:opacity-90 transition-all inline-block shadow-md"
          >
            {connected ? 'Go chat with Wren →' : 'Sign in and try Wren →'}
          </button>
        </div>
      </div>

      <SignInModal isOpen={signInOpen} onClose={() => setSignInOpen(false)} />
    </div>
  );
}

export default function WrenAgentPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBFAF3] text-[#15150F]">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="screen py-16 text-center text-[#5B5B52]">Loading Wren...</div>}>
          <WrenLoreContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
