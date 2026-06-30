const fs = require('fs');
const path = require('path');

const components = [
  {
    path: 'src/components/ui/BaseCard.tsx',
    content: `import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

export interface BaseCardProps {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
  statusActive?: boolean;
}

export const BaseCard = ({ title, icon: Icon, children, className = '', statusActive = true }: BaseCardProps) => (
  <div className={\`bg-automotive-dark/40 border border-automotive-gray/20 rounded-xl p-4 sm:p-5 backdrop-blur-sm flex flex-col \${className}\`}>
    <div className="flex items-center justify-between mb-4 pb-3 border-b border-automotive-gray/10">
      <div className="flex items-center gap-2 text-automotive-gray">
        {Icon && <Icon className="w-4 h-4 text-automotive-blue" />}
        <h3 className="font-bold text-xs tracking-[0.15em] uppercase text-automotive-white/80">{title}</h3>
      </div>
      {statusActive && <div className="w-1.5 h-1.5 rounded-full bg-automotive-green animate-pulse shadow-[0_0_8px_#39FF14]"></div>}
    </div>
    <div className="flex-1 flex flex-col">
      {children}
    </div>
  </div>
);
`
  },
  {
    path: 'src/components/ui/Loading.tsx',
    content: `import React from 'react';

export interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export const Loading = ({ message = "Loading...", fullScreen = false }: LoadingProps) => {
  const containerClass = fullScreen 
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-automotive-black/90 backdrop-blur-sm"
    : "flex flex-col items-center justify-center p-8 h-full w-full";

  return (
    <div className={containerClass}>
      <div className="w-12 h-12 border-4 border-automotive-gray/20 border-t-automotive-blue rounded-full animate-spin shadow-[0_0_15px_rgba(0,180,216,0.5)]"></div>
      <p className="mt-4 text-automotive-blue font-mono text-xs uppercase tracking-widest animate-pulse">{message}</p>
    </div>
  );
};
`
  },
  {
    path: 'src/components/ui/Toast.tsx',
    content: `import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast = ({ message, type = 'info', isVisible, onClose, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const typeConfig = {
    success: { icon: CheckCircle2, color: 'text-automotive-green', border: 'border-automotive-green/50', bg: 'bg-automotive-green/10' },
    error: { icon: AlertTriangle, color: 'text-red-500', border: 'border-red-500/50', bg: 'bg-red-500/10' },
    warning: { icon: AlertTriangle, color: 'text-yellow-500', border: 'border-yellow-500/50', bg: 'bg-yellow-500/10' },
    info: { icon: Info, color: 'text-automotive-blue', border: 'border-automotive-blue/50', bg: 'bg-automotive-blue/10' },
  };

  const { icon: Icon, color, border, bg } = typeConfig[type];

  return (
    <div className={\`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border \${border} \${bg} backdrop-blur-md shadow-lg min-w-[300px] animate-in slide-in-from-bottom-5\`}>
      <Icon className={\`w-5 h-5 \${color}\`} />
      <p className="flex-1 text-sm font-medium text-automotive-white">{message}</p>
      <button onClick={onClose} className="text-automotive-gray hover:text-automotive-white transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
`
  },
  {
    path: 'src/components/layout/Navbar.tsx',
    content: `import React from 'react';
import { Menu, Bell, User } from 'lucide-react';

export interface NavbarProps {
  toggleSidebar: () => void;
  brandName?: string;
  brandInitial?: string;
  systemStatus?: string;
  isSystemNominal?: boolean;
}

export const Navbar = ({ 
  toggleSidebar, 
  brandName = "Innovent", 
  brandInitial = "T", 
  systemStatus = "System Nominal", 
  isSystemNominal = true 
}: NavbarProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-automotive-black/80 backdrop-blur-md border-b border-automotive-dark z-20 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="text-automotive-white hover:text-automotive-blue transition-colors md:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-automotive-blue to-automotive-dark flex items-center justify-center shadow-[0_0_10px_rgba(0,180,216,0.5)]">
            <span className="font-extrabold text-automotive-white">{brandInitial}</span>
          </div>
          <span className="text-automotive-white font-extrabold tracking-[0.2em] uppercase text-lg hidden sm:block">{brandName}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center gap-2">
           <span className={\`w-2 h-2 rounded-full \${isSystemNominal ? 'bg-automotive-green animate-pulse' : 'bg-red-500 animate-pulse'}\`}></span>
           <span className={\`text-xs font-mono uppercase tracking-widest \${isSystemNominal ? 'text-automotive-green' : 'text-red-500'}\`}>{systemStatus}</span>
        </div>

        <button className="relative text-automotive-gray hover:text-automotive-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-automotive-blue border-2 border-automotive-black rounded-full"></span>
        </button>
        <button className="flex items-center gap-2 text-automotive-gray hover:text-automotive-white transition-colors">
          <div className="w-8 h-8 rounded-full bg-automotive-dark flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
        </button>
      </div>
    </header>
  );
};
`
  },
  {
    path: 'src/components/layout/Sidebar.tsx',
    content: `import React from 'react';
import { NavLink } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

export interface MenuItem {
  name: string;
  path: string;
  icon: LucideIcon;
}

export interface SidebarProps {
  isOpen: boolean;
  menuItems: MenuItem[];
}

export const Sidebar = ({ isOpen, menuItems }: SidebarProps) => {
  return (
    <aside className={\`w-64 h-screen fixed left-0 top-0 bg-automotive-black border-r border-automotive-dark text-automotive-white flex flex-col pt-16 z-10 transition-transform duration-300 \${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}\`}>
      <div className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  \`flex items-center p-3 rounded-lg transition-all duration-200 group \${
                    isActive
                      ? 'bg-automotive-dark text-automotive-blue border-l-4 border-automotive-blue shadow-[inset_0_0_12px_rgba(0,180,216,0.1)]'
                      : 'border-l-4 border-transparent hover:bg-automotive-dark/50 text-automotive-gray hover:text-automotive-white'
                  }\`
                }
              >
                <item.icon className="w-5 h-5 mr-3 transition-colors group-hover:text-automotive-blue" />
                <span className="font-semibold tracking-wide text-sm uppercase">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};
`
  },
  {
    path: 'src/components/layout/Footer.tsx',
    content: `import React from 'react';
import { Activity } from 'lucide-react';

export interface FooterProps {
  engineStatus?: string;
  buildVersion?: string;
  copyrightYear?: number;
  companyName?: string;
}

export const Footer = ({
  engineStatus = "Active",
  buildVersion = "1.0.42-beta",
  copyrightYear = new Date().getFullYear(),
  companyName = "Tata Motors Ltd."
}: FooterProps) => {
  return (
    <footer className="h-10 border-t border-automotive-dark bg-automotive-black flex items-center justify-between px-6 text-[10px] sm:text-xs text-automotive-gray mt-auto font-mono uppercase tracking-widest shrink-0">
      <div className="flex items-center gap-2">
        <Activity className="w-3 h-3 text-automotive-green" />
        <span>Diagnostic Engine: <span className="text-automotive-white">{engineStatus}</span></span>
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden sm:inline">Build Version: <span className="text-automotive-white">{buildVersion}</span></span>
        <span>&copy; {copyrightYear} {companyName}</span>
      </div>
    </footer>
  );
};
`
  },
  {
    path: 'src/components/dashboard/VideoPlayer.tsx',
    content: `import React from 'react';
import { Video, Settings2 } from 'lucide-react';
import { BaseCard } from '../ui/BaseCard';

export interface VideoPlayerProps {
  status: string;
  resolution: string;
  fps: number;
  source: string;
  onSwitchCamera?: () => void;
  onSettingsClick?: () => void;
}

export const VideoPlayer = ({ status, resolution, fps, source, onSwitchCamera, onSettingsClick }: VideoPlayerProps) => (
  <BaseCard title="Live Feed" icon={Video} className="h-full min-h-[350px]">
    <div className="flex-1 bg-automotive-black rounded-lg border border-automotive-gray/30 overflow-hidden relative group">
      {/* Futuristic Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,180,216,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,180,216,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      
      {/* Overlays */}
      <div className="absolute top-4 left-4 bg-black/80 px-2 py-1 rounded text-[10px] uppercase tracking-wider flex items-center gap-2 border border-automotive-gray/30 text-automotive-white font-mono">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
        {status} | {resolution} | {fps} FPS
      </div>
      
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
        <div className="bg-black/80 px-3 py-1.5 rounded border border-automotive-blue/50 text-automotive-blue text-[10px] uppercase tracking-widest font-mono">
          {source}
        </div>
        <button onClick={onSettingsClick} className="bg-black/60 p-2 rounded-full border border-automotive-gray/30 text-automotive-white hover:bg-automotive-blue hover:border-automotive-blue cursor-pointer transition-colors">
          <Settings2 className="w-4 h-4" />
        </button>
      </div>
      
      {/* Target Crosshair Mock */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-[0.5px] border-automotive-green/30 rounded-full flex items-center justify-center pointer-events-none">
        <div className="w-32 h-32 border-[0.5px] border-automotive-green/20 rounded-full flex items-center justify-center">
           <div className="w-1 h-1 bg-automotive-green rounded-full shadow-[0_0_10px_#39FF14]"></div>
        </div>
        <div className="absolute top-0 w-[1px] h-4 bg-automotive-green/80"></div>
        <div className="absolute bottom-0 w-[1px] h-4 bg-automotive-green/80"></div>
        <div className="absolute left-0 w-4 h-[1px] bg-automotive-green/80"></div>
        <div className="absolute right-0 w-4 h-[1px] bg-automotive-green/80"></div>
      </div>
    </div>
    
    <div className="mt-4 flex gap-3">
      <button 
        onClick={onSwitchCamera}
        className="flex-1 bg-automotive-dark hover:bg-automotive-gray/20 text-automotive-white border border-automotive-gray/30 py-2.5 rounded text-xs tracking-widest uppercase transition-colors font-bold"
      >
        Switch Camera
      </button>
    </div>
  </BaseCard>
);
`
  },
  {
    path: 'src/components/dashboard/VideoUploader.tsx',
    content: `import React, { useRef } from 'react';
import { UploadCloud } from 'lucide-react';

export interface VideoUploaderProps {
  onUpload: (file: File) => void;
  isUploading?: boolean;
}

export const VideoUploader = ({ onUpload, isUploading = false }: VideoUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="flex gap-2 w-full">
      <input 
        type="file" 
        accept="video/*" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <button 
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="flex-1 flex items-center justify-center gap-2 bg-automotive-blue/10 hover:bg-automotive-blue/20 text-automotive-blue border border-automotive-blue/30 py-2.5 rounded text-xs tracking-widest uppercase transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <UploadCloud className="w-4 h-4" />
        {isUploading ? 'Uploading...' : 'Upload Video'}
      </button>
    </div>
  );
};
`
  },
  {
    path: 'src/components/dashboard/DetectionCard.tsx',
    content: `import React from 'react';
import { Mountain } from 'lucide-react';
import { BaseCard } from '../ui/BaseCard';

export interface DetectionCardProps {
  type: string;
  confidence: number;
}

export const DetectionCard = ({ type, confidence }: DetectionCardProps) => (
  <BaseCard title="Terrain Detection" icon={Mountain}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[10px] text-automotive-gray uppercase tracking-widest mb-1">Detected Type</p>
        <p className="text-2xl font-bold text-automotive-white">{type}</p>
      </div>
      <div className="text-right">
        <p className="text-[10px] text-automotive-gray uppercase tracking-widest mb-1">Confidence</p>
        <p className="text-2xl font-bold text-automotive-green">{confidence}%</p>
      </div>
    </div>
    <div className="mt-4 h-1.5 w-full bg-automotive-black rounded-full overflow-hidden">
      <div className="h-full bg-automotive-green transition-all duration-500" style={{ width: \`\${confidence}%\` }}></div>
    </div>
  </BaseCard>
);
`
  },
  {
    path: 'src/components/dashboard/StatusCard.tsx',
    content: `import React from 'react';
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
`
  },
  {
    path: 'src/components/dashboard/CommandLog.tsx',
    content: `import React from 'react';
import { Server, CheckCircle2, XCircle } from 'lucide-react';
import { BaseCard } from '../ui/BaseCard';

export interface CommandItem {
  id: string | number;
  time: string;
  command: string;
  status: 'Success' | 'Failed' | 'Pending';
}

export interface CommandLogProps {
  commands: CommandItem[];
}

export const CommandLog = ({ commands }: CommandLogProps) => (
  <BaseCard title="Command Log" icon={Server}>
    <div className="flex flex-col gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
      {commands.map((cmd) => (
        <div key={cmd.id} className="flex justify-between items-center p-2 rounded bg-automotive-black/40 border border-automotive-gray/10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-automotive-gray">{cmd.time}</span>
            <span className="text-xs uppercase font-medium tracking-wide text-automotive-white">{cmd.command}</span>
          </div>
          {cmd.status === 'Success' && <CheckCircle2 className="w-3 h-3 text-automotive-green" />}
          {cmd.status === 'Failed' && <XCircle className="w-3 h-3 text-red-500" />}
          {cmd.status === 'Pending' && <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>}
        </div>
      ))}
    </div>
  </BaseCard>
);
`
  },
  {
    path: 'src/components/dashboard/SeverityGauge.tsx',
    content: `import React from 'react';
import { Activity } from 'lucide-react';
import { BaseCard } from '../ui/BaseCard';

export interface SeverityGaugeProps {
  level: string;
  score: number;
  maxScore: number;
}

export const SeverityGauge = ({ level, score, maxScore }: SeverityGaugeProps) => (
  <BaseCard title="Terrain Severity" icon={Activity}>
    <div className="flex items-end gap-4 justify-between h-full pt-2">
      <div className="flex-1">
        <p className="text-xs text-automotive-gray uppercase tracking-widest mb-2">Severity Level: {level}</p>
        <div className="flex h-4 gap-1">
          {[...Array(maxScore)].map((_, i) => (
            <div 
              key={i} 
              className={\`flex-1 rounded-sm \${i < score ? (i > 7 ? 'bg-red-500' : i > 4 ? 'bg-yellow-500' : 'bg-automotive-green') : 'bg-automotive-black'}\`}
            ></div>
          ))}
        </div>
      </div>
      <div className="text-right">
        <p className="text-3xl font-bold font-mono text-automotive-white">{score}</p>
        <p className="text-[10px] text-automotive-gray uppercase">/ {maxScore}</p>
      </div>
    </div>
  </BaseCard>
);
`
  },
  {
    path: 'src/components/dashboard/DriveModeCard.tsx',
    content: `import React from 'react';
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
`
  },
  {
    path: 'src/components/dashboard/SuspensionCard.tsx',
    content: `import React from 'react';
import { Car } from 'lucide-react';
import { BaseCard } from '../ui/BaseCard';

export interface SuspensionCardProps {
  frontLeft: number;
  frontRight: number;
  rearLeft: number;
  rearRight: number;
  mode: string;
  status: string;
}

export const SuspensionCard = ({ frontLeft, frontRight, rearLeft, rearRight, mode, status }: SuspensionCardProps) => (
  <BaseCard title="Suspension Status" icon={Car}>
    <div className="grid grid-cols-2 gap-4 text-center">
      <div className="p-2 border border-automotive-gray/20 rounded bg-automotive-black/50">
        <p className="text-[10px] text-automotive-gray uppercase mb-1">FL</p>
        <p className="font-mono text-automotive-white font-bold">{frontLeft}mm</p>
      </div>
      <div className="p-2 border border-automotive-gray/20 rounded bg-automotive-black/50">
        <p className="text-[10px] text-automotive-gray uppercase mb-1">FR</p>
        <p className="font-mono text-automotive-white font-bold">{frontRight}mm</p>
      </div>
      <div className="p-2 border border-automotive-gray/20 rounded bg-automotive-black/50">
        <p className="text-[10px] text-automotive-gray uppercase mb-1">RL</p>
        <p className="font-mono text-automotive-white font-bold">{rearLeft}mm</p>
      </div>
      <div className="p-2 border border-automotive-gray/20 rounded bg-automotive-black/50">
        <p className="text-[10px] text-automotive-gray uppercase mb-1">RR</p>
        <p className="font-mono text-automotive-white font-bold">{rearRight}mm</p>
      </div>
    </div>
    <div className="mt-4 flex justify-between items-center text-xs">
      <span className="text-automotive-gray uppercase tracking-widest">Mode: <span className="text-automotive-white">{mode}</span></span>
      <span className="text-automotive-green uppercase tracking-widest">{status}</span>
    </div>
  </BaseCard>
);
`
  },
  {
    path: 'src/components/dashboard/VehicleCard.tsx',
    content: `import React from 'react';
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
`
  }
];

components.forEach(c => {
  const fullPath = path.join(__dirname, c.path);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, c.content);
});
console.log("Components created successfully.");
