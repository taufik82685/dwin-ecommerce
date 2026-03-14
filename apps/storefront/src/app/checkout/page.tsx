'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { motion } from 'framer-motion';

const PAYMENT_METHODS = [
  { id: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when you receive the item.', color: 'border-neon-green/50 text-neon-green' },
  { id: 'bkash', label: 'bKash', icon: '🟥', desc: 'Pay via bKash mobile banking.', color: 'border-pink-500/50 text-pink-400' },
  { id: 'nagad', label: 'Nagad', icon: '🟧', desc: 'Pay via Nagad mobile banking.', color: 'border-orange-500/50 text-orange-400' },
];

const FIELD_CLASS = "w-full bg-background/80 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:outline-none focus:border-accent transition-all font-mono placeholder:text-slate-600";
const LABEL_CLASS = "block text-[10px] text-slate-400 uppercase tracking-[0.2em] mb-2 font-mono font-bold";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('id') || '';
  const qty = parseInt(searchParams.get('qty') || '1');
  const size = searchParams.get('size') || '';
  const color = searchParams.get('color') || '';

  const [formData, setFormData] = useState({ customer_name: '', phone: '', email: '', address: '', city: '', notes: '' });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [productName, setProductName] = useState('Your Selected Product');
  const [productPrice, setProductPrice] = useState(0);
  const [productImage, setProductImage] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (productId) {
      fetch(`${API_URL}/api/products/${productId}`)
        .then(r => r.json())
        .then(d => {
          if (d && d.product_name) {
            setProductName(d.product_name);
            setProductPrice((d.discount_price || d.price) * qty);
            setProductImage(d.product_images?.[0] || '');
          }
        }).catch(() => {});
    }
  }, [productId, qty, API_URL]);

  const deliveryCharge = 120;
  const total = productPrice + deliveryCharge;

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    try {
      const cartItems = productId
        ? [{ product_id: productId, quantity: qty, size, color }]
        : JSON.parse(localStorage.getItem('cart_items') || '[]');

      const orderRes = await fetch(`${API_URL}/api/orders/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          cart_items: cartItems,
          payment_method: paymentMethod,
        }),
      });
      if (!orderRes.ok) throw new Error('Order creation failed');
      const orderData = await orderRes.json();
      const orderId = orderData.order?.id;

      if (paymentMethod !== 'cod') {
        const paymentRes = await fetch(`${API_URL}/api/payments/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order_id: orderId }),
        });
        const paymentData = await paymentRes.json();
        if (paymentData.payment_url) {
          window.location.href = paymentData.payment_url;
          return;
        }
      }
      window.location.href = `/checkout/success?orderId=${orderId}`;
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-32 min-h-screen">
      <div className="mb-12 text-center">
        <span className="text-xs text-accent font-mono tracking-[0.3em] uppercase block mb-3">— SECURE TRANSACTION —</span>
        <h1 className="text-5xl font-black text-white tracking-widest font-orbitron">
          CHECKOUT<span className="text-accent">.</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Form Col */}
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Shipping Info */}
            <div className="glass-panel rounded-xl p-8 border border-white/10 space-y-6">
              <h2 className="text-sm font-bold text-white tracking-[0.2em] uppercase font-orbitron border-b border-white/10 pb-4">
                Delivery Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={LABEL_CLASS}>Full Name <span className="text-red-500">*</span></label>
                  <input type="text" name="customer_name" required onChange={handleInput} className={FIELD_CLASS} placeholder="Your full name" />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Phone Number <span className="text-red-500">*</span></label>
                  <input type="tel" name="phone" required onChange={handleInput} className={FIELD_CLASS} placeholder="01X-XXXX-XXXX" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={LABEL_CLASS}>City <span className="text-red-500">*</span></label>
                  <input type="text" name="city" required onChange={handleInput} className={FIELD_CLASS} placeholder="Dhaka" />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Email Address</label>
                  <input type="email" name="email" onChange={handleInput} className={FIELD_CLASS} placeholder="optional" />
                </div>
              </div>
              <div>
                <label className={LABEL_CLASS}>Delivery Address <span className="text-red-500">*</span></label>
                <input type="text" name="address" required onChange={handleInput} className={FIELD_CLASS} placeholder="House, Road, Area..." />
              </div>
              <div>
                <label className={LABEL_CLASS}>Order Notes</label>
                <textarea name="notes" onChange={handleInput} rows={3} className={FIELD_CLASS} placeholder="Special instructions, gift message, etc." />
              </div>
            </div>

            {/* Payment Method */}
            <div className="glass-panel rounded-xl p-8 border border-white/10">
              <h2 className="text-sm font-bold text-white tracking-[0.2em] uppercase font-orbitron border-b border-white/10 pb-4 mb-6">
                Payment Channel
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {PAYMENT_METHODS.map(method => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex flex-col items-center gap-3 p-6 rounded-sm border-2 transition-all ${
                      paymentMethod === method.id
                        ? `${method.color} bg-white/5 shadow-[0_0_20px_rgba(6,182,212,0.15)]`
                        : 'border-white/10 text-slate-400 hover:border-white/30'
                    }`}
                  >
                    <span className="text-3xl">{method.icon}</span>
                    <div className="text-center">
                      <p className="font-bold text-sm font-orbitron tracking-wider">{method.label}</p>
                      <p className="text-xs text-slate-500 font-mono mt-1">{method.desc}</p>
                    </div>
                    {paymentMethod === method.id && (
                      <div className="w-5 h-5 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-accent"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {errorMsg && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-sm text-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span className="text-sm font-mono">{errorMsg}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-5 bg-accent text-background font-black text-sm tracking-[0.3em] uppercase rounded-sm shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.7)] hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed font-orbitron"
            >
              {submitting ? 'PROCESSING ORDER...' : `CONFIRM ORDER — Tk ${total.toLocaleString()}`}
            </button>
          </form>
        </motion.div>

        {/* Order Summary */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <div className="glass-panel rounded-xl p-6 border border-accent/20 sticky top-28">
            <h3 className="text-sm font-bold text-white tracking-[0.2em] uppercase font-orbitron border-b border-white/10 pb-4 mb-6">
              Order Summary
            </h3>

            {/* Product preview */}
            {productId && (
              <div className="flex gap-4 p-4 bg-background/50 rounded-sm border border-white/5 mb-6">
                {productImage && (
                  <div className="w-14 h-14 rounded-sm bg-black/50 overflow-hidden flex-shrink-0 border border-white/5 relative">
                    <Image src={productImage} alt={productName} fill className="object-cover mix-blend-screen opacity-80" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-bold font-orbitron line-clamp-2 leading-tight">{productName}</p>
                  <p className="text-slate-500 text-xs font-mono mt-1">Qty: {qty} {size && `• ${size}`}</p>
                  {color && <div className="w-4 h-4 rounded-full mt-1 border border-white/20 inline-block" style={{ backgroundColor: color }}></div>}
                </div>
              </div>
            )}

            <div className="space-y-3 font-mono text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>Tk {productPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Delivery</span>
                <span>Tk {deliveryCharge}</span>
              </div>
              <div className="flex justify-between font-black text-white border-t border-white/10 pt-3 mt-3">
                <span className="font-orbitron tracking-wider">TOTAL</span>
                <span className="text-accent text-lg">{total.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
              {['Secure Encryption', 'Authentic Products', '7-Day Returns'].map(feat => (
                <div key={feat} className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <svg className="w-3 h-3 text-neon-green" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  {feat}
                </div>
              ))}
            </div>

            <p className="text-center text-[10px] text-slate-600 font-mono mt-6 tracking-widest">Powered by 🔒 NAGORIKPAY</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-16 h-16 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
