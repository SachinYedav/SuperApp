import React from 'react';
import { NavLink } from 'react-router-dom';
import { DOCS_SEARCH_INDEX } from '@/config/docsSearchMap';

export default function DocsMobileNav() {
    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-50 pb-safe">
            <div className="flex items-center overflow-x-auto no-scrollbar py-1 px-2 h-16 gap-1">
                {DOCS_SEARCH_INDEX.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex flex-col items-center justify-center min-w-[72px] h-14 rounded-xl transition-all duration-200
                            ${isActive 
                                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                {/* Display only the first word for mobile nav space */}
                                <span className="text-[10px] font-medium mt-1 whitespace-nowrap px-1 w-full text-center truncate">
                                    {item.title.split(' ')[0]} 
                                </span>
                            </>
                        )}
                    </NavLink>
                ))}
                <div className="min-w-[10px]"></div>
            </div>
        </nav>
    );
}