import React, { useState, useEffect } from 'react';
import { Download, FileImage, Settings2, HardDrive, Calculator } from 'lucide-react';
import { getCompressedImg, getBase64Size } from '../utils/canvasUtils';

export default function ExportPanel({ config, setConfig, onDownload, imageSrc, filters, transform, drawings }) {
  const [fileSize, setFileSize] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [mode, setMode] = useState('quality'); // 'quality' or 'size'

  useEffect(() => {
    const calculateSize = async () => {
        setCalculating(true);
        // Generate a temporary preview to check size
        const blob = await getCompressedImg(imageSrc, {
            ...config,
            filters: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%) blur(${filters.blur}px) grayscale(${filters.grayscale}%) sepia(${filters.sepia}%) hue-rotate(${filters.hueRotate}deg)`,
            rotate: transform.rotate,
            flip: { h: transform.flipH, v: transform.flipV },
            drawings: drawings,
            // If mode is size, use targetSize, else use quality
            targetSizeKB: mode === 'size' ? config.targetSizeKB : null
        });
        
        const size = getBase64Size(blob);
        setFileSize(size.toFixed(2));
        setCalculating(false);
    };

    const timeout = setTimeout(calculateSize, 500); // 500ms delay to avoid lag
    return () => clearTimeout(timeout);
  }, [config, mode, filters, transform, drawings]);

  return (
    <div className="space-y-6 animate-fade-in">
       
       {/* 1. SIZE INFO CARD */}
       <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col gap-2">
          <div className="flex justify-between items-center">
             <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                <HardDrive size={14}/> Estimated Size
             </span>
             <span className={`text-lg font-mono font-bold ${calculating ? 'opacity-50' : 'text-blue-600 dark:text-blue-400'}`}>
                {calculating ? '...' : `${fileSize} KB`}
             </span>
          </div>
          <div className="h-1 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
             <div className={`h-full bg-blue-500 transition-all duration-500 ${calculating ? 'w-full animate-pulse' : 'w-0'}`}></div>
          </div>
          <div className="flex justify-between text-[10px] text-slate-400">
             <span>{config.width} x {config.height} px</span>
             <span>{config.format.split('/')[1].toUpperCase()}</span>
          </div>
       </div>

       {/* 2. FORMAT SELECTION */}
       <section>
          <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-400 uppercase">
             <FileImage size={12}/> File Type
          </div>
          <div className="flex gap-2">
             {['image/jpeg', 'image/png', 'image/webp'].map((fmt) => (
                <button 
                  key={fmt} 
                  onClick={() => setConfig({ ...config, format: fmt })}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-lg border uppercase transition-all
                  ${config.format === fmt 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-blue-400'}`}
                >
                   {fmt.split('/')[1]}
                </button>
             ))}
          </div>
       </section>

       {/* 3. COMPRESSION MODE (Only for JPEG/WEBP) */}
       {config.format !== 'image/png' && (
           <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              
              {/* Tabs */}
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg mb-4">
                 <button onClick={() => setMode('quality')} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${mode === 'quality' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' : 'text-slate-500'}`}>
                    By Quality %
                 </button>
                 <button onClick={() => setMode('size')} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${mode === 'size' ? 'bg-white dark:bg-slate-700 shadow-sm text-green-600' : 'text-slate-500'}`}>
                    Target Size (KB)
                 </button>
              </div>

              {/* Controls */}
              {mode === 'quality' ? (
                  <div>
                     <div className="flex justify-between mb-2">
                        <span className="text-xs font-bold text-slate-500">Quality</span>
                        <span className="text-xs font-mono font-bold text-blue-600">{config.quality}%</span>
                     </div>
                     <input 
                       type="range" min="10" max="100" step="5"
                       value={config.quality}
                       onChange={(e) => setConfig({ ...config, quality: Number(e.target.value) })}
                       className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                     />
                  </div>
              ) : (
                  <div>
                     <div className="flex justify-between mb-2">
                        <span className="text-xs font-bold text-slate-500 flex items-center gap-1"><Calculator size={12}/> Max File Size</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <input 
                          type="number" 
                          value={config.targetSizeKB || 50}
                          onChange={(e) => setConfig({ ...config, targetSizeKB: Number(e.target.value) })}
                          className="flex-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-mono focus:border-green-500 outline-none"
                          placeholder="e.g. 50"
                        />
                        <span className="text-sm font-bold text-slate-500">KB</span>
                     </div>
                     <p className="text-[10px] text-slate-400 mt-2">
                        We will adjust quality automatically to fit this size.
                     </p>
                  </div>
              )}
           </section>
       )}

       {/* 4. RESIZE (Pixels) */}
       <section>
          <div className="text-xs font-bold text-slate-400 uppercase mb-3">Dimensions</div>
          <div className="flex gap-2">
             <div className="flex-1">
                <label className="text-[10px] text-slate-500 mb-1 block">Width</label>
                <input type="number" value={config.width} onChange={(e) => setConfig({ ...config, width: Number(e.target.value) })}
                   className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-mono" />
             </div>
             <div className="flex-1">
                <label className="text-[10px] text-slate-500 mb-1 block">Height</label>
                <input type="number" value={config.height} onChange={(e) => setConfig({ ...config, height: Number(e.target.value) })}
                   className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-mono" />
             </div>
          </div>
       </section>

       {/* 5. DOWNLOAD */}
       <button 
         onClick={onDownload} 
         className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2 font-bold transition-transform active:scale-95"
       >
          <Download size={20} /> Download Image
       </button>

    </div>
  );
}