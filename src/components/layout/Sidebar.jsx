import React,{ useState, useEffect} from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Image,
  Video,  
  FileText,
  Settings,
  Zap,
  QrCode,
  Music, FolderOpen, Code, Calendar, Monitor, TvMinimalPlay,
  Calculator, Palette, Gamepad2, Bot
} from 'lucide-react';
import Logo from '@/assets/Logo';
import DeviceStorageWidget from '@/features/dashboard/components/DeviceStorageWidget'

const NAV_ITEMS = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { name: 'Image Editor', icon: Image, path: '/image-editor' },
  { name: 'Video Editor', icon: Video, path: '/video-editor' },
  { name: 'Doc & PDF', icon: FileText, path: '/pdf-tools' },
  { name: 'QR & Scan', icon: QrCode, path: '/qr-tools' },
  { name: 'Audio Studio', icon: Music, path: '/audio-studio' },
  { name: 'Screen Rec', icon: TvMinimalPlay, path: '/screen-recorder' },
  { name: 'DevTools', icon: Code, path: '/dev-tools' },
  { name: 'Productivity', icon: Calendar, path: '/productivity' },
  { name: 'Digital Canvas', icon: Monitor, path: '/digital-canvas' },
  { name: 'Math Hub', icon: Calculator, path: '/math-tools' },
  { name: 'Color Studio', icon: Palette, path: '/color-tools' },
  { name: 'Skill Arcade', icon: Gamepad2, path: '/arcade' },
  { name: 'AI Lab', icon: Bot, path: '/ai-lab' },
  { name: 'My Files', icon: FolderOpen, path: '/files' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

export default function Sidebar() {
  const [deviceStorage, setDeviceStorage] = useState({ used: 0, quota: 0, percent: 0 });

  useEffect(() => {
    const checkDeviceStorage = async () => {
        try {
            if (navigator.storage && navigator.storage.estimate) {
                const { usage, quota } = await navigator.storage.estimate();
                const percent = quota > 0 ? Math.min((usage / quota) * 100, 100) : 0;
                
                setDeviceStorage({ used: usage, quota, percent });
            }
        } catch (e) {
            console.log("Storage API not supported:", e);
        }
    };

    checkDeviceStorage();
  }, []);
  return (
    <aside className="w-72 bg-white dark:bg-slate-900 h-screen border-r border-slate-200 dark:border-slate-800 fixed left-0 top-0 hidden md:flex flex-col z-50 transition-colors">
      {/* 1. App Logo Area (Top Left) */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-800">
        <Logo />
      </div>
      {/* 2. Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Main Menu
        </p>

        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
              ${isActive
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium shadow-sm ring-1 ring-blue-100 dark:ring-blue-900'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }

            `}
          >
            {/* Icon color changes based on active state */}
            {({ isActive }) => (
              <>
                <item.icon
                  size={20}
                  className={isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                  }

                />
                <span>{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* 3. Version / Footer Area */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
         <DeviceStorageWidget 
            storage={deviceStorage} 
            compact={true} 
         />
      </div>
    </aside>
  );
}