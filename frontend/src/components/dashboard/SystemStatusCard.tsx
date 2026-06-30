import React from 'react';
import { Wifi } from 'lucide-react';
import { BaseCard } from '../ui/BaseCard';

export interface SystemStatusCardProps {
  title: string;
  data: Record<string, string | number>;
}

export const SystemStatusCard = ({ title, data }: SystemStatusCardProps) => (
  <BaseCard title={title} icon={Wifi}>
    <div className="flex items-center justify-between h-full">
      {Object.entries(data).map(([key, value]) => (
        <div key={key}>
          <p className="text-[10px] text-automotive-gray uppercase tracking-widest mb-1">{key}</p>
          <p className="font-mono font-bold text-sm text-automotive-white">{String(value)}</p>
        </div>
      ))}
    </div>
  </BaseCard>
);
