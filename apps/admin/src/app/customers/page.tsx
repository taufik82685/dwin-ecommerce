'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  total_orders: number;
  total_spent: number;
  last_order: string;
}

const MOCK_CUSTOMERS: Customer[] = [
  { id: 'CUS-001', name: 'Rafayel K.', phone: '01712345678', email: 'rafayel@mail.com', total_orders: 5, total_spent: 32800, last_order: '2026-03-14' },
  { id: 'CUS-002', name: 'Priya S.', phone: '01812345678', email: 'priya@mail.com', total_orders: 2, total_spent: 10998, last_order: '2026-03-14' },
  { id: 'CUS-003', name: 'Omar F.', phone: '01912345678', email: 'omar@mail.com', total_orders: 8, total_spent: 75600, last_order: '2026-03-13' },
  { id: 'CUS-004', name: 'Tasnim R.', phone: '01612345678', email: '', total_orders: 1, total_spent: 3999, last_order: '2026-03-13' },
  { id: 'CUS-005', name: 'Sadia I.', phone: '01312345678', email: 'sadia@mail.com', total_orders: 3, total_spent: 15500, last_order: '2026-03-12' },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/customers`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setCustomers(data); })
      .catch(() => {});
  }, []);

  const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = customers.reduce((s, c) => s + (c.total_spent || 0), 0);

  return (
    <div className="p-6 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs text-[#06b6d4] font-mono tracking-[0.3em] uppercase mb-1">CRM System</p>
          <h1 className="text-3xl font-black text-white font-orbitron tracking-widest">CUSTOMERS</h1>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-cyber pl-9 w-64"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#06b6d4]" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5 mb-8">
        {[
          { label: 'Total Customers', value: customers.length, color: '#06b6d4' },
          { label: 'Total Revenue', value: `Tk ${totalRevenue.toLocaleString()}`, color: '#8b5cf6' },
          { label: 'Avg. Spend', value: `Tk ${customers.length > 0 ? Math.round(totalRevenue / customers.length).toLocaleString() : 0}`, color: '#22c55e' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="stat-card rounded-xl p-5">
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-mono mb-2">{s.label}</p>
            <p className="text-2xl font-black font-orbitron tracking-wider" style={{ color: s.color }}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left">Customer</th>
                <th className="text-left">Phone</th>
                <th className="text-left">Email</th>
                <th className="text-left">Orders</th>
                <th className="text-left">Total Spent</th>
                <th className="text-left">Last Order</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-slate-600 font-mono">No customers found</td></tr>
              ) : filtered.map((cust, i) => (
                <motion.tr key={cust.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#06b6d4]/20 border border-[#06b6d4]/40 flex items-center justify-center text-[#06b6d4] font-bold text-xs">
                        {cust.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="text-slate-100 font-medium text-sm">{cust.name}</p>
                        <p className="text-slate-600 text-xs font-mono">{cust.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="font-mono text-sm text-slate-300">{cust.phone}</td>
                  <td className="text-slate-400 text-sm">{cust.email || '—'}</td>
                  <td>
                    <span className="font-bold text-sm font-orbitron" style={{ color: cust.total_orders >= 5 ? '#22c55e' : cust.total_orders >= 2 ? '#06b6d4' : '#94a3b8' }}>
                      {cust.total_orders}
                    </span>
                  </td>
                  <td className="font-bold text-[#06b6d4] font-mono">Tk {(cust.total_spent || 0).toLocaleString()}</td>
                  <td className="text-slate-500 text-xs font-mono">
                    {cust.last_order ? new Date(cust.last_order).toLocaleDateString() : '—'}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
