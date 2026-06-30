import React from 'react';
import { BaseCard } from '../components/ui/BaseCard';
import { Target, Camera, Activity, Box } from 'lucide-react';

export const Detection = () => (
  <div className="flex flex-col gap-6 animate-in fade-in duration-500">
    <h1 className="text-2xl font-bold uppercase tracking-widest text-automotive-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
      Object <span className="text-automotive-blue">Detection</span>
    </h1>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <BaseCard title="Live Inference Feed" icon={Camera} className="lg:col-span-2 min-h-[500px]">
        <div className="flex-1 bg-automotive-black rounded border border-automotive-gray/30 relative flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,180,216,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,180,216,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
          <div className="text-automotive-gray font-mono uppercase tracking-widest animate-pulse flex flex-col items-center">
            <Target className="w-12 h-12 mb-4 text-automotive-blue opacity-50" />
            <span>Awaiting Video Stream</span>
          </div>
        </div>
      </BaseCard>
      <div className="flex flex-col gap-6">
        <BaseCard title="Detected Objects" icon={Box}>
          <div className="flex flex-col gap-3">
            {[
              { obj: 'Pedestrian', conf: 98, color: 'bg-automotive-green' },
              { obj: 'Vehicle', conf: 85, color: 'bg-automotive-blue' },
              { obj: 'Traffic Sign', conf: 72, color: 'bg-yellow-500' }
            ].map((item, i) => (
              <div key={i} className="bg-automotive-black/50 p-3 rounded border border-automotive-gray/20">
                <div className="flex justify-between text-xs uppercase tracking-wider mb-2">
                  <span>{item.obj}</span>
                  <span className="font-mono text-automotive-white">{item.conf}%</span>
                </div>
                <div className="h-1 bg-automotive-black rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${item.conf}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </BaseCard>
        <BaseCard title="Model Metrics" icon={Activity}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-automotive-gray uppercase mb-1">Inference Time</p>
              <p className="font-mono text-xl text-automotive-white">12<span className="text-sm">ms</span></p>
            </div>
            <div>
              <p className="text-[10px] text-automotive-gray uppercase mb-1">FPS</p>
              <p className="font-mono text-xl text-automotive-white">83</p>
            </div>
            <div>
              <p className="text-[10px] text-automotive-gray uppercase mb-1">Resolution</p>
              <p className="font-mono text-sm text-automotive-white mt-1">1920x1080</p>
            </div>
            <div>
              <p className="text-[10px] text-automotive-gray uppercase mb-1">Model Version</p>
              <p className="font-mono text-sm text-automotive-blue mt-1">YOLOv8-Opt</p>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
);
