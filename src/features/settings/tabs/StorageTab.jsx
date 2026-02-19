import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Cloud, HardDrive, Trash2, Database, AlertCircle, WifiOff } from "lucide-react";
import databaseService from "@/services/database";
import { ConfirmModal, Toast, StatsCard, SectionHeader } from "@/components/ui/index"

// Accept Prop
export default function StorageTab({ isOnline = true }) {
  const userData = useSelector((state) => state.auth.userData);
  const [loading, setLoading] = useState(true);
  const [cloudUsage, setCloudUsage] = useState({
    used: 0,
    count: 0,
    limit: 2 * 1024 * 1024 * 1024,
  });
  const [localUsage, setLocalUsage] = useState({ used: 0, count: 0 });
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);

  const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return "0 B";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  useEffect(() => {
    const fetchStorageData = async () => {
      setLoading(true);
      try {
        // 1. Local (Always works)
        let localTotal = 0,
          localCount = 0;
        for (let x in localStorage) {
          if (localStorage.hasOwnProperty(x)) {
            localTotal += localStorage[x].length * 2;
            localCount++;
          }
        }
        setLocalUsage({ used: localTotal, count: localCount });

        // 2. Cloud (Requires Online)
        if (userData?.$id && isOnline) {
          const response = await databaseService.getFiles(userData.$id);
          if (response?.documents) {
            const totalCloudSize = response.documents.reduce(
              (acc, doc) => acc + (doc.size || 0),
              0,
            );
            setCloudUsage((prev) => ({
              ...prev,
              used: totalCloudSize,
              count: response.total,
            }));
          }
        }
      } catch (error) {
        console.error("Storage Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStorageData();
  }, [userData, isOnline]);

  const handleClearCache = () => {
    localStorage.clear();
    setLocalUsage({ used: 0, count: 0 });
    setToast({ message: "App Cache Cleared!", type: "success" });
    setTimeout(() => window.location.reload(), 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in-up pb-10">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <ConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleClearCache}
        title="Clear App Cache?"
        message="This will reset local settings. Cloud files are safe."
        type="danger"
      />

      <div>
        <SectionHeader label="Storage Overview" icon={Database} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* CLOUD STATS */}
          <div className="relative">
             {!isOnline && (
                 <div className="absolute inset-0 z-10 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-[1px] rounded-2xl flex items-center justify-center">
                    <div className="bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                        <WifiOff size={14} className="text-slate-400"/>
                        <span className="text-xs font-bold text-slate-500">Offline</span>
                    </div>
                 </div>
             )}
             <StatsCard
                title="Cloud"
                icon={Cloud}
                value={loading && isOnline ? "..." : formatBytes(cloudUsage.used)}
                subValue={`/ ${formatBytes(cloudUsage.limit)}`}
                progress={(cloudUsage.used / cloudUsage.limit) * 100}
                variant="blue"
                footerText={`${cloudUsage.count} Files stored`}
             />
          </div>

          {/* LOCAL STATS */}
          <StatsCard
            title="Local"
            icon={HardDrive}
            value={formatBytes(localUsage.used)}
            subValue="used"
            progress={(localUsage.used / (10 * 1024 * 1024)) * 100}
            variant="purple"
            footerText={`${localUsage.count} Cache items`}
          />
        </div>
      </div>

      <div>
        <SectionHeader label="Maintenance" icon={Trash2} />
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg shrink-0">
              <Trash2 size={18} />
            </div>
            <div>
              <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm">
                Clear App Cache
              </h4>
              <p className="text-xs text-slate-500 mt-0.5 max-w-sm leading-relaxed">
                Frees up local space and fixes minor glitches.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 border border-slate-200 dark:border-slate-700 hover:border-red-200 rounded-xl text-sm font-bold transition-all"
          >
            Clear Cache
          </button>
        </div>
        <div className="mt-4 flex gap-2 px-1">
          <AlertCircle size={14} className="text-slate-400 mt-0.5 shrink-0" />
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Local storage is limited by your browser (usually around 5-10 MB).
          </p>
        </div>
      </div>
    </div>
  );
}