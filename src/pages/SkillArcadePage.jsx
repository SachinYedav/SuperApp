import React from 'react';
import { useParams } from 'react-router-dom';
import { Gamepad2, Trophy } from 'lucide-react';

// Global Layout
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import Seo from '@/components/seo/Seo';
import { skillArcadeSeo } from '@/config/seoData';

// Features
import { ARCADE_GAMES } from '@/features/arcade/constants';
import LeaderboardView from '@/features/arcade/components/LeaderboardView';

// Games
import ReactionTime from '@/features/arcade/components/games/ReactionTime';
import AimTrainer from '@/features/arcade/components/games/AimTrainer';
import SpeedTyper from '@/features/arcade/components/games/SpeedTyper';
import MemoryMatrix from '@/features/arcade/components/games/MemoryMatrix';
import MentalMath from '@/features/arcade/components/games/MentalMath';
import NumberMemory from '@/features/arcade/components/games/NumberMemory';

const TABS = [
    ...ARCADE_GAMES,
    { id: 'leaderboard', label: 'Hall of Fame', icon: Trophy }
];

export default function SkillArcadePage() {
  const { tab } = useParams(); 
 const activeTab = tab || skillArcadeSeo.defaultTab;
  const currentMeta = skillArcadeSeo.tabs[activeTab] || skillArcadeSeo.tabs[skillArcadeSeo.defaultTab];

  return (
    <>
    <Seo 
        title={currentMeta.title}
        description={currentMeta.description}
        keywords={currentMeta.keywords}
        url={`${skillArcadeSeo.basePath}/${activeTab}`}
        type="game" // Ya 'tool' bhi rakh sakte hain
      />
    <ToolPageLayout
      title="Skill Arcade"
      subtitle="Train your brain & fingers"
      icon={Gamepad2}
      themeColor="purple"
      tabs={TABS}
      activeTab={activeTab}
      basePath="/arcade"
    >
        <div 
            className="absolute inset-0 pointer-events-none z-0 opacity-20"
            style={{
                backgroundImage: `linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
                backgroundPosition: 'center center'
            }}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_100%)]" />
        </div>

        <div className="relative z-10 w-full h-full flex flex-col justify-center max-w-5xl mx-auto">
            
            {activeTab === 'reaction' && <ReactionTime />}
            {activeTab === 'aim' && <AimTrainer />}
            {activeTab === 'typing' && <SpeedTyper />}
            {activeTab === 'memory' && <MemoryMatrix />}
            {activeTab === 'math' && <MentalMath />}
            {activeTab === 'number' && <NumberMemory />}
            
            {activeTab === 'leaderboard' && <LeaderboardView />}
            
        </div>
    </ToolPageLayout>
    </>
  );
}