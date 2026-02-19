import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Copy } from 'lucide-react';
import { getColorFromImage } from '../utils/colorUtils'; 
import useCopy from '@/hooks/useCopy'; 

export default function ImagePicker() {
  const [image, setImage] = useState(null);
  const [pickedColor, setPickedColor] = useState('#FFFFFF');
  const imgRef = useRef(null);
  const { copyToClipboard } = useCopy();

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {   
        setImage(URL.createObjectURL(file));
    }
  };

  const handleMouseMove = (e) => {
    if (!image || !imgRef.current) return;
    const { nativeEvent } = e;
    const color = getColorFromImage(imgRef.current, nativeEvent.offsetX, nativeEvent.offsetY);
    if(color) setPickedColor(color);
  };

  return (
    <div className="h-full flex flex-col animate-fade-in gap-4">
      
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
         <label className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 cursor-pointer transition-colors shadow-lg shadow-blue-500/20 active:scale-95">
            <Upload size={16}/> Upload Image
            <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
         </label>
         
         {image && (
            <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm animate-scale-in ml-auto">
               <div className="w-8 h-8 rounded-lg border border-slate-200 shadow-sm transition-colors duration-200" style={{ backgroundColor: pickedColor }}></div>
               <span className="font-mono text-lg font-bold text-slate-800 dark:text-white uppercase">{pickedColor}</span>
               <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
               <button onClick={() => copyToClipboard(pickedColor, "Hex Copied")} className="text-slate-400 hover:text-blue-500 transition-colors p-1">
                  <Copy size={18}/>
               </button>
            </div>
         )}
      </div>

      <div className="flex-1 bg-slate-100 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden relative cursor-crosshair shadow-inner group min-h-[500px]">
         {image ? (
            <img 
               ref={imgRef}
               src={image} 
               alt="Pick" 
               className="max-w-full max-h-full object-contain shadow-2xl"
               onMouseMove={handleMouseMove}
               onClick={() => copyToClipboard(pickedColor, "Color Copied")}
            />
         ) : (
            <div className="text-slate-400 flex flex-col items-center animate-pulse">
               <ImageIcon size={64} className="mb-4 opacity-50"/>
               <p className="font-medium text-sm">Upload an image to extract colors</p>
            </div>
         )}
      </div>
    </div>
  );
}