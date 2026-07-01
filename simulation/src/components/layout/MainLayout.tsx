import React from 'react';
import { SimulationToolbar } from './SimulationToolbar';
import { SidebarLeft } from './SidebarLeft';
import { SidebarRight } from './SidebarRight';
import { TopHeader } from './TopHeader';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="w-screen h-screen overflow-hidden bg-[#050608] text-slate-200 font-['Outfit'] relative flex flex-col">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[radial-gradient(#00b4d8_1px,transparent_1px)] [background-size:24px_24px]" />
      
      {/* Header */}
      <TopHeader />

      {/* Main Content Area */}
      <div className="flex-1 relative flex overflow-hidden z-10 p-4 gap-4">
        
        {/* Left Sidebar (Telemetry & Health) */}
        <SidebarLeft />

        {/* Center Viewport Container */}
        <div className="flex-1 relative rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-black/50">
          {children}
        </div>

        {/* Right Sidebar (Command Simulator & Pipeline) */}
        <SidebarRight />

      </div>

      {/* Footer Toolbar */}
      <SimulationToolbar />
    </div>
  );
};
