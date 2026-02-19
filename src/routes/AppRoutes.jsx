import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// --- LAYOUTS ---
import AppLayout from '../components/layout/AppLayout';
// const DocsLayout = React.lazy(() => import('../components/layout/DocsLayout'));

// --- LAZY LOADING PAGES (App World) ---
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const Settings = React.lazy(() => import('../pages/Settings'));
const MyFiles = React.lazy(() => import('../pages/MyFiles'));
const Legal = React.lazy(() => import('../pages/Legal'));
const ColorTools = React.lazy(() => import('../pages/ColorToolsPage'));
const MathTools = React.lazy(() => import('../pages/MathToolsPage'));
const Productivity = React.lazy(() => import('../pages/ProductivityPage'));
const Arcade = React.lazy(() => import('../pages/SkillArcadePage'));
const ResetPassword = React.lazy(() => import('../pages/ResetPassword'));

// --- LAZY LOADING TOOLS ---
const ImageEditor = React.lazy(() => import('../features/image-editor/ImageEditor'));
const VideoEditor = React.lazy(() => import('../features/video-editor/VideoEditor'));
const PdfTools = React.lazy(() => import('../features/pdf-tools/PdfTools'));
const QrTools = React.lazy(() => import('../features/qr-tools/QrTools'));
const AudioStudio = React.lazy(() => import('../features/audio-studio/AudioStudio'));
const TextTools = React.lazy(() => import('../features/text-tools/TextTools'));
const ScreenRecorder = React.lazy(() => import('../features/screen-recorder/ScreenRecorder'));
const Whiteboard = React.lazy(() => import('../features/whiteboard/Whiteboard'));

// --- LAZY LOADING DOCS (Docs World) ---
// const DocViewer = React.lazy(() => import('../features/docs/DocViewer')); 
const NotFound = React.lazy(() => import('../pages/NotFound'));

// Loading Fallback Component
const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-900">
    <Loader2 className="animate-spin text-blue-500" size={40} />
  </div>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        
        {/* ==========================================
            WORLD 1: SUPERAPP (With Sidebar, Auth & Header)
            ========================================== */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          
          <Route path="files" element={<MyFiles />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/:tab" element={<Settings />} />
          <Route path="/legal/:docId" element={<Legal />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="image-editor" element={<ImageEditor />} />
          <Route path="video-editor" element={<VideoEditor />} />
          <Route path="pdf-tools" element={<PdfTools />} />
          <Route path="audio-studio" element={<AudioStudio />} />

          <Route path="/qr-tools" element={<QrTools />} />
          <Route path="/qr-tools/:tab" element={<QrTools />} />


          <Route path="/dev-tools" element={<TextTools />} />
          <Route path="/dev-tools/:tab" element={<TextTools />} />

          <Route path="/productivity" element={<Productivity />} />
          <Route path="/productivity/:tab" element={<Productivity />} />

          <Route path="screen-recorder" element={<ScreenRecorder />} /> 
          <Route path="digital-canvas" element={<Whiteboard />} />

          <Route path="/math-tools" element={<MathTools />} />
          <Route path="/math-tools/:tab" element={<MathTools />} />

          <Route path="/color-tools" element={<ColorTools />} />
          <Route path="/color-tools/:tab" element={<ColorTools />} />

          <Route path="/arcade" element={<Arcade />} />
          <Route path="/arcade/:tab" element={<Arcade />} />

        <Route path="*" element={<NotFound />} />

        </Route>

        {/* ==========================================
            WORLD 2: DOCUMENTATION (Clean, Static, No App Sidebar)
            ========================================== */}
        {/* ==========================================
        <Route path="/docs" element={<DocsLayout />}>
          <Route index element={<DocViewer defaultDoc="introduction" />} />
          <Route path=":docId" element={<DocViewer />} />
        </Route>
        ========================================== */}
      </Routes>
    </Suspense>
  );
}