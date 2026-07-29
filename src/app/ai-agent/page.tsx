'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useWallet } from '@/context/WalletContext';
import { SignInModal } from '@/components/SignInModal';

function WrenLoreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { connected } = useWallet();
  const [signInOpen, setSignInOpen] = useState(false);

  const initialPrompt = searchParams.get('prompt') || '';

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
    <div className="screen py-10 md:py-16">
      {/* HERO */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-10 items-center mb-14">
        <div>
          <div className="tag-badge">Meet the agent</div>
          <h1 className="text-4xl md:text-5xl font-black mb-5 tracking-tight leading-[1.1]">
            Wren doesn&apos;t book flights.<br />Wren finds the trail nobody<br />wrote about yet.
          </h1>
          <p className="text-[#5B5B52] text-[16px] leading-relaxed max-w-[540px] mb-7">
            A small migratory companion who&apos;s seen a hundred ridgelines and still gets excited about the next one.
            Tell Wren a mood — foggy, hungry, restless, slow — and it plots a route with real stops, not a brochure.
          </p>
          <button
            onClick={goToChat}
            className="bg-[#15150F] text-[#CCFF00] font-bold py-3.5 px-7 rounded-full text-[15px] hover:opacity-90 transition-all"
          >
            {connected ? 'Chat with Wren in your profile →' : 'Sign in to chat with Wren →'}
          </button>
        </div>

        <div className="flex items-center justify-center">
          <div className="relative w-full aspect-square rounded-[24px] bg-gradient-to-br from-[#F4F8E0] to-[#FBFAF3] border border-[#E7E5D8] flex items-center justify-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/wren-mascot.png"
              alt="Wren, the Bluehour AI travel agent"
              className="w-[78%] h-[78%] object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <span className="absolute text-[64px] pointer-events-none opacity-90">🕊️</span>
          </div>
        </div>
      </div>

      {/* WHO IS WREN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
        <div className="bg-white border border-[#E7E5D8] rounded-[18px] p-6 border-t-[3px] border-t-[#CCFF00]">
          <h3 className="text-[16px] font-bold mb-2">Only talks travel</h3>
          <p className="text-[13.5px] text-[#5B5B52] leading-relaxed">
            Routes, trails, weather on the road, packing, timing, the feeling of finding somewhere first. Ask it about
            politics or the news and it just says: &quot;That&apos;s not my trail.&quot;
          </p>
        </div>
        <div className="bg-white border border-[#E7E5D8] rounded-[18px] p-6 border-t-[3px] border-t-[#CCFF00]">
          <h3 className="text-[16px] font-bold mb-2">Plots the whole thing</h3>
          <p className="text-[13.5px] text-[#5B5B52] leading-relaxed">
            One thread, a full route back — stops, coordinates, rough days — saved straight to your atlas, ready to
            publish or take yourself.
          </p>
        </div>
        <div className="bg-white border border-[#E7E5D8] rounded-[18px] p-6 border-t-[3px] border-t-[#CCFF00]">
          <h3 className="text-[16px] font-bold mb-2">Lives in your profile</h3>
          <p className="text-[13.5px] text-[#5B5B52] leading-relaxed">
            Sign in once, chat any time from your profile — no separate chat page to hunt for, no logging in twice.
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="bg-white border border-[#E7E5D8] rounded-[20px] p-7 grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
        <div>
          <div className="text-[12px] text-[#B4B2A4] font-bold uppercase tracking-wider mb-1">Avg. time to a route</div>
          <div className="text-[22px] font-black">38 sec</div>
        </div>
        <div>
          <div className="text-[12px] text-[#B4B2A4] font-bold uppercase tracking-wider mb-1">Daily messages</div>
          <div className="text-[22px] font-black">30 / day, signed in</div>
        </div>
        <div>
          <div className="text-[12px] text-[#B4B2A4] font-bold uppercase tracking-wider mb-1">Settlement</div>
          <div className="text-[22px] font-black text-[#3A4A00]">Gas-sponsored onchain</div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={goToChat}
          className="bg-[#CCFF00] text-[#3A4A00] font-black py-3.5 px-8 rounded-full text-[15px] hover:opacity-90 transition-all"
        >
          {connected ? 'Go chat with Wren →' : 'Sign in and try Wren →'}
        </button>
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
