import React from 'react';
import { useParams } from 'react-router-dom';
import { Calculator } from 'lucide-react';

// Shared Layout
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import Seo from '@/components/seo/Seo';
import { mathToolsSeo } from '@/config/seoData';

// Feature Specifics
import { MATH_TABS } from '@/features/math-tools/constants';
import CalculatorApp from '@/features/math-tools/components/CalculatorApp';
import ConverterApp from '@/features/math-tools/components/ConverterApp';
import DateApp from '@/features/math-tools/components/DateApp';
import GraphPlotter from '@/features/math-tools/components/GraphPlotter';
import FinanceApp from '@/features/math-tools/components/FinanceApp';
import ProgrammerApp from '@/features/math-tools/components/ProgrammerApp';

export default function MathToolsPage() {
  const { tab } = useParams();
    const activeTab = tab || mathToolsSeo.defaultTab;
    const currentMeta = mathToolsSeo.tabs[activeTab] || mathToolsSeo.tabs[mathToolsSeo.defaultTab];

  return (
    <>
    <Seo 
              title={currentMeta.title}
              description={currentMeta.description}
              keywords={currentMeta.keywords}
              url={`${mathToolsSeo.basePath}/${activeTab}`}
              type={mathToolsSeo.type}
           />
    <ToolPageLayout
      title="Math Hub"
      subtitle="Calculate & Convert"
      icon={Calculator}
      themeColor="orange" // ✨ Magic Theme
      tabs={MATH_TABS}
      activeTab={activeTab}
      basePath="/math-tools"
    >
      {/* Content Rendering Logic */}
      {activeTab === 'calculator' && <CalculatorApp />}
      {activeTab === 'convert' && <ConverterApp />}
      {activeTab === 'finance' && <FinanceApp />}
      {activeTab === 'date' && <DateApp />}
      {activeTab === 'programmer' && <ProgrammerApp />}
      {activeTab === 'graph' && <GraphPlotter />}
    </ToolPageLayout>
    </>
  );
}