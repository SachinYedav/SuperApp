# Legal & Privacy Center ⚖️

Welcome to the **Legal Center**. Transparency and trust are our core values. We believe that you should not need a law degree to understand how your data is handled. This document outlines our Terms of Service, our strict Privacy Policy, and acknowledges the open-source community that makes SuperApp possible.

> **Developer Note:** SuperApp is developed by **Sachin Yedav** as a flagship learning and portfolio project. While it employs industry-standard security, end-to-end encryption, and local-first architecture ensuring it is **100% safe and reliable to use**, it is not a registered commercial entity. Your data remains entirely yours.

---

## 📜 1. Terms of Service

By accessing and using SuperApp, you accept and agree to be bound by these guidelines.

### Acceptance & Use License
Permission is granted to temporarily use SuperApp for personal, non-commercial viewing and usage. This is a grant of a license, not a transfer of title. Under this license, you may not:
* Modify, inject malicious code, or copy the underlying codebase without permission.
* Use the platform for any illegal, unauthorized, or abusive purpose.
* Attempt to disrupt the Appwrite backend services or intentionally overload the Cloud Functions.

### Account Responsibilities
If you create an account, you are solely responsible for maintaining the security of your credentials. 
* We highly recommend enabling **Multi-Factor Authentication (MFA)**. 
* You are fully responsible for all activities that occur under your account. SuperApp cannot and will not be liable for any loss or damage arising from your failure to comply with this security obligation.

### Limitation of Liability
SuperApp is provided on an "as is" and "as available" basis. In no event shall the developer or associated suppliers be liable for any damages (including loss of data, profit, or business interruption) arising out of the use or inability to use the tools provided.

---

## 🔒 2. Privacy Policy

We collect the absolute minimum amount of data required to make the app function.

### The Data We Collect
* **Identity Data:** Your chosen display name and profile avatar.
* **Contact Data:** Your email address (used strictly for authentication, OTPs, and security alerts).
* **Cloud Data:** Files you explicitly choose to upload to your "Cloud Drive".

### Zero-Trust Local Processing (Our Promise)
SuperApp is uniquely designed to prioritize your privacy. Many of our core features run **entirely on your local device's hardware**:
* **Media & Documents:** Tools like the Image Editor, Video Editor, and PDF Master process files in your browser's RAM using WebAssembly and Canvas APIs. They are NEVER uploaded to our servers.
* **Local Storage:** The Screen Recorder, QR Scanner history, and Productivity tools (Sticky Notes, Timers) save data exclusively to your device's `IndexedDB`. If you clear your browser cache, that data is gone forever.

### Right to be Forgotten
You own your data. If you choose to delete your account via the Security tab, our automated Cloud Functions will systematically and permanently wipe your profile, active sessions, Cloud Storage files, and queue histories from our servers. We do not keep "soft deletes" or shadow backups of your account.

---

## 👨‍💻 3. About the Developer & Open Source

SuperApp is built on the shoulders of giants. We are deeply grateful to the open-source community.

### The Developer
SuperApp is engineered and maintained by **Sachin Yedav**. It was built to showcase advanced full-stack capabilities, including Progressive Web App (PWA) architecture, serverless Cloud Functions, complex state management, and strict UI/UX design principles.
* **GitHub:** [github.com/SachinYedav](https://github.com/SachinYedav)

### Core Technologies & Licenses
Below is a list of the major open-source tools powering this application:
* **React 19 (MIT License):** The core UI Library by Meta.
* **Appwrite (BSD-3-Clause):** Secure, self-hosted Backend-as-a-Service (BaaS).
* **Tailwind CSS (MIT License):** Utility-first CSS framework for our glassmorphism UI.
* **Vite (MIT License):** Next-generation frontend tooling and bundler.
* **Lucide React (ISC License):** Beautiful & consistent icon toolkit.
* **FFmpeg.wasm (MIT License):** WebAssembly port of FFmpeg for local media processing.
* **Html5-Qrcode (Apache-2.0):** Robust QR Code scanning engine.

---
*For any legal inquiries, security vulnerabilities, or project discussions, please reach out via GitHub or the contact links in the Settings menu.*

