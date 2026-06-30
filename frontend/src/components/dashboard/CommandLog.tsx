
import { Server, CheckCircle2, XCircle } from 'lucide-react';
import { BaseCard } from '../ui/BaseCard';

export interface CommandItem {
  id: string | number;
  time: string;
  command: string;
  status: 'Success' | 'Failed' | 'Pending';
}

export interface CommandLogProps {
  commands: CommandItem[];
}

export const CommandLog = ({ commands }: CommandLogProps) => (
  <BaseCard title="Command Log" icon={Server}>
    <div className="flex flex-col gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
      {commands.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
          <Server className="w-8 h-8 text-automotive-gray/40 mb-2" />
          <p className="text-xs uppercase tracking-widest text-automotive-gray/60 font-semibold">No Commands Logged</p>
          <p className="text-[10px] text-automotive-gray/40 mt-1">Awaiting system instructions.</p>
        </div>
      ) : (
        commands.map((cmd) => (
          <div key={cmd.id} className="flex justify-between items-center p-2 rounded bg-automotive-black/40 border border-automotive-gray/10">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-automotive-gray">{cmd.time}</span>
              <span className="text-xs uppercase font-medium tracking-wide text-automotive-white">{cmd.command}</span>
            </div>
            {cmd.status === 'Success' && <CheckCircle2 className="w-3 h-3 text-automotive-green" />}
            {cmd.status === 'Failed' && <XCircle className="w-3 h-3 text-red-500" />}
            {cmd.status === 'Pending' && <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>}
          </div>
        ))
      )}
    </div>
  </BaseCard>
);
