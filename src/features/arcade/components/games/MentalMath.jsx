import React, { useState, useEffect, useRef } from 'react';
import { Calculator } from 'lucide-react';
import useGameEngine from '@/hooks/useGameEngine';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import GameContainer from '../GameContainer';

export default function MentalMath() {
    const { gameState, setGameState, endGame } = useGameEngine('math');
    const [question, setQuestion] = useState({ text: '', ans: 0 });
    const [input, setInput] = useState('');
    const [scoreCount, setScoreCount] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const inputRef = useRef(null);

    // --- 🔊 AUDIO SYSTEM ---
    const isSoundOn = localStorage.getItem("pref_sound") !== "false";
    const correctSound = useRef(null);
    const timeoutSound = useRef(null);
    const tickSound = useRef(null);

    useEffect(() => {
        const loadAudio = (ref, path) => {
            try {
                ref.current = new Audio(path);
                ref.current.volume = 0.6;
                ref.current.load();
            } catch (e) {}
        };

        loadAudio(correctSound, "/assets/sounds/pop.mp3");
        loadAudio(timeoutSound, "/assets/sounds/error.mp3");
        loadAudio(tickSound, "/assets/sounds/tick.mp3");
    }, []);

    const playSound = (ref) => {
        if (!isSoundOn || !ref.current) return;
        try {
            ref.current.currentTime = 0;
            ref.current.play().catch(() => {});
        } catch (e) {}
    };

    // --- GAME LOGIC ---

    useEffect(() => {
        let timer = null;
        if (gameState === 'playing' && timeLeft > 0) {
            timer = setTimeout(() => {
                setTimeLeft(t => t - 1);
                if (timeLeft <= 10) playSound(tickSound);
            }, 1000);
        } else if (timeLeft === 0 && gameState === 'playing') {
            playSound(timeoutSound); // 🔊 Time Up
            endGame(scoreCount); 
        }
        return () => clearTimeout(timer);
    }, [timeLeft, gameState, scoreCount, endGame]);

    const generateQuestion = () => {
        const ops = ['+', '-', '*'];
        const op = ops[Math.floor(Math.random() * 3)];
        let a = Math.floor(Math.random() * 20) + 2;
        let b = Math.floor(Math.random() * 20) + 2;
        
        if (op === '*') { a = Math.floor(Math.random() * 12) + 2; b = Math.floor(Math.random() * 9) + 2; }
        if (op === '-' && b > a) [a, b] = [b, a]; // Ensure positive result

        const ans = eval(`${a} ${op} ${b}`); 

        setQuestion({ text: `${a} ${op} ${b}`, ans });
        setInput('');
    };

    const startGame = () => {
        setScoreCount(0);
        setTimeLeft(30);
        setGameState('playing');
        generateQuestion();
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (parseInt(input) === question.ans) {
            playSound(correctSound);
            setScoreCount(s => s + 1);
            generateQuestion();
        } else {
            setInput(''); 
        }
    };

    // --- RENDER ---

    return (
        <GameContainer>
            {gameState === 'idle' && (
                <div className="text-center animate-fade-in">
                    <div className="p-4 bg-orange-500/20 text-orange-500 rounded-2xl w-fit mx-auto mb-4"><Calculator size={40}/></div>
                    <h2 className="text-2xl font-bold text-white mb-2">Mental Math</h2>
                    <p className="text-slate-400 mb-8 text-sm">Solve as many as you can in 30 seconds.</p>
                    <Button onClick={startGame} className="bg-orange-600 hover:bg-orange-500 px-8 w-full max-w-[200px]">Start Calculating</Button>
                </div>
            )}

            {gameState === 'playing' && (
                <div className="text-center">
                    <div className="flex justify-between items-center text-slate-400 font-bold mb-8 px-4">
                        <span>Score: <span className="text-white">{scoreCount}</span></span>
                        <span className={`${timeLeft < 10 ? 'text-red-500 animate-pulse scale-110' : 'text-white'} transition-all`}>
                            00:{timeLeft.toString().padStart(2, '0')}
                        </span>
                    </div>
                    
                    <div className="text-5xl sm:text-6xl font-black text-white mb-10 tracking-widest font-mono">
                        {question.text} = ?
                    </div>

                    <form onSubmit={handleSubmit} className="max-w-xs mx-auto">
                        <Input 
                            ref={inputRef}
                            type="number" 
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            className="text-center text-4xl h-20 bg-slate-800 border-slate-600 focus:border-orange-500 text-white font-mono tracking-widest rounded-2xl"
                            placeholder="?"
                            autoFocus
                        />
                        <p className="text-slate-600 text-xs mt-4">Press Enter to submit</p>
                    </form>
                </div>
            )}

            {gameState === 'gameOver' && (
                <div className="animate-scale-in text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">Time's Up!</h2>
                    <div className="text-7xl font-black text-orange-500 mb-2">{scoreCount}</div>
                    <p className="text-slate-400 mb-8 uppercase tracking-widest text-sm">Correct Answers</p>
                    <Button onClick={startGame} className="bg-slate-800 hover:bg-slate-700 mx-auto w-full max-w-[200px]">Try Again</Button>
                </div>
            )}
        </GameContainer>
    );
}