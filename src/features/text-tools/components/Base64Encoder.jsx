import React, { useState } from 'react';
import { base64Action } from '../utils/textUtils';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default function Base64Encoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState(null);

  const handleAction = (action) => {
    const res = base64Action(input, action);
    if(res.error) {
        setError(res.error);
        setOutput('');
    } else {
        setError(null);
        setOutput(res.value);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4 animate-fade-in">
       {/* Actions */}
       <div className="flex gap-4">
          <button onClick={() => handleAction('encode')} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2">
             Encode <ArrowRight size={16}/>
          </button>
          <button onClick={() => handleAction('decode')} className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2">
             <ArrowLeft size={16}/> Decode
          </button>
       </div>

       {error && (
           <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm font-bold text-center animate-shake">
               {error}
           </div>
       )}

       <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-1 flex flex-col shadow-sm focus-within:ring-2 ring-blue-500/20 transition-all min-h-[250px]">
             <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase">Plain Text</div>
             <textarea 
               value={input}
               onChange={(e) => setInput(e.target.value)}
               className="flex-1 w-full p-3 bg-transparent border-none outline-none resize-none font-mono text-sm text-slate-700 dark:text-slate-300"
               placeholder="Type here..."
             />
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-1 flex flex-col shadow-inner min-h-[250px]">
             <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase">Base64 Result</div>
             <textarea 
               value={output}
               readOnly
               className="flex-1 w-full p-3 bg-transparent border-none outline-none resize-none font-mono text-sm text-slate-600 dark:text-slate-400"
               placeholder="Output..."
             />
          </div>
       </div>
    </div>
  );
}