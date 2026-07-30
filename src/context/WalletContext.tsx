'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { dbClient, Profile } from '@/lib/db';

interface WalletContextType {
  connected: boolean;
  publicKey: string | null;
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

  const [profile, setProfile] = useState<Profile | null>(null);

  const isPrivyAvailable = Boolean(privyAuth && privyAuth.ready);

  // Only connected via real Privy auth — no mock fallback
  const connected = isPrivyAvailable ? privyAuth!.authenticated : false;

  const publicKey = isPrivyAvailable && privyAuth!.user?.wallet?.address
    ? privyAuth!.user.wallet.address
    : null;

  const userEmail = isPrivyAvailable && privyAuth!.user?.email?.address
    ? privyAuth!.user.email.address
    : null;

  const userId = publicKey || null;

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
    // Only trigger real Privy login — never auto-connect
    if (privyAuth && typeof privyAuth.login === 'function') {
      privyAuth.login();
    }
  };

  const disconnect = () => {
    if (privyAuth && typeof privyAuth.logout === 'function') {
      privyAuth.logout();
    }
    setProfile(null);
  };

  return (
    <WalletContext.Provider
      value={{
        connected,
        publicKey,
        userEmail,
        hourBalance: profile?.hour_balance_cached || 0,
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
