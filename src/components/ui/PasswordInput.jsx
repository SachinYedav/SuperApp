import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function PasswordInput({ 
  value, 
  onChange, 
  placeholder, 
  label, 
  icon: Icon, 
  disabled, 
  className 
}) {
  const [show, setShow] = useState(false);

  return (
    <div className={className}>
      {label && <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 block">{label}</label>}
      
      <div className="relative group">
        {/* Optional Left Icon */}
        {Icon && (
          <Icon 
            size={16} 
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" 
          />
        )}

        <input 
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            "w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm dark:text-white placeholder:text-slate-400 py-3 pr-10",
            Icon ? "pl-10" : "pl-4", 
            disabled && "opacity-60 cursor-not-allowed"
          )}
        />

        {/* Toggle Button */}
        <button 
          type="button" 
          onClick={() => setShow(!show)} 
          disabled={disabled}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors disabled:opacity-50"
        >
          {show ? <EyeOff size={16}/> : <Eye size={16}/>}
        </button>
      </div>
    </div>
  );
}