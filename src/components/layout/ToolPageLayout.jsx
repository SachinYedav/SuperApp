import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils/cn'; 

export default function ToolPageLayout({ 
  title, 
  subtitle, 
  icon: Icon, 
  tabs, 
  activeTab, 
  onTabChange, 
  basePath,
  themeColor = 'blue', 
  children 
}) {
  const navigate = useNavigate();

  // Dynamic Theme Styling
  const themes = {
    blue:   { activeBg: 'bg-blue-600', activeText: 'text-blue-700', lightBg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-600' },
    pink:   { activeBg: 'bg-pink-600', activeText: 'text-pink-700', lightBg: 'bg-pink-50 dark:bg-pink-900/20', border: 'border-pink-600' },
    purple: { activeBg: 'bg-purple-600', activeText: 'text-purple-700', lightBg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-600' },
    orange: { activeBg: 'bg-orange-600', activeText: 'text-orange-700', lightBg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-600' },
    green:  { activeBg: 'bg-green-600', activeText: 'text-green-700', lightBg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-600' },
  };

  const theme = themes[themeColor] || themes.blue;

  const handleNavigation = (tabId) => {
    navigate(`${basePath}/${tabId}`);
    if (onTabChange) onTabChange(tabId);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-6 h-full lg:h-[calc(100vh-8rem)] animate-fade-in">
      
      {/* LEFT: SIDEBAR (Desktop) */}
      <div className="hidden lg:flex lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 flex-col shadow-lg p-6 h-full">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <div className={cn("p-2 rounded-lg", theme.lightBg)}>
               <Icon className={cn(theme.activeText.replace('text-', 'text-'))} size={24} /> 
            </div>
            {title}
          </h2>
          <p className="text-xs text-slate-500 mt-1 ml-11">{subtitle}</p>
        </div>

        <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleNavigation(tab.id)}
              className={cn(
                "w-full text-left p-3 rounded-xl transition-all border flex items-center gap-3 group",
                activeTab === tab.id 
                  ? cn(theme.lightBg, theme.border, "shadow-sm", theme.activeText.replace('text-', 'text-')) 
                  : "bg-white dark:bg-slate-900 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              )}
            >
              <div className={cn(
                "p-2 rounded-lg transition-colors",
                activeTab === tab.id ? cn(theme.activeBg, "text-white") : "bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:text-slate-700"
              )}>
                <tab.icon size={18} />
              </div>
              <span className="font-bold text-sm">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT: WORKSPACE */}
      <div className="lg:col-span-9 bg-slate-50 dark:bg-slate-950 lg:rounded-3xl lg:border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden relative h-full">
        
        {/* Mobile Sticky Header */}
        <div className="lg:hidden sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-3 flex gap-2 overflow-x-auto no-scrollbar rounded-2xl">
          {tabs.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => handleNavigation(tab.id)}
              className={cn(
                "flex-none px-4 py-2 rounded-full text-xs font-bold border transition-colors flex items-center gap-2",
                activeTab === tab.id 
                  ? cn(theme.activeBg, "border-transparent text-white shadow-md") 
                  : "bg-slate-100 dark:bg-slate-800 border-transparent text-slate-500"
              )}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Content Render Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-1 py-3 lg:p-4 min-h-0 ">
           {children}
        </div>
      </div>
    </div>
  );
}