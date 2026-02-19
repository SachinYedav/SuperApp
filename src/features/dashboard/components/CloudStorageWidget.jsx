import React from 'react';
import { Link } from 'react-router-dom';
import { HardDrive, WifiOff, Lock } from 'lucide-react'; 
import { formatSize } from '../utils';

export default function CloudStorageWidget({ userData, loading, totalUsage, isOnline = true, mfaPending = false }) {

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        {/* Header*/}
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <HardDrive size={18} className="text-blue-500" /> Cloud Storage
          </h3>
          {userData && <Link to="/files" className="text-xs text-blue-500 font-medium hover:underline">Manage</Link>}
        </div>
        
        {userData ? (
            <>
              
              {/* CASE A: OFFLINE */}
              {!isOnline ? (
                <div className="py-6 text-center opacity-60">
                    <div className="flex justify-center mb-2"><WifiOff size={24} className="text-slate-400"/></div>
                    <p className="text-xs font-bold text-slate-500">Offline Mode</p>
                    <p className="text-[10px] text-slate-400">Cloud usage unavailable</p>
                </div>
              ) 
              /* CASE B: MFA PENDING */
              : mfaPending ? (
                <div className="py-6 text-center">
                    <div className="flex justify-center mb-2"><Lock size={24} className="text-orange-500"/></div>
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Security Check</p>
                    <p className="text-[10px] text-orange-500 animate-pulse">Verification Pending...</p>
                </div>
              ) 
              /* CASE C: NORMAL  */
              : (
                <>
                  <div className="mb-2 flex justify-between text-sm">
                      <span className="text-slate-500">Used Space</span>
                      <span className="font-bold text-slate-800 dark:text-white">
                          {loading ? '...' : formatSize(totalUsage)}
                      </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
                      <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000"
                          style={{ width: `${Math.min((totalUsage / (10*1024*1024*1024))*100, 100)}%` }}
                      ></div>
                  </div>
                  <p className="text-xs text-slate-400">10 GB Free Tier Plan</p>
                </>
              )}
            </>
        ) : (
            // Guest User Block 
            <div className="text-center py-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
              <p className="text-xs font-bold text-slate-500">Sign in to view cloud usage</p>
            </div>
        )}
    </div>
  );
}