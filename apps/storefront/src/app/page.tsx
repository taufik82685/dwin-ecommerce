'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CyberButton } from '@repo/ui';

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
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#0A0A0A]">
        {/* Abstract animated background elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-glow-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-glow-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070"
            alt="Gaming hero banner"
            fill
            priority
            className="object-cover opacity-20 mix-blend-luminosity grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/40 via-[#0A0A0A]/80 to-[#0A0A0A]"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-5xl mx-auto px-4 mt-20">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="inline-block mb-4 px-4 py-1.5 rounded-full border border-white/10 glass-panel bg-white/5 backdrop-blur-md">
            <span className="text-xs font-semibold tracking-widest text-cyan-400 uppercase">A complete lifestyle brand for gamers</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-tight"
          >
            Find your next <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">favorite gear.</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto font-light"
          >
            Search by product name, category, or explore variants in one place. Curated for everyday confidence and elite performance.
          </motion.p>
          
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/products" className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              Browse Products
            </a>
            <a href="/categories" className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/20 text-white font-bold rounded-full hover:bg-white/10 backdrop-blur-md transition-colors">
              Explore Categories
            </a>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-20 w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
              <span className="text-cyan-400">FEATURED</span> GEAR
            </h2>
            <p className="text-gray-400">Our currently trending and best-selling items.</p>
          </div>
          <a href="/products">
            <CyberButton variant="secondary" className="mt-6 md:mt-0 px-6 py-2">VIEW ALL</CyberButton>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, i) => (
            <motion.a
              key={product.id}
              href={`/products/${product.id}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative bg-[#121212] border border-cyan-900/40 rounded-xl overflow-hidden shadow-lg hover:shadow-[0_0_25px_rgba(34,211,238,0.3)] transition-all duration-300"
            >
              <div className="relative h-64 w-full overflow-hidden bg-black/50">
                {product.product_images[0] && (
                  <Image
                    src={product.product_images[0]}
                    alt={product.product_name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                  />
                )}
                {product.discount_price && (
                  <div className="absolute top-3 left-3 z-20 bg-purple-600 font-bold text-xs tracking-wider px-3 py-1 rounded-sm text-white shadow-[0_0_10px_theme(colors.purple.500)]">
                    SALE
                  </div>
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
                      <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* Features Bar */}
      <section className="border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: '🚀', title: 'Fast Delivery', desc: 'Dhaka: Same day possible' },
            { icon: '🛡️', title: 'Authentic Gear', desc: '100% genuine products' },
            { icon: '↩️', title: 'Easy Returns', desc: '7-day return policy' },
            { icon: '🔒', title: 'Secure Payment', desc: 'NagorikPay protected' },
          ].map(f => (
            <div key={f.title} className="flex flex-col items-center text-center gap-2">
              <span className="text-3xl">{f.icon}</span>
              <p className="text-white font-bold text-sm">{f.title}</p>
              <p className="text-gray-500 text-xs">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
