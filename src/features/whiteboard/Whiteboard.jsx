import React, { useState, useEffect, useLayoutEffect } from "react";
import { useWhiteboard } from "./hooks/useWhiteboard";
import {
  renderCanvas,
  getPointerPos,
  BACKGROUNDS,
} from "./utils/whiteboardUtils";
import CanvasToolbar from "./components/CanvasToolbar";
import CanvasControls from "./components/CanvasControls";
import { Check, X } from "lucide-react";
import Seo from '@/components/seo/Seo';

export default function Whiteboard() {
  const {
    canvasRef,
    ctxRef,
    elements,
    setElements,
    tool,
    setTool,
    color,
    setColor,
    lineWidth,
    startDrawing,
    draw,
    stopDrawing,
    undo,
    redo,
    clearCanvas,
    historyStep,
    history,
  } = useWhiteboard();

  const [background, setBackground] = useState(BACKGROUNDS[1]);
  const [showMenu, setShowMenu] = useState(false);
  const [textInput, setTextInput] = useState({
    x: 0,
    y: 0,
    text: "",
    visible: false,
  });

  // --- RESIZE & DRAWING LOGIC ---
  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;

    const parent = canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = parent.clientWidth * dpr;
    canvas.height = parent.clientHeight * dpr;

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctxRef.current = ctx;

    renderCanvas({ canvas, ctx, elements, background });
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [background]);

  useLayoutEffect(() => {
    if (canvasRef.current && ctxRef.current) {
      renderCanvas({
        canvas: canvasRef.current,
        ctx: ctxRef.current,
        elements,
        background,
      });
    }
  }, [elements, background]);

  // --- SAFE TEXT HANDLER (Prevents Overflow) ---
  const handleCanvasClick = (e) => {
    if (tool === "text") {
      const pointer = getPointerPos(e, canvasRef.current);
      const parent = canvasRef.current.parentElement;

      // Layout Safety Constants
      const INPUT_WIDTH = 200;
      const INPUT_HEIGHT = 50;
      const PADDING = 20;

      // Calculate safe positions (Clamp)
      let safeX = pointer.x;
      let safeY = pointer.y;

      if (safeX + INPUT_WIDTH > parent.clientWidth) {
        safeX = parent.clientWidth - INPUT_WIDTH - PADDING;
      }
      if (safeY + INPUT_HEIGHT > parent.clientHeight) {
        safeY = parent.clientHeight - INPUT_HEIGHT - PADDING;
      }

      // Ensure it doesn't go negative (top/left)
      safeX = Math.max(PADDING, safeX);
      safeY = Math.max(PADDING, safeY);

      setTextInput({ x: safeX, y: safeY, text: "", visible: true });
    }
  };

  const confirmText = () => {
    if (textInput.text.trim()) {
      setElements((prev) => [
        ...prev,
        {
          type: "text",
          x1: textInput.x,
          y1: textInput.y,
          text: textInput.text,
          color,
          width: lineWidth,
        },
      ]);
    }
    setTextInput({ ...textInput, visible: false });
  };

  return (
    // Relative container with full height
    <div className="relative w-full h-[calc(100vh-4rem)] bg-slate-100 dark:bg-slate-950 overflow-hidden touch-none select-none flex flex-col rounded-2xl">
      <Seo 
      title="Digital Canvas - Infinite Whiteboard"
      description="Free online whiteboard for brainstorming, sketching, and drawing. Export your ideas as images instantly."
      keywords={["whiteboard", "digital canvas", "drawing tool", "sketching", "online collaboration", "pwa"]}
      url="/digital-canvas"
      type="tool" 
    />
      <CanvasToolbar
        tool={tool}
        setTool={setTool}
        color={color}
        setColor={setColor}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
      />

      {/* Main Canvas Area */}
      <div className="flex-1 relative w-full h-full overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          onClick={handleCanvasClick}
          className="block w-full h-full cursor-crosshair touch-none outline-none"
          style={{ width: "100%", height: "100%" }}
        />

        {/* Text Input Overlay */}
        {textInput.visible && (
          <div
            className="absolute z-40 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-2xl border border-blue-500 flex gap-2 animate-scale-in"
            style={{
              left: textInput.x,
              top: textInput.y,
              maxWidth: "90vw", // Mobile safety
            }}
          >
            <input
              autoFocus
              value={textInput.text}
              onChange={(e) =>
                setTextInput({ ...textInput, text: e.target.value })
              }
              onKeyDown={(e) => e.key === "Enter" && confirmText()}
              placeholder="Type text..."
              className="bg-transparent outline-none text-slate-800 dark:text-white min-w-[100px] text-sm"
            />
            <button
              onClick={confirmText}
              className="text-green-500 hover:bg-green-50 rounded p-1 flex-shrink-0"
            >
              <Check size={16} />
            </button>
            <button
              onClick={() => setTextInput({ ...textInput, visible: false })}
              className="text-red-500 hover:bg-red-50 rounded p-1 flex-shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      <CanvasControls
        undo={undo}
        redo={redo}
        clearCanvas={clearCanvas}
        historyStep={historyStep}
        historyLen={history.length}
        background={background}
        setBackground={setBackground}
        backgrounds={BACKGROUNDS}
        canvasRef={canvasRef}
      />
    </div>
  );
}
