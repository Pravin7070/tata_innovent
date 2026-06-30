
import { BaseCard } from '../components/ui/BaseCard';
import { Car, Battery, Thermometer, Zap } from 'lucide-react';

export const Vehicle = () => (
  <div className="flex flex-col gap-6 animate-in fade-in duration-500">
    <h1 className="text-2xl font-bold uppercase tracking-widest text-automotive-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
      Vehicle <span className="text-automotive-blue">Diagnostics</span>
    </h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <BaseCard title="Battery Health" icon={Battery}>
        <div className="text-center py-4">
          <div className="text-4xl font-mono font-bold text-automotive-green mb-2">94%</div>
          <p className="text-xs text-automotive-gray uppercase tracking-widest">State of Charge</p>
        </div>
        <div className="mt-2 space-y-2 text-xs">
          <div className="flex justify-between"><span className="text-automotive-gray">Voltage:</span><span className="font-mono text-automotive-white">412 V</span></div>
          <div className="flex justify-between"><span className="text-automotive-gray">Current:</span><span className="font-mono text-automotive-white">15 A</span></div>
        </div>
      </BaseCard>
      
      <BaseCard title="Thermal Mgmt" icon={Thermometer}>
        <div className="text-center py-4">
          <div className="text-4xl font-mono font-bold text-automotive-blue mb-2">24°C</div>
          <p className="text-xs text-automotive-gray uppercase tracking-widest">Cabin Temp</p>
        </div>
        <div className="mt-2 space-y-2 text-xs">
          <div className="flex justify-between"><span className="text-automotive-gray">Battery Temp:</span><span className="font-mono text-automotive-white">32°C</span></div>
          <div className="flex justify-between"><span className="text-automotive-gray">Motor Temp:</span><span className="font-mono text-automotive-white">45°C</span></div>
        </div>
      </BaseCard>
      
      <BaseCard title="Powertrain" icon={Zap} className="lg:col-span-2">
        <div className="grid grid-cols-3 gap-4 h-full items-center text-center">
          <div>
            <p className="text-2xl font-mono font-bold text-automotive-white">180<span className="text-sm">kW</span></p>
            <p className="text-[10px] text-automotive-gray uppercase mt-1">Output</p>
          </div>
          <div>
            <p className="text-2xl font-mono font-bold text-automotive-white">350<span className="text-sm">Nm</span></p>
            <p className="text-[10px] text-automotive-gray uppercase mt-1">Torque</p>
          </div>
          <div>
            <p className="text-2xl font-mono font-bold text-automotive-white">12.5<span className="text-sm">kWh/100km</span></p>
            <p className="text-[10px] text-automotive-gray uppercase mt-1">Efficiency</p>
          </div>
        </div>
      </BaseCard>
      
      <BaseCard title="Tire Pressure & Temp" icon={Car} className="lg:col-span-4 min-h-[300px]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center h-full items-center">
          {['Front Left', 'Front Right', 'Rear Left', 'Rear Right'].map((pos, i) => (
            <div key={i} className="p-4 bg-automotive-black/40 border border-automotive-gray/20 rounded flex flex-col items-center">
              <p className="text-xs uppercase tracking-widest text-automotive-gray mb-4">{pos}</p>
              <div className="w-16 h-24 border-2 border-automotive-green rounded-lg mb-4 flex items-center justify-center bg-automotive-green/10">
                <span className="font-mono font-bold">34<span className="text-xs">psi</span></span>
              </div>
              <p className="text-xs font-mono text-automotive-white">Temp: 28°C</p>
            </div>
          ))}
        </div>
      </BaseCard>
    </div>
  </div>
);
