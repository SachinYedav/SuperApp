import { Palette, Droplet, Layout, Eye, Image as ImageIcon, EyeOff } from 'lucide-react';

export const COLOR_TABS = [
  { id: 'palette', label: 'Palette Generator', icon: Layout },
  { id: 'gradient', label: 'Gradient Maker', icon: Droplet },
  { id: 'contrast', label: 'Contrast Checker', icon: Eye },
  { id: 'picker', label: 'Image Picker', icon: ImageIcon },
  { id: 'blindness', label: 'Vision Simulator', icon: EyeOff },
];