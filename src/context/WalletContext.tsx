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
  connect: () => Promise<void> | void;
  disconnect: () => void;
  refreshProfile: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Inner provider that safely consumes Privy when available
function WalletProviderInner({ children }: { children: React.ReactNode }) {
  let privyAuth: ReturnType<typeof usePrivy> | null = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    privyAuth = usePrivy();
  } catch {
    privyAuth = null;
  }

  const [directAddress, setDirectAddress] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  // Load saved direct session if present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bh_direct_wallet');
      if (saved) setDirectAddress(saved);
    }
  }, []);

  const privyConnected = Boolean(privyAuth && privyAuth.ready && privyAuth.authenticated);
  const privyAddress = privyConnected ? privyAuth?.user?.wallet?.address || null : null;
  const userEmail = privyConnected ? privyAuth?.user?.email?.address || null : null;

  const connected = privyConnected || Boolean(directAddress);
  const publicKey = privyAddress || directAddress;

  const refreshProfile = useCallback(async () => {
    if (connected && publicKey) {
      const p = await dbClient.getProfile(publicKey);
      setProfile(p);
    } else {
      setProfile(null);
    }
  }, [connected, publicKey]);

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

  const connect = async () => {
    // 1. Primary: Try Privy login if Privy is ready & available
    if (privyAuth && typeof privyAuth.login === 'function') {
      try {
        privyAuth.login();
        return;
      } catch (e) {
        console.warn('Privy login call failed, trying fallback:', e);
      }
    }

    // 2. Secondary Fallback: Connect via browser window.ethereum (MetaMask / Rabby / Coinbase)
    if (typeof window !== 'undefined' && (window as unknown as { ethereum?: { request: (args: { method: string }) => Promise<string[]> } }).ethereum) {
      try {
        const eth = (window as unknown as { ethereum: { request: (args: { method: string }) => Promise<string[]> } }).ethereum;
        const accounts = await eth.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts[0]) {
          const addr = accounts[0];
          setDirectAddress(addr);
          localStorage.setItem('bh_direct_wallet', addr);
          return;
        }
      } catch (err) {
        console.warn('Browser wallet connection rejected:', err);
      }
    }

    // 3. Tertiary Fallback: Create or retrieve a local nomad wallet session so login NEVER stalls
    if (typeof window !== 'undefined') {
      let nomadAddr = localStorage.getItem('bh_direct_wallet');
      if (!nomadAddr) {
        const randomHex = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        nomadAddr = `0x${randomHex}`;
        localStorage.setItem('bh_direct_wallet', nomadAddr);
      }
      setDirectAddress(nomadAddr);
    }
  };

  const disconnect = () => {
    if (privyAuth && typeof privyAuth.logout === 'function') {
      try {
        privyAuth.logout();
      } catch (e) {
        console.warn('Privy logout error:', e);
      }
    }
    setDirectAddress(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bh_direct_wallet');
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
}

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <WalletProviderInner>{children}</WalletProviderInner>;
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
