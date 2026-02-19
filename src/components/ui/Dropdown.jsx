import React, { useState, useRef, useEffect } from "react";

export default function Dropdown({
  trigger,
  children,
  align = "right",
  direction = "down",
  width = "w-56",
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on Click Outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeDropdown = () => setIsOpen(false);
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // --- DYNAMIC CLASSES ---

  // 1. Vertical Position
  const verticalClasses =
    direction === "up"
      ? "bottom-full mb-2 origin-bottom"
      : "top-full mt-2 origin-top";

  // 2. Horizontal Alignment
  const alignmentClasses = {
    left: "left-0",
    right: "right-0",
    center: "left-1/2 -translate-x-1/2",
  }[align];

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* TRIGGER */}
      <div onClick={toggleDropdown}>
        {typeof trigger === "function" ? trigger(isOpen) : trigger}
      </div>

      {/* MENU */}
      {isOpen && (
        <div
          className={`
            absolute z-50 py-2 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 animate-fade-in-up 
            ${width} 
            ${verticalClasses} 
            ${alignmentClasses} 
            ${className}
          `}
        >
          {typeof children === "function" ? children(closeDropdown) : children}
        </div>
      )}
    </div>
  );
}
