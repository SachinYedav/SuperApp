import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

export default function ImageUploader({ onImageSelect }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => onImageSelect(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div 
      className={`flex flex-col items-center justify-center w-full h-[60vh] border-2 border-dashed rounded-3xl transition-all duration-300 cursor-pointer
      ${isDragging 
        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]' 
        : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-blue-400'
      }`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <div className="p-6 bg-blue-50 dark:bg-slate-800 rounded-full mb-6 animate-bounce-slow">
        <Upload size={40} className="text-blue-500" />
      </div>
      
      <h3 className="text-xl font-bold text-slate-700 dark:text-white mb-2">
        Upload Photo
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 text-center max-w-xs">
        Drop your image here or click to browse. Supports JPG, PNG & WebP.
      </p>

      <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center gap-2">
        <ImageIcon size={18} /> Browse Files
      </button>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={(e) => handleFile(e.target.files?.[0])}
        className="hidden" 
        accept="image/*"
      />
    </div>
  );
}