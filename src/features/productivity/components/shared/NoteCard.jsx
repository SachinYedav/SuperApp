import React from 'react';
import { Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function NoteCard({ note, onUpdate, onDelete }) {
  return (
    <div className={cn("p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col relative group min-h-[200px] animate-scale-in border border-transparent dark:border-white/5", note.color)}>
        <textarea 
            value={note.text}
            onChange={(e) => onUpdate(note.id, e.target.value)}
            placeholder="Type something..."
            className="flex-1 w-full bg-transparent border-none outline-none resize-none text-slate-800 dark:text-slate-200 text-sm font-medium placeholder:text-slate-500/50 leading-relaxed scrollbar-hide"
            spellCheck={false}
        />
        <div className="flex justify-between items-center mt-4 pt-2 border-t border-black/5 dark:border-white/10">
            <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">{note.date}</span>
            <button 
                onClick={() => onDelete(note.id)} 
                className="p-2 bg-white/50 hover:bg-white text-slate-600 hover:text-red-500 dark:bg-black/10 dark:hover:bg-black/30 dark:text-slate-300 rounded-full transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100 shadow-sm"
            >
                <Trash2 size={14} />
            </button>
        </div>
    </div>
  );
}