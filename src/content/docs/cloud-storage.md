# Cloud Drive (My Files) ☁️

Welcome to your personal **Cloud Drive**—a highly secure, encrypted, and lightning-fast digital vault built directly into SuperApp. Whether you are storing exported videos from our editor, saving processed PDFs, or uploading personal documents, your files are always synced and accessible anywhere.

> **Storage Quota:** Every SuperApp user gets a **10 GB Free Tier Plan**. You can track your usage in real-time on the Cloud Drive panel or directly from your Main Dashboard.

## 🌟 Key Features

* **Smart Categorization:** Uploaded files are automatically sorted into **Images, Videos, Audio,** and **Docs** based on their MIME types. No more digging through cluttered folders.
* **Universal Search:** Instantly find any file across your entire drive using the highly optimized search bar.
* **Cross-Device Sync:** Upload a file on your laptop, and instantly access it on your mobile device. Mobile users get a highly optimized view with easily accessible top-navigation tabs.
* **Instant Previews:** Preview your images and play audio/video files directly within the drive without downloading them first.

## 🛠️ How to Use Your Cloud Drive

### Uploading Files
1. Navigate to the **My Files** section from the main menu.
2. Click the prominent **Upload New File** button.
3. Select one or multiple files from your device. 
4. A progress indicator will show the upload status. Once complete, your **Cloud Used** meter will automatically update.

### Managing Storage & Quotas
Keeping track of your storage is effortless:
* **Desktop:** The bottom-left corner displays your active Cloud Storage usage against the 10 GB limit, right next to your offline Local Storage metrics.
* **Mobile & Dashboard:** Your global dashboard also features a dedicated storage widget, so you always know how much space you have left before starting a heavy task.

---

## 🔒 Security & Developer Trust 

We know that trusting a platform with your personal files is a big deal. SuperApp does not use a shared directory. We utilize **Appwrite's Advanced Bucket Security** with strict Document/File-Level Security (DLS). 

**What does this mean for you?**
* **Absolute Privacy:** When you upload a file, it is cryptographically bound to your unique User ID. 
* **Zero Unauthorized Access:** Not even other authenticated users can query, view, or download your files. 
* **No Indexing:** Your files are hidden from search engines and unauthorized API calls.

### The Code Behind the Vault (For the Geeks 🤓)
If you are a developer wondering how we enforce this strict privacy, here is a glimpse of our internal upload logic. We strictly define `Permissions` at the moment of upload:

```javascript
import { Client, Storage, ID, Permission, Role } from "appwrite";

const client = new Client()
    .setEndpoint('[https://cloud.appwrite.io/v1](https://cloud.appwrite.io/v1)')
    .setProject('YOUR_PROJECT_ID');

const storage = new Storage(client);

// Uploading a file securely
async function uploadSecureFile(file, userId) {
    try {
        const response = await storage.createFile(
            'SUPERAPP_SECURE_BUCKET_ID', // Private Bucket
            ID.unique(),
            file,
            [
                // Strict Security: ONLY the uploader can read, update, or delete
                Permission.read(Role.user(userId)),
                Permission.update(Role.user(userId)),
                Permission.delete(Role.user(userId))
            ]
        );
        console.log("File secured and uploaded:", response.$id);
        return response;
    } catch (error) {
        console.error("Upload failed. Security constraints block unauthorized requests.", error);
    }
}

```

By explicitly setting the `Role.user(userId)`, the Appwrite backend instantly rejects any read/write request that doesn't carry your specific session token. Your data is literally locked to your identity.

## 💡 Pro Tip

To keep your Cloud Drive organized and save your 10 GB quota, remember to use our **Local Tools** (like PDF Master or Image Editor) for temporary edits, and only hit "Upload" for the final, polished files you actually want to keep forever!

