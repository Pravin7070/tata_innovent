import React, { useRef } from 'react';
import { UploadCloud } from 'lucide-react';

export interface VideoUploaderProps {
  onUpload: (file: File) => void;
  isUploading?: boolean;
}

export const VideoUploader = ({ onUpload, isUploading = false }: VideoUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="flex gap-2 w-full">
      <input 
        type="file" 
        accept="video/*" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <button 
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="flex-1 flex items-center justify-center gap-2 bg-automotive-blue/10 hover:bg-automotive-blue/20 text-automotive-blue border border-automotive-blue/30 py-2.5 rounded text-xs tracking-widest uppercase transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <UploadCloud className="w-4 h-4" />
        {isUploading ? 'Uploading...' : 'Upload Video'}
      </button>
    </div>
  );
};
