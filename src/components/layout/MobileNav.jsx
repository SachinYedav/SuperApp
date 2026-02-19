import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Image, Video, FileText, 
  Settings, Music, QrCode, FolderOpen, Code,
  Calendar,  Monitor, TvMinimalPlay, Palette,
  Bot,Gamepad2
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Home', icon: LayoutDashboard, path: '/' },

  { name: 'Images', icon: Image, path: '/image-editor' },
  { name: 'Videos', icon: Video, path: '/video-editor' },
  { name: 'PDFs', icon: FileText, path: '/pdf-tools' },
  { name: 'Audio', icon: Music, path: '/audio-studio' },
  { name: 'Screen Rec', icon: TvMinimalPlay  , path: '/screen-recorder' },
  { name: 'QR', icon: QrCode, path: '/qr-tools' },
  { name: 'Productivity', icon: Calendar, path: '/productivity' },
  { name: 'Digital Canvas', icon: Monitor, path: '/digital-canvas' },
  { name: 'Color Studio', icon: Palette, path: '/color-tools' },
  { name: 'DevTools', icon: Code, path: '/dev-tools' },
  { name: 'Skill Arcade', icon: Gamepad2, path: '/arcade' },
  { name: 'AI Lab', icon: Bot, path: '/ai-lab' },
  { name: 'Files', icon: FolderOpen, path: '/files' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-50 pb-safe">
      
      {/* Scrollable Container */}
      <div className="flex items-center overflow-x-auto no-scrollbar py-1 px-2 h-16 gap-1">
        
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex flex-col items-center justify-center min-w-[64px] h-14 rounded-xl transition-all duration-200
              ${isActive 
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  size={20} 
                  strokeWidth={isActive ? 2.5 : 2} 
                />
                <span className="text-[10px] font-medium mt-1 whitespace-nowrap">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
        
        <div className="min-w-[10px]"></div>
      </div>
    </nav>
  );
}