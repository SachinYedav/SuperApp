import React, { useState, useRef } from 'react';
import { Mic, Square, ShieldAlert, Settings } from 'lucide-react';
import { useActionAlert } from '@/context/ActionAlertContext'; 

export default function Recorder({ onStop }) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const { showAlert } = useActionAlert();

  const triggerBrowserRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Setup Recorder
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        onStop(audioBlob);
        
        // Stop all tracks (Turn off mic light)
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.current.start();
      setIsRecording(true);

    } catch (err) {
      console.error("Mic Permission Error:", err);
      
      showAlert({
        type: 'error',
        title: 'Microphone Blocked',
        message: 'We cannot access your microphone. Please click the lock icon 🔒 in your address bar and enable "Microphone" permissions to continue.',
        actionLabel: 'Open Help Guide',
        secondaryLabel: 'Close',
        onAction: () => {
            window.open('https://support.google.com/chrome/answer/2693767?hl=hi-Latn', '_blank');
        }
      });
    }
  };

  // --- STEP 1: SOFT PROMPT ---
  const handleStartClick = () => {
    showAlert({
        type: 'permission',
        title: 'Microphone Access Required',
        message: 'To record audio directly in the studio, SuperApp needs access to your microphone. Your recordings are processed locally.',
        actionLabel: 'Yes, Enable Access',
        secondaryLabel: 'Not Now',
        onAction: triggerBrowserRecording 
    });
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <>
        {!isRecording ? (
            <button 
                onClick={handleStartClick} 
                className="w-full py-3.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
            >
                <Mic size={18} /> Record Audio
            </button>
        ) : (
            <button 
                onClick={stopRecording} 
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-500/30 animate-pulse active:scale-95"
            >
                <div className="relative">
                    <Square size={18} fill="currentColor" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping"></span>
                </div>
                Stop Recording...
            </button>
        )}
    </>
  );
}