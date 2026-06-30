import React from 'react';
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
           <span className={`w-2 h-2 rounded-full ${isSystemNominal ? 'bg-automotive-green animate-pulse' : 'bg-red-500 animate-pulse'}`}></span>
           <span className={`text-xs font-mono uppercase tracking-widest ${isSystemNominal ? 'text-automotive-green' : 'text-red-500'}`}>{systemStatus}</span>
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
