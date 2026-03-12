import React from 'react';
import { motion } from 'framer-motion';

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  fluid?: boolean;
}

export const CyberButton: React.FC<CyberButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fluid = false,
  ...props 
}) => {
  const baseStyles = "relative inline-flex items-center justify-center px-8 py-3 font-bold uppercase tracking-widest overflow-hidden transition-all duration-300";
  const fluidStyles = fluid ? "w-full" : "";
  
  const variants = {
    primary: "text-white bg-transparent border border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)] hover:shadow-[0_0_20px_rgba(34,211,238,0.8)] hover:bg-cyan-900/40",
    secondary: "text-white bg-transparent border border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)] hover:shadow-[0_0_20px_rgba(168,85,247,0.8)] hover:bg-purple-900/40",
    danger: "text-white bg-transparent border border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] hover:shadow-[0_0_20px_rgba(239,68,68,0.8)] hover:bg-red-900/40"
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${fluidStyles} ${props.className || ''}`}
      {...props as any}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
    </motion.button>
  );
};
