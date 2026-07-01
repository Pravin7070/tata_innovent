import { useRef, useState, useEffect } from 'react';
import { Video, Settings2, Upload } from 'lucide-react';
import { BaseCard } from '../ui/BaseCard';

export interface VideoPlayerProps {
  status: string;
  resolution: string;
  fps: number;
  source: string;
  onSwitchCamera?: () => void;
  onSettingsClick?: () => void;
}

export const VideoPlayer = ({ status, resolution, fps, source, onSwitchCamera, onSettingsClick }: VideoPlayerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    const url = URL.createObjectURL(file);
    setVideoUrl(url);

    const formData = new FormData();
    formData.append('file', file);

    try {
      await fetch('http://localhost:8000/start-inference', {
        method: 'POST',
        body: formData,
      });
      // Assuming a successful start, you might want to show a toast here.
    } catch (error) {
      console.error('Error uploading video:', error);
    }
  };

  return (
  <BaseCard title="LIVE CAMERA FEED" icon={Video} className="h-full flex flex-col">
    <div className="flex-1 bg-automotive-black rounded-lg border border-automotive-gray/30 overflow-hidden relative group aspect-video">
      {videoUrl ? (
        <video 
          src={videoUrl} 
          autoPlay 
          loop 
          muted 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,180,216,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,180,216,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      )}
      
      {/* Overlays */}
      <div className="absolute top-4 left-4 bg-black/80 px-2 py-1 rounded text-[10px] uppercase tracking-wider flex items-center gap-2 border border-automotive-gray/30 text-automotive-white font-mono">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
        {status} | {resolution} | {fps} FPS
      </div>
      
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
        <div className="bg-black/80 px-3 py-1.5 rounded border border-automotive-blue/50 text-automotive-blue text-[10px] uppercase tracking-widest font-mono">
          {source}
        </div>
        <button onClick={onSettingsClick} className="bg-black/60 p-2 rounded-full border border-automotive-gray/30 text-automotive-white hover:bg-automotive-blue hover:border-automotive-blue cursor-pointer transition-colors">
          <Settings2 className="w-4 h-4" />
        </button>
      </div>
      
      {/* Target Crosshair Mock - hide if video playing */}
      {!videoUrl && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-[0.5px] border-automotive-green/30 rounded-full flex items-center justify-center pointer-events-none">
          <div className="w-32 h-32 border-[0.5px] border-automotive-green/20 rounded-full flex items-center justify-center">
             <div className="w-1 h-1 bg-automotive-green rounded-full shadow-[0_0_10px_#39FF14]"></div>
          </div>
          <div className="absolute top-0 w-[1px] h-4 bg-automotive-green/80"></div>
          <div className="absolute bottom-0 w-[1px] h-4 bg-automotive-green/80"></div>
          <div className="absolute left-0 w-4 h-[1px] bg-automotive-green/80"></div>
          <div className="absolute right-0 w-4 h-[1px] bg-automotive-green/80"></div>
        </div>
      )}
    </div>
    
    <div className="mt-4 flex gap-3">
      <input
        type="file"
        accept="video/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <button 
        onClick={handleUploadClick}
        className="flex-1 bg-automotive-blue hover:bg-automotive-blue/80 text-automotive-white border border-automotive-blue py-2.5 rounded text-xs tracking-widest uppercase transition-colors font-bold flex items-center justify-center gap-2"
      >
        <Upload className="w-4 h-4" /> Upload Video
      </button>
      <button 
        onClick={onSwitchCamera}
        className="flex-1 bg-automotive-dark hover:bg-automotive-gray/20 text-automotive-white border border-automotive-gray/30 py-2.5 rounded text-xs tracking-widest uppercase transition-colors font-bold"
      >
        Switch Camera
      </button>
    </div>
  </BaseCard>
  );
};
