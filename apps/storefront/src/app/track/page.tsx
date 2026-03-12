'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CyberButton } from '@repo/ui';

interface TrackedOrderItem {
  name: string;
  qty: number;
  price: number;
}

interface TrackedOrder {
  id: string;
  status: string;
  date: string;
  total: number;
  items: TrackedOrderItem[];
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState('');

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setError('');
    
    // Simulate API fetch
    setTimeout(() => {
      setLoading(false);
      if (orderId.includes('8924')) {
        setTrackedOrder({
          id: orderId.toUpperCase(),
          status: 'ADVANCE_PAID',
          date: '2023-12-15T10:30:00Z',
          total: 4500,
          items: [{ name: 'Cyberpunk Elite Mouse M1', qty: 1, price: 4500 }]
        });
      } else if (orderId.includes('8925')) {
        setTrackedOrder({
          id: orderId.toUpperCase(),
          status: 'SHIPPED',
          date: '2023-12-14T14:20:00Z',
          total: 16500,
          items: [
            { name: 'HyperDrive Mech Keyboard TKL', qty: 1, price: 8500 },
            { name: 'NeonPulse Pro Headset X', qty: 1, price: 8000 }
          ]
        });
      } else {
        setError("Order not found or tracking ID is invalid. Please check the ID sent to your email.");
        setTrackedOrder(null);
      }
    }, 800);
  };

  const steps = [
    { id: 'PENDING', label: 'Order Placed', color: 'text-gray-400' },
    { id: 'ADVANCE_PAID', label: 'Processing', color: 'text-purple-400' },
    { id: 'CONFIRMED', label: 'Confirmed', color: 'text-cyan-400' },
    { id: 'SHIPPED', label: 'Shipped', color: 'text-blue-400' },
    { id: 'DELIVERED', label: 'Delivered', color: 'text-green-400' }
  ];

  const getStepIndex = (status: string) => {
    return steps.findIndex(s => s.id === status);
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-white tracking-widest mb-4"
          >
            SATELLITE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">TRACKING</span>
          </motion.h1>
          <p className="text-gray-400 max-w-lg mx-auto">
            Input your Order ID provided via email/SMS to intercept the live status of your equipment drop.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8 rounded-2xl relative overflow-hidden mb-8 shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-3xl rounded-full" />
          
          <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4 relative z-10">
            <input 
              type="text" 
              placeholder="e.g. ORD-8924" 
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="flex-1 bg-[#050505] border border-cyan-900/40 rounded-lg p-4 text-white uppercase focus:outline-none focus:border-cyan-400 font-mono tracking-widest text-lg"
              required
            />
            <CyberButton type="submit" className="py-4 md:w-48 text-lg" disabled={loading}>
              {loading ? 'SCANNING...' : 'LOCATE SECURELY'}
            </CyberButton>
          </form>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-red-500 font-medium flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              {error}
            </motion.p>
          )}
        </motion.div>

        <AnimatePresence>
          {trackedOrder && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6"
            >
              {/* Status Timeline */}
              <div className="glass-panel p-8 rounded-2xl border border-cyan-900/40">
                <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
                  <div>
                    <p className="text-gray-400 text-sm tracking-widest uppercase mb-1">Order Identifier</p>
                    <h2 className="text-2xl font-black text-white font-mono">{trackedOrder.id}</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm tracking-widest uppercase mb-1">Total Payload</p>
                    <p className="text-xl font-bold text-cyan-400">Tk {trackedOrder.total.toLocaleString()}</p>
                  </div>
                </div>

                <div className="relative pt-4 pb-8">
                  {/* Timeline Line */}
                  <div className="absolute top-8 left-0 w-full h-1 bg-[#222] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(getStepIndex(trackedOrder.status) / (steps.length - 1)) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                    />
                  </div>

                  <div className="flex justify-between relative z-10">
                    {steps.map((step, i) => {
                      const currentIndex = getStepIndex(trackedOrder.status);
                      const isCompleted = i <= currentIndex;
                      const isActive = i === currentIndex;
                      
                      return (
                        <div key={step.id} className="flex flex-col items-center">
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.15 }}
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-3 transition-colors duration-500 delay-100 ${
                              isActive ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] border-4 border-[#0B0B0B]' :
                              isCompleted ? 'bg-cyan-500 text-black border-4 border-[#0B0B0B]' : 
                              'bg-[#222] text-gray-500 border-4 border-[#0B0B0B]'
                            }`}
                          >
                            {isCompleted ? (
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            ) : ''}
                          </motion.div>
                          <p className={`text-xs md:text-sm font-bold tracking-wider uppercase text-center w-20 leading-tight ${isCompleted ? step.color : 'text-gray-600'}`}>
                            {step.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Items Detail */}
              <div className="glass-panel p-8 rounded-2xl border border-white/5">
                <h3 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-2">Manifest Log</h3>
                <div className="space-y-4">
                  {trackedOrder.items.map((item: TrackedOrderItem, i: number) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-[#050505] rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-black rounded" />
                        <div>
                          <p className="text-white font-medium">{item.name}</p>
                          <p className="text-gray-500 text-xs tracking-wider">QTY: {item.qty}</p>
                        </div>
                      </div>
                      <p className="text-cyan-400 font-bold">Tk {item.price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
