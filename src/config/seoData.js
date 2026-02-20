
// ==========================================
// 1. SETTINGS (Website Type)
// ==========================================
export const settingsSeo = {
    basePath: '/settings',
    defaultTab: 'general',
    tabs: {
        general: {
            title: "General Settings",
            description: "Customize your app appearance, theme, and language preferences.",
        },
        account: {
            title: "My Profile & Account",
            description: "Manage your personal details, connected devices, and login sessions.",
        },
        security: {
            title: "Security & 2FA",
            description: "Update password, enable Two-Factor Authentication (2FA), and secure your account.",
        },
        integrations: {
            title: "App Integrations",
            description: "Connect and manage third-party services and API keys.",
        },
        storage: {
            title: "Storage Management",
            description: "View cloud usage, clear local cache, and manage file storage.",
        },
        about: {
            title: "About SuperApp",
            description: "Version information, legal terms, and release notes.",
        }
    }
};

// ==========================================
// 2. QR TOOLS (Tool Type)
// ==========================================
export const qrToolsSeo = {
    basePath: '/qr-tools',
    defaultTab: 'generator',
    type: 'tool', 
    tabs: {
        generator: {
            title: "QR Code Generator",
            description: "Create custom QR codes for URLs, WiFi, and text instantly offline.",
            keywords: ["qr generator", "create qr code", "offline qr tool"]
        },
        scanner: {
            title: "QR Code Scanner",
            description: "Scan QR codes directly from your camera or upload an image.",
            keywords: ["qr scanner", "read qr code", "camera scanner"]
        }
    }
};

// ==========================================
// 3. DEV TOOLS (Tool Type)
// ==========================================
export const devToolsSeo = {
    basePath: '/dev-tools',
    defaultTab: 'json',
    type: 'tool', 
    tabs: {
        json: {
            title: "JSON Formatter & Validator",
            description: "Format, validate, and minify JSON data offline. Fix JSON errors instantly.",
            keywords: ["json formatter", "json validator", "json beautifier", "json minify", "offline json tool"]
        },
        text: {
            title: "Text Utils & Analyzer",
            description: "Convert case, count words, remove duplicates, and analyze text statistics offline.",
            keywords: ["text case converter", "word counter", "remove duplicate lines", "text analyzer"]
        },
        base64: {
            title: "Base64 Encoder/Decoder",
            description: "Convert text and files to Base64 strings securely in your browser.",
            keywords: ["base64 encoder", "base64 decoder", "text to base64", "image to base64"]
        },
        jwt: {
            title: "JWT Decoder & Debugger",
            description: "Decode JSON Web Tokens (JWT) to view header and payload claims securely.",
            keywords: ["jwt decoder", "jwt debugger", "decode token", "view jwt claims"]
        },
        regex: {
            title: "Regex Tester & Debugger",
            description: "Test and debug Regular Expressions against text patterns instantly.",
            keywords: ["regex tester", "regex debugger", "regular expression tool", "match patterns"]
        },
        pass: {
            title: "Secure Password Generator",
            description: "Generate strong, random, and secure passwords with custom length and characters.",
            keywords: ["password generator", "strong password", "random password creator", "secure generator"]
        }
    }
};


