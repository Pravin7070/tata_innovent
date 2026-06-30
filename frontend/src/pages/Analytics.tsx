
import { BaseCard } from '../components/ui/BaseCard';
import { BarChart2, TrendingUp, Clock } from 'lucide-react';

export const Analytics = () => (
  <div className="flex flex-col gap-6 animate-in fade-in duration-500">
    <h1 className="text-2xl font-bold uppercase tracking-widest text-automotive-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
      Data <span className="text-automotive-blue">Analytics</span>
    </h1>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <BaseCard title="Trip History Overview" icon={Clock} className="lg:col-span-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4">
          <div className="border-r border-automotive-gray/20 px-4">
            <p className="text-xs text-automotive-gray uppercase tracking-widest">Total Distance</p>
            <p className="text-2xl font-mono text-automotive-white mt-1">12,450 km</p>
          </div>
          <div className="border-r border-automotive-gray/20 px-4">
            <p className="text-xs text-automotive-gray uppercase tracking-widest">Drive Time</p>
            <p className="text-2xl font-mono text-automotive-white mt-1">342 h</p>
          </div>
          <div className="border-r border-automotive-gray/20 px-4">
            <p className="text-xs text-automotive-gray uppercase tracking-widest">Avg Efficiency</p>
            <p className="text-2xl font-mono text-automotive-white mt-1">14.2 kWh</p>
          </div>
          <div className="px-4">
            <p className="text-xs text-automotive-gray uppercase tracking-widest">Energy Saved</p>
            <p className="text-2xl font-mono text-automotive-green mt-1">450 kWh</p>
          </div>
        </div>
      </BaseCard>
      
      <BaseCard title="Efficiency Trend (7 Days)" icon={TrendingUp} className="lg:col-span-2 min-h-[300px] flex flex-col">
        <div className="flex-1 flex items-end gap-2 pt-8">
          {[60, 45, 80, 50, 70, 90, 65].map((h, i) => (
            <div key={i} className="flex-1 bg-automotive-blue/20 hover:bg-automotive-blue transition-colors rounded-t relative group">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-automotive-black px-2 py-1 text-xs rounded border border-automotive-gray/30 transition-opacity">
                {h}
              </div>
              <div className="w-full bg-automotive-blue rounded-t transition-all duration-1000" style={{ height: `${h}%` }}></div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 text-[10px] text-automotive-gray uppercase border-t border-automotive-gray/20 pt-2">
          <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
        </div>
      </BaseCard>
      
      <BaseCard title="Energy Distribution" icon={BarChart2}>
        <div className="flex flex-col gap-4 py-2">
          {[
            { label: 'Driving', val: 75, color: 'bg-automotive-blue' },
            { label: 'Climate', val: 15, color: 'bg-automotive-green' },
            { label: 'Battery Conditioning', val: 7, color: 'bg-yellow-500' },
            { label: 'Electronics', val: 3, color: 'bg-automotive-gray' }
          ].map((item, i) => (
            <div key={i}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-automotive-white">{item.label}</span>
                <span className="font-mono text-automotive-gray">{item.val}%</span>
              </div>
              <div className="h-2 w-full bg-automotive-black rounded-full overflow-hidden">
                <div className={`h-full ${item.color}`} style={{ width: `${item.val}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </BaseCard>
    </div>
  </div>
);
