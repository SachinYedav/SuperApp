import React from 'react';
import { cn } from '@/utils/cn'; 

export default function SectionHeader({ label, icon: Icon, color = "text-slate-500 dark:text-slate-400", className }) {
  return (
    <h3 className={cn("text-sm font-bold uppercase tracking-wider mb-3 px-1 flex items-center gap-2", color, className)}>
      {Icon && <Icon size={14} />}
      {label}
    </h3>
  );
}