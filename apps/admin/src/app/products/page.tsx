'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  price: number;
  discount: number | null;
  category: string;
  stock: number;
  images: string[];
  description: string;
  status: 'Active' | 'Draft';
}

const EMPTY_FORM = {
  name: '',
  price: '',
  discount: '',
  category: 'Gaming Mice',
  stock: '',
  images: '',
  description: '',
  status: 'Active' as 'Active' | 'Draft',
};

export default function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerMode, setDrawerMode] = useState<'add' | 'edit' | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setProducts([
        {
          id: 'PROD-1029',
          name: 'Cyberpunk Elite Mouse M1',
          price: 4500,
          discount: 3999,
          category: 'Gaming Mice',
          stock: 12,
          images: ['https://images.unsplash.com/photo-1615663245857-ac93100318b3?w=800', 'https://images.unsplash.com/photo-1527814050087-14227918a93e?w=800'],
          description: 'The ultimate weapon for competitive gaming. Ultra-lightweight chassis, pixel-perfect optical sensor, and customizable RGB lighting.',
          status: 'Active'
        },
        {
          id: 'PROD-1030',
          name: 'HyperDrive Mech Keyboard',
          price: 8500,
          discount: null,
          category: 'Keyboards',
          stock: 0,
          images: ['https://images.unsplash.com/photo-1595225476474-87563907a212?w=800'],
          description: 'Full mechanical keyboard with PBT keycaps, hot-swap switches, and per-key RGB.',
          status: 'Draft'
        },
        {
          id: 'PROD-1031',
          name: 'NeonPulse Pro Headset',
          price: 6000,
          discount: 5499,
          category: 'Audio',
          stock: 45,
          images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800'],
          description: 'Immersive surround sound headset with noise-cancelling mic and RGB ear cups.',
          status: 'Active'
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const openAdd = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setDrawerMode('add');
  };

  const openEdit = (product: Product) => {
    setFormData({
      name: product.name,
      price: String(product.price),
      discount: product.discount ? String(product.discount) : '',
      category: product.category,
      stock: String(product.stock),
      images: product.images.join('\n'),
      description: product.description,
      status: product.status,
    });
    setEditingId(product.id);
    setDrawerMode('edit');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (drawerMode === 'edit' && editingId) {
      setProducts(products.map(p =>
        p.id === editingId ? {
          ...p,
          name: formData.name,
          price: parseFloat(formData.price),
          discount: formData.discount ? parseFloat(formData.discount) : null,
          category: formData.category,
          stock: parseInt(formData.stock),
          images: formData.images.split('\n').map(s => s.trim()).filter(Boolean),
          description: formData.description,
          status: formData.status,
        } : p
      ));
    } else {
      const newProduct: Product = {
        id: `PROD-${Date.now()}`,
        name: formData.name,
        price: parseFloat(formData.price),
        discount: formData.discount ? parseFloat(formData.discount) : null,
        category: formData.category,
        stock: parseInt(formData.stock),
        images: formData.images.split('\n').map(s => s.trim()).filter(Boolean),
        description: formData.description,
        status: formData.status,
      };
      setProducts([newProduct, ...products]);
    }
    setDrawerMode(null);
  };

  const previewImages = formData.images.split('\n').map(s => s.trim()).filter(Boolean);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-white tracking-wide">INVENTORY <span className="text-cyan-400">CONTROL</span></h1>
          <p className="text-gray-400 text-sm mt-1">{products.length} products total</p>
        </div>
        <button onClick={openAdd} className="px-6 py-2.5 bg-cyan-500 text-black font-bold rounded-lg hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(34,211,238,0.3)]">
          + ADD PRODUCT
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-[#121212] border border-white/5 p-4 rounded-xl">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Products</p>
          <p className="text-2xl font-black text-white">{products.length}</p>
        </div>
        <div className="bg-[#121212] border border-white/5 p-4 rounded-xl">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Out of Stock</p>
          <p className="text-2xl font-black text-red-500">{products.filter(p => p.stock === 0).length}</p>
        </div>
        <div className="bg-[#121212] border border-white/5 p-4 rounded-xl">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Active Listings</p>
          <p className="text-2xl font-black text-purple-400">{products.filter(p => p.status === 'Active').length}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#121212] border border-white/10 rounded-xl overflow-hidden">
        <div className="flex gap-4 p-4 border-b border-white/5 bg-[#0a0a0a]">
          <input type="text" placeholder="Search products..." className="bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 w-64" />
          <select className="bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none">
            <option>All Categories</option>
            <option>Gaming Mice</option>
            <option>Keyboards</option>
            <option>Audio</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#0a0a0a] text-xs uppercase text-gray-500 font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-cyan-500 animate-pulse">Loading...</td></tr>
              ) : products.map((product) => (
                <motion.tr key={product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-black flex-shrink-0 relative">
                        {product.images[0] && <Image src={product.images[0]} alt={product.name} fill className="object-cover" />}
                      </div>
                      <div>
                        <p className="font-medium text-white">{product.name}</p>
                        <p className="text-gray-500 text-xs font-mono">{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      {product.discount && <span className="text-xs text-gray-500 line-through">Tk {product.price.toLocaleString()}</span>}
                      <span className="text-cyan-400 font-bold">Tk {(product.discount || product.price).toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${product.stock > 10 ? 'bg-green-500/10 text-green-400' : product.stock > 0 ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'}`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 text-xs font-medium ${product.status === 'Active' ? 'text-green-400' : 'text-gray-500'}`}>
                      <div className={`w-2 h-2 rounded-full ${product.status === 'Active' ? 'bg-green-400' : 'bg-gray-500'}`} />
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openEdit(product)} className="text-gray-400 hover:text-cyan-400 transition-colors mr-3 font-medium text-xs uppercase tracking-wider px-3 py-1 border border-white/10 rounded hover:border-cyan-400/50">
                      ✏ Edit
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="text-gray-400 hover:text-red-400 transition-colors font-medium text-xs uppercase tracking-wider px-3 py-1 border border-white/10 rounded hover:border-red-500/50">
                      🗑 Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Drawer */}
      <AnimatePresence>
        {drawerMode && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawerMode(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-xl bg-[#0A0A0A] border-l border-white/10 h-full overflow-y-auto shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#121212] sticky top-0 z-10">
                <h2 className="text-xl font-black text-white">{drawerMode === 'edit' ? '✏ EDIT PRODUCT' : 'ADD NEW PRODUCT'}</h2>
                <button onClick={() => setDrawerMode(null)} className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-gray-400 hover:text-white">&times;</button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-6 flex-1">
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Product Name *</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 text-white focus:border-cyan-400 outline-none" placeholder="e.g. Cyberpunk Elite Mouse M1" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Category *</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 text-white focus:border-cyan-400 outline-none">
                      <option>Gaming Mice</option>
                      <option>Keyboards</option>
                      <option>Audio</option>
                      <option>Monitors</option>
                      <option>Accessories</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Stock Quantity *</label>
                    <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 text-white focus:border-cyan-400 outline-none" placeholder="0" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Regular Price (Tk) *</label>
                    <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 text-white focus:border-cyan-400 outline-none" placeholder="5000" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Discount Price (Tk)</label>
                    <input type="number" value={formData.discount} onChange={e => setFormData({...formData, discount: e.target.value})} className="w-full bg-[#121212] border border-cyan-900/30 rounded-lg p-3 text-cyan-400 focus:border-cyan-400 outline-none" placeholder="4500 (Optional)" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Product Images (one URL per line) *</label>
                  <textarea rows={4} value={formData.images} onChange={e => setFormData({...formData, images: e.target.value})} className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 text-white focus:border-cyan-400 outline-none font-mono text-xs" placeholder={"https://example.com/image1.jpg\nhttps://example.com/image2.jpg"} />
                  {previewImages.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {previewImages.map((img, i) => (
                        <div key={i} className="w-16 h-16 rounded-lg overflow-hidden border border-white/10 relative">
                          <Image src={img} alt={`Preview ${i}`} fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Full Description *</label>
                  <textarea required rows={5} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 text-white focus:border-cyan-400 outline-none" placeholder="Describe the product in detail — features, materials, performance specs..." />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Visibility</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as 'Active' | 'Draft'})} className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 text-white focus:border-cyan-400 outline-none">
                    <option value="Active">Active (Visible on storefront)</option>
                    <option value="Draft">Draft (Hidden from storefront)</option>
                  </select>
                </div>

                <div className="pt-6 border-t border-white/10 flex justify-end gap-4 sticky bottom-0 bg-[#0A0A0A] py-4 -mx-6 px-6">
                  <button type="button" onClick={() => setDrawerMode(null)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
                  <button type="submit" className="px-8 py-2.5 bg-cyan-500 text-black font-bold rounded-lg hover:bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all">
                    {drawerMode === 'edit' ? 'SAVE CHANGES' : 'PUBLISH PRODUCT'}
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
