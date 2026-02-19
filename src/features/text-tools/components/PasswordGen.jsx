import React, { useState, useEffect } from 'react';
import { RefreshCw, Copy, Check, ShieldCheck, ShieldAlert, Settings2, Sliders } from 'lucide-react';
import Toast from '@/components/ui/Toast';

export default function PasswordGen() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    upper: true, lower: true, numbers: true, symbols: true,
  });
  const [strength, setStrength] = useState('Weak');
  const [toast, setToast] = useState(null);

  useEffect(() => { generate(); }, [length, options]);

  const generate = () => {
    const charset = {
      lower: 'abcdefghijklmnopqrstuvwxyz',
      upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-=',
    };
    let chars = '';
    if (options.lower) chars += charset.lower;
    if (options.upper) chars += charset.upper;
    if (options.numbers) chars += charset.numbers;
    if (options.symbols) chars += charset.symbols;
    if (!chars) chars = charset.lower;

    let pass = '';
    for (let i = 0; i < length; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pass);
    calculateStrength(pass);
  };

  const calculateStrength = (pass) => {
    let score = 0;
    if (pass.length > 8) score++;
    if (pass.length > 12) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 2) setStrength('Weak');
    else if (score <= 4) setStrength('Medium');
    else setStrength('Strong');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setToast({ message: 'Password Copied!', type: 'success' });
  };

  const getStrengthColor = () => {
    if (strength === 'Weak') return 'bg-red-500 shadow-red-500/50';
    if (strength === 'Medium') return 'bg-yellow-500 shadow-yellow-500/50';
    return 'bg-green-500 shadow-green-500/50';
  };

  return (
    <div className="flex flex-col h-full gap-6 animate-fade-in relative">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* --- DISPLAY AREA (Fixed Height) --- */}
      <div className="bg-slate-800 dark:bg-slate-900 p-6 sm:p-10 rounded-3xl text-center shadow-xl relative overflow-hidden group shrink-0">
        <div className={`absolute top-0 left-0 w-full h-1.5 transition-colors duration-500 ${strength === 'Strong' ? 'bg-green-500' : strength === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
        
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1.5 shadow-lg transition-all duration-300 ${getStrengthColor()}`}>
           {strength === 'Strong' ? <ShieldCheck size={12}/> : <ShieldAlert size={12}/>}
           {strength.toUpperCase()}
        </div>

        <div className="text-3xl sm:text-5xl font-mono font-bold text-white tracking-wider break-all mb-8 mt-4 selection:bg-blue-500/30">
          {password}
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3">
           <button onClick={generate} className="p-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white transition-all active:scale-95 shadow-lg border border-slate-600 hover:border-slate-500 flex justify-center items-center gap-2">
              <RefreshCw size={20} className={options.length < 1 ? "" : "group-hover:rotate-180 transition-transform duration-500"}/>
              <span className="sm:hidden text-sm font-bold">Regenerate</span>
           </button>
           <button onClick={copyToClipboard} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-500/20">
              <Copy size={20}/> Copy Password
           </button>
        </div>
      </div>

      {/* --- CONTROLS AREA (Fills Remaining Space) --- */}
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-start">
         <div className="flex items-center gap-2 mb-6 text-slate-400 uppercase text-xs font-bold tracking-widest pb-4 border-b border-slate-100 dark:border-slate-800">
            <Settings2 size={14}/> Configuration
         </div>

         <div className="flex flex-col gap-8 w-full">
             <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                       <Sliders size={16} className="text-blue-500"/> Length
                   </label>
                   <span className="text-sm font-mono bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-lg text-blue-600 dark:text-blue-400 font-bold border border-blue-100 dark:border-blue-800">
                       {length}
                   </span>
                </div>
                <input 
                  type="range" min="6" max="64" value={length} 
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {Object.keys(options).map((key) => (
                   <button
                     key={key}
                     onClick={() => setOptions({ ...options, [key]: !options[key] })}
                     className={`p-4 rounded-xl border flex items-center justify-between transition-all active:scale-95
                     ${options[key] 
                       ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 shadow-sm' 
                       : 'bg-white border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'}`}
                   >
                      <span className="capitalize text-sm font-bold">{key}</span>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${options[key] ? 'bg-blue-500 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>
                          {options[key] && <Check size={12} strokeWidth={4}/>}
                      </div>
                   </button>
                ))}
             </div>
         </div>
      </div>
    </div>
  );
}