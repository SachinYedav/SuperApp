import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Camera,Loader2, Save, Monitor, Smartphone, Globe, CheckCircle, MapPin,
  Trash2, Edit2, WifiOff } from "lucide-react";
import { login } from "@/store/authSlice";
import authService from "@/services/auth";
import databaseService from "@/services/database";
import { ConfirmModal, UserAvatar, Toast } from "@/components/ui/index"


export default function AccountTab({ isOnline = true }) {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);

  // --- Local States ---
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", bio: "" });
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [toast, setToast] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [sessionToRevoke, setSessionToRevoke] = useState(null);

  // 1. Sync Form Data
  useEffect(() => {
    if (userData) {
      setFormData({ name: userData.name || "", bio: userData.bio || "" });
    }
  }, [userData]);

  // 2. Fetch Sessions 
  useEffect(() => {
    let mounted = true;
    
    // OFFLINE CHECK
    if (!isOnline) {
       setLoadingSessions(false); 
       setSessions([]);
       return; 
    }

    setLoadingSessions(true);

    authService
      .getSessions()
      .then((res) => {
        if (mounted) {
          setSessions(res.sessions || []);
          setLoadingSessions(false);
        }
      })
      .catch((err) => {
        if (mounted) setLoadingSessions(false);
      });
    
    return () => {
      mounted = false;
    };
  }, [isOnline]);

  // --- HANDLERS ---
  const handleAvatarChange = async (e) => {
    // Check Offline
    if (!isOnline) return setToast({ message: "You are offline", type: "error" });
    
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadingImg(true);
    try {
      const userId = userData.docId || userData.$id; 
      const uploadedFile = await databaseService.uploadFile(file, userId);
      
      if (uploadedFile) {
        const fileUrl = uploadedFile.url; 
        const updatedProfile = await authService.updateProfile(
          userId,
          { avatarUrl: fileUrl },
        );
        dispatch(login({ ...userData, ...updatedProfile }));
        setToast({ message: "Avatar Updated!", type: "success" });
      }
    } catch (error) {
      console.error("Avatar Upload Error:", error);
      setToast({ message: "Upload Failed", type: "error" });
    } finally {
      setUploadingImg(false);
    }
  };


  const handleUpdate = async () => {
    // Check Offline
    if (!isOnline) return setToast({ message: "Cannot save while offline", type: "error" });

    if (!formData.name.trim())
      return setToast({ message: "Name required", type: "error" });
    setSaving(true);
    try {
      const updatedProfile = await authService.updateProfile(
        userData.docId || userData.$id,
        formData,
      );
      if (formData.name !== userData.name)
        await authService.updateName(formData.name);
      dispatch(login({ ...userData, ...updatedProfile }));
      setIsEditing(false);
      setToast({ message: "Profile Saved!", type: "success" });
    } catch (error) {
      setToast({ message: "Update Failed", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  // 1. Sirf Modal Open karega
  const handleRevokeClick = (sessionId) => {
    if (!isOnline) return setToast({ message: "Offline: Cannot logout device", type: "error" });
    setSessionToRevoke(sessionId);
    setShowRevokeModal(true);
  };

  // 2. Actual Action 
  const confirmRevokeSession = async () => {
    if (!sessionToRevoke) return;
    
    try {
      await authService.deleteSession(sessionToRevoke);
      setSessions((prev) => prev.filter((s) => s.$id !== sessionToRevoke));
      setToast({ message: "Device logged out.", type: "success" });
    } catch (error) {
      setToast({ message: "Failed to logout.", type: "error" });
    } finally {
      setShowRevokeModal(false);
      setSessionToRevoke(null);
    }
  };

  const getDeviceIcon = (session) => {
    const type = (session.deviceType || session.clientType || "").toLowerCase();
    if (type.includes("desktop") || type.includes("laptop"))
      return <Monitor size={18} />;
    if (type.includes("phone") || type.includes("mobile"))
      return <Smartphone size={18} />;
    return <Globe size={18} />;
  };

  // --- RENDER ---
  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in-up pb-10">
      <ConfirmModal 
        isOpen={showRevokeModal}
        onClose={() => setShowRevokeModal(false)}
        onConfirm={confirmRevokeSession}
        title="Logout Device?"
        message="This will sign out your account from the selected device."
        type="danger"
        confirmText="Logout"
      />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* ================= SECTION 1: HEADER & ACTIONS ================= */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            My Account {!isOnline && <span className="text-xs font-normal text-red-500 bg-red-50 px-2 py-1 rounded-full border border-red-100 flex items-center gap-1"><WifiOff size={10}/> Offline</span>}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage profile details & security.
          </p>
        </div>

        <div className="w-full sm:w-auto flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData({ name: userData.name, bio: userData.bio });
                }}
                className="flex-1 sm:flex-none px-4 py-2 text-sm font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={saving || !isOnline} // Disable if Offline
                className={`flex-1 sm:flex-none px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold flex justify-center items-center gap-2 transition-colors shadow-lg shadow-blue-600/20 ${!isOnline ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Save size={16} />
                )}
                Save
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full sm:w-auto px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity flex justify-center items-center gap-2"
            >
              <Edit2 size={16} /> Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* ================= SECTION 2: PROFILE CARD ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* LEFT: AVATAR */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <UserAvatar
                user={userData}
                size="xl"
                className={`shadow-xl ring-4 ring-white dark:ring-slate-800 ${uploadingImg ? "opacity-50" : ""}`}
              />
              <label
                className={`absolute bottom-0 right-0 p-2.5 bg-slate-900 text-white rounded-full cursor-pointer hover:scale-110 transition-transform shadow-lg border-2 border-white dark:border-slate-800 ${!isOnline ? "hidden" : ""}`}
              >
                {uploadingImg ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Camera size={16} />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                  disabled={uploadingImg || !isOnline}
                />
              </label>
            </div>
            <div className="text-center">
              <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-md">
                Pro Member
              </span>
            </div>
          </div>

          {/* RIGHT: DETAILS FORM */}
          <div className="flex-1 space-y-6 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                ) : (
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-transparent dark:border-slate-800 font-medium text-slate-900 dark:text-white">
                    {userData.name}
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-300 font-medium truncate text-sm">
                    {userData.email}
                  </span>
                  <CheckCircle size={14} className="text-green-500 shrink-0" />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Bio / About
              </label>
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-sm text-slate-700 dark:text-white h-28 resize-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Tell us a bit about yourself..."
                />
              ) : (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800/50 min-h-[5rem]">
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {userData.bio || "No bio added yet."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= SECTION 3: SESSIONS (Adaptive Layout) ================= */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 px-1 flex items-center gap-2">
          Login History
          {!isOnline && <span className="text-[10px] text-orange-500 font-normal">(Cached view unavailable)</span>}
        </h3>

        {/* --- MOBILE VIEW: CARDS --- */}
        <div className="md:hidden space-y-3">
          {loadingSessions ? (
            <div className="p-6 text-center text-slate-400 text-sm bg-slate-50 rounded-xl">
              {!isOnline ? "Connect to internet to view login history." : "Loading..."}
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-sm bg-slate-50 rounded-xl">
              No active sessions.
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.$id}
                className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
              >
                {/* Same Card Content */}
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-xl ${session.current ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}
                  >
                    {getDeviceIcon(session)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                      {session.osName} {session.osVersion}
                    </h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin size={10} /> {session.ip}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {new Date(session.$createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {session.current ? (
                  <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-1 rounded-md">
                    Active
                  </span>
                ) : (
                  <button
                    onClick={() => handleRevokeClick(session.$id)}
                    disabled={!isOnline} // Disable Button
                    className={`p-2 rounded-lg transition-colors ${!isOnline ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-red-500 hover:bg-red-50'}`}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* --- DESKTOP VIEW: TABLE --- */}
        <div className="hidden md:block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="p-4 text-xs font-bold text-slate-400 uppercase w-1/3">
                  Device
                </th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase">
                  Location
                </th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase">
                  Date
                </th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loadingSessions ? (
                <tr>
                  <td
                    colSpan="4"
                    className="p-8 text-center text-slate-400 text-sm"
                  >
                    {!isOnline ? "Connect to internet to view history" : "Syncing..."}
                  </td>
                </tr>
              ) : (
                sessions.map((session) => (
                  <tr
                    key={session.$id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${session.current ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}
                        >
                          {getDeviceIcon(session)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                            {session.osName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {session.clientName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-600 font-mono text-xs">
                      {session.ip}
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      {new Date(session.$createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      {session.current ? (
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                          Active
                        </span>
                      ) : (
                        <button
                          onClick={() => handleRevokeClick(session.$id)}
                          disabled={!isOnline}
                          className={`transition-colors ${!isOnline ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-red-500'}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}