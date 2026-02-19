import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Coffee,
  Zap,
  Moon,
  Volume2,
} from "lucide-react";
import { AMBIENT_SOUNDS } from "../constants";
import { cn } from "@/utils/cn";
import { Button, SelectionCard } from '@/components/ui/index'

export default function FocusTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState("focus");
  const [activeSound, setActiveSound] = useState(null);

  const audioRef = useRef(new Audio());
  const alarmRef = useRef(new Audio("/assets/sounds/alarm.mp3"));

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      alarmRef.current.play();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const switchMode = (newMode, minutes) => {
    setMode(newMode);
    setTimeLeft(minutes * 60);
    setIsActive(false);
  };

  const toggleSound = (soundUrl, id) => {
    if (activeSound === id) {
      audioRef.current.pause();
      setActiveSound(null);
    } else {
      audioRef.current.src = soundUrl;
      audioRef.current.loop = true;
      audioRef.current.play();
      setActiveSound(id);
    }
  };

  useEffect(() => {
    return () => {
      audioRef.current.pause();
      alarmRef.current.pause();
    };
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="h-full flex flex-col items-center justify-center animate-fade-in max-w-xl mx-auto w-full">
      {/* Timer Display */}
      <div className="relative group mb-10">
        <div className="w-72 h-72 rounded-full border-[8px] border-slate-100 dark:border-slate-800 flex items-center justify-center relative shadow-2xl bg-white dark:bg-slate-900">
          <span
            className={cn(
              "text-7xl font-mono font-bold tracking-tighter transition-colors",
              isActive
                ? "text-blue-600 dark:text-blue-400"
                : "text-slate-700 dark:text-slate-200",
            )}
          >
            {formatTime(timeLeft)}
          </span>
          {isActive && (
            <div className="absolute inset-0 border-[8px] border-blue-500 rounded-full border-t-transparent animate-spin-slow opacity-50"></div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-10">
        <Button
          onClick={() => setIsActive(!isActive)}
          className={cn(
            "px-10 py-4 h-auto text-xl rounded-2xl shadow-xl",
            isActive
              ? "bg-orange-500 hover:bg-orange-600"
              : "bg-blue-600 hover:bg-blue-700",
          )}
        >
          {isActive ? (
            <Pause fill="currentColor" className="mr-2" />
          ) : (
            <Play fill="currentColor" className="mr-2" />
          )}{" "}
          {isActive ? "Pause" : "Start"}
        </Button>

        <Button
          onClick={() =>
            switchMode(mode, mode === "focus" ? 25 : mode === "short" ? 5 : 15)
          }
          variant="outline"
          className="h-auto py-4 rounded-2xl"
        >
          <RotateCcw />
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full mb-8">
        <SelectionCard
          label="Focus"
          icon={Zap}
          isActive={mode === "focus"}
          onClick={() => switchMode("focus", 25)}
        />
        <SelectionCard
          label="Short Break"
          icon={Coffee}
          isActive={mode === "short"}
          onClick={() => switchMode("short", 5)}
        />
        <SelectionCard
          label="Long Break"
          icon={Moon}
          isActive={mode === "long"}
          onClick={() => switchMode("long", 15)}
        />
      </div>

      {/* Ambient Sounds */}
      <div className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <p className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
          <Volume2 size={14} /> Ambient Sounds
        </p>
        <div className="flex gap-3">
          {AMBIENT_SOUNDS.map((s) => (
            <Button
              key={s.id}
              onClick={() => toggleSound(s.url, s.id)}
              variant={activeSound === s.id ? "primary" : "outline"}
              className={cn(
                "flex-1 py-2 text-xs font-bold h-10",
                activeSound === s.id
                  ? "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
                  : "bg-white border-transparent hover:border-slate-300 dark:bg-slate-800",
              )}
            >
              {s.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
