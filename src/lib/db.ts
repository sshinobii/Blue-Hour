import { createClient } from '@supabase/supabase-js';

// Types matching BLUEHOUR_DEV_PROMPT (2).md schema
export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  wallet_address: string | null;
  external_wallet_address: string | null;
  tier: string;
  subscription_tier?: string;
  hour_balance_cached: number;
  created_at?: string;
}

export interface RouteStop {
  id: string;
  route_id: string;
  order_index: number;
  name: string;
  description: string | null;
  lat: number;
  lng: number;
  day_range: string | null;
  created_at?: string;
}

export interface Route {
  id: string;
  creator_id: string | null;
  source: 'ai_agent' | 'manual';
  title: string;
  description: string | null;
  mood_prompt: string | null;
  category: string | null;
  budget_amount: number | null;
  budget_currency: string;
  days: number | null;
  cover_image_url: string | null;
  status: 'draft' | 'published' | 'archived';
  created_at?: string;
  creator?: Profile | null;
  stops?: RouteStop[];
}

export interface RouteProof {
  id: string;
  route_id: string;
  stop_id: string;
  user_id: string;
  photo_url: string;
  exif_lat: number | null;
  exif_lng: number | null;
  exif_captured_at: string | null;
  verified: boolean;
  verified_at: string | null;
  created_at?: string;
}

export interface RouteCompletion {
  id: string;
  route_id: string;
  user_id: string;
  completed_at: string;
  reward_amount: number;
  creator_bonus_amount: number;
  reward_tx_hash: string | null;
  creator_bonus_tx_hash: string | null;
}

export interface RewardLedgerItem {
  id: string;
  user_id: string;
  type: 'ai_generation_payment' | 'completion_reward' | 'creator_bonus' | 'tip';
  amount: number;
  tx_hash: string | null;
  status: 'pending' | 'success' | 'failed';
  created_at: string;
}

export interface UserStory {
  id: string;
  user_id: string;
  route_id?: string | null;
  photo_url: string;
  caption: string | null;
  created_at: string;
}

// Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Initial Mock Routes for fallback
const INITIAL_PROFILES: Profile[] = [
  {
    id: 'usr_aura',
    display_name: 'Aura_Wanderer',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    wallet_address: '0x8f2c...c91a',
    external_wallet_address: null,
    tier: 'Nomad',
    subscription_tier: 'free',
    hour_balance_cached: 4280,
    created_at: new Date().toISOString(),
  }
];

