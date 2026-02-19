import React, { useState } from 'react';
import { decodeJwt } from '../utils/textUtils';
import { Key, AlertCircle, FileText, Lock } from 'lucide-react';

export default function JwtDecoder() {
  const [token, setToken] = useState('');
  const [decoded, setDecoded] = useState(null);

  const handleChange = (e) => {
    const val = e.target.value;
    setToken(val);
    if(val.trim()) {
        const res = decodeJwt(val);
        setDecoded(res);
    } else {
        setDecoded(null);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4 animate-fade-in">
        
        {/* INPUT SECTION */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col shrink-0 min-h-[300px]">
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <Key size={14}/> Encoded Token
            </div>
            <textarea 
              value={token}
              onChange={handleChange}
              placeholder="Paste your JWT (eyJh...) here..."
              className="w-full h-24 sm:h-32 p-4 bg-transparent border-none outline-none resize-none font-mono text-sm text-slate-700 dark:text-slate-300 break-all leading-relaxed placeholder:text-slate-400"
            />
        </div>

        {/* OUTPUT SECTION */}
        {decoded ? (
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0 ">
                
                {/* Header Block */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden h-64 md:h-auto">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-wider">
                        <Lock size={14}/> Header
                    </div>
                    <div className="flex-1 overflow-auto custom-scrollbar p-4 bg-slate-50 dark:bg-slate-950/30">
                        <pre className="text-xs sm:text-sm font-mono text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                            {JSON.stringify(decoded.header, null, 2)}
                        </pre>
                    </div>
                </div>
                
                {/* Payload Block */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden h-full min-h-[250px]">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 flex items-center gap-2 text-xs font-bold text-purple-500 uppercase tracking-wider">
                        <FileText size={14}/> Payload
                    </div>
                    <div className="flex-1 overflow-auto custom-scrollbar p-4 bg-slate-50 dark:bg-slate-950/30">
                        {decoded.error ? (
                            <div className="flex flex-col items-center justify-center h-full text-red-500 gap-2">
                                <AlertCircle size={24}/> 
                                <span className="font-bold">Invalid Token Structure</span>
                            </div>
                        ) : (
                            <pre className="text-xs sm:text-sm font-mono text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                                {JSON.stringify(decoded.payload, null, 2)}
                            </pre>
                        )}
                    </div>
                </div>
            </div>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-slate-400 p-8 text-center min-h-[200px]">
                <Key size={40} className="mb-3 opacity-20"/>
                <p className="text-sm font-medium">Token details will appear here</p>
            </div>
        )}
    </div>
  );
}