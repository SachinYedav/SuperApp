// 1. HELPER: Load Image asynchronously
export const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

// 2. HELPER: Calculate bounding box after rotation
function rotateSize(width, height, rotation) {
  const rotRad = (rotation * Math.PI) / 180;
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

// 3. HELPER: Calculate File Size in KB from Base64
export const getBase64Size = (base64String) => {
  if (!base64String) return 0;
  // Remove header data usually present in base64 strings
  const stringLength = base64String.length - 'data:image/png;base64,'.length;
  // Base64 encoding ratio is approx 1.33x original size, padding chars '=' affect this slightly
  const sizeInBytes = 4 * Math.ceil((stringLength / 3)) * 0.5624896334383812;
  return sizeInBytes / 1000; // Return in KB
};

// 4. CORE FUNCTION: CROP IMAGE
export async function getCroppedImg(imageSrc, pixelCrop, flip = { h: 1, v: 1 }, rotation = 0) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  const rotRad = (rotation * Math.PI) / 180;
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(image.width, image.height, rotation);

  // Set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // Transform context to center, rotate, and flip
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.h, flip.v);
  ctx.translate(-image.width / 2, -image.height / 2);

  // Draw original image
  ctx.drawImage(image, 0, 0);

  // Get cropped pixel data
  const data = ctx.getImageData(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height);

  // Resize canvas to crop size and put data
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  ctx.putImageData(data, 0, 0);

  return canvas.toDataURL('image/png');
}

// 5. CORE FUNCTION: EXPORT & COMPRESS
export async function getCompressedImg(imageSrc, config) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const { 
    width, height, quality = 90, format = 'image/jpeg', 
    filters = '', rotate = 0, flip = { h: 1, v: 1 },
    drawings = [], targetSizeKB = null 
  } = config;

  // 1. Determine Output Dimensions
  const targetWidth = width || image.width;
  const targetHeight = height || image.height;

  // 2. Calculate Canvas Size considering Rotation
  const rotRad = (rotate * Math.PI) / 180;
  const canvasW = Math.abs(Math.cos(rotRad) * targetWidth) + Math.abs(Math.sin(rotRad) * targetHeight);
  const canvasH = Math.abs(Math.sin(rotRad) * targetWidth) + Math.abs(Math.cos(rotRad) * targetHeight);
  
  canvas.width = canvasW;
  canvas.height = canvasH;

  // 3. Apply Filters & Transformation
  if (filters) ctx.filter = filters;
  
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.h, flip.v);
  
  // Draw main image centered
  ctx.drawImage(image, -targetWidth / 2, -targetHeight / 2, targetWidth, targetHeight);

  // 4. Apply Drawing Layer (Overlay)
  if (drawings.length > 0) {
      // Reset filter so drawings aren't affected by blur/sepia
      ctx.filter = 'none'; 
      
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      // Scale stroke width relative to image size for consistency
      ctx.lineWidth = 5 * (targetWidth / 800); 
      ctx.strokeStyle = 'red'; // Default draw color

      // Offset coordinates because origin is currently at center due to rotation logic
      const offsetX = -targetWidth / 2;
      const offsetY = -targetHeight / 2;

      drawings.forEach(path => {
          ctx.beginPath();
          path.forEach((p, i) => {
              // Points need to be mapped if image was resized
              // (Assuming points are relative to the displayed canvas size, logic handles scaling in DrawingPanel)
              if (i === 0) ctx.moveTo(p.x + offsetX, p.y + offsetY);
              else ctx.lineTo(p.x + offsetX, p.y + offsetY);
          });
          ctx.stroke();
      });
  }

  // 6. COMPRESSION LOGIC (Binary Search for Target Size)
  
  // If target size is requested and format supports compression (JPEG/WEBP)
  if (targetSizeKB && format !== 'image/png') {
      let min = 0;
      let max = 1;
      let bestQuality = 0.5; // Start at 50%

      // Binary search for the best quality that fits the target size
      // 6 iterations give a precision of ~1.5% (1/64), which is efficient enough
      for (let i = 0; i < 6; i++) {
          const mid = (min + max) / 2;
          const dataUrl = canvas.toDataURL(format, mid);
          const size = getBase64Size(dataUrl);

          if (size <= targetSizeKB) {
              bestQuality = mid; // This quality works, try higher
              min = mid; 
          } else {
              max = mid; // Too big, try lower quality
          }
      }
      return canvas.toDataURL(format, bestQuality);
  }

  // Standard Export (Fixed Quality)
  return canvas.toDataURL(format, quality / 100);
}