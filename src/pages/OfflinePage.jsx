import React from 'react';
import { WifiOff, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
 import Seo from '@/components/seo/Seo';
export default function OfflinePage() {
  const navigate = useNavigate();

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <Seo 
        title="You are Offline"
        description="No internet connection detected. Please check your network. You can still use our offline-ready tools."
        url="/offline"
        type="website"
      />
      
      {/* Background Effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
            backgroundImage: `linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
        }}
      >
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_100%)]" />
      </div>

      <div className="relative z-10 text-center animate-fade-in max-w-md">
        
        {/* Floating Icon */}
        <div className="flex justify-center mb-8">
            <div className="p-6 bg-slate-900 rounded-full border border-slate-800 shadow-2xl shadow-blue-900/20 animate-pulse">
                <WifiOff size={64} className="text-slate-400" />
            </div>
        </div>

        <h1 className="text-4xl font-black text-white mb-3 tracking-tight">
          You are Offline
        </h1>
        
        <p className="text-slate-400 mb-8 leading-relaxed text-lg">
           Oops! It seems you've lost your connection. 
           Check your internet and try again.
        </p>

        <div className="flex gap-4 justify-center">
          <button 
            onClick={handleRetry} 
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-500/25"
          >
            <RefreshCw size={20} /> Retry
          </button>
          
          <button 
            onClick={() => navigate('/')} 
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all border border-slate-700"
          >
            <Home size={20} /> Home
          </button>
        </div>
      </div>
    </div>
  );
}