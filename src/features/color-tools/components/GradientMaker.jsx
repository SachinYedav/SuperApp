import React, { useState } from 'react';
import { Copy } from 'lucide-react';
import useCopy from '@/hooks/useCopy';

export default function GradientMaker() {
  const [c1, setC1] = useState('#4F46E5');
  const [c2, setC2] = useState('#EC4899');
  const [angle, setAngle] = useState(45);
  const { copyToClipboard } = useCopy();

  const css = `background: linear-gradient(${angle}deg, ${c1}, ${c2});`;

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 animate-fade-in">
      {/* Controls */}
      <div className="w-full lg:w-80 space-y-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 h-fit">
         {['Color 1', 'Color 2'].map((label, i) => (
             <div key={i}>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">{label}</label>
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                   <input 
                     type="color" 
                     value={i === 0 ? c1 : c2} 
                     onChange={(e) => i === 0 ? setC1(e.target.value) : setC2(e.target.value)} 
                     className="w-10 h-10 rounded-lg cursor-pointer border-none p-0 bg-transparent"
                   />
                   <span className="font-mono text-sm font-bold text-slate-700 dark:text-slate-200 uppercase flex-1">
                       {i === 0 ? c1 : c2}
                   </span>
                </div>
             </div>
         ))}
         
         <div>
            <label className="text-xs font-bold text-slate-400 uppercase mb-2 flex justify-between">
               <span>Angle</span><span>{angle}°</span>
            </label>
            <input 
              type="range" min="0" max="360" value={angle} 
              onChange={(e) => setAngle(e.target.value)} 
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
         </div>

         <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-xl relative group border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 mb-1 font-bold">CSS Code</p>
            <code className="text-xs text-slate-700 dark:text-slate-300 break-all font-mono block leading-relaxed">{css}</code>
            <button 
               onClick={() => copyToClipboard(css, "CSS Copied")}
               className="absolute top-2 right-2 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:text-blue-500 transition-colors border border-slate-100 dark:border-slate-700"
            >
               <Copy size={14}/>
            </button>
         </div>
      </div>

      {/* Preview */}
      <div className="flex-1 min-h-[300px] rounded-3xl shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-800 relative overflow-hidden" style={{ background: `linear-gradient(${angle}deg, ${c1}, ${c2})` }}>
          <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-md p-8 rounded-3xl border border-white/30 shadow-xl text-center">
                  <h2 className="text-4xl font-black text-white drop-shadow-md mb-2">Gradient Power</h2>
                  <p className="text-white/90 font-medium">Beautiful UI Elements</p>
              </div>
          </div>
      </div>
    </div>
  );
}