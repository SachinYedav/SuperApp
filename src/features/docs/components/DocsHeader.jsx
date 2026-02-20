import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Command, Search, X } from 'lucide-react';
import { DocsSearchBar, ThemeToggle } from "@/components/ui/index";
import Logo from '@/assets/Logo';

export default function DocsHeader() {
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    
    // Ref for the search container to detect outside clicks
    const searchContainerRef = useRef(null);

    // Click-Outside Logic
    useEffect(() => {
        function handleClickOutside(event) {
            // Agar click search container ke bahar hua hai, toh close kar do
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setIsMobileSearchOpen(false);
            }
        }

        if (isMobileSearchOpen) {
            // Event listeners for both mouse and touch devices
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside);
        }

        // Cleanup function (React best practice to prevent memory leaks)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [isMobileSearchOpen]);

    return (
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between transition-colors duration-300">
            
            {/* =========================================
                STATE 1: MOBILE EXPANDED SEARCH 
            ========================================= */}
            {isMobileSearchOpen ? (
                <div className="flex w-full items-center animate-in fade-in zoom-in-95 duration-200">
                    <div 
                        ref={searchContainerRef} 
                        className="flex-1 relative group w-full"
                    >
                        {/* Glow effect */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl blur opacity-100 transition duration-500"></div>
                        
                        <div className="relative flex items-center w-full">
                            <div className="w-full">
                                <DocsSearchBar />
                            </div>
                            
                            {/* Close (X) Icon placed inside the search container at the end */}
                            <button 
                                onClick={() => setIsMobileSearchOpen(false)}
                                className="absolute right-2 p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg transition-colors active:scale-95 z-10 shadow-sm border border-slate-200 dark:border-slate-700/50"
                                aria-label="Close search"
                            >
                                <X size={16} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                
            /* =========================================
                STATE 2: DEFAULT HEADER (DESKTOP & MOBILE)
            ========================================= */
                <>
                    {/* Left: Mobile Logo (Ab text ke sath poora dikhega) */}
                    <div className="flex items-center md:hidden gap-2 shrink-0">
                        {/* showText hataya taaki by default true rahe aur poora logo dikhe */}
                        <Logo iconSize="w-8 h-8" textSize="text-xl" />
                        <Link to="/docs" className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider hidden xs:block">
                            Docs
                        </Link>
                    </div>

                    {/* Center: Desktop Docs Search Bar (Hidden on Mobile) */}
                    <div className="hidden sm:flex flex-1 max-w-xl justify-center ml-4 md:ml-0">
                        <div className="w-full relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
                            <div className="relative">
                                <DocsSearchBar />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1 px-2 py-1 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-[9px] text-slate-400 font-bold pointer-events-none shadow-sm">
                                    <Command size={10} /> K
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Actions & Theme Toggle */}
                    <div className="flex items-center gap-1 sm:gap-4 ml-auto shrink-0">
                        
                        {/* Mobile Search Trigger Icon */}
                        <button 
                            onClick={() => setIsMobileSearchOpen(true)}
                            className="sm:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors active:scale-95"
                            aria-label="Open search"
                        >
                            <Search size={20} />
                        </button>

                        <Link to="/" className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-slate-500 hover:text-blue-600 transition-colors bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg">
                            <ArrowLeft size={14} /> <span className="hidden lg:inline">Back to App</span>
                        </Link>
                        
                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block opacity-50"></div>
                        
                        <div className="relative flex items-center pr-1 sm:pr-0">
                            <ThemeToggle />
                        </div>
                    </div>
                </>
            )}
        </header>
    );
}