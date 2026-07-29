'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWallet } from '@/context/WalletContext';
import { Menu, X } from 'lucide-react';
import { SignInModal } from '@/components/SignInModal';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { connected, publicKey, disconnect } = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);

  const formatAddress = (addr: string) =>
    addr.length > 10 ? `${addr.slice(0, 5)}...${addr.slice(-4)}` : addr;

  const navLinks = [
    { name: 'Discover', path: '/discover' },
    { name: 'Wren', path: '/ai-agent' },
    { name: 'Map explorer', path: '/map' },
    { name: 'Profile', path: '/profile' },
  ];

  return (
    <>
      <header className="w-full bg-[#FBFAF3] border-b border-[#E7E5D8]">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-12 h-[72px] flex items-center justify-between">
          
          {/* Logo with Wren icon slot */}
          <Link href="/" className="flex items-center gap-2.5 font-black text-[18px] text-[#15150F] no-underline">
            <div className="w-[26px] h-[26px] rounded-[7px] bg-[#15150F] text-[#CCFF00] flex items-center justify-center font-black text-[14px] relative">
              b
              <span className="absolute -top-1 -right-1 text-[10px]" title="Wren companion active">🕊️</span>
            </div>
            Bluehour
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-[14px] text-[#5B5B52]">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`transition-colors hover:text-[#15150F] ${
                    isActive ? 'text-[#15150F] font-bold' : ''
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Button */}
          <div className="hidden md:flex items-center gap-3">
            {connected && publicKey ? (
              <button
                onClick={disconnect}
                className="bg-[#15150F] text-[#CCFF00] border-none px-5 py-2.5 rounded-full font-bold text-[13.5px] cursor-pointer hover:opacity-90 transition-all"
              >
                {formatAddress(publicKey)}
              </button>
            ) : (
              <button
                onClick={() => setSignInOpen(true)}
                className="bg-[#15150F] text-[#CCFF00] border-none px-5 py-2.5 rounded-full font-bold text-[14px] cursor-pointer hover:opacity-90 transition-all"
              >
                Sign in
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#15150F]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FFFFFF] border-b border-[#E7E5D8] px-6 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block font-medium text-[15px] text-[#15150F] py-2"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-2">
              {connected && publicKey ? (
                <button
                  onClick={disconnect}
                  className="w-full bg-[#15150F] text-[#CCFF00] py-3 rounded-full font-bold text-center text-[14px]"
                >
                  {formatAddress(publicKey)} (Disconnect)
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSignInOpen(true);
                  }}
                  className="w-full bg-[#15150F] text-[#CCFF00] py-3 rounded-full font-bold text-center text-[14px]"
                >
                  Sign in
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Sign In Modal */}
      <SignInModal isOpen={signInOpen} onClose={() => setSignInOpen(false)} />
    </>
  );
};
