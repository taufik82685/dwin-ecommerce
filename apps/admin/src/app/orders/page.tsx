'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Order {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  total_amount: number;
  status: string;
  payment_method: string;
  created_at: string;
  items?: { product_name: string; quantity: number; price: number }[];
}

const STATUS_FLOW = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
const STATUS_BADGE: Record<string, string> = {
  'Pending': 'badge-pending', 'Confirmed': 'badge-confirmed',
  'Shipped': 'badge-shipped', 'Delivered': 'badge-delivered', 'Cancelled': 'badge-cancelled'
};

const MOCK_ORDERS: Order[] = [
  { id: 'DW-1041', customer_name: 'Rafayel K.', phone: '01712345678', address: 'Mirpur-10, Dhaka', total_amount: 8999, status: 'Delivered', payment_method: 'bKash', created_at: '2026-03-14T08:21:00Z' },
  { id: 'DW-1040', customer_name: 'Priya S.', phone: '01812345678', address: 'Gulshan-2, Dhaka', total_amount: 5499, status: 'Shipped', payment_method: 'Nagad', created_at: '2026-03-14T06:15:00Z' },
  { id: 'DW-1039', customer_name: 'Omar F.', phone: '01912345678', address: 'Banani, Dhaka', total_amount: 24999, status: 'Confirmed', payment_method: 'COD', created_at: '2026-03-13T14:30:00Z' },
  { id: 'DW-1038', customer_name: 'Tasnim R.', phone: '01612345678', address: 'Dhanmondi, Dhaka', total_amount: 3999, status: 'Pending', payment_method: 'bKash', created_at: '2026-03-13T11:00:00Z' },
  { id: 'DW-1037', customer_name: 'Arif H.', phone: '01512345678', address: 'Uttara, Dhaka', total_amount: 1500, status: 'Cancelled', payment_method: 'COD', created_at: '2026-03-12T09:45:00Z' },
  { id: 'DW-1036', customer_name: 'Sadia I.', phone: '01312345678', address: 'Khilgaon, Dhaka', total_amount: 6000, status: 'Delivered', payment_method: 'Nagad', created_at: '2026-03-12T07:30:00Z' },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/orders`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setOrders(data); })
      .catch(() => {});
  }, []);

  const filtered = orders.filter(o => {
    const matchFilter = filter === 'All' || o.status === filter;
    const matchSearch = o.customer_name?.toLowerCase().includes(search.toLowerCase()) || o.id?.toString().includes(search);
    return matchFilter && matchSearch;
  });

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === orderId) setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    } catch {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } finally {
      setUpdatingId(null);
    }
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'Pending').length,
    revenue: orders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + (o.total_amount || 0), 0),
    delivered: orders.filter(o => o.status === 'Delivered').length,
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs text-[#06b6d4] font-mono tracking-[0.3em] uppercase mb-1">Transaction Ledger</p>
          <h1 className="text-3xl font-black text-white font-orbitron tracking-widest">ORDERS</h1>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-cyber pl-9 w-56 text-sm"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#06b6d4]" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <select value={filter} onChange={e => setFilter(e.target.value)} className="input-cyber w-auto text-sm">
            <option value="All">All Status</option>
            {STATUS_FLOW.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { label: 'Total Orders', value: stats.total, color: '#06b6d4' },
          { label: 'Pending', value: stats.pending, color: '#f59e0b' },
          { label: 'Delivered', value: stats.delivered, color: '#22c55e' },
          { label: 'Revenue', value: `Tk ${stats.revenue.toLocaleString()}`, color: '#8b5cf6' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="stat-card rounded-xl p-5">
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-mono mb-2">{s.label}</p>
            <p className="text-2xl font-black font-orbitron tracking-wider" style={{ color: s.color }}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Status filter pills */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['All', ...STATUS_FLOW].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase rounded-sm transition-all font-orbitron ${filter === s ? 'bg-[#06b6d4] text-[#0f172a] shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'border border-white/10 text-slate-400 hover:border-[#06b6d4]/50 hover:text-white'}`}
          >
            {s} {s !== 'All' && `(${orders.filter(o => o.status === s).length})`}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left">Order ID</th>
                <th className="text-left">Customer</th>
                <th className="text-left">Amount</th>
                <th className="text-left">Payment</th>
                <th className="text-left">Status</th>
                <th className="text-left">Date</th>
                <th className="text-left">Update Status</th>
                <th className="text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-slate-600 font-mono">No orders found</td></tr>
              ) : filtered.map(order => (
                <tr key={order.id}>
                  <td className="font-mono text-[#06b6d4] font-bold text-xs">{order.id}</td>
                  <td>
                    <div>
                      <p className="text-slate-100 font-medium text-sm">{order.customer_name}</p>
                      <p className="text-slate-500 text-xs font-mono">{order.phone}</p>
                    </div>
                  </td>
                  <td className="text-white font-bold font-mono">Tk {(order.total_amount || 0).toLocaleString()}</td>
                  <td>
                    <span className="text-xs font-mono text-slate-400">{order.payment_method || 'COD'}</span>
                  </td>
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
                    <select
                      value={order.status}
                      onChange={e => handleStatusUpdate(order.id, e.target.value)}
                      disabled={updatingId === order.id || order.status === 'Delivered' || order.status === 'Cancelled'}
                      className="text-[10px] bg-background/60 border border-white/10 text-white px-2 py-1.5 rounded-sm font-mono focus:outline-none focus:border-[#06b6d4] disabled:opacity-40 cursor-pointer"
                    >
                      {STATUS_FLOW.map(s => <option key={s} value={s} className="bg-[#0f172a]">{s}</option>)}
                    </select>
                  </td>
                  <td>
                    <button onClick={() => setSelectedOrder(order)} className="text-[10px] text-[#06b6d4] font-bold uppercase tracking-widest hover:text-white transition-colors font-orbitron">
                      VIEW →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Order Detail Drawer */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedOrder(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm"/>
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-[#0a1628] border-l border-[rgba(6,182,212,0.2)] h-full overflow-y-auto"
            >
              <div className="p-5 border-b border-[rgba(255,255,255,0.05)] flex items-center justify-between sticky top-0 bg-[#0a1628] z-10">
                <div>
                  <p className="text-[10px] text-[#06b6d4] font-mono tracking-widest uppercase">Order Details</p>
                  <h3 className="text-lg font-black text-white font-orbitron">{selectedOrder.id}</h3>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Status tracker */}
                <div>
                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-4">Order Status</p>
                  <div className="flex items-center gap-1">
                    {['Pending','Confirmed','Shipped','Delivered'].map((s, i) => {
                      const statusIdx = STATUS_FLOW.indexOf(selectedOrder.status);
                      const currentIdx = STATUS_FLOW.indexOf(s);
                      const done = statusIdx >= currentIdx && selectedOrder.status !== 'Cancelled';
                      return (
                        <React.Fragment key={s}>
                          <div className="flex flex-col items-center gap-1">
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs transition-all ${done ? 'border-[#06b6d4] bg-[#06b6d4]/20 text-[#06b6d4]' : 'border-white/20 text-slate-600'}`}>
                              {done ? '✓' : i + 1}
                            </div>
                            <span className={`text-[8px] font-mono tracking-wider ${done ? 'text-[#06b6d4]' : 'text-slate-600'}`}>{s.toUpperCase()}</span>
                          </div>
                          {i < 3 && <div className={`flex-1 h-0.5 mb-5 ${done && statusIdx > currentIdx ? 'bg-[#06b6d4]' : 'bg-white/10'}`}></div>}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>

                {/* Customer info */}
                <div className="glass-panel rounded-lg p-4 space-y-3">
                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Customer</p>
                  {[
                    { l: 'Name', v: selectedOrder.customer_name },
                    { l: 'Phone', v: selectedOrder.phone },
                    { l: 'Address', v: selectedOrder.address },
                    { l: 'Payment', v: selectedOrder.payment_method || 'COD' },
                  ].map(row => (
                    <div key={row.l} className="flex justify-between text-sm">
                      <span className="text-slate-500 font-mono text-xs">{row.l}</span>
                      <span className="text-slate-200 font-medium text-right max-w-[60%]">{row.v}</span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="glass-panel rounded-lg p-4 flex items-center justify-between">
                  <span className="text-slate-400 text-sm font-mono">Total Amount</span>
                  <span className="text-2xl font-black text-[#06b6d4] font-orbitron">Tk {(selectedOrder.total_amount || 0).toLocaleString()}</span>
                </div>

                {/* Quick Status Update */}
                <div>
                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-3">Quick Status Update</p>
                  <div className="grid grid-cols-2 gap-2">
                    {STATUS_FLOW.filter(s => s !== selectedOrder.status).map(s => (
                      <button
                        key={s}
                        onClick={() => handleStatusUpdate(selectedOrder.id, s)}
                        className={`px-3 py-2 text-[10px] font-bold tracking-widest uppercase rounded-sm border transition-all font-orbitron ${STATUS_BADGE[s] ? `${STATUS_BADGE[s].includes('delivered') ? 'border-green-500/40 text-green-400 hover:bg-green-500/10' : STATUS_BADGE[s].includes('shipped') ? 'border-purple-500/40 text-purple-400 hover:bg-purple-500/10' : STATUS_BADGE[s].includes('confirmed') ? 'border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10' : STATUS_BADGE[s].includes('cancelled') ? 'border-red-500/40 text-red-400 hover:bg-red-500/10' : 'border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10'}` : 'border-white/10 text-white'}`}
                      >
                        → {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
