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
    // Privy context not present or invalid app id
    privyAuth = null;
  }

  // Fallback demo state when Privy is not configured or for instant guest demo
  const [mockConnected, setMockConnected] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  const isPrivyAvailable = Boolean(privyAuth && privyAuth.ready);

  const connected = isPrivyAvailable
    ? privyAuth!.authenticated
    : mockConnected;

  const publicKey = isPrivyAvailable && privyAuth!.user?.wallet?.address
    ? privyAuth!.user.wallet.address
    : (connected ? '0x8f2c...c91a' : null);

  const userEmail = isPrivyAvailable && privyAuth!.user?.email?.address
    ? privyAuth!.user.email.address
    : (connected ? 'traveler@bluehour.io' : null);

  const userId = publicKey || 'usr_aura';

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
    if (isPrivyAvailable && privyAuth) {
      privyAuth.login();
    } else {
      setMockConnected(true);
    }
  };

  const disconnect = () => {
    if (isPrivyAvailable && privyAuth) {
      privyAuth.logout();
    } else {
      setMockConnected(false);
    }
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
