import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import { extractPages, generatePDF, generateImagesZip } from './utils/pdfProcessor';
import { FileText, Upload, Loader2, Plus, CheckSquare, MoreVertical, X } from 'lucide-react';

// Components
import PageGrid from './components/PageGrid';
import SidebarControls from './components/SidebarControls';
import Dropdown from '@/components/ui/Dropdown'; 
import Seo from '@/components/seo/Seo';

export default function PdfTools() {
  const [pages, setPages] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [selectionMode, setSelectionMode] = useState(false);

  // --- HANDLERS ---
  const handleFileUpload = async (e) => {
    if (!e.target.files?.length) return;
    setProcessing(true);
    setLoadingMsg('Scanning...');
    try {
      const extracted = await extractPages(Array.from(e.target.files));
      setPages(prev => [...prev, ...extracted]);
    } catch (err) {
      alert("Failed to load files.");
    } finally {
      setProcessing(false);
    }
  };

  const handleExport = async (type) => {
    const targets = selectionMode ? pages.filter(p => p.selected) : pages;
    if (!targets.length) return alert("Select at least one page.");
    
    setProcessing(true);
    setLoadingMsg(type === 'pdf' ? 'Generating...' : 'Zipping...');
    try {
      const blob = type === 'pdf' ? await generatePDF(targets) : await generateImagesZip(targets);
      saveAs(blob, `superapp-doc-${Date.now()}.${type === 'pdf' ? 'pdf' : 'zip'}`);
    } catch (e) {
      console.error(e);
      alert("Export failed.");
    } finally {
      setProcessing(false);
    }
  };

  // --- ACTIONS ---
  const rotatePage = (i) => { const n = [...pages]; n[i].rotation = (n[i].rotation + 90) % 360; setPages(n); };
  const deletePage = (i) => setPages(pages.filter((_, idx) => idx !== i));
  const toggleSelection = (i) => { const n = [...pages]; n[i].selected = !n[i].selected; setPages(n); };
  const selectAll = () => setPages(pages.map(p => ({ ...p, selected: true })));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-6 h-[100dvh] lg:h-[calc(100dvh-8rem)] relative bg-slate-50 dark:bg-slate-950">
      <Seo 
        title="PDF Utilities"
        description="Merge, split, and compress PDF files securely on your device. No server upload required."
        keywords={["pdf merger", "pdf splitter", "offline pdf tools", "secure pdf"]}
        type="tool"
        url="/pdf-tools"
      />
      
      {/* --- DESKTOP SIDEBAR (Hidden on Mobile) --- */}
      <div className="hidden lg:flex lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden h-full flex-col">
          <SidebarControls 
             handleFileUpload={handleFileUpload}
             handleExport={handleExport}
             processing={processing}
             pagesCount={pages.length}
             selectionMode={selectionMode}
             setSelectionMode={setSelectionMode}
             selectAll={selectAll}
             selectedCount={pages.filter(p=>p.selected).length}
          />
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="lg:col-span-9 flex flex-col relative h-full lg:rounded-3xl lg:border border-slate-200 dark:border-slate-800 lg:bg-white lg:dark:bg-slate-900 lg:shadow-inner overflow-hidden">
         
         {/* STICKY HEADER  */}
         <div className="sticky top-0 z-30 p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm shrink-0">
            
            {/* Title / Selection Count */}
            <h1 className="text-sm font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300 flex items-center gap-2">
               {selectionMode 
                 ? <span className="text-blue-600 flex items-center gap-2"><CheckSquare size={16}/> {pages.filter(p=>p.selected).length} Selected</span> 
                 : <span>{pages.length} Pages</span>
               }
            </h1>

            <div className="flex items-center gap-2">
               {/* Processing Indicator */}
               {processing && (
                 <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-full">
                    <Loader2 size={14} className="animate-spin"/> {loadingMsg}
                 </div>
               )}

               {/* Mobile Actions Group */}
               <div className="flex gap-2 lg:hidden">
                  {/* Quick Add Button */}
                  <label className="p-2.5 rounded-full bg-blue-600 text-white shadow active:scale-95 cursor-pointer">
                    <Plus size={18} strokeWidth={2.5}/>
                    <input type="file" multiple className="hidden" accept="application/pdf,image/*" onChange={handleFileUpload} />
                  </label>

                  {/* Export Menu Dropdown */}
                  {pages.length > 0 && (
                    <Dropdown 
                      align="right" width="w-44" 
                      trigger={(isOpen) => (
                        <button className={`p-2.5 rounded-full shadow active:scale-95 transition-colors ${isOpen ? 'bg-slate-200 dark:bg-slate-700' : 'bg-slate-100 dark:bg-slate-800'}`}>
                          {processing ? <Loader2 size={18} className="animate-spin text-blue-600"/> : <FileText size={18} className="text-slate-700 dark:text-slate-200"/>}
                        </button>
                      )}
                    >
                      {() => (
                        <div className="p-1 space-y-1">
                          <button onClick={()=>handleExport('pdf')} className="w-full text-left px-3 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2">
                            <span className="text-red-500">PDF</span> Save as PDF
                          </button>
                          <button onClick={()=>handleExport('images')} className="w-full text-left px-3 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2">
                            <span className="text-purple-500">IMG</span> Extract Images
                          </button>
                        </div>
                      )}
                    </Dropdown>
                  )}

                  {/* Selection Mode Toggle */}
                  <button 
                    onClick={() => setSelectionMode(!selectionMode)}
                    className={`p-2.5 rounded-full transition-colors ${selectionMode ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                  >
                    {selectionMode ? <CheckSquare size={18}/> : <MoreVertical size={18}/>}
                  </button>
               </div>
            </div>
         </div>

         {/* SCROLLABLE GRID */}
         <div 
            className="flex-1 overflow-y-auto overscroll-contain pb-32 lg:pb-4 custom-scrollbar"
            style={{ WebkitOverflowScrolling: "touch" }}
         >
            <PageGrid 
              pages={pages} 
              setPages={setPages}
              selectionMode={selectionMode} 
              toggleSelection={toggleSelection}
              rotatePage={rotatePage} 
              deletePage={deletePage}
            />
         </div>
      </div>
    </div>
  );
}