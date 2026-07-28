'use client';

import React from 'react';
import { useWallet } from '@/context/WalletContext';

interface WalletGateProps {
  title: string;
  description: string;
}

export const WalletGate: React.FC<WalletGateProps> = ({
  title,
  description,
}) => {
  const { connect } = useWallet();

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-20 px-5 min-h-[450px] bg-[#FBFAF3] text-[#15150F]">
      <div className="bg-white border border-[#E7E5D8] rounded-[24px] p-8 max-w-md w-full text-center space-y-6">
        <div className="w-12 h-12 rounded-full bg-[#CCFF00] text-[#3A4A00] flex items-center justify-center mx-auto font-black text-xl">
          b
        </div>

        <div className="space-y-2">
          <h2 className="font-black text-2xl tracking-tight">{title}</h2>
          <p className="text-[13.5px] text-[#5B5B52] leading-relaxed max-w-xs mx-auto">
            {description}
          </p>
        </div>

        <button
          onClick={connect}
          className="w-full bg-[#15150F] text-[#CCFF00] py-3.5 rounded-full font-bold text-[14px] hover:opacity-90 transition-all"
        >
          Connect wallet (Robinhood Chain)
        </button>

        <span className="text-[11.5px] text-[#B4B2A4] block">
          No seed phrase required. Embedded wallet created via Privy.
        </span>
      </div>
    </div>
  );
};
