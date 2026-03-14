'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

interface ApiProduct {
  id: string;
  product_name: string;
  price: number;
  discount_price: number | null;
  product_images: string[];
  category: { category_name: string };
  stock_quantity: number;
  visibility: boolean;
}

const FALLBACK: ApiProduct[] = [
  { id: '1', product_name: 'Cyberpunk Elite Mouse M1', price: 4500, discount_price: 3999, product_images: ['https://images.unsplash.com/photo-1615663245857-ac93100318b3?w=800'], category: { category_name: 'Gaming Mice' }, stock_quantity: 12, visibility: true },
  { id: '2', product_name: 'HyperDrive Mech Keyboard', price: 8500, discount_price: null, product_images: ['https://images.unsplash.com/photo-1595225476474-87563907a212?w=800'], category: { category_name: 'Keyboards' }, stock_quantity: 5, visibility: true },
  { id: '3', product_name: 'NeonPulse Pro Headset X', price: 6000, discount_price: 5499, product_images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800'], category: { category_name: 'Audio' }, stock_quantity: 45, visibility: true },
  { id: '4', product_name: 'LightXL Esports Monitor 240Hz', price: 28000, discount_price: 24999, product_images: ['https://images.unsplash.com/photo-1527443224154-c4a573d1aa65?w=800'], category: { category_name: 'Monitors' }, stock_quantity: 8, visibility: true },
  { id: '5', product_name: 'Precision Tactical Mousepad XL', price: 1500, discount_price: null, product_images: ['https://images.unsplash.com/photo-1655721530791-53ca46a70d10?w=800'], category: { category_name: 'Accessories' }, stock_quantity: 200, visibility: true },
  { id: '6', product_name: 'Stealth Compact Headset', price: 3500, discount_price: 2999, product_images: ['https://images.unsplash.com/photo-1546435770-a3e425ffe88a?w=800'], category: { category_name: 'Audio' }, stock_quantity: 20, visibility: true },
];

const categories = ['All', 'Gaming Mice', 'Keyboards', 'Audio', 'Monitors', 'Accessories'];

function ProductsContent() {
  const searchParams = useSearchParams();
  const qParam = searchParams.get('q') || '';
  
  const [products, setProducts] = useState<ApiProduct[]>(FALLBACK);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState(qParam);
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    fetch(`${API_URL}/api/products`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setProducts(data); })
      .catch(() => {});
  }, []);

  const filtered = products
    .filter(p => p.visibility)
    .filter(p => activeCategory === 'All' || p.category?.category_name === activeCategory)
    .filter(p => p.product_name.toLowerCase().includes(search.toLowerCase()) || p.category?.category_name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price_asc') return (a.discount_price || a.price) - (b.discount_price || b.price);
      if (sortBy === 'price_desc') return (b.discount_price || b.price) - (a.discount_price || a.price);
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 py-32 min-h-screen">
      {/* Header */}
      <div className="mb-12 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-4"
        >
          EXPLORE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">GEAR</span>
        </motion.h1>
        <p className="text-gray-400 text-lg">{filtered.length} elite products waiting for you</p>
      </div>

      {/* Filters Area */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel rounded-2xl p-4 mb-12 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-1/2 relative">
          <input
            type="text"
            placeholder="Search by name, SKU, or category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full pl-12 pr-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-all shadow-inner"
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-full px-6 py-3 text-gray-300 focus:outline-none focus:border-cyan-400 appearance-none cursor-pointer hover:bg-white/10 transition-colors"
          >
            <option value="default" className="bg-[#0B0B0B]">Sort: Featured</option>
            <option value="price_asc" className="bg-[#0B0B0B]">Price: Low to High</option>
            <option value="price_desc" className="bg-[#0B0B0B]">Price: High to Low</option>
          </select>
        </div>
      </motion.div>

      {/* Category Pills */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex gap-3 mb-12 flex-wrap justify-center">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2.5 rounded-full text-sm font-bold tracking-wider transition-all duration-300 ${
              activeCategory === cat
                ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(34,211,238,0.6)] scale-105'
                : 'bg-white/5 border border-white/10 text-gray-400 hover:border-cyan-500/50 hover:text-white glass-panel'
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </motion.div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32 glass-panel rounded-3xl mx-auto max-w-2xl border-dashed border-white/20 border-2">
          <p className="text-6xl mb-6">🔍</p>
          <p className="text-3xl font-black text-white tracking-tight mb-2">No matching gear found</p>
          <p className="text-gray-400">Try adjusting your search criteria or explore other categories.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 + 0.3 }}
              className="h-full"
            >
              <Link
                href={`/products/${product.id}`}
                className="group flex flex-col h-full bg-[#0A0A0A]/50 glass-panel border border-white/5 rounded-2xl overflow-hidden hover:border-cyan-500/50 hover:bg-white/5 transition-all duration-500 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] hover:-translate-y-2"
              >
                <div className="relative h-72 w-full overflow-hidden bg-[#050505]">
                  {product.discount_price && (
                    <div className="absolute top-4 left-4 z-20 bg-gradient-to-r from-purple-600 to-cyan-500 font-black text-xs tracking-widest px-4 py-1.5 rounded-full text-white shadow-[0_4px_15px_rgba(168,85,247,0.5)] border border-white/20">
                      SALE
                    </div>
                  )}
                  {product.stock_quantity === 0 && (
                    <div className="absolute top-4 right-4 z-20 bg-red-500/10 backdrop-blur-md border border-red-500/50 text-red-500 font-bold text-xs tracking-wider px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                      SOLD OUT
                    </div>
                  )}
                  {product.product_images[0] ? (
                    <Image
                      src={product.product_images[0]}
                      alt={product.product_name}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80 group-hover:opacity-100 mix-blend-lighten"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl opacity-20 group-hover:opacity-50 transition-opacity">🎮</div>
                  )}
                  
                  {/* Subtle hover glare effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/0 via-white/0 to-white/0 group-hover:via-white/5 group-hover:to-cyan-400/10 transition-all duration-700 pointer-events-none"></div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow relative z-10">
                  <p className="text-cyan-400 text-xs font-bold tracking-widest uppercase mb-2 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">{product.category?.category_name}</p>
                  <h3 className="text-white font-black text-xl mb-4 line-clamp-2 leading-tight group-hover:text-cyan-100 transition-colors flex-grow">{product.product_name}</h3>
                  <div className="flex items-end justify-between mt-auto">
                    <div className="flex flex-col">
                      {product.discount_price ? (
                        <>
                          <span className="text-gray-500 text-xs font-medium line-through mb-1">Tk {product.price.toLocaleString()}</span>
                          <span className="text-2xl font-black text-white">Tk {product.discount_price.toLocaleString()}</span>
                        </>
                      ) : (
                        <span className="text-2xl font-black text-white">Tk {product.price.toLocaleString()}</span>
                      )}
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-cyan-500 group-hover:border-cyan-400 group-hover:text-black group-hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-cyan-400 animate-pulse font-mono tracking-widest">LOADING GEAR DATABASE...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
