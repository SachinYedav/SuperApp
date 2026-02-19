import React, { useState, useEffect } from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { UNITS, convertUnit } from '../utils/mathUtils';

export default function ConverterApp() {
  const [category, setCategory] = useState('length');
  const [val, setVal] = useState(1);
  const [from, setFrom] = useState('m');
  const [to, setTo] = useState('km');
  const [result, setResult] = useState(0);

  const OPTIONS = category === 'temperature' ? ['C', 'F', 'K'] : Object.keys(UNITS[category].units);

  useEffect(() => {
    if (category !== 'temperature') {
      const keys = Object.keys(UNITS[category].units);
      setFrom(keys[0]);
      setTo(keys[1] || keys[0]);
    } else {
      setFrom('C'); setTo('F');
    }
  }, [category]);

  useEffect(() => {
    const res = convertUnit(val, from, to, category);
    setResult(res);
  }, [val, from, to, category]);

  return (
    <div className="w-full max-w-lg mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 animate-fade-in">
      
      <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
        {['length', 'weight', 'temperature', 'data', 'time'].map(c => (
          <button 
            key={c}
            onClick={() => setCategory(c)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold capitalize whitespace-nowrap transition-all
            ${category === c ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
        {/* FROM */}
        <div className="flex-1 w-full">
          <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-wider">From</label>
          <div className="relative group">
              <input 
                type="number" value={val} onChange={(e) => setVal(Number(e.target.value))}
                className="w-full p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl text-2xl font-bold outline-none border-2 border-transparent focus:border-orange-500 transition-colors text-slate-800 dark:text-white"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 pointer-events-none">{from}</span>
          </div>
          <select 
            value={from} onChange={(e) => setFrom(e.target.value)}
            className="w-full mt-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-300 border-none outline-none cursor-pointer"
          >
            {OPTIONS.map(u => <option key={u} value={u}>{u.toUpperCase()}</option>)}
          </select>
        </div>

        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-full text-slate-400 rotate-90 sm:rotate-0">
            <ArrowRightLeft size={20} />
        </div>

        {/* TO */}
        <div className="flex-1 w-full">
          <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-wider">To</label>
          <div className="w-full p-4 bg-orange-50 dark:bg-orange-900/10 rounded-2xl text-2xl font-bold text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-900/30 overflow-hidden truncate relative h-[68px] flex items-center">
            {Number(result.toFixed(4))}
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-orange-400/50">{to}</span>
          </div>
          <select 
            value={to} onChange={(e) => setTo(e.target.value)}
            className="w-full mt-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-300 border-none outline-none cursor-pointer"
          >
            {OPTIONS.map(u => <option key={u} value={u}>{u.toUpperCase()}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}