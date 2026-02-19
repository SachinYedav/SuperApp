import { useState, useEffect, useRef } from 'react';
import { getPointerPos } from '../utils/whiteboardUtils';

const STORAGE_KEY = 'superapp_whiteboard_v1';

export const useWhiteboard = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  
  // State
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);
  
  // Settings
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);

  // --- AUTO-LOAD ---
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if(Array.isArray(parsed) && parsed.length > 0) {
            setElements(parsed);
            setHistory([parsed]);
            setHistoryStep(0);
        }
      } catch (e) {}
    }
  }, []);

  // --- AUTO-SAVE ---
  useEffect(() => {
    const handler = setTimeout(() => {
        if(elements.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(elements));
        }
    }, 1000); 

    const handleBeforeUnload = (e) => {
        if (elements.length > 0) {
            e.preventDefault();
            e.returnValue = '';
        }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
        clearTimeout(handler);
        window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [elements]);

  // --- DRAWING ACTIONS ---
  const startDrawing = (e) => {
    if (tool === 'text') return; 
    if (e.type === 'touchstart') document.body.style.overflow = 'hidden'; 

    const { x, y } = getPointerPos(e, canvasRef.current);
    setIsDrawing(true);

    const newEl = { type: tool, points: [{x, y}], x1: x, y1: y, x2: x, y2: y, color, width: lineWidth };
    setElements(prev => [...prev, newEl]);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { x, y } = getPointerPos(e, canvasRef.current);
    
    setElements(prev => {
      const newEls = [...prev];
      const current = newEls[newEls.length - 1];
      
      if (tool === 'pen' || tool === 'eraser') {
        current.points.push({x, y});
      } else {
        current.x2 = x;
        current.y2 = y;
      }
      return newEls;
    });
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveHistory();
      document.body.style.overflow = 'auto'; 
    }
  };

  const saveHistory = () => {
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push([...elements]);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const undo = () => {
    if (historyStep > 0) {
      setHistoryStep(prev => prev - 1);
      setElements(history[historyStep - 1]);
    } else {
      setElements([]); setHistoryStep(-1);
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      setHistoryStep(prev => prev + 1);
      setElements(history[historyStep + 1]);
    }
  };

  const clearCanvas = () => {
    setElements([]);
    setHistory([]);
    setHistoryStep(-1);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    canvasRef, ctxRef, elements, setElements,
    tool, setTool, color, setColor, lineWidth, setLineWidth,
    startDrawing, draw, stopDrawing,
    undo, redo, clearCanvas, historyStep, history
  };
};