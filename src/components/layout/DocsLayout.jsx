import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, BookOpen, Menu, X, Command, ChevronRight } from 'lucide-react';
import { DocsSearchBar, ThemeToggle } from "@/components/ui/index"
import { DOCS_SEARCH_INDEX } from '@/config/docsSearchMap'; 

const groupedDocs = DOCS_SEARCH_INDEX.reduce((acc, doc) => {
    if (!acc[doc.group]) acc[doc.group] = [];
    acc[doc.group].push(doc);
    return acc;
}, {});

// --- REUSABLE SIDEBAR COMPONENT ---
const SidebarContent = ({ onItemClick }) => (
    <nav className="space-y-10 px-2 pb-10">
        {Object.keys(groupedDocs).map((groupName, idx) => (
            <div key={idx} className="animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                <h3 className="font-bold text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-5 px-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
                    {groupName}
                </h3>
                <ul className="space-y-1.5">
                    {groupedDocs[groupName].map((item) => (
                        <li key={item.id}>
                            <NavLink
                                to={item.path}
                                onClick={onItemClick}
                                className={({ isActive }) => `
                                    relative group flex items-center justify-between px-4 py-2.5 text-[13.5px] rounded-xl transition-all duration-300
                                    ${isActive 
                                        ? 'bg-blue-600 dark:bg-blue-600 text-white font-medium shadow-lg shadow-blue-500/25 ring-1 ring-blue-400/20' 
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800/40'}
                                `}
                            >
                                <span className="z-10">{item.title}</span>
                                <ChevronRight size={14} className={`transition-transform duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1`} />
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        ))}
    </nav>
);

export default function DocsLayout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
    const timer = setTimeout(() => {
        setIsMobileMenuOpen(false);
    }, 0);

    window.scrollTo({ top: 0, behavior: 'smooth' }); 

    return () => clearTimeout(timer); 
}, [location.pathname]);

    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
            const currentProgress = (window.pageYOffset / totalScroll) * 100;
            setScrollProgress(currentProgress);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50/30 dark:bg-[#020617] font-sans selection:bg-blue-200 dark:selection:bg-blue-500/30">
            
            {/* Scroll Progress Bar */}
            <div className="fixed top-0 left-0 h-[2px] bg-blue-500 z-[60] transition-all duration-150" style={{ width: `${scrollProgress}%` }} />

            {/* --- 1. PREMIUM TOP NAVBAR (GLASSMORPHISM) --- */}
            <header className="h-16 border-b border-slate-200/50 dark:border-slate-800/40 bg-white/70 dark:bg-[#020617]/70 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-[1536px] mx-auto h-full flex items-center justify-between px-4 lg:px-10">
                    
                    {/* Left Section */}
                    <div className="flex items-center gap-5 shrink-0 lg:w-64">
                        <button 
                            className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all active:scale-95"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu size={22} />
                        </button>
                        
                        <Link to="/docs" className="flex items-center gap-2.5 group">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                                <BookOpen className="text-white" size={18} />
                            </div>
                            <span className="font-extrabold text-xl tracking-tighter text-slate-900 dark:text-white  italic">
                                SuperDocs<span className="text-blue-500">.</span>
                            </span>
                        </Link>
                    </div>

                    {/* Center Section: Search Bar with "Modern Glow" */}
                    <div className="hidden sm:flex flex-1 max-w-xl justify-center">
                        <div className="w-full relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
                            <div className="relative">
                                <DocsSearchBar />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 px-2 py-1 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-[9px] text-slate-400 font-bold pointer-events-none shadow-sm">
                                    <Command size={10} /> K
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-4 shrink-0">
                        <Link to="/" className="hidden md:flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.1em] text-slate-500 hover:text-blue-600 transition-colors">
                            <ArrowLeft size={14} /> Exit
                        </Link>
                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2 hidden md:block opacity-50"></div>
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            {/* --- 2. MAIN CONTENT WRAPPER --- */}
            <div className="max-w-[1536px] mx-auto flex px-4 lg:px-10">
                
                {/* --- DESKTOP SIDEBAR (FLOATING STYLE) --- */}
                <aside className="hidden lg:block w-72 shrink-0 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto pt-10 pr-4 scrollbar-hide">
                    <SidebarContent />
                </aside>

                {/* --- MAIN AREA --- */}
                <main className="flex-1 min-w-0">
                    <div className="py-10 px-2 sm:px-10 lg:pl-16 lg:pr-4 xl:pl-24 max-w-4xl mx-auto min-h-[120vh]">
                        
                        {/* Breadcrumb (Modern Clean Style) */}
                        <div className="flex items-center gap-2 mb-10 overflow-x-auto whitespace-nowrap scrollbar-hide">
                            <Link to="/docs" className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest hover:text-blue-500 transition-colors">SuperDocs</Link>
                            <ChevronRight size={12} className="text-slate-300" />
                            <span className="text-[11px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                                {location.pathname.split('/').pop()?.replace(/-/g, ' ')}
                            </span>
                        </div>
                        
                        {/* The Actual Content */}
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
                            <Outlet /> 
                        </div>

                        {/* Footer (Premium touch) */}
                        <footer className="mt-24 pt-8 border-t border-slate-100 dark:border-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-4 pb-20 text-slate-400 text-xs font-medium uppercase tracking-tighter">
                            <span>SuperDocs © 2026</span>
                            <div className="flex gap-6">
                                <a href="#" className="hover:text-blue-500 transition-colors">Privacy</a>
                                <a href="#" className="hover:text-blue-500 transition-colors">Feedback</a>
                            </div>
                        </footer>
                    </div>
                </main>

                {/* --- MOBILE SIDEBAR DRAWER --- */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[60] lg:hidden animate-in fade-in duration-300" onClick={() => setIsMobileMenuOpen(false)} />
                )}
                
                <div className={`fixed inset-y-0 left-0 w-[300px] bg-white dark:bg-[#020617] z-[70] transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) lg:hidden border-r border-slate-200 dark:border-slate-800 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full shadow-none'}`}>
                    <div className="h-20 flex items-center justify-between px-6 border-b border-slate-50 dark:border-slate-900">
                        <span className="font-black text-lg tracking-tighter uppercase italic">Navigation</span>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="p-2.5 bg-slate-100 dark:bg-slate-900 text-slate-500 rounded-2xl active:scale-90 transition-transform">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="py-8 px-4 h-[calc(100vh-5rem)] overflow-y-auto scrollbar-hide">
                        <SidebarContent onItemClick={() => setIsMobileMenuOpen(false)} />
                    </div>
                </div>

            </div>
        </div>
    );
}