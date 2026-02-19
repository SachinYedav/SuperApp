import React from 'react';
import { Download, Video, Trash2, Play } from 'lucide-react';

export default function PreviewPlayer({ blob, onSave, onDiscard }) {
  const url = URL.createObjectURL(blob);

  const download = () => {
      const a = document.createElement('a');
      a.href = url;
      a.download = `recording-${Date.now()}.webm`;
      a.click();
  };

  return (
    <div className="w-full h-full flex flex-col relative group">
        <video 
          src={url} 
          controls 
          className="w-full h-full object-contain bg-black"
        />
        
        {/* Overlay Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center gap-4">
            <button onClick={download} className="px-6 py-3 bg-white text-black rounded-xl font-bold flex items-center gap-2 hover:bg-slate-200 transition-colors">
                <Download size={18}/> Download
            </button>
            <button onClick={onSave} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg">
                <Video size={18}/> Save to Library
            </button>
            <button onClick={onDiscard} className="p-3 bg-red-600/80 hover:bg-red-600 text-white rounded-xl transition-colors backdrop-blur-md">
                <Trash2 size={20}/>
            </button>
        </div>
    </div>
  );
}