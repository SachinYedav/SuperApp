import React from 'react';
import { FileText, Upload, Loader2, Image as ImageIcon } from 'lucide-react';

export default function SidebarControls({
  handleFileUpload, handleExport, processing, pagesCount,
  selectionMode, setSelectionMode, selectAll, selectedCount
}) {
  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-2">
          <FileText className="text-blue-600" /> PDF Master
        </h2>
        <p className="text-xs text-slate-500">Merge, Split, Convert & Organize.</p>
      </div>

      <label className="w-full py-8 border-2 border-dashed border-blue-200 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-800 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all mb-6 group">
        <div className="p-3 bg-white dark:bg-slate-800 rounded-full mb-3 shadow-sm group-hover:scale-110 transition-transform">
            <Upload size={24} className="text-blue-500" />
        </div>
        <span className="text-sm font-bold text-blue-700 dark:text-blue-400">Add Files</span>
        <input type="file" multiple className="hidden" accept="application/pdf,image/*" onChange={handleFileUpload} />
      </label>

      <div className="mt-auto space-y-3">
        <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl mb-2 border border-slate-100 dark:border-slate-700">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-slate-500 uppercase">Selection Mode</span>
            <button onClick={() => setSelectionMode(!selectionMode)} className={`w-10 h-5 rounded-full transition-colors relative ${selectionMode ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform shadow-sm ${selectionMode ? 'left-6' : 'left-1'}`}></div>
            </button>
          </div>
          {selectionMode && (
            <button onClick={selectAll} className="text-[10px] text-blue-500 font-bold hover:underline w-full text-right block mt-1">
              {selectedCount === pagesCount ? 'Deselect All' : 'Select All'}
            </button>
          )}
        </div>

        <button onClick={() => handleExport('pdf')} disabled={processing || pagesCount === 0} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 transition-all active:scale-95">
          {processing ? <Loader2 className="animate-spin" size={18}/> : <FileText size={18} />}
          {selectionMode ? 'Save Selected PDF' : 'Save PDF'}
        </button>

        <button onClick={() => handleExport('images')} disabled={processing || pagesCount === 0} className="w-full py-3.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all active:scale-95">
          {processing ? <Loader2 className="animate-spin" size={18}/> : <ImageIcon size={18} />}
          {selectionMode ? 'Extract Images' : 'Save Images'}
        </button>
      </div>
    </div>
  );
}