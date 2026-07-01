import React from 'react';
import { useSimulation, TerrainType, SpeedType, RideHeightType, DriveModeType, SteeringType } from '../../context/SimulationContext';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { Send, RotateCcw, Cpu } from 'lucide-react';

const terrains: TerrainType[] = ['Road', 'Mud', 'Gravel', 'Stone', 'Bush', 'Water', 'Slope', 'Pothole'];
const speeds: SpeedType[] = ['Stop', 'Slow', 'Medium', 'Fast', 'Reverse'];
const rideHeights: RideHeightType[] = ['Standard', 'Raised', 'Low'];
const driveModes: DriveModeType[] = ['4WD', '2WD', 'AWD'];
const steerings: SteeringType[] = ['Left', 'Straight', 'Right'];

export const CommandPanel: React.FC = () => {
  const { command, setCommand, sendJsonPayload } = useSimulation();
  const [autoMode, setAutoMode] = React.useState(false);

  // Local state to build command before sending
  const [draft, setDraft] = React.useState({ ...command });

  // Update draft if command changes externally
  React.useEffect(() => {
    setDraft({ ...command });
  }, [command]);

  const handleSend = () => {
    sendJsonPayload(draft);
  };

  const handleReset = () => {
    const resetCommand = {
      terrain: 'Road' as TerrainType,
      drive_mode: '4WD' as DriveModeType,
      ride_height: 'Standard' as RideHeightType,
      speed: 'Stop' as SpeedType,
      steering: 'Straight' as SteeringType,
    };
    setDraft(resetCommand);
    sendJsonPayload(resetCommand);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Auto / Manual Toggle */}
      <div className="flex gap-2">
        <button 
          onClick={() => setAutoMode(true)}
          className={cn(
            "flex-1 py-2 text-[10px] uppercase font-bold tracking-widest rounded flex items-center justify-center gap-2 transition-all",
            autoMode ? "bg-[#00b4d8] text-[#050608]" : "bg-white/5 text-slate-400 hover:bg-white/10"
          )}
        >
          <Cpu size={14} /> AI Auto
        </button>
        <button 
          onClick={() => setAutoMode(false)}
          className={cn(
            "flex-1 py-2 text-[10px] uppercase font-bold tracking-widest rounded flex items-center justify-center gap-2 transition-all",
            !autoMode ? "bg-amber-400 text-[#050608]" : "bg-white/5 text-slate-400 hover:bg-white/10"
          )}
        >
           Manual Override
        </button>
      </div>

      <div className={cn("flex flex-col gap-4", autoMode && "opacity-50 pointer-events-none")}>
        {/* Terrain Presets Grid */}
        <div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-2">Simulate Terrain</div>
          <div className="grid grid-cols-4 gap-2">
            {terrains.map(t => (
              <button
                key={t}
                onClick={() => setDraft({ ...draft, terrain: t })}
                className={cn(
                  "py-1.5 px-2 text-[9px] uppercase tracking-wider font-semibold rounded border transition-all",
                  draft.terrain === t 
                    ? "bg-[#00b4d8]/20 border-[#00b4d8] text-[#00b4d8]" 
                    : "bg-black/40 border-white/5 text-slate-400 hover:bg-white/5"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Speed Slider / Selector */}
        <div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-2">Drive Speed</div>
          <div className="flex gap-1 bg-black/40 p-1 rounded border border-white/5">
            {speeds.map(s => (
              <button
                key={s}
                onClick={() => setDraft({ ...draft, speed: s })}
                className={cn(
                  "flex-1 py-1 text-[10px] uppercase font-semibold rounded",
                  draft.speed === s ? "bg-[#2b2d31] text-white" : "text-slate-500 hover:text-slate-300"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Steering */}
        <div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-2">Steering</div>
          <div className="flex gap-1 bg-black/40 p-1 rounded border border-white/5">
            {steerings.map(s => (
              <button
                key={s}
                onClick={() => setDraft({ ...draft, steering: s })}
                className={cn(
                  "flex-1 py-1 text-[10px] uppercase font-semibold rounded",
                  draft.steering === s ? "bg-[#2b2d31] text-white" : "text-slate-500 hover:text-slate-300"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Drive Mode & Ride Height Toggles */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-2">Drive Mode</div>
            <div className="flex flex-col gap-1">
              {driveModes.map(d => (
                <button
                  key={d}
                  onClick={() => setDraft({ ...draft, drive_mode: d })}
                  className={cn(
                    "text-left px-3 py-1.5 text-[10px] uppercase font-semibold rounded border",
                    draft.drive_mode === d ? "bg-[#00b4d8]/10 border-[#00b4d8]/50 text-white" : "bg-black/40 border-transparent text-slate-500 hover:bg-white/5"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-2">Ride Height</div>
            <div className="flex flex-col gap-1">
              {rideHeights.map(r => (
                <button
                  key={r}
                  onClick={() => setDraft({ ...draft, ride_height: r })}
                  className={cn(
                    "text-left px-3 py-1.5 text-[10px] uppercase font-semibold rounded border",
                    draft.ride_height === r ? "bg-[#00b4d8]/10 border-[#00b4d8]/50 text-white" : "bg-black/40 border-transparent text-slate-500 hover:bg-white/5"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
        <button 
          onClick={handleReset}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-[10px] uppercase font-bold tracking-widest rounded flex items-center justify-center gap-2 transition-all"
        >
          <RotateCcw size={14} /> Reset
        </button>
        <button 
          onClick={handleSend}
          className="flex-1 py-2 bg-[#00b4d8] hover:bg-[#00b4d8]/80 text-[#050608] text-[10px] uppercase font-bold tracking-widest rounded flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(0,180,216,0.3)]"
        >
          <Send size={14} /> Send Payload
        </button>
      </div>
    </div>
  );
};
