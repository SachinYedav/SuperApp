import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { DOCS_SEARCH_INDEX } from '@/config/docsSearchMap';
import Logo from '@/assets/Logo';

// Group Data Logically
const groupedDocs = DOCS_SEARCH_INDEX.reduce((acc, doc) => {
    if (!acc[doc.group]) acc[doc.group] = [];
    acc[doc.group].push(doc);
    return acc;
}, {});

export default function DocsSidebar() {
    return (
        <aside className="w-72 bg-white dark:bg-slate-900 h-screen border-r border-slate-200 dark:border-slate-800 fixed left-0 top-0 hidden md:flex flex-col z-50 transition-colors">
            
            {/* Header / Logo Area */}
              <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-800 shrink-0 gap-2">
                  <Logo iconSize="w-6 h-6" textSize="text-xl" />
                  
                  <Link to="/docs" className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider hover:opacity-80 transition-opacity">
                      Docs
                  </Link>
              </div>

            {/* Navigation Area */}
            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-hide">
                {Object.keys(groupedDocs).map((groupName, idx) => (
                    <div key={idx} className="animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                        <h3 className="font-bold text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4 px-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
                            {groupName}
                        </h3>
                        <ul className="space-y-1">
                            {groupedDocs[groupName].map((item) => (
                                <li key={item.id}>
                                    <NavLink
                                        to={item.path}
                                        className={({ isActive }) => `
                                            relative group flex items-center justify-between px-4 py-2.5 text-sm rounded-xl transition-all duration-200
                                            ${isActive 
                                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium shadow-sm ring-1 ring-blue-100 dark:ring-blue-900' 
                                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800'}
                                        `}
                                    >
                                        {/* FIX: Using child render prop to safely pass isActive to the Icon */}
                                        {({ isActive }) => (
                                            <div className="flex items-center gap-3 z-10">
                                                <item.icon 
                                                    size={16} 
                                                    className={isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300"} 
                                                />
                                                <span>{item.title}</span>
                                            </div>
                                        )}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>
        </aside>
    );
}