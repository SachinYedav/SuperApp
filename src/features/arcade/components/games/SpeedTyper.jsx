import React, { useState, useRef, useEffect } from 'react';
import { Trophy, RefreshCw, Keyboard } from 'lucide-react';
import useGameEngine from '@/hooks/useGameEngine';
import Button from '@/components/ui/Button';
import GameContainer from '../GameContainer';
import {getRandomQuote} from '../../utils/textGenerator'


export default function SpeedTyper() {
    const { gameState, setGameState, endGame } = useGameEngine('typing');
    
    const [targetText, setTargetText] = useState("");
    const [input, setInput] = useState('');
    const [startTime, setStartTime] = useState(null);
    const [wpm, setWpm] = useState(0);
    const inputRef = useRef(null);

    // --- 🔊 AUDIO SYSTEM ---
    const isSoundOn = localStorage.getItem("pref_sound") !== "false";
    const keySound = useRef(null);
    const errorSound = useRef(null);
    const successSound = useRef(null);

    useEffect(() => {
        const loadAudio = (ref, path) => {
            try {
                ref.current = new Audio(path);
                ref.current.volume = 0.4; 
                ref.current.load();
            } catch (e) {}
        };

        loadAudio(keySound, "/assets/sounds/tick.mp3");
        loadAudio(errorSound, "/assets/sounds/error.mp3");
        loadAudio(successSound, "/assets/sounds/success.mp3");
    }, []);

    const playSound = (ref) => {
        if (!isSoundOn || !ref.current) return;
        try {
            ref.current.currentTime = 0;
            ref.current.play().catch(() => {});
        } catch (e) {}
    };

    // --- GAME LOGIC ---

    // Initial Setup
    useEffect(() => {
        resetGame();
    }, []);

    const resetGame = () => {
        setTargetText(getRandomQuote());
        setInput('');
        setStartTime(null);
        setWpm(0);
        setGameState('idle'); 
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const handleChange = (e) => {
        const val = e.target.value;
        const length = val.length;
        
        // 1. Start timer on first keystroke
        let currentStartTime = startTime;
        if (!startTime && length === 1) {
            currentStartTime = Date.now();
            setStartTime(currentStartTime);
            setGameState('playing');
        }

        // 2. Sound Logic & Validation
        if (length > input.length) { 
            const lastChar = val[length - 1];
            const targetChar = targetText[length - 1];

            if (lastChar === targetChar) {
                playSound(keySound); 
            } else {
                playSound(errorSound); 
            }
        }
        
        setInput(val);

        // 3. Real-time WPM Calculation
        if (currentStartTime) {
            const timeElapsedMin = (Date.now() - currentStartTime) / 60000;
            if (timeElapsedMin > 0) {
                // Standard WPM: (Characters / 5) / Minutes
                const currentWpm = Math.round((length / 5) / timeElapsedMin);
                setWpm(currentWpm);
            }
        }

        // 4. Check Completion
        if (val === targetText) {
            playSound(successSound); 
            
            // Final Exact Calculation
            const timeMin = (Date.now() - currentStartTime) / 60000;
            const words = targetText.split(' ').length;
            const finalWpm = Math.round(words / timeMin) || 0;
            
            setWpm(finalWpm);
            endGame(finalWpm);
        }
    };

    return (
        <GameContainer>
            {gameState === 'gameOver' ? (
                <div className="text-center animate-scale-in">
                    <div className="inline-block p-4 bg-green-500/20 rounded-full mb-4">
                        <Trophy size={40} className="text-green-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-1">Mission Complete!</h2>
                    <p className="text-slate-400 text-sm mb-6">Your typing speed result</p>
                    
                    <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-green-300 to-green-600 mb-2">{wpm}</div>
                    <div className="text-sm font-bold text-green-500 uppercase tracking-widest mb-8">Words Per Minute</div>
                    
                    <Button onClick={resetGame} size="lg" className="mx-auto gap-2">
                        <RefreshCw size={18}/> Play Again
                    </Button>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="text-center mb-6">
                        <div className="p-3 bg-slate-800 rounded-xl inline-block mb-3"><Keyboard className="text-purple-500"/></div>
                        <h2 className="text-2xl font-bold text-white">Speed Typer</h2>
                        <div className="flex justify-between items-end px-4 mt-2">
                            <p className="text-slate-400 text-sm">Type the sentence below.</p>
                            <div className="text-green-400 font-mono font-bold">{wpm} WPM</div>
                        </div>
                    </div>

                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 relative text-left select-none">
                        <p className="text-xl font-mono text-slate-500 leading-relaxed">
                            {targetText.split('').map((char, i) => {
                                let color = 'text-slate-500';
                                let bg = '';
                                if (i < input.length) {
                                    if (input[i] === char) {
                                        color = 'text-green-400';
                                    } else {
                                        color = 'text-red-500';
                                        bg = 'bg-red-500/10 rounded';
                                    }
                                }
                                // Cursor effect
                                const isCurrent = i === input.length;
                                
                                return (
                                    <span key={i} className={`${color} ${bg} relative`}>
                                        {isCurrent && <span className="absolute -left-0.5 -top-1 h-8 w-0.5 bg-purple-500 animate-pulse"></span>}
                                        {char}
                                    </span>
                                );
                            })}
                        </p>
                    </div>

                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={handleChange}
                        placeholder="Start typing..."
                        className="w-full bg-slate-950 text-white p-4 rounded-xl border-2 border-slate-800 focus:border-purple-500 outline-none font-mono resize-none transition-colors shadow-inner text-lg"
                        rows={3}
                        spellCheck={false}
                        autoFocus
                    />
                </div>
            )}
        </GameContainer>
    );
}