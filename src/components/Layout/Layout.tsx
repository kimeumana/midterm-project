import React from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#161111]">
      <Header />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};