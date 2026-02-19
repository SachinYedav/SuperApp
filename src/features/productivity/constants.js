import { StickyNote, CheckSquare, Clock, Activity } from 'lucide-react';

export const PRODUCTIVITY_TABS = [
  { id: 'notes', label: 'Sticky Notes', icon: StickyNote },
  { id: 'tasks', label: 'Task Board', icon: CheckSquare },
  { id: 'focus', label: 'Focus Zone', icon: Clock },
  { id: 'habits', label: 'Habit Tracker', icon: Activity },
];

export const NOTE_COLORS = [
  'bg-yellow-100 dark:bg-yellow-900/20', 
  'bg-blue-100 dark:bg-blue-900/20', 
  'bg-green-100 dark:bg-green-900/20', 
  'bg-red-100 dark:bg-red-900/20', 
  'bg-purple-100 dark:bg-purple-900/20', 
  'bg-orange-100 dark:bg-orange-900/20'
];

export const AMBIENT_SOUNDS = [
    { id: 'rain', label: 'Rain', url: '/assets/sounds/rain.mp3' },
    { id: 'cafe', label: 'Cafe', url: '/assets/sounds/cafe.mp3' },
    { id: 'white', label: 'White Noise', url: '/assets/sounds/white_noise.mp3' },
];