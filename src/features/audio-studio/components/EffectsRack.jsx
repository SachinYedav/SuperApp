import React from 'react';
import { Zap, Volume2, Gauge } from 'lucide-react';

export default function EffectsRack({ speed, setSpeed, volume, setVolume }) {
  return (
    <div className="space-y-6 animate-fade-in">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Zap size={14}/> Effects Rack
        </h3>

        {/* Playback Speed */}
        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Gauge size={14}/> Speed
                </label>
                <span className="text-xs font-mono bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    {speed}x
                </span>
            </div>
            <input 
                type="range" min="0.5" max="2" step="0.1" 
                value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0.5x</span><span>1.0x</span><span>2.0x</span>
            </div>
        </div>

        {/* Master Volume */}
        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Volume2 size={14}/> Volume
                </label>
                <span className="text-xs font-mono bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    {Math.round(volume * 100)}%
                </span>
            </div>
            <input 
                type="range" min="0" max="1" step="0.05" 
                value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
        </div>
    </div>
  );
}