import React, { useState } from 'react';
import { Video, Loader2 } from 'lucide-react';
import { extractAudioFromVideo } from '../utils/audioUtils';

export default function VideoImport({ onImport }) {
  const [processing, setProcessing] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProcessing(true);
    try {
        const audioBlob = await extractAudioFromVideo(file);
        onImport(audioBlob, file.name.replace(/\.[^/.]+$/, "") + ".wav");
    } catch (error) {
        console.error("Conversion failed", error);
        alert("Could not extract audio from video.");
    } finally {
        setProcessing(false);
    }
  };

  return (
    <label className={`w-full py-3 bg-pink-50 hover:bg-pink-100 dark:bg-pink-900/10 border border-pink-200 dark:border-pink-800 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all text-pink-700 dark:text-pink-300 font-bold text-sm active:scale-95 ${processing ? 'opacity-70 pointer-events-none' : ''}`}>
        {processing ? <Loader2 size={18} className="animate-spin"/> : <Video size={18} />}
        {processing ? 'Extracting...' : 'Import from Video'}
        <input type="file" accept="video/*" className="hidden" onChange={handleFile} />
    </label>
  );
}