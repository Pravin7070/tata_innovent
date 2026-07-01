import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface TelemetryCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  status?: 'normal' | 'warning' | 'critical';
  className?: string;
}

export const TelemetryCard: React.FC<TelemetryCardProps> = ({ title, value, unit, icon, status = 'normal', className }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-[#0a0d14]/80 backdrop-blur-md border border-white/5 rounded-lg p-3 flex flex-col justify-between overflow-hidden relative",
        className
      )}
    >
      <div className="flex items-center justify-between text-slate-400 mb-2">
        <span className="text-[10px] uppercase tracking-wider font-semibold">{title}</span>
        {icon && <span className="text-[#00b4d8]">{icon}</span>}
      </div>
      
      <div className="flex items-baseline gap-1">
        <span className={cn(
          "text-xl font-['Share_Tech_Mono'] font-bold tracking-tight",
          status === 'normal' && "text-white",
          status === 'warning' && "text-amber-400",
          status === 'critical' && "text-rose-500",
        )}>
          {value}
        </span>
        {unit && <span className="text-[10px] text-slate-500 font-mono uppercase">{unit}</span>}
      </div>

      {/* Decorative accent line */}
      <div className={cn(
        "absolute bottom-0 left-0 h-[2px] bg-gradient-to-r",
        status === 'normal' && "from-[#00b4d8] to-transparent w-1/3",
        status === 'warning' && "from-amber-400 to-transparent w-1/2",
        status === 'critical' && "from-rose-500 to-transparent w-full"
      )} />
    </motion.div>
  );
};
