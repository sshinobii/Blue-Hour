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

  // Load saved browser wallet session if previously connected via window.ethereum
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bh_browser_wallet');
      if (saved && saved.startsWith('0x')) {
        setDirectAddress(saved);
      }
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
    // 1. Primary: Trigger real Privy login modal
    if (privyAuth && typeof privyAuth.login === 'function') {
      try {
        privyAuth.login();
        return;
      } catch (e) {
        console.warn('Privy login error:', e);
      }
    }

    // 2. Fallback: Connect real browser Web3 wallet (MetaMask / Coinbase / Rabby / Phantom)
    if (typeof window !== 'undefined' && (window as unknown as { ethereum?: { request: (args: { method: string }) => Promise<string[]> } }).ethereum) {
      try {
        const eth = (window as unknown as { ethereum: { request: (args: { method: string }) => Promise<string[]> } }).ethereum;
        const accounts = await eth.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts[0] && accounts[0].startsWith('0x')) {
          const addr = accounts[0];
          setDirectAddress(addr);
          localStorage.setItem('bh_browser_wallet', addr);
          return;
        }
      } catch (err) {
        console.warn('Browser wallet connection rejected:', err);
      }
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
      localStorage.removeItem('bh_browser_wallet');
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
