'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Sales', value: 'Tk 2,45,000', change: '+12%', isPositive: true },
    { label: 'Total Orders', value: '342', change: '+5%', isPositive: true },
    { label: 'Pending Orders', value: '18', change: '-2%', isPositive: false },
    { label: 'Revenue (Today)', value: 'Tk 12,500', change: '+8%', isPositive: true }
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-black text-cyan-400 mb-8 tracking-wide">DASHBOARD OVERVIEW</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#121212] border border-cyan-900/40 p-6 rounded-xl shadow-lg relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-transparent blur-xl rounded-full translate-x-1/2 -translate-y-1/2" />
            <p className="text-gray-400 text-sm font-medium mb-1">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
              <span className={`text-sm font-bold ${stat.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#121212] border border-cyan-900/40 rounded-xl p-6 h-96 flex items-center justify-center">
          {/* Chart placeholder */}
          <p className="text-gray-500 font-mono text-sm [text-shadow:0_0_10px_rgba(34,211,238,0.2)]">
            [ SALES REVENUE CHART AREA ]
          </p>
        </div>
        
        <div className="bg-[#121212] border border-purple-900/40 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 border-b border-purple-500/30 pb-2">Recent Orders</h3>
          <div className="space-y-4 pt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0 hover:bg-white/5 px-2 rounded-md transition-colors">
                <div>
                  <p className="text-white font-medium text-sm">Order #{1040 + i}</p>
                  <p className="text-gray-400 text-xs">Aswin Kumar</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 text-[10px] font-bold bg-purple-500/20 text-purple-400 rounded-sm">ADVANCE PAID</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