// ==========================================
// 4. COLOR TOOLS (Tool Type)
// ==========================================
export const colorToolsSeo = {
    basePath: '/color-tools',
    defaultTab: 'palette',
    type: 'tool',
    tabs: {
        palette: {
            title: "Color Palette Generator",
            description: "Generate beautiful color schemes, Material Design palettes, and export colors for your projects.",
            keywords: ["color palette", "scheme generator", "material design colors", "color harmony", "offline color tool"]
        },
        gradient: {
            title: "CSS Gradient Maker",
            description: "Create stunning linear and radial CSS gradients visually and copy the code instantly.",
            keywords: ["css gradient generator", "gradient maker", "linear gradient", "css background tool"]
        },
        contrast: {
            title: "WCAG Contrast Checker",
            description: "Check color contrast accessibility ratios (AA/AAA) between text and background.",
            keywords: ["contrast checker", "wcag accessibility", "color contrast ratio", "accessibility tool"]
        },
        picker: {
            title: "Image Color Picker",
            description: "Extract dominant colors and pick HEX/RGB codes directly from any image.",
            keywords: ["image color picker", "extract colors from image", "hex code finder", "color dropper"]
        },
        blindness: {
            title: "Color Blindness Simulator",
            description: "Simulate how your colors look to users with Protanopia, Deuteranopia, and other vision deficiencies.",
            keywords: ["color blindness simulator", "accessibility testing", "protanopia", "color vision deficiency"]
        }
    }
};

// ==========================================
// 5. SKILL ARCADE (Gamified Tools)
// ==========================================
export const skillArcadeSeo = {
    basePath: '/skill-arcade',
    defaultTab: 'reaction', 
    type: 'game',
    tabs: {
        reaction: {
            title: "Reaction Time Test",
            description: "Test your visual reflexes. Click as fast as you can when the color changes. Essential training for gamers.",
            keywords: ["reaction test", "reflex training", "human benchmark", "reaction speed", "gamer test"]
        },
        aim: {
            title: "3D Aim Trainer",
            description: "Improve your mouse accuracy and reaction speed for FPS games. Hit targets quickly in this browser-based aim trainer.",
            keywords: ["aim trainer", "mouse accuracy", "fps training", "aim practice", "reflex training", "esports tool"]
        },
        typing: {
            title: "Speed Typer (WPM Test)",
            description: "Check your typing speed (WPM) and accuracy with random words. Improve your keyboard skills offline.",
            keywords: ["typing test", "wpm checker", "typing speed", "keyboard practice", "touch typing"]
        },
        memory: {
            title: "Memory Matrix",
            description: "Recall grid patterns and improve your visual spatial memory. A classic brain training exercise.",
            keywords: ["memory matrix", "visual memory", "pattern recall", "brain game", "cognitive exercise"]
        },
        math: {
            title: "Mental Math",
            description: "Solve arithmetic problems against the clock. Sharpen your calculation skills under pressure.",
            keywords: ["mental math", "math drill", "arithmetic game", "brain workout", "fast math"]
        },
        number: {
            title: "Number Memory Test",
            description: "How many digits can you remember? Test your short-term memory capacity with increasing number sequences.",
            keywords: ["number memory", "digit span test", "short term memory", "recall test", "brain capacity"]
        },
        leaderboard: {
            title: "Global Leaderboard",
            description: "View top scores and rankings. Compete with other players in Reaction, Aim, and Memory challenges.",
            keywords: ["game leaderboard", "high scores", "global ranking", "top players", "game stats"]
        }
    }
};

// ==========================================
// 7. PRODUCTIVITY 
// ==========================================
export const productivitySeo = {
    basePath: '/productivity',
    defaultTab: 'notes',
    type: 'tool',
    tabs: {
        notes: {
            title: "Sticky Notes & Docs",
            description: "Capture ideas quickly with sticky notes and rich text documents. Auto-saves locally.",
            keywords: ["online notepad", "sticky notes", "offline notes", "rich text editor"]
        },
        tasks: {
            title: "Task Board (Kanban)",
            description: "Manage projects with a drag-and-drop Kanban board. Track progress and organize to-dos.",
            keywords: ["kanban board", "task manager", "todo list", "project management", "offline tasks"]
        },
        focus: {
            title: "Focus Timer (Pomodoro)",
            description: "Boost productivity with customizable work/break intervals. Stay focused and track time.",
            keywords: ["pomodoro timer", "focus clock", "study timer", "productivity timer"]
        },
        habits: {
            title: "Habit Tracker",
            description: "Build new habits and track your daily streaks. Visual consistency charts to keep you motivated.",
            keywords: ["habit tracker", "streak counter", "daily goals", "routine builder"]
        }
    }
};

