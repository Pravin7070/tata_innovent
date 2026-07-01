import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface GaugeCardProps {
  title: string;
  value: number;
  max: number;
  unit: string;
  color?: string;
}

export const GaugeCard: React.FC<GaugeCardProps> = ({ title, value, max, unit, color = '#00b4d8' }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="bg-[#0a0d14]/80 backdrop-blur-md border border-white/5 rounded-lg p-3">
      <div className="flex justify-between items-end mb-2">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{title}</span>
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-['Share_Tech_Mono'] text-white font-bold">{value.toFixed(0)}</span>
          <span className="text-[9px] text-slate-500 font-mono">{unit}</span>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5 relative">
        <motion.div 
          className="absolute top-0 left-0 h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};
