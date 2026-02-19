import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ShieldCheck, KeyRound, AlertTriangle, Loader2,
  Smartphone, Save, Trash2, } from "lucide-react";

import authService from "@/services/auth";
import { useToast } from "@/context/ToastContext";
// UI Components
import { SectionHeader, PasswordInput,ToggleRow, DeleteConfirmModal,
  MFASetupModal, ConfirmModal } from "@/components/ui/index"

// Accept Prop
export default function SecurityTab({ isOnline = true }) {
  const { addToast } = useToast();
  const navigate = useNavigate();

  // States
  const [passForm, setPassForm] = useState({ old: "", new: "", confirm: "" });
  const [loadingPass, setLoadingPass] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 2FA States
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [showMfaModal, setShowMfaModal] = useState(false);
  const [loadingMfa, setLoadingMfa] = useState(true);
  const [showDisableMfaModal, setShowDisableMfaModal] = useState(false);

  useEffect(() => {
    // Only fetch MFA status if online
    if (isOnline) {
       checkMfaStatus();
    } else {
       setLoadingMfa(false);
    }
  }, [isOnline]);

  const checkMfaStatus = async () => {
    try {
      const status = await authService.getMfaStatus();
      setMfaEnabled(status);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMfa(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!isOnline)
      return addToast({
        title: "Offline",
        message: "You are offline.",
        type: "error",
      });
    if (passForm.new.length < 8)
      return addToast({
        title: "Weak Password",
        message: "Min 8 chars required",
        type: "error",
      });
    if (passForm.new !== passForm.confirm)
      return addToast({
        title: "Mismatch",
        message: "Passwords do not match.",
        type: "error",
      });

    setLoadingPass(true);
    try {
      await authService.updatePassword(passForm.new, passForm.old);
      addToast({
        title: "Success",
        message: "Password Updated!",
        type: "success",
      });
      setPassForm({ old: "", new: "", confirm: "" });
    } catch (error) {
      addToast({
        title: "Error",
        message: error.message || "Incorrect current password.",
        type: "error",
      });
    } finally {
      setLoadingPass(false);
    }
  };

  const handleMfaToggle = async () => {
    if (!isOnline) {
       addToast({ title: "Offline", message: "Cannot change security settings offline", type: "error" });
       return;
    }
    
    if (mfaEnabled) {
      setShowDisableMfaModal(true);
    } else {
      setShowMfaModal(true);
    }
  };

  const confirmDisableMfa = async () => {
    setShowDisableMfaModal(false); 
    try {
      await authService.disableMfa();
      setMfaEnabled(false);
      addToast({
        title: "Disabled",
        message: "2FA turned off.",
        type: "success",
      });
    } catch (error) {
      addToast({
        title: "Error",
        message: "Failed to disable MFA.",
        type: "error",
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up pb-10">
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      />
      <MFASetupModal
        isOpen={showMfaModal}
        onClose={() => setShowMfaModal(false)}
        onSuccess={() => setMfaEnabled(true)}
      />
      
      <ConfirmModal
        isOpen={showDisableMfaModal}
        onClose={() => setShowDisableMfaModal(false)}
        onConfirm={confirmDisableMfa}
        title="Disable 2FA?"
        message="Are you sure you want to disable Two-Factor Authentication? This will make your account less secure."
        confirmText="Yes, Disable"
        cancelText="Cancel"
      />

      {/* 1. PASSWORD UPDATE */}
      <div>
        <div className="flex justify-between items-end mb-3">
          <SectionHeader
            label="Login Security"
            icon={ShieldCheck}
            className="mb-0"
          />
          <button
            type="button"
            onClick={() => navigate("/reset-password")}
            disabled={!isOnline}
            className={`text-xs font-bold text-blue-600 px-1 ${!isOnline ? 'opacity-50 cursor-not-allowed' : 'hover:underline'}`}
          >
            Forgot Password?
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <form onSubmit={handleUpdatePassword} className="max-w-md space-y-5">
            <PasswordInput
              label="Current Password"
              icon={Lock}
              value={passForm.old}
              onChange={(e) =>
                setPassForm({ ...passForm, old: e.target.value })
              }
              placeholder="••••••••"
              disabled={loadingPass || !isOnline}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PasswordInput
                label="New Password"
                icon={KeyRound}
                value={passForm.new}
                onChange={(e) =>
                  setPassForm({ ...passForm, new: e.target.value })
                }
                placeholder="Min 8 chars"
                disabled={loadingPass || !isOnline}
              />
              <PasswordInput
                label="Confirm Password"
                icon={KeyRound}
                value={passForm.confirm}
                onChange={(e) =>
                  setPassForm({ ...passForm, confirm: e.target.value })
                }
                placeholder="Repeat password"
                disabled={loadingPass || !isOnline}
              />
            </div>
            <button
              type="submit"
              disabled={
                loadingPass || !isOnline || passForm.new !== passForm.confirm
              }
              className={`w-full sm:w-auto px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all 
                ${!isOnline 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:opacity-90 active:scale-95'}`}
            >
              {loadingPass ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Save size={16} />
              )}
              {loadingPass ? "Updating..." : "Update Password"}
            </button>
            {!isOnline && <p className="text-[10px] text-red-400">Security settings unavailable offline</p>}
          </form>
        </div>
      </div>

      {/* 2. 2FA TOGGLE */}
      <div>
        <SectionHeader label="Two-Factor Authentication" icon={Smartphone} />
        <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm ${!isOnline ? 'opacity-70 grayscale' : ''}`}>
          <ToggleRow
            label="Authenticator App"
            desc={
              mfaEnabled
                ? "Your account is secured with 2FA."
                : "Add an extra layer of security using TOTP."
            }
            icon={Smartphone}
            checked={mfaEnabled}
            onChange={handleMfaToggle}
            disabled={!isOnline} // Prop added to Disable Toggle
            className={mfaEnabled ? "bg-green-50/10" : ""}
          />
        </div>
      </div>

      {/* 3. DANGER ZONE */}
      <div>
        <SectionHeader
          label="Danger Zone"
          icon={AlertTriangle}
          color="text-red-500"
        />
        <div className="bg-red-50 dark:bg-red-950/20 rounded-2xl p-6 border border-red-100 dark:border-red-900/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-red-700 dark:text-red-400 text-sm sm:text-base">
              Delete Account
            </h4>
            <p className="text-xs text-red-600/70 dark:text-red-400/60 mt-1 max-w-sm leading-relaxed">
              Permanently remove your profile and all data. This action is
              irreversible.
            </p>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            disabled={!isOnline}
            className={`w-full sm:w-auto px-5 py-2.5 bg-white dark:bg-red-900/20 text-red-600 border border-red-200 dark:border-red-800/50 rounded-xl font-bold text-xs sm:text-sm shadow-sm whitespace-nowrap flex items-center justify-center gap-2 
            ${!isOnline ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600 hover:text-white hover:border-red-600 transition-all'}`}
          >
            <Trash2 size={16} /> Delete Forever
          </button>
        </div>
      </div>
    </div>
  );
}