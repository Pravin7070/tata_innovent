import React, { useState } from 'react';
import { PlayCircle } from 'lucide-react';

export interface VideoUploaderProps {
  onStart: (file: File | null) => void;
  isStarting?: boolean;
}

export const VideoUploader = ({ onStart, isStarting = false }: VideoUploaderProps) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setVideoFile(file);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="block w-full text-xs text-automotive-white file:border-0 file:bg-automotive-blue/10 file:text-automotive-blue file:px-3 file:py-2 file:rounded file:font-semibold"
      />
      <button
        onClick={() => onStart(videoFile)}
        disabled={!videoFile || isStarting}
        className="flex-1 flex items-center justify-center gap-2 bg-automotive-blue/10 hover:bg-automotive-blue/20 text-automotive-blue border border-automotive-blue/30 py-2.5 rounded text-xs tracking-widest uppercase transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <PlayCircle className="w-4 h-4" />
        {isStarting ? 'Starting Edge AI...' : videoFile ? 'UPLOAD & START EDGE' : 'SELECT VIDEO'}
      </button>
    </div>
  );
};
