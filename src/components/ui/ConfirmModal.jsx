import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Check, Info } from 'lucide-react';

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Are you sure?", 
  message = "This action cannot be undone.", 
  type = 'danger', // 'danger' | 'info'
  checkboxLabel = "I understand and confirm"
}) {
  const [isChecked, setIsChecked] = useState(false);

  // Reset state jab bhi modal open ho
  useEffect(() => {
    if (isOpen) {
      setIsChecked(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (isChecked) {
      onConfirm();
      onClose();
    }
  };

  // Theme configuration based on type
  const isDanger = type === 'danger';
  const Icon = isDanger ? AlertTriangle : Info;
  const iconBg = isDanger 
    ? 'bg-red-100 dark:bg-red-900/20 text-red-600' 
    : 'bg-blue-100 dark:bg-blue-900/20 text-blue-600';

  const btnColor = isDanger 
    ? 'bg-red-600 hover:bg-red-700' 
    : 'bg-blue-600 hover:bg-blue-700';

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4" 
      role="dialog" 
      aria-modal="true"
    >
      {/* Modal Card */}
      <div className="relative mx-auto w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col">

        
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg shrink-0 ${iconBg}`}>
              <Icon size={20} />
            </div>
            <h3 className="text-xl  font-semibold text-slate-800 dark:text-slate-100">
              {title}
            </h3>
          </div>

          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6">
          <p className="text-base  text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
            {message}
          </p>

          {/* Confirmation Checkbox */}
          <div 
            onClick={() => setIsChecked(!isChecked)}
            className={`
              flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all select-none
              ${isChecked 
                ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800' 
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}
            `}
          >
            <div className={`
              mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors
              ${isChecked 
                ? 'bg-blue-600 border-blue-600 text-white' 
                : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600'}
            `}>
              {isChecked && <Check size={14} strokeWidth={3} />}
            </div>

            <span className={`text-base  font-medium ${
              isChecked 
                ? 'text-blue-800 dark:text-blue-200' 
                : 'text-slate-700 dark:text-slate-300'
            }`}>
              {checkboxLabel}
            </span>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 rounded-b-xl">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-base  font-medium text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          
          <button 
            onClick={handleConfirm}
            disabled={!isChecked}
            className={`
              px-4 py-2 text-base  font-medium text-white rounded-lg shadow-sm transition-all flex items-center gap-2
              ${btnColor}
              disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
            `}
          >
            Confirm
          </button>
        </div>

      </div>
    </div>
  );
}
