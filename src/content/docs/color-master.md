# Color Master 🎨

Welcome to **Color Master**—the ultimate Designer's Toolkit. Whether you are building a new brand identity, designing a user interface, or ensuring your website meets global accessibility standards, Color Master provides a lightning-fast, offline-capable workspace to perfect your colors.

> **Pro Tip for Speed:** In the Palette Generator, simply press the **Spacebar** on your keyboard to instantly generate a new, harmonious color palette without ever reaching for your mouse!

## 🧭 Workspace Navigation

Just like our other Pro Tools, Color Master is designed for focus and speed.
* **Desktop Users:** Access the five core design modules from the sleek sidebar on the left.
* **Mobile Users:** Navigate between tools using the horizontally scrollable pill-tabs at the top of your screen. 

---

## 🛠️ The Designer's Toolkit

### 1. Palette Generator
Your infinite source of color inspiration.
* **Instant Generation:** Click the **Randomize** button or press the **Spacebar** to cycle through mathematically cohesive color palettes.
* **Quick Copy:** Click on any of the five vertical color bars to instantly copy its exact `#HEX` code to your clipboard. 

### 2. Gradient Maker
Create buttery-smooth, beautiful CSS gradients in seconds.
* Blend multiple stops, adjust the angle, and experiment with linear or radial transitions.
* **Developer Friendly:** Once your gradient is perfect, copy the raw CSS code directly into your project's stylesheet.

### 3. Contrast Checker (WCAG Compliance)
Design for everyone. This tool ensures your text is readable against your background.
* Enter your text color and background color to instantly view your **Contrast Ratio**.
* The tool automatically verifies your colors against global **WCAG 2.1 Guidelines**, showing you if you pass or fail the **AA** (Normal) and **AAA** (Strict) accessibility standards.

### 4. Image Picker
Extract the perfect color palette directly from your inspiration images.
* Upload any photograph or screenshot, and use the eyedropper to pick specific pixels.
* **100% Private:** Your images are never uploaded to a server. All image parsing happens locally on your device.

### 5. Vision Simulator
A high-end accessibility tool to test how your color choices appear to users with color vision deficiencies.
* Simulate your palettes through the lens of **Protanopia** (Red-blind), **Deuteranopia** (Green-blind), and **Tritanopia** (Blue-blind). Ensure your designs remain legible and beautiful for every user.

---

## 🔒 Under the Hood: Secure & Local Image Parsing

When you use the **Image Picker**, you might wonder where your uploaded inspiration images go. The answer is: **Nowhere.** To guarantee privacy and maximize speed, SuperApp utilizes the HTML5 Canvas API to extract color data right inside your browser's memory.

**How we extract colors locally (Internal Engine Snippet):**
```javascript
// Local Pixel Extraction logic
export function getPixelColor(imageElement, x, y) {
    // 1. Create a virtual, invisible canvas in the browser's memory
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', { willReadFrequently: true });
    
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    
    // 2. Draw the image locally (No network requests made)
    context.drawImage(imageElement, 0, 0);
    
    // 3. Extract the exact RGBA data of the clicked coordinates
    const pixelData = context.getImageData(x, y, 1, 1).data;
    
    // 4. Convert to HEX for the UI
    return rgbToHex(pixelData[0], pixelData[1], pixelData[2]);
}

```

*Because we use the local Canvas API, you can extract colors from a 10MB ultra-high-resolution RAW image instantly, without using a single byte of internet data.*

