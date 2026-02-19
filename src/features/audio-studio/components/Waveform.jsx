import React, { useEffect, useRef } from 'react';

export default function Waveform({ onMount }) {
    const containerRef = useRef(null);
    const timelineRef = useRef(null);

    useEffect(() => {
        if(containerRef.current && timelineRef.current) {
            onMount(containerRef.current, timelineRef.current);
        }
    }, []);

    return (
        <div className="w-full max-w-full flex flex-col gap-2 select-none">
            {/* Main Waveform */}
            <div 
                ref={containerRef} 
                className="w-full bg-slate-900 rounded-xl overflow-hidden shadow-inner border border-slate-800 relative z-10"
                style={{ height: '180px' }} 
            />
            
            {/* Timeline */}
            <div 
                ref={timelineRef}
                className="w-full h-6 opacity-70 pointer-events-none"
            />
        </div>
    );
}