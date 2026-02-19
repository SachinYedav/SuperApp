import { Keyboard, Zap, Target, Brain, Calculator, Hash } from 'lucide-react';

export const ARCADE_GAMES = [
  { 
    id: 'reaction', 
    label: 'Reaction Time', 
    icon: Zap, 
    desc: 'Test your reflexes',
    scoreType: 'ASC', 
    unit: 'ms'
  },
  { 
    id: 'aim', 
    label: 'Aim Trainer', 
    icon: Target, 
    desc: 'Mouse precision test',
    scoreType: 'ASC', 
    unit: 'ms'
  },
  { 
    id: 'typing', 
    label: 'Speed Typer', 
    icon: Keyboard, 
    desc: 'Test WPM & Accuracy',
    scoreType: 'DESC', 
    unit: 'wpm'
  },
  { 
    id: 'memory', 
    label: 'Memory Matrix', 
    icon: Brain, 
    desc: 'Visual pattern memory',
    scoreType: 'DESC',
    unit: 'Lvl'
  },
  { 
    id: 'math', 
    label: 'Mental Math', 
    icon: Calculator, 
    desc: 'Rapid calculation',
    scoreType: 'DESC',
    unit: 'pts'
  },
  { 
    id: 'number', 
    label: 'Number Memory', 
    icon: Hash, 
    desc: 'Remember longer digits',
    scoreType: 'DESC', 
    unit: 'Lvl'
  },
];