const INITIAL_ROUTES: Route[] = [
  {
    id: 'ghost-romania',
    creator_id: 'usr_aura',
    source: 'ai_agent',
    title: 'Night Trains & Neon: Ghost Routes of Transylvania',
    description: 'Misty railway lines, old tea rooms, and gothic citadels under the stars in Transylvania.',
    mood_prompt: 'Slow rainy train through mountain towns, local coffee, zero tourist traps',
    category: 'Rail',
    budget_amount: 650,
    budget_currency: 'EUR',
    days: 8,
    cover_image_url: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?q=80&w=1200&auto=format&fit=crop',
    status: 'published',
    created_at: new Date().toISOString(),
    creator: INITIAL_PROFILES[0],
    stops: [
      {
        id: 'st-1',
        route_id: 'ghost-romania',
        order_index: 0,
        name: 'Cluj-Napoca',
        description: 'Bohemian alleys & underground salt mines',
        lat: 46.7712,
        lng: 23.6236,
        day_range: 'Day 1-2',
      },
      {
        id: 'st-2',
        route_id: 'ghost-romania',
        order_index: 1,
        name: 'Brașov',
        description: 'Castles in the clouds & sleepy cabins',
        lat: 45.6427,
        lng: 25.5887,
        day_range: 'Day 3-5',
      },
      {
        id: 'st-3',
        route_id: 'ghost-romania',
        order_index: 2,
        name: 'Bucharest',
        description: 'Cyberpunk relics & hidden passages',
        lat: 44.4268,
        lng: 26.1025,
        day_range: 'Day 6-8',
      }
    ]
  },
  {
    id: 'italy-coast',
    creator_id: 'usr_aura',
    source: 'manual',
    title: 'Hidden Coastal Towns of Italy',
    description: 'Seaside cliffs, zero tourists, €1.20 espresso on Calabria\'s untouched shore.',
    mood_prompt: 'Hidden beach towns, zero tourists',
    category: 'Coast',
    budget_amount: 850,
    budget_currency: 'EUR',
    days: 7,
    cover_image_url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop',
    status: 'published',
    created_at: new Date().toISOString(),
    creator: INITIAL_PROFILES[0],
    stops: [
      {
        id: 'st-10',
        route_id: 'italy-coast',
        order_index: 0,
        name: 'Tropea',
        description: 'Cliffside sea views & red onion gelato',
        lat: 38.6795,
        lng: 15.8944,
        day_range: 'Day 1-3'
      },
      {
        id: 'st-11',
        route_id: 'italy-coast',
        order_index: 1,
        name: 'Scilla',
        description: 'Chianalea fishing village built over water',
        lat: 38.2536,
        lng: 15.7196,
        day_range: 'Day 4-5'
      },
      {
        id: 'st-12',
        route_id: 'italy-coast',
        order_index: 2,
        name: 'Reggio Calabria',
        description: 'Beachfront esplanade gazing at Mount Etna',
        lat: 38.1113,
        lng: 15.6473,
        day_range: 'Day 6-7'
      }
    ]
  },
  {
    id: 'tokyo-cafe',
    creator_id: 'usr_aura',
    source: 'ai_agent',
    title: 'Rainy Tokyo Café & Vinyl Alleys',
    description: 'Basement vinyl bars, narrow alleys, steam over midnight ramen in Shibuya.',
    mood_prompt: 'rainy cafés and trains across Japan',
    category: 'Night city',
    budget_amount: 1200,
    budget_currency: 'EUR',
    days: 10,
    cover_image_url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop',
    status: 'published',
    created_at: new Date().toISOString(),
    creator: INITIAL_PROFILES[0],
    stops: [
      {
        id: 'st-20',
        route_id: 'tokyo-cafe',
        order_index: 0,
        name: 'Shibuya Alleys',
        description: 'Underground jazz vinyl listening rooms',
        lat: 35.6580,
        lng: 139.7016,
        day_range: 'Day 1-3'
      },
      {
        id: 'st-21',
        route_id: 'tokyo-cafe',
        order_index: 1,
        name: 'Akihabara Towers',
        description: 'Multi-story retro arcades at midnight',
        lat: 35.6983,
        lng: 139.7731,
        day_range: 'Day 4-6'
      },
      {
        id: 'st-22',
        route_id: 'tokyo-cafe',
        order_index: 2,
        name: 'Osaka Shinsekai',
        description: 'Retro-futuristic street food lights',
        lat: 34.6525,
        lng: 135.5063,
        day_range: 'Day 7-10'
      }
    ]
  }
];

const INITIAL_PROOFS: RouteProof[] = [
  {
    id: 'prf-1',
    route_id: 'ghost-romania',
    stop_id: 'st-1',
    user_id: 'usr_aura',
    photo_url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=600&auto=format&fit=crop',
    exif_lat: 46.7715,
    exif_lng: 23.6239,
    exif_captured_at: new Date().toISOString(),
    verified: true,
    verified_at: new Date().toISOString()
  },
  {
    id: 'prf-2',
    route_id: 'ghost-romania',
    stop_id: 'st-2',
    user_id: 'usr_aura',
    photo_url: 'https://images.unsplash.com/photo-1570535171801-447545b6dbfa?q=80&w=600&auto=format&fit=crop',
    exif_lat: 45.6429,
    exif_lng: 25.5889,
    exif_captured_at: new Date().toISOString(),
    verified: true,
    verified_at: new Date().toISOString()
  }
];

const isBrowser = typeof window !== 'undefined';

const getLocalStorage = <T>(key: string, initialValue: T): T => {
  if (!isBrowser) return initialValue;
  const item = localStorage.getItem(key);
  if (!item) {
    localStorage.setItem(key, JSON.stringify(initialValue));
    return initialValue;
  }
  try {
    return JSON.parse(item);
  } catch (e) {
    return initialValue;
  }
};

