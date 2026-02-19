import React, { useRef, useEffect } from 'react';

export default function WebcamOverlay({ stream }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
        videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Simple Drag Logic
  const handleDragEnd = (e) => {
      const container = containerRef.current;
      container.style.top = `${e.clientY}px`;
      container.style.left = `${e.clientX}px`;
  };

  return (
    <div 
      ref={containerRef}
      draggable="true"
      onDragEnd={handleDragEnd}
      className="absolute bottom-6 left-6 w-48 h-36 bg-black rounded-xl overflow-hidden shadow-2xl border-2 border-white/20 z-40 cursor-move transition-transform hover:scale-105 hover:border-blue-500"
    >
       <video 
         ref={videoRef}
         autoPlay 
         muted 
         className="w-full h-full object-cover transform scale-x-[-1]" // Mirror effect
       />
    </div>
  );
}