import React, { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { dateDiff } from '../utils/mathUtils';

export default function DateApp() {
  const [d1, setD1] = useState(new Date().toISOString().split('T')[0]);
  const [d2, setD2] = useState(new Date().toISOString().split('T')[0]);
  const [diff, setDiff] = useState(null);

  const calculate = () => {
    setDiff(dateDiff(d1, d2));
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 border border-slate-200 dark:border-slate-800 animate-fade-in">
      <h3 className="text-lg font-bold mb-6 text-slate-700 dark:text-white flex items-center gap-2">
          <Calendar className="text-orange-500"/> Date Difference
      </h3>
      
      <div className="space-y-6 mb-8">
        <div className="relative group">
           <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Start Date</label>
           <input type="date" value={d1} onChange={(e) => setD1(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none border-2 border-transparent focus:border-orange-500 transition-colors text-slate-700 dark:text-slate-200 font-bold" />
        </div>
        <div className="relative group">
           <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">End Date</label>
           <input type="date" value={d2} onChange={(e) => setD2(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none border-2 border-transparent focus:border-orange-500 transition-colors text-slate-700 dark:text-slate-200 font-bold" />
        </div>
      </div>

      <button onClick={calculate} className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-500/30 transition-all active:scale-95 flex justify-center items-center gap-2">
        <Clock size={18}/> Calculate Duration
      </button>

      {diff && (
        <div className="mt-8 bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl text-center border border-slate-100 dark:border-slate-800 animate-scale-in">
           <div className="flex flex-col items-center justify-center mb-4">
               <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                   {diff.totalDays}
               </span>
               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Total Days</span>
           </div>
           
           <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
             <div className="bg-white dark:bg-slate-900 p-2 rounded-lg shadow-sm">
                 <div className="text-lg font-bold text-slate-700 dark:text-white">{diff.years}</div>
                 <div className="text-[10px] text-slate-400 uppercase">Years</div>
             </div>
             <div className="bg-white dark:bg-slate-900 p-2 rounded-lg shadow-sm">
                 <div className="text-lg font-bold text-slate-700 dark:text-white">{diff.months}</div>
                 <div className="text-[10px] text-slate-400 uppercase">Months</div>
             </div>
             <div className="bg-white dark:bg-slate-900 p-2 rounded-lg shadow-sm">
                 <div className="text-lg font-bold text-slate-700 dark:text-white">{diff.days}</div>
                 <div className="text-[10px] text-slate-400 uppercase">Days</div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}