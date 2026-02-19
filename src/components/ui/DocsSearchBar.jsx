import React, { useState, useRef, useEffect } from 'react';
import { Search, ArrowRight, Loader2, X, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDocsSearch } from '@/hooks/useDocsSearch';

export default function DocsSearchBar() {
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const { query, setQuery, results, isSearching } = useDocsSearch();
  const [isFocused, setIsFocused] = useState(false);

  // Click Outside Logic
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
    setQuery('');
    setIsFocused(false);
    navigate(item.path);
  };

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      {/* Input Field */}
      <div className={`flex items-center gap-2 bg-slate-100 dark:bg-slate-900 px-3 py-2 rounded-xl border transition-all duration-200 ${isFocused ? 'border-blue-500 ring-4 ring-blue-500/10 dark:ring-blue-500/20' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}`}>
        {isSearching && query ? (
           <Loader2 size={16} className="text-blue-500 animate-spin" />
        ) : (
           <Search size={16} className="text-slate-400" />
        )}
        
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search documentation..." 
          className="bg-transparent border-none outline-none text-sm text-slate-700 dark:text-slate-200 w-full placeholder:text-slate-500"
        />
        
        {/* Keyboard shortcut hint (Ctrl+K style) hidden on mobile */}
        {!query && !isFocused && (
            <kbd className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-400">
                /
            </kbd>
        )}

        {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600">
                <X size={14} />
            </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isFocused && query && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-fade-in-up origin-top z-50">
            <div className="py-2">
                {results.length > 0 ? (
                    <>
                        <p className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Documentation Matches</p>
                        {results.map((item) => (
                            <div 
                                key={item.id} 
                                onClick={() => handleSelectResult(item)}
                                className="px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/10 flex items-center gap-3 cursor-pointer group transition-colors"
                            >
                                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-blue-500 group-hover:text-white transition-colors shrink-0">
                                    {item.icon ? <item.icon size={16} /> : <FileText size={16} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                                        {item.title}
                                    </p>
                                    <p className="text-[10px] text-slate-400 font-medium">
                                        {item.group}
                                    </p>
                                </div>
                                <ArrowRight size={16} className="text-slate-300 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0" />
                            </div>
                        ))}
                    </>
                ) : (
                    <div className="px-4 py-8 text-center text-slate-500">
                        <p className="text-sm font-medium">No results found for "{query}"</p>
                        <p className="text-xs text-slate-400 mt-1">Check spelling or try different keywords.</p>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
}