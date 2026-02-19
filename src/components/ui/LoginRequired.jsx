import React from 'react';
import { Lock, LogIn } from 'lucide-react';

export default function LoginRequired({ onOpenAuth }) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center animate-fade-in">
      <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
        <Lock size={40} className="text-slate-400" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
        Access Restricted
      </h2>
      <p className="text-slate-500 max-w-sm mb-8">
        Please sign in to access your profile, files, and personalized settings. Your data is safe in the cloud.
      </p>
      
      <button 
        onClick={onOpenAuth}
        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-transform active:scale-95"
      >
        <LogIn size={20} /> Sign In / Create Account
      </button>
    </div>
  );
}