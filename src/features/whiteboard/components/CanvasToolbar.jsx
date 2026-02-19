import React from "react";
import {
  PenTool,
  Eraser,
  Minus,
  Square,
  Circle as CircleIcon,
  Type,
  Palette,
  MoreVertical,
  X,
} from "lucide-react";
import { COLORS } from "../utils/whiteboardUtils";

const TOOLS = [
  { id: "pen", icon: PenTool },
  { id: "eraser", icon: Eraser },
  { id: "line", icon: Minus },
  { id: "rect", icon: Square },
  { id: "circle", icon: CircleIcon },
  { id: "text", icon: Type },
];

export default function CanvasToolbar({
  tool,
  setTool,
  color,
  setColor,
  showMenu,
  setShowMenu,
}) {
  return (
    <>
      {/* --- DESKTOP TOOLBAR --- */}
      <div
        className={`
        hidden lg:flex absolute top-4 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 rounded-full px-4 py-2 z-30 items-center gap-4
      `}
      >
        <div className="flex gap-1">
          {TOOLS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              className={`p-2 rounded-full transition-all ${tool === t.id ? "bg-blue-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
            >
              <t.icon size={18} />
            </button>
          ))}
        </div>
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>
        <div className="flex items-center gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-5 h-5 rounded-full border border-slate-200 shadow-sm transition-transform ${color === c ? "scale-125 ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-slate-900" : ""}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* --- MOBILE GRID MENU --- */}
      {showMenu && (
        <div className="lg:hidden absolute top-16 right-4 w-64 bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 rounded-2xl p-4 z-40 animate-scale-in origin-top-right">
          <p className="text-xs font-bold text-slate-400 uppercase mb-3">
            Tools
          </p>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {TOOLS.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTool(t.id);
                  setShowMenu(false);
                }}
                className={`p-3 rounded-xl flex items-center justify-center border ${tool === t.id ? "bg-blue-600 text-white border-blue-600" : "bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500"}`}
              >
                <t.icon size={20} />
              </button>
            ))}
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase mb-3">
            Colors
          </p>
          <div className="grid grid-cols-6 gap-3">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setColor(c);
                  setShowMenu(false);
                }}
                className={`w-6 h-6 rounded-full border shadow-sm ${color === c ? "ring-2 ring-offset-2 ring-blue-500" : ""}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      )}

      {/* --- MOBILE TOGGLE --- */}
      <button
        className="lg:hidden absolute top-4 right-4 z-40 p-3 bg-white dark:bg-slate-900 rounded-full shadow-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-white active:scale-95 transition-transform"
        onClick={() => setShowMenu(!showMenu)}
      >
        {showMenu ? <X size={20} /> : <MoreVertical size={20} />}
      </button>
    </>
  );
}
