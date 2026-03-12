import React from 'react';
import { motion } from 'framer-motion';

export interface Product {
  id: string;
  name: string;
  price: number;
  discountPrice?: number | null;
  image: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <motion.div 
      whileHover={{ y: -5, boxShadow: '0 0 25px rgba(34,211,238,0.3)' }}
      className="group relative bg-[#121212] border border-cyan-900/40 rounded-xl overflow-hidden shadow-lg transition-all duration-300 backdrop-blur-md"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10 pointers-events-none" />
      
      {/* Discount Badge */}
      {product.discountPrice && (
        <div className="absolute top-3 left-3 z-20 bg-purple-600 font-bold text-xs tracking-wider px-3 py-1 rounded-sm text-white shadow-[0_0_10px_theme(colors.purple.500)]">
          SALE
        </div>
      )}

      {/* Clickable Image + Name area → goes to product detail */}
      <a href={`/products/${product.id}`} className="block cursor-pointer">
        {/* Image Container */}
        <div className="relative h-64 w-full overflow-hidden bg-black/50">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
          />
        </div>

        {/* Name & Category */}
        <div className="relative z-20 px-5 pt-5">
          <p className="text-cyan-400 text-xs font-mono tracking-widest uppercase mb-1">{product.category}</p>
          <h3 className="text-white font-bold text-lg mb-2 line-clamp-1 group-hover:text-cyan-200 transition-colors">
            {product.name}
          </h3>
        </div>
      </a>

      {/* Price & Cart */}
      <div className="relative z-20 px-5 pb-5">
        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col">
            {product.discountPrice ? (
              <>
                <span className="text-gray-400 text-sm line-through">Tk {product.price.toLocaleString()}</span>
                <span className="text-2xl font-black text-white">
                  Tk {product.discountPrice.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-2xl font-black text-white">
                Tk {product.price.toLocaleString()}
              </span>
            )}
          </div>
          
          <button 
            onClick={(e) => { e.preventDefault(); onAddToCart?.(product); }}
            className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500 flex items-center justify-center text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all shadow-[0_0_10px_rgba(34,211,238,0.2)] hover:shadow-[0_0_15px_rgba(34,211,238,0.6)]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
