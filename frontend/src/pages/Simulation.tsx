import React from 'react';
import { BaseCard } from '../components/ui/BaseCard';
import { Cpu, Play, Square, RotateCcw, CloudRain } from 'lucide-react';

export const Simulation = () => (
  <div className="flex flex-col gap-6 animate-in fade-in duration-500">
    <h1 className="text-2xl font-bold uppercase tracking-widest text-automotive-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
      Environment <span className="text-automotive-blue">Simulation</span>
    </h1>
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <BaseCard title="3D Engine Viewport" icon={Cpu} className="lg:col-span-3 min-h-[500px]">
        <div className="flex-1 bg-automotive-black rounded border border-automotive-gray/30 relative flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,180,216,0.1)_0,rgba(26,26,26,1)_100%)]"></div>
          {/* Wireframe Grid Mock */}
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(0,180,216,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,180,216,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px', transform: 'perspective(500px) rotateX(60deg) scale(2)', transformOrigin: 'bottom' }}></div>
          <div className="text-center relative z-10">
            <Cpu className="w-16 h-16 mx-auto mb-4 text-automotive-gray opacity-30" />
            <p className="text-automotive-gray font-mono uppercase tracking-widest text-sm">Simulation Engine Idle</p>
          </div>
        </div>
      </BaseCard>
      
      <div className="flex flex-col gap-6">
        <BaseCard title="Controls" icon={Play}>
          <div className="flex flex-col gap-3">
            <button className="bg-automotive-green/20 hover:bg-automotive-green/30 text-automotive-green border border-automotive-green/50 py-3 rounded uppercase tracking-widest text-xs font-bold transition-colors flex items-center justify-center gap-2">
              <Play className="w-4 h-4" /> Start Sim
            </button>
            <button className="bg-automotive-black hover:bg-automotive-dark text-red-500 border border-red-500/50 py-3 rounded uppercase tracking-widest text-xs font-bold transition-colors flex items-center justify-center gap-2">
              <Square className="w-4 h-4" /> Stop
            </button>
            <button className="bg-automotive-black hover:bg-automotive-dark text-automotive-gray border border-automotive-gray/50 py-3 rounded uppercase tracking-widest text-xs font-bold transition-colors flex items-center justify-center gap-2">
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          </div>
        </BaseCard>
        
        <BaseCard title="Environment Params" icon={CloudRain}>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-automotive-gray uppercase mb-1">
                <span>Weather</span>
                <span className="text-automotive-white">Rainy</span>
              </div>
              <select className="w-full bg-automotive-black border border-automotive-gray/30 text-automotive-white rounded p-2 text-xs uppercase outline-none">
                <option>Sunny</option>
                <option selected>Rainy</option>
                <option>Snow</option>
                <option>Fog</option>
              </select>
            </div>
            <div>
              <div className="flex justify-between text-xs text-automotive-gray uppercase mb-1">
                <span>Terrain Friction</span>
                <span className="text-automotive-white font-mono">0.4μ</span>
              </div>
              <input type="range" className="w-full accent-automotive-blue" min="0" max="1" step="0.1" defaultValue="0.4" />
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
);
