import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const isSystemDark =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  const isActuallyDark =
    theme === 'dark' || (theme === 'system' && isSystemDark);

  const handleToggle = () => {
    setTheme(isActuallyDark ? 'light' : 'dark');
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-full transition-colors duration-200 
      hover:bg-slate-100 dark:hover:bg-slate-800
      text-slate-600 dark:text-slate-300 relative"
      title={theme === 'system' ? 'System Theme Active' : 'Toggle Theme'}
    >
      {isActuallyDark ? <Sun size={20} /> : <Moon size={20} />}

      {theme === 'system' && (
        <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full border border-white dark:border-slate-900"></span>
      )}
    </button>
  );
}
