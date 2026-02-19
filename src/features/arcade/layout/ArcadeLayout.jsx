import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ArcadeSidebar from '../components/ArcadeSidebar';
import { ARCADE_GAMES } from '../constants';
import { cn } from '@/utils/cn';

export default function ArcadeLayout({ children }) {
  const { tab } = useParams();
  const navigate = useNavigate();
  const activeGame = tab || 'typing';

  const handleGameChange = (id) => {
    navigate(`/arcade/${id}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-6 h-full lg:h-[calc(100vh-8rem)]">
      
      {/* 1. Left Sidebar */}
      <ArcadeSidebar activeGame={activeGame} onGameChange={handleGameChange} />

      {/* 2. Right Workspace  */}
      <div className="lg:col-span-9 relative bg-slate-950 lg:rounded-3xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        
        {/* --- GRID BACKGROUND  --- */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
             style={{
                 backgroundImage: `
                    linear-gradient(to right, #334155 1px, transparent 1px),
                    linear-gradient(to bottom, #334155 1px, transparent 1px)
                 `,
                 backgroundSize: '40px 40px'
             }}
        >
            {/* Vignette Mask to fade edges */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_100%)]" />
        </div>

        {/* --- MOBILE HEADER (Sticky) --- */}
        <div className="lg:hidden relative z-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 p-3 flex gap-2 overflow-x-auto no-scrollbar">
           {ARCADE_GAMES.map((game) => (
             <button 
               key={game.id}
               onClick={() => handleGameChange(game.id)}
               className={cn(
                 "flex-none px-4 py-2 rounded-full text-xs font-bold border transition-colors flex items-center gap-2",
                 activeGame === game.id 
                   ? 'bg-purple-600 border-purple-500 text-white' 
                   : 'bg-slate-800 border-slate-700 text-slate-400'
               )}
             >
               <game.icon size={14} /> {game.label}
             </button>
           ))}
        </div>

        {/* --- GAME CONTENT CONTAINER --- */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 lg:p-10 w-full">
            {children}
        </div>

      </div>
    </div>
  );
}