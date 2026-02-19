import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Zap, User, HardDrive, Shield, ChevronRight, LinkIcon, Lock } from 'lucide-react';
import useOnlineStatus from '@/hooks/useOnlineStatus';
import UserAvatar from '@/components/ui/UserAvatar';

import GeneralTab from '@/features/settings/tabs/GeneralTab';
import AccountTab from '@/features/settings/tabs/AccountTab';
import StorageTab from '@/features/settings/tabs/StorageTab'; 
import SecurityTab from '@/features/settings/tabs/SecurityTab';
import IntegrationsTab from '@/features/settings/tabs/IntegrationsTab';
import AboutTab from '@/features/settings/tabs/AboutTab'; 

import LoginRequired from '@/components/ui/LoginRequired';
import AuthModal from '@/components/auth/AuthModal';
import Seo from '@/components/seo/Seo';
import { settingsSeo } from '@/config/seoData';

// --- CONFIGURATION ---
const TABS = [
  { id: 'general', label: 'General', icon: Zap },
  { id: 'account', label: 'Account', icon: User },
  { id: 'security', label: 'Security', icon: Lock }, 
  { id: 'integrations', label: 'Integrations', icon: LinkIcon },
  { id: 'storage', label: 'Storage', icon: HardDrive },
  { id: 'about', label: 'About', icon: Shield },
];

export default function Settings() {
  // --- 1. URL PARAMS LOGIC 
  const { tab } = useParams(); 
  const navigate = useNavigate();
  const isOnline = useOnlineStatus();

 const activeTab = tab || settingsSeo.defaultTab;
// SEO Data Fetch Logic
const currentMeta = settingsSeo.tabs[activeTab] || settingsSeo.tabs[settingsSeo.defaultTab];

  const handleTabChange = (tabId) => {
    navigate(`/settings/${tabId}`); 
  };

  // 2. AUTH CHECK
  const [isAuthOpen, setIsAuthOpen] = React.useState(false);
  const userData = useSelector((state) => state.auth.userData);

  if (!userData) {
    return (
      <>
        <div className="h-[calc(100vh-8rem)] flex items-center justify-center bg-white dark:bg-slate-900 lg:rounded-3xl lg:border border-slate-200 dark:border-slate-800 shadow-sm m-0 lg:m-4">
           <LoginRequired onOpenAuth={() => setIsAuthOpen(true)} />
        </div>
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      </>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-6 h-full lg:h-[calc(100vh-8rem)]">
      <Seo 
        title={currentMeta.title}
        description={currentMeta.description}
        url={`${settingsSeo.basePath}/${activeTab}`} 
        type="website"
      />
      
      {/* =================================================================
          PART A: DESKTOP SIDEBAR 
         ================================================================= */}
      <div className="hidden lg:flex lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden flex-col h-full">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Settings</h1>
          <p className="text-xs text-slate-500">Control Center</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium
              ${activeTab === tab.id 
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-800' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:pl-5'}`}
            >
              <tab.icon size={18} />
              {tab.label}
              {activeTab === tab.id && <ChevronRight size={16} className="ml-auto opacity-50" />}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
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

      {/* =================================================================
          PART B: MAIN CONTENT AREA 
         ================================================================= */}
      <div className={`
          lg:col-span-9 flex flex-col h-full relative
          bg-transparent border-0 rounded-none overflow-visible
          lg:bg-slate-50 lg:dark:bg-slate-950 lg:rounded-3xl lg:border lg:border-slate-200 lg:dark:border-slate-800 lg:overflow-hidden
      `}>
        
        {/* --- MOBILE STICKY HEADER & TABS --- */}
        <div className="lg:hidden sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
            
            {/* Page Title & User (Mobile Top Bar) */}
            <div className="px-4 py-3 flex items-center justify-between">
                <h1 className="text-xl font-bold text-slate-800 dark:text-white">Settings</h1>
                <UserAvatar user={userData} size="xs" />
            </div>

            {/* Scrollable Tabs */}
            <div className="flex overflow-x-auto custom-scrollbar px-2 pb-3  snap-x no-scrollbar">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
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

        {/* --- CONTENT AREA --- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="pt-4 lg:p-8 pb-24 lg:pb-8 max-w-4xl mx-auto animate-fade-in">
            {activeTab === 'general' && <GeneralTab isOnline={isOnline} />} 
    {activeTab === 'account' && <AccountTab isOnline={isOnline} />}
    {activeTab === 'security' && <SecurityTab isOnline={isOnline} />}
    {activeTab === 'integrations' && <IntegrationsTab isOnline={isOnline} />}
    {activeTab === 'storage' && <StorageTab isOnline={isOnline} />}
    {activeTab === 'about' && <AboutTab />}
          </div>
        </div>

      </div>

    </div>
  );
}