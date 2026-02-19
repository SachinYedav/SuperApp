import React, { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import useLocalStorage from "@/hooks/useLocalStorage";
import {
  Moon,
  Sun,      
  Monitor,
  Bell,
  CheckCircle,
  Volume2,
  Save,
} from "lucide-react";
import { Toast, SectionHeader, SelectionCard, ToggleRow } from '@/components/ui/index'

export default function GeneralTab() {
  const { theme, setTheme } = useTheme();

  // --- PERSISTENT SETTINGS ---
  const [notifications, setNotifications] = useLocalStorage("pref_notifications", false);
  const [highQuality, setHighQuality] = useLocalStorage("pref_highQuality", true);
  const [autoSave, setAutoSave] = useLocalStorage("pref_autoSave", true);
  const [soundEffects, setSoundEffects] = useLocalStorage("pref_sound", true);
  const [toast, setToast] = useState(null);

  // --- HANDLERS ---
  const handleNotificationToggle = async (newValue) => {
    if (newValue) {
        if (!("Notification" in window)) {
            return setToast({ message: "Notifications not supported", type: "error" });
        }
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            setNotifications(true);
            new Notification("Notifications Enabled", { body: "You will now receive updates!" });
            setToast({ message: "Notifications Enabled!", type: "success" });
        } else {
            setNotifications(false);
            setToast({ message: "Permission Denied", type: "error" });
        }
    } else {
        setNotifications(false);
    }
  };

  const handleThemeChange = (mode) => {
    setTheme(mode); 
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* 1. APPEARANCE */}
      <div>
        <SectionHeader label="Appearance" icon={Sun} />
        <div className="grid grid-cols-3 gap-4">
          <SelectionCard
            label="Light"
            icon={Sun}
            isActive={theme === "light"}
            onClick={() => handleThemeChange("light")}
          />
          <SelectionCard
            label="Dark"
            icon={Moon}
            isActive={theme === "dark"}
            onClick={() => handleThemeChange("dark")}
          />
          <SelectionCard
            label="System"
            icon={Monitor}
            isActive={theme === "system"} 
            onClick={() => handleThemeChange("system")}
          />
        </div>
      </div>

      {/* 2. APP PREFERENCES  */}
      <div>
        <SectionHeader label="App Preferences" icon={CheckCircle} />
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm divide-y divide-slate-100 dark:divide-slate-800">
          <ToggleRow
            label="Push Notifications"
            desc="Get updates when large files finish processing"
            icon={Bell}
            checked={notifications}
            onChange={handleNotificationToggle}
          />
          <ToggleRow
            label="High Quality Export"
            desc="Always save images/videos in original resolution"
            icon={CheckCircle}
            checked={highQuality}
            onChange={setHighQuality}
          />
          <ToggleRow
            label="Auto-Save Projects"
            desc="Save changes to local database every 30 seconds"
            icon={Save}
            checked={autoSave}
            onChange={setAutoSave}
          />
          <ToggleRow
            label="Sound Effects"
            desc="Play sounds on success/error"
            icon={Volume2}
            checked={soundEffects}
            onChange={setSoundEffects}
          />
        </div>
      </div>
    </div>
  );
}