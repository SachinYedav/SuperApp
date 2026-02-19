import React from 'react';
import { cn } from '@/utils/cn';

export default function GameContainer({ children, className, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 relative z-10">
        <div className={cn(
            "w-full max-w-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-3xl shadow-2xl p-8 lg:p-12 animate-fade-in relative overflow-hidden",
            className
        )}>
            {/* Top Glow Accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
            
            {/* Header (Optional) */}
            {(title || subtitle) && (
                <div className="text-center mb-8">
                    {title && <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>}
                    {subtitle && <p className="text-slate-400">{subtitle}</p>}
                </div>
            )}

            {children}
        </div>
    </div>
  );
}