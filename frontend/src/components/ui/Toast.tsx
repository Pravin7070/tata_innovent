import React, { useEffect } from 'react';
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
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border ${border} ${bg} backdrop-blur-md shadow-lg min-w-[300px] animate-in slide-in-from-bottom-5`}>
      <Icon className={`w-5 h-5 ${color}`} />
      <p className="flex-1 text-sm font-medium text-automotive-white">{message}</p>
      <button onClick={onClose} className="text-automotive-gray hover:text-automotive-white transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
