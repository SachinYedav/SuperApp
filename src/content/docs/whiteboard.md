# Digital Canvas 🎨

Welcome to the **Digital Canvas**—your limitless whiteboard. Whether you are sketching a quick wireframe, diagramming a database architecture, or just doodling during a meeting, the Digital Canvas provides a blazing-fast, infinite workspace. 

> **Zero Latency:** Because the canvas runs entirely on HTML5 native APIs within your browser, your pen strokes are rendered with zero network lag. Your drawings remain private and are never uploaded to our servers.

## 🧭 Workspace Navigation

We designed the canvas controls to float seamlessly over your workspace, maximizing your drawing area.
* **Desktop Users:** Your main drawing tools float neatly at the top center of the screen, while canvas controls (like backgrounds and exports) sit at the bottom right.
* **Mobile Users:** To save precious screen space, tap the **3-dots (⋮)** icon in the top right corner to reveal your drawing tools. The essential action buttons (Undo, Redo, Delete) remain easily accessible at the bottom.

---

## 🛠️ The Creator's Palette (Top Toolbar)

Everything you need to bring your ideas to visual life.

### 1. Drawing & Erasing
* **Freehand Pen:** The default tool. Draws smooth, responsive lines that follow your cursor or finger perfectly.
* **Eraser:** Switch to the eraser to precisely wipe away specific strokes without clearing the whole board.

### 2. Shapes & Geometry
Need to draw a flowchart or architecture diagram? 
* **Line:** Click and drag to draw perfectly straight lines.
* **Rectangle & Circle:** Instantly drag out perfect geometric shapes for UI wireframes or node diagrams.

### 3. Text Annotation
* **Text Tool (T):** Click anywhere on the canvas to drop a text box and type out notes or labels.

### 4. Color Selection
* **Quick Palette:** Choose from 8 highly contrasting, vibrant colors (Black, White, Red, Green, Blue, Purple, Orange, Gray) to color-code your diagrams efficiently.

---

## ⚙️ Canvas Controls (Bottom Toolbar)

Manage your workspace environment and export your final creations.

### 1. Canvas Backgrounds
Click the settings icon on the bottom toolbar to change your canvas texture:
* **Solid (Light/Dark):** A clean, blank slate.
* **Grid (Light/Dark):** Perfect for aligning shapes, drawing UI wireframes, or keeping your handwriting straight.
* **Dotted:** A subtle, bullet-journal style background for minimal guidance.

### 2. History Controls
* **Undo / Redo:** Made a mistake? Quickly step backward or forward through your recent brush strokes.

### 3. Export & Download
* **Save as PNG:** Once your masterpiece or diagram is complete, hit the **Download** icon. The canvas instantly compiles your visible drawing into a high-quality, transparent PNG file and saves it directly to your device.

### 4. Clear Board (Danger Zone)
* **Trash Icon:** Need a fresh start? Clicking the trash icon clears the entire board. 
* **Data Safety:** To prevent you from accidentally wiping out an hour of brainstorming, this action triggers our **Global Confirmation Modal**. You must explicitly check the confirmation box before the canvas is wiped.

---

## 🔒 Under the Hood: Native Canvas Export

How do we export your drawings so quickly without a backend image-processing server? We utilize the browser's native `canvas.toDataURL()` method. This instantly converts the raw pixel data currently sitting in your device's RAM into a downloadable image file.

**How we export your canvas locally (Internal Engine Snippet):**
```javascript
// Secure Local Canvas Export Logic
export function downloadCanvasAsPNG(canvasElement, fileName = 'SuperApp-Canvas.png') {
    try {
        // 1. Convert the canvas pixel data to a Base64 encoded PNG string
        const imageURI = canvasElement.toDataURL('image/png');

        // 2. Create a temporary, invisible anchor link in the DOM
        const downloadLink = document.createElement('a');
        downloadLink.href = imageURI;
        downloadLink.download = fileName;

        // 3. Programmatically trigger the download
        document.body.appendChild(downloadLink);
        downloadLink.click();
        
        // 4. Clean up the DOM
        document.body.removeChild(downloadLink);
        
        console.log("Canvas exported successfully to local storage.");
    } catch (error) {
        console.error("Failed to export canvas:", error);
    }
}

```

> 🔗 **Open Source Trust:** Want to see how we manage the canvas context and stroke history?
> **[View the Digital Canvas source code on our GitHub Repository ↗](https://github.com/SachinYedav/SuperApp/tree/main/src/features/whiteboard)**

