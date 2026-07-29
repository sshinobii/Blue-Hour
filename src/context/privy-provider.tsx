'use client';

import React from 'react';
import { PrivyProvider } from '@privy-io/react-auth';

// Robinhood Chain EVM custom definition
const robinhoodChain = {
  id: 98865,
  name: 'Robinhood Chain',
  network: 'robinhood-chain',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.robinhood.com'],
    },
    public: {
      http: ['https://rpc.robinhood.com'],
    },
  },
};

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || '';

const isValidPrivyAppId = (id: string) => {
  if (!id || typeof id !== 'string') return false;
  if (id.includes('your_privy_app_id') || id.length < 10) return false;
  return true;
};

export const PrivyClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (!isValidPrivyAppId(PRIVY_APP_ID)) {
    return <>{children}</>;
  }

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        appearance: {
          theme: 'light',
          accentColor: '#CCFF00',
          logo: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?w=100',
        },
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets',
          },
        },
        defaultChain: robinhoodChain,
        supportedChains: [robinhoodChain],
      }}
    >
      {children}
    </PrivyProvider>
  );
};
