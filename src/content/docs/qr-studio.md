# QR Studio 🔳

Welcome to **QR Studio**—the ultimate suite to generate, customize, and scan QR codes. Forget about third-party QR websites that track your links, inject ads, or force you to pay for high-quality SVG downloads. SuperApp’s QR Studio is completely free, 100% offline-capable, and respects your privacy.

> **Privacy First:** Whether you are generating a Wi-Fi QR code or scanning a private URL, zero data is sent to our servers. Every generation and scan happens strictly within your device's browser memory.

## 🧭 Workspace Navigation

The QR Studio is divided into two powerful modules. You can easily switch between them using the sidebar on Desktop or the navigation tabs on Mobile:
* **Generator:** Create and export custom QR codes.
* **Scanner:** Scan live codes via camera or extract them from saved images.

---

## 🛠️ Module 1: QR Generator

Create high-fidelity QR codes tailored to your specific needs.

### 1. Smart Data Types
Select the exact type of data you want to encode to ensure the scanner interprets it correctly:
* **URL / Text:** Standard links or text messages (up to 2000 characters).
* **Wi-Fi:** Instantly share your network credentials. Scanners will automatically prompt the user to join the network.
* **Email:** Pre-fill an email address, subject, and body.

### 2. Visual Customization
Make it yours. Adjust the **Foreground** and **Background** colors of your QR code to match your brand or presentation theme.

### 3. High-Quality Export
Unlike standard tools that give you pixelated images, SuperApp provides print-ready formats:
* **Download PNG:** Perfect for digital sharing and social media.
* **Download SVG:** A lossless vector format. Scale it to the size of a billboard, and it will remain perfectly crisp without losing any quality.

---

## 🔍 Module 2: The Pro Scanner

A high-performance scanning engine built right into your browser, packed with native-app features.

### 1. Live Camera Scanning
* Instantly decode QR codes using your device's camera.
* **Mobile-First Features:** We've integrated hardware controls directly into the UI. Use the **Camera Toggle** (top right) to switch between front and back lenses, and hit the **Flashlight Toggle** (top left) to scan in low-light environments.

### 2. Scan from Image
Received a QR code via WhatsApp or email? You don't need a second device to scan it. Simply click **Scan Image** to upload the picture directly from your gallery, and the engine will instantly read it.

### 3. Secure Local History
Every code you scan is safely logged into your **Scan History**. 
* Access your past scans to retrieve important links or text without re-scanning.
* All history is securely stored in your browser's local **IndexedDB** database. It is never synced to the cloud, ensuring total data sovereignty.

---

## 🔒 Under the Hood: Secure History Logging

To ensure that your scanned data (which could contain private tokens, Wi-Fi passwords, or personal emails) remains completely confidential, we bypass standard server databases. Instead, we use the asynchronous IndexedDB API to log your history locally on your device hardware.

**How we securely save your scans (Internal Engine Snippet):**
```javascript
// Secure Offline Storage using IndexedDB
export async function saveScanToHistory(scanResult) {
    try {
        // 1. Open the local browser database (No network request)
        const db = await openDB('SuperAppLocalDB', 1);
        const transaction = db.transaction('qr_history', 'readwrite');
        const store = transaction.objectStore('qr_history');

        // 2. Encrypt or store the payload directly on the device hardware
        await store.add({
            payload: scanResult,
            timestamp: Date.now(),
            type: determineQRType(scanResult) // e.g., 'URL', 'WIFI'
        });

        await transaction.done;
        console.log("Scan securely logged to local hardware.");
    } catch (error) {
        console.error("Failed to save local history:", error);
    }
}

```

> 🔗 **Open Source Trust:** Want to see the camera algorithms and generation logic?
> **[View the QR Studio source code on our GitHub Repository ↗](https://github.com/SachinYedav/SuperApp/tree/main/src/features/qr-tools)**

