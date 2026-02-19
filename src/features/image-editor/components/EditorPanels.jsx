import React from 'react';
import AdjustPanel from './AdjustPanel';
import TransformPanel from './TransformPanel';
import ExportPanel from './ExportPanel';

export default function EditorPanels({ 
  activeTab, 
  state, 
  actions 
}) {
  const { filters, transform, exportConfig, drawings, image, brushSize, brushColor } = state;
  const { setFilters, setTransform, setDrawings, setBrushSize, setBrushColor, setExportConfig, handleDownload, saveState, applyCrop } = actions;

  return (
    <div className={!image ? "opacity-50 pointer-events-none" : ""}>

      {activeTab === 'adjust' && (
        <AdjustPanel filters={filters} setFilters={(f) => { setFilters(f); saveState(null, f); }} />
      )}
      
      {activeTab === 'transform' && (
        <TransformPanel transform={transform} setTransform={(t) => { setTransform(t); saveState(null, null, t); }} onApply={applyCrop} />
      )}
      
      {activeTab === 'draw' && (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Brush Size</label>
            <input type="range" min="1" max="40" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} className="w-full accent-blue-600"/>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Brush Color</label>
            <div className="flex items-center gap-2">
                <input type="color" value={brushColor} onChange={(e) => setBrushColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0"/>
                <span className="text-xs font-mono text-slate-500">{brushColor}</span>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={() => setDrawings(prev => prev.slice(0, -1))} className="flex-1 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 transition-colors">Undo Stroke</button>
            <button onClick={() => setDrawings([])} className="flex-1 px-3 py-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 text-red-500 rounded-xl text-sm font-bold transition-colors">Clear All</button>
          </div>
        </div>
      )}

      {activeTab === 'export' && (
        <ExportPanel
          config={exportConfig}
          setConfig={setExportConfig}
          onDownload={handleDownload}
          imageSrc={image}
          filters={filters}
          transform={transform}
          drawings={drawings}
        />
      )}

    </div>
  );
}
