'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'HOME' },
    { href: '/products', label: 'GEAR SHOP' },
    { href: '/track', label: 'TRACK ORDER' },
    { href: '/support', label: 'SUPPORT' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f172a]/80 backdrop-blur-xl border-b border-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Brand */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 border-2 border-accent rounded-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-accent/20 group-hover:bg-accent/40 transition-colors"></div>
                <div className="absolute inset-0 flex items-center justify-center text-accent font-black text-sm font-orbitron">D</div>
              </div>
              <span className="text-xl font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-accent to-neon-purple font-orbitron">
                DWIN<span className="text-white"> STORE</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} className="text-slate-400 hover:text-white text-xs font-bold tracking-[0.2em] transition-colors hover:text-shadow-neon font-orbitron border-b border-transparent hover:border-accent pb-1">
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Search button */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-slate-400 hover:text-accent transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </button>

              {/* Cart */}
              <Link href="/cart" className="relative p-2 text-slate-400 hover:text-accent transition-colors group">
                <span className="absolute top-0 right-0.5 w-4 h-4 rounded-full bg-neon-purple text-[9px] font-black text-white flex items-center justify-center shadow-[0_0_8px_rgba(139,92,246,0.8)]">0</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-all">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
              </Link>

              {/* Mobile menu */}
              <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-slate-400 hover:text-accent transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {menuOpen ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-white/5 overflow-hidden"
            >
              <form action="/products" method="GET" className="max-w-7xl mx-auto px-4 py-4">
                <div className="relative">
                  <input
                    autoFocus
                    type="text"
                    name="q"
                    placeholder="Search products, categories, brands..."
                    className="w-full bg-background/70 border border-white/10 rounded-sm pl-12 pr-4 py-3.5 text-white text-sm focus:outline-none focus:border-accent transition-all font-mono placeholder:text-slate-600"
                  />
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-accent text-background text-xs font-bold rounded-sm font-orbitron">SCAN</button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-white/5 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-2 bg-background/95">
                {navLinks.map(link => (
                  <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="block text-slate-300 hover:text-accent text-sm font-bold tracking-[0.2em] py-3 border-b border-white/5 font-orbitron transition-colors">
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};
