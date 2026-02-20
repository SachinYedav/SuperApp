// src/components/ui/SmartSearchBar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Search, Clock, CornerDownLeft, ArrowRight, Loader2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSmartSearch } from '@/hooks/useSmartSearch'; 

export default function SmartSearchBar() {
  const navigate = useNavigate();
  const searchRef = useRef(null);
  
  const { 
    query, 
    setQuery, 
    results, 
    recentSearches, 
    isSearching, 
    addToHistory,
    deleteHistoryItem 
  } = useSmartSearch();

  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  // new  Cmd+K / Ctrl+K Logic
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault(); 
        if (inputRef.current) {
          inputRef.current.focus(); 
          setIsFocused(true); 
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectResult = (item) => {
    addToHistory(item); 
    setQuery('');      
    setIsFocused(false); 
    
    if (item.path) {
        navigate(item.path);
    }
  };

  return (
    <div className="relative hidden md:flex items-center w-96" ref={searchRef}>
      
      {/* 1. INPUT FIELD */}
      <div className={`flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-lg border w-full transition-all duration-200 ${isFocused ? 'border-blue-500 ring-2 ring-blue-100 dark:ring-blue-900/30' : 'border-slate-200 dark:border-slate-700'}`}>
        {isSearching && query ? (
           <Loader2 size={18} className="text-blue-500 animate-spin shrink-0" />
        ) : (
           <Search size={18} className="text-slate-400 shrink-0" />
        )}
        
        <input 
          ref={inputRef} // NAYA: Ref attach kar diya
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search tools, pages, files..." 
          className="bg-transparent border-none outline-none text-sm text-slate-700 dark:text-slate-200 w-full placeholder:text-slate-400"
        />
        
        {/* Keyboard shortcut hint*/}
        {!query && !isFocused && (
            <kbd className="hidden lg:inline-block text-[10px] font-bold px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-slate-400 pointer-events-none shrink-0">
                ⌘K
            </kbd>
        )}

        {query && (
            <button 
                onClick={() => {
                    setQuery('');
                    inputRef.current?.focus(); 
                }} 
                className="text-slate-400 hover:text-slate-600 shrink-0"
            >
                <X size={14} />
            </button>
        )}
      </div>

      {/* 2. SEARCH DROPDOWN  */}
      {isFocused && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-fade-in-up origin-top z-50">
            
            {/* A. RECENT SEARCHES  */}
            {!query && recentSearches.length > 0 && (
                <div className="py-2">
                    <p className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recent Searches</p>
                    {recentSearches.map((item, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => handleSelectResult(item)}
                            className="px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer group transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <Clock size={15} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                                <span className="text-sm text-slate-600 dark:text-slate-300">{item.title}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <CornerDownLeft size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                {/* Cross Button for Auto-Delete Logic */}
                                <button 
                                    onClick={(e) => deleteHistoryItem(e, item)} 
                                    className="p-1 rounded-md text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* B. LIVE SEARCH RESULTS */}
            {query && (
                <div className="py-2">
                    {results.length > 0 ? (
                        <>
                            <p className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Top Matches</p>
                            {results.map((item) => (
                                <div 
                                    key={item.id} 
                                    onClick={() => handleSelectResult(item)}
                                    className="px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/10 flex items-center gap-3 cursor-pointer border-b border-dashed border-slate-100 dark:border-slate-800 last:border-0 group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                        {/* Fallback to Search icon if dynamic component icon is missing */}
                                        {item.icon ? <item.icon size={16} /> : <Search size={16} />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                            {item.title}
                                        </p>
                                        <p className="text-[10px] text-slate-400 font-medium">
                                            <span className="capitalize">{item.type}</span> 
                                        </p>
                                    </div>
                                    <ArrowRight size={16} className="text-slate-300 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="px-4 py-8 text-center text-slate-500">
                            <p className="text-sm font-medium">No results found for "{query}"</p>
                            <p className="text-xs text-slate-400 mt-1">Try keywords like "Image", "Video", or "Settings"</p>
                        </div>
                    )}
                </div>
            )}
            
            {/* C. FOOTER HINT */}
            <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-2 text-[10px] text-slate-400 text-center border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1">
                <Search size={10} /> Smart Search Enabled
            </div>
        </div>
      )}
    </div>
  );
}