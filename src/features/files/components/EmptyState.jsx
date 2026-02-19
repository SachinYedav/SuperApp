import React from 'react';
import { Search, CloudOff } from 'lucide-react';

export default function EmptyState({ filter, searchTerm }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-slate-400 animate-fade-in py-10">
       <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 sm:mb-6">
          {searchTerm ? <Search size={32} className="opacity-30" /> : <CloudOff size={32} className="opacity-30" />}
       </div>
       <h3 className="text-base sm:text-lg font-bold text-slate-600 dark:text-slate-300">
          {searchTerm ? 'No results found' : 'No files in Cloud'}
       </h3>
       <p className="text-xs sm:text-sm opacity-60 mt-2 max-w-xs text-center leading-relaxed">
          {searchTerm 
            ? `We couldn't find anything matching "${searchTerm}".` 
            : `Your ${filter === 'all' ? '' : filter} library is empty.`}
       </p>
    </div>
  );
}