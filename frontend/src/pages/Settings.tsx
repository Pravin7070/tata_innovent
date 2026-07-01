import { useState } from 'react';
import { BaseCard } from '../components/ui/BaseCard';
import { User, Shield, Radio, Database, Loader2 } from 'lucide-react';
import { SettingsService } from '../services/api';
import { Toast } from '../components/ui/Toast';

export const Settings = () => {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleReset = async () => {
    setIsResetting(true);
    try {
      const res = await SettingsService.resetSystem();
      setToast({ message: res.message || 'System reset successfully', type: 'success' });
    } catch (e) {
      setToast({ message: 'Failed to reset system', type: 'error' });
    } finally {
      setIsResetting(false);
    }
  };

  const handleDiagnostics = async () => {
    setIsUpdating(true);
    try {
      const res = await SettingsService.runDiagnostics();
      setToast({ message: res.message || 'Diagnostics complete', type: 'info' });
    } catch (e) {
      setToast({ message: 'Failed to run diagnostics', type: 'error' });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <h1 className="text-2xl font-bold uppercase tracking-widest text-automotive-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
        System <span className="text-automotive-blue">Settings</span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BaseCard title="User Profile" icon={User}>
          <div className="flex items-center gap-4 py-4">
            <div className="w-16 h-16 rounded bg-gradient-to-br from-automotive-blue to-automotive-dark flex items-center justify-center text-2xl font-bold">
              TI
            </div>
            <div>
              <p className="font-bold text-automotive-white text-lg">Admin User</p>
              <p className="text-xs text-automotive-gray font-mono">admin@tatainnovent.com</p>
            </div>
          </div>
          <button className="w-full mt-2 bg-automotive-black border border-automotive-gray/30 py-2 rounded text-xs uppercase tracking-widest hover:bg-automotive-gray/10 transition-colors">
            Edit Profile
          </button>
        </BaseCard>
        
        <BaseCard title="Network & Connectivity" icon={Radio}>
          <div className="space-y-4 py-2">
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase text-automotive-gray">Cellular Data</span>
              <div className="w-10 h-5 bg-automotive-blue rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-3 h-3 bg-automotive-white rounded-full"></div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase text-automotive-gray">Telematics Sync</span>
              <div className="w-10 h-5 bg-automotive-blue rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-3 h-3 bg-automotive-white rounded-full"></div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase text-automotive-gray">Offline Mode</span>
              <div className="w-10 h-5 bg-automotive-black border border-automotive-gray/50 rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 w-3 h-3 bg-automotive-gray rounded-full"></div>
              </div>
            </div>
          </div>
        </BaseCard>
  
        <BaseCard title="Data Management" icon={Database}>
          <div className="space-y-4 py-2">
            <div>
              <div className="flex justify-between text-xs text-automotive-gray mb-1 uppercase">
                <span>Local Storage</span>
                <span>45GB / 256GB</span>
              </div>
              <div className="h-1.5 w-full bg-automotive-black rounded-full overflow-hidden">
                <div className="h-full bg-automotive-blue" style={{ width: '18%' }}></div>
              </div>
            </div>
            <button 
              onClick={() => setToast({ message: 'Cache cleared successfully', type: 'success' })}
              className="w-full bg-automotive-black border border-red-500/30 text-red-400 py-2 rounded text-xs uppercase tracking-widest hover:bg-red-500/10 transition-colors mt-4"
            >
              Clear Cache
            </button>
          </div>
        </BaseCard>
        
        <BaseCard title="Security" icon={Shield} className="md:col-span-2 lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-2">
            <div>
              <p className="text-xs uppercase text-automotive-gray mb-1">API Key</p>
              <div className="flex gap-2">
                <input type="password" value="************************" readOnly className="flex-1 bg-automotive-black border border-automotive-gray/30 rounded px-3 py-2 text-xs text-automotive-gray outline-none" />
                <button 
                  onClick={() => setToast({ message: 'API Key copied to clipboard', type: 'info' })}
                  className="bg-automotive-blue/20 text-automotive-blue px-3 py-2 rounded border border-automotive-blue/30 hover:bg-automotive-blue/40 transition-colors text-xs uppercase font-bold"
                >
                  Reveal
                </button>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase text-automotive-gray mb-1">Diagnostics & Updates</p>
              <button 
                onClick={handleDiagnostics}
                disabled={isUpdating}
                className="w-full bg-automotive-green/10 text-automotive-green border border-automotive-green/30 px-3 py-2 rounded hover:bg-automotive-green/20 transition-colors text-xs uppercase font-bold text-left flex justify-between items-center disabled:opacity-50"
              >
                <span className="flex items-center gap-2">
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Run Diagnostics
                </span>
                <span className="bg-automotive-green text-automotive-black px-1.5 py-0.5 rounded text-[10px]">v1.0.42</span>
              </button>
            </div>
            <div>
              <p className="text-xs uppercase text-automotive-gray mb-1">System Reset</p>
              <button 
                onClick={handleReset}
                disabled={isResetting}
                className="w-full bg-red-500/10 text-red-500 border border-red-500/30 px-3 py-2 rounded flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors text-xs uppercase font-bold disabled:opacity-50"
              >
                {isResetting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Factory Reset
              </button>
            </div>
          </div>
        </BaseCard>
      </div>
      <Toast 
        isVisible={!!toast} 
        message={toast?.message || ''} 
        type={toast?.type || 'info'} 
        onClose={() => setToast(null)} 
      />
    </div>
  );
};
