import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Map, Ghost } from 'lucide-react';
import Button from '@/components/ui/Button';
import Seo from '@/components/seo/Seo';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="h-full min-h-[80vh] w-full bg-slate-950 rounded-3xl border border-slate-800 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <Seo 
        title="404 - Page Not Found"
        description="The page you are looking for does not exist or has been moved."
        url={window.location.href} 
        type="website"
      />
      
      {/* Grid Background Effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
            backgroundImage: `linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
        }}
      >
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_100%)]" />
      </div>

      <div className="relative z-10 text-center animate-fade-in max-w-lg">
        {/* Glitch Effect Text */}
        <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-2 drop-shadow-2xl">
          404
        </h1>
        
        <div className="flex justify-center mb-6">
            <div className="p-6 bg-slate-900/50 rounded-full border border-slate-700 shadow-2xl animate-bounce">
                <Ghost size={64} className="text-slate-400" />
            </div>
        </div>

        <h2 className="text-3xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-slate-400 mb-8 leading-relaxed">
          Oops! The page you are looking for has vanished into the digital void. 
          It might have been moved, deleted, or never existed.
        </p>

        <div className="flex gap-4 justify-center">
          <Button onClick={() => navigate('/')} className="bg-purple-600 hover:bg-purple-500 gap-2 px-6">
            <Home size={18} /> Go Home
          </Button>
          <Button onClick={() => navigate(-1)} variant="outline" className="gap-2 px-6">
            <Map size={18} /> Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}