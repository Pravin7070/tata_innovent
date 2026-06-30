const fs = require('fs');
const path = require('path');

const pages = [
  {
    path: 'src/pages/Detection.tsx',
    content: `import React from 'react';
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
                  <div className={\`h-full \${item.color}\`} style={{ width: \`\${item.conf}%\` }}></div>
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
`
  },
  {
    path: 'src/pages/Vehicle.tsx',
    content: `import React from 'react';
import { BaseCard } from '../components/ui/BaseCard';
import { Car, Battery, Thermometer, Zap } from 'lucide-react';

export const Vehicle = () => (
  <div className="flex flex-col gap-6 animate-in fade-in duration-500">
    <h1 className="text-2xl font-bold uppercase tracking-widest text-automotive-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
      Vehicle <span className="text-automotive-blue">Diagnostics</span>
    </h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <BaseCard title="Battery Health" icon={Battery}>
        <div className="text-center py-4">
          <div className="text-4xl font-mono font-bold text-automotive-green mb-2">94%</div>
          <p className="text-xs text-automotive-gray uppercase tracking-widest">State of Charge</p>
        </div>
        <div className="mt-2 space-y-2 text-xs">
          <div className="flex justify-between"><span className="text-automotive-gray">Voltage:</span><span className="font-mono text-automotive-white">412 V</span></div>
          <div className="flex justify-between"><span className="text-automotive-gray">Current:</span><span className="font-mono text-automotive-white">15 A</span></div>
        </div>
      </BaseCard>
      
      <BaseCard title="Thermal Mgmt" icon={Thermometer}>
        <div className="text-center py-4">
          <div className="text-4xl font-mono font-bold text-automotive-blue mb-2">24°C</div>
          <p className="text-xs text-automotive-gray uppercase tracking-widest">Cabin Temp</p>
        </div>
        <div className="mt-2 space-y-2 text-xs">
          <div className="flex justify-between"><span className="text-automotive-gray">Battery Temp:</span><span className="font-mono text-automotive-white">32°C</span></div>
          <div className="flex justify-between"><span className="text-automotive-gray">Motor Temp:</span><span className="font-mono text-automotive-white">45°C</span></div>
        </div>
      </BaseCard>
      
      <BaseCard title="Powertrain" icon={Zap} className="lg:col-span-2">
        <div className="grid grid-cols-3 gap-4 h-full items-center text-center">
          <div>
            <p className="text-2xl font-mono font-bold text-automotive-white">180<span className="text-sm">kW</span></p>
            <p className="text-[10px] text-automotive-gray uppercase mt-1">Output</p>
          </div>
          <div>
            <p className="text-2xl font-mono font-bold text-automotive-white">350<span className="text-sm">Nm</span></p>
            <p className="text-[10px] text-automotive-gray uppercase mt-1">Torque</p>
          </div>
          <div>
            <p className="text-2xl font-mono font-bold text-automotive-white">12.5<span className="text-sm">kWh/100km</span></p>
            <p className="text-[10px] text-automotive-gray uppercase mt-1">Efficiency</p>
          </div>
        </div>
      </BaseCard>
      
      <BaseCard title="Tire Pressure & Temp" icon={Car} className="lg:col-span-4 min-h-[300px]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center h-full items-center">
          {['Front Left', 'Front Right', 'Rear Left', 'Rear Right'].map((pos, i) => (
            <div key={i} className="p-4 bg-automotive-black/40 border border-automotive-gray/20 rounded flex flex-col items-center">
              <p className="text-xs uppercase tracking-widest text-automotive-gray mb-4">{pos}</p>
              <div className="w-16 h-24 border-2 border-automotive-green rounded-lg mb-4 flex items-center justify-center bg-automotive-green/10">
                <span className="font-mono font-bold">34<span className="text-xs">psi</span></span>
              </div>
              <p className="text-xs font-mono text-automotive-white">Temp: 28°C</p>
            </div>
          ))}
        </div>
      </BaseCard>
    </div>
  </div>
);
`
  },
  {
    path: 'src/pages/Analytics.tsx',
    content: `import React from 'react';
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
              <div className="w-full bg-automotive-blue rounded-t transition-all duration-1000" style={{ height: \`\${h}%\` }}></div>
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
                <div className={\`h-full \${item.color}\`} style={{ width: \`\${item.val}%\` }}></div>
              </div>
            </div>
          ))}
        </div>
      </BaseCard>
    </div>
  </div>
);
`
  },
  {
    path: 'src/pages/Simulation.tsx',
    content: `import React from 'react';
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
`
  },
  {
    path: 'src/pages/Map.tsx',
    content: `import React from 'react';
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
`
  },
  {
    path: 'src/pages/Settings.tsx',
    content: `import React from 'react';
import { BaseCard } from '../components/ui/BaseCard';
import { Settings as SettingsIcon, User, Shield, Radio, Database } from 'lucide-react';

export const Settings = () => (
  <div className="flex flex-col gap-6 animate-in fade-in duration-500">
    <h1 className="text-2xl font-bold uppercase tracking-widest text-automotive-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
      System <span className="text-automotive-blue">Settings</span>
    </h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BaseCard title="User Profile" icon={User}>
        <div className="flex items-center gap-4 py-4">
          <div className="w-16 h-16 rounded bg-gradient-to-br from-automotive-blue to-automotive-dark flex items-center justify-center text-2xl font-bold">
            TI
          </div>
          <div>
            <p className="font-bold text-automotive-white text-lg">Admin User</p>
            <p className="text-xs text-automotive-gray font-mono">admin@tatainnovent.com</p>
          </div>
        </div>
        <button className="w-full mt-2 bg-automotive-black border border-automotive-gray/30 py-2 rounded text-xs uppercase tracking-widest hover:bg-automotive-gray/10 transition-colors">
          Edit Profile
        </button>
      </BaseCard>
      
      <BaseCard title="Network & Connectivity" icon={Radio}>
        <div className="space-y-4 py-2">
          <div className="flex justify-between items-center">
            <span className="text-xs uppercase text-automotive-gray">Cellular Data</span>
            <div className="w-10 h-5 bg-automotive-blue rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-3 h-3 bg-automotive-white rounded-full"></div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs uppercase text-automotive-gray">Telematics Sync</span>
            <div className="w-10 h-5 bg-automotive-blue rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-3 h-3 bg-automotive-white rounded-full"></div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs uppercase text-automotive-gray">Offline Mode</span>
            <div className="w-10 h-5 bg-automotive-black border border-automotive-gray/50 rounded-full relative cursor-pointer">
              <div className="absolute left-1 top-1 w-3 h-3 bg-automotive-gray rounded-full"></div>
            </div>
          </div>
        </div>
      </BaseCard>

      <BaseCard title="Data Management" icon={Database}>
        <div className="space-y-4 py-2">
          <div>
            <div className="flex justify-between text-xs text-automotive-gray mb-1 uppercase">
              <span>Local Storage</span>
              <span>45GB / 256GB</span>
            </div>
            <div className="h-1.5 w-full bg-automotive-black rounded-full overflow-hidden">
              <div className="h-full bg-automotive-blue" style={{ width: '18%' }}></div>
            </div>
          </div>
          <button className="w-full bg-automotive-black border border-red-500/30 text-red-400 py-2 rounded text-xs uppercase tracking-widest hover:bg-red-500/10 transition-colors mt-4">
            Clear Cache
          </button>
        </div>
      </BaseCard>
      
      <BaseCard title="Security" icon={Shield} className="md:col-span-2 lg:col-span-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-2">
          <div>
            <p className="text-xs uppercase text-automotive-gray mb-1">API Key</p>
            <div className="flex gap-2">
              <input type="password" value="************************" readOnly className="flex-1 bg-automotive-black border border-automotive-gray/30 rounded px-3 py-2 text-xs text-automotive-gray outline-none" />
              <button className="bg-automotive-blue/20 text-automotive-blue px-3 py-2 rounded border border-automotive-blue/30 hover:bg-automotive-blue/40 transition-colors text-xs uppercase font-bold">Reveal</button>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase text-automotive-gray mb-1">Firmware Updates</p>
            <button className="w-full bg-automotive-green/10 text-automotive-green border border-automotive-green/30 px-3 py-2 rounded hover:bg-automotive-green/20 transition-colors text-xs uppercase font-bold text-left flex justify-between items-center">
              <span>Check for Updates</span>
              <span className="bg-automotive-green text-automotive-black px-1.5 py-0.5 rounded text-[10px]">v1.0.42</span>
            </button>
          </div>
          <div>
            <p className="text-xs uppercase text-automotive-gray mb-1">System Reset</p>
            <button className="w-full bg-red-500/10 text-red-500 border border-red-500/30 px-3 py-2 rounded hover:bg-red-500/20 transition-colors text-xs uppercase font-bold">
              Factory Reset
            </button>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
);
`
  }
];

pages.forEach(p => {
  const fullPath = path.join(__dirname, p.path);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, p.content);
});
console.log("Pages created successfully.");
