import { useState, useEffect, useRef } from 'react';
import { BaseCard } from '../components/ui/BaseCard';
import { Target, Camera, Activity, Box, Loader2 } from 'lucide-react';
import { VideoUploader } from '../components/dashboard/VideoUploader';
import { VideoService, StatusService } from '../services/api';

export const Detection = () => {
  const [status, setStatus] = useState<'idle' | 'starting' | 'active'>('idle');
  const [detections, setDetections] = useState<any[]>([]);
  const [edgeStatus, setEdgeStatus] = useState<any>(null);

  const pollInterval = useRef<number | null>(null);

  const handleStartEdge = async (file: File | null) => {
    if (!file) {
      return;
    }

    try {
      setStatus('starting');
      await VideoService.startEdgeInference(file);
      await refreshStatus();
      setStatus('active');
    } catch (err) {
      console.error(err);
      setStatus('idle');
    }
  };

  const refreshStatus = async () => {
    try {
      const data = await StatusService.getEdgeStatus();
      setEdgeStatus(data);
    } catch (err) {
      console.error(err);
    }
  };

  const refreshDetections = async () => {
    try {
      const detectionResponse = await VideoService.getDetections();
      const payload = detectionResponse?.detections;
      if (payload) {
        const items = Array.isArray(payload) ? payload : [payload];
        setDetections(items);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    refreshStatus();
    pollInterval.current = window.setInterval(async () => {
      await refreshStatus();
      if (status === 'active') {
        await refreshDetections();
      }
    }, 3000);

    return () => {
      if (pollInterval.current) window.clearInterval(pollInterval.current);
    };
  }, [status]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold uppercase tracking-widest text-automotive-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
          Object <span className="text-automotive-blue">Detection</span>
        </h1>
        <div className="w-64">
          <VideoUploader onStart={handleStartEdge} isStarting={status === 'starting'} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BaseCard title="Live Inference Feed" icon={Camera} className="lg:col-span-2 min-h-[500px]">
          <div className="flex-1 bg-automotive-black rounded border border-automotive-gray/30 relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,180,216,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,180,216,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

            {status === 'idle' && (
              <div className="text-automotive-gray font-mono uppercase tracking-widest animate-pulse flex flex-col items-center">
                <Target className="w-12 h-12 mb-4 text-automotive-blue opacity-50" />
                <span>Awaiting Edge AI Activation</span>
              </div>
            )}

            {status === 'starting' && (
              <div className="text-automotive-gray font-mono uppercase tracking-widest flex flex-col items-center z-10">
                <Loader2 className="w-12 h-12 mb-4 text-automotive-blue animate-spin" />
                <span>Starting Edge AI...</span>
              </div>
            )}

            {status === 'active' && (
              <div className="text-automotive-white font-mono text-xs uppercase tracking-widest text-center">
                <div className="mb-2">Edge AI is active and running locally.</div>
                <div>{edgeStatus?.edge_status?.model || edgeStatus?.model || 'YOLOv8n'} | {edgeStatus?.edge_status?.device || edgeStatus?.device || 'CPU'} | {edgeStatus?.edge_status?.deployment || edgeStatus?.deployment || 'EDGE READY'}</div>
              </div>
            )}
          </div>
        </BaseCard>

        <div className="flex flex-col gap-6">
          <BaseCard title="Detected Objects" icon={Box}>
            <div className="flex flex-col gap-3">
              {detections.length > 0 ? (
                detections.map((item, i) => (
                  <div key={i} className="bg-automotive-black/50 p-3 rounded border border-automotive-gray/20">
                    <div className="text-sm text-automotive-white font-mono break-words">
                      {typeof item === 'string'
                        ? item
                        : item?.terrain || item?.class || item?.name || JSON.stringify(item).slice(0, 120)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-automotive-gray text-xs uppercase text-center py-4">
                  {status === 'active' ? 'Waiting for detections...' : 'No edge inference data yet'}
                </div>
              )}
            </div>
          </BaseCard>

          <BaseCard title="Edge Status" icon={Activity}>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex justify-between text-xs uppercase tracking-wider">
                <span>Status</span>
                <span className="font-mono text-automotive-white">{status === 'active' ? 'ACTIVE' : status === 'starting' ? 'STARTING' : 'IDLE'}</span>
              </div>
              <div className="flex justify-between text-xs uppercase tracking-wider">
                <span>Inference</span>
                <span className="font-mono text-automotive-white">LOCAL</span>
              </div>
              <div className="flex justify-between text-xs uppercase tracking-wider">
                <span>Model</span>
                <span className="font-mono text-automotive-white">{edgeStatus?.edge_status?.model || edgeStatus?.model || 'YOLOv8n'}</span>
              </div>
              <div className="flex justify-between text-xs uppercase tracking-wider">
                <span>FPS</span>
                <span className="font-mono text-automotive-white">{edgeStatus?.edge_status?.fps || edgeStatus?.fps || 0}</span>
              </div>
              <div className="flex justify-between text-xs uppercase tracking-wider">
                <span>Device</span>
                <span className="font-mono text-automotive-white">{edgeStatus?.edge_status?.device || edgeStatus?.device || 'CPU'}</span>
              </div>
              <div className="flex justify-between text-xs uppercase tracking-wider">
                <span>Deployment</span>
                <span className="font-mono text-automotive-green">{edgeStatus?.edge_status?.deployment || edgeStatus?.deployment || 'EDGE READY'}</span>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
    </div>
  );
};
