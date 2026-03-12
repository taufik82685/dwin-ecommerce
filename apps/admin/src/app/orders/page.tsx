'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Order {
  id: string;
  customerName: string;
  total: number;
  status: 'PENDING' | 'ADVANCE_PAID' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  date: string;
  items: number;
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Simulated API fetch
    setTimeout(() => {
      setOrders([
        { id: 'ORD-8924', customerName: 'Aswin Kumar', total: 4500, status: 'ADVANCE_PAID', date: '2023-[12]-15T10:30:00Z', items: 1 },
        { id: 'ORD-8925', customerName: 'Sarah Jenkins', total: 16500, status: 'SHIPPED', date: '2023-12-14T14:20:00Z', items: 2 },
        { id: 'ORD-8926', customerName: 'Mikhael Y.', total: 3200, status: 'PENDING', date: '2023-12-14T09:15:00Z', items: 1 },
        { id: 'ORD-8927', customerName: 'Alex Chen', total: 42000, status: 'DELIVERED', date: '2023-12-12T16:45:00Z', items: 3 },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PENDING': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'ADVANCE_PAID': return 'bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.2)]';
      case 'CONFIRMED': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'SHIPPED': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'DELIVERED': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'CANCELLED': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const updateOrderStatus = (id: string, newStatus: Order['status']) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    // API Call to /api/orders/:id/status
  };

  return (
    <div className="p-8 flex h-full gap-6">
      {/* Left Column: Orders List */}
      <div className={`flex flex-col transition-all duration-300 ${selectedOrder ? 'w-1/2' : 'w-full'}`}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-black text-white tracking-wide">ORDER <span className="text-purple-400">TRACKING</span></h1>
            <p className="text-gray-400 text-sm mt-1">Manage processing and fulfillment.</p>
          </div>
        </div>

        <div className="bg-[#121212] border border-white/10 rounded-xl overflow-hidden flex-1 flex flex-col">
          <div className="p-4 border-b border-white/5 bg-[#0a0a0a] flex justify-between gap-4">
            <input 
              type="text" 
              placeholder="Search by Order ID or Name..." 
              className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
            />
            <select className="bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-purple-500 w-40">
              <option>All Statuses</option>
              <option>Advance Paid</option>
              <option>Pending</option>
              <option>Shipped</option>
            </select>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-purple-400 animate-pulse">Loading orders...</div>
            ) : (
              <div className="divide-y divide-white/5">
                {orders.map((order) => (
                  <div 
                    key={order.id} 
                    onClick={() => setSelectedOrder(order)}
                    className={`p-4 cursor-pointer hover:bg-white/5 transition-colors ${selectedOrder?.id === order.id ? 'bg-purple-900/10 border-l-2 border-purple-500' : 'border-l-2 border-transparent'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-white font-bold">{order.id}</p>
                        <p className="text-gray-400 text-sm">{order.customerName}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded border text-[10px] font-bold tracking-wider ${getStatusColor(order.status)}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between items-end text-sm">
                      <p className="text-gray-500 text-xs">{new Date(order.date).toLocaleDateString()}</p>
                      <p className="text-cyan-400 font-bold">Tk {order.total.toLocaleString()} <span className="text-gray-500 font-normal text-xs ml-1">({order.items} items)</span></p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Order Details */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div 
            initial={{ opacity: 0, x: 20, width: 0 }}
            animate={{ opacity: 1, x: 0, width: '50%' }}
            exit={{ opacity: 0, x: 20, width: 0 }}
            className="flex flex-col border-l border-white/10 bg-[#0A0A0A] rounded-xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-[#121212] flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-black text-white">{selectedOrder.id}</h2>
                <p className="text-gray-400 text-sm mt-1">{new Date(selectedOrder.date).toLocaleString()}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
              >
                &times;
              </button>
            </div>

            {/* Actions / Status Update */}
            <div className="p-6 border-b border-white/10 bg-purple-900/5">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Update Order Status</label>
              <div className="flex gap-2">
                <select 
                  value={selectedOrder.status}
                  onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value as Order['status'])}
                  className="flex-1 bg-[#1a1a1a] border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 font-bold tracking-wider"
                >
                  <option value="PENDING">PENDING (Unpaid)</option>
                  <option value="ADVANCE_PAID">ADVANCE PAID (Action Required)</option>
                  <option value="CONFIRMED">CONFIRMED (Processing)</option>
                  <option value="SHIPPED">SHIPPED (In Transit)</option>
                  <option value="DELIVERED">DELIVERED (Completed)</option>
                  <option value="CANCELLED">CANCELLED (Refunded/Failed)</option>
                </select>
                <button className="px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-500 transition-colors whitespace-nowrap">
                  Update
                </button>
              </div>
            </div>

            {/* Scrollable details */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Customer Info */}
              <section>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Customer Details</h3>
                <div className="bg-[#121212] border border-white/5 rounded-lg p-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="text-white">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-white">+880 1711-223344</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500">Delivery Address</p>
                    <p className="text-white">House 42, Road 15, Block D, Banani, Dhaka</p>
                  </div>
                </div>
              </section>

              {/* Items list */}
              <section>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Order Items [{selectedOrder.items}]</h3>
                <div className="bg-[#121212] border border-white/5 rounded-lg overflow-hidden divide-y divide-white/5">
                  <div className="flex justify-between items-center p-4">
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 bg-black rounded" />
                      <div>
                        <p className="text-white text-sm font-bold">Cyberpunk Elite Mouse M1</p>
                        <p className="text-gra-400 text-xs">Qty: 1</p>
                      </div>
                    </div>
                    <p className="text-cyan-400 font-bold">Tk 4,500</p>
                  </div>
                </div>
              </section>

              {/* Financial Summary */}
              <section>
                <div className="bg-[#121212] border border-cyan-900/30 rounded-lg p-5 space-y-3">
                  <div className="flex justify-between text-gray-400 text-sm">
                    <span>Subtotal</span>
                    <span>Tk 4,500</span>
                  </div>
                  <div className="flex justify-between text-gray-400 text-sm">
                    <span>Delivery Charge</span>
                    <span>Tk 120</span>
                  </div>
                  <div className="flex justify-between text-gray-400 text-sm border-b border-white/10 pb-3">
                    <span>Advance Payment (NagorikPay)</span>
                    <span className="text-green-400">- Tk 100</span>
                  </div>
                  <div className="flex justify-between text-white font-black text-lg pt-1">
                    <span>Cash on Delivery Required</span>
                    <span className="text-cyan-400">Tk 4,520</span>
                  </div>
                </div>
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
