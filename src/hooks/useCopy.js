import { useState } from 'react';
import { useToast } from '@/context/ToastContext'; 

export default function useCopy() {
  const { addToast } = useToast(); 
  const [copiedText, setCopiedText] = useState(null);

  const copyToClipboard = async (text, label = "Copied") => {
    try {
        await navigator.clipboard.writeText(text);
        setCopiedText(text);
        
        // Trigger Global Toast
        if (addToast) addToast({ message: `${label}: ${text}`, type: "success" });
        
        setTimeout(() => setCopiedText(null), 2000);
        return true;
    } catch (err) {
        console.error('Copy failed', err);
        if (addToast) addToast({ message: "Failed to copy", type: "error" });
        return false;
    }
  };

  return { copyToClipboard, copiedText };
}