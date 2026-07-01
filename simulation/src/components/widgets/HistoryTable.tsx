import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { cn } from '../../lib/utils';
import { Trash2 } from 'lucide-react';

export const HistoryTable: React.FC = () => {
  const { history, clearHistory } = useSimulation();

  return (
    <div className="bg-[#0a0d14]/80 backdrop-blur-md border border-white/5 rounded-lg flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between p-3 border-b border-white/5 bg-black/40">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Detection & Command Log</span>
        <button 
          onClick={clearHistory}
          className="text-slate-500 hover:text-rose-500 transition-colors"
          title="Clear History"
        >
          <Trash2 size={12} />
        </button>
      </div>
      
      <div className="flex-1 overflow-auto">
        <table className="w-full text-[10px] text-left">
          <thead className="text-[9px] uppercase tracking-wider text-slate-500 bg-[#050608]/50 sticky top-0">
            <tr>
              <th className="px-3 py-2 font-medium">Time</th>
              <th className="px-3 py-2 font-medium">Terrain</th>
              <th className="px-3 py-2 font-medium">Conf</th>
              <th className="px-3 py-2 font-medium">Cmd</th>
              <th className="px-3 py-2 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono">
            {history.map((event) => (
              <tr key={event.id} className="hover:bg-white/5 transition-colors">
                <td className="px-3 py-2 text-slate-400">{event.time}</td>
                <td className="px-3 py-2 text-white">{event.terrain}</td>
                <td className="px-3 py-2 text-[#00b4d8]">{event.confidence}%</td>
                <td className="px-3 py-2 text-white">{event.command}</td>
                <td className={cn(
                  "px-3 py-2 text-right",
                  event.status === 'Executed' ? "text-[#00d86a]" : "text-amber-400"
                )}>
                  {event.status}
                </td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-slate-600 font-sans italic">
                  No events logged
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
