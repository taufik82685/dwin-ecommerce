'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// SVG Sparkline chart
function Sparkline({ data, color = '#06b6d4' }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 120, h = 40;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });
  const area = `M${pts[0]} ${pts.slice(1).map(p => `L${p}`).join(' ')} L${w},${h} L0,${h} Z`;
  const line = `M${pts[0]} ${pts.slice(1).map(p => `L${p}`).join(' ')}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <defs>
        <linearGradient id={`g-${color.replace('#','')}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#g-${color.replace('#','')})`}/>
      <path d={line} stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

// Revenue area chart
function RevenueChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map(d => d.value));
  const W = 600, H = 200;
  const pad = { left: 48, right: 16, top: 16, bottom: 32 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;
  
  const pts = data.map((d, i) => {
    const x = pad.left + (i / (data.length - 1)) * chartW;
    const y = pad.top + (1 - d.value / max) * chartH;
    return { x, y, ...d };
  });

  const area = `M${pts[0].x},${pts[0].y} ${pts.slice(1).map(p => `L${p.x},${p.y}`).join(' ')} L${pts[pts.length-1].x},${H - pad.bottom} L${pts[0].x},${H - pad.bottom} Z`;
  const line = `M${pts[0].x},${pts[0].y} ${pts.slice(1).map(p => `L${p.x},${p.y}`).join(' ')}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="rev-grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[0,0.25,0.5,0.75,1].map((frac, i) => (
        <line key={i} x1={pad.left} x2={W - pad.right} y1={pad.top + frac * chartH} y2={pad.top + frac * chartH} stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
      ))}
      <path d={area} fill="url(#rev-grad)"/>
      <path d={line} stroke="#06b6d4" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="#0f172a" stroke="#06b6d4" strokeWidth="2"/>
          <text x={p.x} y={H - pad.bottom + 18} textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace">{p.label}</text>
        </g>
      ))}
    </svg>
  );
}

const STATUS_BADGE: Record<string, string> = {
  'Pending': 'badge-pending', 'Confirmed': 'badge-confirmed',
  'Shipped': 'badge-shipped', 'Delivered': 'badge-delivered', 'Cancelled': 'badge-cancelled'
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState<{ id: string; customer_name: string; total_amount: number; status: string; created_at: string }[]>([]);
  const [stats, setStats] = useState({ revenue: 0, orders: 0, pending: 0, customers: 0 });

  const revenueData = [
    { label: 'Jan', value: 45000 },
    { label: 'Feb', value: 62000 },
    { label: 'Mar', value: 48000 },
    { label: 'Apr', value: 78000 },
    { label: 'May', value: 95000 },
    { label: 'Jun', value: 82000 },
    { label: 'Jul', value: 110000 },
  ];

  useEffect(() => {
    fetch(`${API_URL}/api/orders`).then(r => r.json()).then(data => {
      if (Array.isArray(data)) {
        const recent = data.slice(0, 8);
        setOrders(recent);
        const totalRev = data.reduce((sum: number, o: { total_amount?: number }) => sum + (o.total_amount || 0), 0);
        const pending = data.filter((o: { status: string }) => o.status === 'Pending').length;
        setStats({ revenue: totalRev, orders: data.length, pending, customers: 0 });
      }
    }).catch(() => {});
  }, []);

  const STAT_CARDS = [
    { label: 'Total Revenue', value: `Tk ${stats.revenue > 0 ? stats.revenue.toLocaleString() : '2,45,800'}`, change: '+14.2%', up: true, color: '#06b6d4', data: [40,55,48,62,58,75,82] },
    { label: 'Total Orders', value: stats.orders > 0 ? stats.orders.toString() : '342', change: '+8.7%', up: true, color: '#8b5cf6', data: [20,35,28,42,38,55,62] },
    { label: 'Pending Orders', value: stats.pending > 0 ? stats.pending.toString() : '18', change: '-3.1%', up: false, color: '#f59e0b', data: [22,18,25,14,20,18,18] },
    { label: 'Avg. Order Value', value: 'Tk 6,840', change: '+5.4%', up: true, color: '#22c55e', data: [50,58,54,62,60,68,70] },
  ];

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs text-[#06b6d4] font-mono tracking-[0.3em] uppercase mb-1">Control Center</p>
          <h1 className="text-3xl font-black text-white font-orbitron tracking-widest">OVERVIEW</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/products/new" className="px-5 py-2.5 bg-[#06b6d4] text-[#0f172a] text-xs font-black tracking-widest uppercase rounded-sm hover:bg-white transition-colors font-orbitron shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            + ADD PRODUCT
          </Link>
          <Link href="/orders" className="px-5 py-2.5 border border-[rgba(6,182,212,0.3)] text-[#06b6d4] text-xs font-black tracking-widest uppercase rounded-sm hover:bg-[rgba(6,182,212,0.1)] transition-colors font-orbitron">
            ALL ORDERS
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {STAT_CARDS.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="stat-card rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-mono mb-2">{s.label}</p>
                <p className="text-2xl font-black text-white font-orbitron tracking-wider leading-none">{s.value}</p>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-sm font-mono ${s.up ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                {s.change}
              </span>
            </div>
            <Sparkline data={s.data} color={s.color} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="xl:col-span-2 glass-panel rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-mono mb-1">Monthly Performance</p>
              <h3 className="text-lg font-black text-white font-orbitron tracking-wide">Revenue Analytics</h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#06b6d4] shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
              <span className="text-[10px] text-slate-400 font-mono tracking-widest">REVENUE (Tk)</span>
            </div>
          </div>
          <div className="h-52">
            <RevenueChart data={revenueData} />
          </div>
        </motion.div>

        {/* Order Status Breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-panel rounded-xl p-6">
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-mono mb-1">Orders by Status</p>
          <h3 className="text-lg font-black text-white font-orbitron tracking-wide mb-5">Status Matrix</h3>
          <div className="space-y-4">
            {[
              { label: 'Delivered', count: 201, pct: 58, color: '#22c55e' },
              { label: 'Confirmed', count: 76, pct: 22, color: '#06b6d4' },
              { label: 'Pending', count: 42, pct: 12, color: '#f59e0b' },
              { label: 'Shipped', count: 18, pct: 5, color: '#8b5cf6' },
              { label: 'Cancelled', count: 11, pct: 3, color: '#ef4444' },
            ].map(s => (
              <div key={s.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-mono">{s.label}</span>
                  <span className="text-slate-500 font-mono">{s.count} ({s.pct}%)</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${s.pct}%`, background: s.color, boxShadow: `0 0 8px ${s.color}` }}></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Orders Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-panel rounded-xl overflow-hidden">
        <div className="p-5 border-b border-[rgba(255,255,255,0.05)] flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-mono mb-1">Latest Transactions</p>
            <h3 className="text-base font-black text-white font-orbitron tracking-wide">Recent Orders</h3>
          </div>
          <Link href="/orders" className="text-[10px] text-[#06b6d4] font-bold tracking-widest uppercase font-orbitron hover:text-white transition-colors">
            VIEW ALL &gt;&gt;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left">Order ID</th>
                <th className="text-left">Customer</th>
                <th className="text-left">Amount</th>
                <th className="text-left">Status</th>
                <th className="text-left">Date</th>
                <th className="text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {(orders.length > 0 ? orders : [
                { id: 'DW-1041', customer_name: 'Rafayel K.', total_amount: 8999, status: 'Delivered', created_at: '2026-03-14' },
                { id: 'DW-1040', customer_name: 'Priya S.', total_amount: 5499, status: 'Shipped', created_at: '2026-03-14' },
                { id: 'DW-1039', customer_name: 'Omar F.', total_amount: 24999, status: 'Confirmed', created_at: '2026-03-13' },
                { id: 'DW-1038', customer_name: 'Tasnim R.', total_amount: 3999, status: 'Pending', created_at: '2026-03-13' },
                { id: 'DW-1037', customer_name: 'Arif H.', total_amount: 1500, status: 'Cancelled', created_at: '2026-03-12' },
              ]).map((order) => (
                <tr key={order.id}>
                  <td className="font-mono text-[#06b6d4] font-bold text-xs">{order.id || `#${order.id}`}</td>
                  <td className="text-slate-200 font-medium">{order.customer_name}</td>
                  <td className="text-white font-bold font-mono">Tk {(order.total_amount || 0).toLocaleString()}</td>
                  <td>
                    <span className={`badge ${STATUS_BADGE[order.status] || 'badge-pending'}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {order.status}
                    </span>
                  </td>
                  <td className="text-slate-500 text-xs font-mono">
                    {order.created_at ? new Date(order.created_at).toLocaleDateString() : '—'}
                  </td>
                  <td>
                    <Link href={`/orders/${order.id}`} className="text-[10px] font-bold tracking-widest text-[#06b6d4] hover:text-white transition-colors font-orbitron uppercase">
                      VIEW →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
