import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // 3 second baad gayab
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white'
  };

  const icons = {
    success: <CheckCircle size={18} />,
    error: <XCircle size={18} />,
    info: <Info size={18} />
  };

  return (
    <div className={`fixed bottom-4 right-4 z-[110] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg shadow-black/10 animate-slide-up ${styles[type]}`}>
       {icons[type]}
       <span className="text-sm font-bold">{message}</span>
       <button onClick={onClose} className="ml-2 opacity-80 hover:opacity-100"><X size={14}/></button>
    </div>
  );
}