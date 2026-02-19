import React, { useState, useRef, useEffect } from 'react';
import { Music, Upload, Settings2, X, Loader2 } from 'lucide-react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js';
import { trimAudioBuffer, bufferToWav } from './utils/audioUtils';
import Seo from '@/components/seo/Seo';

// Components
import AudioControls from './components/AudioControls';
import EffectsRack from './components/EffectsRack';
import Waveform from './components/Waveform';
import Recorder from './components/Recorder';
import VideoImport from './components/VideoImport';
import Trimmer from './components/Trimmer';

export default function AudioStudio() {
  const [audioFile, setAudioFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [zoom, setZoom] = useState(0); 
  
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(1);
  const [region, setRegion] = useState(null); 
  const [showEffectsMobile, setShowEffectsMobile] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const wavesurfer = useRef(null);
  const wsRegions = useRef(null);

  // --- INITIALIZE WAVESURFER ---
  const initWaveSurfer = (waveContainer, timelineContainer) => {
    if (wavesurfer.current) {
        wavesurfer.current.destroy();
        setIsReady(false);
    }

    // Gradient Wave
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, '#a855f7'); 
    gradient.addColorStop(0.7, '#3b82f6'); 
    gradient.addColorStop(1, '#0f172a'); 

    wavesurfer.current = WaveSurfer.create({
      container: waveContainer,
      waveColor: gradient,
      progressColor: '#ffffff',
      cursorColor: '#ef4444',
      barWidth: 3,
      barGap: 2,
      barRadius: 3,
      responsive: true,
      height: 180,
      normalize: true,
      minPxPerSec: 0, 
      plugins: [
        RegionsPlugin.create(),
        TimelinePlugin.create({
            container: timelineContainer,
            formatTimeCallback: (sec) => {
                const m = Math.floor(sec / 60);
                const s = Math.floor(sec % 60);
                return `${m}:${s.toString().padStart(2, '0')}`;
            },
            primaryLabelInterval: 5,
            secondaryLabelInterval: 1,
            style: { fontSize: '10px', color: '#64748b' }
        })
      ],
    });

    wsRegions.current = wavesurfer.current.plugins[0];

    wavesurfer.current.on('ready', () => {
        setIsReady(true);
        const dur = wavesurfer.current.getDuration();
        setDuration(dur);
        wsRegions.current.clearRegions();
        
        // HANDLES CONFIGURATION
        const r = wsRegions.current.addRegion({
            start: dur * 0.2,
            end: dur * 0.8,
            color: 'rgba(255, 255, 255, 0.15)', 
            drag: true,
            resize: true,
            handleStyle: {
                left: {
                    width: '14px',
                    backgroundColor: '#ef4444', 
                    borderTopLeftRadius: '6px',
                    borderBottomLeftRadius: '6px',
                    opacity: '0.9',
                },
                right: {
                    width: '14px', 
                    backgroundColor: '#ef4444', 
                    borderTopRightRadius: '6px',
                    borderBottomRightRadius: '6px',
                    opacity: '0.9',
                }
            }
        });
        setRegion({ start: r.start, end: r.end });
    });

    wavesurfer.current.on('audioprocess', () => setCurrentTime(wavesurfer.current.getCurrentTime()));
    wavesurfer.current.on('finish', () => setIsPlaying(false));
    wsRegions.current.on('region-updated', (r) => setRegion({ start: r.start, end: r.end }));
  };

  useEffect(() => {
      if(wavesurfer.current && isReady) {
          try {
            wavesurfer.current.setPlaybackRate(speed);
            wavesurfer.current.setVolume(volume);
            if (zoom > 0) wavesurfer.current.zoom(zoom);
          } catch (e) {}
      }
  }, [speed, volume, zoom, isReady]);

  const loadAudioBlob = (blob, name) => {
      setAudioFile(blob);
      setFileName(name);
      setIsReady(false); 
      setShowEffectsMobile(false); 
      setTimeout(() => { if(wavesurfer.current) wavesurfer.current.load(URL.createObjectURL(blob)); }, 50);
  };
  const handleFileUpload = (e) => { const f = e.target.files[0]; if(f) loadAudioBlob(f, f.name); };
  const handleTrimUpdate = (newStart, newEnd) => {
      if (!wsRegions.current) return;
      const regs = wsRegions.current.getRegions();
      if (regs.length > 0) {
          regs[0].setOptions({ start: newStart, end: newEnd });
          if(isReady) wavesurfer.current.seekTo(newStart / duration);
      }
  };
  const handleExport = (isRingtone) => {
    if (!wavesurfer.current || !region || !isReady) return;
    const buf = wavesurfer.current.getDecodedData();
    if (buf) {
      const sliced = trimAudioBuffer(buf, region.start, region.end, isRingtone, isRingtone);
      const url = URL.createObjectURL(bufferToWav(sliced));
      const link = document.createElement('a');
      link.href = url;
      link.download = `${isRingtone ? 'ringtone' : 'clip'}-${Date.now()}.wav`;
      link.click();
    }
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-0 lg:gap-6 h-full lg:h-[calc(100vh-8rem)] w-full max-w-full bg-white dark:bg-slate-950 relative overflow-hidden">
        <Seo 
      title="Audio Studio - Recorder & Editor"
      description="Professional audio recording and editing tool. Trim, mix, and enhance audio files directly in your browser."
      keywords={["audio editor", "voice recorder", "sound mixer", "mp3 editor", "audio tools"]}
      url="/audio-studio"
      type="tool"
    />
      
      {/* SIDEBAR */}
      <div className={`
          fixed inset-0 z-50 bg-white dark:bg-slate-900 p-6 flex flex-col transition-transform duration-300 h-[100dvh] w-full
          lg:relative lg:inset-auto lg:h-full lg:col-span-3 lg:bg-white lg:dark:bg-slate-900 lg:rounded-2xl lg:border lg:border-slate-200 lg:dark:border-slate-800 lg:shadow-sm lg:translate-x-0
          ${showEffectsMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="mb-6 flex-none flex justify-between items-center">
           <div>
             <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Music className="text-purple-500" /> Audio Studio
             </h2>
             <p className="text-xs text-slate-500 mt-1">Advanced Editor</p>
           </div>
           <button onClick={() => setShowEffectsMobile(false)} className="lg:hidden p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
              <X size={20}/>
           </button>
        </div>
        <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pb-10 min-h-0">
            <div className="space-y-2">
                <label className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-purple-500/20 active:scale-95 font-bold text-sm">
                    <Upload size={18} /> Upload Audio
                    <input type="file" accept="audio/*" className="hidden" onChange={handleFileUpload} />
                </label>
                <VideoImport onImport={loadAudioBlob} />
                <Recorder onStop={(blob) => loadAudioBlob(blob, `rec-${Date.now()}.wav`)} />
            </div>
            <div className="border-t border-slate-100 dark:border-slate-800 my-4"></div>
            <div className={!audioFile ? "opacity-50 pointer-events-none filter grayscale" : ""}>
                <EffectsRack speed={speed} setSpeed={setSpeed} volume={volume} setVolume={setVolume} />
            </div>
        </div>
      </div>

      {/* MAIN WORKSPACE */}
      <div className="flex-1 lg:col-span-9 bg-slate-50 dark:bg-slate-950 lg:rounded-2xl lg:border border-slate-200 dark:border-slate-800 flex flex-col relative overflow-hidden h-full min-w-0">
        
        {/* Mobile Header */}
        <div className="lg:hidden flex-none sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4 flex justify-between items-center">
            <h2 className="font-bold text-slate-800 dark:text-white truncate max-w-[200px] text-sm">
                {fileName || 'Audio Studio'}
            </h2>
            <button onClick={() => setShowEffectsMobile(true)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300">
                <Settings2 size={20}/>
            </button>
        </div>

        {/* Audio Controls */}
        <div className="flex-none z-10 w-full">
            <AudioControls 
                isPlaying={isPlaying} 
                onPlayPause={() => { wavesurfer.current?.playPause(); setIsPlaying(!isPlaying); }}
                onZoom={setZoom}
                zoom={zoom}
                currentTime={currentTime}
                duration={duration}
                fileName={fileName}
                disabled={!isReady}
            />
        </div>

        {/* Waveform Area */}
        <div className="flex-1 flex flex-col justify-center p-4 lg:p-8 relative bg-slate-100/50 dark:bg-slate-950/50 min-h-[500px] lg:min-h-0 w-full max-w-full overflow-hidden transition-colors">
            
            {/* EMPTY STATE / LOADING STATE */}
            {!audioFile && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 z-20 animate-fade-in bg-slate-50/50 dark:bg-slate-950/50">
                    <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-200 dark:border-slate-800">
                        <Music size={40} className="text-purple-300" />
                    </div>
                    <p className="font-bold text-lg">Audio Studio</p>
                    <p className="text-xs mt-1 opacity-70">Upload or Record to start editing</p>
                </div>
            )}

            {/*  LOADING SPINNER OVERLAY */}
            {audioFile && !isReady && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm">
                    <Loader2 size={40} className="text-purple-600 animate-spin mb-4" />
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Processing Waveform...</p>
                </div>
            )}
            
            {/* THE WAVEFORM CONTAINER */}
            <div className={`w-full max-w-full relative ${!audioFile ? 'hidden' : 'block'}`}>
                <Waveform onMount={initWaveSurfer} />
            </div>
        </div>

        {/* Trimmer Controls */}
        {isReady && (
            <div className="flex-none z-30 sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] animate-slide-up w-full">
                <Trimmer 
                    region={region} 
                    duration={duration} 
                    onUpdate={handleTrimUpdate} 
                    onExport={handleExport}
                />
            </div>
        )}
      </div>
    </div>
  );
}