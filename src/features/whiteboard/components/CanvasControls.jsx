import React, { useState } from "react";
import {
  Undo,
  Redo,
  Trash2,
  Download,
  Grid,
  Moon,
  Settings2,
} from "lucide-react";
import { Dropdown, ConfirmModal } from "@/components/ui/index";

export default function CanvasControls({
  undo,
  redo,
  clearCanvas,
  historyStep,
  historyLen,
  background,
  setBackground,
  backgrounds,
  canvasRef,
}) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.download = `whiteboard-${Date.now()}.png`;
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    tempCanvas.width = canvasRef.current.width;
    tempCanvas.height = canvasRef.current.height;

    tempCtx.fillStyle = background.color;
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.drawImage(canvasRef.current, 0, 0);

    link.href = tempCanvas.toDataURL();
    link.click();
  };

  return (
    <>
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={clearCanvas}
        title="Clear Entire Canvas?"
        message="This will permanently delete all your drawings. This action cannot be undone."
        type="danger"
        checkboxLabel="I understand, clear everything"
      />

      {/*  Controls Bar (Fixed Position) */}
      <div className="absolute bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30 pointer-events-none w-[95%] max-w-md justify-center">
        <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 flex items-center gap-1 pointer-events-auto">
          <button
            onClick={undo}
            disabled={historyStep <= -1}
            className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 disabled:opacity-30 transition-all active:scale-95"
          >
            <Undo size={20} />
          </button>
          <button
            onClick={redo}
            disabled={historyStep >= historyLen - 1}
            className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 disabled:opacity-30 transition-all active:scale-95"
          >
            <Redo size={20} />
          </button>

          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="p-2.5 hover:bg-red-50 hover:text-red-500 rounded-xl text-slate-600 dark:text-slate-300 transition-all active:scale-95"
          >
            <Trash2 size={20} />
          </button>
          <button
            onClick={handleDownload}
            className="p-2.5 hover:bg-blue-50 hover:text-blue-600 rounded-xl text-slate-600 dark:text-slate-300 transition-all active:scale-95"
          >
            <Download size={20} />
          </button>

          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>

          <Dropdown
            align="center"
            direction="up"
            width="w-64"
            trigger={(isOpen) => (
              <button
                className={`p-2.5 rounded-xl transition-all active:scale-95 flex items-center gap-2 ${isOpen ? "bg-blue-50 text-blue-600" : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"}`}
              >
                <Settings2 size={20} />
              </button>
            )}
          >
            {() => (
              <div className="p-3">
                <p className="text-xs font-bold text-slate-400 uppercase mb-3 px-1">
                  Canvas Background
                </p>
                <div className="grid grid-cols-5 gap-2">
                  {backgrounds.map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() => setBackground(bg)}
                      className={`aspect-square rounded-lg border flex items-center justify-center transition-all ${background.id === bg.id ? "ring-2 ring-blue-500 border-transparent" : "border-slate-200 dark:border-slate-700"}`}
                      style={{ backgroundColor: bg.color }}
                      title={bg.label}
                    >
                      {bg.pattern === "grid" && (
                        <Grid
                          size={14}
                          className={
                            bg.id.includes("dark")
                              ? "text-slate-600"
                              : "text-slate-300"
                          }
                        />
                      )}
                      {bg.pattern === "dots" && (
                        <div
                          className={`w-1 h-1 rounded-full ${bg.id.includes("dark") ? "bg-slate-500" : "bg-slate-300"}`}
                        ></div>
                      )}
                      {bg.id === "dark" && (
                        <Moon size={14} className="text-slate-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Dropdown>
        </div>
      </div>
    </>
  );
}
