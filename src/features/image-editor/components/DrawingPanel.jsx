import React, { useRef, useEffect, useState } from 'react';

export default function DrawingPanel({ width, height, drawings, setDrawings }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState([]);

  // Sync canvas size
  useEffect(() => {
      const canvas = canvasRef.current;
      if(canvas && width && height) {
          canvas.width = width;
          canvas.height = height;
          drawAll();
      }
  }, [width, height, drawings]);

  const drawAll = () => {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, width, height);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 5;
      ctx.strokeStyle = 'red'; // Default Red

      drawings.forEach(path => {
          ctx.beginPath();
          path.forEach((p, i) => {
              if(i === 0) ctx.moveTo(p.x, p.y);
              else ctx.lineTo(p.x, p.y);
          });
          ctx.stroke();
      });
  };

  const getPos = (e) => {
      const rect = canvasRef.current.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      // Map screen coords to internal canvas resolution
      return { 
          x: (clientX - rect.left) * (width / rect.width), 
          y: (clientY - rect.top) * (height / rect.height) 
      };
  };

  const startDraw = (e) => {
      setIsDrawing(true);
      const pos = getPos(e);
      setCurrentPath([pos]);
  };

  const moveDraw = (e) => {
      if(!isDrawing) return;
      e.preventDefault(); // Prevent scroll on touch
      const pos = getPos(e);
      const newPath = [...currentPath, pos];
      setCurrentPath(newPath);
      
      // Live Render
      const ctx = canvasRef.current.getContext('2d');
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
  };

  const endDraw = () => {
      if(isDrawing) {
          setIsDrawing(false);
          setDrawings([...drawings, currentPath]);
      }
  };

  return (
    <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-crosshair touch-none z-10"
        onMouseDown={startDraw} onMouseMove={moveDraw} onMouseUp={endDraw}
        onTouchStart={startDraw} onTouchMove={moveDraw} onTouchEnd={endDraw}
    />
  );
}