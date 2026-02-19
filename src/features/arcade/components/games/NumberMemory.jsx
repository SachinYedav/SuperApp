import React, { useState, useEffect, useRef } from 'react';
import { Hash } from 'lucide-react';
import useGameEngine from '@/hooks/useGameEngine';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import GameContainer from '../GameContainer';

export default function NumberMemory() {
  const { gameState, setGameState, endGame } = useGameEngine('number');
  const [phase, setPhase] = useState('idle'); 
  const [level, setLevel] = useState(1);
  const [number, setNumber] = useState('');
  const [input, setInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  
  // --- 🔊 AUDIO SYSTEM ---
  const isSoundOn = localStorage.getItem("pref_sound") !== "false";
  const correctSound = useRef(null);
  const errorSound = useRef(null);
  const tickSound = useRef(null);
  const levelSound = useRef(null);

  useEffect(() => {
    const loadAudio = (ref, path) => {
      try {
        ref.current = new Audio(path);
        ref.current.volume = 0.5;
        ref.current.load();
      } catch (e) {}
    };

    loadAudio(correctSound, "/assets/sounds/pop.mp3");
    loadAudio(errorSound, "/assets/sounds/error.mp3");
    loadAudio(tickSound, "/assets/sounds/tick.mp3");
    loadAudio(levelSound, "/assets/sounds/success.mp3");
  }, []);

  const playSound = (ref) => {
    if (!isSoundOn || !ref.current) return;
    try {
      ref.current.currentTime = 0;
      ref.current.play().catch(() => {});
    } catch (e) {}
  };

  // --- GAME LOGIC ---

  // Progress Bar Animation & Sound
  useEffect(() => {
    if (phase === 'memorize') {
      const time = 2000 + (level * 500); 
      setTimeLeft(100);
      
      const interval = setInterval(() => {
         setTimeLeft((prev) => {
             const newVal = Math.max(0, prev - (100 / (time / 100)));
             if (newVal < 20 && newVal > 0 && Math.floor(newVal) % 5 === 0) {
                 playSound(tickSound);
             }
             return newVal;
         });
      }, 100);

      const timeout = setTimeout(() => {
         setPhase('input');
      }, time);

      return () => { clearTimeout(timeout); clearInterval(interval); };
    }
  }, [phase, level]);

  const startGame = () => {
    setGameState('playing');
    setLevel(1);
    startLevel(1);
  };

  const startLevel = (lvl) => {
    playSound(levelSound); 
    const nextNum = Math.floor(Math.random() * (9 * Math.pow(10, lvl - 1))) + Math.pow(10, lvl - 1);
    setNumber(nextNum.toString());
    setInput('');
    setPhase('memorize');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input === number) {
       playSound(correctSound); 
       setLevel(l => l + 1);
       startLevel(level + 1);
    } else {
       playSound(errorSound);
       endGame(level); 
       setPhase('gameOver');
    }
  };

  return (
    <GameContainer>
       {gameState === 'idle' && (
          <div className="text-center animate-fade-in">
             <div className="p-4 bg-yellow-500/20 text-yellow-500 rounded-2xl w-fit mx-auto mb-4"><Hash size={40}/></div>
             <h2 className="text-2xl font-bold text-white mb-2">Number Memory</h2>
             <p className="text-slate-400 mb-6 text-sm">Memorize the number before time runs out.</p>
             <Button onClick={startGame} className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold w-full max-w-[200px]">Start Test</Button>
          </div>
       )}

       {phase === 'memorize' && (
          <div className="py-10 text-center animate-scale-in">
             <div className="text-5xl sm:text-7xl font-black text-white mb-10 tracking-widest select-none">{number}</div>
             <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 transition-all duration-100 ease-linear" style={{ width: `${timeLeft}%` }}></div>
             </div>
             <p className="text-slate-500 text-xs mt-4 uppercase tracking-widest font-bold">Memorize...</p>
          </div>
       )}

       {phase === 'input' && (
          <form onSubmit={handleSubmit} className="py-6 text-center animate-fade-in">
             <p className="text-slate-400 mb-4 text-sm">What was the number?</p>
             <Input 
                type="number" 
                value={input}
                onChange={e => setInput(e.target.value)}
                className="text-center text-3xl text-white font-mono tracking-widest mb-6 h-16 bg-slate-900 border-slate-600 focus:border-yellow-500 rounded-2xl"
                autoFocus
                placeholder="123..."
             />
             <Button type="submit" className="w-full bg-white text-slate-900 hover:bg-slate-200 font-bold">Submit</Button>
          </form>
       )}

       {phase === 'gameOver' && (
          <div className="animate-scale-in text-center">
             <div className="text-red-500 text-lg font-bold mb-2">Game Over</div>
             <div className="text-4xl font-bold text-white mb-6">Level {level}</div>
             
             <div className="bg-slate-950 p-4 rounded-xl text-left space-y-3 border border-slate-800 mb-6 shadow-inner">
                <div className="flex justify-between text-sm">
                   <span className="text-slate-500">Correct Number:</span>
                   <span className="text-green-400 font-mono tracking-wider font-bold">{number}</span>
                </div>
                <div className="flex justify-between text-sm">
                   <span className="text-slate-500">Your Answer:</span>
                   <span className="text-red-400 font-mono tracking-wider line-through decoration-2 decoration-red-500/50">{input}</span>
                </div>
             </div>
             
             <Button onClick={startGame} className="bg-slate-800 hover:bg-slate-700 mx-auto w-full max-w-[200px]">Try Again</Button>
          </div>
       )}
    </GameContainer>
  );
}