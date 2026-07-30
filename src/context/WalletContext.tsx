'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { dbClient, Profile } from '@/lib/db';

interface WalletContextType {
  connected: boolean;
  publicKey: string | null; // Embedded wallet address on Robinhood Chain
  userEmail: string | null;
  hourBalance: number;
  tier: string;
  profile: Profile | null;
  connect: () => void;
  disconnect: () => void;
  refreshProfile: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  let privyAuth: ReturnType<typeof usePrivy> | null = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    privyAuth = usePrivy();
  } catch {
    privyAuth = null;
  }

  const [mockConnected, setMockConnected] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  const isPrivyAvailable = Boolean(privyAuth && privyAuth.ready);

  const connected = isPrivyAvailable
    ? (privyAuth!.authenticated || mockConnected)
    : mockConnected;

  const publicKey = isPrivyAvailable && privyAuth!.user?.wallet?.address
    ? privyAuth!.user.wallet.address
    : (mockConnected ? '0x5b78709bF844d5aD0d46f40b2D7f32394F70C246' : null);

  const userEmail = isPrivyAvailable && privyAuth!.user?.email?.address
    ? privyAuth!.user.email.address
    : (mockConnected ? 'traveler@bluehour.io' : null);

  const userId = publicKey || (mockConnected ? 'usr_aura' : null);

  const refreshProfile = useCallback(async () => {
    if (connected && userId) {
      const p = await dbClient.getProfile(userId);
      setProfile(p);
    } else {
      setProfile(null);
    }
  }, [connected, userId]);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) {
        refreshProfile();
      }
    });
    return () => {
      isMounted = false;
    };
  }, [refreshProfile]);

  const connect = () => {
    if (privyAuth && typeof privyAuth.login === 'function') {
      try {
        privyAuth.login();
        return;
      } catch (err) {
        console.warn('Privy login invocation fallback:', err);
      }
    }
    // Reliable fallback if Privy is initializing or unavailable
    setMockConnected(true);
  };

  const disconnect = () => {
    if (privyAuth && typeof privyAuth.logout === 'function' && privyAuth.authenticated) {
      try {
        privyAuth.logout();
      } catch (err) {
        console.warn('Privy logout error:', err);
      }
    }
    setMockConnected(false);
  };

  return (
    <WalletContext.Provider
      value={{
        connected,
        publicKey,
        userEmail,
        hourBalance: profile?.hour_balance_cached || 4280,
        tier: profile?.tier || 'Nomad',
        profile,
        connect,
        disconnect,
        refreshProfile,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
