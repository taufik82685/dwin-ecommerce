'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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

export default function ProductsPage() {
  const [products, setProducts] = useState<ApiProduct[]>(FALLBACK);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
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
    .filter(p => p.product_name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price_asc') return (a.discount_price || a.price) - (b.discount_price || b.price);
      if (sortBy === 'price_desc') return (b.discount_price || b.price) - (a.discount_price || a.price);
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white tracking-tight mb-2">
          ALL <span className="text-cyan-400">GEAR</span>
        </h1>
        <p className="text-gray-400">{filtered.length} products available</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <input
          type="text"
          placeholder="Search gear..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-colors"
        />
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:border-cyan-400 w-48"
        >
          <option value="default">Sort: Featured</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* Category Pills */}
      <div className="flex gap-3 mb-10 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-bold tracking-wider transition-all ${
              activeCategory === cat
                ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.4)]'
                : 'bg-[#121212] border border-white/10 text-gray-400 hover:border-cyan-500/50 hover:text-cyan-400'
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-5xl mb-4">🎮</p>
          <p className="text-xl font-bold text-white">No gear found</p>
          <p className="text-sm mt-2">Try a different search or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/products/${product.id}`}
                className="group relative block bg-[#121212] border border-cyan-900/40 rounded-xl overflow-hidden shadow-lg hover:shadow-[0_0_25px_rgba(34,211,238,0.3)] hover:-translate-y-1 transition-all duration-300"
              >
                {product.discount_price && (
                  <div className="absolute top-3 left-3 z-20 bg-purple-600 font-bold text-xs tracking-wider px-3 py-1 rounded-sm text-white shadow-[0_0_10px_theme(colors.purple.500)]">
                    SALE
                  </div>
                )}
                {product.stock_quantity === 0 && (
                  <div className="absolute top-3 right-3 z-20 bg-red-900/80 text-red-400 font-bold text-xs tracking-wider px-3 py-1 rounded-sm">
                    OUT OF STOCK
                  </div>
                )}
                <div className="relative h-64 w-full overflow-hidden bg-black/50">
                  {product.product_images[0] ? (
                    <Image
                      src={product.product_images[0]}
                      alt={product.product_name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-gray-700">🎮</div>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-cyan-400 text-xs font-mono tracking-widest uppercase mb-1">{product.category?.category_name}</p>
                  <h3 className="text-white font-bold text-lg mb-3 line-clamp-1 group-hover:text-cyan-200 transition-colors">{product.product_name}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      {product.discount_price ? (
                        <>
                          <span className="text-gray-400 text-sm line-through">Tk {product.price.toLocaleString()}</span>
                          <span className="text-2xl font-black text-white">Tk {product.discount_price.toLocaleString()}</span>
                        </>
                      ) : (
                        <span className="text-2xl font-black text-white">Tk {product.price.toLocaleString()}</span>
                      )}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
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
