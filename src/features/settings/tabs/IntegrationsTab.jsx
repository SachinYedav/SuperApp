import React from "react";
import { 
  Bot, 
  Github, 
  HardDrive, 
  Cloud, 
  Image as ImageIcon, 
  Database,
  FileText,
  Server,
  Figma,
  Code2
} from "lucide-react";

// Imported UI Components
import { SectionHeader } from "@/components/ui/index";
import ComingSoonCard from "../components/ComingSoonCard";

export default function IntegrationsTab() {
  
  return (
    <div className="space-y-10 animate-fade-in-up pb-10">
      
      {/* HEADER INFO */}
      <div className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
           ⚡ Integration Hub
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
          Extend the capabilities of your SuperApp. Connect with your favorite cloud storage, 
          developer tools, and AI services.
        </p>
      </div>

      {/* 1. CORE INFRASTRUCTURE (Active System) */}
      <div>
        <SectionHeader label="System Core" icon={Server} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {/* Custom Active Card for Appwrite */}
           <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-pink-200 dark:border-pink-900/30 shadow-sm relative overflow-hidden group">
              {/* Status Badge */}
              <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-sm z-10">
                  CONNECTED
              </div>
              
              <div className="flex items-center gap-4 mb-3 relative z-10">
                  <div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-xl text-pink-500 group-hover:scale-110 transition-transform duration-300">
                      <Database size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                      <h4 className="font-bold text-slate-800 dark:text-white text-base">Appwrite Cloud</h4>
                      <p className="text-xs text-slate-500">Backend & Auth Provider</p>
                  </div>
              </div>
              
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed relative z-10">
                  Handling secure user authentication, database storage, and file management for this application.
              </p>

              {/* Decorative Background Blur */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-pink-500/5 rounded-full blur-3xl pointer-events-none"></div>
           </div>
        </div>
      </div>

      {/* 2. AI & INTELLIGENCE */}
      <div>
        <SectionHeader label="AI & Intelligence" icon={Bot} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ComingSoonCard
            name="Google Gemini 2.0"
            desc="Advanced chat, code debugging, and vision analysis."
            icon={Bot}
            color="text-indigo-500"
            badgeText="Coming Soon"
          />
          <ComingSoonCard
            name="OpenAI GPT-4"
            desc="Generate creative text and summarize documents."
            icon={Bot}
            color="text-green-500"
          />
        </div>
      </div>

      {/* 3. CLOUD & STORAGE */}
      <div>
        <SectionHeader label="Cloud & Storage" icon={Cloud} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ComingSoonCard
            name="Google Drive"
            desc="Save PDFs and edited videos directly to Drive."
            icon={HardDrive}
            color="text-blue-500"
          />
          <ComingSoonCard
            name="Dropbox"
            desc="Sync your documents and project backups seamlessly."
            icon={Cloud}
            color="text-blue-400"
          />
          <ComingSoonCard
            name="Notion"
            desc="Export sticky notes and tasks to Notion pages."
            icon={FileText}
            color="text-slate-800 dark:text-white"
          />
        </div>
      </div>

      {/* 4. DEVELOPER TOOLS */}
      <div>
        <SectionHeader label="Developer Tools" icon={Code2} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ComingSoonCard
            name="GitHub"
            desc="Sync code snippets from DevTools directly to Gists."
            icon={Github}
            color="text-slate-900 dark:text-white"
          />
          <ComingSoonCard
            name="Unsplash"
            desc="Import high-res stock photos into Image Editor."
            icon={ImageIcon}
            color="text-slate-800 dark:text-white"
          />
          <ComingSoonCard
            name="Figma"
            desc="Import assets directly from your Figma designs."
            icon={Figma}
            color="text-purple-500"
          />
        </div>
      </div>

    </div>
  );
}