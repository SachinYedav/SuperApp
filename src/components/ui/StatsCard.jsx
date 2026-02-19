import React from 'react';
import { cn } from '@/utils/cn';

export default function StatsCard({ 
  title, 
  icon: Icon, 
  value, 
  subValue, 
  progress = 0, 
  variant = 'blue', // blue | purple | green
  footerIcon: FooterIcon,
  footerText,
  className 
}) {
  
  // Theme Variants
  const variants = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600',
      bar: 'from-blue-500 to-cyan-400'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600',
      bar: 'from-purple-500 to-pink-500'
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20 text-green-600',
      bar: 'from-green-500 to-emerald-400'
    }
  };

  const theme = variants[variant] || variants.blue;

  return (
    <div className={cn("bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group", className)}>
        
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
            <div className={cn("p-2.5 rounded-xl", theme.bg)}>
                {Icon && <Icon size={20} />}
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{title}</span>
        </div>
        
        {/* Values */}
        <div className="mb-1">
            <span className="text-2xl font-bold text-slate-800 dark:text-white">
                {value}
            </span>
            {subValue && <span className="text-sm text-slate-400 ml-1">{subValue}</span>}
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
            <div 
                className={cn("h-full bg-gradient-to-r transition-all duration-1000", theme.bar)}
                style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
        </div>

        {/* Footer */}
        {(FooterIcon || footerText) && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
                {FooterIcon && <FooterIcon size={12}/>}
                <span>{footerText}</span>
            </div>
        )}
    </div>
  );
}