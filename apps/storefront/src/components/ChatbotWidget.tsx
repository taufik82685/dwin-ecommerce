'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

const BOT_NAME = 'DWIN AI';

const BOT_RESPONSES: Record<string, string> = {
  hi: "Hi there! I'm DWIN AI 🤖. I can help you find gear, track your order, or answer questions about DWIN Store!",
  hello: "Hello! Welcome to DWIN Store 🎮. Looking for gaming gear? Just ask!",
  track: "To track your order, go to the **TRACK ORDER** page and enter your Order ID that was sent to your email or phone. 🛰️",
  order: "To place an order, browse the **GEAR SHOP**, select your product, choose your size/color, and hit 'ACQUIRE UNIT'!",
  payment: "We accept **Cash on Delivery**, **bKash**, and **Nagad**. All payments are secured by NagorikPay 🔒.",
  return: "We have a **7-day return policy** on all products. Contact our support team to initiate a return.",
  bkash: "Yes! We accept bKash payments. Select **bKash** as your payment method at checkout.",
  nagad: "Yes! We accept Nagad payments. Select **Nagad** as your payment method at checkout.",
  delivery: "We offer standard delivery across Bangladesh. Dhaka same-day delivery may be available ⚡.",
  mouse: "Check out our **Gaming Mice** collection in the Gear Shop! We have options from budget to pro.",
  keyboard: "Our keyboard collection includes TKL and full-size mechs with RGB. Visit the **Gear Shop** to explore!",
  headset: "We carry pro-grade headsets for competitive gaming. Check **Audio** category in the Gear Shop.",
  monitor: "We have 240Hz+ esports monitors! Browse the **Monitors** category in our Gear Shop.",
  support: "For support, please visit **/support** page or email us at support@dwinstore.com 📧.",
  default: "I didn't quite catch that. Try asking about: orders, tracking, payments, products, returns, or delivery! 🎮",
};

function getBotReply(input: string): string {
  const lower = input.toLowerCase();
  for (const keyword of Object.keys(BOT_RESPONSES)) {
    if (lower.includes(keyword)) return BOT_RESPONSES[keyword];
  }
  return BOT_RESPONSES.default;
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: "👋 Hey! I'm **DWIN AI**, your gaming assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', text: getBotReply(userMessage) }]);
      setTyping(false);
    }, 800);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-80 sm:w-96 h-[500px] glass-panel border border-accent/30 rounded-xl flex flex-col overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.15)]"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-background/60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-accent/20 border border-accent flex items-center justify-center text-accent font-black text-sm font-orbitron">AI</div>
                <div>
                  <p className="text-white font-bold text-sm font-orbitron tracking-wider">{BOT_NAME}</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div>
                    <p className="text-neon-green text-[10px] font-mono tracking-widest">ONLINE</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-accent/30">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-3 rounded-xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-accent text-background font-mono rounded-br-sm'
                      : 'glass-panel border border-white/10 text-slate-200 rounded-bl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="glass-panel border border-white/10 px-4 py-3 rounded-xl rounded-bl-sm flex gap-1.5 items-center">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: `${i * 0.15}s` }}></div>
                    ))}
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Quick Replies */}
            <div className="px-4 py-2 border-t border-white/5 flex gap-2 overflow-x-auto">
              {['Track Order', 'Payment', 'Returns', 'Delivery'].map(q => (
                <button key={q} onClick={() => { setInput(q); }} className="flex-shrink-0 text-[10px] text-slate-400 border border-white/10 hover:border-accent/50 hover:text-accent px-3 py-1.5 rounded-sm transition-colors font-mono tracking-wider">
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-white/10 flex gap-3 bg-background/40">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask DWIN AI..."
                className="flex-1 bg-background/50 border border-white/10 rounded-sm px-4 py-2.5 text-white text-sm focus:outline-none focus:border-accent transition-all font-mono placeholder:text-slate-600"
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2.5 bg-accent text-background rounded-sm hover:bg-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-16 h-16 rounded-full bg-accent border-2 border-accent text-background flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:shadow-[0_0_40px_rgba(6,182,212,0.8)] transition-all"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.svg key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></motion.svg>
          ) : (
            <motion.svg key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></motion.svg>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
