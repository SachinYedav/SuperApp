import React, { useState, useEffect, useRef } from 'react';
import { Bell, Sparkles } from 'lucide-react';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all active:scale-95 group"
        aria-label="Notifications"
      >
        <Bell size={20} className="group-hover:text-blue-500 transition-colors" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="
            fixed sm:absolute
            left-0 sm:left-auto
            right-0 sm:right-0
            top-16 sm:top-full
            mt-0 sm:mt-3
            w-full sm:w-80
            bg-white dark:bg-slate-900
            border border-slate-200 dark:border-slate-800
            shadow-2xl
            rounded-none sm:rounded-2xl
            overflow-hidden
            z-50
            animate-fade-in-up
          "
        >

          {/* Header */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
            <h3 className="font-bold text-slate-800 dark:text-white">Notifications</h3>
          </div>

          {/* Coming Soon Body */}
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4 relative">
                <Bell size={28} className="text-blue-500" />
                {/* Decorative sparkle */}
                <Sparkles size={16} className="text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            
            <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1">
                Coming Soon!
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-[200px]">
                We are building a smart notification center to keep you updated. Stay tuned!
            </p>
          </div>

        </div>
      )}
    </div>
  );
}