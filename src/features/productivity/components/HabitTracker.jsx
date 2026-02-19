import React, { useState } from 'react';
import { Check, Plus, Trash2, Trophy } from 'lucide-react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Button, Input, ConfirmModal} from '@/components/ui/index';
import { cn } from '@/utils/cn';

export default function HabitTracker() {
  const [habits, setHabits] = useLocalStorage('prod_habits', []);
  const [input, setInput] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const addHabit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setHabits([...habits, { id: Date.now(), name: input, streak: 0, completedToday: false }]);
    setInput('');
  };

  const toggleHabit = (id) => {
    setHabits(habits.map(h => {
        if (h.id === id) {
            const isComplete = !h.completedToday;
            return { 
                ...h, 
                completedToday: isComplete, 
                streak: isComplete ? h.streak + 1 : Math.max(0, h.streak - 1) 
            };
        }
        return h;
    }));
  };

  // 1. Trigger Modal
  const handleDeleteClick = (id) => {
    setDeleteId(id);
  };

  // 2. Actual Delete Logic
  const confirmDelete = () => {
    if (deleteId) {
        setHabits(habits.filter(h => h.id !== deleteId));
        setDeleteId(null);
    }
  };

  return (
    <div className="h-full flex flex-col animate-fade-in max-w-3xl mx-auto">
        
        {/*Confirmation Modal */}
        <ConfirmModal 
            isOpen={!!deleteId} 
            onClose={() => setDeleteId(null)}
            onConfirm={confirmDelete}
            title="Stop Tracking?"
            message="This will delete your streak history for this habit."
            type="danger"
        />

        <div className="mb-6 flex justify-between items-end">
            <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Habit Tracker</h2>
                <p className="text-xs text-slate-500">Build consistency.</p>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900/20 text-orange-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Trophy size={12}/> {habits.reduce((acc, h) => acc + h.streak, 0)} Total Streak
            </div>
        </div>

        <form onSubmit={addHabit} className="flex gap-3 mb-8 items-end">
            <div className="flex-1">
                <Input 
                    placeholder="New habit (e.g. Read 10 mins)" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                />
            </div>
            <Button type="submit" className="h-[46px] w-[46px] p-0 flex items-center justify-center rounded-xl bg-green-600 hover:bg-green-700 shadow-green-500/20">
                <Plus size={20}/>
            </Button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-20 overflow-y-auto custom-scrollbar">
            {habits.map(habit => (
                <div key={habit.id} className={cn("p-5 rounded-2xl border transition-all flex flex-col justify-between h-32 relative group", habit.completedToday ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-green-300')}>
                    
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-slate-700 dark:text-slate-200">{habit.name}</h3>
                        
                        <button 
                            onClick={() => handleDeleteClick(habit.id)} 
                            className="text-slate-300 hover:text-red-500 transition-opacity opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                        >
                            <Trash2 size={16}/>
                        </button>
                    </div>

                    <div className="flex justify-between items-end">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Streak: <span className="text-lg text-slate-800 dark:text-white ml-1">{habit.streak}</span>🔥
                        </div>
                        <button onClick={() => toggleHabit(habit.id)} className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md active:scale-90", habit.completedToday ? 'bg-green-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-300 border hover:border-green-500')}>
                            <Check size={20} strokeWidth={3}/>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
}