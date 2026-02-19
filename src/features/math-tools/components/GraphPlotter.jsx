import React, { useState, useEffect, useRef } from 'react';
import { Activity } from 'lucide-react';

export default function GraphPlotter() {
  const [expr, setExpr] = useState('Math.sin(x)');
  const canvasRef = useRef(null);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // Clear & Background
    ctx.fillStyle = '#1e293b'; 
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= w; i += 40) { ctx.moveTo(i, 0); ctx.lineTo(i, h); }
    for (let i = 0; i <= h; i += 40) { ctx.moveTo(0, i); ctx.lineTo(w, i); }
    ctx.stroke();

    // Axis
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w/2, 0); ctx.lineTo(w/2, h); 
    ctx.moveTo(0, h/2); ctx.lineTo(w, h/2); 
    ctx.stroke();

    // Plot
    ctx.strokeStyle = '#f97316'; 
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    const scale = 40;
    
    for (let i = 0; i < w; i++) {
        const x = (i - w/2) / scale;
        try {
            // eslint-disable-next-line no-new-func
            const yVal = new Function('x', `return ${expr}`)(x);
            const canvasY = h/2 - (yVal * scale);
            if (i === 0) ctx.moveTo(i, canvasY);
            else ctx.lineTo(i, canvasY);
        } catch (e) { /* ignore */ }
    }
    ctx.stroke();
  };

  useEffect(() => { draw(); }, [expr]);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-6 border border-slate-200 dark:border-slate-800 animate-fade-in">
        <h3 className="text-lg font-bold mb-4 text-slate-700 dark:text-white flex items-center gap-2">
            <Activity className="text-orange-500"/> Simple Plotter
        </h3>

        <div className="mb-4">
            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Function y = f(x)</label>
            <div className="flex gap-2">
                <input 
                  type="text" value={expr} onChange={(e) => setExpr(e.target.value)}
                  placeholder="e.g. Math.sin(x) or x*x"
                  className="flex-1 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white font-mono text-sm"
                />
                <button onClick={draw} className="px-6 py-2 bg-orange-500 text-white rounded-xl font-bold text-sm">Plot</button>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">Use JS Math format: Math.sin(x), x*x, Math.pow(x,3)</p>
        </div>

        <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-inner">
            <canvas ref={canvasRef} width={600} height={400} className="w-full h-auto block"></canvas>
        </div>
    </div>
  );
}