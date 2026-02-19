import React, { useState, useRef, useEffect } from 'react';
import { Zap, Timer, MousePointer2, RotateCcw } from 'lucide-react';
import useGameEngine from '@/hooks/useGameEngine'; 
import Button from '@/components/ui/Button';
import { cn } from '@/utils/cn';

export default function ReactionTime() {
  const { gameState, setGameState, endGame } = useGameEngine('reaction');
  const [status, setStatus] = useState('waiting'); 
  const [startTime, setStartTime] = useState(0);
  const [resultMs, setResultMs] = useState(0);
  const timerRef = useRef(null);

  // --- 🔊 AUDIO SYSTEM START ---
  const tickSound = useRef(null);    // Green signal
  const errorSound = useRef(null);   // Too soon
  const successSound = useRef(null); // Success click

  useEffect(() => {
    const loadAudio = (ref, path) => {
      try {
        ref.current = new Audio(path);
        ref.current.volume = 0.6; // 60% Volume
        ref.current.load();       // Preload
      } catch (err) {
        // Silent fail if audio missing
      }
    };

    // Initialize sounds once on mount
    loadAudio(tickSound, "/assets/sounds/tick.mp3");
    loadAudio(errorSound, "/assets/sounds/error.mp3");
    loadAudio(successSound, "/assets/sounds/pop.mp3");

    return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const playSound = (ref) => {
    const isSoundOn = localStorage.getItem("pref_sound") !== "false";
    
    if (!isSoundOn || !ref.current) return;

    try {
      ref.current.currentTime = 0; // Reset for rapid replay
      ref.current.play().catch(() => {}); // Catch auto-play errors
    } catch (e) { /* Ignore */ }
  };
  // ---  AUDIO SYSTEM END ---

  const startRound = () => {
    setGameState('playing');
    setStatus('waiting');
    
    // Random delay 2-5 seconds
    const randomTime = Math.floor(Math.random() * 3000) + 2000; 
    timerRef.current = setTimeout(() => {
      setStatus('ready');
      setStartTime(Date.now());
      playSound(tickSound); 
    }, randomTime);
  };

  const handleClick = () => {
    if (gameState === 'idle') {
        startRound();
        return;
    }

    if (status === 'waiting' && gameState === 'playing') {
        clearTimeout(timerRef.current);
        playSound(errorSound); 
        setGameState('failed'); 
    } else if (status === 'ready' && gameState === 'playing') {
        const endTime = Date.now();
        const score = endTime - startTime;
        setResultMs(score);
        playSound(successSound); 
        endGame(score); 
    }
  };

  // --- UI LOGIC (No Changes) ---
  let bgClass = "bg-slate-900 border-slate-800";
  let content = null;

  if (gameState === 'idle') {
      content = (
        <div className="text-center animate-fade-in">
           <MousePointer2 size={64} className="text-purple-500 mx-auto mb-6" />
           <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Reaction Time</h1>
           <p className="text-slate-400 text-lg">When the red box turns green, click as fast as you can.</p>
           <div className="mt-8 text-sm text-slate-500 font-bold uppercase tracking-widest animate-pulse">Click anywhere to start</div>
        </div>
      );
  } else if (gameState === 'failed') {
      bgClass = "bg-slate-800";
      content = (
        <div className="text-center animate-scale-in">
           <h1 className="text-3xl font-bold text-red-500 mb-4">Too Soon!</h1>
           <p className="text-slate-400 mb-6">You clicked before it turned green.</p>
           <Button onClick={startRound} variant="outline">Try Again</Button>
        </div>
      );
  } else if (gameState === 'gameOver') {
      content = (
        <div className="text-center animate-scale-in">
           <div className="flex justify-center mb-4"><Zap size={50} className="text-yellow-400" /></div>
           <h1 className="text-6xl font-mono font-black text-white mb-2">{resultMs} ms</h1>
           <p className="text-slate-400 mb-8">Your reaction speed</p>
           <Button onClick={startRound} size="lg" className="gap-2">
              <RotateCcw size={18}/> Play Again
           </Button>
        </div>
      );
  } else if (status === 'waiting') {
      bgClass = "bg-red-600 cursor-wait";
      content = (
        <div className="text-center">
           <Timer size={80} className="text-white/50 mx-auto mb-6 animate-pulse" />
           <h1 className="text-5xl font-black text-white tracking-wider">WAIT FOR GREEN...</h1>
        </div>
      );
  } else if (status === 'ready') {
      bgClass = "bg-green-500 cursor-pointer";
      content = (
        <div className="text-center">
           <h1 className="text-6xl font-black text-white tracking-wider drop-shadow-lg">CLICK!</h1>
        </div>
      );
  }

  return (
    <div 
      onMouseDown={handleClick}
      className={cn(
        "w-full h-full min-h-[500px] flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 select-none relative z-10 rounded-3xl overflow-hidden",
        bgClass
      )}
    >
       {content}
    </div>
  );
}