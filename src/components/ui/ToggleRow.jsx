import React from 'react';
import { cn } from '@/utils/cn';

export default function ToggleRow({ label, desc, checked, onChange, icon: Icon, className }) {
  return (
    <div 
      className={cn(
        "p-3.5 sm:p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group",
        className
      )} 
      onClick={() => onChange(!checked)}
    >
      <div className="flex items-center gap-3.5">
        {Icon && (
          <div className={cn(
            "p-1.5 rounded-lg transition-colors",
            checked ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
          )}>
            <Icon size={18} />
          </div>
        )}
        
        <div className="flex flex-col">
          <h4 className="font-semibold text-slate-700 dark:text-slate-200 text-sm group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
            {label}
          </h4>
          {desc && <p className="text-[11px] text-slate-500 leading-tight">{desc}</p>}
        </div>
      </div>

      {/* Switch UI */}
      <div className={cn(
        "pointer-events-none w-10 h-5 rounded-full p-0.5 transition-colors duration-300 flex-shrink-0",
        checked ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
      )}>
        <div className={cn(
          "w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300",
          checked ? 'translate-x-5' : 'translate-x-0'
        )} />
      </div>
    </div>
  );
}