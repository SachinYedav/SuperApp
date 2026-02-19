import React, { useState, useEffect, useRef } from "react";
import { Brain, RefreshCw, Play } from "lucide-react";
import useGameEngine from "@/hooks/useGameEngine";
import Button from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import GameContainer from "../GameContainer";

export default function MemoryMatrix() {
  const { gameState, setGameState, endGame } = useGameEngine("memory");

  const [grid, setGrid] = useState([]);
  const [pattern, setPattern] = useState([]);
  const [userPattern, setUserPattern] = useState([]);
  const [phase, setPhase] = useState("idle");
  const [level, setLevel] = useState(1);
  const [levelFlash, setLevelFlash] = useState(false);

  // --- AUDIO SYSTEM ---
  const isSoundOn = localStorage.getItem("pref_sound") !== "false"; 

  const correctSound = useRef(null);
  const wrongSound = useRef(null);
  const showSound = useRef(null);
  const levelUpSound = useRef(null);

  useEffect(() => {
    const loadAudio = (ref, path) => {
      try {
        ref.current = new Audio(path);
        ref.current.volume = 0.6; 
        ref.current.load();
      } catch (err) {
        // Silently fail if audio blocked
      }
    };

    loadAudio(correctSound, "/assets/sounds/pop.mp3"); 
    loadAudio(wrongSound, "/assets/sounds/error.mp3");
    loadAudio(showSound, "/assets/sounds/tick.mp3");
    loadAudio(levelUpSound, "/assets/sounds/success.mp3");
  }, []);

  const playSound = async (ref) => {
    if (!isSoundOn || !ref.current) return;
    try {
      ref.current.currentTime = 0; 
      await ref.current.play();
    } catch (err) { /* Ignore auto-play errors */ }
  };

  // --- GAME LOGIC ---
  const roundIdRef = useRef(0);
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  const computeSize = (lvl) => {
    if (lvl >= 9) return 5;
    if (lvl >= 4) return 4;
    return 3;
  };

  const startGame = () => {
    roundIdRef.current++; 
    setGameState("playing");
    setLevel(1);
    startRound(1);
  };

  const startRound = async (lvl) => {
    const roundId = ++roundIdRef.current;
    setPhase("showing");
    setUserPattern([]);

    const size = computeSize(lvl);
    const totalSlots = size * size;
    setGrid(Array(totalSlots).fill(false));

    // Smart Difficulty: Cap tiles at 65% of grid size
    const maxTiles = Math.floor(totalSlots * 0.65);
    const baseTiles = 2 + lvl; 
    const tilesCount = Math.min(baseTiles, maxTiles);

    const newPattern = generateUniquePattern(totalSlots, tilesCount);
    setPattern(newPattern);

    const flashSpeed = Math.max(300, 600 - lvl * 30);
    const gapSpeed = 150;

    await sleep(500);

    for (let i = 0; i < newPattern.length; i++) {
      if (roundId !== roundIdRef.current) return;

      const tempGrid = Array(totalSlots).fill(false);
      tempGrid[newPattern[i]] = true;
      setGrid(tempGrid);
      playSound(showSound);

      await sleep(flashSpeed);

      setGrid(Array(totalSlots).fill(false));
      await sleep(gapSpeed);
    }

    if (roundId !== roundIdRef.current) return;
    setPhase("input");
  };

  const generateUniquePattern = (totalSlots, count) => {
    const nums = new Set();
    while (nums.size < count) {
      nums.add(Math.floor(Math.random() * totalSlots));
    }
    return Array.from(nums);
  };

  const handleTileClick = (index) => {
    if (phase !== "input") return;

    if (pattern.includes(index)) {
      if (!userPattern.includes(index)) {
        const updated = [...userPattern, index];
        setUserPattern(updated);

        const newGrid = [...grid];
        newGrid[index] = true;
        setGrid(newGrid);
        playSound(correctSound);

        if (updated.length === pattern.length) {
          setPhase("complete");
          setLevelFlash(true);
          playSound(levelUpSound);
          
          setTimeout(() => setLevelFlash(false), 400);
          setTimeout(() => {
            const nextLvl = level + 1;
            setLevel(nextLvl);
            startRound(nextLvl);
          }, 800);
        }
      }
    } else {
      playSound(wrongSound);
      setPhase("gameOver");
      endGame(level);
    }
  };

  // --- RENDER ---
  const currentSize = computeSize(level);
  
  const getGridClass = (sz) => {
    if (sz === 3) return "grid-cols-3 max-w-[260px]";
    if (sz === 4) return "grid-cols-4 max-w-[320px]";
    return "grid-cols-5 max-w-[360px]";
  };

  return (
    <GameContainer title="Memory Matrix" subtitle={`Level ${level}`}>
      
      {/* IDLE SCREEN */}
      {gameState === "idle" && (
        <div className="text-center absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-sm rounded-3xl p-6 animate-fade-in">
          <div className="p-4 bg-purple-500/20 rounded-2xl mb-4 text-purple-400">
            <Brain size={48} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Memory Matrix</h2>
          <p className="text-slate-400 mb-6 text-sm max-w-xs">
            Memorize the pattern. The grid expands as you level up!
          </p>
          <Button onClick={startGame} className="bg-purple-600 hover:bg-purple-500 w-full max-w-[200px] gap-2">
            <Play size={18} fill="currentColor"/> Start Game
          </Button>
        </div>
      )}

      {/* GAME OVER SCREEN */}
      {gameState === "gameOver" && (
        <div className="text-center absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-sm rounded-3xl animate-scale-in">
          <h2 className="text-3xl font-bold text-white mb-2">Game Over</h2>
          <div className="text-6xl font-black text-purple-500 mb-2">{level}</div>
          <p className="text-slate-400 mb-8 uppercase tracking-widest text-xs font-bold">
            Level Reached
          </p>
          <Button onClick={startGame} className="gap-2 bg-purple-600 hover:bg-purple-500">
            <RefreshCw size={18} /> Try Again
          </Button>
        </div>
      )}

      {/* THE GRID */}
      <div className={cn("grid gap-3 mx-auto transition-all duration-300 p-4", getGridClass(currentSize))}>
        {Array(currentSize * currentSize).fill(0).map((_, i) => (
            <div
              key={i}
              onClick={() => handleTileClick(i)}
              className={cn(
                "aspect-square rounded-xl transition-all duration-150 cursor-pointer border-b-4 active:border-b-0 active:translate-y-1 shadow-lg",
                // Dynamic Sizing
                currentSize === 3 ? "w-16 h-16 md:w-20 md:h-20" : currentSize === 4 ? "w-14 h-14 md:w-16 md:h-16" : "w-10 h-10 md:w-14 md:h-14",
                
                grid[i]
                  ? "bg-purple-500 border-purple-700 shadow-[0_0_20px_rgba(168,85,247,0.6)] scale-105 z-10"
                  : "bg-slate-800 border-slate-700 hover:bg-slate-750"
              )}
            />
          ))}
      </div>

      {/* STATUS TEXT */}
      <div className="text-center mt-4 h-6">
        <span className={cn("text-xs font-bold uppercase tracking-widest transition-all", phase === "showing" ? "text-yellow-400 animate-pulse" : phase === "input" ? "text-green-400" : "text-slate-500", levelFlash && "scale-125 text-purple-400")}>
          {phase === "showing" ? "Watch Pattern..." : phase === "input" ? "Your Turn" : ""}
        </span>
      </div>
    </GameContainer>
  );
}