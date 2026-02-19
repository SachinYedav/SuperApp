import {
  Book, Zap, HardDrive, Settings, Video, Calculator, Code, Palette, Gamepad2,
  Mic, Image as ImageIcon, FileText, MonitorPlay, Edit3, CloudCog,
} from "lucide-react";

export const DOCS_SEARCH_INDEX = [
  // Getting Started
  {
    id: "introduction",
    title: "Introduction to SuperApp",
    group: "Getting Started",
    path: "/docs/introduction",
    icon: Book,
    keywords: "welcome, about, overview, start, intro",
  },
  {
    id: "quick-start",
    title: "Quick Start & Auth",
    group: "Getting Started",
    path: "/docs/quick-start",
    icon: Zap,
    keywords: "setup, login, register, authentication, appwrite",
  },

  // Core Features
  {
    id: "cloud-storage",
    title: "Cloud Storage (My Files)",
    group: "Core Features",
    path: "/docs/cloud-storage",
    icon: HardDrive,
    keywords: "files, upload, download, space, quota, drive",
  },
  {
    id: "settings",
    title: "Settings & Security",
    group: "Core Features",
    path: "/docs/settings",
    icon: Settings,
    keywords: "profile, password, theme, account, privacy",
  },

  // Pro Tools
  {
    id: "video-editor",
    title: "Pro Video Editor",
    group: "Pro Tools",
    path: "/docs/video-editor",
    icon: Video,
    keywords: "cut, trim, render, timeline, media",
  },
  {
    id: "math-hub",
    title: "Math Hub Toolkit",
    group: "Pro Tools",
    path: "/docs/math-hub",
    icon: Calculator,
    keywords: "calculator, converter, finance, emi, date",
  },
  {
    id: "dev-tools",
    title: "Developer Utilities",
    group: "Pro Tools",
    path: "/docs/dev-tools",
    icon: Code,
    keywords: "json, base64, jwt, regex, format, developers",
  },
  {
    id: "color-master",
    title: "Color Master",
    group: "Pro Tools",
    path: "/docs/color-master",
    icon: Palette,
    keywords: "palette, contrast, gradient, design, wcag",
  },

  // ==========================================
  // MEDIA & UTILITY TOOLS 
  // ==========================================
  {
    id: "audio-studio",
    title: "Audio Studio",
    group: "Media Tools",
    path: "/docs/audio-studio",
    icon: Mic,
    keywords: "audio, record, sound, mic, voice, mp3, wav, editor",
  },
  {
    id: "image-editor",
    title: "Image Editor",
    group: "Media Tools",
    path: "/docs/image-editor",
    icon: ImageIcon,
    keywords: "image, photo, crop, resize, filter, convert, png, jpg",
  },
  {
    id: "pdf-tools",
    title: "PDF Tools",
    group: "Utility Tools",
    path: "/docs/pdf-tools",
    icon: FileText,
    keywords: "pdf, merge, split, compress, document, extract",
  },
  {
    id: "screen-recorder",
    title: "Screen Recorder",
    group: "Utility Tools",
    path: "/docs/screen-recorder",
    icon: MonitorPlay,
    keywords: "screen, record, capture, video, display, tab, audio",
  },
  {
    id: "whiteboard",
    title: "Digital Canvas (Whiteboard)",
    group: "Design Tools",
    path: "/docs/whiteboard",
    icon: Edit3,
    keywords: "whiteboard, draw, sketch, canvas, pen, shapes, diagram",
  },
  {
    id: "arcade",
    title: "Brain Arcade",
    group: "Mini Games",
    path: "/docs/arcade",
    icon: Gamepad2,
    keywords: "games, play, fun, typing, aim, memory, math, speed, wpm",
  },
  {
    id: "backend-logic",
    title: "Backend Architecture",
    group: "Mini Games",
    path: "/docs/backend-architecture",
    icon: CloudCog,
    keywords: "Appwrite, Node.js, Serverless, Security, OTP",
  },

];
