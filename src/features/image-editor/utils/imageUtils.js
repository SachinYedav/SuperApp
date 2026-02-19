// Calculate distance between two fingers
export const getTouchDistance = (touches) => {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
};

// Generate CSS Filter String
export const generateFilterString = (filters) => {
  return `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%) blur(${filters.blur}px) grayscale(${filters.grayscale}%) sepia(${filters.sepia}%) hue-rotate(${filters.hueRotate}deg)`;
};

// Generate CSS Transform String
export const generateTransformString = (transform, position = { x: 0, y: 0 }, scale = 1, showOriginal = false) => {
  if (showOriginal) return 'none';
  // Include Pan/Zoom + Rotation/Flip
  return `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${transform.rotate}deg) scale(${transform.flipH}, ${transform.flipV})`;
};