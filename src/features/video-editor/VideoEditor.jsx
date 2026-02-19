import React, { useState } from 'react';
import {
  Clapperboard, Sparkles, Layers, Zap, Bell,
  ChevronRight, Star, Video, Wand2, Film
} from 'lucide-react';
import Seo from '@/components/seo/Seo';

export default function VideoEditor() {
  const [notified, setNotified] = useState(false);

  const handleNotify = () => {
    setNotified(true);
    setTimeout(() => setNotified(false), 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full animate-fade-in-up">
      <Seo 
      title="Advanced Video Editor"
      description="Edit videos offline. Trim, cut, merge clips, and add effects without uploading large files to a server."
      keywords={["video editor", "video trimmer", "movie maker", "offline video editing", "merge video"]}
      url="/video-editor"
      type="tool"
    />
      
      {/* --- 1. HERO SECTION --- */}
      <div className="text-center max-w-3xl px-4 mb-16 relative">
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px] -z-10 dark:opacity-40"></div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 mb-6 shadow-sm">
          <Sparkles size={14} className="text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-bold tracking-wide text-blue-700 dark:text-blue-300 uppercase">
            Coming Soon
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
          Professional <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Video Editing</span> <br className="hidden md:block"/> 
          in Your Browser.
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
          No heavy software needed. We are building a powerful multi-track editor 
          with AI magic, directly integrated into your workspace.
        </p>

        {/* Action Button */}
        <div className="flex justify-center">
          <button
            onClick={handleNotify}
            disabled={notified}
            className={`group px-8 py-3.5 rounded-xl font-bold text-sm md:text-base flex items-center gap-3 transition-all duration-300 shadow-lg hover:-translate-y-1
              ${notified
                ? 'bg-green-500 text-white shadow-green-500/30 cursor-default'
                : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:shadow-xl hover:bg-slate-800 dark:hover:bg-blue-50'
              }`}
          >
            {notified ? (
              <>
                <Star size={18} fill="currentColor" /> You're on the list!
              </>
            ) : (
              <>
                <Bell size={18} /> Notify Me When Ready
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/>
              </>
            )}
          </button>
        </div>
      </div>

      {/* --- 2. FEATURES GRID  --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl px-4">
        
        {/* Feature 1 */}
        <FeatureCard 
          icon={Layers}
          title="Multi-Track Timeline"
          desc="Layer videos, audio, and text with a professional drag-and-drop timeline interface."
          color="text-purple-600 dark:text-purple-400"
          bgColor="bg-purple-50 dark:bg-purple-900/20"
        />

        {/* Feature 2 */}
        <FeatureCard 
          icon={Wand2} 
          title="AI Magic Tools"
          desc="Auto-captions, background removal, and smart cuts powered by Gemini AI."
          color="text-blue-600 dark:text-blue-400"
          bgColor="bg-blue-50 dark:bg-blue-900/20"
        />

        {/* Feature 3 */}
        <FeatureCard 
          icon={Film} 
          title="4K Export & GIFs"
          desc="Render high-quality videos locally without watermarks. Export as MP4 or GIF."
          color="text-orange-600 dark:text-orange-400"
          bgColor="bg-orange-50 dark:bg-orange-900/20"
        />

      </div>
    </div>
  );
}

// --- SUB COMPONENT: Feature Card  ---
function FeatureCard({ icon: Icon, title, desc, color, bgColor }) {
  return (
    <div className="group p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all">
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${bgColor} ${color} group-hover:scale-110 transition-transform`}>
        <Icon size={28} />
      </div>
      <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-2 group-hover:text-blue-600 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
        {desc}
      </p>
    </div>
  );
}