// ==========================================
// 8. MATH TOOLS 
// ==========================================
export const mathToolsSeo = {
    basePath: '/math-tools',
    defaultTab: 'calculator',
    type: 'tool',
    tabs: {
        calculator: {
            title: "Scientific Calculator",
            description: "Advanced calculator with history, memory, and scientific functions.",
            keywords: ["scientific calculator", "math solver", "online calculator"]
        },
        convert: {
            title: "Unit Converter",
            description: "Convert between hundreds of units: Length, Weight, Temperature, Speed, and more.",
            keywords: ["unit converter", "metric conversion", "measurement converter"]
        },
        finance: {
            title: "Finance & Loan Calculator",
            description: "Calculate EMI, loan interest, and investment returns (SIP/Lumpsum).",
            keywords: ["emi calculator", "loan calculator", "finance tools", "investment calculator"]
        },
        date: {
            title: "Date & Time Calculator",
            description: "Calculate duration between dates, add/subtract days, and check age.",
            keywords: ["date calculator", "age calculator", "time difference", "days counter"]
        },
        programmer: {
            title: "Programmer Calculator",
            description: "Convert between Hex, Binary, Octal, and Decimal. Bitwise operations supported.",
            keywords: ["binary calculator", "hex converter", "programmer tools", "bitwise calculator"]
        },
        graph: {
            title: "Graph Plotter",
            description: "Plot mathematical functions and analyze graphs visually.",
            keywords: ["graphing calculator", "function plotter", "math graph", "algebra tool"]
        }
    }
};

