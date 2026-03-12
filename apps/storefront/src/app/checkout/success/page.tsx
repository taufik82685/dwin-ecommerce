'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('order_id');

    if (!orderId) {
      setError('No order ID found');
      setLoading(false);
      return;
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    fetch(`${API_URL}/api/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        setOrderData(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load order details');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-16 h-16 border-4 border-green-500/20 border-t-green-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg">{error}</p>
          <Link href="/" className="text-cyan-400 underline mt-4 inline-block">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-panel p-8 rounded-2xl text-center relative overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-green-500/10 blur-3xl rounded-full" />

        <div className="relative z-10">
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-400"
          >
            <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>

          <h1 className="text-3xl font-black text-white mb-2">
            পেমেন্ট <span className="text-green-400">সফল!</span>
          </h1>
          <p className="text-gray-400 mb-8">আপনার অর্ডার সফলভাবে গৃহীত হয়েছে।</p>

          {orderData && (
            <div className="bg-[#050505]/50 border border-white/5 rounded-xl p-6 text-left mb-8">
              <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-3">
                অর্ডার ডিটেইলস
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">অর্ডার ID</span>
                  <span className="text-white font-mono text-xs">{orderData.id?.slice(0, 12)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">নাম</span>
                  <span className="text-white">{orderData.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">ফোন</span>
                  <span className="text-white">{orderData.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">মোট</span>
                  <span className="text-cyan-400 font-bold">৳{orderData.total_amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">অগ্রিম প্রদান</span>
                  <span className="text-green-400 font-bold">৳{orderData.advance_payment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">বাকি</span>
                  <span className="text-purple-400 font-bold">
                    ৳{orderData.total_amount - orderData.advance_payment}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">স্ট্যাটাস</span>
                  <span className="text-green-400 font-medium">
                    {orderData.payment_status === 'ADVANCE_PAID' ? '✅ অগ্রিম পেমেন্ট সম্পন্ন' : orderData.payment_status}
                  </span>
                </div>
              </div>
            </div>
          )}

          <p className="text-sm text-gray-500 mb-6">
            বাকি টাকা ডেলিভারির সময় ক্যাশ অন ডেলিভারিতে পরিশোধ করতে হবে।
          </p>

          <Link
            href="/"
            className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            🏠 হোমে যান
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
