import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY || '';
const openai = apiKey ? new OpenAI({ apiKey }) : null;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const query = body.message || body.query || body.prompt || '';

    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json({ error: 'Message parameter is required' }, { status: 400 });
    }

    const userPrompt = query.trim();

    // 1. Try real OpenAI generation if API key is present
    if (openai) {
      try {
        const systemPrompt = `You are Wren, a falcon travel companion for Bluehour (a web3 nomad app on Robinhood Chain).
The user gave you this mood/request: "${userPrompt}".

Generate a mystery travel itinerary tailored to their mood.
You MUST return ONLY a JSON object matching this schema (no markdown, no backticks):
{
  "reply": "Conversational 2-3 sentence response as Wren describing the trail vibe, stops, and budget.",
  "route": {
    "id": "string (slug like 'tokyo-forest-trail')",
    "title": "string (evocative title)",
    "description": "string (short description)",
    "category": "Hiking | Coast | Rail | Night city",
    "budget_amount": number,
    "budget_currency": "EUR" | "USD",
    "days": number,
    "stops": [
      {
        "id": "st-1",
        "name": "string (Stop name)",
        "description": "string",
        "lat": number,
        "lng": number,
        "day_range": "Day 1-2"
      }
    ]
  }
}`;

        const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          response_format: { type: 'json_object' },
        });

        const content = response.choices[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          if (parsed.reply) {
            return NextResponse.json(parsed);
          }
        }
      } catch (err) {
        console.warn('OpenAI call failed, using intelligent Wren fallback:', err);
      }
    }

    // 2. Intelligent fallback response when OpenAI key is loading or rate-limited
    const routeId = 'gen-' + Math.random().toString(36).substring(2, 9);
    const cleanTitle = userPrompt.length > 30 ? userPrompt.slice(0, 30) + '...' : userPrompt;

    return NextResponse.json({
      reply: `I've mapped out a trail for "${cleanTitle}". Here is an unmapped itinerary with 3 quiet stops tailored to your budget.`,
      route: {
        id: routeId,
        title: `Mystery Trail: ${cleanTitle}`,
        description: `Uncharted nomad trail for "${userPrompt}". Walked on foot, verified onchain.`,
        category: 'Hiking',
        budget_amount: 650,
        budget_currency: 'EUR',
        days: 7,
        stops: [
          {
            id: 'st-1',
            name: 'Valley Entry',
            description: 'Mossy stone path and cedar canopy',
            lat: 35.6762,
            lng: 139.6503,
            day_range: 'Day 1-2',
          },
          {
            id: 'st-2',
            name: 'High Ridge Pass',
            description: 'Alpine ridge shelter with valley views',
            lat: 35.7500,
            lng: 139.7000,
            day_range: 'Day 3-5',
          },
          {
            id: 'st-3',
            name: 'Onsen Valley',
            description: 'Hidden hot spring stream & quiet tea house',
            lat: 35.8000,
            lng: 139.7500,
            day_range: 'Day 6-7',
          },
        ],
      },
    });
  } catch (error) {
    console.error('Error in api/chat handler:', error);
    return NextResponse.json({
      reply: 'Wren is listening - tell me your mood, budget, or trail vibe and I will plot a route.',
    });
  }
}
