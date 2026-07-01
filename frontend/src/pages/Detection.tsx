import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { BaseCard } from '../components/ui/BaseCard';
import { Target, Camera, Activity, Box, Loader2 } from 'lucide-react';
import { VideoUploader } from '../components/dashboard/VideoUploader';
import { VideoService } from '../services/api';

export const Detection = () => {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'completed'>('idle');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [detections, setDetections] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [videoId, setVideoId] = useState<number | null>(null);

  const pollInterval = useRef<number | null>(null);

  const handleUpload = async (file: File) => {
    try {
      setStatus('uploading');
      const res = await VideoService.uploadVideo(file);
      setVideoId(res.video_id);
      setVideoUrl(`http://localhost:8000/videos/${res.filename}`);
      setStatus('processing');
    } catch (err) {
      console.error(err);
      setStatus('idle');
    }
  };

  useEffect(() => {
    if (status === 'processing') {
      pollInterval.current = window.setInterval(async () => {
        try {
          const history = await VideoService.getHistory();
          const currentVideo = history.find((v: any) => v.id === videoId);
          if (currentVideo && currentVideo.status === 'completed') {
            setStatus('completed');
            if (pollInterval.current) window.clearInterval(pollInterval.current);
            
            // Fetch actual detections
            const dets = await VideoService.getDetections();
            if (dets && dets.length > 0) {
              const latest = dets[0].result_data;
              if (latest && latest.video_analysis) {
                setMetrics(latest.video_analysis);
                // Group terrains for display
                const counts = latest.video_analysis.mission_summary?.Statistics?.TerrainDetectionCounts || {};
                const mappedDets = Object.keys(counts).map(key => ({
                  obj: key,
                  count: counts[key],
                  color: key === 'Gravel' ? 'bg-automotive-blue' : 'bg-automotive-green'
                }));
                setDetections(mappedDets);
              }
            }
          }
        } catch (e) {
          console.error(e);
        }
      }, 2000);
    }

    return () => {
      if (pollInterval.current) window.clearInterval(pollInterval.current);
    };
  }, [status, videoId]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold uppercase tracking-widest text-automotive-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
          Object <span className="text-automotive-blue">Detection</span>
        </h1>
        <div className="w-64">
          <VideoUploader onUpload={handleUpload} isUploading={status === 'uploading'} />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BaseCard title="Live Inference Feed" icon={Camera} className="lg:col-span-2 min-h-[500px]">
          <div className="flex-1 bg-automotive-black rounded border border-automotive-gray/30 relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,180,216,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,180,216,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            
            {status === 'idle' && (
              <div className="text-automotive-gray font-mono uppercase tracking-widest animate-pulse flex flex-col items-center">
                <Target className="w-12 h-12 mb-4 text-automotive-blue opacity-50" />
                <span>Awaiting Video Stream</span>
              </div>
            )}

            {(status === 'uploading' || status === 'processing') && (
              <div className="text-automotive-gray font-mono uppercase tracking-widest flex flex-col items-center z-10">
                <Loader2 className="w-12 h-12 mb-4 text-automotive-blue animate-spin" />
                <span>{status === 'uploading' ? 'Uploading Video...' : 'AI Engine Processing...'}</span>
              </div>
            )}

            {status === 'completed' && videoUrl && (
              <video 
                src={videoUrl} 
                controls 
                autoPlay 
                loop 
                className="absolute inset-0 w-full h-full object-contain z-10"
              />
            )}
          </div>
        </BaseCard>
        <div className="flex flex-col gap-6">
          <BaseCard title="Detected Objects" icon={Box}>
            <div className="flex flex-col gap-3">
              {status === 'completed' && detections.length > 0 ? (
                detections.map((item, i) => (
                  <div key={i} className="bg-automotive-black/50 p-3 rounded border border-automotive-gray/20">
                    <div className="flex justify-between text-xs uppercase tracking-wider mb-2">
                      <span>{item.obj}</span>
                      <span className="font-mono text-automotive-white">{item.count} detections</span>
                    </div>
                    <div className="h-1 bg-automotive-black rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.1 }}
                        className={`h-full ${item.color}`}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-automotive-gray text-xs uppercase text-center py-4">
                  {status === 'processing' ? 'Processing...' : 'No detections yet'}
                </div>
              )}
            </div>
          </BaseCard>
          <BaseCard title="Model Metrics" icon={Activity}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-automotive-gray uppercase mb-1">Total Frames</p>
                <p className="font-mono text-xl text-automotive-white">{metrics ? metrics.total_frames : '--'}</p>
              </div>
              <div>
                <p className="text-[10px] text-automotive-gray uppercase mb-1">FPS</p>
                <p className="font-mono text-xl text-automotive-white">{metrics ? metrics.fps.toFixed(1) : '--'}</p>
              </div>
              <div>
                <p className="text-[10px] text-automotive-gray uppercase mb-1">Avg Severity</p>
                <p className="font-mono text-sm text-automotive-white mt-1">
                  {metrics?.mission_summary?.Statistics ? metrics.mission_summary.Statistics.OverallAverageSeverity.toFixed(2) : '--'}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-automotive-gray uppercase mb-1">Model Version</p>
                <p className="font-mono text-sm text-automotive-blue mt-1">YOLOv8-Opt</p>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
    </div>
  );
};
