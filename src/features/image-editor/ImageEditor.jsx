import React, { useState, useRef } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Sliders, Crop, FileInput, Undo, Redo, PenTool, Eye, X } from 'lucide-react';

// Hooks & Utils
import { useZoomPan } from './hooks/useZoomPan';
import { useImageHistory } from './hooks/useImageHistory';
import { generateFilterString, generateTransformString } from './utils/imageUtils';
import { getCroppedImg, getCompressedImg } from './utils/canvasUtils';
import Seo from '@/components/seo/Seo';

// Components
import ImageUploader from './components/ImageUploader';
import DrawingPanel from './components/DrawingPanel';
import EditorPanels from './components/EditorPanels';

const TABS = [
  { id: 'adjust', label: 'Adjust', icon: Sliders },
  { id: 'transform', label: 'Crop', icon: Crop },
  { id: 'draw', label: 'Draw', icon: PenTool },
  { id: 'export', label: 'Save', icon: FileInput },
];

export default function ImageEditor() {
  // --- STATE ---
  const [image, setImage] = useState(null);
  const [activeTab, setActiveTab] = useState('adjust');
  
  // Editor Data
  const [filters, setFilters] = useState({ brightness: 100, contrast: 100, saturate: 100, blur: 0, grayscale: 0, sepia: 0, hueRotate: 0 });
  const [transform, setTransform] = useState({ rotate: 0, flipH: 1, flipV: 1 });
  const [exportConfig, setExportConfig] = useState({ quality: 90, format: 'image/jpeg', width: 0, height: 0 });
  const [drawings, setDrawings] = useState([]);
  const [brushSize, setBrushSize] = useState(4);
  const [brushColor, setBrushColor] = useState('#ff0000');

  // Crop & View
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [showOriginal, setShowOriginal] = useState(false);
  const imgRef = useRef(null);

  // Custom Hooks
  const { scale, position, resetZoom, events: zoomEvents } = useZoomPan();
  const { saveState: pushHistory, undo, redo, canUndo, canRedo, historyIndex } = useImageHistory();

  // --- ACTIONS ---

  // History Wrapper
  const handleSaveState = (newImg, newFilters, newTrans, newDrawings) => {
    pushHistory({
      image: newImg || image,
      filters: { ...(newFilters || filters) },
      transform: { ...(newTrans || transform) },
      drawings: [...(newDrawings || drawings)]
    });
  };

  const handleUndo = () => {
    const prev = undo();
    if (prev) restoreState(prev);
  };

  const handleRedo = () => {
    const next = redo();
    if (next) restoreState(next);
  };

  const restoreState = (state) => {
    setImage(state.image);
    setFilters(state.filters);
    setTransform(state.transform);
    setDrawings(state.drawings);
  };

  // Image Logic
  const handleImageLoad = (imgData) => {
    resetZoom();
    setImage(imgData);
    handleSaveState(imgData, 
      { brightness: 100, contrast: 100, saturate: 100, blur: 0, grayscale: 0, sepia: 0, hueRotate: 0 },
      { rotate: 0, flipH: 1, flipV: 1 },
      []
    );
  };

  const onImgLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setExportConfig(prev => ({ ...prev, width: naturalWidth, height: naturalHeight }));
    setCrop(centerCrop(makeAspectCrop({ unit: '%', width: 90 }, 16 / 9, naturalWidth, naturalHeight), naturalWidth, naturalHeight));
  };

  const applyCrop = async () => {
    if (completedCrop && imgRef.current) {
      const croppedImg = await getCroppedImg(image, completedCrop, { h: 1, v: 1 }, 0);
      setImage(croppedImg);
      setCrop(undefined);
      
      const resetTrans = { rotate: 0, flipH: 1, flipV: 1 };
      setTransform(resetTrans);
      handleSaveState(croppedImg, null, resetTrans);
      setActiveTab('adjust');
    }
  };

  const handleDownload = async () => {
    const filterStr = generateFilterString(filters);
    const finalBlob = await getCompressedImg(image, {
      width: exportConfig.width, height: exportConfig.height, ...exportConfig,
      filters: filterStr, rotate: transform.rotate, flip: { h: transform.flipH, v: transform.flipV },
      drawings: drawings
    });
    const link = document.createElement('a');
    link.download = `edited-${Date.now()}.${exportConfig.format.split('/')[1]}`;
    link.href = finalBlob;
    link.click();
  };

  // Styles
  const computedStyle = {
    filter: showOriginal ? 'none' : generateFilterString(filters),
    transform: generateTransformString(transform, position, scale, showOriginal),
    transition: 'filter 0.2s ease-out, transform 0.2s ease-out'
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] lg:gap-6 bg-slate-50 dark:bg-slate-950">
      <Seo 
        title="Advanced Image Editor"
        description="Edit images offline. Crop, resize, apply filters, and adjust colors directly in your browser without uploading data."
        keywords={["image editor", "offline photo editor", "crop image", "resize image", "filters", "pwa tool"]}
        type="tool" 
        url="/image-editor"
      />

      {/* --- LEFT: CANVAS AREA --- */}
      <div className="flex-1 bg-slate-100 dark:bg-slate-900 lg:rounded-3xl overflow-hidden flex items-center justify-center relative border-b lg:border border-slate-200 dark:border-slate-800 select-none">

        {image ? (
          <>
            {/* Floating Top Controls */}
            <div className="absolute top-1 left-4 right-4 z-20 flex justify-between pointer-events-none">
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-full shadow-lg p-1 flex gap-1 pointer-events-auto border border-slate-200 dark:border-slate-700">
                <button onClick={handleUndo} disabled={!canUndo} className="p-2.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-full disabled:opacity-30 transition-colors"><Undo size={18}/></button>
                <button onClick={handleRedo} disabled={!canRedo} className="p-2.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-full disabled:opacity-30 transition-colors"><Redo size={18}/></button>
              </div>

              <div className="flex gap-2 pointer-events-auto">
                <button
                  onMouseDown={() => setShowOriginal(true)} onMouseUp={() => setShowOriginal(false)}
                  onTouchStart={() => setShowOriginal(true)} onTouchEnd={() => setShowOriginal(false)}
                  className="p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-full shadow-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 transition-colors border border-slate-200 dark:border-slate-700"
                >
                  <Eye size={18}/>
                </button>
                <button onClick={() => setImage(null)} className="p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-full shadow-lg hover:bg-red-50 text-red-500 transition-colors border border-slate-200 dark:border-slate-700">
                  <X size={18}/>
                </button>
              </div>
            </div>

            {/* Image Container */}
            <div className="relative max-h-full max-w-full flex items-center justify-center p-2 w-full h-full">
              {activeTab === 'transform' ? (
                <ReactCrop crop={crop} onChange={(_, c) => setCrop(c)} onComplete={(c) => setCompletedCrop(c)} className="max-h-full">
                  <img ref={imgRef} src={image} onLoad={onImgLoad} style={computedStyle} className="max-h-[50vh] lg:max-h-[85vh] object-contain" />
                </ReactCrop>
              ) : (
                <div className="relative touch-none" {...zoomEvents}>
                  <img src={image} style={computedStyle} className="max-h-[30vh] lg:max-h-[85vh] object-contain shadow-2xl" />
                  
                  {/* Drawing Overlay */}
                  {activeTab === 'draw' && (
                    <DrawingPanel
                      width={imgRef.current?.width}
                      height={imgRef.current?.height}
                      drawings={drawings}
                      brushSize={brushSize}
                      brushColor={brushColor}
                      setDrawings={(d) => { setDrawings(d); handleSaveState(null, null, null, d); }}
                    />
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="w-full max-w-xl p-6">
            <ImageUploader onImageSelect={handleImageLoad} />
          </div>
        )}
      </div>

      {/* --- RIGHT/BOTTOM: TOOLS PANEL --- */}
<>
  {/* Mobile Bottom Sheet */}
  <div className="lg:hidden bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col max-h-[55vh] shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-40">
    <div className="p-2 border-b border-slate-200 dark:border-slate-800 flex gap-2 shrink-0 z-10 bg-inherit">
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? "bg-blue-600 text-white" : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"}`}
        >
          {tab.label}
        </button>
      ))}
    </div>

    <div className="p-4 overflow-y-auto custom-scrollbar flex-1 pb-10">
      <EditorPanels 
        activeTab={activeTab}
        state={{ filters, transform, exportConfig, drawings, image, brushSize, brushColor }}
        actions={{ setFilters, setTransform, setDrawings, setBrushSize, setBrushColor, setExportConfig, handleDownload, saveState: handleSaveState, applyCrop }}
      />
    </div>
  </div>

  {/* Desktop Sidebar */}
  <div className="hidden lg:flex lg:w-80 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 flex-col shadow-xl">
    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
      <EditorPanels 
        activeTab={activeTab}
        state={{ filters, transform, exportConfig, drawings, image, brushSize, brushColor }}
        actions={{ setFilters, setTransform, setDrawings, setBrushSize, setBrushColor, setExportConfig, handleDownload, saveState: handleSaveState, applyCrop }}
      />
    </div>

    {/* Desktop Tabs */}
    <div className="flex border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 rounded-b-3xl">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex-1 py-4 flex flex-col items-center justify-center gap-1.5 transition-all relative group ${activeTab === tab.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
        >
          <tab.icon size={20} className="group-hover:scale-110 transition-transform"/>
          <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
          {activeTab === tab.id && <div className="absolute top-0 w-12 h-1 bg-blue-600 rounded-b-full shadow-lg shadow-blue-500/50"/>}
        </button>
      ))}
    </div>
  </div>
</>

    </div>
  );
}