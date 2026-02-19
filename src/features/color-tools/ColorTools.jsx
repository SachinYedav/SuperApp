import React from 'react';
import { useParams } from 'react-router-dom';
import { 
  Palette, Droplet, Layout, Eye, Image as ImageIcon, EyeOff 
} from 'lucide-react';

// Shared Layout
import ToolPageLayout from '@/components/layout/ToolPageLayout';

// Components
import PaletteGenerator from './components/PaletteGenerator';
import GradientMaker from './components/GradientMaker';
import ContrastChecker from './components/ContrastChecker';
import ImagePicker from './components/ImagePicker';
import ColorBlindnessSim from './components/ColorBlindnessSim';

const TABS = [
  { id: 'palette', label: 'Palette', icon: Layout, desc: 'Generate Color Schemes' },
  { id: 'gradient', label: 'Gradient', icon: Droplet, desc: 'CSS Gradient Maker' },
  { id: 'contrast', label: 'Contrast', icon: Eye, desc: 'Accessibility Checker' },
  { id: 'picker', label: 'Picker', icon: ImageIcon, desc: 'Pick from Image' },
  { id: 'blindness', label: 'Simulator', icon: EyeOff, desc: 'Color Blindness Test' },
];

export default function ColorTools() {
  const { tab } = useParams(); 
  const activeTab = tab || 'palette';

  return (
    <ToolPageLayout
      title="Color Master"
      subtitle="Designers Toolkit"
      icon={Palette}
      themeColor="pink" 
      tabs={TABS}
      activeTab={activeTab}
      basePath="/color-tools"
    >
      {activeTab === 'palette' && <PaletteGenerator />}
      {activeTab === 'gradient' && <GradientMaker />}
      {activeTab === 'contrast' && <ContrastChecker />}
      {activeTab === 'picker' && <ImagePicker />}
      {activeTab === 'blindness' && <ColorBlindnessSim />}
    </ToolPageLayout>
  );
}