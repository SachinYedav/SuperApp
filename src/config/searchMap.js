import { Calculator, FileText, Settings, Shield, User, Zap, Image, Video, HardDrive,
  LinkIcon, Lock, StickyNote, CheckSquare, Clock, Activity, Calendar,  ArrowRightLeft,
  CalendarClock, DollarSign, Cpu, FileJson, Type, Code, Key, Search, Palette, Layout, 
  Droplet, Eye, Image as ImageIcon, EyeOff, Gamepad2, Keyboard, Target, Brain, Hash,
  QrCode, Scan } from 'lucide-react';
  
export const STATIC_SEARCH_INDEX = [
  // ==========================================
  // 1. SETTINGS & PROFILE PAGES (Clean URLs)
  // ==========================================
  {
    id: "set_general",
    title: "General Settings",
    type: "Page",
    path: "/settings/general",
    icon: Zap,
    keywords: "theme, dark mode, display, appearance, general",
  },
  {
    id: "set_account",
    title: "My Account",
    type: "Page",
    path: "/settings/account",
    icon: User,
    keywords: "profile, name, email, avatar, bio, user",
  },
  {
    id: "set_security",
    title: "Security & Privacy",
    type: "Page",
    path: "/settings/security",
    icon: Lock,
    keywords: "password, 2fa, login, auth, secure, privacy",
  },
  {
    id: "set_integrations",
    title: "Integrations",
    type: "Page",
    path: "/settings/integrations",
    icon: LinkIcon,
    keywords: "api, connect, links, external, sync",
  },
  {
    id: "set_storage",
    title: "Cloud Storage",
    type: "Page",
    path: "/settings/storage",
    icon: HardDrive,
    keywords: "space, files, quota, usage, disk, capacity",
  },
  {
    id: "set_about",
    title: "About SuperApp",
    type: "Page",
    path: "/settings/about",
    icon: Shield,
    keywords: "version, info, app, details, legal",
  },

  // ==========================================
  // 2. MAIN TOOLS (Aapke Existing Tools)
  // ==========================================
  {
    id: "t1",
    title: "Image Editor",
    type: "Tool",
    path: "/image-editor",
    icon: Image,
    keywords: "crop, resize, filter, photo, picture",
  },
  {
    id: "t2",
    title: "Video Editor",
    type: "Tool",
    path: "/video-editor",
    icon: Video,
    keywords: "cut, trim, movie, clip, media",
  },
  {
    id: "t3",
    title: "PDF Tools",
    type: "Tool",
    path: "/pdf-tools",
    icon: FileText,
    keywords: "merge, split, compress, document, reader",
  },
  {
    id: "t4",
    title: "Math Hub",
    type: "Tool",
    path: "/math-tools",
    icon: Calculator,
    keywords: "calculate, math, algebra, numbers",
  },

  // ==========================================
  // 3. SUB-TOOLS & FEATURES
  // ==========================================
  // (Jab Math Hub ke clean URLs ban jayenge, to inko bhi update kar lenge)
  {
    id: "st1",
    title: "Unit Converter",
    type: "Feature",
    path: "/math-tools/converter",
    icon: Zap,
    keywords: "length, weight, currency, change",
  },
  {
    id: "st2",
    title: "Finance Calculator",
    type: "Feature",
    path: "/math-tools/finance",
    icon: Calculator,
    keywords: "emi, loan, interest, money, tax",
  },

  // ==========================================
  // 4. PRODUCTIVITY HUB & SUB-TOOLS
  // ==========================================
  {
    id: "prod_main",
    title: "Productivity Workspace",
    type: "Tool",
    path: "/productivity/notes",
    icon: Calendar,
    keywords: "organize, workflow, planner, dashboard",
  },
  {
    id: "prod_notes",
    title: "Sticky Notes",
    type: "Feature",
    path: "/productivity/notes",
    icon: StickyNote,
    keywords: "write, text, memo, quick, draft, note",
  },
  {
    id: "prod_tasks",
    title: "Task Board",
    type: "Feature",
    path: "/productivity/tasks",
    icon: CheckSquare,
    keywords: "todo, checklist, kanban, progress, list, task",
  },
  {
    id: "prod_focus",
    title: "Focus Timer",
    type: "Feature",
    path: "/productivity/focus",
    icon: Clock,
    keywords: "pomodoro, time, clock, study, work session, timer",
  },
  {
    id: "prod_habits",
    title: "Habit Tracker",
    type: "Feature",
    path: "/productivity/habits",
    icon: Activity,
    keywords: "routine, daily, track, goal, streak, habit",
  },

  // ==========================================
  // 5. MATH HUB & SUB-TOOLS (Updated Clean URLs)
  // ==========================================
  {
    id: "math_main",
    title: "Math Hub",
    type: "Tool",
    path: "/math-tools/calc",
    icon: Calculator,
    keywords: "calculate, math, algebra, numbers, equations",
  },
  {
    id: "math_calc",
    title: "Standard Calculator",
    type: "Feature",
    path: "/math-tools/calc",
    icon: Calculator,
    keywords: "add, subtract, multiply, divide, simple calc",
  },
  {
    id: "math_convert",
    title: "Unit Converter",
    type: "Feature",
    path: "/math-tools/convert",
    icon: ArrowRightLeft,
    keywords: "length, weight, temperature, currency, change unit",
  },
  {
    id: "math_finance",
    title: "Finance Calculator",
    type: "Feature",
    path: "/math-tools/finance",
    icon: DollarSign,
    keywords: "emi, loan, interest, money, tax, mortgage",
  },
  {
    id: "math_date",
    title: "Date Calculator",
    type: "Feature",
    path: "/math-tools/date",
    icon: CalendarClock,
    keywords: "days between, age, time difference, calendar",
  },
  {
    id: "math_prog",
    title: "Programmer Calculator",
    type: "Feature",
    path: "/math-tools/programmer",
    icon: Cpu,
    keywords: "hex, binary, ascii, bitwise, decimal, code",
  },
  {
    id: "math_graph",
    title: "Graph Plotter",
    type: "Feature",
    path: "/math-tools/graph",
    icon: Activity,
    keywords: "plot, chart, function, coordinates, visual",
  },

  // ==========================================
  // 6. DEV TOOLS & TEXT UTILITIES (Clean URLs)
  // ==========================================
  {
    id: "dev_main",
    title: "Developer Tools",
    type: "Tool",
    path: "/dev-tools/json",
    icon: Code,
    keywords: "developer, code, utility, format, devtools",
  },
  {
    id: "dev_json",
    title: "JSON Formatter",
    type: "Feature",
    path: "/dev-tools/json",
    icon: FileJson,
    keywords: "json, format, validate, beautify, stringify, parse",
  },
  {
    id: "dev_text",
    title: "Text Analyzer",
    type: "Feature",
    path: "/dev-tools/text",
    icon: Type,
    keywords: "text, word count, lowercase, uppercase, convert, characters",
  },
  {
    id: "dev_base64",
    title: "Base64 Encode/Decode",
    type: "Feature",
    path: "/dev-tools/base64",
    icon: Code,
    keywords: "base64, encode, decode, string, text, cypher",
  },
  {
    id: "dev_jwt",
    title: "JWT Decoder",
    type: "Feature",
    path: "/dev-tools/jwt",
    icon: Key,
    keywords: "jwt, token, auth, decode, payload, signature",
  },
  {
    id: "dev_regex",
    title: "Regex Tester",
    type: "Feature",
    path: "/dev-tools/regex",
    icon: Search,
    keywords: "regex, regular expression, test, pattern, match",
  },
  {
    id: "dev_pass",
    title: "Password Generator",
    type: "Feature",
    path: "/dev-tools/pass",
    icon: Shield,
    keywords: "password, generate, secure, strong, random, secret",
  },

  // ==========================================
  // 7. COLOR MASTER & DESIGN TOOLS
  // ==========================================
  {
    id: "color_main",
    title: "Color Master",
    type: "Tool",
    path: "/color-tools/palette",
    icon: Palette,
    keywords: "color, design, ui, palette, theme, colors",
  },
  {
    id: "color_palette",
    title: "Palette Generator",
    type: "Feature",
    path: "/color-tools/palette",
    icon: Layout,
    keywords: "palette, generate colors, scheme, hex, rgb, hsl, theme maker",
  },
  {
    id: "color_gradient",
    title: "Gradient Maker",
    type: "Feature",
    path: "/color-tools/gradient",
    icon: Droplet,
    keywords: "gradient, linear, radial, background, css color, blend",
  },
  {
    id: "color_contrast",
    title: "Contrast Checker",
    type: "Feature",
    path: "/color-tools/contrast",
    icon: Eye,
    keywords: "contrast, wcag, accessibility, text color, readable, ratio",
  },
  {
    id: "color_picker",
    title: "Image Color Picker",
    type: "Feature",
    path: "/color-tools/picker",
    icon: ImageIcon,
    keywords: "pick, extract color, image palette, eyedropper, photo color",
  },
  {
    id: "color_blind",
    title: "Color Blindness Simulator",
    type: "Feature",
    path: "/color-tools/blindness",
    icon: EyeOff,
    keywords:
      "blindness, simulate, daltonism, protanopia, deuteranopia, accessibility",
  },

  // ==========================================
  // 8. BRAIN ARCADE & GAMES
  // ==========================================
  {
    id: "arcade_main",
    title: "Brain Arcade",
    type: "Tool",
    path: "/arcade/typing",
    icon: Gamepad2,
    keywords: "games, play, fun, train, arcade, skill",
  },
  {
    id: "arcade_typing",
    title: "Speed Typer Test",
    type: "Feature",
    path: "/arcade/typing",
    icon: Keyboard,
    keywords: "typing, wpm, keyboard, speed test, words per minute",
  },
  {
    id: "arcade_reaction",
    title: "Reaction Time Test",
    type: "Feature",
    path: "/arcade/reaction",
    icon: Zap,
    keywords: "reaction, reflex, fast, click, speed, lightning",
  },
  {
    id: "arcade_aim",
    title: "Aim Trainer",
    type: "Feature",
    path: "/arcade/aim",
    icon: Target,
    keywords: "aim, mouse, precision, target, shooter, practice",
  },
  {
    id: "arcade_memory",
    title: "Memory Matrix",
    type: "Feature",
    path: "/arcade/memory",
    icon: Brain,
    keywords: "memory, visual, pattern, grid, remember, brain",
  },
  {
    id: "arcade_math",
    title: "Mental Math Game",
    type: "Feature",
    path: "/arcade/math",
    icon: Calculator,
    keywords: "math game, fast math, calculate, brain training, numbers",
  },
  {
    id: "arcade_number",
    title: "Number Memory",
    type: "Feature",
    path: "/arcade/number",
    icon: Hash,
    keywords:
      "number memory, digits, remember numbers, sequence, short term memory",
  },

  // ==========================================
  // 9. QR STUDIO
  // ==========================================
  {
    id: "qr_main",
    title: "QR Studio",
    type: "Tool",
    path: "/qr-tools/generate",
    icon: QrCode,
    keywords: "qr code, barcode, maker, scanner, link, wifi qr",
  },
  {
    id: "qr_gen",
    title: "QR Generator",
    type: "Feature",
    path: "/qr-tools/generate",
    icon: QrCode,
    keywords: "create qr, make qr code, generate barcode, qr maker",
  },
  {
    id: "qr_scan",
    title: "QR Scanner",
    type: "Feature",
    path: "/qr-tools/scan",
    icon: Scan,
    keywords: "scan qr, read qr code, qr reader, barcode scanner, camera",
  },

  // ==========================================
  // 10. CLOUD STORAGE (My Files)
  // ==========================================
  {
    id: "cloud_files",
    title: "My Files (Cloud Drive)",
    type: "Page",
    path: "/files",
    icon: HardDrive,
    keywords:
      "files, drive, cloud, storage, upload, download, documents, images, videos, audio",
  },
];
