import React from 'react';
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
