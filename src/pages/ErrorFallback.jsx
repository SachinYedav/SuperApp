import React from 'react';
import { AlertTriangle, RefreshCw, Home, Terminal } from 'lucide-react';
import Button from '@/components/ui/Button';
import OfflinePage from './OfflinePage';
import Seo from '@/components/seo/Seo';

export default function ErrorFallback({ error, resetErrorBoundary }) {
  const isChunkError = 
    error.message.includes('Loading chunk') || 
    error.message.includes('Importing a module script failed') ||
    error.name === 'ChunkLoadError';

  if (isChunkError) {
    return <OfflinePage />;
  }


  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <Seo 
        title="Unexpected Error"
        description="Something went wrong. Please refresh the page or contact support if the issue persists."
        type="website"
      />
      
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
            backgroundImage: `linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            backgroundPosition: 'center center'
        }}
      >
         {/* Vignette Overlay for Depth */}
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_100%)]" />
      </div>

      {/* Red Ambient Glow behind content */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 text-center animate-fade-in max-w-2xl w-full">
        
        {/* Animated Icon */}
        <div className="flex justify-center mb-6">
            <div className="p-6 bg-red-500/10 rounded-full border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.2)] animate-pulse">
                <AlertTriangle size={64} className="text-red-500" />
            </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
          System Error
        </h1>
        <p className="text-slate-400 mb-8 text-lg">
          The application encountered a critical issue and stopped working.
        </p>

        {/* Error Terminal Box */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden mb-8 text-left shadow-2xl relative group">
            <div className="bg-slate-800/50 px-4 py-2 flex items-center gap-2 border-b border-slate-700/50">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <span className="text-xs font-mono text-slate-500 ml-2 flex items-center gap-1">
                    <Terminal size={10} /> crash_log.txt
                </span>
            </div>
            
            <div className="p-4 overflow-auto max-h-48 custom-scrollbar">
                <code className="text-red-400 font-mono text-sm break-all">
                    {">"} Error: {error.message || "Unknown Runtime Error"}
                </code>
                {error.stack && (
                    <pre className="text-slate-500 text-xs mt-2 font-mono whitespace-pre-wrap leading-relaxed opacity-70">
                        {error.stack.split('\n').slice(0, 3).join('\n')}...
                    </pre>
                )}
            </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={resetErrorBoundary} 
            className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 gap-2 shadow-lg shadow-red-500/20"
          >
            <RefreshCw size={18} /> Reload Application
          </Button>
          
          <Button 
            onClick={() => window.location.href = '/'} 
            variant="outline" 
            className="px-8 py-3 gap-2 border-slate-700 hover:bg-slate-800 text-slate-300"
          >
            <Home size={18} /> Back to Safety
          </Button>
        </div>
      </div>
    </div>
  );
}