// ==========================================
// 9. DOCUMENTATION (TechArticle Type)
// ==========================================
export const docsSeo = {
    basePath: '/docs',
    defaultTab: 'introduction',
    type: 'docs',
    tabs: {
        // --- GETTING STARTED ---
        "introduction": {
            title: "Introduction to SuperApp",
            description: "Learn about SuperApp's ecosystem, core features, and how it simplifies your daily digital workflow.",
            keywords: ["welcome", "about", "overview", "start", "intro", "guide", "features"]
        },
        "quick-start": {
            title: "Quick Start & Auth",
            description: "Setup your account, configure Appwrite integration, and enable PWA features for a seamless experience.",
            keywords: ["setup", "login", "register", "authentication", "appwrite", "pwa", "install", "2fa"]
        },
        "dashboard": {
            title: "Dashboard & Home",
            description: "Navigate the SuperApp dashboard, access quick tools, view recent files, and monitor telemetry.",
            keywords: ["home", "dashboard", "quick tools", "recent files", "telemetry", "welcome"]
        },

        // --- CORE & ARCHITECTURE ---
        "cloud-storage": {
            title: "Cloud Drive (My Files)",
            description: "Deep dive into secure file storage, quota management, uploads, downloads, and cloud backup systems.",
            keywords: ["files", "upload", "download", "space", "quota", "drive", "storage", "backup"]
        },
        "settings": {
            title: "Settings & Control Center",
            description: "Manage your profile preferences, UI themes, dark mode, local cache, and third-party integrations.",
            keywords: ["profile", "theme", "dark mode", "cache", "clear", "integrations"]
        },
        "security-account": {
            title: "Security & Account",
            description: "Secure your account with 2FA, manage active sessions, reset passwords, or wipe your data completely.",
            keywords: ["password", "reset", "otp", "mfa", "2fa", "delete account", "wipe", "sessions"]
        },
        "backend-architecture": {
            title: "Backend Architecture",
            description: "Understand the Appwrite backend, Node.js serverless functions, security roles, and queue workers.",
            keywords: ["appwrite", "node.js", "serverless", "security", "queue worker", "emails"]
        },

        // --- PRODUCTIVITY & UTILITIES ---
        "productivity": {
            title: "Productivity Suite",
            description: "Master sticky notes, Kanban task boards, Pomodoro focus timers, and daily habit tracking.",
            keywords: ["sticky notes", "tasks", "to-do", "pomodoro", "focus", "timer", "habits", "streak"]
        },
        "dev-tools": {
            title: "Developer Utilities",
            description: "Comprehensive documentation for JSON formatters, JWT decoders, Base64 tools, and Regex debuggers.",
            keywords: ["json", "formatter", "base64", "jwt", "regex", "password generator", "developers"]
        },
        "math-hub": {
            title: "Math Hub Toolkit",
            description: "Guides on using the scientific calculator, unit converter, financial EMI calculators, and graph plotter.",
            keywords: ["calculator", "converter", "finance", "emi", "date", "scientific", "programmer"]
        },
        "pdf-tools": {
            title: "PDF Master",
            description: "Learn how to merge, split, compress, extract text, and manage PDF documents entirely offline.",
            keywords: ["pdf", "merge", "split", "compress", "document", "extract", "image to pdf"]
        },
        "qr-studio": {
            title: "QR Studio",
            description: "Generate custom QR codes for URLs, WiFi, or text, and use the built-in scanner to read barcodes.",
            keywords: ["qr", "scan", "code", "generate", "wifi", "barcode", "scanner", "history"]
        },

        // --- CREATIVE & MEDIA ---
        "image-editor": {
            title: "Image Editor",
            description: "A complete guide to cropping, resizing, applying filters, and converting images (PNG, JPG, WebP).",
            keywords: ["image", "photo", "crop", "resize", "filter", "convert", "compress", "png", "jpg", "webp"]
        },
        "color-master": {
            title: "Color Master",
            description: "Generate color palettes, check WCAG contrast ratios, create CSS gradients, and simulate color blindness.",
            keywords: ["palette", "contrast", "gradient", "design", "wcag", "color picker", "simulator"]
        },
        "digital-canvas": {
            title: "Digital Canvas",
            description: "Use the interactive whiteboard for sketching, drawing shapes, and exporting high-quality PNG diagrams.",
            keywords: ["whiteboard", "draw", "sketch", "canvas", "pen", "shapes", "diagram", "png"]
        },
        "audio-studio": {
            title: "Audio Studio",
            description: "Record, trim, and edit audio files directly in your browser. Supports both MP3 and WAV formats.",
            keywords: ["audio", "record", "sound", "mic", "voice", "mp3", "wav", "editor", "ringtone", "trim"]
        },
        "video-editor": {
            title: "Pro Video Editor",
            description: "Learn timeline management, media trimming, and video rendering with our browser-based video editor.",
            keywords: ["cut", "trim", "render", "timeline", "media", "mp4", "coming soon"]
        },
        "screen-recorder": {
            title: "Screen Recorder",
            description: "Capture your screen, display, or browser tab with high-quality 1080p/4K audio and video recording.",
            keywords: ["screen", "record", "capture", "video", "display", "tab", "audio", "4k", "1080p", "chunk"]
        },

        // --- LABS & MISC ---
        "ai-lab": {
            title: "AI Lab",
            description: "Integrate Google Gemini AI, manage API keys securely (Bring Your Own Key), and explore intelligent chat features.",
            keywords: ["ai", "artificial intelligence", "gemini", "chat", "vision", "api key", "byok"]
        },
        "arcade": {
            title: "Skill Arcade",
            description: "Improve your reaction time, aim, typing speed (WPM), and memory with our collection of gamified tools.",
            keywords: ["games", "play", "fun", "typing", "aim", "memory", "math", "speed", "wpm", "reaction"]
        },
        "legal": {
            title: "Legal & Privacy Center",
            description: "Comprehensive information regarding our privacy policies, terms of service, and open-source license attributions.",
            keywords: ["privacy", "terms", "legal", "open source", "policy", "disclaimer"]
        }
    }
};