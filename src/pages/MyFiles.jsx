import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Search, Loader2, WifiOff } from 'lucide-react';
import useFileHandler from '@/hooks/useFileHandler';
import useOnlineStatus from '@/hooks/useOnlineStatus';

// Feature Components 
import FileSidebar from '@/features/files/components/FileSidebar';
import FileCard from '@/features/files/components/FileCard';
import EmptyState from '@/features/files/components/EmptyState';
import MobileHeader from '@/features/files/components/MobileHeader';

import AuthModal from '@/components/auth/AuthModal';
import { Toast, ConfirmModal, LoginRequired, } from "@/components/ui/index"
import Seo from '@/components/seo/Seo';

export default function MyFiles() {
  // 1. ALL HOOKS MUST BE AT THE TOP 
  const userData = useSelector((state) => state.auth.userData);
  const isOnline = useOnlineStatus();
  
  // Local States
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);
  const [deleteData, setDeleteData] = useState(null); 

  const { files, loading, uploading, uploadFiles, deleteFile } = useFileHandler(userData);

  // Memoized Logic
  const filteredFiles = useMemo(() => {
    if (!files) return [];
    return files.filter(f => {
      let typeMatch = true;
      if (filter === 'image') typeMatch = f.type.startsWith('image/');
      else if (filter === 'video') typeMatch = f.type.startsWith('video/');
      else if (filter === 'audio') typeMatch = f.type.startsWith('audio/');
      else if (filter === 'document') typeMatch = f.type.includes('pdf') || f.type.includes('text');
      
      const nameMatch = f.name.toLowerCase().includes(searchTerm.toLowerCase());
      return typeMatch && nameMatch;
    });
  }, [files, filter, searchTerm]);

  const totalUsage = useMemo(() => {
    return files ? files.reduce((acc, file) => acc + file.size, 0) : 0;
  }, [files]);

  // --- HANDLERS ---
  const handleUpload = async (e) => {
    // 1. Offline Check
    if (!isOnline) {
      setToast({ message: "You are offline. Connect to upload files.", type: "error" });
      return; 
    }

    if (!e.target.files.length) return;
    const count = await uploadFiles(Array.from(e.target.files));
    if (count > 0) setToast({ message: `${count} Files Uploaded!`, type: "success" });
    else setToast({ message: "Upload failed.", type: "error" });
  };

  const confirmDelete = async () => {
    // 2. Offline Check
    if (!isOnline) {
      setToast({ message: "You are offline. Cannot delete files.", type: "error" });
      setDeleteData(null); // Close modal
      return;
    }

    if (!deleteData) return;
    const success = await deleteFile(deleteData.docId, deleteData.fileId);
    if (success) setToast({ message: "File deleted", type: "success" });
    else setToast({ message: "Delete failed", type: "error" });
    setDeleteData(null); 
  };
  // --- 2. CONDITIONAL RENDERING  ---
  
  // Case: Guest User
  if (!userData) {
    return (
      <>
        <div className="h-[calc(100vh-8rem)] flex items-center justify-center bg-white dark:bg-slate-900 lg:rounded-3xl border-0 lg:border border-slate-200 dark:border-slate-800 shadow-sm lg:m-4">
          <LoginRequired onOpenAuth={() => setIsAuthOpen(true)} />
        </div>
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      </>
    );
  }

  // Case: Logged In User
  return (
    <>
    <Seo 
      title="My Cloud Files"
      description="Secure File Manager. Access, upload, and organize your documents, images, and media offline & online."
      keywords={["file manager", "cloud storage", "secure files", "offline access", "document organizer"]}
      url="/files"
      type="website"
    />
      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* Reusable Confirm Modal */}
      <ConfirmModal 
        isOpen={!!deleteData} 
        onClose={() => setDeleteData(null)}
        onConfirm={confirmDelete}
        title="Delete File?"
        message="This will permanently remove the file from your Cloud Storage. This action cannot be undone."
        type="danger"
        checkboxLabel="I understand that this file will be lost forever"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-6 h-full lg:h-[calc(100vh-8rem)] animate-fade-in">
        {/* --- PART A: DESKTOP SIDEBAR --- */}
        <FileSidebar 
           filter={filter} setFilter={setFilter} 
           handleUpload={handleUpload} uploading={uploading} totalUsage={totalUsage}
           isOnline={isOnline}
        />

        {/* --- PART B: MAIN CONTENT --- */}
        <div className="lg:col-span-9 bg-slate-50 dark:bg-slate-950 lg:bg-slate-50 lg:dark:bg-slate-950 lg:rounded-3xl lg:border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden relative h-full shadow-sm">
          
          {/* Mobile Header */}
          <MobileHeader 
             searchTerm={searchTerm} setSearchTerm={setSearchTerm}
             uploading={uploading} handleUpload={handleUpload}
             filter={filter} setFilter={setFilter}
             isOnline={isOnline}
          />

          {/* Desktop Header */}
          <div className="hidden lg:flex p-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 justify-between items-center gap-4">
             <h1 className="text-lg font-bold text-slate-800 dark:text-white capitalize flex items-center gap-2">
               {filter === 'all' ? 'All Files' : `${filter}s`}
               <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md text-slate-500 font-mono">
                  {filteredFiles.length}
               </span>
             </h1>
             {!isOnline && (
                <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full border border-red-100 animate-pulse">
                  <WifiOff size={12}/> Offline Mode
                </span>
            )}

             {/* Search Bar */}
             <div className="relative w-72 group">
               <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
               <input 
                 type="text" placeholder="Search files..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white placeholder:text-slate-400"
               />
             </div>
          </div>

          {/* File Grid */}
          <div className="flex-1 p-4 lg:p-6 overflow-y-auto custom-scrollbar relative">
             {loading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm z-10">
                   <div className="flex flex-col items-center">
                      <Loader2 className="animate-spin text-blue-500 mb-3" size={32} />
                      <p className="text-sm font-bold text-slate-500 animate-pulse">Syncing Library...</p>
                   </div>
                </div>
             ) : null}

             {!loading && filteredFiles.length === 0 ? (
                <EmptyState filter={filter} searchTerm={searchTerm} />
             ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 pb-20 lg:pb-0">
                  {filteredFiles.map((file) => (
                    <FileCard 
                        key={file.$id} 
                        file={file} 
                        onDelete={() => setDeleteData({ docId: file.$id, fileId: file.bucketFileId })} 
                    />
                  ))}
                </div>
             )}
          </div>
        </div>
      </div>
    </>
  );
}