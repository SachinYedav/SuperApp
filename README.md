

<div align="center">
  <img src="public/assets/icons/logo.png" alt="SuperApp Logo" width="120" height="120">
  
  # 🚀 SuperApp
  **An all-in-one, offline-first productivity and creator suite.**
  
  [![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite_PWA-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Appwrite](https://img.shields.io/badge/Appwrite-FD366E?style=for-the-badge&logo=appwrite&logoColor=white)](https://appwrite.io/)
</div>

<br />

## 📖 About The Project
SuperApp is a modern, zero-trust workspace designed for creators, developers, and everyday users. Built with a robust Offline-First architecture, it ensures you never lose access to your tools, even without an internet connection. 

---

## ✨ Key Features

### 🛡️ Advanced Security & Auth
- **Robust Authentication:** Email/Password and Seamless Google OAuth integration.
- **Two-Factor Authentication (2FA):** Time-based OTP (TOTP) support for maximum account security.
- **Session Management:** View active devices, IP addresses, and remotely revoke sessions.

### ⚡ Progressive Web App (PWA)
- **Offline-First:** Powered by Workbox & Service Workers. Full UI access without internet.
- **Installable:** Native app-like experience on Desktop, Android, and iOS (Custom Add-to-Home prompt).
- **Background Sync:** Aggressive caching for lightning-fast load times.

### 🛠️ Built-In Utilities (Add screenshots here later)
- **Media Editors:** Advanced video and audio manipulation tools.
- **Digital Workspace:** Built-in PDF tools and mathematical utilities.
- **User Dashboard:** Highly customizable profile with cloud avatar uploads.

---

## 📸 Screenshots
| Dashboard | Mobile View | Settings |
| :---: | :---: | :---: |
| <img src="https://via.placeholder.com/400x250?text=Dashboard+Screenshot" alt="Dashboard" /> | <img src="https://via.placeholder.com/400x250?text=Mobile+App+View" alt="Mobile" /> | <img src="https://via.placeholder.com/400x250?text=Security+Settings" alt="Settings" /> |

---

## 🏗️ Architecture & Tech Stack
* **Frontend:** React.js, Vite
* **Styling:** Tailwind CSS (Dark/Light Mode adaptive)
* **State Management:** Redux Toolkit
* **Backend as a Service (BaaS):** Appwrite (Auth, Database, Storage)
* **Offline Routing & Caching:** Vite-PWA (Workbox)

---

## 🚀 Local Development Setup

1. **Clone the repository**
   ```bash
   git clone [https://github.com/SachinYedav/SuperApp.git](https://github.com/SachinYedav/SuperApp.git)
   cd SuperApp

```

2. **Install dependencies**
```bash
npm install

```


3. **Environment Variables**
Create a `.env` file in the root and add your Appwrite credentials:
```env
VITE_APPWRITE_ENDPOINT=[https://cloud.appwrite.io/v1](https://cloud.appwrite.io/v1)
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_COLLECTION_ID=your_collection_id
VITE_APPWRITE_BUCKET_ID=your_bucket_id

```


4. **Run the development server**
```bash
npm run dev

```



---

<div align="center">
Made with ❤️ by Sachin Yadav.
</div>

