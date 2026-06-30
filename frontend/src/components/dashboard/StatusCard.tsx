import React from 'react';
import { Gauge, Settings2, Battery, Thermometer } from 'lucide-react';
import { BaseCard } from '../ui/BaseCard';

export interface StatusCardProps {
  speed: number;
  rpm: number;
  gear: string;
  battery: number;
  temp: number;
}

export const StatusCard = ({ speed, rpm, gear, battery, temp }: StatusCardProps) => (
  <BaseCard title="Vehicle Status" icon={Gauge}>
    <div className="grid grid-cols-2 gap-y-4 gap-x-2">
      <div className="flex items-center gap-3">
        <Gauge className="w-5 h-5 text-automotive-blue" />
        <div>
          <p className="text-[10px] text-automotive-gray uppercase tracking-widest">Speed</p>
          <p className="font-mono font-bold text-automotive-white">{speed} km/h</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Settings2 className="w-5 h-5 text-automotive-gray" />
        <div>
          <p className="text-[10px] text-automotive-gray uppercase tracking-widest">Gear / RPM</p>
          <p className="font-mono font-bold text-automotive-white">{gear} / {rpm}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Battery className="w-5 h-5 text-automotive-green" />
        <div>
          <p className="text-[10px] text-automotive-gray uppercase tracking-widest">Battery</p>
          <p className="font-mono font-bold text-automotive-white">{battery}%</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Thermometer className="w-5 h-5 text-red-400" />
        <div>
          <p className="text-[10px] text-automotive-gray uppercase tracking-widest">Temp</p>
          <p className="font-mono font-bold text-automotive-white">{temp}°C</p>
        </div>
      </div>
    </div>
  </BaseCard>
);
