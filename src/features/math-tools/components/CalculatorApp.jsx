import React, { useState } from 'react';
import { Delete, History, ChevronDown, ChevronUp } from 'lucide-react';
import { evaluateExpr } from '../utils/mathUtils';
import useLocalStorage from '@/hooks/useLocalStorage';

export default function CalculatorApp() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useLocalStorage('calc_history', []);
  const [isScientific, setIsScientific] = useState(false);

  const handleBtn = (val) => {
    if (val === 'C') {
        setInput('');
        setResult('');
    }
    else if (val === 'DEL') setInput(input.slice(0, -1));
    else if (val === '=') {
      const res = evaluateExpr(input);
      if (res !== 'Error') {
          setHistory([{ expr: input, res }, ...history].slice(0, 10)); 
          setResult(res);
          setInput(String(res));
      } else {
          setResult('Error');
      }
    } else {
      setInput(input + val);
    }
  };

  const BASIC_BTNS = [
    { l: 'C', c: 'text-red-500' }, { l: '(', c: 'text-blue-500' }, { l: ')', c: 'text-blue-500' }, { l: 'DEL', icon: Delete, c: 'text-red-500' },
    { l: '7' }, { l: '8' }, { l: '9' }, { l: '÷', v: '/' },
    { l: '4' }, { l: '5' }, { l: '6' }, { l: '×', v: '*' },
    { l: '1' }, { l: '2' }, { l: '3' }, { l: '-', v: '-' },
    { l: '0' }, { l: '.' }, { l: '=', c: 'bg-orange-500 text-white row-span-2 h-full rounded-2xl shadow-lg shadow-orange-500/30' }, { l: '+', v: '+' }
  ];

  const SCI_BTNS = [
    { l: 'sin', v: 'sin(' }, { l: 'cos', v: 'cos(' }, { l: 'tan', v: 'tan(' }, { l: 'π', v: 'π' },
    { l: 'ln', v: 'ln(' }, { l: 'log', v: 'log(' }, { l: '√', v: '√(' }, { l: '^', v: '^' },
  ];

  return (
    <div className="w-full max-w-sm mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col h-[600px] animate-scale-in">
      
      {/* Display Area */}
      <div className="flex-[0.4] bg-slate-50 dark:bg-slate-950 p-6 flex flex-col justify-end items-end relative border-b border-slate-100 dark:border-slate-800">
        
        {/* History Dropdown */}
        <div className="absolute top-4 left-4 group cursor-pointer z-10">
            <History size={20} className="text-slate-400 group-hover:text-orange-500 transition-colors"/>
            <div className="absolute top-8 left-0 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl p-2 hidden group-hover:block border border-slate-200 dark:border-slate-700">
                {history.length === 0 && <p className="text-xs text-center text-slate-400 p-2">No history</p>}
                {history.map((h, i) => (
                    <div key={i} onClick={() => setInput(String(h.res))} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-right cursor-pointer">
                        <div className="text-xs text-slate-400">{h.expr} =</div>
                        <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{h.res}</div>
                    </div>
                ))}
            </div>
        </div>

        <div className="text-sm text-slate-400 mb-1 h-6 overflow-hidden">{result ? `${input} =` : ''}</div>
        <div className="text-4xl font-mono font-bold text-slate-800 dark:text-white break-all text-right w-full">
          {input || '0'}
        </div>
      </div>

      {/* Keypad */}
      <div className="flex-1 p-4 bg-white dark:bg-slate-900 flex flex-col gap-3">
          <button onClick={() => setIsScientific(!isScientific)} className="w-full py-1 text-xs font-bold text-slate-400 flex items-center justify-center gap-1 hover:text-orange-500 transition-colors">
              {isScientific ? <ChevronDown size={14}/> : <ChevronUp size={14}/>} 
              {isScientific ? 'Hide' : 'Show'} Scientific
          </button>

          {isScientific && (
              <div className="grid grid-cols-4 gap-2 mb-2 animate-fade-in">
                  {SCI_BTNS.map((b, i) => (
                      <button key={i} onClick={() => handleBtn(b.v)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                          {b.l}
                      </button>
                  ))}
              </div>
          )}

          <div className="grid grid-cols-4 gap-3 flex-1">
             {BASIC_BTNS.map((b, i) => (
               <button
                 key={i}
                 onClick={() => handleBtn(b.v || b.l)}
                 className={`rounded-2xl text-xl font-bold transition-all active:scale-95 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800
                 ${!b.c?.includes('bg-') ? 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200' : ''}
                 ${b.c || ''}`}
               >
                 {b.icon ? <b.icon size={24}/> : b.l}
               </button>
             ))}
          </div>
      </div>
    </div>
  );
}