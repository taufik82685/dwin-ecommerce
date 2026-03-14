'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface ApiProduct {
  id: string;
  product_name: string;
  price: number;
  discount_price: number | null;
  description: string;
  product_images: string[];
  tags: string[];
  stock_quantity: number;
  category: { category_name: string };
  sizes?: string[];
  colors?: string[];
}

const FALLBACK_PRODUCT: ApiProduct = {
  id: '1',
  product_name: 'Cyberpunk Elite Mouse M1',
  price: 4500,
  discount_price: 3999,
  description: 'The ultimate weapon for competitive gaming. Featuring an ultra-lightweight chassis, pixel-perfect optical sensor, and customizable RGB lighting that syncs with your rig. Built for 70 million click endurance.',
  product_images: [
    'https://images.unsplash.com/photo-1615663245857-ac93100318b3?w=800',
    'https://images.unsplash.com/photo-1527814050087-14227918a93e?w=800',
    'https://images.unsplash.com/photo-1628202926206-c63a34b19fb4?w=800'
  ],
  tags: ['26,000 DPI Optical Sensor', 'Optical Switches (70M Clicks)', '63g Ultra-lightweight', 'PTFE Glide Feet'],
  stock_quantity: 12,
  category: { category_name: 'Gaming Mice' },
  sizes: ['Standard', 'XL'],
  colors: ['#000000', '#06b6d4', '#8b5cf6'],
};

