import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

// 1. App Domain 
const DOMAIN = 'https://superapp-live.vercel.app'; 

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 2. Public Routes List 
const pages = [
  // --- Core Pages ---
  { url: '/', priority: 1.0, changefreq: 'daily' },
  { url: '/legal', priority: 0.5, changefreq: 'monthly' },

  // --- Main Tools ---
  { url: '/image-editor', priority: 0.9, changefreq: 'weekly' },
  { url: '/pdf-tools', priority: 0.9, changefreq: 'weekly' },
  { url: '/video-editor', priority: 0.9, changefreq: 'weekly' },
  { url: '/audio-studio', priority: 0.9, changefreq: 'weekly' },
  { url: '/screen-recorder', priority: 0.8, changefreq: 'weekly' },
  { url: '/digital-canvas', priority: 0.8, changefreq: 'weekly' },

  // --- Nested Tools  ---
  // Math Hub
  { url: '/math-tools/calculator', priority: 0.8, changefreq: 'weekly' },
  { url: '/math-tools/convert', priority: 0.8, changefreq: 'weekly' },
  { url: '/math-tools/finance', priority: 0.8, changefreq: 'weekly' },
  { url: '/math-tools/date', priority: 0.7, changefreq: 'weekly' },
  { url: '/math-tools/programmer', priority: 0.7, changefreq: 'weekly' },
  { url: '/math-tools/graph', priority: 0.7, changefreq: 'weekly' },

  // Dev Tools
  { url: '/dev-tools/json', priority: 0.8, changefreq: 'weekly' },
  { url: '/dev-tools/text', priority: 0.7, changefreq: 'weekly' },
  { url: '/dev-tools/base64', priority: 0.7, changefreq: 'weekly' },
  { url: '/dev-tools/jwt', priority: 0.8, changefreq: 'weekly' },
  { url: '/dev-tools/regex', priority: 0.7, changefreq: 'weekly' },
  { url: '/dev-tools/pass', priority: 0.7, changefreq: 'weekly' },

  // Color Tools
  { url: '/color-tools/palette', priority: 0.8, changefreq: 'weekly' },
  { url: '/color-tools/gradient', priority: 0.8, changefreq: 'weekly' },
  { url: '/color-tools/contrast', priority: 0.8, changefreq: 'weekly' },
  { url: '/color-tools/picker', priority: 0.8, changefreq: 'weekly' },
  { url: '/color-tools/blindness', priority: 0.7, changefreq: 'weekly' },

  // QR Tools
  { url: '/qr-tools/generator', priority: 0.8, changefreq: 'weekly' },
  { url: '/qr-tools/scanner', priority: 0.8, changefreq: 'weekly' },

  // Skill Arcade
  { url: '/skill-arcade/reaction', priority: 0.7, changefreq: 'weekly' },
  { url: '/skill-arcade/aim', priority: 0.8, changefreq: 'weekly' },
  { url: '/skill-arcade/typing', priority: 0.8, changefreq: 'weekly' },
  { url: '/skill-arcade/memory', priority: 0.7, changefreq: 'weekly' },
  { url: '/skill-arcade/math', priority: 0.7, changefreq: 'weekly' },
  { url: '/skill-arcade/number', priority: 0.7, changefreq: 'weekly' },
  { url: '/skill-arcade/leaderboard', priority: 0.6, changefreq: 'daily' },

  // Productivity
  { url: '/productivity/notes', priority: 0.8, changefreq: 'weekly' },
  { url: '/productivity/todo', priority: 0.8, changefreq: 'weekly' },
  { url: '/productivity/focus', priority: 0.8, changefreq: 'weekly' },
  { url: '/productivity/habits', priority: 0.7, changefreq: 'weekly' },
];

// 3. XML Generator Function
const generateSitemap = () => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map((page) => {
      return `
  <url>
    <loc>${DOMAIN}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    })
    .join('')}
</urlset>`;

  // 4. Write to public folder
  fs.writeFileSync(path.resolve(__dirname, '../public/sitemap.xml'), sitemap);
  console.log('✅ Sitemap Generated Successfully in /public/sitemap.xml');
};

generateSitemap();