import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Copy, Download, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const JSONInspector: React.FC = () => {
  const { lastJsonSent } = useSimulation();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(lastJsonSent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([lastJsonSent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payload_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Basic syntax highlighting with Tailwind
  const highlightJson = (jsonStr: string) => {
    if (jsonStr === '{}') return <span className="text-slate-500">{`{}`}</span>;
    
    // Very basic highlighting logic for this specific mock UI
    const formatted = jsonStr
      .replace(/"([^"]+)":/g, '<span class="text-[#00b4d8]">"$1"</span>:')
      .replace(/: "([^"]+)"/g, ': <span class="text-amber-300">"$1"</span>')
      .replace(/: ([0-9.]+)/g, ': <span class="text-purple-400">$1</span>');

    return <div dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  return (
    <div className="bg-[#0a0d14]/80 backdrop-blur-md border border-white/5 rounded-lg flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between p-3 border-b border-white/5 bg-black/40">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Outgoing Payload</span>
          <span className="flex items-center gap-1 text-[9px] text-[#00d86a] bg-[#00d86a]/10 px-1.5 py-0.5 rounded">
            <CheckCircle2 size={10} /> Valid
          </span>
        </div>
        <div className="flex gap-2 text-slate-400">
          <button onClick={handleCopy} className="hover:text-white transition-colors" title="Copy JSON">
            <Copy size={14} />
          </button>
          <button onClick={handleDownload} className="hover:text-white transition-colors" title="Download JSON">
            <Download size={14} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 p-3 overflow-auto text-[11px] font-['Share_Tech_Mono'] leading-relaxed bg-[#050608]/50">
        {highlightJson(lastJsonSent)}
      </div>
      
      {copied && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0 }}
          className="absolute bottom-4 right-4 bg-[#00b4d8] text-black text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider"
        >
          Copied!
        </motion.div>
      )}
    </div>
  );
};
