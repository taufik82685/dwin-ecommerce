'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_order: number;
  uses: number;
  max_uses: number;
  expires: string;
  active: boolean;
}

const MOCK_COUPONS: Coupon[] = [
  { id: '1', code: 'DWIN20', type: 'percentage', value: 20, min_order: 2000, uses: 42, max_uses: 100, expires: '2026-04-30', active: true },
  { id: '2', code: 'GAMING500', type: 'fixed', value: 500, min_order: 5000, uses: 8, max_uses: 50, expires: '2026-03-31', active: true },
  { id: '3', code: 'NEWUSER10', type: 'percentage', value: 10, min_order: 0, uses: 200, max_uses: 500, expires: '2026-06-30', active: false },
];

const EMPTY_FORM = { code: '', type: 'percentage' as 'percentage' | 'fixed', value: '', min_order: '', max_uses: '', expires: '' };

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(MOCK_COUPONS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newCoupon: Coupon = {
      id: Date.now().toString(),
      code: form.code.toUpperCase(),
      type: form.type,
      value: parseFloat(form.value),
      min_order: parseFloat(form.min_order) || 0,
      uses: 0,
      max_uses: parseInt(form.max_uses) || 999,
      expires: form.expires,
      active: true,
    };
    setCoupons([newCoupon, ...coupons]);
    setShowForm(false);
    setForm(EMPTY_FORM);
  };

  const toggleActive = (id: string) => setCoupons(coupons.map(c => c.id === id ? { ...c, active: !c.active } : c));
  const deleteCoupon = (id: string) => { if (confirm('Delete this coupon?')) setCoupons(coupons.filter(c => c.id !== id)); };

  return (
    <div className="p-6 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs text-[#06b6d4] font-mono tracking-[0.3em] uppercase mb-1">Discount Engine</p>
          <h1 className="text-3xl font-black text-white font-orbitron tracking-widest">COUPONS</h1>
        </div>
        <button onClick={() => setShowForm(true)} className="px-6 py-2.5 bg-[#06b6d4] text-[#0f172a] text-xs font-black rounded-sm hover:bg-white transition-colors shadow-[0_0_20px_rgba(6,182,212,0.3)] uppercase tracking-widest font-orbitron">
          + CREATE COUPON
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {coupons.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className={`glass-panel rounded-xl p-5 border ${c.active ? 'border-[rgba(6,182,212,0.3)]' : 'border-[rgba(255,255,255,0.05)] opacity-60'}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs text-slate-500 font-mono tracking-widest uppercase">{c.active ? 'ACTIVE' : 'INACTIVE'}</span>
                <p className="text-2xl font-black text-white font-orbitron tracking-wider mt-1">{c.code}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggleActive(c.id)} className={`text-[10px] px-3 py-1 rounded-sm border font-mono font-bold transition-all ${c.active ? 'border-green-500/40 text-green-400 hover:bg-green-500/10' : 'border-slate-600 text-slate-500 hover:border-white/30'}`}>
                  {c.active ? 'ON' : 'OFF'}
                </button>
                <button onClick={() => deleteCoupon(c.id)} className="text-[10px] px-3 py-1 rounded-sm border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all font-mono">✕</button>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-mono text-xs">Discount</span>
                <span className="text-[#06b6d4] font-bold font-orbitron">{c.type === 'percentage' ? `${c.value}% OFF` : `Tk ${c.value} OFF`}</span>
              </div>
              {c.min_order > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-mono text-xs">Min Order</span>
                  <span className="text-slate-300 font-mono text-xs">Tk {c.min_order.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-mono text-xs">Expires</span>
                <span className="text-slate-300 font-mono text-xs">{new Date(c.expires).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Usage bar */}
            <div>
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-1.5">
                <span>Usage</span>
                <span>{c.uses}/{c.max_uses}</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-[#06b6d4]" style={{ width: `${Math.min((c.uses / c.max_uses) * 100, 100)}%`, boxShadow: '0 0 8px rgba(6,182,212,0.6)' }}></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Coupon Form */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowForm(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm"/>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-lg glass-panel rounded-xl border border-[rgba(6,182,212,0.3)] p-6 shadow-[0_0_50px_rgba(6,182,212,0.1)]">
              <h3 className="text-lg font-black text-white font-orbitron tracking-wide mb-6 border-b border-white/10 pb-4">CREATE COUPON</h3>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono tracking-widest uppercase block mb-2">Coupon Code *</label>
                    <input required type="text" value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} className="input-cyber font-mono font-bold tracking-widest text-[#06b6d4]" placeholder="DWIN20" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono tracking-widest uppercase block mb-2">Type *</label>
                    <select value={form.type} onChange={e => setForm({...form, type: e.target.value as 'percentage' | 'fixed'})} className="input-cyber">
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (Tk)</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono tracking-widest uppercase block mb-2">Value *</label>
                    <input required type="number" value={form.value} onChange={e => setForm({...form, value: e.target.value})} className="input-cyber" placeholder={form.type === 'percentage' ? '20' : '500'} />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono tracking-widest uppercase block mb-2">Min Order (Tk)</label>
                    <input type="number" value={form.min_order} onChange={e => setForm({...form, min_order: e.target.value})} className="input-cyber" placeholder="0" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono tracking-widest uppercase block mb-2">Max Uses</label>
                    <input type="number" value={form.max_uses} onChange={e => setForm({...form, max_uses: e.target.value})} className="input-cyber" placeholder="100" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono tracking-widest uppercase block mb-2">Expiry Date *</label>
                    <input required type="date" value={form.expires} onChange={e => setForm({...form, expires: e.target.value})} className="input-cyber" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 text-slate-400 hover:text-white transition-colors text-sm font-mono">Cancel</button>
                  <button type="submit" className="px-8 py-2.5 bg-[#06b6d4] text-[#0f172a] font-black text-xs rounded-sm tracking-widest hover:bg-white transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] font-orbitron uppercase">
                    DEPLOY COUPON
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
