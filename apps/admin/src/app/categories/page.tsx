'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface Category {
  id: string;
  name: string;
  image: string;
  productCount: number;
}

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', image: '' });

  useEffect(() => {
    // Simulated API fetch
    setTimeout(() => {
      setCategories([
        { id: 'CAT-101', name: 'Gaming Mice', image: 'https://images.unsplash.com/photo-1615663245857-ac93100318b3?w=800', productCount: 42 },
        { id: 'CAT-102', name: 'Mechanical Keyboards', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800', productCount: 28 },
        { id: 'CAT-103', name: 'Audio & Headsets', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800', productCount: 35 },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Publishing category:', formData);
    setIsModalOpen(false);
    alert('Category created successfully!');
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-white tracking-wide">COLLECTIONS <span className="text-purple-400">MANAGER</span></h1>
          <p className="text-gray-400 text-sm mt-1">Organize your gear into categories.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-500 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.3)]"
        >
          + ADD COLLECTION
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="text-purple-400 animate-pulse p-4">Loading collections...</div>
        ) : categories.map((cat, i) => (
          <motion.div 
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#121212] border border-white/10 p-6 rounded-xl hover:border-purple-500/50 transition-colors group relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity bg-cover bg-center" style={{ backgroundImage: `url(${cat.image})`}} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/80 to-transparent" />
            
            <div className="relative z-10">
              <h3 className="text-2xl font-black text-white mb-2">{cat.name}</h3>
              <p className="text-gray-400 text-sm font-bold tracking-widest">{cat.productCount} GEARS CONNECTED</p>
              
              <div className="mt-8 flex gap-3">
                <button className="text-xs font-bold uppercase tracking-wider text-purple-400 hover:text-white px-3 py-1.5 border border-purple-500/30 rounded">Edit</button>
                <button className="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-red-400 px-3 py-1.5 border border-white/10 hover:border-red-500/30 rounded">Remove</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#121212]">
                <h2 className="text-xl font-black text-white">NEW COLLECTION</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">&times;</button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Collection Name</label>
                  <input 
                    required type="text" 
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 text-white focus:border-purple-400 outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Cover Image URL</label>
                  <input 
                    required type="url" 
                    value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})}
                    className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 text-white focus:border-purple-400 outline-none" 
                  />
                  {formData.image && (
                    <div className="mt-4 rounded-lg overflow-hidden border border-white/10 h-32 w-full relative">
                      <Image src={formData.image} alt="Preview" fill className="object-cover" />
                    </div>
                  )}
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-400">Cancel</button>
                  <button type="submit" className="px-8 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all">
                    CREATE COLLECTION
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
