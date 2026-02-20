import {
  Book, Zap, Home, HardDrive, Settings, Shield, CloudCog, 
  CheckSquare, Calculator, Code, Palette, Edit3, 
  Image as ImageIcon, Video, Mic, MonitorPlay, 
  FileText, QrCode, Gamepad2, Bot, Scale
} from "lucide-react";

export const DOCS_SEARCH_INDEX = [
  // ==========================================
  // GETTING STARTED
  // ==========================================
  {
    id: "introduction",
    title: "Introduction to SuperApp",
    group: "Getting Started",
    path: "/docs/introduction",
    icon: Book,
    keywords: "welcome, about, overview, start, intro, guide, features",
  },
  {
    id: "quick-start",
    title: "Quick Start & Auth",
    group: "Getting Started",
    path: "/docs/quick-start",
    icon: Zap,
    keywords: "setup, login, register, authentication, appwrite, pwa, install, 2fa",
  },
  {
    id: "dashboard",
    title: "Dashboard & Home",
    group: "Getting Started",
    path: "/docs/dashboard",
    icon: Home,
    keywords: "home, dashboard, quick tools, recent files, telemetry, welcome",
  },

  // ==========================================
  // CORE & ARCHITECTURE
  // ==========================================
  {
    id: "cloud-storage",
    title: "Cloud Drive (My Files)",
    group: "Core Infrastructure",
    path: "/docs/cloud-storage",
    icon: HardDrive,
    keywords: "files, upload, download, space, quota, drive, storage, backup",
  },
  {
    id: "settings",
    title: "Settings & Control Center",
    group: "Core Infrastructure",
    path: "/docs/settings",
    icon: Settings,
    keywords: "profile, theme, dark mode, cache, clear, integrations",
  },
  {
    id: "security-account",
    title: "Security & Account",
    group: "Core Infrastructure",
    path: "/docs/security-account",
    icon: Shield,
    keywords: "password, reset, otp, mfa, 2fa, delete account, wipe, sessions",
  },
  {
    id: "backend-architecture",
    title: "Backend Architecture",
    group: "Core Infrastructure",
    path: "/docs/backend-architecture",
    icon: CloudCog,
    keywords: "appwrite, node.js, serverless, security, queue worker, emails",
  },

  // ==========================================
  // PRODUCTIVITY & UTILITIES
  // ==========================================
  {
    id: "productivity",
    title: "Productivity Suite",
    group: "Productivity & Utilities",
    path: "/docs/productivity",
    icon: CheckSquare,
    keywords: "sticky notes, tasks, to-do, pomodoro, focus, timer, habits, streak",
  },
  {
    id: "dev-tools",
    title: "Developer Utilities",
    group: "Productivity & Utilities",
    path: "/docs/dev-tools",
    icon: Code,
    keywords: "json, formatter, base64, jwt, regex, password generator, developers",
  },
  {
    id: "math-hub",
    title: "Math Hub Toolkit",
    group: "Productivity & Utilities",
    path: "/docs/math-hub",
    icon: Calculator,
    keywords: "calculator, converter, finance, emi, date, scientific, programmer",
  },
  {
    id: "pdf-tools",
    title: "PDF Master",
    group: "Productivity & Utilities",
    path: "/docs/pdf-tools",
    icon: FileText,
    keywords: "pdf, merge, split, compress, document, extract, image to pdf",
  },
  {
    id: "qr-studio",
    title: "QR Studio",
    group: "Productivity & Utilities",
    path: "/docs/qr-studio",
    icon: QrCode,
    keywords: "qr, scan, code, generate, wifi, barcode, scanner, history",
  },

  // ==========================================
  // CREATIVE & MEDIA
  // ==========================================
  {
    id: "image-editor",
    title: "Image Editor",
    group: "Creative & Media",
    path: "/docs/image-editor",
    icon: ImageIcon,
    keywords: "image, photo, crop, resize, filter, convert, compress, png, jpg, webp",
  },
  {
    id: "color-master",
    title: "Color Master",
    group: "Creative & Media",
    path: "/docs/color-master",
    icon: Palette,
    keywords: "palette, contrast, gradient, design, wcag, color picker, simulator",
  },
  {
    id: "digital-canvas",
    title: "Digital Canvas",
    group: "Creative & Media",
    path: "/docs/whiteboard",
    icon: Edit3,
    keywords: "whiteboard, draw, sketch, canvas, pen, shapes, diagram, png",
  },
  {
    id: "audio-studio",
    title: "Audio Studio",
    group: "Creative & Media",
    path: "/docs/audio-studio",
    icon: Mic,
    keywords: "audio, record, sound, mic, voice, mp3, wav, editor, ringtone, trim",
  },
  {
    id: "video-editor",
    title: "Pro Video Editor",
    group: "Creative & Media",
    path: "/docs/video-editor",
    icon: Video,
    keywords: "cut, trim, render, timeline, media, mp4, coming soon",
  },
  {
    id: "screen-recorder",
    title: "Screen Recorder",
    group: "Creative & Media",
    path: "/docs/screen-recorder",
    icon: MonitorPlay,
    keywords: "screen, record, capture, video, display, tab, audio, 4k, 1080p, chunk",
  },

  // ==========================================
  // LABS & MISC
  // ==========================================
  {
    id: "ai-lab",
    title: "AI Lab",
    group: "Labs & Misc",
    path: "/docs/ai-lab",
    icon: Bot,
    keywords: "ai, artificial intelligence, gemini, chat, vision, api key, byok",
  },
  {
    id: "arcade",
    title: "Skill Arcade",
    group: "Labs & Misc",
    path: "/docs/arcade",
    icon: Gamepad2,
    keywords: "games, play, fun, typing, aim, memory, math, speed, wpm, reaction",
  },
  {
    id: "legal",
    title: "Legal & Privacy Center",
    group: "Labs & Misc",
    path: "/docs/legal",
    icon: Scale,
    keywords: "privacy, terms, legal, open source, policy, disclaimer",
  }
];