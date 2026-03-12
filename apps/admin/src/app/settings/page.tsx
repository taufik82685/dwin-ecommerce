'use client';

import React, { useState, useEffect } from 'react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    website_logo: '/logo.png',
    homepage_banner: '/banner.jpg',
    theme_color: '#00d2ff',
    delivery_charge: 120,
    advance_payment_amount: 100,
    payment_instructions: 'Send advance payment to bKash or NagorikPay',
    checkout_instructions: 'Please provide accurate delivery details.'
  });

  useEffect(() => {
    // Simulated API fetch
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    setSettings({ ...settings, [e.target.name]: value });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving settings:', settings);
    // Submit to /api/settings (PUT)
    alert('Settings saved successfully!');
  };

  if (loading) return <div className="p-8 text-cyan-400 animate-pulse">Loading settings...</div>;

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-white tracking-wide">WEBSITE <span className="text-cyan-400">SETTINGS</span></h1>
        <a href="/settings/checkout" className="px-4 py-2 bg-purple-600/20 text-purple-400 border border-purple-500/50 rounded-lg hover:bg-purple-600 hover:text-white transition-colors text-sm font-bold">
          Checkout Form Builder &rarr;
        </a>
      </div>
      
      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Brand Appearance */}
        <section className="bg-[#121212] border border-white/5 p-6 rounded-xl space-y-6">
          <h2 className="text-xl font-bold text-cyan-400 border-b border-white/10 pb-2">Brand Appearance</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Website Logo URL</label>
              <input 
                type="text" 
                name="website_logo"
                value={settings.website_logo}
                onChange={handleChange}
                className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-white focus:border-cyan-400 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Theme Base Color (Hex)</label>
              <div className="flex gap-4">
                <input 
                  type="color" 
                  name="theme_color"
                  value={settings.theme_color}
                  onChange={handleChange}
                  className="w-12 h-12 rounded cursor-pointer bg-transparent border-0"
                />
                <input 
                  type="text" 
                  name="theme_color"
                  value={settings.theme_color}
                  onChange={handleChange}
                  className="flex-1 bg-[#050505] border border-white/10 rounded-lg p-3 text-white focus:border-cyan-400 outline-none uppercase"
                />
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-gray-400">Homepage Hero Banner URL</label>
              <input 
                type="text" 
                name="homepage_banner"
                value={settings.homepage_banner}
                onChange={handleChange}
                className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-white focus:border-cyan-400 outline-none"
              />
            </div>
          </div>
        </section>

        {/* E-Commerce Config */}
        <section className="bg-[#121212] border border-white/5 p-6 rounded-xl space-y-6">
          <h2 className="text-xl font-bold text-purple-400 border-b border-white/10 pb-2">Financial Configuration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Standard Delivery Charge (Tk)</label>
              <input 
                type="number" 
                name="delivery_charge"
                value={settings.delivery_charge}
                onChange={handleChange}
                className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-white focus:border-purple-400 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Required Advance Payment (Tk)</label>
              <input 
                type="number" 
                name="advance_payment_amount"
                value={settings.advance_payment_amount}
                onChange={handleChange}
                className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-white focus:border-purple-400 outline-none"
              />
            </div>
          </div>
        </section>

        {/* Text Content */}
        <section className="bg-[#121212] border border-white/5 p-6 rounded-xl space-y-6">
          <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">Customer Instructions</h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Payment Instructions</label>
              <textarea 
                name="payment_instructions"
                value={settings.payment_instructions}
                onChange={handleChange}
                className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-white focus:border-cyan-400 outline-none h-24"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Checkout Notice</label>
              <textarea 
                name="checkout_instructions"
                value={settings.checkout_instructions}
                onChange={handleChange}
                className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-white focus:border-cyan-400 outline-none h-24"
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-4">
          <button 
            type="submit"
            className="px-8 py-3 bg-cyan-500 text-black font-bold tracking-widest rounded-lg hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all"
          >
            SAVE CHANGES
          </button>
        </div>
      </form>
    </div>
  );
}
