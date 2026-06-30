const fs = require('fs');
const path = require('path');

const updates = [
  {
    path: 'src/layouts/AppLayout.tsx',
    content: `import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Target, Car, BarChart2, Cpu, Map as MapIcon, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Sidebar } from '../components/layout/Sidebar';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

const menuItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Detection', path: '/detection', icon: Target },
  { name: 'Vehicle', path: '/vehicle', icon: Car },
  { name: 'Analytics', path: '/analytics', icon: BarChart2 },
  { name: 'Simulation', path: '/simulation', icon: Cpu },
  { name: 'Map', path: '/map', icon: MapIcon },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-automotive-black text-automotive-white font-sans flex flex-col overflow-hidden">
      <Navbar toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 pt-16">
        <Sidebar isOpen={isSidebarOpen} menuItems={menuItems} />
        
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-0 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
        </AnimatePresence>
        
        <main className="flex-1 flex flex-col md:ml-64 h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar relative z-0 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex-1 p-4 sm:p-6 lg:p-8"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
          <Footer />
        </main>
      </div>
    </div>
  );
};
`
  },
  {
    path: 'src/components/layout/Sidebar.tsx',
    content: `import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <motion.aside 
      initial={false}
      animate={{ x: isOpen || !isMobile ? 0 : '-100%' }}
      transition={{ type: "spring", bounce: 0, duration: 0.4 }}
      className="w-64 h-screen fixed left-0 top-0 bg-automotive-black/95 backdrop-blur-xl border-r border-automotive-dark text-automotive-white flex flex-col pt-16 z-10"
    >
      <div className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  \`flex items-center p-3 rounded-lg transition-all duration-300 group relative overflow-hidden \${
                    isActive
                      ? 'bg-automotive-dark text-automotive-blue border-l-4 border-transparent'
                      : 'border-l-4 border-transparent hover:bg-automotive-dark/50 text-automotive-gray hover:text-automotive-white'
                  }\`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div 
                        layoutId="active-sidebar-bg" 
                        className="absolute inset-0 bg-automotive-blue/10 border-l-4 border-automotive-blue shadow-[inset_0_0_20px_rgba(0,180,216,0.15)]"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <item.icon className="w-5 h-5 mr-3 relative z-10 transition-colors group-hover:text-automotive-blue" />
                    <span className="font-semibold tracking-wide text-sm uppercase relative z-10">{item.name}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </motion.aside>
  );
};
`
  },
  {
    path: 'src/components/ui/BaseCard.tsx',
    content: `import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export interface BaseCardProps {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
  statusActive?: boolean;
}

export const BaseCard = ({ title, icon: Icon, children, className = '', statusActive = true }: BaseCardProps) => (
  <motion.div 
    whileHover={{ y: -4, boxShadow: "0 8px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 180, 216, 0.1)" }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className={\`bg-automotive-dark/40 border border-automotive-gray/20 rounded-xl p-4 sm:p-5 backdrop-blur-sm flex flex-col relative overflow-hidden \${className}\`}
  >
    <div className="flex items-center justify-between mb-4 pb-3 border-b border-automotive-gray/10 relative z-10">
      <div className="flex items-center gap-2 text-automotive-gray">
        {Icon && <Icon className="w-4 h-4 text-automotive-blue drop-shadow-[0_0_5px_rgba(0,180,216,0.5)]" />}
        <h3 className="font-bold text-xs tracking-[0.15em] uppercase text-automotive-white/80">{title}</h3>
      </div>
      {statusActive && (
        <motion.div 
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-1.5 h-1.5 rounded-full bg-automotive-green shadow-[0_0_8px_#39FF14]"
        />
      )}
    </div>
    <div className="flex-1 flex flex-col relative z-10">
      {children}
    </div>
  </motion.div>
);
`
  },
  {
    path: 'src/components/dashboard/DetectionCard.tsx',
    content: `import React from 'react';
import { Mountain } from 'lucide-react';
import { BaseCard } from '../ui/BaseCard';
import { motion } from 'framer-motion';

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
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: \`\${confidence}%\` }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
        className="h-full bg-automotive-green shadow-[0_0_10px_#39FF14]" 
      />
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
import { motion } from 'framer-motion';

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
            <div key={i} className="flex-1 rounded-sm bg-automotive-black overflow-hidden relative">
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: i < score ? 1 : 0 }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: "easeOut" }}
                className={\`absolute inset-0 origin-left \${i > 7 ? 'bg-red-500 shadow-[0_0_5px_#ef4444]' : i > 4 ? 'bg-yellow-500 shadow-[0_0_5px_#eab308]' : 'bg-automotive-green shadow-[0_0_5px_#39FF14]'}\`}
              />
            </div>
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
    path: 'src/components/ui/Loading.tsx',
    content: `import React from 'react';
import { motion } from 'framer-motion';

export interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export const Loading = ({ message = "Loading...", fullScreen = false }: LoadingProps) => {
  const containerClass = fullScreen 
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-automotive-black/90 backdrop-blur-md"
    : "flex flex-col items-center justify-center p-8 h-full w-full";

  return (
    <div className={containerClass}>
      <div className="relative w-16 h-16 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="absolute inset-0 border-4 border-automotive-gray/20 border-t-automotive-blue rounded-full shadow-[0_0_15px_rgba(0,180,216,0.5)]"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="absolute inset-2 border-4 border-automotive-gray/10 border-b-automotive-green rounded-full opacity-70"
        />
      </div>
      <motion.p 
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        className="mt-6 text-automotive-blue font-mono text-xs uppercase tracking-[0.2em]"
      >
        {message}
      </motion.p>
    </div>
  );
};
`
  }
];

updates.forEach(u => {
  const fullPath = path.join(__dirname, u.path);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, u.content);
});
console.log("Animations updated successfully.");
