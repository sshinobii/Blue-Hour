'use client';

import React from 'react';
import { useWallet } from '@/context/WalletContext';
import { X } from 'lucide-react';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose }) => {
  const { connect } = useWallet();

  if (!isOpen) return null;

  const handleAction = () => {
    connect();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-[840px] bg-white border border-[#E7E5D8] rounded-[24px] overflow-hidden shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/80 border border-[#E7E5D8] flex items-center justify-center text-[#15150F] hover:bg-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_420px]">
          {/* Left Art Panel */}
          <div className="relative min-h-[260px] md:min-h-[460px] bg-gradient-to-br from-[#FFE7A8] via-[#F3A9C1] to-[#9FD8E8] p-7 flex flex-col justify-end">
            <div className="bg-white/85 backdrop-blur-md rounded-[16px] p-4 text-[13.5px] text-[#15150F] leading-relaxed shadow-sm">
              &quot;Mapped a 7-day high alpine trek in 38 seconds. Best €650 I&apos;ve spent.&quot;
              <div className="text-[#5B5B52] text-[12px] font-bold mt-1">- Aura_Wanderer</div>
            </div>
          </div>

          {/* Right Sign In Form */}
          <div className="p-8 md:p-10 flex flex-col justify-center bg-white">
            <h2 className="text-2xl md:text-3xl font-black text-[#15150F] mb-2 leading-snug">
              Where do you<br />want to disappear?
            </h2>
            <p className="text-[#5B5B52] text-[13.5px] mb-6 leading-relaxed">
              Sign in to save routes, upload proof, and collect rewards. No seed phrase, no wallet popup.
            </p>

            <div className="space-y-2.5">
              <button
                onClick={handleAction}
                className="w-full bg-[#15150F] text-[#CCFF00] font-bold py-3 px-4 rounded-[12px] text-[14px] hover:opacity-90 transition-all text-center flex items-center justify-center gap-2"
              >
                Continue with email
              </button>

              <button
                onClick={handleAction}
                className="w-full bg-white text-[#15150F] border border-[#E7E5D8] font-semibold py-3 px-4 rounded-[12px] text-[14px] hover:bg-[#FDFCF6] transition-all text-center"
              >
                Continue with Google
              </button>

              <button
                onClick={handleAction}
                className="w-full bg-white text-[#15150F] border border-[#E7E5D8] font-semibold py-3 px-4 rounded-[12px] text-[14px] hover:bg-[#FDFCF6] transition-all text-center"
              >
                Continue with Apple
              </button>

              <div className="flex items-center gap-3 text-[#B4B2A4] text-[12px] my-3">
                <div className="flex-1 h-px bg-[#E7E5D8]" />
                <span>or</span>
                <div className="flex-1 h-px bg-[#E7E5D8]" />
              </div>

              <button
                onClick={handleAction}
                className="w-full bg-white text-[#15150F] border border-dashed border-[#15150F] font-bold py-3 px-4 rounded-[12px] text-[13.5px] hover:bg-[#FDFCF6] transition-all text-center"
              >
                Connect an existing wallet
              </button>
            </div>

            <div className="text-[11.5px] text-[#B4B2A4] text-center mt-5 leading-relaxed">
              A Robinhood Chain wallet is created for you automatically.<br />
              You can export or connect your own anytime in Settings.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
