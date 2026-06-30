
import { ShieldAlert, AlertTriangle } from 'lucide-react';
import { BaseCard } from '../ui/BaseCard';

export interface AlertItem {
  id: string | number;
  time: string;
  type: 'Warning' | 'Info' | 'Critical';
  message: string;
}

export interface RecentAlertsCardProps {
  alerts: AlertItem[];
}

export const RecentAlertsCard = ({ alerts }: RecentAlertsCardProps) => (
  <BaseCard title="Recent Alerts" icon={ShieldAlert}>
    <div className="flex flex-col gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
      {alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
          <ShieldAlert className="w-8 h-8 text-automotive-gray/40 mb-2" />
          <p className="text-xs uppercase tracking-widest text-automotive-gray/60 font-semibold">No Recent Alerts</p>
          <p className="text-[10px] text-automotive-gray/40 mt-1">System operating within normal parameters.</p>
        </div>
      ) : (
        alerts.map((alert) => (
          <div key={alert.id} className={`flex gap-3 p-3 rounded border ${alert.type === 'Warning' ? 'bg-red-500/10 border-red-500/30' : 'bg-automotive-blue/10 border-automotive-blue/30'}`}>
            <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${alert.type === 'Warning' ? 'text-red-400' : 'text-automotive-blue'}`} />
            <div>
              <p className="text-xs text-automotive-white">{alert.message}</p>
              <p className="text-[10px] text-automotive-gray font-mono mt-1">{alert.time}</p>
            </div>
          </div>
        ))
      )}
    </div>
  </BaseCard>
);
