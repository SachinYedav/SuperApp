import React from 'react';
import { Search, Loader2, Plus } from 'lucide-react';
import { FILTERS } from '../constants';

export default function MobileHeader({ searchTerm, setSearchTerm, uploading, handleUpload, filter, setFilter }) {
  return (
    <div className="lg:hidden sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl">
        <div className="p-4 flex gap-3 items-center">
            {/* Search Bar */}
            <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all placeholder:text-slate-400"
                />
            </div>
            {/* Mobile Upload Button */}
            <label className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg active:scale-95 transition-transform flex items-center justify-center cursor-pointer min-w-[44px] min-h-[44px]">
                {uploading ? <Loader2 className="animate-spin" size={20}/> : <Plus size={20} strokeWidth={3} />}
                <input type="file" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
        </div>

        {/* Horizontal Filters */}
        <div className="flex overflow-x-auto custom-scrollbar px-3 pb-1 snap-x no-scrollbar">
            {FILTERS.map((item) => (
                <button
                    key={item.id}
                    onClick={() => setFilter(item.id)}
                    className={`flex-none snap-start flex items-center gap-2 px-4 py-3 border-b-[3px] text-sm font-medium transition-colors whitespace-nowrap
                        ${filter === item.id  
                            ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' 
                            : 'border-transparent text-slate-500 dark:text-slate-400'}`}
                    >
                    <item.icon size={16} />
                    {item.label}
                </button>
            ))}
        </div>
    </div>
  );
}