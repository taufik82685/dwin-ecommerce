'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: 'Overview', icon: '◈' },
  { href: '/products', label: 'Products', icon: '◉' },
  { href: '/orders', label: 'Orders', icon: '◎' },
  { href: '/customers', label: 'Customers', icon: '◍' },
  { href: '/categories', label: 'Categories', icon: '◫' },
  { href: '/coupons', label: 'Coupons', icon: '◬' },
  { href: '/banners', label: 'Banners', icon: '▨' },
  { href: '/settings', label: 'Settings', icon: '◌' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-60'} flex-shrink-0 bg-[#0a1628] border-r border-[rgba(6,182,212,0.15)] flex flex-col transition-all duration-300`}>
      {/* Brand */}
      <div className="h-16 flex items-center px-4 border-b border-[rgba(6,182,212,0.1)] gap-3">
        <div className="w-8 h-8 rounded-sm bg-[#06b6d4]/20 border border-[#06b6d4] flex items-center justify-center text-[#06b6d4] font-black text-sm font-orbitron flex-shrink-0">D</div>
        {!collapsed && (
          <div>
            <p className="text-white font-black text-sm font-orbitron tracking-widest leading-none">DWIN</p>
            <p className="text-[#06b6d4] text-[9px] tracking-[0.2em] font-mono uppercase">Control Center</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-slate-600 hover:text-[#06b6d4] transition-colors flex-shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {collapsed ? <polyline points="9 18 15 12 9 6"/> : <polyline points="15 18 9 12 15 6"/>}
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {NAV_ITEMS.map(item => {
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all nav-item ${isActive ? 'nav-item-active' : 'text-slate-400'}`}
            >
              <span className={`text-base flex-shrink-0 ${isActive ? 'text-[#06b6d4]' : 'text-slate-500'}`}>{item.icon}</span>
              {!collapsed && (
                <span className={`text-xs font-bold tracking-[0.1em] uppercase font-orbitron ${isActive ? 'text-[#06b6d4]' : ''}`}>
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-[rgba(255,255,255,0.05)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#06b6d4]/20 border border-[#06b6d4]/40 flex items-center justify-center text-xs font-bold text-[#06b6d4]">A</div>
            <div>
              <p className="text-white text-xs font-bold">Admin</p>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                <p className="text-[10px] text-green-400 font-mono">ONLINE</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
