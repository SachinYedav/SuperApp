import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Loader2, ArrowRight, WifiOff, Lock } from 'lucide-react';
import { formatSize, getFileIcon } from '../utils';

export default function RecentFilesList({ userData, recentFiles, loading, isOnline = true, mfaPending = false }) {

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 mb-4">
          <Clock size={18} /> Recent Files
        </h3>
        
        {userData ? (
            <div className="space-y-4">
              
              
              {/* CASE A: OFFLINE */}
              {!isOnline ? (
                 <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                    <WifiOff size={32} className="mb-2 opacity-50"/>
                    <p className="text-xs font-medium">Cannot sync recent files</p>
                 </div>
              ) 
              /* CASE B: MFA PENDING */
              : mfaPending ? (
                 <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                    <Lock size={32} className="mb-2 text-orange-400 opacity-80"/>
                    <p className="text-xs font-medium text-slate-500">Files Locked</p>
                    <button className="mt-2 text-[10px] text-blue-500 hover:underline">Complete verification</button>
                 </div>
              ) 
              /* CASE C: NORMAL LOADING & LIST */
              : loading ? (
                  <div className="flex justify-center py-4 text-blue-500"><Loader2 className="animate-spin"/></div>
              ) : recentFiles.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-4">No recent activity.</p>
              ) : (
                  recentFiles.map((file) => (
                    <div key={file.$id} className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer group">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:shadow-sm transition-all">
                          {getFileIcon(file.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{file.name}</p>
                          <p className="text-xs text-slate-400">
                              {new Date(file.$createdAt).toLocaleDateString()} • {formatSize(file.size)}
                          </p>
                        </div>
                        <Link to="/files">
                          <ArrowRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
                        </Link>
                    </div>
                  ))
              )}
              
              {/* View All Button - Hide if Offline/MFA */}
              {isOnline && !mfaPending && (
                <Link to="/files" className="block w-full mt-4 py-2 text-xs font-bold text-center text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    View All Files
                </Link>
              )}

            </div>
        ) : (
            <div className="text-center py-8 opacity-50">
              <p className="text-sm font-bold text-slate-500">Sign in to see recent files</p>
            </div>
        )}
    </div>
  );
}