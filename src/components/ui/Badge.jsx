import React from 'react';
import { cn } from '@/utils/cn';

export default function Badge({ label, icon: Icon, colorClass, bgClass, className }) {
  
  return (
    <div className={cn("flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-100 dark:border-slate-800", bgClass, className)}>
        {Icon && <Icon size={16} className={colorClass} />}
        <span className={cn("text-xs font-bold", colorClass?.replace('text-', 'text-slate-'))}>
            {label}
        </span>
    </div>
  );
}