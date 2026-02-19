import React, { useState } from 'react';
import { formatJson, minifyJson } from '../utils/textUtils';
import { Copy, Check, FileJson, AlertCircle, FileCode } from 'lucide-react';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleAction = (type) => {
    if(!input.trim()) return;
    const res = type === 'pretty' ? formatJson(input) : minifyJson(input);
    if (res.error) {
        setError(res.error);
        setOutput('');
    } else {
        setError(null);
        setOutput(res.value);
    }
  };

  const handleCopy = () => {
    if(!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full gap-4 animate-fade-in">
       {/* Actions */}
       <div className="flex gap-3">
          <button onClick={() => handleAction('pretty')} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2">
            <FileCode size={16}/> Prettify
          </button>
          <button onClick={() => handleAction('minify')} className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs transition-all">
            Minify
          </button>
       </div>

       <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">
          {/* Input */}
          <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden min-h-[300px]">
             <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <FileJson size={14}/> Input
             </div>
             <textarea 
               value={input}
               onChange={(e) => setInput(e.target.value)}
               placeholder='Paste JSON here...'
               className="flex-1 w-full p-4 bg-transparent border-none outline-none resize-none font-mono text-sm leading-relaxed text-slate-700 dark:text-slate-300 placeholder:text-slate-400"
               spellCheck="false"
             />
          </div>

          {/* Output */}
          <div className={`flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 rounded-2xl border ${error ? 'border-red-500/50' : 'border-slate-200 dark:border-slate-800'} shadow-inner overflow-hidden relative min-h-[300px]`}>
             <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Result</span>
                {output && (
                    <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors">
                        {copied ? <Check size={14} className="text-green-500"/> : <Copy size={14}/>}
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                )}
             </div>
             
             {error ? (
                 <div className="p-6 text-red-500 text-sm font-mono flex gap-3 animate-fade-in bg-red-500/5 dark:bg-red-500/10 h-full">
                    <AlertCircle size={20} className="shrink-0"/> 
                    <div>
                        <p className="font-bold mb-1">Invalid JSON</p>
                        <p className="opacity-80">{error}</p>
                    </div>
                 </div>
             ) : (
                 <textarea 
                   value={output}
                   readOnly
                   placeholder="Result will appear here..."
                   className="flex-1 w-full p-4 bg-transparent border-none outline-none resize-none font-mono text-sm leading-relaxed text-slate-600 dark:text-slate-400"
                 />
             )}
          </div>
       </div>
    </div>
  );
}