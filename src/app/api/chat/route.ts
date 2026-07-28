import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY || '';
const openai = apiKey ? new OpenAI({ apiKey }) : null;

// Mock database fallback for offline/keyless developer instances
const MOCK_AI_RESPONSES = [
  {
    keywords: ['italy', 'tuscany', 'rome', 'florence'],
    title: 'Sienna & Clay: Hidden Valleys of Tuscany',
    subtitle: 'Nostalgic local rail paths, rustic farmhouses, and old vineyards in Siena and Lucca.',
    category: 'Europe',
    budget: '€950',
    duration: '8 Days',
    transport: 'train',
    coverImage: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1200&auto=format&fit=crop',
    travelNotes: 'Take the regional train rather than the high-speed rail to enjoy the scenic hillsides. Rent a bicycle in Lucca to ride along the ancient fortress walls.',
    timeline: [
      {
        day: 'Day 1-3',
        city: 'Lucca',
        title: 'Biking the Renaissance Walls',
        description: 'Spend your days cycling the wide, tree-lined path atop Lucca\'s 16th-century walls. Discover quiet squares and taste Buccellato, a local sweet bread with raisins.',
        weather: { temp: '21°C', icon: 'Sun', condition: 'Sunny & Clear' },
        budget: '€280',
        hiddenGem: 'Palazzo Pfanner gardens - a baroque sanctuary hidden behind stone walls.',
        recommendations: ['Rent a cruiser bike', 'Eat dinner at Trattoria da Leo', 'Climb Guinigi Tower for oak tree views'],
        image: 'https://images.unsplash.com/photo-1527030280862-64139fbe04ca?q=80&w=600&auto=format&fit=crop',
        latitude: 43.8429,
        longitude: 10.5027
      },
      {
        day: 'Day 4-8',
        city: 'Siena',
        title: 'Sienna Clay Courtyards & Gothic Lanes',
        description: 'Take the regional train south. Explore the deep-red brick alleys of Siena, watch the dusk settle over Piazza del Campo, and join the local evening passeggiata.',
        weather: { temp: '18°C', icon: 'Cloudy', condition: 'Foggy evenings' },
        budget: '€420',
        hiddenGem: 'The secret fountains of Siena (Fonti di Fontebranda) located under the cliffs.',
        recommendations: ['Taste Panforte spiced cake', 'Visit the Duomo mosaic floors', 'Drinks at Osteria le Logge'],
        image: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?q=80&w=600&auto=format&fit=crop',
        latitude: 43.3188,
        longitude: 11.3308
      }
    ]
  }
];

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    const lowerQuery = query.toLowerCase();

    // 1. If OpenAI is configured, make real API call
    if (openai) {
      try {
        const systemPrompt = `You are a travel agent AI that creates atmospheric itineraries.
Create a travel route based on the user's description: "${query}".
You MUST return ONLY a JSON object matching this schema, without markdown formatting or backticks:
{
  "route": {
    "id": "string (unique url slug)",
    "title": "string (emotional title)",
    "subtitle": "string (emotional subtitle)",
    "vibe": "string",
    "category": "string (Rail, Coast, Night city, etc)",
    "budget": "string (e.g. €750)",
    "duration": "string (e.g. 7 Days)",
    "transport": "train" | "bus" | "flight" | "mixed",
    "coverImage": "string (Unsplash image url)",
    "travelNotes": "string",
    "timeline": [
      {
        "day": "string (e.g. Day 1-2)",
        "city": "string (City name)",
        "title": "string (Stop headline)",
        "description": "string (Detailed stop description)",
        "weather": { "temp": "string", "icon": "string", "condition": "string" },
        "budget": "string",
        "hiddenGem": "string",
        "recommendations": ["string", "string"],
        "image": "string (Unsplash image url)",
        "latitude": number,
        "longitude": number
      }
    ]
  }
}`;

        const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: query }
          ],
          response_format: { type: 'json_object' }
        });

        const content = response.choices[0].message.content;
        if (content) {
          const parsed = JSON.parse(content);
          return NextResponse.json(parsed);
        }
      } catch (err) {
        console.warn('OpenAI API call failed, falling back to mock engine', err);
      }
    }

    // 2. Fallback Mock response search
    const matchedMock = MOCK_AI_RESPONSES.find(mock => 
      mock.keywords.some(kw => lowerQuery.includes(kw))
    );

    const fallbackRoute = matchedMock || {
      title: `Atmospheric Odyssey: ${query.slice(0, 20)}`,
      subtitle: `Tailored itinerary designed around your query vibe: "${query}"`,
      category: 'Rail',
      budget: '€780',
      duration: '7 Days',
      transport: 'train' as const,
      coverImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop',
      travelNotes: 'Generated by Bluehour AI. Experience the atmospheres slowly.',
      timeline: [
        {
          day: 'Day 1-3',
          city: 'Innsbruck',
          title: 'Alpine Cafés & Funiculars',
          description: 'Stay in the center of Innsbruck. Drink specialty coffee and ride the Hungerburg funicular to alpine valleys.',
          weather: { temp: '14°C', icon: 'Cloudy', condition: 'Crisp & Overcast' },
          budget: '€220',
          hiddenGem: 'Café Munding - Innsbruck\'s oldest pastry shop.',
          recommendations: ['Specialty coffee at Haferland', 'Hike around Nordkette'],
          image: 'https://images.unsplash.com/photo-1518098268026-4e43a1a009de?q=80&w=600&auto=format&fit=crop',
          latitude: 47.2692,
          longitude: 11.4041
        },
        {
          day: 'Day 4-7',
          city: 'Lake Como (Varenna)',
          title: 'Forgotten Waterfront Villas',
          description: 'Take the Bernina regional train south to Lake Como. Walk Varenna waterfront paths at sunset.',
          weather: { temp: '22°C', icon: 'Sun', condition: 'Lakeside Sun' },
          budget: '€380',
          hiddenGem: 'Villa Monastero terraced gardens.',
          recommendations: ['Gelato at Riva', 'Drink Aperol at Bar Il Molo'],
          image: 'https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?q=80&w=600&auto=format&fit=crop',
          latitude: 46.0163,
          longitude: 9.2789
        }
      ]
    };

    const mockRouteId = 'gen-' + Math.random().toString(36).substring(2, 9);
    const resultRoute = {
      ...fallbackRoute,
      id: mockRouteId,
      vibe: query,
      comments: [],
      memories: []
    };

    return NextResponse.json({ route: resultRoute });
  } catch (error) {
    console.error('Error in api/chat handler:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
