import React from 'react';

export default function Toggle({ label, desc, checked, onChange }) {
  return (
    <div 
      className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
      onClick={() => onChange(!checked)}
    >
       <div>
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">{label}</h4>
          {desc && <p className="text-xs text-slate-400">{desc}</p>}
       </div>
       <div className={`w-11 h-6 rounded-full transition-colors relative ${checked ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'}`}>
          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${checked ? 'left-6' : 'left-1'}`}></div>
       </div>
    </div>
  );
}