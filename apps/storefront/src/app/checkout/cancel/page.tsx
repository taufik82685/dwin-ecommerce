'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PaymentCancelPage() {
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const orderId = params?.get('order_id');

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-panel p-8 rounded-2xl text-center relative overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-500/10 blur-3xl rounded-full" />

        <div className="relative z-10">
          {/* Cancel icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center border-2 border-red-400"
          >
            <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.div>

          <h1 className="text-3xl font-black text-white mb-2">
            পেমেন্ট <span className="text-red-400">বাতিল!</span>
          </h1>
          <p className="text-gray-400 mb-8">
            আপনার পেমেন্ট বাতিল হয়েছে। আপনি চাইলে আবার চেষ্টা করতে পারেন।
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {orderId && (
              <Link
                href="/checkout"
                className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
              >
                🔄 আবার চেষ্টা করুন
              </Link>
            )}
            <Link
              href="/"
              className="inline-block px-8 py-3 border border-white/20 text-white font-bold rounded-lg hover:bg-white/5 transition-colors"
            >
              🏠 হোমে যান
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
