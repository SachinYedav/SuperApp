import React from 'react';

export default function ComingSoonCard({ 
  name, 
  desc, 
  icon: Icon, 
  badgeText = "Planned", 
  color = "text-slate-500" 
}) {
  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-blue-200 dark:hover:border-blue-900/50 cursor-default">
        
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-50 dark:to-slate-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10 flex items-start justify-between mb-3">
            {/* Icon Container  */}
            <div className={`p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 ${color} group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={22} strokeWidth={1.5} />
            </div>

            {/* Status Badge  */}
            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                {badgeText}
            </span>
        </div>

        <div className="relative z-10">
            <h4 className="font-bold text-slate-700 dark:text-slate-200 text-base mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {name}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {desc}
            </p>
        </div>
    </div>
  );
}