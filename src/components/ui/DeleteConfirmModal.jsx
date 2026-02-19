import React, { useState, useEffect } from 'react';
import { AlertTriangle, Trash2, X, Loader2, Lock, AlertCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import authService from '@/services/auth';
import { logout } from '@/store/authSlice';
import { useToast } from '@/context/ToastContext';

export default function DeleteConfirmModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1); 
  const [inputValue, setInputValue] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToast();

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setInputValue('');
      setPassword('');
      setError('');
      setLoading(false);
      // Lock body scroll
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  // --- HANDLERS ---

  const handleNextStep = () => {
    if (inputValue !== 'delete my account') return;
    setStep(2);
    setError('');
  };

  const handleFinalDelete = async () => {
    if (!password) {
      setError("Password is required to confirm deletion.");
      return;
    }

    setError('');
    setLoading(true);

    try {
      // 1. Verify Password (Critical Security Step)
      const verifyRes = await authService.verifySessionPassword(password);
      
      if (!verifyRes || !verifyRes.valid) {
        throw new Error("Invalid password. Please try again.");
      }

      // 2. Request Deletion
      const deleteRes = await authService.requestAccountDeletion();

      if (deleteRes && deleteRes.success) {
        addToast({
          title: "Account Deleted",
          message: "Your account has been permanently deleted.",
          type: "success"
        });

        // 3. Logout & Cleanup
        await authService.logout();
        dispatch(logout());
        navigate('/login');
      } else {
        throw new Error("Server could not process deletion.");
      }
    } catch (err) {
      console.error("Delete Error:", err);
      setError(err.message || "Failed to delete account. Please try again.");
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (step === 1 && inputValue === 'delete my account') handleNextStep();
      if (step === 2 && password) handleFinalDelete();
    }
    if (e.key === 'Escape') onClose();
  };

  return (
    // Outer Overlay: Ensures centering and backdrop
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
      
      {/* Backdrop (Darker & Blur for focus) */}
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-[#18181b] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col transform transition-all animate-in fade-in zoom-in-95 duration-200"
        onKeyDown={handleKeyDown}
      >
        
        {/* --- HEADER --- */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span className="p-1.5 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-md">
              <AlertTriangle size={18} />
            </span>
            Delete Account
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-lg p-1 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* --- CONTENT BODY --- */}
        <div className="p-6">
          {step === 1 ? (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-200 font-medium leading-relaxed">
                  Warning: This action is permanent and cannot be undone. All your data, including files, settings, and profile information, will be permanently erased.
                </p>
              </div>

              <div className="pt-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Type <span className="font-mono font-bold text-slate-900 dark:text-white select-none">delete my account</span> to continue
                </label>
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="delete my account"
                  autoFocus
                  className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  onPaste={(e) => e.preventDefault()} // Force typing for safety
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-200">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                To complete the deletion process, please verify your identity by entering your password.
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoFocus
                    className={`w-full pl-9 pr-3 py-2.5 bg-white dark:bg-slate-900 border rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all ${error ? 'border-red-500 focus:border-red-500' : 'border-slate-300 dark:border-slate-700 focus:border-red-500'}`}
                  />
                </div>
                {error && (
                  <p className="mt-2 text-xs font-medium text-red-600 flex items-center gap-1.5">
                    <AlertCircle size={12} /> {error}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* --- FOOTER --- */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 dark:bg-[#18181b] border-t border-slate-100 dark:border-slate-800 rounded-b-xl">
          <button 
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>

          {step === 1 ? (
            <button 
              onClick={handleNextStep}
              disabled={inputValue !== 'delete my account'}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Confirm & Continue
            </button>
          ) : (
            <button 
              onClick={handleFinalDelete}
              disabled={!password || loading}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[100px] justify-center"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> 
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={16} /> 
                  Delete Account
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}