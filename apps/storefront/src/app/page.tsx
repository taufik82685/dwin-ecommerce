'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ApiProduct {
  id: string;
  product_name: string;
  price: number;
  discount_price: number | null;
  product_images: string[];
  category: { category_name: string };
}

const FALLBACK_PRODUCTS = [
  { id: '1', product_name: 'Cyberpunk Elite Mouse M1', price: 4500, discount_price: 3999, product_images: ['https://images.unsplash.com/photo-1615663245857-ac93100318b3?w=800'], category: { category_name: 'Gaming Mice' } },
  { id: '2', product_name: 'HyperDrive Mech Keyboard TKL', price: 8500, discount_price: null, product_images: ['https://images.unsplash.com/photo-1595225476474-87563907a212?w=800'], category: { category_name: 'Keyboards' } },
  { id: '3', product_name: 'NeonPulse Pro Headset X', price: 6000, discount_price: 5499, product_images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800'], category: { category_name: 'Audio' } },
];

export default function Home() {
  const [products, setProducts] = useState<ApiProduct[]>(FALLBACK_PRODUCTS);

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    fetch(`${API_URL}/api/products`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setProducts(data.slice(0, 3)); })
      .catch(() => { /* use fallback */ });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Subtle background gradient overlay for text readability over 3D background */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-background/40 via-background/80 to-background pointer-events-none"></div>

        <div className="relative z-10 text-center max-w-5xl mx-auto px-4 mt-20">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="inline-block mb-6 px-5 py-2 rounded-full border border-accent/30 glass-panel shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            <span className="text-sm font-bold tracking-[0.2em] text-accent uppercase font-orbitron">DWIN Enterpise Ecosystem V2</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-tight font-orbitron"
          >
            THE ARSENAL OF <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-blue-500 to-neon-purple text-shadow-neon">TOMORROW</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto font-light"
          >
            Experience next-generation gaming hardware with immersive AI diagnostics.
            Curated for elite performance.
          </motion.p>
          
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a href="/products" className="w-full sm:w-auto px-10 py-4 bg-accent text-background font-bold tracking-widest uppercase font-orbitron rounded-sm hover:bg-white transition-all shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(255,255,255,0.8)]">
              INITIALIZE SHOP
            </a>
            <a href="/categories" className="w-full sm:w-auto px-10 py-4 border border-accent/50 text-accent font-bold tracking-widest uppercase font-orbitron rounded-sm hover:bg-accent/10 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.2)_inset]">
              VIEW SCHEMATICS
            </a>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-20 w-full relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/5 pb-4">
          <div>
            <h2 className="text-4xl md:text-5xl font-black tracking-widest uppercase font-orbitron flex items-center gap-4">
              <span className="w-4 h-4 rounded-full bg-neon-purple animate-pulse shadow-[0_0_15px_rgba(139,92,246,0.8)]"></span>
              Trending Assets
            </h2>
            <p className="text-slate-400 mt-2 font-mono text-sm tracking-wider">Top performing hardware configurations this cycle.</p>
          </div>
          <a href="/products">
            <button className="mt-6 md:mt-0 px-6 py-2 text-sm font-bold tracking-widest uppercase text-accent hover:text-white border border-accent/30 hover:border-accent rounded-sm transition-colors font-orbitron">
              VIEW ALL LOGS &gt;&gt;
            </button>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((product, i) => (
            <motion.a
              key={product.id}
              href={`/products/${product.id}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group glass-panel glass-panel-hover flex flex-col rounded-xl overflow-hidden"
            >
              <div className="relative h-72 w-full overflow-hidden bg-black/60 border-b border-white/10">
                {product.product_images[0] && (
                  <Image
                    src={product.product_images[0]}
                    alt={product.product_name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100 mix-blend-screen"
                  />
                )}
                
                {/* Cyberpunk Decorative Corners */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent/50 rounded-tl-lg m-2 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-accent/50 rounded-br-lg m-2 opacity-50 group-hover:opacity-100 transition-opacity"></div>

                {product.discount_price && (
                  <div className="absolute top-4 right-4 z-20 bg-neon-purple/20 border border-neon-purple/50 backdrop-blur-md font-bold text-[10px] tracking-[0.2em] px-3 py-1 text-white shadow-[0_0_15px_theme(colors.purple.500)] uppercase font-orbitron">
                    SYSTEM OVERRIDE (SALE)
                  </div>
                )}
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between relative bg-background/50">
                <div>
                  <p className="text-accent text-[10px] font-mono tracking-[0.2em] uppercase mb-2">{product.category?.category_name}</p>
                  <h3 className="text-white font-bold text-xl mb-4 line-clamp-2 group-hover:text-accent transition-colors font-orbitron tracking-wide leading-tight">{product.product_name}</h3>
                </div>
                
                <div className="flex items-end justify-between mt-4">
                  <div className="flex flex-col">
                    <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mb-1">Value Tk</p>
                    {product.discount_price ? (
                      <div className="flex items-end gap-3">
                        <span className="text-2xl font-black text-white font-orbitron tracking-wider">{product.discount_price.toLocaleString()}</span>
                        <span className="text-slate-500 text-sm line-through font-mono mb-1">{product.price.toLocaleString()}</span>
                      </div>
                    ) : (
                      <span className="text-2xl font-black text-white font-orbitron tracking-wider">{product.price.toLocaleString()}</span>
                    )}
                  </div>
                  <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-background group-hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"></path><path d="M12 5v14"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* Features Bar */}
      <section className="border-t border-accent/20 py-16 bg-gradient-to-t from-background via-background/95 to-transparent relative z-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { id: 'SYS-1', icon: '⚡', title: 'HYPER-LOGISTICS', desc: 'Secure transit channels' },
            { id: 'SYS-2', icon: '🛡️', title: 'VERIFIED HARDWARE', desc: 'Original authentic equipment' },
            { id: 'SYS-3', icon: '🔄', title: 'RMA PROTOCOL', desc: '7-cycle return window' },
            { id: 'SYS-4', icon: '🔒', title: 'ENCRYPTED TXN', desc: 'NagorikPay secure gateway' },
          ].map((f, i) => (
            <motion.div 
               key={f.id} 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               className="flex flex-col items-center text-center gap-3 p-6 glass-panel rounded-lg border-t-2 border-t-accent/30 hover:border-t-accent hover:shadow-[0_-5px_20px_rgba(6,182,212,0.15)] transition-all"
            >
              <span className="text-xs text-slate-500 font-mono tracking-widest">{f.id}</span>
              <span className="text-3xl filter drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">{f.icon}</span>
              <p className="text-white font-bold text-sm tracking-widest uppercase font-orbitron">{f.title}</p>
              <p className="text-slate-400 text-xs font-mono">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
