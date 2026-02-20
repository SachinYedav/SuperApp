import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Circle } from 'lucide-react';
import Logo from '@/assets/Logo';
import healthService from '@/services/healthCheck'; 
import useOnlineStatus from '@/hooks/useOnlineStatus';

export default function AppFooter() {
  const currentYear = new Date().getFullYear();
  const isOnline = useOnlineStatus();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
  const verifyStatus = async () => {
    if (!isOnline) {
      setStatus('offline');
      return;
    }

    try {
      const result = await healthService.getOverallStatus();
      setStatus(result);
    } catch (err) {
      setStatus('down');
    }
  };

  verifyStatus();
  
  let interval;
  if (isOnline) {
    interval = setInterval(verifyStatus, 60000);
  }

  return () => {
    if (interval) clearInterval(interval);
  };
}, [isOnline]);

  const getStatusConfig = () => {
    const configs = {
      operational: { color: 'text-emerald-500', bg: 'bg-emerald-500/5', border: 'border-emerald-500/20', label: 'Systems Live' },
      degraded: { color: 'text-amber-500', bg: 'bg-amber-500/5', border: 'border-amber-500/20', label: 'Partial Issues' },
      down: { color: 'text-rose-500', bg: 'bg-rose-500/5', border: 'border-rose-500/20', label: 'Systems Down' },
      loading: { color: 'text-slate-400', bg: 'bg-slate-400/5', border: 'border-slate-400/20', label: 'Pinging...' },
      offline:{color: 'text-slate-500', bg: 'bg-slate-500/10', border: 'border-slate-500/20', label: 'Network Offline'}
    };
    return configs[status] || configs.loading;
  };

  const config = getStatusConfig();

  return (
    <footer className="hidden md:block w-full bg-white dark:bg-slate-900  border-t border-slate-200/60 dark:border-slate-800/60 shrink-0">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between text-xs">
        
        {/* LEFT SIDE: Logo & Real-time Status */}
        <div className="flex items-center gap-6">
          <div className="hover:scale-105 transition-transform duration-300 cursor-pointer">
            <Logo iconSize="w-5 h-5" textSize="text-base font-bold" />
          </div>
          
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800"></div>
          
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-2.5 py-1 rounded-md border font-bold uppercase tracking-[0.05em] transition-all duration-500 ${config.bg} ${config.border} ${config.color}`}>
              <Circle size={6} className={`fill-current ${status === 'loading' || status === 'operational' ? 'animate-pulse' : ''}`} />
              {config.label}
            </div>
            <span className="text-slate-400 dark:text-slate-500 font-semibold tracking-tight">
              © {currentYear} SuperApp Inc.
            </span>
          </div>
        </div>

        {/* RIGHT SIDE: Navigation & Socials */}
        <div className="flex items-center gap-8">
          <nav className="flex items-center gap-6 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {['Privacy', 'Terms', 'About', 'Docs'].map((item) => {
              const to = item === 'About' ? '/settings/about' : item === 'Docs' ? '/docs' : `/legal/${item.toLowerCase()}-policy`;
              return (
                <Link key={item} to={to} className="relative group transition-all hover:text-blue-600 dark:hover:text-blue-400 hover:scale-110">
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              );
            })}
          </nav>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800"></div>

          <div className="flex items-center gap-3">
            {[ 
              { Icon: Github, color: 'hover:bg-slate-900', href: 'https://github.com/SachinYedav' },
              { Icon: Twitter, color: 'hover:bg-sky-500', href: '#' },
              { Icon: Linkedin, color: 'hover:bg-blue-600', href: 'https://www.linkedin.com/in/sachinyedav/' }
            ].map((social, i) => (
              <a key={i} href={social.href} target="_blank" rel="noreferrer" 
                 className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-800/50 text-slate-500 transition-all duration-300 hover:scale-125 hover:text-white hover:shadow-lg ${social.color}`}>
                <social.Icon size={15} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}