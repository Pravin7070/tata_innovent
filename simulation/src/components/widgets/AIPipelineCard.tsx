import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Cpu, Zap, Activity, CheckCircle, BrainCircuit } from 'lucide-react';
import { cn } from '../../lib/utils';

const steps = [
  { id: 'cam', label: 'Camera', icon: Camera },
  { id: 'yolo', label: 'YOLO', icon: BrainCircuit },
  { id: 'classify', label: 'Terrain', icon: Activity },
  { id: 'decision', label: 'Decision', icon: Zap },
  { id: 'vehicle', label: 'Vehicle', icon: CheckCircle },
];

export const AIPipelineCard: React.FC = () => {
  // Simple animation cycling through steps to simulate active pipeline
  const [activeIdx, setActiveIdx] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % steps.length);
    }, 1500); // Shift every 1.5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#0a0d14]/80 backdrop-blur-md border border-white/5 rounded-lg p-4">
      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-4">AI Pipeline Execution</div>
      
      <div className="flex items-center justify-between relative">
        {/* Connecting line */}
        <div className="absolute top-1/2 left-4 right-4 h-[1px] bg-white/10 -translate-y-1/2 z-0" />
        
        {/* Animated active line segment */}
        <motion.div 
          className="absolute top-1/2 left-4 h-[2px] bg-[#00b4d8] -translate-y-1/2 z-0"
          initial={{ width: 0 }}
          animate={{ 
            width: `${(activeIdx / (steps.length - 1)) * 100}%`,
            transition: { type: 'spring', stiffness: 50, damping: 15 }
          }}
        />

        {steps.map((step, idx) => {
          const isActive = idx === activeIdx;
          const isPast = idx < activeIdx;
          const Icon = step.icon;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
              <motion.div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border",
                  isActive ? "bg-[#00b4d8]/20 border-[#00b4d8] text-[#00b4d8]" : 
                  isPast ? "bg-slate-800/80 border-slate-600 text-slate-400" : 
                  "bg-black/80 border-white/10 text-slate-600"
                )}
                animate={{
                  scale: isActive ? 1.2 : 1,
                  boxShadow: isActive ? "0 0 15px rgba(0, 180, 216, 0.4)" : "none"
                }}
              >
                <Icon size={14} />
              </motion.div>
              <span className={cn(
                "text-[8px] uppercase tracking-widest font-mono font-semibold absolute -bottom-4 whitespace-nowrap",
                isActive ? "text-[#00b4d8]" : "text-slate-500"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="h-4" /> {/* Spacer for labels */}
    </div>
  );
};
