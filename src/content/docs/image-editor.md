# Image Editor 🖼️

Welcome to the **Image Editor**—your complete, browser-native photo manipulation suite. Whether you need to quickly crop a screenshot, apply a vintage color grade, or heavily compress a photograph to fit a strict 50KB upload limit for a web form, the Image Editor handles it instantly.

> **Privacy & Performance Guarantee:** Your photos are completely private. Unlike traditional online editors that upload your personal images to a remote server, SuperApp processes every pixel **100% locally** inside your device's memory using HTML5 Canvas technology. 

## 🧭 Workspace Navigation

The Image Editor features a professional, distraction-free workspace. 
* **The Canvas:** Drag and drop your image directly into the center screen to start. 
* **The Command Center:** The bottom tab bar controls your workflow. Move from left to right (**Adjust → Crop → Draw → Save**) to take your image from raw to final export.

---

## 🛠️ Module Breakdown

### 1. ADJUST (Tuning & Filters)
Enhance your images with real-time visual feedback.
* **Presets:** Short on time? Apply 1-click professional color grades: *Normal (Reset), Vintage, B&W (Black & White), and Warm*.
* **Fine Tune Sliders:** Take manual control over your pixels:
  * **Brightness:** Lighten or darken the overall image.
  * **Contrast:** Make highlights brighter and shadows darker for a punchy look.
  * **Saturate:** Boost or reduce the color intensity.
  * **Blur:** Apply a smooth Gaussian blur to hide sensitive information.
  * **Sepia:** Add a classic, retro brownish tone.

### 2. CROP (Geometry & Orientation)
Fix framing and rotation issues instantly.
* **Orientation Controls:** Click **Rotate** to turn the image 90 degrees clockwise. Use **Flip H** (Horizontal) to mirror the image left-to-right, or **Flip V** (Vertical) to flip it upside down.
* **Smart Cropping:** Drag the handles of the visual bounding box on the canvas to frame your subject perfectly. Once you are satisfied, hit the **Apply Crop** button to trim the excess pixels.

### 3. DRAW (Annotation)
Quickly markup your images. Select the Draw tab to access freehand pens and highlighters to circle important elements or write notes directly on the photo before exporting.

---

## 💾 SAVE: The Advanced Export Engine

This is where the magic happens. The Save tab gives you absolute control over your final file.

### Step 1: File Type Selection
Choose the right format for your needs: * **JPEG:** Best for standard photographs. It drops invisible data to keep file sizes small.
* **PNG:** Best for graphics, logos, and screenshots. It uses lossless compression and preserves image quality perfectly.
* **WEBP:** The modern web standard. Provides superior compression (smaller sizes than JPEG) while maintaining excellent quality.

### Step 2: Smart Compression Modes
* **By Quality %:** Use the slider to balance visual fidelity and file size (e.g., 80% usually reduces the file size massively with zero visible quality loss).
* **Target Size (KB):** *A SuperApp exclusive.* Need the image to be strictly under 50KB for a portal upload? Switch to this tab, enter your target size, and our algorithm will automatically calculate the perfect compression ratio to hit that exact mark.

### Step 3: Dimensions (Resizing)
Need a specific resolution? The **Width** and **Height** boxes display the current pixel dimensions. Type in new values to instantly scale your image up or down.

### Step 4: Download
Keep an eye on the **Estimated Size** indicator at the top. Once it looks good, hit **Download** to save the optimized file directly to your local drive.

---

## 🔒 Under the Hood: Smart Local Compression

How do we compress a 10MB photo down to 50KB without sending it to a cloud server? We leverage the browser's native `HTMLCanvasElement` and the powerful `toBlob` method. By drawing the image to a hidden virtual canvas, we can re-encode the binary data with a lower quality parameter on the fly.

**How we compress images locally (Internal Engine Snippet):**
```javascript
// Local HTML5 Canvas Image Compression
export async function compressImageLocally(imageElement, format = 'image/jpeg', quality = 0.8) {
    return new Promise((resolve) => {
        // 1. Create a virtual canvas in browser memory
        const canvas = document.createElement('canvas');
        canvas.width = imageElement.width;
        canvas.height = imageElement.height;
        
        const ctx = canvas.getContext('2d');
        
        // 2. Draw the original high-res image onto the canvas
        ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
        
        // 3. Export the canvas back to a file blob with new compression rules
        canvas.toBlob(
            (blob) => {
                console.log(`Successfully compressed to: ${(blob.size / 1024).toFixed(2)} KB`);
                resolve(blob);
            },
            format,   // e.g., 'image/webp' or 'image/jpeg'
            quality   // e.g., 0.8 for 80% quality
        );
    });
}

```

> 🔗 **Open Source Trust:** Check out the precise logic powering our compression and filters.
> **[View the Image Editor source code on our GitHub Repository ↗](https://github.com/SachinYedav/SuperApp/tree/main/src/features/image-editor)**