const STAR_REVIEWS = [
  { name: 'R4y4n_K1ller', rating: 5, text: 'Absolutely insane build quality. The neon edition is a showstopper. Zero latency on ranked.' },
  { name: 'P3rsistXpert', rating: 4, text: 'Great hardware. Side buttons feel clicky and precise. Would rate 5 if RGB was brighter by default.' },
  { name: 'UltraGamer99', rating: 5, text: 'DWIN never disappoints. Arrived faster than expected and packaging was elite tier.' },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <svg key={s} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={s <= rating ? '#06b6d4' : 'none'} stroke="#06b6d4" strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
}

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<ApiProduct>(FALLBACK_PRODUCT);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews'>('specs');

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    fetch(`${API_URL}/api/products/${params.id}`)
      .then(r => r.json())
      .then(data => {
        if (data && data.id) {
          setProduct(data);
          if (data.sizes?.length > 0) setSelectedSize(data.sizes[0]);
          if (data.colors?.length > 0) setSelectedColor(data.colors[0]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  useEffect(() => {
    if (product.sizes?.length && !selectedSize) setSelectedSize(product.sizes[0]);
    if (product.colors?.length && !selectedColor) setSelectedColor(product.colors[0]);
  }, [product]);

  const images = product.product_images?.length ? product.product_images : [FALLBACK_PRODUCT.product_images[0]];
  const displayPrice = product.discount_price || product.price;
  const savings = product.discount_price ? product.price - product.discount_price : 0;
  const discount_pct = savings > 0 ? Math.round((savings / product.price) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-32 min-h-screen">
      {loading ? (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <div className="w-16 h-16 border-4 border-accent/20 border-t-accent rounded-full animate-spin shadow-[0_0_20px_rgba(6,182,212,0.4)]"></div>
          <p className="text-accent font-mono tracking-[0.3em] text-sm animate-pulse">LOADING UNIT DATA...</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-10 tracking-widest">
            <a href="/" className="hover:text-accent transition-colors">HOME</a>
            <span>/</span>
            <a href="/products" className="hover:text-accent transition-colors">ARSENAL</a>
            <span>/</span>
            <span className="text-slate-300">{product.product_name.toUpperCase().slice(0, 30)}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* ============ IMAGE GALLERY ============ */}
            <div className="space-y-6">
              {/* Main image */}
              <div
                className="glass-panel overflow-hidden rounded-xl aspect-square relative cursor-zoom-in group border border-white/10 bg-black/60"
                onClick={() => setIsZoomed(!isZoomed)}
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 via-transparent to-neon-purple/5 mix-blend-screen pointer-events-none z-10"></div>
                {/* Cyberpunk corner decorators */}
                <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-accent m-3 z-20 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-accent m-3 z-20 opacity-50 group-hover:opacity-100 transition-opacity"></div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImage}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ scale: isZoomed ? 1.5 : 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ ease: 'easeOut', duration: 0.4 }}
                    className="w-full h-full relative"
                  >
                    <Image
                      src={images[activeImage]}
                      alt={product.product_name}
                      fill
                      priority
                      className="object-cover mix-blend-screen opacity-90"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Zoom icon */}
                <div className="absolute top-5 right-5 bg-background/60 border border-white/10 backdrop-blur-md p-2.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                </div>

                {/* Discount badge */}
                {discount_pct > 0 && (
                  <div className="absolute top-5 left-5 z-20 bg-neon-purple/20 border border-neon-purple/60 backdrop-blur-sm font-black text-sm tracking-widest px-4 py-2 text-neon-purple font-orbitron shadow-[0_0_20px_rgba(139,92,246,0.4)]">
                    -{discount_pct}% OFF
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => { setActiveImage(index); setIsZoomed(false); }}
                      className={`aspect-square relative overflow-hidden rounded-sm border-2 transition-all duration-300 ${
                        activeImage === index
                          ? 'border-accent shadow-[0_0_15px_rgba(6,182,212,0.5)] scale-105 bg-black'
                          : 'border-white/10 opacity-40 hover:opacity-80 bg-black/50'
                      }`}
                    >
                      <Image src={img} alt={`View ${index + 1}`} fill className="object-cover mix-blend-screen p-1" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ============ PRODUCT INFO ============ */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-col">
              {/* Category badge */}
              <p className="text-accent text-xs font-bold tracking-[0.3em] uppercase mb-3 font-mono">&lt; {product.category?.category_name} /&gt;</p>
              
              {/* Product name */}
              <h1 className="text-4xl md:text-5xl font-black mb-6 text-white leading-tight tracking-tight font-orbitron">{product.product_name}</h1>

              {/* Rating row */}
              <div className="flex items-center gap-4 mb-6">
                <StarRating rating={5} />
                <span className="text-slate-400 text-xs font-mono tracking-widest">({STAR_REVIEWS.length} VERIFIED REVIEWS)</span>
              </div>

              {/* Price */}
              <div className="flex items-end gap-4 mb-8 pb-8 border-b border-white/10">
                <span className="text-5xl font-black text-white font-orbitron tracking-wider">Tk {displayPrice.toLocaleString()}</span>
                {product.discount_price && (
                  <>
                    <span className="text-2xl text-slate-500 line-through font-mono mb-1">Tk {product.price.toLocaleString()}</span>
                    <span className="text-sm font-bold text-neon-green bg-neon-green/10 border border-neon-green/30 px-3 py-1.5 rounded-sm font-mono shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                      SAVE Tk {savings.toLocaleString()}
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-slate-300 text-base mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* Variants */}
              <div className="flex flex-col gap-6 mb-8">
                {/* Sizes */}
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 font-mono">Select Variant</h3>
                    <div className="flex flex-wrap gap-3">
                      {product.sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-5 py-2.5 text-sm font-bold tracking-wider transition-all duration-300 border rounded-sm font-orbitron ${
                            selectedSize === size
                              ? 'bg-accent border-accent text-background shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                              : 'bg-white/5 border-white/10 text-slate-300 hover:border-accent/50 hover:text-white'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Colors */}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 font-mono">Color / RGB Config</h3>
                    <div className="flex flex-wrap gap-4">
                      {product.colors.map(color => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`w-10 h-10 rounded-full border-2 transition-all duration-300 relative flex items-center justify-center ${
                            selectedColor === color
                              ? 'border-accent scale-110 shadow-[0_0_15px_rgba(6,182,212,0.7)]'
                              : 'border-white/20 hover:scale-105 shadow-md'
                          }`}
                          style={{ backgroundColor: color }}
                          title={color}
                        >
                          {selectedColor === color && (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Tabs: Specs / Reviews */}
              <div className="mb-8">
                <div className="flex border-b border-white/10 mb-6">
                  {(['specs', 'reviews'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-3 text-xs font-bold tracking-[0.2em] uppercase border-b-2 transition-all font-orbitron ${
                        activeTab === tab
                          ? 'border-accent text-accent'
                          : 'border-transparent text-slate-500 hover:text-white'
                      }`}
                    >
                      {tab === 'specs' ? 'Specifications' : 'Reviews'}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {activeTab === 'specs' ? (
                    <motion.div key="specs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                      {product.tags?.length > 0 ? (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {product.tags.map((tag, i) => (
                            <li key={i} className="flex items-center gap-3 glass-panel px-4 py-3 rounded-sm border border-white/5">
                              <svg className="w-4 h-4 text-accent flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              <span className="text-slate-200 text-sm font-mono">{tag}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-slate-500 font-mono text-sm">No specifications available.</p>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                      {STAR_REVIEWS.map((r, i) => (
                        <div key={i} className="glass-panel p-5 rounded-sm border border-white/5">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-bold font-mono text-sm tracking-wider">{r.name}</span>
                            <StarRating rating={r.rating} />
                          </div>
                          <p className="text-slate-400 text-sm leading-relaxed">{r.text}</p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Order Panel */}
              <div className="glass-panel border border-accent/20 rounded-xl p-8 relative overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.05)_inset]">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-neon-purple/5 pointer-events-none"></div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 relative z-10 gap-6">
                  {/* Stock */}
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-2 font-mono flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${product.stock_quantity > 0 ? 'bg-neon-green animate-pulse' : 'bg-red-500'}`}></span>
                      {product.stock_quantity > 0 ? `IN STOCK — ${product.stock_quantity} UNITS` : 'OUT OF STOCK'}
                    </p>
                    <p className="text-xl font-black text-white font-orbitron tracking-wider">Tk {displayPrice.toLocaleString()}</p>
                  </div>

                  {/* Qty */}
                  <div className="flex items-center gap-2 bg-background/50 rounded-sm p-1 border border-white/10">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded-sm text-xl transition-all">−</button>
                    <span className="w-10 text-center font-black text-xl text-white font-mono">{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded-sm text-xl transition-all">+</button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
                  {/* Total */}
                  <div className="w-full sm:w-auto text-left sm:border-r sm:border-white/10 sm:pr-6">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5 font-mono">Total</p>
                    <p className="text-3xl font-black text-accent font-orbitron shadow-[0_0_15px_rgba(6,182,212,0.3)] drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">
                      Tk {(displayPrice * quantity).toLocaleString()}
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="flex flex-1 gap-3 w-full">
                    <a
                      href={product.stock_quantity > 0 ? `/checkout?id=${product.id}&qty=${quantity}&size=${selectedSize}&color=${encodeURIComponent(selectedColor)}` : '#'}
                      className="flex-1"
                    >
                      <button
                        disabled={product.stock_quantity === 0}
                        className="w-full py-4 px-6 bg-accent text-background font-black text-sm tracking-[0.2em] uppercase rounded-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed font-orbitron"
                      >
                        {product.stock_quantity > 0 ? 'ACQUIRE UNIT' : 'DEPLETED'}
                      </button>
                    </a>
                    {/* Wishlist */}
                    <button
                      onClick={() => setWishlisted(!wishlisted)}
                      className={`w-14 h-14 flex items-center justify-center rounded-sm border transition-all ${wishlisted ? 'border-red-500 bg-red-500/10 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'border-white/10 text-slate-400 hover:border-white/30 hover:text-white'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    </button>
                  </div>
                </div>

                <p className="text-center text-xs text-slate-600 mt-5 relative z-10 tracking-widest font-mono">SECURED TRANSACTION VIA NAGORIKPAY PROTOCOL</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
