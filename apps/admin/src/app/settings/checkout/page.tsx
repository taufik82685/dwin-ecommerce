'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Field {
  id: string;
  label: string;
  type: string;
  required: boolean;
}

export default function CheckoutFormBuilder() {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated API fetch
    setTimeout(() => {
      setFields([
        { id: 'customer_name', label: 'Full Name', type: 'text', required: true },
        { id: 'phone', label: 'Phone Number', type: 'tel', required: true },
        { id: 'email', label: 'Email Address', type: 'email', required: false },
        { id: 'address', label: 'Delivery Address', type: 'text', required: true },
        { id: 'notes', label: 'Additional Notes', type: 'textarea', required: false }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const addField = () => {
    const newField: Field = {
      id: `field_${Date.now()}`,
      label: 'New Field',
      type: 'text',
      required: false
    };
    setFields([...fields, newField]);
  };

  const removeField = (idToRemove: string) => {
    setFields(fields.filter(f => f.id !== idToRemove));
  };

  const updateField = (id: string, key: keyof Field, value: string | boolean) => {
    setFields(fields.map(f => f.id === id ? { ...f, [key]: value } : f));
  };

  const saveForm = () => {
    console.log('Saving dynamic checkout fields:', fields);
    // Put to /api/settings
    alert('Checkout Form Configuration Saved!');
  };

  if (loading) return <div className="p-8 text-cyan-400">Loading form builder...</div>;

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-white tracking-wide">CHECKOUT <span className="text-purple-400">BUILDER</span></h1>
          <p className="text-gray-400 text-sm mt-1">Configure the fields customers see during checkout.</p>
        </div>
        <a href="/settings" className="text-gray-400 hover:text-white underline text-sm">
          &larr; Back to Settings
        </a>
      </div>

      <div className="space-y-4 mb-8">
        <AnimatePresence>
          {fields.map((field, index) => (
            <motion.div 
              key={field.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-[#121212] border border-white/10 p-4 rounded-xl flex gap-4 items-start"
            >
              <div className="mt-2 text-gray-500 font-bold">{index + 1}.</div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400">Field Label</label>
                  <input 
                    type="text" 
                    value={field.label}
                    onChange={(e) => updateField(field.id, 'label', e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 rounded-lg p-2 text-white text-sm focus:border-cyan-400 outline-none"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs text-gray-400">Internal ID</label>
                  <input 
                    type="text" 
                    value={field.id}
                    disabled
                    className="w-full bg-[#050505] border border-white/5 rounded-lg p-2 text-gray-500 text-sm opacity-50 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-400">Input Type</label>
                  <select 
                    value={field.type}
                    onChange={(e) => updateField(field.id, 'type', e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 rounded-lg p-2 text-white text-sm focus:border-cyan-400 outline-none"
                  >
                    <option value="text">Short Text</option>
                    <option value="textarea">Long Text</option>
                    <option value="email">Email</option>
                    <option value="tel">Phone</option>
                    <option value="number">Number</option>
                  </select>
                </div>

                <div className="space-y-1 flex flex-col justify-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={field.required}
                      onChange={(e) => updateField(field.id, 'required', e.target.checked)}
                      className="accent-cyan-400 w-4 h-4 cursor-pointer"
                    />
                    <span className="text-sm text-white">Required</span>
                  </label>
                </div>
              </div>

              <button 
                onClick={() => removeField(field.id)}
                className="mt-6 text-red-500 hover:text-red-400 p-2 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors"
                title="Remove Field"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex justify-between items-center border-t border-white/10 pt-6">
        <button 
          onClick={addField}
          className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-500 text-gray-400 rounded-lg hover:bg-white/5 hover:text-white transition-colors text-sm font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Add Custom Field
        </button>

        <button 
          onClick={saveForm}
          className="px-8 py-3 bg-purple-600 text-white font-bold tracking-widest rounded-lg hover:bg-purple-500 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all"
        >
          SAVE FORM
        </button>
      </div>
    </div>
  );
}
