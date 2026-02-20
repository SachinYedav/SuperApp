import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  assetsInclude: ['**/*.md'],
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'], 
      
      manifest: {
        name: 'SuperApp - All in One Tools',
        short_name: 'SuperApp',
        description: 'Advanced Offline Editor, PDF Tools & Utilities',
        theme_color: '#0f172a', 
        background_color: '#0f172a',
        display: 'standalone',
        start_url: '/',
        orientation: 'portrait',
        icons: [
          {
            src: '/assets/icons/pwa-192x192.png', 
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any' 
          },
          {
            src: '/assets/icons/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/assets/icons/maskable-icon.png',
            sizes: '512x512', 
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,mjs,woff2,mp3,wav,wasm,md}'],
        globIgnores: [
          '**/pwa-192x192.png',
          '**/pwa-512x512.png',
          '**/maskable-icon.png'
        ],
        maximumFileSizeToCacheInBytes: 30 * 1024 * 1024, 
        cleanupOutdatedCaches: true,
        navigateFallback: '/index.html',
        
        navigateFallbackDenylist: [
          /^\/sitemap\.xml$/,
          /^\/robots\.txt$/
        ],
        
        clientsClaim: true,
        skipWaiting: true,
      }
    })
  ],

  server: {
    allowedHosts: true,
    host: true,
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    emptyOutDir: true,
    sourcemap: false, 
    
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules') && id.includes('appwrite')) {
            return 'vendor-appwrite';
          }
        }
      }
    }
  }
})