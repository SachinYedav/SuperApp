import React from 'react';
import { RotateCw, FlipHorizontal, FlipVertical, Check, Crop } from 'lucide-react';

export default function TransformPanel({ transform, setTransform, onApply }) {
  const updateTransform = (key, value) => {
    setTransform({ ...transform, [key]: value });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Rotation & Flip Controls */}
      <section>
        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-400 uppercase">
           <Crop size={12}/> Orientation
        </div>
        
        <div className="grid grid-cols-3 gap-3">
           {/* Rotate Button */}
           <button 
             onClick={() => updateTransform('rotate', transform.rotate + 90)}
             className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-600 dark:text-slate-300 flex flex-col items-center justify-center gap-1 border border-slate-200 dark:border-slate-700 transition-colors"
             title="Rotate 90°"
           >
              <RotateCw size={20} />
              <span className="text-[10px] font-bold">Rotate</span>
           </button>

           {/* Flip Horizontal */}
           <button 
             onClick={() => updateTransform('flipH', transform.flipH * -1)}
             className={`p-3 rounded-xl flex flex-col items-center justify-center gap-1 border transition-colors
             ${transform.flipH === -1 
                ? 'bg-blue-50 border-blue-500 text-blue-600' 
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20'}`}
             title="Flip Horizontal"
           >
              <FlipHorizontal size={20} />
              <span className="text-[10px] font-bold">Flip H</span>
           </button>

           {/* Flip Vertical */}
           <button 
             onClick={() => updateTransform('flipV', transform.flipV * -1)}
             className={`p-3 rounded-xl flex flex-col items-center justify-center gap-1 border transition-colors
             ${transform.flipV === -1 
                ? 'bg-blue-50 border-blue-500 text-blue-600' 
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20'}`}
             title="Flip Vertical"
           >
              <FlipVertical size={20} />
              <span className="text-[10px] font-bold">Flip V</span>
           </button>
        </div>
      </section>

      {/* Apply Crop Button */}
      <section>
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-200 dark:border-yellow-800 mb-4">
            <p className="text-xs text-yellow-700 dark:text-yellow-400">
                Adjust the crop box on the image, then click Apply.
            </p>
        </div>
        <button 
          onClick={onApply} 
          className="w-full py-3 bg-slate-800 hover:bg-black dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg"
        >
           <Check size={18} /> Apply Crop
        </button>
      </section>

    </div>
  );
}