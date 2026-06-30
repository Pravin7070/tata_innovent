
import { Car } from 'lucide-react';
import { BaseCard } from '../ui/BaseCard';

export interface SuspensionCardProps {
  frontLeft: number;
  frontRight: number;
  rearLeft: number;
  rearRight: number;
  mode: string;
  status: string;
}

export const SuspensionCard = ({ frontLeft, frontRight, rearLeft, rearRight, mode, status }: SuspensionCardProps) => (
  <BaseCard title="Suspension Status" icon={Car}>
    <div className="grid grid-cols-2 gap-4 text-center">
      <div className="p-2 border border-automotive-gray/20 rounded bg-automotive-black/50">
        <p className="text-[10px] text-automotive-gray uppercase mb-1">FL</p>
        <p className="font-mono text-automotive-white font-bold">{frontLeft}mm</p>
      </div>
      <div className="p-2 border border-automotive-gray/20 rounded bg-automotive-black/50">
        <p className="text-[10px] text-automotive-gray uppercase mb-1">FR</p>
        <p className="font-mono text-automotive-white font-bold">{frontRight}mm</p>
      </div>
      <div className="p-2 border border-automotive-gray/20 rounded bg-automotive-black/50">
        <p className="text-[10px] text-automotive-gray uppercase mb-1">RL</p>
        <p className="font-mono text-automotive-white font-bold">{rearLeft}mm</p>
      </div>
      <div className="p-2 border border-automotive-gray/20 rounded bg-automotive-black/50">
        <p className="text-[10px] text-automotive-gray uppercase mb-1">RR</p>
        <p className="font-mono text-automotive-white font-bold">{rearRight}mm</p>
      </div>
    </div>
    <div className="mt-4 flex justify-between items-center text-xs">
      <span className="text-automotive-gray uppercase tracking-widest">Mode: <span className="text-automotive-white">{mode}</span></span>
      <span className="text-automotive-green uppercase tracking-widest">{status}</span>
    </div>
  </BaseCard>
);
