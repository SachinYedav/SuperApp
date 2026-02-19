import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Button, Input, ConfirmModal} from '@/components/ui/index';
import TaskItem from './shared/TaskItem';

export default function TaskBoard() {
  const [tasks, setTasks] = useLocalStorage('prod_tasks', []);
  const [input, setInput] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const addTask = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTasks([{ id: Date.now(), text: input, completed: false }, ...tasks]);
    setInput('');
  };

  const toggleTask = (id) => setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

  // 1. Trigger Modal
  const handleDeleteClick = (id) => {
    setDeleteId(id);
  };

  // 2. Actual Delete Logic
  const confirmDelete = () => {
    if (deleteId) {
        setTasks(tasks.filter(t => t.id !== deleteId)); 
        setDeleteId(null);
    }
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="h-full flex flex-col animate-fade-in max-w-3xl mx-auto">
      <ConfirmModal 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Task?"
        message="Are you sure you want to remove this task?"
        type="danger"
      />

      <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Tasks</h2>
          <p className="text-xs text-slate-500">Manage your daily goals.</p>
      </div>
      
      <form onSubmit={addTask} className="flex gap-3 mb-8 items-end">
        <div className="flex-1">
            <Input 
                placeholder="Add a new task..." 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
            />
        </div>
        <Button type="submit" className="h-[46px] w-[46px] p-0 flex items-center justify-center rounded-xl">
            <Plus size={20}/>
        </Button>
      </form>

      <div className="flex-1 space-y-6 overflow-y-auto custom-scrollbar pb-20">
         
         {/* Active Tasks */}
         <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">To Do ({activeTasks.length})</h3>
            {activeTasks.length === 0 && <p className="text-sm text-slate-400 px-2 italic">No pending tasks.</p>}
            {activeTasks.map(task => (
                <TaskItem 
                    key={task.id} 
                    task={task} 
                    onToggle={() => toggleTask(task.id)} 
                    onDelete={() => handleDeleteClick(task.id)} 
                />
            ))}
         </div>

         {/* Completed Tasks */}
         {completedTasks.length > 0 && (
             <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Completed ({completedTasks.length})</h3>
                {completedTasks.map(task => (
                    <TaskItem 
                        key={task.id} 
                        task={task} 
                        onToggle={() => toggleTask(task.id)} 
                        onDelete={() => handleDeleteClick(task.id)} 
                    />
                ))}
             </div>
         )}
      </div>
    </div>
  );
}