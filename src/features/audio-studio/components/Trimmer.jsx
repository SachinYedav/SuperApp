import React from 'react';
import { Minus, Plus, Music, BellRing } from 'lucide-react';

export default function Trimmer({ region, duration, onUpdate, onExport }) {
  if (!region) return null;

  const nudge = (type, amount) => {
    let newStart = region.start;
    let newEnd = region.end;
    if (type === 'start') newStart = Math.max(0, Math.min(region.end - 0.1, region.start + amount));
    if (type === 'end') newEnd = Math.min(duration, Math.max(region.start + 0.1, region.end + amount));
    onUpdate(newStart, newEnd);
  };

  const format = (t) => t.toFixed(2) + 's';

  // Helper Component for Time Controls
  const TimeControl = ({ label, value, onMinus, onPlus }) => (
    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-950 p-2 rounded-xl border border-slate-200 dark:border-slate-800 w-full">
        <div className="flex flex-col px-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
            <span className="font-mono font-bold text-slate-800 dark:text-white text-sm sm:text-base">{format(value)}</span>
        </div>
        <div className="flex items-center gap-1">
            <button onClick={onMinus} className="p-2 bg-white dark:bg-slate-800 shadow-sm rounded-lg hover:bg-red-50 text-slate-600 dark:text-slate-300 active:scale-95 border border-slate-200 dark:border-slate-700">
                <Minus size={14}/>
            </button>
            <button onClick={onPlus} className="p-2 bg-white dark:bg-slate-800 shadow-sm rounded-lg hover:bg-green-50 text-slate-600 dark:text-slate-300 active:scale-95 border border-slate-200 dark:border-slate-700">
                <Plus size={14}/>
            </button>
        </div>
    </div>
  );

  return (
    <div className="p-4 pb-6 md:pb-4 w-full max-w-5xl mx-auto animate-slide-up">
       <div className="flex flex-col md:flex-row gap-4">
          
          {/* Controls Grid */}
          <div className="grid grid-cols-2 gap-3 flex-1">
             <TimeControl label="Start" value={region.start} onMinus={() => nudge('start', -0.1)} onPlus={() => nudge('start', 0.1)} />
             <TimeControl label="End" value={region.end} onMinus={() => nudge('end', -0.1)} onPlus={() => nudge('end', 0.1)} />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 md:flex md:w-auto">
             <button onClick={() => onExport(false)} className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex flex-col md:flex-row items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                <Music size={18}/> 
                <span className="text-xs md:text-sm">Save MP3</span>
             </button>
             <button onClick={() => onExport(true)} className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold flex flex-col md:flex-row items-center justify-center gap-2 shadow-lg shadow-purple-500/20 active:scale-95 transition-all">
                <BellRing size={18}/> 
                <span className="text-xs md:text-sm">Ringtone</span>
             </button>
          </div>

       </div>
    </div>
  );
}