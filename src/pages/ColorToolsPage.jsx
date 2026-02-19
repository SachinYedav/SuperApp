import React from 'react';
import { useParams } from 'react-router-dom';
import { Palette } from 'lucide-react';

import ToolPageLayout from '@/components/layout/ToolPageLayout';
import Seo from '@/components/seo/Seo';
import { colorToolsSeo } from '@/config/seoData';

// Feature Specifics
import { COLOR_TABS } from '@/features/color-tools/constants';
import PaletteGenerator from '@/features/color-tools/components/PaletteGenerator';
import GradientMaker from '@/features/color-tools/components/GradientMaker';
import ContrastChecker from '@/features/color-tools/components/ContrastChecker';
import ImagePicker from '@/features/color-tools/components/ImagePicker';
import ColorBlindnessSim from '@/features/color-tools/components/ColorBlindnessSim';

export default function ColorToolsPage() {
  const { tab } = useParams(); 
  const activeTab = tab || colorToolsSeo.defaultTab;
  const currentMeta = colorToolsSeo.tabs[activeTab] || colorToolsSeo.tabs[colorToolsSeo.defaultTab];

  return (
    <>
      <Seo 
        title={currentMeta.title}
        description={currentMeta.description}
        keywords={currentMeta.keywords}
        url={`${colorToolsSeo.basePath}/${activeTab}`}
        type={colorToolsSeo.type} 
      />

      <ToolPageLayout
        title="Color Master"
        subtitle="Designers Toolkit"
        icon={Palette}
        themeColor="pink" 
        tabs={COLOR_TABS}
        activeTab={activeTab}
        basePath={colorToolsSeo.basePath} 
      >
        {/* Content Rendering */}
        {activeTab === 'palette' && <PaletteGenerator />}
        {activeTab === 'gradient' && <GradientMaker />}
        {activeTab === 'contrast' && <ContrastChecker />}
        {activeTab === 'picker' && <ImagePicker />}
        {activeTab === 'blindness' && <ColorBlindnessSim />}
      </ToolPageLayout>
    </>
  );
}