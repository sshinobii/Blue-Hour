'use client';

import React from 'react';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBFAF3] text-[#15150F]">
      {children}
    </div>
  );
};
