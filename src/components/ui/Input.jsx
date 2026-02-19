import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';

const Input = forwardRef(({ 
  label, 
  error, 
  className, 
  type = "text",
  id,
  ...props 
}, ref) => {
  
  const inputId = id || Math.random().toString(36).substr(2, 9);

  return (
    <div className="w-full space-y-2">
      {label && (
        <label htmlFor={inputId} className="text-sm font-bold text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      
      <input
        ref={ref}
        type={type}
        id={inputId}
        className={cn(
          "w-full bg-white dark:bg-slate-950 border rounded-xl px-4 py-2.5 text-sm outline-none transition-all placeholder:text-slate-400",
          "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
          error 
            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
            : "border-slate-300 dark:border-slate-800",
          className
        )}
        {...props}
      />
      
      {error && (
        <p className="text-xs font-medium text-red-500 animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";
export default Input;