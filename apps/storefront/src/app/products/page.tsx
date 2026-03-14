'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);

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
    .filter(p => p.product_name.toLowerCase().includes(search.toLowerCase()) || p.category?.category_name?.toLowerCase().includes(search.toLowerCase()))
    .filter(p => (p.discount_price || p.price) >= priceRange[0] && (p.discount_price || p.price) <= priceRange[1])
    .sort((a, b) => {
      if (sortBy === 'price_asc') return (a.discount_price || a.price) - (b.discount_price || b.price);
      if (sortBy === 'price_desc') return (b.discount_price || b.price) - (a.discount_price || a.price);
      if (sortBy === 'newest') return parseInt(b.id) - parseInt(a.id);
      if (sortBy === 'best_sell') return b.stock_quantity - a.stock_quantity;
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 py-32 min-h-screen">
      {/* Header */}
      <div className="mb-14 text-center relative">
        <motion.span 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-xs text-accent font-mono tracking-[0.3em] uppercase font-bold mb-4 block"
        >
          — DWIN GEAR DATABASE —
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-black text-white tracking-widest mb-4 font-orbitron"
        >
          GEAR <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-neon-purple">ARSENAL</span>
        </motion.h1>
        <p className="text-slate-400 text-lg font-mono tracking-wider">
          <span className="text-accent font-bold">{filtered.length}</span> hardware units indexed
        </p>
      </div>

      {/* Main Layout: Sidebar + Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* Sidebar Filters */}
        <motion.aside 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="w-full lg:w-64 flex-shrink-0 space-y-8 glass-panel p-6 rounded-xl border border-white/10 lg:sticky lg:top-28"
        >
          {/* Search */}
          <div>
            <label className="text-[10px] text-slate-400 font-mono tracking-[0.2em] uppercase block mb-3">Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Name, SKU, category..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-background/70 border border-white/10 rounded-sm pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-accent transition-all font-mono placeholder:text-slate-600"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="text-[10px] text-slate-400 font-mono tracking-[0.2em] uppercase block mb-3">System Category</label>
            <div className="flex flex-col gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-left px-3 py-2.5 text-sm font-bold tracking-wider transition-all duration-300 rounded-sm border-l-2 font-orbitron ${
                    activeCategory === cat
                      ? 'border-l-accent text-accent bg-accent/10'
                      : 'border-l-transparent text-slate-400 hover:text-white hover:border-l-white/30'
                  }`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <label className="text-[10px] text-slate-400 font-mono tracking-[0.2em] uppercase block mb-3">Sort Protocol</label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="w-full bg-background/70 border border-white/10 rounded-sm px-3 py-3 text-sm text-white focus:outline-none focus:border-accent appearance-none cursor-pointer font-mono"
            >
              <option value="default" className="bg-[#0f172a]">Featured</option>
              <option value="best_sell" className="bg-[#0f172a]">Best Selling</option>
              <option value="newest" className="bg-[#0f172a]">Newest</option>
              <option value="price_asc" className="bg-[#0f172a]">Price: Low → High</option>
              <option value="price_desc" className="bg-[#0f172a]">Price: High → Low</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="text-[10px] text-slate-400 font-mono tracking-[0.2em] uppercase block mb-2">Max Price: Tk {priceRange[1].toLocaleString()}</label>
            <input 
              type="range" 
              min={0} max={50000} step={500}
              value={priceRange[1]}
              onChange={e => setPriceRange([0, parseInt(e.target.value)])}
              className="w-full accent-accent cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-600 font-mono mt-1">
              <span>Tk 0</span><span>Tk 50,000</span>
            </div>
          </div>

          {/* Reset */}
          <button
            onClick={() => { setActiveCategory('All'); setSearch(''); setSortBy('default'); setPriceRange([0, 50000]); }}
            className="w-full text-xs text-slate-500 hover:text-accent border border-white/5 rounded-sm py-2 transition-colors font-mono tracking-widest uppercase"
          >
            RESET FILTERS
          </button>
        </motion.aside>

        {/* Product Grid */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-center py-32 glass-panel rounded-xl mx-auto border border-dashed border-white/10"
              >
                <p className="text-5xl mb-6">🔍</p>
                <p className="text-2xl font-black text-white tracking-widest font-orbitron mb-2">NO MATCHES FOUND</p>
                <p className="text-slate-400 font-mono text-sm">Try adjusting filters or reset the search protocol.</p>
              </motion.div>
            ) : (
              <motion.div
                key="grid" 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
              >
                {filtered.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="h-full"
                  >
                    <Link
                      href={`/products/${product.id}`}
                      className="group flex flex-col h-full glass-panel glass-panel-hover rounded-xl overflow-hidden"
                    >
                      <div className="relative h-64 w-full overflow-hidden bg-black/50 border-b border-white/5">
                        {/* Badges */}
                        {product.discount_price && (
                          <div className="absolute top-3 left-3 z-20 bg-neon-purple/20 border border-neon-purple/50 backdrop-blur-md font-bold text-[10px] tracking-[0.2em] px-3 py-1 text-neon-purple uppercase font-orbitron">
                            SALE
                          </div>
                        )}
                        {product.stock_quantity === 0 && (
                          <div className="absolute top-3 right-3 z-20 bg-red-500/10 border border-red-500/40 text-red-400 font-bold text-[10px] tracking-wider px-3 py-1 uppercase font-mono">
                            DEPLETED
                          </div>
                        )}
                        {/* Image */}
                        {product.product_images[0] ? (
                          <Image
                            src={product.product_images[0]}
                            alt={product.product_name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100 mix-blend-screen"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl opacity-10">🎮</div>
                        )}
                        {/* Cyberpunk Corner Accents */}
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-accent/50 m-2 opacity-0 group-hover:opacity-100 transition-all"></div>
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-accent/50 m-2 opacity-0 group-hover:opacity-100 transition-all"></div>
                        {/* Glare overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-accent/0 via-transparent to-neon-purple/0 group-hover:from-accent/5 group-hover:to-neon-purple/10 transition-all duration-700"></div>
                      </div>
                      
                      {/* Info */}
                      <div className="p-5 flex flex-col flex-grow">
                        <p className="text-accent text-[10px] font-mono tracking-[0.2em] uppercase mb-2">{product.category?.category_name}</p>
                        <h3 className="text-white font-bold text-lg mb-4 line-clamp-2 leading-tight group-hover:text-accent transition-colors flex-grow font-orbitron tracking-wide">{product.product_name}</h3>
                        <div className="flex items-end justify-between mt-auto border-t border-white/5 pt-4">
                          <div className="flex flex-col">
                            <p className="text-[10px] text-slate-600 font-mono tracking-widest uppercase">Tk</p>
                            {product.discount_price ? (
                              <div className="flex items-end gap-2">
                                <span className="text-2xl font-black text-white font-orbitron tracking-wider">{product.discount_price.toLocaleString()}</span>
                                <span className="text-slate-500 text-xs line-through font-mono mb-1">{product.price.toLocaleString()}</span>
                              </div>
                            ) : (
                              <span className="text-2xl font-black text-white font-orbitron tracking-wider">{product.price.toLocaleString()}</span>
                            )}
                          </div>
                          <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/40 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-background group-hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 border-4 border-accent/20 border-t-accent rounded-full animate-spin shadow-[0_0_20px_rgba(6,182,212,0.4)]"></div>
        <p className="text-accent font-mono tracking-[0.3em] uppercase text-sm animate-pulse">LOADING GEAR DATABASE...</p>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
