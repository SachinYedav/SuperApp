import React, { useState, useRef, useEffect } from 'react';
import { Target, Play } from 'lucide-react';
import useGameEngine from '@/hooks/useGameEngine';
import Button from '@/components/ui/Button';

export default function AimTrainer() {
    const { gameState, setGameState, endGame } = useGameEngine('aim');
    
    const [targetsLeft, setTargetsLeft] = useState(0);
    const [position, setPosition] = useState({ top: '50%', left: '50%' });
    const [startTime, setStartTime] = useState(0);
    const [avgTime, setAvgTime] = useState(0);

    // --- 🔊 AUDIO SYSTEM ---
    const isSoundOn = localStorage.getItem("pref_sound") !== "false";
    const hitSound = useRef(null);
    const finishSound = useRef(null);

    useEffect(() => {
        const loadAudio = (ref, path) => {
            try {
                ref.current = new Audio(path);
                ref.current.volume = 0.5;
                ref.current.load();
            } catch (e) {}
        };

        loadAudio(hitSound, "/assets/sounds/pop.mp3");
        loadAudio(finishSound, "/assets/sounds/success.mp3");
    }, []);

    const playSound = (ref) => {
        if (!isSoundOn || !ref.current) return;
        try {
            ref.current.currentTime = 0;
            ref.current.play().catch(() => {});
        } catch (e) {}
    };

    // --- GAME LOGIC ---

    const startGame = () => {
        setTargetsLeft(15);
        setGameState('playing');
        setStartTime(Date.now());
        moveTarget();
    };

    const moveTarget = () => {
        const top = Math.floor(Math.random() * 80) + 10;
        const left = Math.floor(Math.random() * 80) + 10;
        setPosition({ top: `${top}%`, left: `${left}%` });
    };

    const hitTarget = (e) => {
        e.stopPropagation();
        
        playSound(hitSound); 

        if (targetsLeft > 1) {
            setTargetsLeft(t => t - 1);
            moveTarget();
        } else {
            playSound(finishSound); 
            
            const endTime = Date.now();
            const duration = endTime - startTime;
            const finalAvg = Math.round(duration / 15);
            setAvgTime(finalAvg);
            
            endGame(finalAvg); 
        }
    };

    return (
        <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center relative z-10">
            
            {/* IDLE STATE */}
            {gameState === 'idle' && (
                <div className="text-center animate-fade-in bg-slate-900/80 p-10 rounded-3xl border border-slate-700 shadow-2xl backdrop-blur-md">
                    <Target size={64} className="text-blue-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-white mb-2">Aim Trainer</h2>
                    <p className="text-slate-400 mb-8">Hit 15 targets as fast as you can.</p>
                    <Button onClick={startGame} size="lg" className="mx-auto gap-2">
                        <Play size={20} fill="currentColor"/> Start Game
                    </Button>
                </div>
            )}

            {/* PLAYING STATE */}
            {gameState === 'playing' && (
                <div className="relative w-full max-w-4xl h-[500px] bg-slate-900/50 rounded-3xl border border-slate-700 overflow-hidden cursor-crosshair shadow-2xl backdrop-blur-sm select-none">
                    <div className="absolute top-4 left-6 text-slate-500 font-mono text-xs font-bold tracking-widest pointer-events-none">
                        REMAINING: {targetsLeft}
                    </div>
                    
                    {/* The Target */}
                    <div 
                        onMouseDown={hitTarget}
                        style={{ top: position.top, left: position.left }}
                        className="absolute w-14 h-14 -ml-7 -mt-7 rounded-full bg-blue-500 border-4 border-slate-900 shadow-[0_0_25px_rgba(59,130,246,0.8)] flex items-center justify-center hover:scale-95 active:scale-90 transition-transform duration-75 cursor-pointer z-20"
                    >
                        <div className="w-8 h-8 rounded-full border-2 border-white/60"></div>
                        <div className="w-2 h-2 bg-white rounded-full absolute"></div>
                    </div>
                </div>
            )}

            {/* GAME OVER STATE */}
            {gameState === 'gameOver' && (
                <div className="text-center animate-scale-in bg-slate-900/80 p-10 rounded-3xl border border-slate-700 shadow-2xl">
                    <div className="text-6xl mb-4">🎯</div>
                    <h2 className="text-3xl font-bold text-white mb-1">Training Complete</h2>
                    <p className="text-slate-400 text-sm mb-6">Average time per target</p>
                    
                    <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-blue-300 to-blue-600 mb-8">
                        {avgTime}<span className="text-2xl text-slate-500 ml-2">ms</span>
                    </div>
                    
                    <Button onClick={startGame} className="mx-auto">Try Again</Button>
                </div>
            )}
        </div>
    );
}