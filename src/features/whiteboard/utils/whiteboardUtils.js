// --- CONFIGURATION ---
export const COLORS = [
  '#000000', '#ffffff', '#ef4444', '#22c55e', '#3b82f6', '#a855f7', '#f97316', '#64748b'
];

export const BACKGROUNDS = [
  { id: 'white', label: 'White', color: '#ffffff', pattern: null, lineColor: null },
  { id: 'grid', label: 'Grid', color: '#ffffff', pattern: 'grid', lineColor: '#e2e8f0' },
  { id: 'dots', label: 'Dots', color: '#ffffff', pattern: 'dots', lineColor: '#cbd5e1' },
  { id: 'dark', label: 'Dark', color: '#0f172a', pattern: null, lineColor: null },
  { id: 'dark-grid', label: 'Dark Grid', color: '#0f172a', pattern: 'grid', lineColor: '#1e293b' },
];

// --- HELPER: Get Coordinates ---
export const getPointerPos = (e, canvas) => {
  const rect = canvas.getBoundingClientRect();
  if (e.touches && e.touches.length > 0) {
    return { 
      x: e.touches[0].clientX - rect.left, 
      y: e.touches[0].clientY - rect.top 
    };
  }
  return { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
};

// --- CORE: Render Engine ---
export const renderCanvas = ({ canvas, ctx, elements, background }) => {
  if (!canvas || !ctx) return;

  // 1. Clear & Background
  const width = canvas.width / (window.devicePixelRatio || 1);
  const height = canvas.height / (window.devicePixelRatio || 1);

  ctx.fillStyle = background.color;
  ctx.fillRect(0, 0, width, height);

  // 2. Draw Pattern
  if (background.pattern) {
    drawPattern(ctx, background.pattern, background.lineColor, width, height);
  }

  // 3. Draw Elements
  elements.forEach(el => {
    ctx.beginPath();
    ctx.lineWidth = el.width;
    
    // Eraser Logic
    if (el.type === 'eraser') {
       ctx.globalCompositeOperation = 'destination-out';
       ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else {
       ctx.globalCompositeOperation = 'source-over';
       ctx.strokeStyle = el.color;
       ctx.fillStyle = el.color;
    }

    if (el.type === 'pen' || el.type === 'eraser') {
      if(el.points.length > 0) {
          ctx.moveTo(el.points[0].x, el.points[0].y);
          // Quadratic Curve for smoothness
          for (let i = 1; i < el.points.length - 1; i++) {
              const p1 = el.points[i];
              const p2 = el.points[i + 1];
              const mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
              ctx.quadraticCurveTo(p1.x, p1.y, mid.x, mid.y);
          } 
          const last = el.points[el.points.length - 1];
          ctx.lineTo(last.x, last.y);
          ctx.stroke();
      }
    } 
    else if (el.type === 'line') {
      ctx.moveTo(el.x1, el.y1);
      ctx.lineTo(el.x2, el.y2);
      ctx.stroke();
    } 
    else if (el.type === 'rect') {
      ctx.strokeRect(el.x1, el.y1, el.x2 - el.x1, el.y2 - el.y1);
    } 
    else if (el.type === 'circle') {
      const r = Math.sqrt(Math.pow(el.x2 - el.x1, 2) + Math.pow(el.y2 - el.y1, 2));
      ctx.arc(el.x1, el.y1, r, 0, 2 * Math.PI);
      ctx.stroke();
    }
    else if (el.type === 'text') {
      ctx.font = `${el.width * 5 + 10}px sans-serif`;
      ctx.textBaseline = 'top';
      ctx.fillText(el.text, el.x1, el.y1);
    }
  });
  
  ctx.globalCompositeOperation = 'source-over'; // Reset
};

// --- HELPER: Draw Patterns ---
const drawPattern = (ctx, type, color, w, h) => {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1;
  const step = 40;

  if (type === 'grid') {
    ctx.beginPath();
    for (let x = 0; x <= w; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
    for (let y = 0; y <= h; y += step) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
    ctx.stroke();
  } else if (type === 'dots') {
      for (let x = 0; x <= w; x += step) {
          for (let y = 0; y <= h; y += step) {
              ctx.beginPath(); ctx.arc(x, y, 1.5, 0, Math.PI * 2); ctx.fill();
          }
      }
  }
};