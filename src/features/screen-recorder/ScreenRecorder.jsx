import React, { useState, useRef, useEffect } from 'react';
import { Monitor, Disc, Square, Mic, Camera, AlertTriangle } from 'lucide-react';
import { saveFile } from '../../services/db';
import { saveChunk, getChunks, clearSession } from './utils/recordingStore';

import WebcamOverlay from './components/WebcamOverlay';
import PreviewPlayer from './components/PreviewPlayer';

export default function ScreenRecorder() {

  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [resolution, setResolution] = useState('1080p');
  const [timer, setTimer] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const mediaRecorderRef = useRef(null);
  const timerInterval = useRef(null);
  const sessionRef = useRef(null);

  // -------- Detect Mobile --------
  useEffect(() => {
    const mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    setIsMobile(mobile);
  }, []);

  // -------- Restore Session --------
  useEffect(() => {
    const restore = async () => {
      const saved = localStorage.getItem("proRecordingSession");
      if (!saved) return;

      sessionRef.current = saved;
      const chunks = await getChunks(saved);

      if (chunks.length) {
        const blob = new Blob(chunks, { type: "video/webm" });
        setRecordedBlob(blob);
      }
    };
    restore();
  }, []);

  // -------- High Quality Constraints --------
  const getConstraints = () => ({
    video: {
      cursor: "always",
      width: resolution === '4k' ? 3840 :
             resolution === '1080p' ? 1920 : 1280,
      height: resolution === '4k' ? 2160 :
              resolution === '1080p' ? 1080 : 720,
      frameRate: { ideal: 30, max: 60 }
    },
    audio: audioEnabled
  });

  // -------- Safe MimeType --------
  const getMimeType = () => {
    const types = [
      "video/webm;codecs=vp9",
      "video/webm;codecs=vp8",
      "video/webm"
    ];
    return types.find(t => MediaRecorder.isTypeSupported(t)) || "";
  };

  // -------- Timer --------
  const startTimer = () => {
    setTimer(0);
    timerInterval.current = setInterval(() => {
      setTimer(t => t + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerInterval.current) clearInterval(timerInterval.current);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  };

  const stopAllTracks = (stream) => {
    if (!stream) return;
    stream.getTracks().forEach(track => track.stop());
  };

  // -------- Start Recording --------
  const startRecording = async () => {

    if (isMobile) return; // HARD BLOCK MOBILE

    try {

      const sessionId = Date.now().toString();
      sessionRef.current = sessionId;
      localStorage.setItem("proRecordingSession", sessionId);

      await clearSession(sessionId);

      const displayStream = await navigator.mediaDevices.getDisplayMedia(
        getConstraints()
      );

      setScreenStream(displayStream);

      const recorder = new MediaRecorder(displayStream, {
        mimeType: getMimeType()
      });

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = async (e) => {
        if (e.data && e.data.size > 0) {
          await saveChunk(sessionId, e.data);
        }
      };

      recorder.onstop = async () => {
        const chunks = await getChunks(sessionId);
        const blob = new Blob(chunks, { type: "video/webm" });
        setRecordedBlob(blob);
        stopAllTracks(displayStream);
        stopTimer();
      };

      recorder.start(2000); // memory-safe chunking

      setIsRecording(true);
      startTimer();

      displayStream.getVideoTracks()[0].onended = stopRecording;

    } catch (err) {
      console.error("Recording failed:", err);
      alert("Permission denied or unsupported.");
    }
  };

  // -------- Stop Recording --------
  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  // -------- Camera Toggle --------
  const toggleCamera = async () => {
    if (cameraEnabled) {
      stopAllTracks(cameraStream);
      setCameraStream(null);
      setCameraEnabled(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraStream(stream);
        setCameraEnabled(true);
      } catch {
        alert("Camera permission denied");
      }
    }
  };

  // -------- Export MP4 (Remux) --------
  const exportMP4 = async () => {
    if (!recordedBlob) return;

    // Basic browser-level mp4 support check
    const supportsMP4 = MediaRecorder.isTypeSupported("video/mp4");

    if (!supportsMP4) {
      alert("MP4 export not supported in this browser.");
      return;
    }

    const mp4Blob = new Blob([recordedBlob], { type: "video/mp4" });

    await saveFile(
      new File([mp4Blob], `rec-${Date.now()}.mp4`, {
        type: "video/mp4"
      })
    );

    alert("MP4 Exported!");
  };

  // -------- Save WebM --------
  const saveVideo = async () => {
    if (!recordedBlob) return;

    await saveFile(
      new File([recordedBlob], `rec-${Date.now()}.webm`, {
        type: "video/webm"
      })
    );

    await clearSession(sessionRef.current);
    localStorage.removeItem("proRecordingSession");

    alert("Saved!");
  };


  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full lg:h-[calc(100vh-8rem)]">
      
      {/* === LEFT: CONTROLS === */}
      <div className="lg:col-span-3 order-2 lg:order-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col shadow-lg p-6 h-fit lg:h-full">
         <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Monitor className="text-red-500" /> Recorder
            </h2>
            <p className="text-xs text-slate-500 mt-1">Capture & Share</p>
         </div>

         {/* Mobile Warning */}
         {isMobile && (
             <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 p-3 rounded-xl text-xs font-bold mb-4 flex items-start gap-2 border border-yellow-200 dark:border-yellow-800">
                 <AlertTriangle size={16} className="shrink-0"/>
                 <span>Mobile browsers may not support screen recording.</span>
             </div>
         )}

         {/* Settings Panel */}
         <div className="space-y-3 mb-8">
             {/* Audio Toggle */}
             <button onClick={() => setAudioEnabled(!audioEnabled)} className={`w-full p-3 rounded-xl flex items-center justify-between border transition-all ${audioEnabled ? 'bg-green-50 border-green-200 text-green-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                 <div className="flex items-center gap-2 text-sm font-bold"><Mic size={18}/> Audio</div>
                 <div className={`w-8 h-4 rounded-full relative transition-colors ${audioEnabled ? 'bg-green-500' : 'bg-slate-300'}`}>
                     <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${audioEnabled ? 'left-4.5' : 'left-0.5'}`}></div>
                 </div>
             </button>

             {/* Camera Toggle */}
             <button onClick={toggleCamera} disabled={isRecording} className={`w-full p-3 rounded-xl flex items-center justify-between border transition-all disabled:opacity-50 ${cameraEnabled ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                 <div className="flex items-center gap-2 text-sm font-bold"><Camera size={18}/> Webcam</div>
                 <div className={`w-8 h-4 rounded-full relative transition-colors ${cameraEnabled ? 'bg-blue-500' : 'bg-slate-300'}`}>
                     <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${cameraEnabled ? 'left-4.5' : 'left-0.5'}`}></div>
                 </div>
             </button>

             {/* Resolution */}
             <div className="pt-2">
                 <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Quality</label>
                 <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                     {['720p', '1080p', '4k'].map(res => (
                         <button key={res} onClick={() => setResolution(res)} disabled={isRecording} className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${resolution === res ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400'}`}>
                             {res}
                         </button>
                     ))}
                 </div>
             </div>
         </div>

         {/* Action Button */}
         <div className="mt-auto pb-safe">
             {!isRecording ? (
                                    <button
                    onClick={startRecording}
                    disabled={isMobile}
                    className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-red-500/30 transition-transform active:scale-95 disabled:opacity-50"
                    >
                     <Disc size={24}/> Start Rec
                 </button>
             ) : (
                 <div className="text-center space-y-4">
                     <div className="text-5xl font-mono font-bold text-red-500 animate-pulse">{formatTime(timer)}</div>
                     <button onClick={stopRecording} className="w-full py-4 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2">
                         <Square size={20} fill="currentColor"/> Stop
                     </button>
                 </div>
             )}
         </div>
      </div>

      {/* === RIGHT: PREVIEW === */}
      <div className="lg:col-span-9 order-1 lg:order-2 bg-black lg:rounded-3xl overflow-hidden flex items-center justify-center relative shadow-2xl border border-slate-800 min-h-[40vh] lg:min-h-auto">
          
          {/* Status Badge */}
          {isRecording && (
             <div className="absolute top-4 right-4 bg-red-600/90 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 animate-pulse z-30 shadow-lg border border-red-400/50">
                <div className="w-2.5 h-2.5 bg-white rounded-full"></div> REC
             </div>
          )}

          {/* Webcam Overlay */}
          {isRecording && cameraEnabled && cameraStream && (
              <WebcamOverlay stream={cameraStream} />
          )}

          {/* MAIN CONTENT */}
          {isRecording ? (
              <div className="text-center p-4">
                  <div className="w-20 h-20 bg-slate-900/50 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse border-4 border-slate-800">
                      <Monitor size={40} className="text-red-500"/>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">Recording Active</h3>
                  <p className="text-slate-400 text-sm">Minimize this window to record others.</p>
              </div>
          ) : recordedBlob ? (
              <PreviewPlayer blob={recordedBlob} onSave={saveVideo} onDiscard={() => setRecordedBlob(null)} />
          ) : (
              <div className="text-center text-slate-500 p-8">
                  <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Monitor size={40} className="text-slate-700"/>
                  </div>
                  <h3 className="text-lg font-bold text-slate-300 mb-1">Ready to Record</h3>
                  <p className="max-w-xs mx-auto text-xs opacity-60">Config on the left (or bottom) and click Start.</p>
              </div>
          )}
      </div>
    </div>
  );
}