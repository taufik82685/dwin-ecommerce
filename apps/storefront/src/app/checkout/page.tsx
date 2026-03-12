'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CyberButton } from '@repo/ui';

interface CheckoutField {
  id: string;
  label: string;
  type: string;
  required: boolean;
}

export default function CheckoutPage() {
  const [fields, setFields] = useState<CheckoutField[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // In production, fetch fields from /api/settings/checkout-fields
  useEffect(() => {
    // Simulating API fetch for dynamic fields
    setTimeout(() => {
      setFields([
        { id: 'customer_name', label: 'Full Name', type: 'text', required: true },
        { id: 'phone', label: 'Phone Number', type: 'tel', required: true },
        { id: 'email', label: 'Email Address', type: 'email', required: false },
        { id: 'address', label: 'Delivery Address', type: 'text', required: true },
        { id: 'notes', label: 'Additional Notes', type: 'textarea', required: false }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      // Step 1: Create the order
      // TODO: Get cart_items from cart state/context. Using placeholder for now.
      const cartItems = JSON.parse(localStorage.getItem('cart_items') || '[]');

      const orderRes = await fetch(`${API_URL}/api/orders/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: formData.customer_name,
          phone: formData.phone,
          email: formData.email || '',
          address: formData.address,
          cart_items: cartItems,
        }),
      });

      if (!orderRes.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await orderRes.json();
      const orderId = orderData.order?.id;

      if (!orderId) {
        throw new Error('No order ID received');
      }

      // Step 2: Create NagorikPay payment
      const paymentRes = await fetch(`${API_URL}/api/payments/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId }),
      });

      if (!paymentRes.ok) {
        throw new Error('Failed to initiate payment');
      }

      const paymentData = await paymentRes.json();

      // Step 3: Redirect to NagorikPay payment page
      if (paymentData.payment_url) {
        window.location.href = paymentData.payment_url;
      } else {
        throw new Error('No payment URL received');
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Checkout error:', error);
      setErrorMsg(error.message || 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 rounded-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full" />
        
        <h1 className="text-3xl font-black text-white mb-6 tracking-wide">
          SECURE <span className="text-cyan-400">CHECKOUT</span>
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          <div>
            <form onSubmit={handleCheckout} className="space-y-6">
              {fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <label className="block text-sm font-medium text-cyan-200">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea 
                      name={field.id}
                      required={field.required}
                      onChange={handleInputChange}
                      className="w-full bg-[#050505] border border-cyan-900/40 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-400 transition-colors h-24"
                    />
                  ) : (
                    <input 
                      type={field.type}
                      name={field.id}
                      required={field.required}
                      onChange={handleInputChange}
                      className="w-full bg-[#050505] border border-cyan-900/40 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  )}
                </div>
              ))}

              {errorMsg && (
                <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  ⚠️ {errorMsg}
                </p>
              )}

              <p className="text-xs text-purple-400 mt-2">
                * NagorikPay এর মাধ্যমে অগ্রিম পেমেন্ট করে অর্ডার কনফার্ম করুন।
              </p>
              
              <CyberButton type="submit" fluid className="mt-8" disabled={submitting}>
                {submitting ? 'PROCESSING...' : 'PROCEED TO PAYMENT'}
              </CyberButton>
            </form>
          </div>
          
          <div className="bg-[#050505]/50 border border-white/5 rounded-xl p-6 h-fit">
            <h3 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-4">Order Summary</h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-black rounded overflow-hidden relative">
                    <Image src="https://images.unsplash.com/photo-1615663245857-ac93100318b3?w=800" alt="Mouse" fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Cyberpunk Elite Mouse</p>
                    <p className="text-xs text-gray-400">Qty: 1</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-cyan-400">Tk 3,999</p>
              </div>
            </div>
            
            <div className="space-y-2 border-t border-white/10 pt-4 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>Tk 3,999</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Delivery Charge</span>
                <span>Tk 120</span>
              </div>
              <div className="flex justify-between text-white font-bold pt-2 mt-2 border-t border-white/10">
                <span>Total</span>
                <span className="text-cyan-400 text-lg">Tk 4,119</span>
              </div>
              <div className="flex justify-between text-purple-400 font-medium pt-2">
                <span>Advance Payment Required</span>
                <span>Tk 100</span>
              </div>
            </div>

            {/* NagorikPay badge */}
            <div className="mt-6 pt-4 border-t border-white/10 text-center">
              <p className="text-xs text-gray-500">Powered by</p>
              <p className="text-sm font-bold text-green-400">🔒 NagorikPay</p>
              <p className="text-xs text-gray-600 mt-1">Secure Payment Gateway</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
