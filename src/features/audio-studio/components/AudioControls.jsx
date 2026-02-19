import React from 'react';
import { Play, Pause, ZoomIn, ZoomOut } from 'lucide-react';

export default function AudioControls({ isPlaying, onPlayPause, onZoom, zoom, currentTime, duration, fileName, disabled }) {
    
    const formatTime = (seconds) => {
        if(!seconds) return "00:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-wrap sm:flex-nowrap justify-between items-center gap-4">
            
            {/* Playback & Info */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
                <button 
                    onClick={onPlayPause} 
                    disabled={disabled}
                    className="flex-none w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95"
                >
                    {isPlaying ? <Pause size={24} fill="currentColor"/> : <Play size={24} fill="currentColor" className="ml-1"/>}
                </button>
                
                <div className="flex flex-col min-w-0">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white truncate hidden sm:block">
                        {fileName || 'No Audio Selected'}
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-3 py-1 rounded-lg w-fit mt-1">
                        <span className="font-bold">{formatTime(currentTime)}</span>
                        <span className="text-slate-400">/</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 ml-auto sm:ml-0">
                <button onClick={() => onZoom(Math.max(10, zoom - 10))} disabled={disabled} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 active:scale-95">
                    <ZoomOut size={16}/>
                </button>
                <span className="text-[10px] font-bold w-8 text-center text-slate-600 dark:text-slate-300 select-none">
                    {zoom}
                </span>
                <button onClick={() => onZoom(Math.min(200, zoom + 10))} disabled={disabled} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 active:scale-95">
                    <ZoomIn size={16}/>
                </button>
            </div>
        </div>
    );
}