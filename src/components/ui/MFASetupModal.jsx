import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react'; // QR Library
import { X, ShieldCheck, Copy, CheckCircle, Loader2 } from 'lucide-react';
import authService from '@/services/auth';
import { useToast } from '@/context/ToastContext';

export default function MFASetupModal({ isOpen, onClose, onSuccess }) {
    const [step, setStep] = useState(1); 
    const [secretData, setSecretData] = useState(null);
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();

    // 1. Initialize Setup when Modal Opens
    useEffect(() => {
        if (isOpen) {
            startSetup();
        } else {
            // Reset state on close
            setStep(1);
            setCode('');
            setSecretData(null);
        }
    }, [isOpen]);


    const startSetup = async () => {
        try {
            const data = await authService.enableMfa();
            setSecretData(data); 
            setStep(2);
        } catch (error) {
            console.error("MFA Setup Error:", error);
            addToast({ title: "Error", message: "Failed to initialize MFA.", type: "error" });
            onClose();
        }
    };

    const handleVerify = async () => {
        if (code.length !== 6) return;
        const authenticatorId = secretData?.$id || secretData?.id; 
        setLoading(true);
        try {
            await authService.verifyMfaSetup(authenticatorId, code);
            addToast({ title: "Success", message: "Two-Factor Authentication Enabled!", type: "success" });
            onSuccess(); 
            onClose();
        } catch (error) {
            console.error(error);
            addToast({ title: "Error", message: error.message || "Invalid Code", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const copySecret = () => {
        if (secretData?.secret) {
            navigator.clipboard.writeText(secretData.secret);
            addToast({ title: "Copied", message: "Secret key copied to clipboard.", type: "success" });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-scale-in">
                
                {/* Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950/50">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <ShieldCheck className="text-blue-600" size={20}/> Setup 2FA
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                        <X size={20}/>
                    </button>
                </div>

                {/* Body */}
                <div className="p-8">
                    {step === 1 && (
                        <div className="flex flex-col items-center justify-center py-8">
                            <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
                            <p className="text-sm text-slate-500">Generating secure keys...</p>
                        </div>
                    )}

                    {step === 2 && secretData && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                                    Scan this QR code with your Authenticator App (Google/Authy).
                                </p>
                                
                                <div className="bg-white p-4 rounded-xl border border-slate-200 inline-block shadow-sm">
                                    <QRCodeSVG 
                                        value={secretData.uri} 
                                        size={160}
                                        fgColor="#000000" 
                                        bgColor="#ffffff" 
                                        level="L"         
                                        includeMargin={false}
                                    />
                                </div>
                            </div>

                            {/* Manual Entry Fallback */}
                            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg flex items-center justify-between border border-slate-200 dark:border-slate-700">
                                <code className="text-xs font-mono text-slate-600 dark:text-slate-300 break-all">
                                    {secretData.secret}
                                </code>
                                <button onClick={copySecret} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors">
                                    <Copy size={14} className="text-slate-500"/>
                                </button>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Enter 6-digit Code</label>
                                <input 
                                    type="text" 
                                    maxLength={6}
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                    placeholder="000 000"
                                    className="w-full text-center text-2xl tracking-widest font-mono py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                                />
                            </div>

                            <button 
                                onClick={handleVerify}
                                disabled={code.length !== 6 || loading}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20}/> : <>Verify & Enable <CheckCircle size={18}/></>}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}