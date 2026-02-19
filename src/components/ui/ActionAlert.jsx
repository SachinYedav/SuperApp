import React from 'react';
import { AlertTriangle, CheckCircle, Info, X, Settings, ShieldAlert } from 'lucide-react';

const ICONS = {
  success: <CheckCircle className="text-green-500" size={48} />,
  error: <AlertTriangle className="text-red-500" size={48} />,
  info: <Info className="text-blue-500" size={48} />,
  permission: <ShieldAlert className="text-orange-500" size={48} />
};

export default function ActionAlert({ open, type = 'info', title, message, actionLabel, onAction, onClose, secondaryLabel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale-in relative overflow-hidden">
        
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-500/20 to-transparent"></div>

        {/* Close Button */}
        {onClose && (
            <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <X size={18} className="text-slate-500"/>
            </button>
        )}

        <div className="flex flex-col items-center text-center">
          <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-full shadow-inner">
            {ICONS[type] || ICONS.info}
          </div>

          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{title}</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
            {message}
          </p>

          <div className="flex gap-3 w-full">
            {onClose && secondaryLabel && (
                <button 
                    onClick={onClose}
                    className="flex-1 py-3.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
                >
                    {secondaryLabel}
                </button>
            )}
            
            {onAction && (
                <button 
                    onClick={() => { onAction(); if(onClose) onClose(); }}
                    className={`flex-1 py-3.5 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 flex justify-center items-center gap-2
                    ${type === 'error' || type === 'permission' ? 'bg-red-600 hover:bg-red-700 shadow-red-500/30' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'}`}
                >
                    {type === 'permission' && <Settings size={18} />}
                    {actionLabel || 'Okay'}
                </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}