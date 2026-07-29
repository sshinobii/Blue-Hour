'use client';

import React, { useState, useEffect, use } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { dbClient, Route, RouteProof } from '@/lib/db';
import { useWallet } from '@/context/WalletContext';

export default function RouteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const routeId = resolvedParams.id;

  const { publicKey } = useWallet();

  const [route, setRoute] = useState<Route | null>(null);
  const [proofs, setProofs] = useState<RouteProof[]>([]);
  const [uploadingStopId, setUploadingStopId] = useState<string | null>(null);
  const [rewardNotice, setRewardNotice] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const r = await dbClient.getRouteById(routeId);
      setRoute(r);
      const prfs = await dbClient.getRouteProofs(routeId, publicKey || 'usr_aura');
      setProofs(prfs);
    };
    loadData();
  }, [routeId, publicKey]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, stopId: string) => {
    const file = e.target.files?.[0];
    if (!file || !route) return;

    setUploadingStopId(stopId);

    try {
      let lat: number | null = null;
      let lng: number | null = null;
      let capturedAt: string | null = null;

      // Extract EXIF data using exifr
      try {
        const exifr = await import('exifr');
        const exifData = await exifr.parse(file, ['latitude', 'longitude', 'DateTimeOriginal']);
        if (exifData) {
          lat = exifData.latitude || null;
          lng = exifData.longitude || null;
          capturedAt = exifData.DateTimeOriginal ? new Date(exifData.DateTimeOriginal).toISOString() : null;
        }
      } catch (exifErr) {
        console.warn('EXIF parsing fallback:', exifErr);
      }

      // Default fallback mock coordinates if EXIF parsing fails or file has no GPS tag
      if (!lat || !lng) {
        const stopObj = route.stops?.find(s => s.id === stopId);
        lat = stopObj?.lat || 46.7712;
        lng = stopObj?.lng || 23.6236;
        capturedAt = new Date().toISOString();
      }

      const photoUrl = URL.createObjectURL(file);
      const userId = publicKey || 'usr_aura';

      const result = await dbClient.submitProof(
        routeId,
        stopId,
        userId,
        photoUrl,
        lat,
        lng,
        capturedAt
      );

      // Refresh proofs list
      const updatedProofs = await dbClient.getRouteProofs(routeId, userId);
      setProofs(updatedProofs);

      if (result.completedFullRoute) {
        setRewardNotice(`Route Completed! You earned +${result.rewardAmount} $HOUR reward!`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingStopId(null);
    }
  };

  if (!route) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FBFAF3] text-[#15150F]">
        <Navbar />
        <main className="flex-1 screen py-20 text-center">Loading route detail...</main>
        <Footer />
      </div>
    );
  }

  const totalStops = route.stops?.length || 0;
  const provedStopsCount = route.stops?.filter(s => proofs.some(p => p.stop_id === s.id && p.verified)).length || 0;
  const progressPercent = totalStops > 0 ? Math.round((provedStopsCount / totalStops) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFAF3] text-[#15150F]">
      <Navbar />

      <main className="flex-1">
        <section className="screen py-10 md:py-16">
          <div className="tag-badge">Route · in progress</div>
          
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-1.5">{route.title}</h1>
          <p className="text-[14px] text-[#5B5B52] mb-8">
            {route.stops?.map(s => s.name).join(' → ')} · {route.days || 8} days · created by {route.creator?.display_name || 'Aura_Wanderer'}
          </p>

          {rewardNotice && (
            <div className="bg-[#CCFF00] text-[#3A4A00] rounded-[16px] p-4 font-bold text-[14px] mb-6 flex justify-between items-center">
              <span>{rewardNotice}</span>
              <button onClick={() => setRewardNotice(null)} className="text-[12px] underline">Dismiss</button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-8">
            {/* Left Main Content */}
            <div>
              {/* Route Hero Image */}
              <div className="h-[220px] rounded-[18px] bg-gradient-to-r from-[#CDEBD8] to-[#F4E3B0] mb-7 overflow-hidden relative">
                {route.cover_image_url && (
                  <img src={route.cover_image_url} alt={route.title} className="w-full h-full object-cover opacity-80" />
                )}
              </div>

              {/* Stop List */}
              <div className="space-y-3.5">
                {route.stops?.map((stop, idx) => {
                  const proof = proofs.find(p => p.stop_id === stop.id && p.verified);
                  const isProved = Boolean(proof);

                  return (
                    <div key={stop.id} className="flex items-center gap-4 bg-white border border-[#E7E5D8] rounded-[16px] p-4.5">
                      <div className={`w-8 h-8 rounded-full text-[13px] font-black flex items-center justify-center flex-shrink-0 ${
                        isProved ? 'bg-[#CCFF00] text-[#3A4A00]' : 'bg-[#F1EFE1] text-[#5B5B52]'
                      }`}>
                        {isProved ? '✓' : idx + 1}
                      </div>

                      <div className="flex-1">
                        <b className="block text-[14.5px] text-[#15150F]">{stop.name}</b>
                        <span className="text-[12.5px] text-[#B4B2A4]">
                          {isProved
                            ? `Proved · matched route coordinates (${proof?.exif_lat?.toFixed(2)}, ${proof?.exif_lng?.toFixed(2)})`
                            : `${stop.description || 'Take a photo at this stop'}`}
                        </span>
                      </div>

                      <div>
                        {isProved ? (
                          <span className="bg-[#CCFF00] text-[#3A4A00] font-extrabold text-[12.5px] px-3.5 py-1.5 rounded-full">
                            Proved
                          </span>
                        ) : (
                          <label className="border-[1.5px] border-[#15150F] text-[#15150F] font-bold text-[12.5px] px-3.5 py-1.5 rounded-full cursor-pointer hover:bg-[#15150F] hover:text-[#CCFF00] transition-colors inline-block">
                            {uploadingStopId === stop.id ? 'Analyzing...' : 'Upload proof'}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, stop.id)}
                              disabled={uploadingStopId === stop.id}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Reward Tracker Card */}
            <div className="bg-white border border-[#E7E5D8] rounded-[18px] p-5.5 sticky top-5 self-start space-y-4">
              <h3 className="text-[15px] font-bold">Route reward</h3>
              
              <div>
                <div className="h-2 bg-[#E7E5D8] rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-[#15150F] transition-all" style={{ width: `${progressPercent}%` }} />
                </div>
                <div className="flex justify-between text-[12px] text-[#B4B2A4]">
                  <span>{provedStopsCount}/{totalStops} stops proved</span>
                  <span>{progressPercent}%</span>
                </div>
              </div>

              <div className="bg-[#CCFF00] rounded-[14px] p-4 text-center">
                <b className="block text-[24px] text-[#3A4A00] font-black">+180 HOUR</b>
                <span className="text-[11.5px] text-[#3A4A00] font-semibold">on full route completion</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