const setLocalStorage = <T>(key: string, value: T): void => {
  if (isBrowser) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// Main Database Client
export const dbClient = {
  // Routes & Stops
  async getRoutes(categoryFilter?: string): Promise<Route[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('routes').select('*, stops:route_stops(*), creator:profiles(*)').eq('status', 'published');
      if (categoryFilter && categoryFilter !== 'All') {
        query = query.ilike('category', categoryFilter);
      }
      const { data, error } = await query.order('created_at', { ascending: false });
      if (!error && data) return data as Route[];
    }
    const routes = getLocalStorage<Route[]>('bh_routes_v2', INITIAL_ROUTES);
    if (categoryFilter && categoryFilter !== 'All') {
      return routes.filter(r => r.category?.toLowerCase() === categoryFilter.toLowerCase());
    }
    return routes;
  },

  async getRouteById(id: string): Promise<Route | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('routes')
        .select('*, stops:route_stops(*), creator:profiles(*)')
        .eq('id', id)
        .single();
      if (!error && data) return data as Route;
    }
    const routes = await this.getRoutes();
    return routes.find(r => r.id === id) || null;
  },

  async createRoute(
    routeData: Omit<Route, 'id' | 'created_at' | 'stops'>,
    stops: Omit<RouteStop, 'id' | 'route_id' | 'created_at'>[]
  ): Promise<Route> {
    const newRouteId = 'rt-' + Math.random().toString(36).substring(2, 9);
    const newStops: RouteStop[] = stops.map((s, index) => ({
      ...s,
      id: 'st-' + Math.random().toString(36).substring(2, 9),
      route_id: newRouteId,
      order_index: index,
      created_at: new Date().toISOString()
    }));

    const newRoute: Route = {
      ...routeData,
      id: newRouteId,
      created_at: new Date().toISOString(),
      stops: newStops
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('routes').insert({
        id: newRoute.id,
        creator_id: routeData.creator_id,
        source: routeData.source,
        title: routeData.title,
        description: routeData.description,
        mood_prompt: routeData.mood_prompt,
        category: routeData.category,
        budget_amount: routeData.budget_amount,
        budget_currency: routeData.budget_currency,
        days: routeData.days,
        cover_image_url: routeData.cover_image_url,
        status: routeData.status
      }).select().single();

      if (!error && data) {
        await supabase.from('route_stops').insert(newStops);
        return newRoute;
      }
    }

    const routes = getLocalStorage<Route[]>('bh_routes_v2', INITIAL_ROUTES);
    setLocalStorage('bh_routes_v2', [newRoute, ...routes]);
    return newRoute;
  },

  // Proofs & Rewards
  async getRouteProofs(routeId: string, userId?: string): Promise<RouteProof[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('route_proofs').select('*').eq('route_id', routeId);
      if (userId) query = query.eq('user_id', userId);
      const { data, error } = await query;
      if (!error && data) return data as RouteProof[];
    }
    const proofs = getLocalStorage<RouteProof[]>('bh_proofs_v2', INITIAL_PROOFS);
    return proofs.filter(p => p.route_id === routeId && (!userId || p.user_id === userId));
  },

  async submitProof(
    routeId: string,
    stopId: string,
    userId: string,
    photoUrl: string,
    exifLat: number | null,
    exifLng: number | null,
    exifCapturedAt: string | null
  ): Promise<{ proof: RouteProof; completedFullRoute: boolean; rewardAmount: number }> {
    const proof: RouteProof = {
      id: 'prf-' + Math.random().toString(36).substring(2, 9),
      route_id: routeId,
      stop_id: stopId,
      user_id: userId,
      photo_url: photoUrl,
      exif_lat: exifLat,
      exif_lng: exifLng,
      exif_captured_at: exifCapturedAt,
      verified: true,
      verified_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      await supabase.from('route_proofs').insert(proof);
    }

    const proofs = getLocalStorage<RouteProof[]>('bh_proofs_v2', INITIAL_PROOFS);
    const updatedProofs = [...proofs.filter(p => !(p.stop_id === stopId && p.user_id === userId)), proof];
    setLocalStorage('bh_proofs_v2', updatedProofs);

    // Check if user proved all stops for this route
    const route = await this.getRouteById(routeId);
    const totalStops = route?.stops?.length || 0;
    const userProvedStops = updatedProofs.filter(p => p.route_id === routeId && p.user_id === userId && p.verified).length;

    let completedFullRoute = false;
    const rewardAmount = 180; // Default $HOUR completion reward

    if (totalStops > 0 && userProvedStops >= totalStops) {
      completedFullRoute = true;

      // Award tokens to traveler
      await this.addRewardLedgerItem(userId, 'completion_reward', rewardAmount);

      // Award creator bonus if traveler != creator
      if (route?.creator_id && route.creator_id !== userId) {
        await this.addRewardLedgerItem(route.creator_id, 'creator_bonus', 40);
      }
    }

    return { proof, completedFullRoute, rewardAmount };
  },

  // Reward Ledger
  async getRewardLedger(userId: string): Promise<RewardLedgerItem[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('reward_ledger').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (!error && data) return data as RewardLedgerItem[];
    }
    const ledgerMap = getLocalStorage<Record<string, RewardLedgerItem[]>>('bh_reward_ledger', {
      'usr_aura': [
        {
          id: 'ldg-1',
          user_id: 'usr_aura',
          type: 'completion_reward',
          amount: 180,
          tx_hash: '0x3a4f...91bc',
          status: 'success',
          created_at: new Date().toISOString()
        }
      ]
    });
    return ledgerMap[userId] || [];
  },

  async addRewardLedgerItem(
    userId: string,
    type: 'ai_generation_payment' | 'completion_reward' | 'creator_bonus' | 'tip',
    amount: number
  ): Promise<RewardLedgerItem> {
    const item: RewardLedgerItem = {
      id: 'ldg-' + Math.random().toString(36).substring(2, 9),
      user_id: userId,
      type,
      amount,
      tx_hash: '0x' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      status: 'success',
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      await supabase.from('reward_ledger').insert(item);
      // update profile cached balance
      const { data: profile } = await supabase.from('profiles').select('hour_balance_cached').eq('id', userId).single();
      if (profile) {
        await supabase.from('profiles').update({ hour_balance_cached: Number(profile.hour_balance_cached || 0) + amount }).eq('id', userId);
      }
    }

    const ledgerMap = getLocalStorage<Record<string, RewardLedgerItem[]>>('bh_reward_ledger', {});
    ledgerMap[userId] = [item, ...(ledgerMap[userId] || [])];
    setLocalStorage('bh_reward_ledger', ledgerMap);

    return item;
  },

  // User Profile
  async getProfile(userId: string): Promise<Profile> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (!error && data) return data as Profile;
    }

    const profilesMap = getLocalStorage<Record<string, Profile>>('bh_profiles_v2', {
      'usr_aura': INITIAL_PROFILES[0]
    });

    if (!profilesMap[userId]) {
      const newProfile: Profile = {
        id: userId,
        display_name: 'Nomad_' + userId.slice(-4),
        avatar_url: null,
        wallet_address: userId.startsWith('0x') ? userId : `0x${userId.slice(0, 8)}...`,
        external_wallet_address: null,
        tier: 'Nomad',
        hour_balance_cached: 100,
        created_at: new Date().toISOString()
      };
      profilesMap[userId] = newProfile;
      setLocalStorage('bh_profiles_v2', profilesMap);
      return newProfile;
    }

    return profilesMap[userId];
  },

  // User Stories
  async getUserStories(userId?: string): Promise<UserStory[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('user_stories').select('*').order('created_at', { ascending: false });
      if (userId) query = query.eq('user_id', userId);
      const { data, error } = await query;
      if (!error && data) return data as UserStory[];
    }

    const stories = getLocalStorage<UserStory[]>('bh_user_stories', [
      {
        id: 'stry-1',
        user_id: 'usr_aura',
        route_id: 'ghost-romania',
        photo_url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800&auto=format&fit=crop',
        caption: 'Misty morning espresso at 6:00 AM before taking the train through Transylvania.',
        created_at: new Date().toISOString()
      },
      {
        id: 'stry-2',
        user_id: 'usr_aura',
        route_id: 'italy-coast',
        photo_url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800&auto=format&fit=crop',
        caption: 'Watching Mount Etna smoke across the sea from Calabria coast.',
        created_at: new Date().toISOString()
      }
    ]);

    if (userId) {
      return stories.filter(s => s.user_id === userId);
    }
    return stories;
  },

  async createUserStory(
    userId: string,
    photoUrl: string,
    caption: string | null,
    routeId?: string | null
  ): Promise<UserStory> {
    const story: UserStory = {
      id: 'stry-' + Math.random().toString(36).substring(2, 9),
      user_id: userId,
      route_id: routeId || null,
      photo_url: photoUrl,
      caption: caption || null,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      await supabase.from('user_stories').insert(story);
    }

    const stories = getLocalStorage<UserStory[]>('bh_user_stories', []);
    const updated = [story, ...stories];
    setLocalStorage('bh_user_stories', updated);

    return story;
  }
};
