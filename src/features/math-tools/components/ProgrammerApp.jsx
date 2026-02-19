import React, { useState } from 'react';
import { Binary, Cpu, Hash } from 'lucide-react';

export default function ProgrammerApp() {
  const [values, setValues] = useState({ dec: '', bin: '', hex: '', oct: '' });

  const handleChange = (val, type) => {
    if (val === '') {
        setValues({ dec: '', bin: '', hex: '', oct: '' });
        return;
    }

    try {
        let decValue;
        if (type === 'dec') decValue = parseInt(val, 10);
        if (type === 'bin') decValue = parseInt(val, 2);
        if (type === 'hex') decValue = parseInt(val, 16);
        if (type === 'oct') decValue = parseInt(val, 8);

        if (isNaN(decValue)) return; 

        setValues({
            dec: decValue.toString(10),
            bin: decValue.toString(2),
            hex: decValue.toString(16).toUpperCase(),
            oct: decValue.toString(8)
        });
    } catch (e) {
        console.error("Conversion Error");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 animate-fade-in">
        <h3 className="text-lg font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
            <Cpu className="text-purple-500"/> Programmer Base Converter
        </h3>

        <div className="grid grid-cols-1 gap-6">
            <BaseInput label="Decimal (10)" icon={<Hash size={16}/>} value={values.dec} onChange={(e) => handleChange(e.target.value, 'dec')} placeholder="123" />
            <BaseInput label="Hexadecimal (16)" icon="0x" value={values.hex} onChange={(e) => handleChange(e.target.value, 'hex')} placeholder="7B" />
            <BaseInput label="Binary (2)" icon={<Binary size={16}/>} value={values.bin} onChange={(e) => handleChange(e.target.value, 'bin')} placeholder="1111011" />
            <BaseInput label="Octal (8)" icon="0o" value={values.oct} onChange={(e) => handleChange(e.target.value, 'oct')} placeholder="173" />
        </div>
    </div>
  );
}

function BaseInput({ label, icon, value, onChange, placeholder }) {
    return (
        <div className="relative group">
            <label className="text-xs font-bold text-slate-400 uppercase mb-1.5 block ml-1">{label}</label>
            <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 transition-all overflow-hidden">
                <div className="w-12 h-12 flex items-center justify-center bg-slate-100 dark:bg-slate-700/50 text-slate-500 font-bold border-r border-slate-200 dark:border-slate-700">
                    {icon}
                </div>
                <input 
                    type="text" value={value} onChange={onChange} placeholder={placeholder}
                    className="w-full h-12 px-4 bg-transparent outline-none font-mono font-bold text-slate-800 dark:text-white placeholder:text-slate-400 uppercase"
                />
            </div>
        </div>
    );
}