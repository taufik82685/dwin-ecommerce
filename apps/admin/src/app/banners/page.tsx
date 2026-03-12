'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  image: string;
  isActive: boolean;
}

export default function BannersManagement() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', subtitle: '', type: 'HERO', image: '', link: '' });

  useEffect(() => {
    setTimeout(() => {
      setBanners([
        { id: 'BAN-1', title: 'GEAR UP FOR VICTORY', subtitle: 'Premium esports gaming equipment', type: 'HERO', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070', isActive: true },
        { id: 'BAN-2', title: 'NEW ARRIVALS: AUDIO', subtitle: 'Experience spatial sound', type: 'PROMO', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800', isActive: true },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Publishing banner:', formData);
    setIsModalOpen(false);
    alert('Banner published successfully! (Demo)');
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-white tracking-wide">PROMO <span className="text-yellow-400">BANNERS</span></h1>
          <p className="text-gray-400 text-sm mt-1">Manage homepage heroes, offers, and discounts.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 transition-colors shadow-[0_0_15px_rgba(250,204,21,0.3)]"
        >
          + ADD PROMO
        </button>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="text-yellow-400 animate-pulse">Loading banners...</div>
        ) : banners.map((banner, i) => (
          <motion.div 
            key={banner.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-[#121212] border border-white/10 rounded-xl overflow-hidden flex flex-col md:flex-row h-auto md:h-48 group relative"
          >
            <div className="w-full md:w-1/3 relative border-r border-white/10 h-48">
              <Image src={banner.image} alt={banner.title} fill className="object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur text-xs font-bold px-3 py-1 rounded text-yellow-400 border border-yellow-400/30">
                {banner.type}
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-center">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-black text-white">{banner.title}</h3>
                  <p className="text-gray-400 mt-1">{banner.subtitle}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={banner.isActive} readOnly />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                </label>
              </div>
              <div className="mt-6 flex gap-3">
                <button className="text-xs font-bold uppercase tracking-wider text-yellow-400 hover:text-white px-3 py-1.5 border border-yellow-400/30 rounded">Edit</button>
                <button className="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-red-400 px-3 py-1.5 border border-white/10 rounded">Delete</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#121212]">
                <h2 className="text-xl font-black text-white">GENERATE PROMO BANNER</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">&times;</button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Headline</label>
                    <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 text-white focus:border-yellow-400 outline-none" />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Subtitle / Tagline</label>
                    <input type="text" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 text-white focus:border-yellow-400 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Type</label>
                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 text-white focus:border-yellow-400 outline-none">
                      <option>HERO</option><option>PROMO</option><option>DISCOUNT</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Target Link (Optional)</label>
                    <input type="text" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 text-white focus:border-yellow-400 outline-none" placeholder="/products/audio" />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Image Assets URL</label>
                    <input required type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 text-white focus:border-yellow-400 outline-none" />
                  </div>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-400">Cancel</button>
                  <button type="submit" className="px-8 py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.4)] transition-all">PUBLISH</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
