import React from 'react';
import { Wand2 } from 'lucide-react';

const PRESETS = [
  { name: 'Normal', filter: { brightness: 100, contrast: 100, saturate: 100, blur: 0, grayscale: 0, sepia: 0 } },
  { name: 'Vintage', filter: { sepia: 50, contrast: 120, saturate: 80 } },
  { name: 'B&W', filter: { grayscale: 100, contrast: 110 } },
  { name: 'Warm', filter: { sepia: 30, saturate: 130, brightness: 105 } },
  { name: 'Cold', filter: { saturate: 90, contrast: 110, hueRotate: 180 } },
];

export default function AdjustPanel({ filters, setFilters }) {
  return (
    <div className="space-y-6 animate-fade-in">
       {/* Presets */}
       <div>
          <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-400 uppercase">
             <Wand2 size={12} /> Presets
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
             {PRESETS.map((p) => (
                <button key={p.name} onClick={() => setFilters({ ...filters, ...p.filter })}
                   className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold hover:border-blue-500 hover:text-blue-500 transition-all whitespace-nowrap">
                   {p.name}
                </button>
             ))}
          </div>
       </div>

       {/* Sliders */}
       <div className="space-y-4">
          <div className="text-xs font-bold text-slate-400 uppercase">Fine Tune</div>
          {['brightness', 'contrast', 'saturate', 'blur', 'sepia'].map((key) => (
             <div key={key}>
                <div className="flex justify-between mb-1.5">
                   <label className="text-xs font-bold text-slate-700 dark:text-slate-300 capitalize">{key}</label>
                   <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-blue-600 font-bold">{filters[key]}</span>
                </div>
                <input type="range"
                   min={key === 'blur' ? 0 : 0} max={key === 'blur' ? 20 : 200}
                   value={filters[key]}
                   onChange={(e) => setFilters({ ...filters, [key]: Number(e.target.value) })}
                   className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600" />
             </div>
          ))}
       </div>
    </div>
  );
}