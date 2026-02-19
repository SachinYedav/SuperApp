import { 
  Image as ImageIcon, Video, FileText, Calendar, 
  TvMinimalPlay, Monitor, Calculator, Palette, 
  Bot, Gamepad2, QrCode, Music 
} from 'lucide-react';

export const TOOLS = [
  { 
    id: 'image-editor', name: 'Image Editor', desc: 'Edit, Crop, Filter & Convert Photos', 
    icon: ImageIcon, path: '/image-editor', color: 'bg-blue-500', 
    lightColor: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
  },
  { 
    id: 'video-editor', name: 'Video Editor', desc: 'Trim, Compress & Create GIFs', 
    icon: Video, path: '/video-editor', color: 'bg-purple-500', 
    lightColor: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
  },
  { 
    id: 'pdf-tools', name: 'PDF Tools', desc: 'Merge, Split & Convert Documents', 
    icon: FileText, path: '/pdf-tools', color: 'bg-orange-500', 
    lightColor: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
  },
  { 
    id: 'qr-tools', name: 'QR Command', desc: 'Generate & Scan Wi-Fi, Links', 
    icon: QrCode, path: '/qr-tools', color: 'bg-green-500', 
    lightColor: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
  },
  { 
    id: 'audio-studio', name: 'Audio Studio', desc: 'Record, Cut & Create Ringtones', 
    icon: Music, path: '/audio-studio', color: 'bg-pink-500', 
    lightColor: 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400'
  },
  { 
    id: 'productivity', name: 'Task & Notes', desc: 'Sticky Notes, To-Do, Timer', 
    icon: Calendar, path: '/productivity', color: 'bg-indigo-500', 
    lightColor: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
  },
  { 
    id: 'screen-recorder', name: 'Screen Recording', desc: 'Record Desktop & Mic', 
    icon: TvMinimalPlay, path: '/screen-recorder', color: 'bg-red-500', 
    lightColor: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
  },
  { 
    id: 'digital-canvas', name: 'Digital Canvas', desc: 'Draw, Sketch & Diagram', 
    icon: Monitor, path: '/digital-canvas', color: 'bg-red-500', 
    lightColor: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
  },
  { 
    id: 'math-tools', name: 'Math & Units', desc: 'Calc, Convert & Dates', 
    icon: Calculator, path: '/math-tools', color: 'bg-orange-500', 
    lightColor: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
  },
  { 
    id: 'color-tools', name: 'Color Studio', desc: 'Palette, Gradients & Contrast', 
    icon: Palette, path: '/color-tools', color: 'bg-pink-500', 
    lightColor: 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400'
  },
  { 
    id: 'ai-lab', name: 'AI Command', desc: 'Chat, Code & Write', 
    icon: Bot, path: '/ai-lab', color: 'bg-indigo-600', 
    lightColor: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
  },
  { 
    id: 'arcade', name: 'Brain Arcade', desc: 'Typing, Memory & Reflex', 
    icon: Gamepad2, path: '/arcade', color: 'bg-purple-600', 
    lightColor: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
  },
];