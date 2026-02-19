import React, { useState } from 'react';
import { getContrast } from '../utils/colorUtils';

export default function ContrastChecker() {
  const [bg, setBg] = useState('#FFFFFF');
  const [fg, setFg] = useState('#000000');
  const ratio = getContrast(bg, fg).toFixed(2);
  
  const getRating = (r) => {
    if (r >= 7) return { label: 'AAA (Perfect)', color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/20' };
    if (r >= 4.5) return { label: 'AA (Good)', color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/20' };
    if (r >= 3) return { label: 'AA Large (Okay)', color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/20' };
    return { label: 'Fail (Bad)', color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/20' };
  };

  const rating = getRating(Number(ratio));

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 animate-fade-in">
      <div className="w-full lg:w-80 space-y-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 h-fit">
         {['Background', 'Text Color'].map((label, i) => (
             <div key={i}>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">{label}</label>
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                   <input 
                     type="color" 
                     value={i === 0 ? bg : fg} 
                     onChange={(e) => i === 0 ? setBg(e.target.value) : setFg(e.target.value)} 
                     className="w-10 h-10 rounded-lg cursor-pointer border-none p-0 bg-transparent"
                   />
                   <span className="font-mono text-sm font-bold text-slate-700 dark:text-slate-200 uppercase flex-1">
                       {i === 0 ? bg : fg}
                   </span>
                </div>
             </div>
         ))}
         
         <div className={`p-6 rounded-2xl text-center border-2 border-dashed ${rating.bg} border-transparent`}>
            <div className="text-5xl font-black text-slate-800 dark:text-white mb-1">{ratio}</div>
            <div className={`text-sm font-bold uppercase tracking-wider ${rating.color}`}>{rating.label}</div>
         </div>
         
         <div className="text-xs text-slate-400 leading-relaxed">
            <strong>WCAG Guidelines:</strong><br/>
            4.5:1 for normal text<br/>
            3.0:1 for large text
         </div>
      </div>

      <div className="flex-1 rounded-3xl shadow-xl flex flex-col items-center justify-center gap-6 transition-colors duration-300 border border-slate-200 relative p-8 text-center" style={{ backgroundColor: bg }}>
         <div className="absolute top-4 left-4 opacity-20 text-xs font-mono" style={{ color: fg }}>PREVIEW MODE</div>
         <div>
             <h1 className="text-4xl md:text-6xl font-black mb-2" style={{ color: fg }}>Accessibility</h1>
             <p className="text-lg md:text-xl font-medium opacity-80" style={{ color: fg }}>Make the web readable for everyone.</p>
         </div>
         <div className="flex gap-4">
             <button className="px-8 py-3 rounded-xl font-bold text-sm shadow-lg transition-transform hover:scale-105" style={{ backgroundColor: fg, color: bg }}>
                Primary Button
             </button>
             <button className="px-8 py-3 rounded-xl font-bold text-sm border-2" style={{ borderColor: fg, color: fg }}>
                Outline Button
             </button>
         </div>
         <div className="text-xs opacity-60 mt-8 max-w-md" style={{ color: fg }}>
            This is a sample of small text. It requires a contrast ratio of at least 4.5:1 to be compliant with AA standards.
         </div>
      </div>
    </div>
  );
}