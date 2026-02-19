import React from 'react';
import { useParams } from 'react-router-dom';
import { Calendar } from 'lucide-react';

// Global Layout
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import Seo from '@/components/seo/Seo';
import { productivitySeo } from '@/config/seoData';

// Feature Specifics
import { PRODUCTIVITY_TABS } from '@/features/productivity/constants';
import StickyNotes from '@/features/productivity/components/StickyNotes';
import TaskBoard from '@/features/productivity/components/TaskBoard';
import FocusTimer from '@/features/productivity/components/FocusTimer';
import HabitTracker from '@/features/productivity/components/HabitTracker';

export default function ProductivityPage() {
  const { tab } = useParams(); 
  const activeTab = tab || productivitySeo.defaultTab;
  const currentMeta = productivitySeo.tabs[activeTab] || productivitySeo.tabs[productivitySeo.defaultTab];

  return (
    <>
    <Seo 
          title={currentMeta.title}
          description={currentMeta.description}
          keywords={currentMeta.keywords}
          url={`${productivitySeo.basePath}/${activeTab}`}
          type={productivitySeo.type}
       />
    <ToolPageLayout
      title="Productivity"
      subtitle="Organize your workflow"
      icon={Calendar}
      themeColor="blue" 
      tabs={PRODUCTIVITY_TABS}
      activeTab={activeTab}
      basePath="/productivity"
    >
    {activeTab === 'notes' && <StickyNotes />}
    {activeTab === 'tasks' && <TaskBoard />}
    {activeTab === 'focus' && <FocusTimer />}
    {activeTab === 'habits' && <HabitTracker />}
    </ToolPageLayout>
    </>
  );
}