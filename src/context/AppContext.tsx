'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface RouteStop {
  day: string;
  city: string;
  title: string;
  description: string;
  weather: { temp: string; icon: string; condition: string };
  budget: string;
  hiddenGem: string;
  recommendations: string[];
  image: string;
  coordinates: { x: number; y: number };
}

export interface Memory {
  id: string;
  username: string;
  userImage: string;
  imageUrl: string;
  caption: string;
  timestamp: string;
}

export interface Comment {
  id: string;
  username: string;
  text: string;
  timestamp: string;
  tipAmount?: number;
}

export interface TravelRoute {
  id: string;
  title: string;
  subtitle: string;
  vibe: string;
  category: string;
  budget: string;
  duration: string;
  transport: 'train' | 'bus' | 'flight' | 'mixed';
  creator: {
    username: string;
    avatar: string;
    walletAddress: string;
  };
  likes: number;
  bookmarks: number;
  isLikedByUser?: boolean;
  isBookmarkedByUser?: boolean;
  premiumRequired?: boolean;
  isUnlocked?: boolean;
  mapImage: string;
  coverImage: string;
  timeline: RouteStop[];
  comments: Comment[];
  memories: Memory[];
  travelNotes: string;
}

interface AppContextType {
  routes: TravelRoute[];
  generatedRoute: TravelRoute | null;
  activePrompt: string;
  isGenerating: boolean;
  premiumFeaturePrice: number;
  setRoutes: React.Dispatch<React.SetStateAction<TravelRoute[]>>;
  setActivePrompt: (prompt: string) => void;
  setIsGenerating: (generating: boolean) => void;
  likeRoute: (id: string) => void;
  bookmarkRoute: (id: string) => void;
  addComment: (routeId: string, username: string, text: string, tipAmount?: number) => void;
  addMemory: (routeId: string, username: string, imageUrl: string, caption: string) => void;
  generateRouteFromVibe: (vibe: string, premium?: boolean) => Promise<TravelRoute>;
  unlockRoute: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialRoutes: TravelRoute[] = [];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [routes, setRoutes] = useState<TravelRoute[]>(initialRoutes);
  const [generatedRoute, setGeneratedRoute] = useState<TravelRoute | null>(null);
  const [activePrompt, setActivePrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const premiumFeaturePrice = 0.003;

  const loadSavedRoutes = useCallback(() => {
    if (typeof window !== 'undefined') {
      const savedRoutes = localStorage.getItem('bh_routes');
      if (savedRoutes) {
        try {
          setRoutes(JSON.parse(savedRoutes));
        } catch {
          // ignore
        }
      }
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) {
        loadSavedRoutes();
      }
    });
    return () => {
      isMounted = false;
    };
  }, [loadSavedRoutes]);

  const likeRoute = (id: string) => {
    setRoutes(prev => {
      const updated = prev.map(route => {
        if (route.id === id) {
          const isLiked = !route.isLikedByUser;
          return {
            ...route,
            isLikedByUser: isLiked,
            likes: isLiked ? route.likes + 1 : route.likes - 1
          };
        }
        return route;
      });
      localStorage.setItem('bh_routes', JSON.stringify(updated));
      return updated;
    });
  };

  const bookmarkRoute = (id: string) => {
    setRoutes(prev => {
      const updated = prev.map(route => {
        if (route.id === id) {
          const isBookmarked = !route.isBookmarkedByUser;
          return {
            ...route,
            isBookmarkedByUser: isBookmarked,
            bookmarks: isBookmarked ? route.bookmarks + 1 : route.bookmarks - 1
          };
        }
        return route;
      });
      localStorage.setItem('bh_routes', JSON.stringify(updated));
      return updated;
    });
  };

  const unlockRoute = (id: string) => {
    setRoutes(prev => {
      const updated = prev.map(route => {
        if (route.id === id) {
          return { ...route, isUnlocked: true };
        }
        return route;
      });
      localStorage.setItem('bh_routes', JSON.stringify(updated));
      return updated;
    });
  };

  const addComment = (routeId: string, username: string, text: string, tipAmount?: number) => {
    const newComment: Comment = {
      id: Math.random().toString(36).substring(2, 9),
      username,
      text,
      timestamp: 'Just now',
      tipAmount
    };

    setRoutes(prev => {
      const updated = prev.map(route => {
        if (route.id === routeId) {
          return {
            ...route,
            comments: [...route.comments, newComment]
          };
        }
        return route;
      });
      localStorage.setItem('bh_routes', JSON.stringify(updated));
      return updated;
    });
  };

  const addMemory = (routeId: string, username: string, imageUrl: string, caption: string) => {
    const newMemory: Memory = {
      id: Math.random().toString(36).substring(2, 9),
      username,
      userImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop',
      imageUrl,
      caption,
      timestamp: 'Just now'
    };

    setRoutes(prev => {
      const updated = prev.map(route => {
        if (route.id === routeId) {
          return {
            ...route,
            memories: [...route.memories, newMemory]
          };
        }
        return route;
      });
      localStorage.setItem('bh_routes', JSON.stringify(updated));
      return updated;
    });
  };

  const generateRouteFromVibe = (vibe: string, premium: boolean = false): Promise<TravelRoute> => {
    setIsGenerating(true);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const routeId = 'gen-' + Math.random().toString(36).substring(2, 9);
        const title = 'Mystic Odyssey: Generated Route';
        const subtitle = 'Custom route tailored for your vibe.';
        const duration = '9 Days';
        const budget = '€750';
        const category = 'Slow Travel';
        const timeline: RouteStop[] = [];
        const coverImage = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop';
        const travelNotes = 'Generated by Bluehour AI.';

        const newRoute: TravelRoute = {
          id: routeId,
          title,
          subtitle,
          vibe,
          category,
          budget,
          duration,
          transport: 'train',
          creator: {
            username: 'Bluehour_AI',
            avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop',
            walletAddress: 'BLUe...AI402'
          },
          likes: 1,
          bookmarks: 0,
          coverImage,
          mapImage: '/maps/generated.svg',
          travelNotes,
          timeline,
          comments: [],
          memories: [],
          premiumRequired: premium,
          isUnlocked: !premium
        };

        setGeneratedRoute(newRoute);
        setIsGenerating(false);
        resolve(newRoute);
      }, 1500);
    });
  };

  return (
    <AppContext.Provider value={{
      routes,
      generatedRoute,
      activePrompt,
      isGenerating,
      premiumFeaturePrice,
      setActivePrompt,
      setIsGenerating,
      setRoutes,
      likeRoute,
      bookmarkRoute,
      addComment,
      addMemory,
      generateRouteFromVibe,
      unlockRoute
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
