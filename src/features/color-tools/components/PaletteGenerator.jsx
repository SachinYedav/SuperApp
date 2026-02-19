import React, { useState, useEffect } from 'react';
import { RefreshCw, Lock, Unlock, Copy } from 'lucide-react';
import { getRandomColor } from '../utils/colorUtils';
import useCopy from '@/hooks/useCopy';

export default function PaletteGenerator() {
  const [colors, setColors] = useState([
    { hex: '#FF5733', locked: false },
    { hex: '#33FF57', locked: false },
    { hex: '#3357FF', locked: false },
    { hex: '#F333FF', locked: false },
    { hex: '#33FFF5', locked: false },
  ]);
  
  const { copyToClipboard } = useCopy();

  const generate = () => {
    setColors(colors.map(c => c.locked ? c : { ...c, hex: getRandomColor().toUpperCase() }));
  };

  const toggleLock = (index) => {
    const newColors = [...colors];
    newColors[index].locked = !newColors[index].locked;
    setColors(newColors);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        generate();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [colors]);

  return (
    <div className="h-full flex flex-col animate-fade-in">
      <div className="flex justify-between items-center mb-4">
         <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider hidden sm:block">Press Spacebar to Generate</h3>
         <button onClick={generate} className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 active:scale-95 transition-all">
            <RefreshCw size={16}/> Randomize
         </button>
      </div>
      
      <div className="flex-1 flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
         {colors.map((color, i) => (
            <div key={i} className="flex-1 flex flex-row md:flex-col items-center justify-between md:justify-center p-4 md:p-0 relative group transition-all duration-300" style={{ backgroundColor: color.hex }}>
               
               <div className="md:opacity-0 md:group-hover:opacity-100 md:translate-y-4 md:group-hover:translate-y-0 transition-all duration-300 flex md:flex-col items-center gap-2 md:mb-2 bg-black/20 backdrop-blur-md p-2 rounded-xl">
                  <button onClick={() => toggleLock(i)} className="p-2 hover:bg-white/20 rounded-full text-white transition-colors">
                     {color.locked ? <Lock size={18}/> : <Unlock size={18}/>}
                  </button>
                  <button onClick={() => copyToClipboard(color.hex, "Color Copied")} className="p-2 hover:bg-white/20 rounded-full text-white transition-colors">
                     <Copy size={18}/>
                  </button>
               </div>

               <span className="font-mono font-bold text-white text-lg drop-shadow-md uppercase tracking-wider">{color.hex}</span>
               
               {color.locked && <Lock size={14} className="md:hidden text-white/50 absolute top-2 right-2"/>}
            </div>
         ))}
      </div>
    </div>
  );
}