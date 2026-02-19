import React, { useState, useEffect } from 'react';
import { Mail, ArrowRight, Lock, KeyRound, Loader2, CheckCircle, ArrowLeft, Timer, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { openAuthModal } from '@/store/authSlice'; 
import authService from '@/services/auth';
import { useToast } from '@/context/ToastContext';
import Seo from '@/components/seo/Seo';

export default function ResetPassword() {
  // State
  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPass, setNewPass] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Timer State for Resend
  const [timer, setTimer] = useState(0); 
  
  const { addToast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // --- TIMER LOGIC ---
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // --- HANDLERS ---

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!email) return addToast({ title: "Email Required", message: "Please enter your email", type: "error" });

    setLoading(true);
    try {
        await authService.sendOtp(email);
        
        // Only change step if we are on step 1
        if (step === 1) setStep(2);
        
        // Start 30s Timer
        setTimer(30); 
        
        addToast({ title: "OTP Sent", message: `Code sent to ${email}`, type: "success" });
    } catch (error) {
        addToast({ title: "Error", message: error.message || "Failed to send OTP", type: "error" });
    } finally {
        setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPass.length < 8) return addToast({ title: "Weak Password", message: "Min 8 chars required", type: "error" });
    if (otp.length !== 6) return addToast({ title: "Invalid OTP", message: "Code must be 6 digits", type: "error" });

    setLoading(true);
    try {
        const res = await authService.resetPasswordWithOtp(email, otp, newPass);
        
        if (res.success) {
            addToast({ title: "Success", message: "Password updated successfully!", type: "success" });
            
            // Redirect Flow
            setTimeout(() => {
                navigate('/'); 
                setTimeout(() => {
                    dispatch(openAuthModal('login')); 
                }, 100);
            }, 1000);
        } else {
            throw new Error(res.error || "Reset failed");
        }
    } catch (error) {
        addToast({ title: "Reset Failed", message: error.message || "Invalid Code", type: "error" });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 animate-fade-in-up">
        <Seo 
  title="Reset Password"
  description="Securely reset your account password and recover access to your SuperApp account."
  url="/reset-password"
  type="website"
/>
      
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="bg-white dark:bg-slate-900 w-full max-w-[420px] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 relative overflow-hidden z-10 transition-all">
        
        {/* Progress Bar (Optional Visual) */}
        <div className="absolute top-0 left-0 h-1 bg-slate-100 dark:bg-slate-800 w-full">
            <div 
                className="h-full bg-blue-600 transition-all duration-500" 
                style={{ width: step === 1 ? '50%' : '100%' }}
            />
        </div>

        {/* Header Icon */}
        <div className="text-center mb-8 mt-2">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-colors duration-500 shadow-lg shadow-blue-500/10
                ${step === 1 ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20'}`}>
                {step === 1 ? <Mail size={32} strokeWidth={1.5} /> : <KeyRound size={32} strokeWidth={1.5} />}
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {step === 1 ? "Forgot Password?" : "Secure Reset"}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 leading-relaxed px-4">
                {step === 1 
                    ? "Don't worry, it happens. Enter your email to receive recovery instructions." 
                    : `Enter the 6-digit code sent to ${email} and your new password.`}
            </p>
        </div>

        {/* STEP 1: EMAIL INPUT */}
        {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-6 animate-in slide-in-from-left-4 fade-in duration-300">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                            <Mail size={18} />
                        </div>
                        <input 
                            type="email" 
                            required
                            disabled={loading}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed placeholder:text-slate-400 text-sm font-medium"
                            placeholder="name@example.com"
                        />
                    </div>
                </div>

                <button 
                    disabled={loading} 
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-70 disabled:cursor-wait"
                >
                    {loading ? <Loader2 className="animate-spin" size={20}/> : <>Send Recovery Code <ArrowRight size={18}/></>}
                </button>

                <button 
                    type="button" 
                    disabled={loading}
                    onClick={() => {
                        navigate('/');
                        // Optional: Dispatch login modal if needed, or just go to home
                        setTimeout(() => dispatch(openAuthModal('login')), 100);
                    }} 
                    className="w-full text-center text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors py-2"
                >
                    Remember your password? Login
                </button>
            </form>
        )}

        {/* STEP 2: OTP & PASSWORD */}
        {step === 2 && (
            <form onSubmit={handleReset} className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                
                {/* OTP Input */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Verification Code</label>
                    <input 
                        type="text" 
                        required
                        disabled={loading}
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white text-center text-xl tracking-[0.6em] font-mono font-bold transition-all disabled:opacity-60 placeholder:text-slate-300 dark:placeholder:text-slate-700"
                        placeholder="000000"
                    />
                </div>

                {/* New Password Input */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">New Password</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                            <Lock size={18} />
                        </div>
                        <input 
                            type="password" 
                            required
                            disabled={loading}
                            value={newPass}
                            onChange={(e) => setNewPass(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white transition-all disabled:opacity-60 text-sm font-medium"
                            placeholder="Min 8 characters"
                        />
                    </div>
                </div>

                <button 
                    disabled={loading} 
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-70 disabled:cursor-wait"
                >
                    {loading ? <Loader2 className="animate-spin" size={20}/> : <>Reset Password <CheckCircle size={18}/></>}
                </button>
                
                {/* Footer Actions: Resend & Back */}
                <div className="flex items-center justify-between pt-2">
                    <button 
                        type="button" 
                        disabled={loading}
                        onClick={() => {
                            setStep(1);
                            setOtp('');
                            setNewPass('');
                        }} 
                        className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <ArrowLeft size={14}/> Change Email
                    </button>

                    <button 
                        type="button"
                        disabled={loading || timer > 0}
                        onClick={() => handleSendOtp(null)}
                        className={`text-xs font-bold flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors
                            ${timer > 0 
                                ? 'text-slate-400 cursor-not-allowed' 
                                : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer'}`}
                    >
                        {timer > 0 ? (
                            <>
                                <Timer size={14} className="animate-pulse" /> Resend in {timer}s
                            </>
                        ) : (
                            <>
                                <RefreshCw size={14} /> Resend Code
                            </>
                        )}
                    </button>
                </div>
            </form>
        )}

      </div>
    </div>
  );
}