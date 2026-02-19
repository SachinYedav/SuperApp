import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNav from './MobileNav';

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* 1. Sidebar  */}
      <Sidebar />

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 flex flex-col md:ml-72 transition-all duration-300">
        
        {/* Top Header */}
        <Header />

        {/* Dynamic Page Content */}
        
        <main className="flex-1 px-2 py-4 md:px-5 md:py-8 overflow-y-auto pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto animate-fade-in-up">
            <Outlet />
          </div>
        </main>
        
      </div>

      {/* 3. Mobile Navigation */}
      <MobileNav />

    </div>
  );
}