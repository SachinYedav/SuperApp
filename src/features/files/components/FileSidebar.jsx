import React from 'react';
import { HardDrive, Upload, Loader2, WifiOff } from 'lucide-react'; 
import { FILTERS } from '../constants'; 
import { formatSize } from '../utils';

export default function FileSidebar({ filter, setFilter, handleUpload, uploading, totalUsage, isOnline = true }) {isOnline
  const percentage = Math.min((totalUsage / (10 * 1024 * 1024 * 1024)) * 100, 100);

  return (
    <div className="hidden lg:flex lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 flex-col shadow-sm h-full overflow-hidden">
      
      {/* Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-1">
            <HardDrive className="text-blue-600" /> Cloud Drive
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 ml-8">Secure & Encrypted Storage</p>
      </div>
      
      {/* Upload Button (OFFLINE AWARE) */}
      <div className="p-6 pb-0">
          <label 
            className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all 
            ${!isOnline 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-2 border-dashed border-slate-300 shadow-none' // Offline Style
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 cursor-pointer active:scale-95' // Online Style
            }
            ${uploading ? 'opacity-70 pointer-events-none' : ''}`}
          >
            {/* Logic: Loading -> Offline -> Normal */}
            {uploading ? (
                <Loader2 className="animate-spin" size={20}/>
            ) : !isOnline ? (
                <WifiOff size={20} />
            ) : (
                <Upload size={20} />
            )}
            
            <span>
                {uploading ? 'Uploading...' : !isOnline ? 'Offline Mode' : 'Upload New File'}
            </span>

            {/* Input disabled if offline */}
            <input type="file" multiple className="hidden" onChange={handleUpload} disabled={!isOnline || uploading} />
          </label>
          
          {!isOnline && (
            <p className="text-[10px] text-center text-red-400 mt-2 font-medium">Connect to internet to upload</p>
          )}
      </div>

      {/* Navigation Library */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
         <p className="text-xs font-bold text-slate-400 uppercase mb-3 px-2 tracking-wider">Library</p>
         <div className="space-y-1">
            {FILTERS.map(item => (
                <button 
                   key={item.id} 
                   onClick={() => setFilter(item.id)} 
                   className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left
                   ${filter === item.id 
                       ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                       : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                <item.icon size={18} className={filter === item.id ? 'text-blue-500' : 'opacity-70'}/> 
                {item.label}
                </button>
            ))}
         </div>
      </div>

      {/* Storage Widget (Bottom) */}
      <div className="p-6 mt-auto bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
         <div className="flex justify-between text-xs mb-2">
            <span className="font-bold text-slate-700 dark:text-slate-300">Cloud Used</span>
            <span className="text-slate-500 font-mono">{formatSize(totalUsage)}</span>
         </div>
         <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
            <div 
               className={`h-full transition-all duration-1000 ease-out ${!isOnline ? 'bg-slate-400 grayscale' : 'bg-gradient-to-r from-blue-500 to-purple-500'}`}
               style={{ width: `${percentage}%` }}
            ></div>
         </div>
         <p className="text-[10px] text-slate-400 text-center">10 GB Free Tier Plan</p>
      </div>
    </div>
  );
}