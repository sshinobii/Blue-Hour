'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { dbClient } from '@/lib/db';
import { useWallet } from '@/context/WalletContext';

interface StopItem {
  name: string;
  description: string;
}

export default function CreateRoutePage() {
  const router = useRouter();
  const { publicKey } = useWallet();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Rail');
  const [budget, setBudget] = useState('450');
  const [days, setDays] = useState('6');
  const [stops, setStops] = useState<StopItem[]>([
    { name: 'Alfama — tiled alleys, fado bars', description: 'Historic Lisbon district' },
    { name: 'Miradouro Overlook', description: 'Sunset sea views' }
  ]);

  const [publishing, setPublishing] = useState(false);

  const handleAddStop = () => {
    setStops([...stops, { name: '', description: '' }]);
  };

  const handleStopChange = (index: number, name: string) => {
    const updated = [...stops];
    updated[index].name = name;
    setStops(updated);
  };

  const handlePublish = async () => {
    if (!title.trim()) return;
    setPublishing(true);

    try {
      const validStops = stops.filter(s => s.name.trim().length > 0);
      const createdRoute = await dbClient.createRoute(
        {
          creator_id: publicKey || 'usr_aura',
          source: 'manual',
          title: title.trim(),
          description: description.trim() || 'Custom user created route.',
          mood_prompt: null,
          category,
          budget_amount: Number(budget) || 450,
          budget_currency: 'EUR',
          days: Number(days) || 6,
          cover_image_url: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?q=80&w=1200&auto=format&fit=crop',
          status: 'published',
        },
        validStops.map((s, idx) => ({
          order_index: idx,
          name: s.name,
          description: s.description || 'Stop location',
          lat: 38.711,
          lng: -9.130,
          day_range: `Day ${idx + 1}`
        }))
      );

      router.push(`/routes/${createdRoute.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setPublishing(false);
    }
  };

  const categories = ['Rail', 'Coast', 'Night city', 'Café', 'Nature'];

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFAF3] text-[#15150F]">
      <Navbar />

      <main className="flex-1">
        <section className="screen py-10 md:py-16">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-8">Create a route</h1>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-8">
            {/* Form Card */}
            <div className="bg-white border border-[#E7E5D8] rounded-[20px] p-7 space-y-5">
              <div>
                <label className="block text-[12px] font-bold text-[#5B5B52] uppercase tracking-wider mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Rainy café hopping through old Lisbon"
                  className="w-full border border-[#E7E5D8] rounded-[10px] p-3 text-[14px] text-[#15150F] bg-[#FDFCF6] outline-none"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#5B5B52] uppercase tracking-wider mb-2">Mood / description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Basement roasteries, tiled alleys, tram routes tourists skip"
                  className="w-full border border-[#E7E5D8] rounded-[10px] p-3 text-[14px] text-[#15150F] bg-[#FDFCF6] outline-none"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#5B5B52] uppercase tracking-wider mb-2">Category</label>
                <div className="flex gap-2 flex-wrap">
                  {categories.map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`text-[12.5px] px-3.5 py-1.5 rounded-full border transition-all ${
                        category === cat
                          ? 'bg-[#15150F] text-[#CCFF00] border-[#15150F] font-bold'
                          : 'border-[#E7E5D8] text-[#5B5B52] bg-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-[#5B5B52] uppercase tracking-wider mb-2">Budget (€)</label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="450"
                    className="w-full border border-[#E7E5D8] rounded-[10px] p-3 text-[14px] text-[#15150F] bg-[#FDFCF6] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#5B5B52] uppercase tracking-wider mb-2">Days</label>
                  <input
                    type="number"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    placeholder="6"
                    className="w-full border border-[#E7E5D8] rounded-[10px] p-3 text-[14px] text-[#15150F] bg-[#FDFCF6] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#5B5B52] uppercase tracking-wider mb-2">Stops</label>
                <div className="border border-dashed border-[#E7E5D8] rounded-[14px] p-4 space-y-3">
                  {stops.map((stop, idx) => (
                    <div key={idx} className="flex gap-3 items-center border-b border-[#E7E5D8] pb-3 last:border-b-0 last:pb-0">
                      <div className="w-6 h-6 rounded-full bg-[#F1EFE1] text-[#5B5B52] text-[11px] font-extrabold flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </div>
                      <input
                        type="text"
                        value={stop.name}
                        onChange={(e) => handleStopChange(idx, e.target.value)}
                        placeholder="Add a stop name & details"
                        className="flex-1 bg-transparent border-none text-[13.5px] text-[#15150F] outline-none"
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleAddStop}
                  className="mt-3 text-[12.5px] font-bold text-[#15150F] border border-dashed border-[#15150F] rounded-full px-3.5 py-1.5 inline-block cursor-pointer"
                >
                  + Add stop
                </button>
              </div>

              <button
                type="button"
                onClick={handlePublish}
                disabled={publishing || !title.trim()}
                className="w-full mt-4 bg-[#CCFF00] text-[#3A4A00] font-extrabold py-3.5 rounded-[12px] text-center text-[14px] hover:opacity-90 transition-all disabled:opacity-50"
              >
                {publishing ? 'Publishing...' : 'Publish route'}
              </button>
            </div>

            {/* Live Preview Card */}
            <div className="bg-white border border-[#E7E5D8] rounded-[18px] overflow-hidden sticky top-5 self-start">
              <div className="text-[11px] text-[#B4B2A4] uppercase tracking-wider px-4 pt-4 font-bold">
                Live preview
              </div>
              <div className="h-[150px] bg-gradient-to-br from-[#FFD9A0] to-[#9FD8E8] mt-2" />
              <div className="p-4">
                <h3 className="text-[15px] font-bold mb-1.5">
                  {title || 'Rainy café hopping through old Lisbon'}
                </h3>
                <p className="text-[12.5px] text-[#5B5B52] mb-3">
                  {description || 'Basement roasteries, tiled alleys, tram routes tourists skip.'}
                </p>
                <div className="flex justify-between text-[12px] text-[#B4B2A4] border-t border-[#E7E5D8] pt-2.5">
                  <span>{days || 6} days</span>
                  <b className="text-[#15150F]">€{budget || 450}</b>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
