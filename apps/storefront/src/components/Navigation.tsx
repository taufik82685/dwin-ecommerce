import React from 'react';
import Link from 'next/link';

export const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B0B0B]/80 backdrop-blur-md border-b border-cyan-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              ESPORTS<span className="text-white">GEAR</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-300 hover:text-cyan-400 font-medium tracking-wide transition-colors">
              HOME
            </Link>
            <Link href="/products" className="text-gray-300 hover:text-cyan-400 font-medium tracking-wide transition-colors">
              GEAR
            </Link>
            <Link href="/track" className="text-gray-300 hover:text-purple-400 font-medium tracking-wide transition-colors">
              TRACK ORDER
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative p-2 text-cyan-400 hover:text-white transition-colors">
              <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500 text-[10px] items-center justify-center text-white font-bold">2</span>
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
