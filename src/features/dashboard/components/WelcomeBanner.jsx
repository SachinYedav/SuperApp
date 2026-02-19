import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export default function WelcomeBanner({ userData, greeting }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-xl">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
              {greeting}, {userData ? userData.name.split(' ')[0] : 'Guest'}! 👋
          </h1>
          <p className="text-blue-100 max-w-lg mb-6">
            {userData 
              ? "Your professional workspace is synced and ready." 
              : "Explore our powerful tools. Sign in to save your work to the cloud."}
          </p>
          <div className="flex gap-3">
              <Link to="/image-editor" className="px-5 py-2.5 bg-white text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors shadow-sm">
               Start Creating
              </Link>
              {userData ? (
                  <Link to="/files" className="px-5 py-2.5 bg-blue-700/50 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors backdrop-blur-sm">
                   My Files
                  </Link>
              ) : (
                  <button className="px-5 py-2.5 bg-blue-700/50 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors backdrop-blur-sm opacity-50 cursor-not-allowed">
                   Cloud Offline
                  </button>
              )}
          </div>
        </div>
        
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-10"><Zap size={400} /></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
    </div>
  );
}