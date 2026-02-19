import React from 'react';
import { UserAvatar } from '@/components/ui/index';
import { SETTINGS_TABS } from '../constants';

export default function MobileSettingsHeader({ activeTab, onTabChange, userData }) {
  return (
    <div className="lg:hidden sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm mb-4">
        {/* Page Title & User */}
        <div className="px-4 py-3 flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">Settings</h1>
            <UserAvatar user={userData} size="xs" />
        </div>

        {/* Scrollable Tabs */}
        <div className="flex overflow-x-auto custom-scrollbar px-2 pb-0 snap-x no-scrollbar">
            {SETTINGS_TABS.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex-none snap-start flex items-center gap-2 px-4 py-3 border-b-[3px] text-sm font-medium transition-colors whitespace-nowrap
                    ${activeTab === tab.id 
                        ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' 
                        : 'border-transparent text-slate-500 dark:text-slate-400'}`}
                >
                    <tab.icon size={16} />
                    {tab.label}
                </button>
            ))}
        </div>
    </div>
  );
}