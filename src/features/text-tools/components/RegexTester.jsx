import React, { useState, useMemo } from 'react';
import { testRegex } from '../utils/textUtils';
import { Search, Flag } from 'lucide-react';

export default function RegexTester() {
  const [regex, setRegex] = useState('');
  const [flags, setFlags] = useState('gm');
  const [text, setText] = useState('');

  // Optimized: Regex calculation memoized
  const result = useMemo(() => 
     (regex ? testRegex(regex, text, flags) : null), 
  [regex, text, flags]);

  return (
    <div className="flex flex-col h-full gap-4 animate-fade-in">
       {/* Regex Inputs */}
       <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
             <Search size={16} className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors"/>
             <input 
               value={regex} 
               onChange={e => setRegex(e.target.value)}
               placeholder="Regular Expression (e.g. \w+)"
               className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none font-mono text-sm border-2 border-transparent focus:border-blue-500 transition-all text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
             />
          </div>
          <div className="w-full md:w-32 relative group">
             <Flag size={16} className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-purple-500 transition-colors"/>
             <input 
               value={flags} 
               onChange={e => setFlags(e.target.value)}
               placeholder="Flags"
               className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none font-mono text-sm border-2 border-transparent focus:border-purple-500 transition-all text-center text-slate-700 dark:text-slate-200"
             />
          </div>
       </div>

       {/* Test Area */}
       <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden min-h-[200px]">
          <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-xs font-bold text-slate-400 uppercase ">Test String</div>
          <textarea 
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Paste text here to match against regex..."
            className="flex-1 w-full p-4 bg-transparent border-none outline-none resize-none font-mono text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
          />
       </div>

       {/* Results */}
       <div className="h-40 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 overflow-auto custom-scrollbar relative">
          <div className="sticky top-0 bg-slate-50 dark:bg-slate-950 pb-2 flex justify-between items-center border-b border-slate-200 dark:border-slate-800/50 mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Matches Found</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${result?.matches?.length > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-200 text-slate-500'}`}>
                {result?.matches?.length || 0}
            </span>
          </div>

          {result?.error ? (
             <div className="text-red-500 text-sm font-bold flex items-center gap-2 mt-2">
                <span className="p-1 bg-red-100 rounded text-red-600">Error</span> {result.error}
             </div>
          ) : result?.matches?.length > 0 ? (
             <div className="flex flex-wrap gap-2 mt-2">
                {Array.from(result.matches).map((m, i) => (
                   <span key={i} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg font-mono text-xs border border-blue-200 dark:border-blue-800 select-all cursor-text">
                      {m}
                   </span>
                ))}
             </div>
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm italic opacity-60">
                Start typing to see matches...
             </div>
          )}
       </div>
    </div>
  );
}