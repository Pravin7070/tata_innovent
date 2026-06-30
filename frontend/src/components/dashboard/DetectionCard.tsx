import React from 'react';
import { Mountain } from 'lucide-react';
import { BaseCard } from '../ui/BaseCard';
import { motion } from 'framer-motion';

export interface DetectionCardProps {
  type: string;
  confidence: number;
}

export const DetectionCard = ({ type, confidence }: DetectionCardProps) => (
  <BaseCard title="Terrain Detection" icon={Mountain}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[10px] text-automotive-gray uppercase tracking-widest mb-1">Detected Type</p>
        <p className="text-2xl font-bold text-automotive-white">{type}</p>
      </div>
      <div className="text-right">
        <p className="text-[10px] text-automotive-gray uppercase tracking-widest mb-1">Confidence</p>
        <p className="text-2xl font-bold text-automotive-green">{confidence}%</p>
      </div>
    </div>
    <div className="mt-4 h-1.5 w-full bg-automotive-black rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${confidence}%` }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
        className="h-full bg-automotive-green shadow-[0_0_10px_#39FF14]" 
      />
    </div>
  </BaseCard>
);
