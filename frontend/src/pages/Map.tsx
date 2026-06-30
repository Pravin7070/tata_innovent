import React from 'react';
import { BaseCard } from '../components/ui/BaseCard';
import { Map as MapIcon, Navigation2, Compass } from 'lucide-react';

export const Map = () => (
  <div className="flex flex-col gap-6 animate-in fade-in duration-500 h-full">
    <h1 className="text-2xl font-bold uppercase tracking-widest text-automotive-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
      Navigation <span className="text-automotive-blue">& GPS</span>
    </h1>
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
      <BaseCard title="Global Map" icon={MapIcon} className="lg:col-span-3 min-h-[500px]">
        <div className="flex-1 bg-[#111] rounded border border-automotive-gray/30 relative flex items-center justify-center overflow-hidden">
          {/* Mock Map Background */}
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(0,180,216,0.2) 0%, transparent 40%), radial-gradient(circle at 70% 60%, rgba(57,255,20,0.1) 0%, transparent 40%)' }}></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center opacity-20 grayscale mix-blend-screen"></div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-automotive-blue/20 flex items-center justify-center animate-pulse">
              <Navigation2 className="w-6 h-6 text-automotive-blue drop-shadow-[0_0_10px_#00B4D8]" />
            </div>
          </div>
          
          <div className="absolute bottom-4 right-4 bg-black/80 p-2 rounded border border-automotive-gray/30 text-xs font-mono text-automotive-gray">
            LAT: 18.5204 N | LNG: 73.8567 E
          </div>
        </div>
      </BaseCard>
      
      <div className="flex flex-col gap-6">
        <BaseCard title="Route Planning" icon={Compass}>
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute left-[11px] top-6 bottom-4 w-0.5 bg-automotive-gray/30"></div>
              <div className="flex gap-3 items-center mb-4 relative z-10">
                <div className="w-6 h-6 rounded-full bg-automotive-blue flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-automotive-black"></div>
                </div>
                <input type="text" value="Current Location" readOnly className="w-full bg-automotive-black border border-automotive-gray/30 rounded p-2 text-xs text-automotive-white outline-none" />
              </div>
              <div className="flex gap-3 items-center relative z-10">
                <div className="w-6 h-6 rounded-full bg-automotive-green flex items-center justify-center shrink-0">
                  <Navigation2 className="w-3 h-3 text-automotive-black" />
                </div>
                <input type="text" placeholder="Enter Destination..." className="w-full bg-automotive-black border border-automotive-gray/30 rounded p-2 text-xs text-automotive-white outline-none placeholder:text-automotive-gray/50" />
              </div>
            </div>
            <button className="w-full bg-automotive-blue/20 hover:bg-automotive-blue/30 text-automotive-blue border border-automotive-blue/50 py-2.5 rounded uppercase tracking-widest text-xs font-bold transition-colors mt-2">
              Calculate Route
            </button>
          </div>
        </BaseCard>
        
        <BaseCard title="GPS Signal" icon={Navigation2}>
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs text-automotive-gray uppercase">Satellites Locked</span>
            <span className="font-mono text-xl text-automotive-green font-bold">14</span>
          </div>
          <div className="h-2 w-full bg-automotive-black rounded-full overflow-hidden">
            <div className="h-full bg-automotive-green" style={{ width: '85%' }}></div>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
);
