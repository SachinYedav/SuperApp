import React from 'react';
import { cn } from '@/utils/cn';

export default function SelectionCard({ label, icon: Icon, isActive, onClick, className }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "p-3 rounded-xl border flex flex-col items-center gap-2 transition-all active:scale-95 w-full",
        isActive 
          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 ring-1 ring-blue-500 text-blue-600 dark:text-blue-400' 
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:border-blue-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800',
        className
      )}
    >
      {Icon && <Icon size={20} />}
      <span className="text-xs font-bold capitalize">{label}</span>
    </button>
  );
}