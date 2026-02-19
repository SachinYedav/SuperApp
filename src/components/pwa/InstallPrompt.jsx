import React, { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // 1. Safety Check: Check if app is already installed (Standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    
    // 2. Safety Check: Check if user dismissed the prompt in this session
    const isDismissed = sessionStorage.getItem('installPromptDismissed');

    if (isStandalone || isDismissed) {
      return; // Do not show if already installed or dismissed
    }

    // 3. Detect iOS Device (iPhone, iPad, iPod)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    if (isIOSDevice) {
      // iOS doesn't support 'beforeinstallprompt', 
      setIsVisible(true);
    } else {
      // 4. Android / Chrome / Edge Logic
      const handler = (e) => {
        e.preventDefault(); 
        setDeferredPrompt(e); 
        setIsVisible(true); 
      };

      window.addEventListener('beforeinstallprompt', handler);

      return () => {
        window.removeEventListener('beforeinstallprompt', handler);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    // Cleanup
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('installPromptDismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-8 md:bottom-8 z-50 animate-fade-in-up">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 p-4 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4 max-w-sm ml-auto relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-2xl rounded-full -z-10 pointer-events-none"></div>

        <div className="flex items-center gap-4 w-full">
          <div className="w-12 h-12 flex items-center justify-center shrink-0 relative">
             <div className="absolute inset-0 bg-blue-500/20 blur-md rounded-xl -z-10"></div>
             <img 
               src="/assets/icons/logo.png" 
               alt="SuperApp Logo" 
               className="w-full h-full object-contain drop-shadow-lg"
             />
          </div>

          <div className="flex-1 pr-6">
             <h4 className="text-white font-bold text-sm tracking-tight">Install SuperApp</h4>
             <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
              Download the SuperApp for a faster, offline experience.
             </p>
          </div>

          {/* Dismiss Button (X) */}
          <button 
              onClick={handleDismiss}
              className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
              aria-label="Close"
          >
              <X size={16} />
          </button>
        </div>

        <div className="w-full sm:w-auto mt-2 sm:mt-0 flex justify-end">
           {isIOS ? (
              // iOS Instruction UI
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-2 rounded-lg text-[11px] text-slate-300 font-medium border border-slate-700/50 w-full justify-center">
                 Tap <Share size={14} className="text-blue-400 mx-0.5" /> then <strong>Add to Home Screen</strong>
              </div>
           ) : (
              <button 
                  onClick={handleInstallClick}
                  className="w-full sm:w-auto px-4 py-2 bg-white text-slate-900 text-xs font-black rounded-xl shadow-lg hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center justify-center gap-2 active:scale-95"
              >
                  <Download size={16} className="text-blue-600" />
                  Install App
              </button>
           )}
        </div>

      </div>
    </div>
  );
}