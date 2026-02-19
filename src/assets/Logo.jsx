import React from "react";
import { Link } from "react-router-dom";

export default function Logo({ 
  className = "", 
  iconSize = "w-7 h-7", 
  textSize = "text-xl",
  showText = true 
}) {
  return (
    <Link 
      to="/" 
      className={`flex items-center gap-2.5 group transition-transform active:scale-95 outline-none ${className}`}
    >
      <div className={`relative flex items-center justify-center shrink-0 ${iconSize}`}>
        <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-500/30 blur-md rounded-full -z-10 group-hover:bg-blue-500/50 group-hover:blur-lg transition-all duration-500"></div>
        
        <img 
          src="/assets/icons/logo.png" 
          alt="SuperApp Logo" 
          className="w-full h-full object-contain drop-shadow-sm group-hover:drop-shadow-xl transition-all duration-300 group-hover:rotate-[8deg] group-hover:scale-110" 
        />
      </div>

      {showText && (
        <span 
          className={`font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-violet-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-fuchsia-400 ${textSize}`}
          style={{ paddingRight: '2px' }}
        >
          SuperApp
        </span>
      )}
    </Link>
  );
}