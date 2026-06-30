
import { Car } from 'lucide-react';
import { BaseCard } from '../ui/BaseCard';

export interface VehicleCardProps {
  model: string;
  vin: string;
  firmware: string;
  uptime: string;
}

export const VehicleCard = ({ model, vin, firmware, uptime }: VehicleCardProps) => (
  <BaseCard title="Vehicle Overview" icon={Car}>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <p className="text-[10px] text-automotive-gray uppercase tracking-widest mb-1">Model</p>
        <p className="font-bold text-sm text-automotive-white truncate" title={model}>{model}</p>
      </div>
      <div>
        <p className="text-[10px] text-automotive-gray uppercase tracking-widest mb-1">VIN</p>
        <p className="font-mono text-xs text-automotive-white truncate" title={vin}>{vin}</p>
      </div>
      <div>
        <p className="text-[10px] text-automotive-gray uppercase tracking-widest mb-1">Firmware</p>
        <p className="font-mono text-xs text-automotive-blue">{firmware}</p>
      </div>
      <div>
        <p className="text-[10px] text-automotive-gray uppercase tracking-widest mb-1">Uptime</p>
        <p className="font-mono text-xs text-automotive-white">{uptime}</p>
      </div>
    </div>
  </BaseCard>
);
