
import { Activity } from 'lucide-react';
import { BaseCard } from '../ui/BaseCard';
import { motion } from 'framer-motion';

export interface SeverityGaugeProps {
  level: string;
  score: number;
  maxScore: number;
}

export const SeverityGauge = ({ level, score, maxScore }: SeverityGaugeProps) => (
  <BaseCard title="Terrain Severity" icon={Activity}>
    <div className="flex items-end gap-4 justify-between h-full pt-2">
      <div className="flex-1">
        <p className="text-xs text-automotive-gray uppercase tracking-widest mb-2">Severity Level: {level}</p>
        <div className="flex h-4 gap-1">
          {[...Array(maxScore)].map((_, i) => (
            <div key={i} className="flex-1 rounded-sm bg-automotive-black overflow-hidden relative">
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: i < score ? 1 : 0 }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: "easeOut" }}
                className={`absolute inset-0 origin-left ${i > 7 ? 'bg-red-500 shadow-[0_0_5px_#ef4444]' : i > 4 ? 'bg-yellow-500 shadow-[0_0_5px_#eab308]' : 'bg-automotive-green shadow-[0_0_5px_#39FF14]'}`}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="text-right">
        <p className="text-3xl font-bold font-mono text-automotive-white">{score}</p>
        <p className="text-[10px] text-automotive-gray uppercase">/ {maxScore}</p>
      </div>
    </div>
  </BaseCard>
);
