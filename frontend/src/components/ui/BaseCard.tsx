import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export interface BaseCardProps {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
  statusActive?: boolean;
}

export const BaseCard = ({ title, icon: Icon, children, className = '', statusActive = true }: BaseCardProps) => (
  <motion.div 
    whileHover={{ y: -4, boxShadow: "0 8px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 180, 216, 0.1)" }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className={`bg-automotive-dark/40 border border-automotive-gray/20 rounded-xl p-4 sm:p-5 backdrop-blur-sm flex flex-col relative overflow-hidden ${className}`}
  >
    <div className="flex items-center justify-between mb-4 pb-3 border-b border-automotive-gray/10 relative z-10">
      <div className="flex items-center gap-2 text-automotive-gray">
        {Icon && <Icon className="w-4 h-4 text-automotive-blue drop-shadow-[0_0_5px_rgba(0,180,216,0.5)]" />}
        <h3 className="font-bold text-xs tracking-[0.15em] uppercase text-automotive-white/80">{title}</h3>
      </div>
      {statusActive && (
        <motion.div 
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-1.5 h-1.5 rounded-full bg-automotive-green shadow-[0_0_8px_#39FF14]"
        />
      )}
    </div>
    <div className="flex-1 flex flex-col relative z-10">
      {children}
    </div>
  </motion.div>
);
