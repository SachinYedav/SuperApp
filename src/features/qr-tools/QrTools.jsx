import React from 'react';
import { useParams } from 'react-router-dom';
import { QrCode, Scan } from 'lucide-react';

// Shared Layout
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { qrToolsSeo } from '@/config/seoData';
import Seo from '@/components/seo/Seo'

// Components
import QrGenerator from './components/QrGenerator';
import QrScanner from './components/QrScanner';

const TABS = [
  { id: 'generator', label: 'Generator', icon: QrCode, desc: 'Create Custom QRs' },
  { id: 'scanner', label: 'Scanner', icon: Scan, desc: 'Scan from Camera' },
];

export default function QrTools() {
  const { tab } = useParams(); 
  const activeTab = tab || qrToolsSeo.defaultTab;
  const currentMeta = qrToolsSeo.tabs[activeTab] || qrToolsSeo.tabs[qrToolsSeo.defaultTab];

  return (
    <>
    <Seo 
          title={currentMeta.title}
          description={currentMeta.description}
          keywords={currentMeta.keywords} 
          url={`${qrToolsSeo.basePath}/${activeTab}`}
          type={qrToolsSeo.type} 
       />
    <ToolPageLayout
      title="QR Studio"
      subtitle="Generate & Scan Codes"
      icon={QrCode}
      themeColor="blue"
      tabs={TABS}
      activeTab={activeTab}
      basePath="/qr-tools"
    >
      {activeTab === 'generator' ? <QrGenerator /> : <QrScanner />}
    </ToolPageLayout>
    </>
  );
}