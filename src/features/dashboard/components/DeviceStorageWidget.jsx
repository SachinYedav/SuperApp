import React from 'react';
import { Smartphone, Database } from 'lucide-react';
import { formatSize } from '../utils';

export default function DeviceStorageWidget({ storage, compact = false }) {
  // Styles Configuration
  const styles = {
    container: compact 
      ? "bg-slate-50 dark:bg-slate-800 rounded-xl p-3 border border-slate-100 dark:border-slate-700" 
      : "bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm",
    
    headerText: compact ? "text-xs" : "text-base",
    iconSize: compact ? 14 : 18,
    badge: compact ? "text-[9px] px-1.5 py-0.5" : "text-[10px] px-2 py-0.5",
    
    numberMain: compact ? "text-sm font-bold" : "text-2xl font-bold",
    numberSub: compact ? "text-[10px]" : "text-xs",
    
    footerText: compact ? "text-[9px]" : "text-[10px]",
    footerIcon: compact ? 10 : 12
  };

  // Safety check if storage prop is missing
  const safeStorage = storage || { used: 0, quota: 0, percent: 0 };

  return (
    <div className={styles.container}>
      
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h3 className={`font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 ${styles.headerText}`}>
          <Smartphone size={styles.iconSize} className="text-green-500" /> 
          {compact ? "Local Storage" : "Device Storage"}
        </h3>
        <span className={`bg-green-100 text-green-700 rounded-full font-bold ${styles.badge}`}>
          Local
        </span>
      </div>

      {/* Usage Stats */}
      <div className="flex items-end gap-1 mb-2">
        <span className={`text-slate-800 dark:text-white ${styles.numberMain}`}>
          {formatSize(safeStorage.used)}
        </span>
        <span className={`text-slate-400 mb-0.5 ${styles.numberSub}`}>
           / {formatSize(safeStorage.quota)}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${safeStorage.percent > 90 ? 'bg-red-500' : 'bg-blue-500'}`} 
          style={{ width: `${safeStorage.percent}%` }}
        ></div>
      </div>

      {/* Footer */}
      <p className={`text-slate-400 mt-2 flex items-center gap-1 truncate ${styles.footerText}`}>
        <Database size={styles.footerIcon} className="shrink-0"/> 
        Browser Cache & IndexedDB
      </p>
    </div>
  );
}