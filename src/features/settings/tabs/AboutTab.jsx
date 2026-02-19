import React from "react";
import {
  Shield,
  Globe,
  Github,
  Mail,
  FileText,
  Layers,
  Code,
  Cpu,
  Sparkles,
  Heart,
  Database,
  Route,
  Film,
  PenTool,
  Video,
  Activity,
  Palette,
  Grip
} from "lucide-react";
import { SectionHeader, LinkRow, Badge } from "@/components/ui/index";
import pkg from "../../../../package.json"; 

export default function AboutTab() {
  const currentYear = new Date().getFullYear();
  const appVersion = pkg.version || "1.0.0"; 

  return (
    <div className="space-y-8 animate-fade-in-up pb-10">
     {/* HERO */}
      <div className="flex flex-col items-center justify-center pt-4 pb-6">
        <div className="relative group cursor-default">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center transform transition-all duration-500 group-hover:rotate-[8deg] group-hover:scale-110">
            <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-500/30 blur-xl rounded-full -z-10 group-hover:bg-blue-500/50 transition-colors duration-500"></div>
            
            <img 
              src="/assets/icons/pwa-192x192.png" 
              alt="SuperApp Logo" 
              className="w-full h-full object-contain drop-shadow-xl" 
            />
          </div>

          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-slate-900 dark:bg-slate-800 rounded-full flex items-center justify-center border-4 border-slate-50 dark:border-slate-950 z-10">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-violet-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-fuchsia-400 mt-5 mb-1 pb-1">
          SuperApp
        </h2>
        
        <div className="flex items-center gap-2 mt-2">
          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-mono font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 shadow-sm">
            <Sparkles size={10} className="text-blue-500" /> v{appVersion} (Beta)
          </span>
          <span className="text-xs text-slate-400 font-medium">
            Build 2026.02.19
          </span>
        </div>
      </div>

      {/* LINKS */}
      <div>
        <SectionHeader label="Connect" />
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <LinkRow
            icon={Globe}
            label="Official Website"
            desc="superapp.com"
            href="#"
          />
          <LinkRow
            icon={Github}
            label="Source Code"
            desc="github.com/sachin/superapp"
            href="#"
          />
          <LinkRow
            icon={Mail}
              label="Contact Support"
            desc="help@superapp.com"
            href="#"
            isLast
          />
        </div>
      </div>

      {/* LEGAL */}
      <div>
        <SectionHeader label="Legal" />
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <LinkRow
            icon={Shield}
            label="Privacy Policy"
            to="/legal/privacy-policy"
          />
          <LinkRow
            icon={FileText}
            label="Terms of Service"
            to="/legal/terms-of-service"
          />
          <LinkRow
            icon={Layers}
            label="Open Source Licenses"
            to="/legal/open-source"
            isLast
          />
        </div>
      </div>

      {/* TECH STACK */}
      <div>
        <SectionHeader label="Powered By" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {/* Main Core */}
          <Badge
            label="React 19"
            icon={Code}
            colorClass="text-cyan-500"
            bgClass="bg-cyan-50 dark:bg-cyan-900/10"
          />
          <Badge
            label="Appwrite"
            icon={Cpu}
            colorClass="text-pink-500"
            bgClass="bg-pink-50 dark:bg-pink-900/10"
          />
          <Badge
            label="Tailwind CSS"
            icon={Layers}
            colorClass="text-blue-500"
            bgClass="bg-blue-50 dark:bg-blue-900/10"
          />
          <Badge
            label="Vite"
            icon={Sparkles}
            colorClass="text-yellow-500"
            bgClass="bg-yellow-50 dark:bg-yellow-900/10"
          />
          
          {/* State & Routing */}
          <Badge
            label="Redux Toolkit"
            icon={Database}
            colorClass="text-purple-500"
            bgClass="bg-purple-50 dark:bg-purple-900/10"
          />
          <Badge
            label="React Router"
            icon={Route}
            colorClass="text-red-500"
            bgClass="bg-red-50 dark:bg-red-900/10"
          />

          {/* Media & Advanced Tools */}
          <Badge
            label="FFmpeg WASM"
            icon={Film}
            colorClass="text-emerald-500"
            bgClass="bg-emerald-50 dark:bg-emerald-900/10"
          />
          <Badge
            label="Remotion"
            icon={Video}
            colorClass="text-indigo-500"
            bgClass="bg-indigo-50 dark:bg-indigo-900/10"
          />
          <Badge
            label="WaveSurfer.js"
            icon={Activity}
            colorClass="text-orange-500"
            bgClass="bg-orange-50 dark:bg-orange-900/10"
          />
          
          {/* Canvas & Interactions */}
          <Badge
            label="React Konva"
            icon={Palette}
            colorClass="text-teal-500"
            bgClass="bg-teal-50 dark:bg-teal-900/10"
          />
          <Badge
            label="React DnD"
            icon={Grip}
            colorClass="text-sky-500"
            bgClass="bg-sky-50 dark:bg-sky-900/10"
          />
          <Badge
            label="Lucide Icons"
            icon={PenTool}
            colorClass="text-rose-500"
            bgClass="bg-rose-50 dark:bg-rose-900/10"
          />
        </div>
      </div>

      {/* FOOTER */}
      <div className="pt-6 text-center space-y-2 border-t border-slate-100 dark:border-slate-800 mt-4">
        <p className="text-sm text-slate-500 flex items-center justify-center gap-1.5">
          Made with{" "}
          <Heart
            size={14}
            className="text-red-500 fill-red-500 animate-pulse"
          />{" "}
          by
          <a
            href="https://github.com/sachin"
            target="_blank"
            rel="noreferrer"
            className="font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 transition-colors"
          >
            {" "}
            Sachin Yadav
          </a>
        </p>
        <p className="text-[10px] text-slate-400">
          © {currentYear} SuperApp Inc. All rights reserved.
        </p>
      </div>
    </div>
  );
}