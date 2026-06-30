import { useState } from 'react';
import { 
  Activity, 
  Cpu, 
  Eye, 
  Zap, 
  Sliders,
  Send,
  Database,
  RefreshCw
} from 'lucide-react';

interface ControlsProps {
  currentCommand: {
    terrain: string;
    drive_mode: string;
    ride_height: string;
    speed: string;
    steering: string;
  };
  onSendCommand: (command: any) => void;
  cameraMode: string;
  onChangeCamera: (mode: string) => void;
  wsStatus: 'connected' | 'disconnected' | 'connecting';
  showFooter: boolean;
  onToggleFooter: () => void;
  logs: string[];
  onClearLogs: () => void;
}

export const Controls = ({
  currentCommand,
  onSendCommand,
  cameraMode,
  onChangeCamera,
  wsStatus,
  showFooter,
  onToggleFooter,
  logs,
  onClearLogs
}: ControlsProps) => {
  const [customSpeed, setCustomSpeed] = useState('Slow');
  const [customSteering, setCustomSteering] = useState('Straight');
  const [customTerrain, setCustomTerrain] = useState('Road');
  const [customDriveMode, setCustomDriveMode] = useState('4WD');
  const [customRideHeight, setCustomRideHeight] = useState('Standard');

  // Trigger custom JSON command
  const triggerCustom = () => {
    onSendCommand({
      terrain: customTerrain,
      drive_mode: customDriveMode,
      ride_height: customRideHeight,
      speed: customSpeed,
      steering: customSteering
    });
  };

  // Quick preset payloads
  const presets = [
    {
      name: 'Off-Road Crawl',
      command: { terrain: 'Stone', drive_mode: '4WD', ride_height: 'Raised', speed: 'Slow', steering: 'Right' }
    },
    {
      name: 'Muddy Descent',
      command: { terrain: 'Mud', drive_mode: '4WD', ride_height: 'Raised', speed: 'Slow', steering: 'Left' }
    },
    {
      name: 'Highway Cruise',
      command: { terrain: 'Road', drive_mode: '2WD', ride_height: 'Low', speed: 'Fast', steering: 'Straight' }
    },
    {
      name: 'Water Crossing',
      command: { terrain: 'Water', drive_mode: 'AWD', ride_height: 'Raised', speed: 'Slow', steering: 'Straight' }
    },
    {
      name: 'Pothole Test',
      command: { terrain: 'Pothole', drive_mode: '4WD', ride_height: 'Standard', speed: 'Medium', steering: 'Straight' }
    }
  ];

  return (
    <div className="hud-layer" style={{ gridTemplateRows: showFooter ? '80px 1fr 200px' : '80px 1fr' }}>
      {/* 1. HEADER HUD */}
      <div className="hud-header glass-panel hud-interactive px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-[#00b4d8]/10 p-2 rounded-lg border border-[#00b4d8]/20">
            <Cpu className="w-6 h-6 text-[#00b4d8] animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-bold uppercase tracking-wider text-[#00b4d8] font-['Orbitron']">
              AI Rover Digital Twin
            </h1>
            <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
              TATA Autonomous Projects &bull; Sim Module
            </p>
          </div>
        </div>

        {/* Network status and camera switches */}
        <div className="flex items-center gap-6">
          {/* WebSocket Status Indicator */}
          <div className="flex items-center gap-2">
            <span className={`pulse-led ${
              wsStatus === 'connected' ? '' : wsStatus === 'connecting' ? 'waiting' : 'disconnected'
            }`} />
            <span className="text-[10px] font-mono uppercase text-slate-400">
              WS: {wsStatus.toUpperCase()}
            </span>
          </div>

          <div className="h-6 w-[1px] bg-slate-800" />

          {/* Toggle Logs/Telemetry Footer Button */}
          <button
            onClick={onToggleFooter}
            className={`tech-button ${showFooter ? 'active' : ''} hud-interactive`}
            title="Toggle Diagnostic Console Logs"
            style={{ padding: '6px 10px' }}
          >
            <Database className="w-3.5 h-3.5" />
            <span className="text-[9px] font-mono tracking-wider">DIAGNOSTICS</span>
          </button>

          <div className="h-6 w-[1px] bg-slate-800" />

          {/* Camera Selectors */}
          <div className="flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-lg border border-white/5">
            {['Chase', 'POV', 'Suspension', 'Orbit'].map(mode => (
              <button
                key={mode}
                onClick={() => onChangeCamera(mode)}
                className={`tech-button ${cameraMode === mode ? 'active' : ''}`}
                style={{ padding: '4px 8px', fontSize: '9px' }}
              >
                <Eye className="w-3 h-3" />
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. SIDEBAR LEFT: REAL-TIME TELEMETRY DIAGNOSTICS */}
      <div className="hud-sidebar-left glass-panel hud-interactive p-4 flex flex-col justify-between">
        <div>
          <div className="tech-header">
            <span>Rover Telemetry</span>
            <Activity className="w-3.5 h-3.5" />
          </div>

          <div className="space-y-4">
            {/* Speedometer */}
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 uppercase mb-1">
                <span>Velocity</span>
                <span className="digital-value green">
                  {currentCommand.speed === 'Stop' ? '0' : currentCommand.speed === 'Slow' ? '15' : currentCommand.speed === 'Medium' ? '45' : currentCommand.speed === 'Fast' ? '90' : '-20'} km/h
                </span>
              </div>
              <div className="bar-container">
                <div 
                  className="bar-fill" 
                  style={{ 
                    width: currentCommand.speed === 'Stop' ? '0%' : currentCommand.speed === 'Slow' ? '20%' : currentCommand.speed === 'Medium' ? '50%' : currentCommand.speed === 'Fast' ? '100%' : '25%',
                    backgroundColor: currentCommand.speed === 'Fast' ? '#ef476f' : '#06d6a0' 
                  }} 
                />
              </div>
            </div>

            {/* Ride Height Meter */}
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 uppercase mb-1">
                <span>Suspension Height</span>
                <span className="digital-value cyan">
                  {currentCommand.ride_height}
                </span>
              </div>
              <div className="bar-container">
                <div 
                  className="bar-fill" 
                  style={{ 
                    width: currentCommand.ride_height === 'Low' ? '25%' : currentCommand.ride_height === 'Standard' ? '60%' : '100%',
                    backgroundColor: '#00b4d8' 
                  }} 
                />
              </div>
            </div>

            {/* Steering Angle */}
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 uppercase mb-1">
                <span>Steering Direction</span>
                <span className={`digital-value ${currentCommand.steering !== 'Straight' ? 'orange' : ''}`}>
                  {currentCommand.steering}
                </span>
              </div>
              <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
                <span className={currentCommand.steering === 'Left' ? 'text-amber-500 font-bold' : ''}>LEFT</span>
                <span className={currentCommand.steering === 'Straight' ? 'text-slate-300 font-bold' : ''}>NEUTRAL</span>
                <span className={currentCommand.steering === 'Right' ? 'text-amber-500 font-bold' : ''}>RIGHT</span>
              </div>
            </div>

            <div className="h-[1px] bg-slate-800/80 my-2" />

            {/* Drive Mode power distributions */}
            <div>
              <div className="text-[10px] text-slate-400 uppercase mb-2 tracking-wider font-semibold">Power Distribution</div>
              <div className="grid grid-cols-2 gap-2 text-[9px] font-mono">
                <div className={`p-2 rounded border ${currentCommand.drive_mode === '2WD' ? 'border-slate-800 bg-slate-950/40 opacity-40' : 'border-[#00b4d8]/20 bg-[#00b4d8]/5 text-[#00b4d8]'}`}>
                  <div>FL WHEEL</div>
                  <div className="font-bold mt-0.5">{currentCommand.drive_mode === '2WD' ? '0%' : currentCommand.drive_mode === 'AWD' ? '25%' : '50%'}</div>
                </div>
                <div className={`p-2 rounded border ${currentCommand.drive_mode === '2WD' ? 'border-slate-800 bg-slate-950/40 opacity-40' : 'border-[#00b4d8]/20 bg-[#00b4d8]/5 text-[#00b4d8]'}`}>
                  <div>FR WHEEL</div>
                  <div className="font-bold mt-0.5">{currentCommand.drive_mode === '2WD' ? '0%' : currentCommand.drive_mode === 'AWD' ? '25%' : '50%'}</div>
                </div>
                <div className="p-2 rounded border border-[#00b4d8]/20 bg-[#00b4d8]/5 text-[#00b4d8]">
                  <div>RL WHEEL</div>
                  <div className="font-bold mt-0.5">{currentCommand.drive_mode === '2WD' ? '50%' : currentCommand.drive_mode === 'AWD' ? '25%' : '50%'}</div>
                </div>
                <div className="p-2 rounded border border-[#00b4d8]/20 bg-[#00b4d8]/5 text-[#00b4d8]">
                  <div>RR WHEEL</div>
                  <div className="font-bold mt-0.5">{currentCommand.drive_mode === '2WD' ? '50%' : currentCommand.drive_mode === 'AWD' ? '25%' : '50%'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chassis details */}
        <div className="mt-4 border-t border-slate-800/80 pt-4 text-[10px] font-mono space-y-1 text-slate-400">
          <div className="flex justify-between">
            <span>CHASSIS MASS</span>
            <span className="text-white">680 KG</span>
          </div>
          <div className="flex justify-between">
            <span>AI ENGINE STATE</span>
            <span className="text-emerald-400">NOMINAL</span>
          </div>
          <div className="flex justify-between">
            <span>BATTERY CELL TEMP</span>
            <span className="text-white">34.6 °C</span>
          </div>
        </div>
      </div>

      {/* 3. SIDEBAR RIGHT: COMMAND SIMULATOR & CONTROL MATRIX */}
      <div className="hud-sidebar-right glass-panel hud-interactive p-4 flex flex-col overflow-y-auto">
        <div className="tech-header">
          <span>Command Simulator</span>
          <Sliders className="w-3.5 h-3.5" />
        </div>

        <div className="space-y-4 flex-1">
          {/* Quick presets */}
          <div>
            <div className="text-[10px] text-slate-400 uppercase mb-1.5 tracking-wider font-semibold">Environment Presets</div>
            <div className="flex flex-col gap-1.5">
              {presets.map(p => (
                <button
                  key={p.name}
                  onClick={() => onSendCommand(p.command)}
                  className="tech-button justify-start text-[10px] py-1.5"
                  style={{ textAlign: 'left' }}
                >
                  <Zap className="w-3 h-3 text-amber-500" />
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[1px] bg-slate-800/80" />

          {/* Manual Controller Inputs */}
          <div className="space-y-2">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Manual Overrides</div>

            {/* Terrain Select */}
            <div>
              <label className="text-[9px] text-slate-400 uppercase block mb-1">Active Terrain</label>
              <select 
                value={customTerrain} 
                onChange={e => setCustomTerrain(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white p-1.5 rounded outline-none"
              >
                {['Road', 'Mud', 'Stone', 'Gravel', 'Bush', 'Water', 'Slope', 'Pothole'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Speed Select */}
            <div>
              <label className="text-[9px] text-slate-400 uppercase block mb-1">Drive Speed</label>
              <select 
                value={customSpeed} 
                onChange={e => setCustomSpeed(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white p-1.5 rounded outline-none"
              >
                {['Stop', 'Slow', 'Medium', 'Fast', 'Reverse'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Steering Select */}
            <div>
              <label className="text-[9px] text-slate-400 uppercase block mb-1">Steering</label>
              <select 
                value={customSteering} 
                onChange={e => setCustomSteering(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white p-1.5 rounded outline-none"
              >
                {['Straight', 'Left', 'Right'].map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* Drive Mode Select */}
            <div>
              <label className="text-[9px] text-slate-400 uppercase block mb-1">Drive Mode</label>
              <select 
                value={customDriveMode} 
                onChange={e => setCustomDriveMode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white p-1.5 rounded outline-none"
              >
                {['4WD', '2WD', 'AWD'].map(dm => (
                  <option key={dm} value={dm}>{dm}</option>
                ))}
              </select>
            </div>

            {/* Ride Height Select */}
            <div>
              <label className="text-[9px] text-slate-400 uppercase block mb-1">Ride Height</label>
              <select 
                value={customRideHeight} 
                onChange={e => setCustomRideHeight(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white p-1.5 rounded outline-none"
              >
                {['Standard', 'Raised', 'Low'].map(rh => (
                  <option key={rh} value={rh}>{rh}</option>
                ))}
              </select>
            </div>

            {/* Trigger Button */}
            <button
              onClick={triggerCustom}
              className="tech-button active w-full py-2 mt-2 flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Send JSON Payload
            </button>
          </div>
        </div>
      </div>

      {/* 4. FOOTER DIAGNOSTIC LOGS & LIVE JSON MONITOR */}
      {showFooter && (
        <div className="hud-footer hud-interactive">
          {/* Left footer console logs */}
          <div className="glass-panel p-4 flex flex-col justify-between overflow-hidden">
            <div className="tech-header">
              <span>Simulation Event Log</span>
              <button 
                onClick={onClearLogs} 
                className="text-[9px] text-slate-500 hover:text-slate-300 font-mono uppercase tracking-wider flex items-center gap-1"
              >
                <RefreshCw className="w-2.5 h-2.5" /> Clear
              </button>
            </div>

            {/* Logs stream */}
            <div className="flex-1 overflow-y-auto font-mono text-[10px] text-slate-300 space-y-1 pr-2">
              {logs.length === 0 ? (
                <div className="text-slate-600 italic">Waiting for incoming telemetry packets...</div>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx} className="border-l-2 border-[#00b4d8]/40 pl-2 leading-relaxed">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right footer live JSON packet visualizer */}
          <div className="glass-panel p-4 flex flex-col">
            <div className="tech-header">
              <span>JSON Telemetry Package</span>
              <Database className="w-3.5 h-3.5 text-[#00b4d8]" />
            </div>
            
            <div className="flex-1 bg-slate-950/80 rounded border border-white/5 p-2 overflow-y-auto">
              <pre className="font-['Share_Tech_Mono'] text-[11px] text-[#00b4d8] leading-tight">
                {JSON.stringify(currentCommand, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
