'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  const router = useRouter();
  const [promptInput, setPromptInput] = useState('');

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

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFAF3] text-[#15150F]">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="screen border-b border-[#E7E5D8] py-14 md:py-20">
          <div className="tag-badge">AI travel agent · Robinhood Chain</div>
          
          <h1 className="text-4xl md:text-6xl font-black leading-[1.15] tracking-tight mb-6 max-w-[780px]">
            Find the route<br />
            no tourist has<br />
            <span className="bg-[#CCFF00] px-2 py-0.5 rounded-lg inline-block text-[#3A4A00]">found yet.</span>
          </h1>

          <p className="text-[#5B5B52] text-lg max-w-[540px] leading-relaxed mb-8">
            Tell the agent your mood. Get an unusual route. Go, prove you were there, get paid onchain for it.
          </p>

          {/* PROMPT BAR */}
          <form onSubmit={handlePlanSubmit} className="flex gap-2 bg-white border-[1.5px] border-[#15150F] rounded-[16px] p-2 max-w-[680px]">
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="foggy alpine rail and cabins, under €700, 7 days"
              className="flex-1 bg-transparent border-none text-[#15150F] text-[15px] px-3.5 py-2.5 outline-none placeholder-[#B4B2A4]"
            />
            <button
              type="submit"
              className="bg-[#15150F] text-[#CCFF00] border-none rounded-[12px] px-6 py-2.5 font-bold text-[14px] cursor-pointer hover:opacity-90 transition-all flex items-center gap-1"
            >
              Plan it →
            </button>
          </form>

          {/* CHIPS */}
          <div className="flex gap-2.5 mt-4 flex-wrap">
            <button
              onClick={() => handleChipClick('rainy cafés and trains across Japan')}
              className="chip-item"
            >
              rainy cafés and trains across Japan
            </button>
            <button
              onClick={() => handleChipClick('hidden beach towns, zero tourists')}
              className="chip-item"
            >
              hidden beach towns, zero tourists
            </button>
            <button
              onClick={() => handleChipClick('night trains, no flights')}
              className="chip-item"
            >
              night trains, no flights
            </button>
          </div>

          {/* HERO SHOT */}
          <div className="mt-12 rounded-[20px] overflow-hidden border border-[#E7E5D8] relative h-[300px] bg-gradient-to-br from-[#FFE9A8] via-[#CFEFC0] to-[#BFE3F0]">
            <div className="absolute top-[36%] left-[44%] w-[14px] h-[14px] rounded-full bg-[#15150F] border-[3px] border-[#CCFF00]" />
            <div className="absolute bottom-5 left-6 text-[13px] bg-white px-4 py-2.5 rounded-[12px] shadow-sm">
              <b className="text-[#15150F]">Ghost Routes of Transylvania</b> <span className="text-[#5B5B52]">· 8 days · 3/3 stops proved</span>
            </div>
          </div>
        </section>

        {/* AI AGENT SECTION */}
        <section className="screen border-b border-[#E7E5D8] py-14 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] gap-10">
            <div>
              <div className="tag-badge">AI agent</div>
              <h2 className="text-3xl font-black mb-3 tracking-tight">One thread.<br />The whole trip.</h2>
              <p className="text-[#5B5B52] text-[15px] leading-relaxed mb-6">
                Two or three questions, then a full route — stops, budget, coordinates — saved straight to the atlas.
              </p>
              <div className="flex justify-between text-[13px] text-[#B4B2A4] py-2.5 border-t border-[#E7E5D8]">
                <span>Avg. time to plotted route</span>
                <b className="text-[#15150F]">38 sec</b>
              </div>
              <div className="flex justify-between text-[13px] text-[#B4B2A4] py-2.5 border-t border-[#E7E5D8]">
                <span>Cost per generation</span>
                <b className="text-[#15150F]">0.4 $HOUR or free w/ stake</b>
              </div>
            </div>

            <div className="bg-white border border-[#E7E5D8] rounded-[20px] p-6 space-y-4">
              <div className="flex justify-end">
                <div className="max-w-[80%]">
                  <div className="text-[11px] text-[#B4B2A4] mb-1.5 uppercase tracking-wider text-right font-bold">You</div>
                  <div className="bg-[#15150F] text-[#CCFF00] p-4 rounded-[14px] text-[14px] font-medium leading-normal">
                    Slow rainy train through mountain towns, local coffee, zero tourist traps.
                  </div>
                </div>
              </div>

              <div className="flex justify-start">
                <div className="max-w-[85%]">
                  <div className="text-[11px] text-[#B4B2A4] mb-1.5 uppercase tracking-wider font-bold">Agent</div>
                  <div className="bg-[#F4F3E8] text-[#15150F] p-4 rounded-[14px] border border-[#E7E5D8] text-[14px] leading-relaxed space-y-3">
                    <p>
                      Mapped a Carpathian rail route — wooden sleeper coaches, early village stops, basement bakeries not on any map. Under €650.
                    </p>
                    <div className="bg-white border-[1.5px] border-[#CCFF00] rounded-[14px] p-3.5 flex justify-between items-center">
                      <div>
                        <b className="block text-[#15150F] text-[14px]">Night Trains Through Eastern Europe</b>
                        <span className="text-[#B4B2A4] text-[12px]">8 days · saved to atlas</span>
                      </div>
                      <div className="text-[#3A4A00] font-black text-[15px]">€650</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Link
                  href="/ai-agent"
                  className="bg-[#15150F] text-[#CCFF00] px-5 py-2.5 rounded-full font-bold text-[13.5px]"
                >
                  Start your agent thread →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* DISCOVER FEED SECTION */}
        <section className="screen border-b border-[#E7E5D8] py-14 md:py-20">
          <div className="flex justify-between items-baseline mb-7">
            <h2 className="text-3xl font-black">Discover</h2>
            <Link href="/discover" className="text-[14px] font-bold text-[#15150F] hover:underline">
              View all routes →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Link href="/routes/ghost-romania" className="card-light block">
              <div className="h-[160px] relative bg-gradient-to-br from-[#FFD9A0] to-[#F6A6B0]">
                <div className="absolute top-3 left-3 bg-white text-[#3A4A00] text-[10.5px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full">
                  Iron road
                </div>
              </div>
              <div className="p-[18px]">
                <h3 className="text-[16px] font-bold mb-2">Night trains through Eastern Europe</h3>
                <p className="text-[13px] text-[#5B5B52] leading-normal mb-4 min-h-[40px]">
                  Misty Carpathian railways, wooden sleeper coaches, gothic castles.
                </p>
                <div className="flex justify-between text-[12.5px] text-[#B4B2A4] border-t border-[#E7E5D8] pt-3">
                  <span>8 days</span>
                  <b className="text-[#15150F]">€650</b>
                </div>
              </div>
            </Link>

            <Link href="/routes/italy-coast" className="card-light block">
              <div className="h-[160px] relative bg-gradient-to-br from-[#BFE9E0] to-[#8FCBE0]">
                <div className="absolute top-3 left-3 bg-white text-[#3A4A00] text-[10.5px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full">
                  Slow coast
                </div>
              </div>
              <div className="p-[18px]">
                <h3 className="text-[16px] font-bold mb-2">Hidden coastal towns of Italy</h3>
                <p className="text-[13px] text-[#5B5B52] leading-normal mb-4 min-h-[40px]">
                  Seaside cliffs, zero tourists, €1.20 espresso on Calabria&apos;s shore.
                </p>
                <div className="flex justify-between text-[12.5px] text-[#B4B2A4] border-t border-[#E7E5D8] pt-3">
                  <span>7 days</span>
                  <b className="text-[#15150F]">€850</b>
                </div>
              </div>
            </Link>

            <Link href="/routes/tokyo-cafe" className="card-light block">
              <div className="h-[160px] relative bg-gradient-to-br from-[#FFE7A0] to-[#F2C6DE]">
                <div className="absolute top-3 left-3 bg-white text-[#3A4A00] text-[10.5px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full">
                  Night city
                </div>
              </div>
              <div className="p-[18px]">
                <h3 className="text-[16px] font-bold mb-2">Rainy Tokyo café routes</h3>
                <p className="text-[13px] text-[#5B5B52] leading-normal mb-4 min-h-[40px]">
                  Basement vinyl bars, narrow alleys, steam over midnight ramen.
                </p>
                <div className="flex justify-between text-[12.5px] text-[#B4B2A4] border-t border-[#E7E5D8] pt-3">
                  <span>10 days</span>
                  <b className="text-[#15150F]">€1,200</b>
                </div>
              </div>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
