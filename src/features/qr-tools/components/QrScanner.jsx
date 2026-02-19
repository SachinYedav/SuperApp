import React, { useEffect, useState, useRef, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Copy, RefreshCw, CheckCircle, Camera, XCircle, SwitchCamera, Zap, ZapOff,
  Image as ImageIcon, History, Trash2 } from "lucide-react";

import { Toast, ConfirmModal } from "@/components/ui/index" 
import "../QrScanner.css";
import { saveScan, getScans, deleteScan, clearHistory } from "../utils/qrHistoryDB"; 

export default function QrScanner() {
  // --- STATE ---
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [permissionError, setPermissionError] = useState(false);
  const [isSuccessAnim, setIsSuccessAnim] = useState(false);
  const [toast, setToast] = useState(null);  
  
  // Features
  const [cameras, setCameras] = useState([]);
  const [currentCameraId, setCurrentCameraId] = useState(null);
  const [torchOn, setTorchOn] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Refs
  const scannerRef = useRef(null);
  const isMountedRef = useRef(true);
  const isProcessingRef = useRef(false);
  const fileInputRef = useRef(null);

  // --- 1. INITIAL SETUP ---
  useEffect(() => {
    isMountedRef.current = true;
    
    // Load History
    getScans().then(setHistory);

    // Get Cameras
    Html5Qrcode.getCameras().then(devices => {
        if (devices && devices.length) {
            setCameras(devices);
            // Auto-select Back Camera
            const backCam = devices.find(d => d.label.toLowerCase().includes('back')) || devices[0];
            setCurrentCameraId(backCam.id);
        } else {
            setPermissionError(true);
        }
    }).catch(err => {
        console.error("Camera Error", err);
        setPermissionError(true);
    });

    return () => {
        isMountedRef.current = false;
        stopScanner();
    };
  }, []);

  // --- 2. CORE LOGIC ---
  
  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
        try {
            if (scannerRef.current.isScanning) {
                await scannerRef.current.stop();
            }
            scannerRef.current.clear();
        } catch (e) { console.warn("Stop Warning", e); }
    }
    if (isMountedRef.current) {
        setIsScanning(false);
        setTorchOn(false);
    }
  }, []);

  const startScanner = useCallback(async () => {
    if (!currentCameraId || scanResult) return;

    const elementId = "reader";
    isProcessingRef.current = false; 

    try {
        await stopScanner(); // Clean slate

        // Safety Delay for DOM
        await new Promise(r => setTimeout(r, 100));
        if (!document.getElementById(elementId)) return;

        const html5QrCode = new Html5Qrcode(elementId);
        scannerRef.current = html5QrCode;

        const cameraConfig = { deviceId: { exact: currentCameraId } };
        const config = { 
            fps: 10, 
            qrbox: { width: 300, height: 300 }, 
            aspectRatio: 1.0 
        };

        await html5QrCode.start(
            cameraConfig, 
            config, 
            handleScanSuccess, 
            () => {} 
        );

        if (isMountedRef.current) {
            setIsScanning(true);
            setPermissionError(false);
            
            try {
                const track = html5QrCode.getVideoTrack();
                if (track) {
                   // Try to apply HD constraints if supported
                   await track.applyConstraints({
                       width: { ideal: 1920 },
                       height: { ideal: 1080 },
                       advanced: [{ focusMode: "continuous" }]
                   });
                }
            } catch (e) { console.log("HD Constraint not supported, using default"); }
        }

    } catch (err) {
        console.error("Start Error:", err);
        if (isMountedRef.current) {
            setIsScanning(false);
            // Handle specific permission error
            if (err?.name === "NotAllowedError" || err?.message?.includes("Permission")) {
                setPermissionError(true);
            }
        }
    }
  }, [currentCameraId, scanResult, stopScanner]);

  // Restart when camera changes
  useEffect(() => {
      if(currentCameraId && !scanResult) {
          startScanner();
      }
  }, [currentCameraId, scanResult, startScanner]);


  // --- 3. HANDLERS ---

  const handleScanSuccess = async (text) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    // Feedback
    if (navigator.vibrate) navigator.vibrate(50);
    const audio = new Audio('/assets/sounds/scan.mp3'); 
    audio.play().catch(() => {});

    await saveScan(text);
    getScans().then(setHistory);

    if (isMountedRef.current) setIsSuccessAnim(true);
    
    // Stop immediately
    if (scannerRef.current) {
        try { await scannerRef.current.stop(); } catch(e){}
    }

    setTimeout(() => {
        if (isMountedRef.current) {
            setScanResult(text);
            setIsSuccessAnim(false);
            setIsScanning(false);
        }
    }, 400);
  };

  const handleFileScan = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
          // Use a new instance for file scan
          const html5QrCode = new Html5Qrcode("reader");
          const result = await html5QrCode.scanFile(file, true);
          handleScanSuccess(result);
      } catch (err) {
          setToast({ message: "No QR Code found.", type: "error" });
      }
      e.target.value = '';
  };

 const toggleTorch = async () => {
    try {
      await scannerRef.current.applyVideoConstraints({
        advanced: [{ torch: !torchOn }]
      });
      setTorchOn(!torchOn);
    } catch {
      setToast({ message: "Torch not supported", type: "error" });
    }
  };

  const toggleCamera = () => {
      if (cameras.length < 2) return;
      const currentIndex = cameras.findIndex(c => c.id === currentCameraId);
      const nextIndex = (currentIndex + 1) % cameras.length;
      setCurrentCameraId(cameras[nextIndex].id);
      setTorchOn(false);
  };

  const copyResult = () => {
    navigator.clipboard.writeText(scanResult);
    setToast({ message: "Copied!", type: "success" });
  };

  const reset = () => {
    setScanResult(null);
    setIsSuccessAnim(false);
    isProcessingRef.current = false;
  };

  const handleDeleteItem = async (e, id) => {
    e.stopPropagation(); 
    await deleteScan(id);
    const updated = await getScans();
    setHistory(updated);
    if(navigator.vibrate) navigator.vibrate(20);
  };

  const handleClearAll = () => {
    if (history.length > 0) {
        setShowDeleteConfirm(true);
    }
  };

  const onConfirmClear = async () => {
    await clearHistory();
    setHistory([]);
    setToast({ message: "History Cleared", type: "success" });
    setShowDeleteConfirm(false); 
  };

  // --- RENDER ---
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-slate-100 dark:bg-slate-950 relative p-4 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
       <ConfirmModal 
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={onConfirmClear}
          title="Clear Scan History?"
          message="This will remove all your saved scans permanently. This action cannot be undone."
          type="danger"
          checkboxLabel="Yes, delete everything"
       />

       {/* Background Grid */}
       <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
            backgroundImage: `linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            backgroundPosition: 'center center'
        }}
       >
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#f1f5f9_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,#020617_100%)]" />
       </div>

       {toast && <Toast {...toast} onClose={() => setToast(null)} />}

       {/* --- SCANNER VIEW --- */}
       {!scanResult ? (
          <div className="flex flex-col items-center w-full max-w-lg z-10 animate-fade-in-up">
             
             {/* Main Scanner Box */}
             <div className={`w-full aspect-square bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-200 dark:border-slate-800 relative group transition-all duration-300 ${isSuccessAnim ? 'animate-scan-success border-green-500 scale-105' : ''}`}>
                 
                 <div id="reader" className="w-full h-full bg-black"></div>

                 {/* Permission Error */}
                 {permissionError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-white p-6 text-center z-20">
                        <XCircle size={48} className="text-red-500 mb-4" />
                        <h3 className="text-lg font-bold mb-2">Camera Blocked</h3>
                        <p className="text-sm text-slate-400 mb-6">Allow camera access to scan.</p>
                        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-blue-600 rounded-lg text-sm font-bold">Try Again</button>
                    </div>
                 )}

                 {/* Loading State */}
                 {!isScanning && !permissionError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 text-white z-10">
                        <Camera size={48} className="animate-pulse text-slate-500 mb-4" />
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Starting Camera...</p>
                    </div>
                 )}

                 {/* --- ACTIVE SCAN OVERLAYS --- */}
                 {isScanning && !isSuccessAnim && (
                     <>
                        {/* Scan Line */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.8)] animate-scan-line opacity-80 pointer-events-none z-10"></div>
                        
                        {/* Blue Corners */}
                        <div className="absolute inset-6 pointer-events-none z-10">
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-[4px] border-l-[4px] border-blue-500 rounded-tl-xl"></div>
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-[4px] border-r-[4px] border-blue-500 rounded-tr-xl"></div>
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[4px] border-l-[4px] border-blue-500 rounded-bl-xl"></div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[4px] border-r-[4px] border-blue-500 rounded-br-xl"></div>
                        </div>

                        {/* Top Controls (Torch & Switch) */}
                        <div className="absolute top-4 inset-x-4 flex justify-between z-20">
                             <button onClick={toggleTorch} className="p-2.5 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 border border-white/10 transition-all active:scale-95">
                                 {torchOn ? <Zap size={20} className="text-yellow-400 fill-yellow-400"/> : <ZapOff size={20}/>}
                             </button>
                             {cameras.length > 1 && (
                                 <button onClick={toggleCamera} className="p-2.5 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 border border-white/10 transition-all active:scale-95">
                                     <SwitchCamera size={20}/>
                                 </button>
                             )}
                        </div>

                        {/* Bottom Actions (Gallery & History) */}
                        <div className="absolute bottom-6 inset-x-0 flex justify-center gap-4 z-20">
                             <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileScan}/>
                             <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full text-white/90 text-xs font-bold border border-white/10 hover:bg-white/10 transition-all active:scale-95">
                                 <ImageIcon size={14} /> Scan Image
                             </button>
                             
                             <button onClick={() => setShowHistory(!showHistory)} className={`flex items-center gap-2 px-4 py-2 backdrop-blur-md rounded-full text-xs font-bold border border-white/10 transition-all active:scale-95 ${showHistory ? 'bg-blue-600 text-white' : 'bg-black/40 text-white/90 hover:bg-white/10'}`}>
                                 <History size={14} /> History
                             </button>
                        </div>
                     </>
                 )}
             </div>

             {/* History Panel */}
             {showHistory && (
                 <div className="w-full mt-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 shadow-lg animate-fade-in-up max-h-40 overflow-y-auto custom-scrollbar">
                     
                     {/* Header with Clear All */}
                     <div className="flex justify-between items-center mb-2 px-1 sticky top-0 bg-white dark:bg-slate-900 z-10 pb-2 border-b border-slate-100 dark:border-slate-800">
                         <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-500 uppercase">Recent Scans</span>
                            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded-md font-mono">{history.length}</span>
                         </div>
                         {history.length > 0 && (
                             <button onClick={handleClearAll} className="text-[10px] text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1 rounded transition-colors font-bold flex items-center gap-1">
                                 <Trash2 size={10} /> CLEAR
                             </button>
                         )}
                     </div>

                     {/* List Items */}
                     {history.length === 0 ? (
                         <div className="flex flex-col items-center justify-center py-4 text-slate-400">
                            <History size={24} className="mb-2 opacity-20"/>
                            <p className="text-xs">No scan history yet</p>
                         </div>
                     ) : (
                         history.slice(0, 20).map((item) => (
                             <div 
                                key={item.id} 
                                className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg group cursor-pointer relative" 
                                onClick={() => {
                                    navigator.clipboard.writeText(item.text); 
                                    setToast({message:'Copied', type:'success'});
                                }}
                             >
                                 <div className="overflow-hidden">
                                    <p className="text-xs text-slate-700 dark:text-slate-300 truncate max-w-[180px] font-mono font-medium">
                                        {item.text}
                                    </p>
                                    <p className="text-[9px] text-slate-400 mt-0.5">
                                        {new Date(item.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        {' • '}{new Date(item.time).toLocaleDateString()}
                                    </p>
                                 </div>

                                 <div className="flex items-center gap-2 pl-2">
                                     <span className="p-1.5 rounded-md text-slate-300 hover:text-blue-500 transition-colors hidden sm:block opacity-0 group-hover:opacity-100" title="Copy">
                                         <Copy size={12}/>
                                     </span>
                                     <button 
                                        onClick={(e) => handleDeleteItem(e, item.id)}
                                        className="p-2 rounded-md text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" 
                                        title="Delete"
                                     >
                                         <Trash2 size={14}/>
                                     </button>
                                 </div>
                             </div>
                         ))
                     )}
                 </div>
             )}
          </div>
       ) : (
          /* --- RESULT VIEW --- */
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-2xl text-center animate-scale-in z-10">
             <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-green-50 dark:ring-green-900/10">
                <CheckCircle size={40} className="text-green-600 dark:text-green-400" />
             </div>
             <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">Scan Successful!</h3>
             <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 mb-8 font-mono text-sm text-slate-600 dark:text-slate-300 break-all max-h-48 overflow-y-auto custom-scrollbar shadow-inner text-left">
                {scanResult}
             </div>
             <div className="flex gap-4">
                <button onClick={copyResult} className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-white rounded-xl font-bold flex items-center justify-center gap-2">
                   <Copy size={18}/> Copy
                </button>
                <button onClick={reset} className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30">
                   <RefreshCw size={18}/> Scan Again
                </button>
             </div>
          </div>
       )}
    </div>
  );
}