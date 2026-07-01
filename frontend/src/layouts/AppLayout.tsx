import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Target, Car, BarChart2, Cpu, Map as MapIcon, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Sidebar } from '../components/layout/Sidebar';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';

const menuItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
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
              <ErrorBoundary>
                <Outlet />
              </ErrorBoundary>
            </motion.div>
          </AnimatePresence>
          <Footer />
        </main>
      </div>
    </div>
  );
};
