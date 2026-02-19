import React, { useState, useMemo } from 'react';
import { transformText, analyzeText } from '../utils/textUtils';
import { Type, ArrowDownUp } from 'lucide-react';

export default function TextUtils() {
  const [input, setInput] = useState('');
  
  const stats = useMemo(() => analyzeText(input), [input]);

  const handleTransform = (type) => {
    setInput(transformText(input, type));
  };

  return (
    <div className="flex flex-col h-full gap-6 animate-fade-in">
       
       {/* Stats Grid */}
       <div className="grid grid-cols-3 gap-3 md:gap-4">
          <StatBox label="Characters" value={stats.chars} color="text-blue-600 dark:text-blue-400" />
          <StatBox label="Words" value={stats.words} color="text-purple-600 dark:text-purple-400" />
          <StatBox label="Lines" value={stats.lines} color="text-emerald-600 dark:text-emerald-400" />
       </div>

       <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden min-h-[400px]">
          {/* Toolbar */}
          <div className="px-2 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 flex flex-wrap gap-2 items-center">
             <div className="px-2 mr-2 text-xs font-bold text-slate-400 uppercase flex items-center gap-2 border-r border-slate-300 dark:border-slate-700 h-6">
                <Type size={14}/> Actions
             </div>
             <ToolBtn onClick={() => handleTransform('upper')} label="UPPER" />
             <ToolBtn onClick={() => handleTransform('lower')} label="lower" />
             <ToolBtn onClick={() => handleTransform('title')} label="Title Case" />
             <ToolBtn onClick={() => handleTransform('slug')} label="slug-case" />
             <ToolBtn onClick={() => handleTransform('reverse')} label="esreveR" icon={<ArrowDownUp size={12}/>} />
             <ToolBtn onClick={() => handleTransform('remove-lines')} label="No Lines" />
          </div>

          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste your text here to analyze and transform..."
            className="flex-1 w-full p-6 bg-transparent border-none outline-none resize-none text-base text-slate-700 dark:text-slate-200 leading-relaxed placeholder:text-slate-400"
            spellCheck="false"
          />
       </div>
    </div>
  );
}

// Sub-components for cleaner code
const StatBox = ({ label, value, color }) => (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
        <div className={`text-2xl font-black ${color}`}>{value.toLocaleString()}</div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{label}</div>
    </div>
);

const ToolBtn = ({ onClick, label, icon }) => (
    <button onClick={onClick} className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 transition-all shadow-sm flex items-center gap-1.5 active:scale-95">
        {icon} {label}
    </button>
);