
import { Settings2, CheckCircle2 } from 'lucide-react';
import { BaseCard } from '../ui/BaseCard';

export interface DriveModeCardProps {
  currentMode: string;
  activeAssist: string[];
}

export const DriveModeCard = ({ currentMode, activeAssist }: DriveModeCardProps) => (
  <BaseCard title="Drive Mode" icon={Settings2}>
    <div className="flex flex-col gap-3">
      <div className="p-3 bg-automotive-blue/10 border border-automotive-blue/30 rounded-lg flex justify-between items-center">
        <span className="text-sm font-bold text-automotive-blue uppercase tracking-widest">{currentMode}</span>
        <CheckCircle2 className="w-5 h-5 text-automotive-blue" />
      </div>
      <div className="flex gap-2 flex-wrap">
        {activeAssist.map((assist, i) => (
          <span key={i} className="px-2 py-1 bg-automotive-black border border-automotive-gray/30 text-[10px] text-automotive-white uppercase tracking-wider rounded">
            {assist}
          </span>
        ))}
      </div>
    </div>
  </BaseCard>
);
