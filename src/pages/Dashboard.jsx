import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Zap, Settings } from 'lucide-react';
import service from '../services/database';
import useOnlineStatus from '@/hooks/useOnlineStatus';
import Seo from '@/components/seo/Seo';

// Imports from Feature Folder
import { TOOLS } from '../features/dashboard/constants';
import WelcomeBanner from '../features/dashboard/components/WelcomeBanner';
import ToolCard from '../features/dashboard/components/ToolCard';
import CloudStorageWidget from '../features/dashboard/components/CloudStorageWidget';
import DeviceStorageWidget from '../features/dashboard/components/DeviceStorageWidget';
import RecentFilesList from '../features/dashboard/components/RecentFilesList';

export default function Dashboard() {
  // 1. Redux Data
  const { userData, mfaPending } = useSelector((state) => state.auth); 
  const isOnline = useOnlineStatus();
  
  // 2. Local State
  const [recentFiles, setRecentFiles] = useState([]);
  const [totalUsage, setTotalUsage] = useState(0);
  const [loadingCloud, setLoadingCloud] = useState(false);
  
  // Local Device Storage State
  const [deviceStorage, setDeviceStorage] = useState({ used: 0, quota: 0, percent: 0 });

  // Time Logic
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  // 3. Effect: Fetch Cloud Data
  useEffect(() => {
    
    const fetchCloudData = async () => {
        if (!userData?.$id || !isOnline || mfaPending) return;

        setLoadingCloud(true);
        try {
            const response = await service.getFiles(userData.$id);
            if (response) {
                setRecentFiles(response.documents.slice(0, 3));
                const usage = response.documents.reduce((acc, file) => acc + file.size, 0);
                setTotalUsage(usage);
            }
        } catch (error) {
            console.error("Dashboard Sync Error:", error);
        } finally {
            setLoadingCloud(false);
        }
    };

    fetchCloudData();
  }, [userData, isOnline, mfaPending]);

  // 4. Effect: Check Local Device Storage
  useEffect(() => {
    const checkDeviceStorage = async () => {
        try {
            if (navigator.storage && navigator.storage.estimate) {
                const { usage, quota } = await navigator.storage.estimate();
                const percent = Math.min((usage / quota) * 100, 100);
                setDeviceStorage({ used: usage, quota, percent });
            }
        } catch (e) {
            console.log("Storage API not supported");
        }
    };
    checkDeviceStorage();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in-up pb-20 md:pb-0">
      <Seo 
        title="Dashboard" 
        description="Manage your files, access offline tools, and track storage usage."
      />
      {/* --- 1. WELCOME BANNER --- */}
      <WelcomeBanner userData={userData} greeting={greeting} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- 2. QUICK ACTIONS  --- */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Zap className="text-yellow-500" size={20}/> Quick Tools
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TOOLS.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
            
            <Link to="/settings" className="p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
              <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                 <Settings className="text-slate-400" />
              </div>
              <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Settings</span>
            </Link>
          </div>
        </div>

        {/* --- 3. SIDEBAR WIDGETS  --- */}
        <div className="space-y-6">
          
          {/* A. CLOUD STORAGE */}
          <CloudStorageWidget 
            userData={userData} 
            loading={loadingCloud} 
            totalUsage={totalUsage}
            isOnline={isOnline}
            mfaPending={mfaPending} 
          />

          {/* B. DEVICE STORAGE */}
          <DeviceStorageWidget storage={deviceStorage} />

          {/* C. RECENT FILES */}
          <RecentFilesList 
            userData={userData} 
            recentFiles={recentFiles} 
            loading={loadingCloud} 
            isOnline={isOnline}
            mfaPending={mfaPending}
          />

        </div>
      </div>
    </div>
  );
}