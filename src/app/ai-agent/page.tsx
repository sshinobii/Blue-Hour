'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { dbClient, Route } from '@/lib/db';
import { useWallet } from '@/context/WalletContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  routeCard?: Route;
}

function AIAgentChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { publicKey } = useWallet();

  const initialPrompt = searchParams.get('prompt') || '';
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'agent',
      text: 'Where do you want to disappear to? Tell me a mood, budget, duration, or scenery vibe (e.g. "rainy cafés in Japan under €1000 for 7 days"). I will generate a complete travel route with coordinates, stops, and map pins saved onchain.',
    },
  ]);

  const handleSendMessage = useCallback(async (textToSend: string) => {
    if (!textToSend.trim() || isGenerating) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsGenerating(true);

    try {
      await new Promise((res) => setTimeout(res, 1800));

      const title = textToSend.length > 30 ? textToSend.slice(0, 30) + '...' : textToSend;
      const createdRoute = await dbClient.createRoute(
        {
          creator_id: publicKey || 'usr_aura',
          source: 'ai_agent',
          title: `AI Route: ${title}`,
          description: `Custom AI generated route based on: "${textToSend}"`,
          mood_prompt: textToSend,
          category: textToSend.toLowerCase().includes('rail') ? 'Rail' : textToSend.toLowerCase().includes('beach') ? 'Coast' : 'Night city',
          budget_amount: 750,
          budget_currency: 'EUR',
          days: 7,
          cover_image_url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop',
          status: 'published',
        },
        [
          { order_index: 0, name: 'Secret Alley Stop', description: 'Hidden roastery & vintage shop', lat: 35.6580, lng: 139.7016, day_range: 'Day 1-2' },
          { order_index: 1, name: 'Mountain Overlook', description: 'Misty tea house and quiet lodge', lat: 35.6983, lng: 139.7731, day_range: 'Day 3-5' },
          { order_index: 2, name: 'Midnight Old Quarter', description: 'Basement vinyl bar & lantern streets', lat: 34.6525, lng: 135.5063, day_range: 'Day 6-7' },
        ]
      );

      const agentMsg: ChatMessage = {
        id: 'msg-res-' + Date.now(),
        sender: 'agent',
        text: `Mapped a custom route based on your mood: "${textToSend}". Included 3 secret stops, estimated budget €750 for 7 days. Saved to Discover feed!`,
        routeCard: createdRoute,
      };

      setMessages((prev) => [...prev, agentMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  }, [isGenerating, publicKey]);

  useEffect(() => {
    if (initialPrompt && messages.length === 1) {
      const timer = setTimeout(() => {
        handleSendMessage(initialPrompt);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [initialPrompt, messages.length, handleSendMessage]);

  return (
    <div className="screen py-10 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] gap-10">
        <div>
          <div className="tag-badge">AI agent</div>
          <h1 className="text-3xl md:text-4xl font-black mb-3 tracking-tight">One thread.<br />The whole trip.</h1>
          <p className="text-[#5B5B52] text-[15px] leading-relaxed mb-6">
            Two or three questions, then a full route — stops, budget, coordinates — saved straight to the atlas.
          </p>
          <div className="space-y-3 pt-4 border-t border-[#E7E5D8]">
            <div className="flex justify-between text-[13px] text-[#B4B2A4]">
              <span>Avg. time to plotted route</span>
              <b className="text-[#15150F]">38 sec</b>
            </div>
            <div className="flex justify-between text-[13px] text-[#B4B2A4]">
              <span>Cost per generation</span>
              <b className="text-[#15150F]">0.4 $HOUR or free w/ stake</b>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#E7E5D8] rounded-[20px] p-6 flex flex-col min-h-[520px]">
          <div className="flex-1 space-y-4 overflow-y-auto mb-4 pr-1">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="max-w-[85%]">
                  <div className={`text-[11px] text-[#B4B2A4] mb-1 font-extrabold uppercase tracking-wider ${msg.sender === 'user' ? 'text-right' : ''}`}>
                    {msg.sender === 'user' ? 'You' : 'Agent'}
                  </div>
                  <div
                    className={`p-4 rounded-[14px] text-[14px] leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#15150F] text-[#CCFF00] font-medium'
                        : 'bg-[#F4F3E8] text-[#15150F] border border-[#E7E5D8]'
                    }`}
                  >
                    {msg.text}

                    {msg.routeCard && (
                      <div className="mt-3 bg-white border-[1.5px] border-[#CCFF00] rounded-[14px] p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                          <b className="block text-[#15150F] text-[14.5px] font-bold">{msg.routeCard.title}</b>
                          <span className="text-[#B4B2A4] text-[12.5px]">{msg.routeCard.days} days · {msg.routeCard.stops?.length || 0} stops saved to atlas</span>
                        </div>
                        <button
                          onClick={() => router.push(`/routes/${msg.routeCard!.id}`)}
                          className="bg-[#CCFF00] text-[#3A4A00] px-4 py-2 rounded-full font-black text-[13px] hover:opacity-90 transition-all self-end sm:self-auto"
                        >
                          View route →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isGenerating && (
              <div className="flex justify-start">
                <div className="max-w-[85%]">
                  <div className="text-[11px] text-[#B4B2A4] mb-1 font-extrabold uppercase tracking-wider">Agent</div>
                  <div className="bg-[#F4F3E8] text-[#15150F] p-4 rounded-[14px] border border-[#E7E5D8] text-[14px] animate-pulse">
                    Planning mystery stops, calculating coordinates & budget...
                  </div>
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="flex gap-2 bg-[#FDFCF6] border border-[#E7E5D8] rounded-[14px] p-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Describe your mood, budget, or days..."
              className="flex-1 bg-transparent border-none text-[#15150F] text-[14px] px-3 outline-none"
            />
            <button
              type="submit"
              disabled={isGenerating || !inputText.trim()}
              className="bg-[#15150F] text-[#CCFF00] border-none rounded-[10px] px-5 py-2.5 font-bold text-[13.5px] disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AIAgentPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBFAF3] text-[#15150F]">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="screen py-16 text-center text-[#5B5B52]">Loading agent chat...</div>}>
          <AIAgentChatContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
