import React, { useState } from 'react';
import { colorBlindFilters } from '../utils/colorUtils';

const MODES = [
    { id: 'normal', label: 'Normal Vision' },
    { id: 'protanopia', label: 'Protanopia (Red-Blind)' },
    { id: 'deuteranopia', label: 'Deuteranopia (Green-Blind)' },
    { id: 'tritanopia', label: 'Tritanopia (Blue-Blind)' },
    { id: 'achromatopsia', label: 'Achromatopsia (No Color)' },
];

export default function ColorBlindnessSim() {
    const [mode, setMode] = useState('normal');

    return (
        <div className="h-full flex flex-col gap-6 animate-fade-in">
            <svg className="hidden">
                <defs>
                    <filter id="colorBlindFilter">
                        <feColorMatrix type="matrix" values={colorBlindFilters[mode]} />
                    </filter>
                </defs>
            </svg>

            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {MODES.map((m) => (
                    <button
                        key={m.id}
                        onClick={() => setMode(m.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border
                        ${mode === m.id 
                            ? 'bg-slate-800 text-white border-slate-800 dark:bg-white dark:text-slate-900' 
                            : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800 hover:border-slate-300'}`}
                    >
                        {m.label}
                    </button>
                ))}
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm" style={{ filter: 'url(#colorBlindFilter)' }}>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">UI Elements Preview</h3>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="w-16 h-16 bg-red-500 rounded-xl flex items-center justify-center text-white font-bold">Red</div>
                            <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center text-white font-bold">Green</div>
                            <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center text-white font-bold">Blue</div>
                        </div>
                        <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold">Primary Action</button>
                        <div className="p-4 bg-yellow-100 text-yellow-800 rounded-xl border border-yellow-200">
                            <strong>Warning:</strong> This is a warning alert.
                        </div>
                        <div className="p-4 bg-red-100 text-red-800 rounded-xl border border-red-200">
                            <strong>Error:</strong> Something went wrong.
                        </div>
                    </div>
                </div>

                <div className="bg-slate-100 dark:bg-slate-900 rounded-3xl overflow-hidden relative">
                    <img 
                        src="/assets/images/sample.jpeg" 
                        alt="Colorful Sample" 
                        className="w-full h-full object-cover"
                        style={{ filter: 'url(#colorBlindFilter)' }}
                    />
                    <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-lg text-white text-xs font-bold">
                        Simulated: {MODES.find(m => m.id === mode).label}
                    </div>
                </div>
            </div>
        </div>
    );
}