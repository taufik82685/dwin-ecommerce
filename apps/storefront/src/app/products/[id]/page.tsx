'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CyberButton } from '@repo/ui';

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
  colors: ['#000000', '#ffffff', '#a855f7'],
};

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<ApiProduct>(FALLBACK_PRODUCT);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    fetch(`${API_URL}/api/products/${params.id}`)
      .then(r => r.json())
      .then(data => {
        if (data && data.id) {
          setProduct(data);
          if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0]);
          if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0]);
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-32 min-h-screen">
      {loading ? (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin shadow-[0_0_20px_theme(colors.cyan.500)]"></div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <div className="space-y-6">
            <div
              className="glass-panel overflow-hidden rounded-3xl aspect-square relative cursor-zoom-in group border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-[#050505]"
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 via-transparent to-purple-500/5 mix-blend-screen pointer-events-none z-10"></div>
              
              <motion.div
                animate={{ scale: isZoomed ? 1.5 : 1 }}
                transition={{ ease: 'easeOut', duration: 0.4 }}
                className="w-full h-full relative"
              >
                <Image
                  src={images[activeImage]}
                  alt={product.product_name}
                  fill
                  priority
                  className="object-cover mix-blend-lighten"
                />
              </motion.div>
              
              <div className="absolute top-6 right-6 bg-black/50 border border-white/10 backdrop-blur-md p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
              </div>
              
              {product.discount_price && (
                <div className="absolute top-6 left-6 z-20 bg-gradient-to-r from-purple-600 to-cyan-500 font-black text-xs tracking-widest px-4 py-2 rounded-full text-white shadow-[0_4px_20px_rgba(168,85,247,0.6)] border border-white/20">
                  SALE
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => { setActiveImage(index); setIsZoomed(false); }}
                    className={`aspect-square relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                      activeImage === index
                        ? 'border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)] scale-105 bg-[#111]'
                        : 'border-white/10 opacity-50 hover:opacity-100 bg-[#0A0A0A]'
                    }`}
                  >
                    <Image src={img} alt={`View ${index + 1}`} fill className="object-cover mix-blend-lighten p-2" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col"
          >
            <p className="text-cyan-400 text-sm font-bold tracking-widest uppercase mb-3 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">{product.category?.category_name}</p>
            <h1 className="text-4xl md:text-6xl font-black mb-6 text-white leading-tight tracking-tighter">{product.product_name}</h1>

            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/10">
              <span className="text-4xl font-black text-white">Tk {displayPrice.toLocaleString()}</span>
              {product.discount_price && (
                <span className="text-2xl text-gray-500 line-through">Tk {product.price.toLocaleString()}</span>
              )}
              {product.discount_price && (
                <span className="text-sm font-bold text-purple-400 bg-purple-900/30 px-4 py-1.5 rounded-full border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                  SAVE Tk {(product.price - product.discount_price).toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-gray-300 text-xl font-light mb-10 leading-relaxed max-w-2xl">
              {product.description}
            </p>

            {/* Variants selection */}
            <div className="flex flex-col gap-8 mb-10">
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Select Variant / Size</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-6 py-3 rounded-full text-sm font-bold tracking-wider transition-all duration-300 border ${
                          selectedSize === size
                            ? 'bg-cyan-500 border-cyan-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.5)]'
                            : 'bg-white/5 border-white/10 text-white hover:border-cyan-500/50 hover:bg-white/10'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.colors && product.colors.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Select Color</h3>
                  <div className="flex flex-wrap gap-4">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-12 h-12 rounded-full border-2 transition-all duration-300 relative ${
                          selectedColor === color
                            ? 'border-cyan-400 scale-110 shadow-[0_0_20px_rgba(34,211,238,0.5)]'
                            : 'border-transparent hover:scale-105 shadow-lg'
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      >
                        {selectedColor === color && (
                          <div className="absolute inset-0 flex items-center justify-center mix-blend-difference">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {product.tags?.length > 0 && (
              <div className="mb-10">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Key Specifications</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.tags.map((tag, i) => (
                    <li key={i} className="flex items-center gap-3 text-white glass-panel px-4 py-3 rounded-xl border border-white/5">
                      <svg className="w-5 h-5 text-cyan-400 flex-shrink-0 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-auto glass-panel border border-white/10 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/20 to-purple-900/20 pointer-events-none"></div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 relative z-10 gap-6">
                <div>
                  <p className="text-xs text-cyan-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${product.stock_quantity > 0 ? 'bg-green-400 animate-pulse' : 'bg-red-500'}`}></span>
                    Availability
                  </p>
                  <p className={`font-black text-2xl ${product.stock_quantity > 0 ? 'text-white' : 'text-red-400'}`}>
                    {product.stock_quantity > 0 ? `IN STOCK (${product.stock_quantity})` : 'SOLD OUT'}
                  </p>
                </div>
                <div className="flex items-center gap-4 bg-[#0A0A0A]/50 rounded-2xl p-2 border border-white/10 shadow-inner">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-xl text-2xl transition-all"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-black text-2xl text-white font-mono">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-xl text-2xl transition-all"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
                <div className="text-left w-full sm:w-auto">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Total</p>
                  <p className="text-3xl font-black text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">Tk {(displayPrice * quantity).toLocaleString()}</p>
                </div>

                <a href={product.stock_quantity > 0 ? `/checkout?id=${product.id}&qty=${quantity}&size=${selectedSize}&color=${encodeURIComponent(selectedColor)}` : '#'} className="w-full sm:w-auto">
                  <CyberButton variant="primary" className="py-4 px-12 text-lg w-full sm:w-auto shadow-[0_0_30px_rgba(34,211,238,0.4)]" disabled={product.stock_quantity === 0}>
                    {product.stock_quantity > 0 ? 'PURCHASE GEAR' : 'OUT OF STOCK'}
                  </CyberButton>
                </a>
              </div>
              <p className="text-center text-xs text-gray-500 mt-6 relative z-10 tracking-wider">Fast secure checkout via NagorikPay</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
