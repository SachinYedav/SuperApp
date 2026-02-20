# Screen Recorder 🎥

Welcome to the **Screen Recorder**—your lightweight, offline, and unlimited screen capturing studio. Say goodbye to recording limits, watermarks, or the fear of your private screen data being uploaded to a random cloud server. 

Whether you are recording a bug report, creating a software tutorial, or capturing a presentation, the SuperApp Screen Recorder handles it all entirely within your browser.

> **Desktop Exclusive:** For strict security reasons, mobile operating systems (iOS/Android) block browser-based screen capturing APIs. Therefore, this pro-tool is exclusively available on desktop environments (Windows, Mac, Linux).

## 🧭 Workspace Navigation

The Screen Recorder is designed with a sleek, two-panel layout to keep you focused:
* **Configuration Panel (Left):** Set up your recording preferences (Audio, Webcam, Quality) before you hit start.
* **Live Preview & Canvas (Right):** See exactly what your audience will see in real-time.

---

## 🛠️ The Recording Arsenal

### 1. Media Source Toggles
Customize exactly what you want to capture:
* **Audio:** Toggle this on to capture your microphone input alongside the system audio. Perfect for voiceovers.
* **Webcam (Picture-in-Picture):** Turn this on to overlay your webcam feed directly onto your screen recording. It adds a personal touch to tutorials and presentations.

### 2. High-Fidelity Quality Control
Why settle for pixelated recordings? Choose your exact output resolution:
* **720p:** Best for quick sharing and smaller file sizes.
* **1080p (FHD):** The standard for YouTube tutorials and professional presentations.
* **4K (UHD):** Crystal clear quality for high-end displays (Requires supported hardware).

### 3. Smart Playback Controls
You are in full control of the recording session:
* **Live Preview:** As soon as you hit **Start Rec**, the right panel turns into a live monitor. 
* **Pause / Resume:** Need to gather your thoughts or hide a sensitive password? Pause the recording and resume it seamlessly without creating a new file.
* **Stop & Download:** Once done, hit stop. Your compiled video file will instantly be available for local download as a high-quality WebM/MP4 file.

---

## 🔒 Under the Hood: Chunk-Based Offline Recording

Recording a 4K video for 30 minutes inside a web browser would normally consume all your RAM and crash the tab. To prevent this, SuperApp uses an advanced **Chunk-Based IndexedDB Architecture**.

Instead of holding the entire massive video in temporary memory, our engine uses the `MediaRecorder` API to slice the live video into tiny "chunks" (every few seconds). These lightweight chunks are instantly streamed into your local **IndexedDB** database. 

**How we record lag-free video (Internal Engine Snippet):**
```javascript
// Secure Chunk-Based Recording Logic
let mediaRecorder;
const CHUNK_INTERVAL = 2000; // 2 seconds

export async function startProRecording(stream, dbStore) {
    try {
        // 1. Initialize the recorder with optimal codecs
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });

        // 2. The Magic: Listen for data chunks every 2 seconds
        mediaRecorder.ondataavailable = async (event) => {
            if (event.data && event.data.size > 0) {
                // 3. Save chunk directly to IndexedDB (Bypassing RAM limits)
                await saveChunkToIndexedDB(dbStore, event.data);
                console.log("Chunk safely written to local hardware.");
            }
        };

        // 4. Start recording and slice data continuously
        mediaRecorder.start(CHUNK_INTERVAL);
        console.log("Recording started in lag-free chunk mode.");
        
    } catch (error) {
        console.error("Failed to start secure recording:", error);
    }
}

```

*Because we use this chunking method, you can record for hours without your PC slowing down. Your video is safely written to your hard drive in real-time!*

> 🔗 **Open Source Trust:** Want to see how we manage the MediaRecorder API and IndexedDB streams?
> **[View the Screen Recorder source code on our GitHub Repository ↗](https://github.com/SachinYedav/SuperApp/tree/main/src/features/screen-recorder)**

