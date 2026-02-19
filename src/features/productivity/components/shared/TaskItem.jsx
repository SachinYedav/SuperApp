import React from 'react';
import { CheckCircle, Circle, Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <div className={cn(
        "flex items-center gap-4 p-4 rounded-2xl border transition-all group",
        task.completed 
            ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 opacity-60' 
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-300 dark:hover:border-blue-700'
    )}>
        <button onClick={onToggle} className={cn("shrink-0 transition-colors", task.completed ? 'text-green-500' : 'text-slate-300 hover:text-blue-500')}>
            {task.completed ? <CheckCircle size={22} fill="currentColor" className="text-green-100 dark:text-green-900"/> : <Circle size={22}/>}
        </button>
        
        <span className={cn("flex-1 text-sm font-medium transition-all", task.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200')}>
            {task.text}
        </span>
        
        <button onClick={onDelete} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100">
            <Trash2 size={16} />
        </button>
    </div>
  );
}