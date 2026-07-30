'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WalletGate } from '@/components/WalletGate';
import { useWallet } from '@/context/WalletContext';
import { dbClient, Route, RewardLedgerItem, UserStory } from '@/lib/db';
import { Plus, X } from 'lucide-react';

const DAILY_MESSAGE_LIMIT = 30;

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  routeCard?: Route;
}

function ProfileContent() {
  const searchParams = useSearchParams();
  const { connected, publicKey, userEmail, hourBalance, tier, profile } = useWallet();

  const [createdRoutes, setCreatedRoutes] = useState<Route[]>([]);
  const [ledger, setLedger] = useState<RewardLedgerItem[]>([]);
  const [stories, setStories] = useState<UserStory[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Story modal state
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [storyPhotoUrl, setStoryPhotoUrl] = useState('');
  const [storyCaption, setStoryCaption] = useState('');
  const [storyRouteId, setStoryRouteId] = useState('');
  const [isPostingStory, setIsPostingStory] = useState(false);

  // Wren Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [dailyMsgCount, setDailyMsgCount] = useState(0);
  const initialPrompt = searchParams.get('prompt') || '';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'agent',
      text: 'Hey - Wren here. Tell me a mood, a budget, or a trail vibe and I\'ll plot a route straight to your atlas.',
    },
  ]);

  useEffect(() => {
    if (!connected || !publicKey) {
      setCreatedRoutes([]);
      setLedger([]);
      setStories([]);
      setDataLoaded(true);
      return;
    }

    const loadProfileData = async () => {
      try {
        // Load only THIS user's routes
        const routes = await dbClient.getRoutesByCreator(publicKey);
        setCreatedRoutes(routes);

        const ldg = await dbClient.getRewardLedger(publicKey);
        setLedger(ldg);

        const userStrs = await dbClient.getUserStories(publicKey);
        setStories(userStrs);
      } catch (err) {
        console.error('Error loading profile data:', err);
      } finally {
        setDataLoaded(true);
      }
    };

    loadProfileData();
  }, [connected, publicKey]);

  const handlePostStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyPhotoUrl.trim() || !publicKey) return;

    setIsPostingStory(true);
    try {
      const newStory = await dbClient.createUserStory(
        publicKey,
        storyPhotoUrl.trim(),
        storyCaption.trim() || null,
        storyRouteId || null
      );
      setStories((prev) => [newStory, ...prev]);
      setStoryPhotoUrl('');
      setStoryCaption('');
      setStoryRouteId('');
      setStoryModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPostingStory(false);
    }
  };

  const handleSendMessage = useCallback(async (textToSend: string) => {
    if (!textToSend.trim() || isGenerating || !connected) return;
    if (dailyMsgCount >= DAILY_MESSAGE_LIMIT) return;

    const userMsg: ChatMessage = { id: 'msg-' + Date.now(), sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsGenerating(true);
    setDailyMsgCount((prev) => prev + 1);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, userId: publicKey }),
      });

      if (!res.ok) throw new Error('Chat API error');

      const data = await res.json();
      const replyText = data.reply || data.message || 'Wren is thinking...';

      setMessages((prev) => [...prev, {
        id: 'msg-res-' + Date.now(),
        sender: 'agent',
        text: replyText,
        routeCard: data.route || undefined,
      }]);

      if (data.route) {
        setCreatedRoutes((prev) => [data.route, ...prev]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, {
        id: 'msg-err-' + Date.now(),
        sender: 'agent',
        text: 'Something went wrong on Wren\'s end. Try again in a moment.',
      }]);
    } finally {
      setIsGenerating(false);
    }
  }, [isGenerating, connected, publicKey, dailyMsgCount]);

  useEffect(() => {
    if (connected && initialPrompt) {
      const timer = setTimeout(() => {
        setChatOpen(true);
        handleSendMessage(initialPrompt);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [connected, initialPrompt, handleSendMessage]);

  if (!connected) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FBFAF3] text-[#15150F]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <WalletGate
            title="Sign in to view Profile"
            description="Access your saved journeys, proof gallery, stories, and chat with Wren on Robinhood Chain."
          />
        </main>
        <Footer />
      </div>
    );
  }

  const displayAddress = publicKey
    ? `${publicKey.slice(0, 6)}...${publicKey.slice(-4)}`
    : '';

  const displayName = profile?.display_name
    || (userEmail ? userEmail.split('@')[0] : null)
    || (publicKey ? `${publicKey.slice(0, 6)}...${publicKey.slice(-4)}` : 'Wanderer');

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFAF3] text-[#15150F]">
      <Navbar />
      <main className="flex-1">
        <section className="screen py-10 md:py-16">
          <div className="flex justify-between items-baseline mb-8">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">Profile</h1>
          </div>

          {/* ASYMMETRIC TOP ROW: LEFT PROFILE CARD & RIGHT CHAT */}
          <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-7 mb-10">
            {/* Left Profile Card */}
            <div className="bg-white border border-[#E7E5D8] rounded-[20px] p-6 flex flex-col justify-between">
              <div>
                <div className="w-[64px] h-[64px] rounded-[16px] bg-[#15150F] text-[#CCFF00] flex items-center justify-center font-black text-[22px] mb-4">
                  {displayName.slice(0, 1).toUpperCase()}
                </div>
                <h2 className="text-[19px] font-black mb-0.5">{displayName}</h2>
                {displayAddress && (
                  <div className="text-[12.5px] text-[#B4B2A4] font-mono mb-5">
                    {displayAddress} · Robinhood Chain
                  </div>
                )}

                {/* Only show balance if > 0 (earned on-chain) */}
                {hourBalance > 0 ? (
                  <div className="bg-[#CCFF00] rounded-[14px] p-4 mb-4 text-[#3A4A00]">
                    <div className="text-[12px] mb-1 font-semibold">USDC Balance</div>
                    <div className="text-[26px] font-black mb-1">{hourBalance.toLocaleString()} USDC</div>
                  </div>
                ) : (
                  <div className="bg-[#FBFAF3] border border-[#E7E5D8] rounded-[14px] p-4 mb-4 text-[#5B5B52] text-[13px]">
                    Complete a route to earn your first USDC payout.
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2.5 text-[13px] text-[#5B5B52] pt-3 border-t border-[#E7E5D8]">
                <b>Tier: {tier}</b>
              </div>
            </div>

            {/* WREN CHAT PANEL */}
            <div className="bg-white border border-[#E7E5D8] rounded-[20px] p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#15150F] border border-[#CCFF00] flex items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/wren-mascot.png" alt="Wren" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-extrabold text-[15px]">Wren</div>
                    <div className="text-[11px] text-[#B4B2A4]">{dailyMsgCount} / {DAILY_MESSAGE_LIMIT} messages today</div>
                  </div>
                </div>
                <button
                  onClick={() => setChatOpen((v) => !v)}
                  className="text-[12.5px] font-bold text-[#15150F] hover:underline"
                >
                  {chatOpen ? 'Hide chat' : 'Open chat'}
                </button>
              </div>

              {chatOpen ? (
                <>
                  <div className="flex-1 space-y-3 overflow-y-auto mb-3 pr-1 max-h-[280px]">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className="max-w-[85%]">
                          <div className={`p-3.5 rounded-[12px] text-[13.5px] leading-relaxed ${msg.sender === 'user' ? 'bg-[#15150F] text-[#CCFF00] font-medium' : 'bg-[#F4F3E8] text-[#15150F] border border-[#E7E5D8]'}`}>
                            {msg.text}
                            {msg.routeCard && (
                              <div className="mt-2.5 bg-white border-[1.5px] border-[#CCFF00] rounded-[12px] p-3 flex justify-between items-center gap-2">
                                <b className="text-[13px]">{msg.routeCard.title}</b>
                                <Link href={`/routes/${msg.routeCard.id}`} className="bg-[#CCFF00] text-[#3A4A00] px-3 py-1.5 rounded-full font-black text-[11.5px] shrink-0">
                                  View →
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isGenerating && (
                      <div className="bg-[#F4F3E8] text-[#15150F] p-3.5 rounded-[12px] border border-[#E7E5D8] text-[13.5px] animate-pulse">
                        Wren is scouting quiet stops...
                      </div>
                    )}
                  </div>

                  {dailyMsgCount >= DAILY_MESSAGE_LIMIT ? (
                    <div className="text-[12.5px] text-[#5B5B52] text-center py-2">Back tomorrow - Wren&apos;s had its 30 chats for today.</div>
                  ) : (
                    <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputText); }} className="flex gap-2 bg-[#FDFCF6] border border-[#E7E5D8] rounded-[12px] p-2">
                      <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Tell Wren your mood..."
                        className="flex-1 bg-transparent border-none text-[#15150F] text-[13.5px] px-2.5 outline-none"
                      />
                      <button type="submit" disabled={isGenerating || !inputText.trim()} className="bg-[#15150F] text-[#CCFF00] rounded-[9px] px-4 py-2 font-bold text-[13px] disabled:opacity-50">
                        Send
                      </button>
                    </form>
                  )}
                </>
              ) : (
                <p className="text-[13.5px] text-[#5B5B52] leading-relaxed">
                  Wren is one click away - open the chat to plot a new trail without leaving your profile.
                </p>
              )}
            </div>
          </div>

          {/* MY TRAVEL STORIES - only visible if there are stories or user can add */}
          {dataLoaded && (
            <div className="mb-12">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-black text-[#15150F]">My Travel Stories</h2>
                  <p className="text-[13px] text-[#5B5B52]">Moments captured on the trail.</p>
                </div>
                <button
                  onClick={() => setStoryModalOpen(true)}
                  className="bg-[#15150F] text-[#CCFF00] px-4 py-2 rounded-full font-bold text-[13px] hover:opacity-90 transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Post a story
                </button>
              </div>

              {stories.length === 0 ? (
                <div className="bg-white border border-dashed border-[#E7E5D8] rounded-[16px] p-10 text-center text-[#B4B2A4]">
                  <div className="text-[15px] font-bold mb-1">No stories yet</div>
                  <div className="text-[13px]">Post your first trail photo to share with other wanderers.</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {stories.map((story) => (
                    <div key={story.id} className="bg-white border border-[#E7E5D8] rounded-[16px] overflow-hidden shadow-xs hover:border-[#15150F] transition-all flex flex-col">
                      <div className="h-[200px] bg-[#E7E5D8] relative overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={story.photo_url} alt="Story photo" className="w-full h-full object-cover" />
                      </div>
                      {story.caption && (
                        <div className="p-4 text-[13.5px] text-[#15150F] leading-relaxed flex-1">
                          &quot;{story.caption}&quot;
                        </div>
                      )}
                      {story.route_id && (
                        <div className="px-4 pb-3">
                          <Link href={`/routes/${story.route_id}`} className="text-[11.5px] font-bold text-[#3A4A00] bg-[#CCFF00]/40 px-2.5 py-1 rounded-full inline-block">
                            Linked Route ↗
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MY ROUTES */}
          {dataLoaded && (
            <div className="space-y-4">
              <div className="text-[12px] uppercase tracking-wider text-[#B4B2A4] font-extrabold mb-1">
                Your Journeys & Saved Routes
              </div>

              {createdRoutes.length === 0 ? (
                <div className="bg-white border border-dashed border-[#E7E5D8] rounded-[16px] p-10 text-center text-[#B4B2A4]">
                  <div className="text-[15px] font-bold mb-1">No routes yet</div>
                  <div className="text-[13px] mb-4">Chat with Wren or publish a route you know.</div>
                  <Link href="/routes/create" className="bg-[#CCFF00] text-[#3A4A00] font-bold text-[13px] px-5 py-2.5 rounded-full inline-block hover:opacity-90 transition-all">
                    Publish a route →
                  </Link>
                </div>
              ) : (
                createdRoutes.map((route) => (
                  <div key={route.id} className="flex justify-between items-center bg-white border border-[#E7E5D8] rounded-[14px] p-4">
                    <div>
                      <b className="block text-[14.5px] text-[#15150F]">{route.title}</b>
                      <span className="text-[12.5px] text-[#B4B2A4]">
                        {route.stops?.length || 0} stops · Category: {route.category}
                      </span>
                    </div>
                    <Link href={`/routes/${route.id}`} className="bg-[#CCFF00] text-[#3A4A00] text-[11.5px] px-3.5 py-1.5 rounded-full font-bold hover:opacity-90 transition-all">
                      View
                    </Link>
                  </div>
                ))
              )}

              {/* Reward Ledger - only if user has earned rewards */}
              {ledger.length > 0 && (
                <div className="pt-6">
                  <div className="text-[12px] uppercase tracking-wider text-[#B4B2A4] font-extrabold mb-3">
                    Onchain Reward Ledger
                  </div>
                  <div className="bg-white border border-[#E7E5D8] rounded-[16px] divide-y divide-[#E7E5D8]">
                    {ledger.map((item) => (
                      <div key={item.id} className="p-3.5 flex justify-between items-center text-[13px]">
                        <div>
                          <b className="block text-[#15150F] capitalize">{item.type.replace(/_/g, ' ')}</b>
                          {item.tx_hash && (
                            <a href={`https://explorer.robinhood.com/tx/${item.tx_hash}`} target="_blank" rel="noopener noreferrer" className="text-[11.5px] text-[#B4B2A4] font-mono hover:text-[#15150F] hover:underline">
                              {item.tx_hash.slice(0, 16)}... ↗
                            </a>
                          )}
                        </div>
                        <div className="text-right">
                          <b className="text-[#3A4A00] font-black">+{item.amount} USDC</b>
                          <span className="block text-[11px] text-[#B4B2A4] capitalize">{item.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {/* POST A STORY MODAL */}
      {storyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-[500px] bg-white border border-[#E7E5D8] rounded-[20px] p-6 shadow-2xl">
            <button
              onClick={() => setStoryModalOpen(false)}
              className="absolute top-4 right-4 text-[#5B5B52] hover:text-[#15150F]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-[#15150F] mb-1">Post a Travel Story</h3>
            <p className="text-[13px] text-[#5B5B52] mb-5">Share a moment or photo from your trail with fellow wanderers.</p>

            <form onSubmit={handlePostStory} className="space-y-4">
              <div>
                <label className="block text-[12.5px] font-bold text-[#15150F] mb-1">Photo URL *</label>
                <input
                  type="url"
                  required
                  value={storyPhotoUrl}
                  onChange={(e) => setStoryPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-[#FBFAF3] border border-[#E7E5D8] rounded-[10px] p-3 text-[13.5px] outline-none"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-bold text-[#15150F] mb-1">Caption / Story</label>
                <textarea
                  rows={3}
                  value={storyCaption}
                  onChange={(e) => setStoryCaption(e.target.value)}
                  placeholder="Describe this moment on the trail..."
                  className="w-full bg-[#FBFAF3] border border-[#E7E5D8] rounded-[10px] p-3 text-[13.5px] outline-none resize-none"
                />
              </div>

              {createdRoutes.length > 0 && (
                <div>
                  <label className="block text-[12.5px] font-bold text-[#15150F] mb-1">Link to Route (Optional)</label>
                  <select
                    value={storyRouteId}
                    onChange={(e) => setStoryRouteId(e.target.value)}
                    className="w-full bg-[#FBFAF3] border border-[#E7E5D8] rounded-[10px] p-3 text-[13.5px] outline-none"
                  >
                    <option value="">-- Select a route --</option>
                    {createdRoutes.map((r) => (
                      <option key={r.id} value={r.id}>{r.title}</option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={isPostingStory || !storyPhotoUrl.trim()}
                className="w-full bg-[#15150F] text-[#CCFF00] font-bold py-3 rounded-[12px] text-[14px] hover:opacity-90 transition-all disabled:opacity-50"
              >
                {isPostingStory ? 'Posting...' : 'Publish Story'}
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FBFAF3]" />}>
      <ProfileContent />
    </Suspense>
  );
}
