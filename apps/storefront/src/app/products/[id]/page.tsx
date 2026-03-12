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
};

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<ApiProduct>(FALLBACK_PRODUCT);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    fetch(`${API_URL}/api/products/${params.id}`)
      .then(r => r.json())
      .then(data => {
        if (data && data.id) setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  const images = product.product_images?.length ? product.product_images : [FALLBACK_PRODUCT.product_images[0]];
  const displayPrice = product.discount_price || product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="w-14 h-14 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div
              className="glass-panel overflow-hidden rounded-2xl aspect-square relative cursor-zoom-in group border border-white/5"
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <motion.div
                animate={{ scale: isZoomed ? 1.5 : 1 }}
                transition={{ ease: 'easeOut', duration: 0.3 }}
                className="w-full h-full relative"
              >
                <Image
                  src={images[activeImage]}
                  alt={product.product_name}
                  fill
                  priority
                  className="object-cover"
                />
              </motion.div>
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
              </div>
              {product.discount_price && (
                <div className="absolute top-4 left-4 bg-purple-600 font-bold tracking-wider px-4 py-1 rounded shadow-[0_0_15px_theme(colors.purple.500)] text-white text-sm">
                  SALE
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => { setActiveImage(index); setIsZoomed(false); }}
                    className={`aspect-square relative overflow-hidden rounded-xl border-2 transition-all ${
                      activeImage === index
                        ? 'border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)]'
                        : 'border-transparent opacity-50 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`View ${index + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col"
          >
            <p className="text-cyan-400 text-sm font-mono tracking-widest uppercase mb-2">{product.category?.category_name}</p>
            <h1 className="text-4xl md:text-5xl font-black mb-6 text-white leading-tight">{product.product_name}</h1>

            <div className="flex items-center gap-6 mb-8">
              <span className="text-4xl font-black text-white">Tk {displayPrice.toLocaleString()}</span>
              {product.discount_price && (
                <span className="text-2xl text-gray-500 line-through">Tk {product.price.toLocaleString()}</span>
              )}
              {product.discount_price && (
                <span className="text-sm font-bold text-purple-400 bg-purple-900/30 px-3 py-1 rounded-full border border-purple-500/30">
                  SAVE Tk {(product.price - product.discount_price).toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-gray-300 text-lg mb-8 leading-relaxed border-l-2 border-cyan-900 pl-4">
              {product.description}
            </p>

            {product.tags?.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4 text-white border-b border-white/5 pb-2">Key Specifications</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {product.tags.map((tag, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                      <svg className="w-5 h-5 text-cyan-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-auto bg-[#050505]/50 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Availability</p>
                  <p className={`font-bold text-lg ${product.stock_quantity > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {product.stock_quantity > 0 ? `IN STOCK (${product.stock_quantity} left)` : 'OUT OF STOCK'}
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-[#050505] rounded-xl p-2 border border-white/10">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white bg-white/5 rounded-lg text-xl"
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-black text-xl text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white bg-white/5 rounded-lg text-xl"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right mb-4">
                <p className="text-xs text-gray-500">Order Total</p>
                <p className="text-2xl font-black text-cyan-400">Tk {(displayPrice * quantity).toLocaleString()}</p>
              </div>

              <a href="/checkout">
                <CyberButton fluid className="py-4 text-lg" disabled={product.stock_quantity === 0}>
                  {product.stock_quantity > 0 ? 'ORDER NOW' : 'OUT OF STOCK'}
                </CyberButton>
              </a>
              <p className="text-center text-xs text-gray-500 mt-3">Advance payment required via NagorikPay</p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
