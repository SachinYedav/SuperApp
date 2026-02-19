import React from 'react';
import { ChevronRight } from 'lucide-react';
import { UserAvatar } from '@/components/ui/index';
import { SETTINGS_TABS } from '../constants';

export default function SettingsSidebar({ activeTab, onTabChange, userData }) {
  return (
    <div className="hidden lg:flex lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden flex-col h-full sticky top-0">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Settings</h1>
        <p className="text-xs text-slate-500">Control Center</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
        {SETTINGS_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium group
            ${activeTab === tab.id 
              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-800' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:pl-5'}`}
          >
            <tab.icon size={18} className={activeTab === tab.id ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-600'} />
            {tab.label}
            {activeTab === tab.id && <ChevronRight size={16} className="ml-auto opacity-50" />}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
         <div className="bg-white dark:bg-slate-800 rounded-xl p-3 flex items-center gap-3 border border-slate-100 dark:border-slate-700 shadow-sm">
            <UserAvatar user={userData} size="sm" />
            <div className="flex-1 overflow-hidden">
               <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{userData.name}</h4>
               <p className="text-[10px] text-slate-500 truncate">{userData.email}</p>
            </div>
         </div>
      </div>
    </div>
  );
}