import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, Bell, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ title, message, type = 'info', duration = 5000 }) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Icon Helper
  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle size={20} className="text-green-500" />;
      case 'error': return <XCircle size={20} className="text-red-500" />;
      case 'warning': return <AlertTriangle size={20} className="text-orange-500" />;
      case 'notification': return <Bell size={20} className="text-blue-500" />;
      default: return <Info size={20} className="text-blue-500" />;
    }
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      
      {/* --- TOAST CONTAINER (Fixed Top Right) --- */}
      <div className="fixed top-16 right-4 z-[9999] flex flex-col gap-3 w-[90%] sm:w-96 pointer-events-none">
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            className={`
              pointer-events-auto 
              bg-white dark:bg-slate-900 
              border border-slate-200 dark:border-slate-800 
              rounded-2xl shadow-2xl shadow-blue-900/10 
              p-4 flex items-start gap-3 
              transform transition-all duration-300 ease-in-out
              animate-slide-in-right backdrop-blur-md
            `}
          >
            {/* Icon */}
            <div className={`mt-0.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 flex-shrink-0`}>
               {getIcon(toast.type)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
               {toast.title && (
                 <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-0.5">
                   {toast.title}
                 </h4>
               )}
               <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed break-words">
                 {toast.message}
               </p>
            </div>

            {/* Close Button */}
            <button 
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};