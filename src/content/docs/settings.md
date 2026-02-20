# Settings & Control Center ⚙️

Welcome to your **Control Center**. The Settings workspace is where you take absolute control over your SuperApp experience. From customizing your UI theme and managing active sessions to clearing local cache and preparing for third-party integrations, everything is organized into intuitive, dedicated tabs.

## 🧭 Workspace Navigation

Use the left sidebar menu to navigate through the six core configuration modules: **General, Account, Security, Integrations, Storage, and About.**

---

## 🛠️ Configuration Modules

### 1. General (Appearance & Preferences)
Tailor the app's look and behavior to your exact liking.
* **Appearance:**
  * **Light / Dark:** Manually force the UI into your preferred color scheme.
  * **System:** Let SuperApp automatically sync with your Operating System's active theme. If your OS switches to Dark Mode at sunset, the app will instantly follow suit.
* **App Preferences:**
  * **Push Notifications:** Receive alerts when heavy background tasks (like large video exports) finish processing.
  * **High Quality Export:** Force the app to always save images and media in their original, uncompressed resolution by default.
  * **Auto-Save Projects:** Automatically back up your Sticky Notes and Digital Canvas to the local database every 30 seconds.
  * **Sound Effects:** Toggle the satisfying audio cues for successful actions or error alerts.

### 2. Account (Profile & Sessions)
Manage your personal identity and monitor account access.
* **Profile Management:** Update your Full Name and Bio. Your verified Email Address is also displayed here securely.
* **Login History:** A crucial security feature. Track exactly which devices (e.g., Windows/Chrome) are logged into your account, along with their IP location and login date. You can actively monitor your current session status here.

### 3. Security (Access Control)
Your first line of defense.
* **Update Password:** Securely change your credentials.
* **Two-Factor Authentication (2FA):** Enable MFA to require a rotating 6-digit code from your authenticator app for every login.
* **Danger Zone (Account Wipe):** Permanently delete your account. This triggers our automated Cloud Functions to instantly wipe your profile, Cloud Storage, and arcade scores from our servers. 

### 4. Integrations (Coming Soon)
Connect SuperApp with your favorite external tools.
* **AI & Intelligence:** We are actively integrating **Google Gemini 2.0** for advanced chat and vision analysis, alongside OpenAI planned updates.
* **Cloud & Storage:** Future support to directly sync your documents and exports to Google Drive, Dropbox, and Notion.
* **Developer Tools:** Upcoming hooks for GitHub and Figma.

### 5. Storage (Optimization)
Take control of your device's memory.
* **Storage Overview:** A unified dashboard showing exactly how much of your Cloud Storage (e.g., 2GB tier) is used, alongside a tracker for your Local Storage (IndexedDB/Cache).
* **Maintenance (Clear Cache):** Running out of local browser space? Click **Clear App Cache** to instantly free up local memory and resolve any minor UI glitches without losing your cloud data.

### 6. About (Transparency & Tech Stack)
We believe in open-source transparency.
* Access quick links to our Official Website, Contact Support, and **Source Code**.
* Read our strictly enforced Privacy Policy and Terms of Service.
* **Powered By:** See the modern stack running under the hood (React 19, Appwrite, Tailwind CSS, and Vite).

---

## 🔒 Under the Hood: Smart System Theme Detection

How does SuperApp know when your OS switches to Dark Mode without reloading the page? Instead of constantly checking the time, we use a highly optimized, native browser API called `matchMedia`. It acts as an event listener that hooks directly into your operating system's UI preferences.

**How we auto-switch themes efficiently (Internal Engine Snippet):**
```javascript
// Native OS Theme Detection Logic
export function initializeSystemThemeWatcher() {
    // 1. Hook into the OS-level color scheme preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // 2. Define the exact UI update logic
    const applySystemTheme = (event) => {
        const isDark = event.matches;
        const htmlElement = document.documentElement;

        if (isDark) {
            htmlElement.classList.add('dark');
            console.log("OS switched to Dark Mode. Syncing UI...");
        } else {
            htmlElement.classList.remove('dark');
            console.log("OS switched to Light Mode. Syncing UI...");
        }
    };

    // 3. Listen for changes in real-time (Zero performance cost)
    mediaQuery.addEventListener('change', applySystemTheme);
    
    // 4. Run once on initial load
    applySystemTheme(mediaQuery);
}

```

> 🔗 **Open Source Trust:** Want to explore our state management and settings architecture?
> **[View the Settings Module source code on our GitHub Repository ↗](https://github.com/SachinYedav/SuperApp/tree/main/src/features/settings)**

