
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
