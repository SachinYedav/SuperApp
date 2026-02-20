import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ChevronRight, Github, Twitter, Linkedin, Youtube, Instagram,  } from 'lucide-react';

// Components
import DocsSidebar from '@/features/docs/components/DocsSidebar';
import DocsMobileNav from '@/features/docs/components/DocsMobileNav';
import DocsHeader from '@/features/docs/components/DocsHeader';

export default function DocsLayout() {
    const location = useLocation();
    const mainRef = useRef(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    // Track scroll progress within the main container
    useEffect(() => {
        const handleScroll = () => {
            if (mainRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = mainRef.current;
                const totalScroll = scrollHeight - clientHeight;
                const currentProgress = totalScroll > 0 ? (scrollTop / totalScroll) * 100 : 0;
                setScrollProgress(currentProgress);
            }
        };
        
        const mainEl = mainRef.current;
        if (mainEl) mainEl.addEventListener('scroll', handleScroll);
        
        return () => {
            if (mainEl) mainEl.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Scroll to top automatically when navigating between docs
    useEffect(() => {
        if (mainRef.current) {
            mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [location.pathname]);

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50/50 dark:bg-[#020617] font-sans selection:bg-blue-200 dark:selection:bg-blue-500/30">
            
            {/* Global Scroll Progress Bar */}
            <div 
                className="fixed top-0 left-0 h-[2px] bg-blue-500 z-[100] transition-all duration-150" 
                style={{ width: `${scrollProgress}%` }} 
            />

            {/* Sidebar (Desktop) */}
            <DocsSidebar />

            {/* Main Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 md:ml-72 relative">
                
                {/* Header (Desktop & Mobile) */}
                <DocsHeader />

                {/* Scrollable Content Area */}
                <main ref={mainRef} className="flex-1 overflow-y-auto pb-24 md:pb-10 scroll-smooth scrollbar-hide">
                    <div className="py-8 md:py-10 px-4 sm:px-8 lg:px-12 max-w-4xl mx-auto min-h-full flex flex-col">
                        
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide shrink-0">
                            <Link to="/docs" className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest hover:text-blue-500 transition-colors">
                                SuperDocs
                            </Link>
                            <ChevronRight size={12} className="text-slate-300 dark:text-slate-700" />
                            <span className="text-[11px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                                {location.pathname.split('/').pop()?.replace(/-/g, ' ')}
                            </span>
                        </div>
                        
                        {/* Dynamic Markdown Content */}
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex-1">
                            <Outlet /> 
                        </div>

                        {/* --- FOOTER Section--- */}
                        <footer className="relative mt-24 border-t border-slate-200/70 dark:border-slate-800/70 bg-white/60 dark:bg-slate-950/40 backdrop-blur supports-[backdrop-filter]:bg-white/40">
                        <div className="max-w-7xl mx-auto px-6 py-10">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                            {/* Left: Social Icons */}
                            <div className="flex items-center gap-5 text-slate-500 dark:text-slate-400">
                                {[
                                { Icon: Github, link: "https://github.com/SachinYedav", label: "GitHub" },
                                { Icon: Twitter, link: "#", label: "Twitter" },
                                { Icon: Linkedin, link: "#", label: "LinkedIn" },
                                { Icon: Youtube, link: "#", label: "YouTube" },
                                { Icon: Instagram, link: "#", label: "Instagram" },
                                ].map(({ Icon, link, label }, index) => (
                                <a
                                    key={index}
                                    href={link}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={label}
                                    className="group p-2 rounded-lg transition-all duration-300 ease-out hover:-translate-y-1
                                    hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                                >
                                    <Icon size={18} className="transition-transform duration-300 group-hover:scale-110" />
                                </a>
                                ))}

                            </div>

                            {/* Right: Links & Copyright */}
                            <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium tracking-wide">
                                
                                <Link
                                to="/legal/privacy-policy"
                                className="relative text-slate-500 dark:text-slate-400 transition-colors duration-300 hover:text-slate-900 dark:hover:text-white after:absolute after:left-0 after:-bottom-1
                                    after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-300
                                    hover:after:w-full">
                                Privacy Policy
                                </Link>

                                <Link
                                to="/legal/terms-of-service"
                                className="relative text-slate-500 dark:text-slate-400 transition-colors duration-300
                                    hover:text-slate-900 dark:hover:text-white after:absolute after:left-0 after:-bottom-1
                                    after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-300
                                    hover:after:w-full">
                                Terms of Service
                                </Link>

                                <span className="text-slate-400 dark:text-slate-500 font-normal">
                                © {new Date().getFullYear()} 
                                <span className="ml-1 font-semibold text-slate-700 dark:text-slate-300">
                                    SuperApp
                                </span>
                                </span>

                            </div>
                            </div>

                        </div>
                        </footer>
                    </div>
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <DocsMobileNav />
            
        </div>
    );
}