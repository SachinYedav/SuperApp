import { useState, useRef } from 'react';
import { getTouchDistance } from '../utils/imageUtils';

export const useZoomPan = () => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const lastTouchDistance = useRef(null);
  const lastPosition = useRef(null);

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      lastTouchDistance.current = getTouchDistance(e.touches);
    } else if (e.touches.length === 1) {
      lastPosition.current = {
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      };
    }
  };

  const handleTouchMove = (e) => {
    // Pinch Zoom
    if (e.touches.length === 2) {
      const distance = getTouchDistance(e.touches);
      const delta = distance - lastTouchDistance.current;
      setScale((prev) => Math.min(4, Math.max(1, prev + delta * 0.005)));
      lastTouchDistance.current = distance;
    }
    // Pan
    if (e.touches.length === 1 && scale > 1 && lastPosition.current) {
      setPosition({
        x: e.touches[0].clientX - lastPosition.current.x,
        y: e.touches[0].clientY - lastPosition.current.y,
      });
    }
  };

  const handleTouchEnd = () => {
    lastTouchDistance.current = null;
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    setScale((prev) => Math.min(4, Math.max(1, prev + delta)));
  };

  return {
    scale, position, resetZoom,
    events: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onWheel: handleWheel
    }
  };
};