# Dashboard & Home 🏠

Welcome to your **Command Center**. The SuperApp Dashboard is the first thing you see when you log in, and it is meticulously designed to give you instant access to your most-used tools and real-time insights into your workspace. 

> **First Impression, Lasting Productivity:** We believe a dashboard shouldn't just be a menu; it should be an active assistant. From personalized greetings to live storage telemetry, everything you need to start your workflow is right here.

## 🧭 The Workspace Overview

The dashboard is divided into four highly optimized widget zones to eliminate friction and get you straight to work.

---

## 🛠️ Module Breakdown

### 1. The Dynamic Welcome Banner
A personalized touch to start your session right.
* **Time-Aware Greeting:** The dashboard knows if you are starting early or burning the midnight oil, dynamically updating the greeting (e.g., "Good Afternoon, Developer! 👋").
* **Quick Actions:** Don't want to browse menus? Hit **Start Creating** to jump into your last active tool, or click **My Files** to instantly open your Cloud Drive.

### 2. Quick Tools Matrix
Your essential utilities, one click away. Instead of hunting through the sidebar, the central grid provides massive, easy-to-click targets for our most powerful features:
* **Image Editor:** Edit, Crop, Filter & Convert Photos.
* **Video Editor:** Trim, Compress & Create GIFs.
* **PDF Tools:** Merge, Split & Convert Documents.
* **QR Command:** Generate & Scan Wi-Fi, Links.
* **Audio Studio:** Record, Cut & Create Ringtones.
* **Task & Notes:** Sticky Notes, To-Do, Timer.

### 3. Dual Storage Monitors (Telemetry)
Keep a close eye on your data limits with our real-time storage widgets.
* **Cloud Storage:** Tracks your Appwrite server usage. It visually displays your consumed space against your **10 GB Free Tier Plan**.
* **Device Storage (Local):** A highly technical widget that tracks exactly how much data your browser is caching (via IndexedDB and Cache API). It shows your app's footprint compared to your device's total available hard drive space.

### 4. Recent Files Hub
Pick up exactly where you left off. 
* As you generate PDFs, trim audio, or upload images, your most recent exports will appear here. 
* Click any recent file to instantly preview it or save it back to your device.

---

## 🔒 Under the Hood: Live Storage Telemetry

You might be wondering: *How does the dashboard know my device's total hard drive space without installing a native app?* We utilize the modern HTML5 `StorageManager` API. This allows the browser to securely estimate the local storage quota strictly allocated to SuperApp, ensuring you never accidentally run out of space while recording a 4K video or caching large files.

**How we track your local device storage (Internal Engine Snippet):**
```javascript
// Secure Local Storage Estimation Logic
export async function getDeviceStorageMetrics() {
    try {
        // 1. Check if the browser supports the Storage API
        if (navigator.storage && navigator.storage.estimate) {
            
            // 2. Fetch the exact byte count securely from the OS
            const estimate = await navigator.storage.estimate();
            
            // 3. Convert bytes to readable formats (MB/GB)
            const usedMB = (estimate.usage / (1024 * 1024)).toFixed(2);
            const totalGB = (estimate.quota / (1024 * 1024 * 1024)).toFixed(2);
            
            console.log(`Local Storage: ${usedMB} MB used out of ${totalGB} GB available.`);
            
            return {
                used: usedMB,
                total: totalGB,
                percentage: ((estimate.usage / estimate.quota) * 100).toFixed(1)
            };
        }
    } catch (error) {
        console.error("Storage API blocked by privacy settings:", error);
        return null;
    }
}

```

> 🔗 **Open Source Trust:** Want to see how we build these sleek UI widgets and telemetry hooks?
> **[View the Dashboard source code on our GitHub Repository ↗](https://github.com/SachinYedav/SuperApp/tree/main/src/features/dashboard)**

