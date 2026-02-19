import React from 'react';
import { Download, Trash2, Image as ImageIcon, Video, Music, File } from 'lucide-react';
import { formatSize } from '../utils';

export default function FileCard({ file, onDelete }) {
  const getIcon = (type) => {
    if (type.startsWith('image/')) return <ImageIcon className="text-blue-500 w-8 h-8" />;
    if (type.startsWith('video/')) return <Video className="text-purple-500 w-8 h-8" />;
    if (type.startsWith('audio/')) return <Music className="text-pink-500 w-8 h-8" />;
    return <File className="text-slate-500 w-8 h-8" />;
  };

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all relative animate-fade-in-up flex flex-col h-full">
       
       {/* Thumbnail / Icon Area */}
       <div className="aspect-square bg-slate-50 dark:bg-slate-800 rounded-xl mb-3 flex items-center justify-center overflow-hidden relative">
          {file.type.startsWith('image/') ? (
            <img 
                src={file.url} 
                alt={file.name} 
                loading="lazy" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            />
          ) : (
            <div className="opacity-80 transition-transform group-hover:scale-110">
                {getIcon(file.type)}
            </div>
          )}
          
          {/* Hover Actions Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
             <a 
                href={file.url} 
                download={file.name} 
                target="_blank" 
                rel="noreferrer" 
                className="p-2 bg-white text-blue-600 rounded-full hover:scale-110 transition-transform shadow-lg"
                title="Download"
             >
                <Download size={16} />
             </a>
             <button 
                onClick={(e) => { e.stopPropagation(); onDelete(); }} 
                className="p-2 bg-white text-red-500 rounded-full hover:scale-110 transition-transform shadow-lg"
                title="Delete"
             >
                <Trash2 size={16} />
             </button>
          </div>
       </div>

       {/* File Info */}
       <div className="mt-auto px-1">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate" title={file.name}>
            {file.name}
          </h3>
          <div className="flex justify-between items-center mt-1.5 border-t border-slate-100 dark:border-slate-800 pt-2">
             <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                {formatSize(file.size)}
             </span>
             <span className="text-[10px] text-slate-400">
                {new Date(file.$createdAt).toLocaleDateString()}
             </span>
          </div>
       </div>
    </div>
  );
}