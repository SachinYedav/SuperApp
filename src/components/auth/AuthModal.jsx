import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
    X, Mail, ArrowRight, Lock, Loader2, User, ShieldCheck, ArrowLeft, AlertCircle 
} from 'lucide-react';

import authService from '@/services/auth';
import { login as authLogin } from '@/store/authSlice';
import { useToast } from '@/context/ToastContext';

// --- SUB-COMPONENT: Google Icon ---
const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

export default function AuthModal({ isOpen, onClose, onSuccess, defaultView = 'login', initialChallengeId = null }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { addToast } = useToast();

    // UI States
    const [view, setView] = useState('login'); 
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // Data States
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [mfaCode, setMfaCode] = useState('');
    const [challengeId, setChallengeId] = useState(null);

    // --- 1. INITIALIZATION & LOGIC ---
    useEffect(() => {
        if (isOpen) {
            setView(defaultView);
            setFormData({ name: '', email: '', password: '' });
            setMfaCode('');
            setErrorMsg('');
            
            if (initialChallengeId) {
                console.log("✅ Using existing MFA Challenge ID:", initialChallengeId);
                setChallengeId(initialChallengeId); 
                setLoading(false);
            }
            else if (defaultView === 'mfa') {
                console.log("🔄 Auto-initializing MFA (New Challenge)...");
                setLoading(true);
                authService.createMfaChallenge()
                    .then(challenge => {
                        setChallengeId(challenge.$id);
                        setLoading(false);
                    })
                    .catch(async (err) => {
                        console.error("MFA Init Failed:", err);
                        await authService.logout(); 
                        onClose();
                        addToast({ title: "Session Expired", message: "Please login again.", type: "error" });
                    });
            }
        }
    }, [isOpen, defaultView, initialChallengeId]);

    if (!isOpen) return null;

    // --- HANDLERS ---
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrorMsg('');
    };

    // A. USER CANCEL 
    const handleUserCancel = async () => {
        onClose();
    };

    // B. GOOGLE LOGIN
    const handleGoogleLogin = async () => {
        try { await authService.googleLogin(); } 
        catch (error) { addToast({ title: "Error", message: "Google Login failed.", type: "error" }); }
    };

    // C. SUBMIT (Login/Signup)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            if (view === 'signup') {
                const user = await authService.createAccount(formData);
                if (user) {
                    dispatch(authLogin(user));
                    addToast({ title: "Welcome!", message: "Account created successfully.", type: "success" });
                    
                    if (onSuccess) onSuccess(); else onClose();
                }
            } else {
                // LOGIN
                await authService.login({ email: formData.email, password: formData.password });
                
                // Get User (May be null if MFA pending)
                const user = await authService.getCurrentUser();
                
                if (!user) {
                    // Profile Blocked -> Create Challenge -> Switch to MFA
                    try {
                        const challenge = await authService.createMfaChallenge();
                        setChallengeId(challenge.$id);
                        setView('mfa');
                    } catch (mfaError) {
                        await authService.logout();
                        throw new Error("Unable to initiate 2FA.");
                    }
                } 
                else if (user.mfa) {
                    // MFA Enabled Flag -> Switch to MFA
                    const challenge = await authService.createMfaChallenge();
                    setChallengeId(challenge.$id);
                    setView('mfa');
                } 
                else {
                    // Direct Success
                    dispatch(authLogin(user));
                    addToast({ title: "Welcome Back", message: `Signed in as ${user.name}`, type: "success" });
                    
                    if (onSuccess) onSuccess(); else onClose();
                }
            }
        } catch (error) {
            console.error(error);
            setErrorMsg(error.message || "Invalid credentials");
            // Only safety logout if we are stuck on login screen
            if (view === 'login' && !challengeId) await authService.logout();
        } finally {
            setLoading(false);
        }
    };

    // D. VERIFY MFA (The Success Path)
    const handleMfaVerify = async (e) => {
        e.preventDefault();
        if (mfaCode.length !== 6) return;
        
        setLoading(true);
        setErrorMsg('');
        
        try {
            console.log("🔐 Verifying Code...");
            await authService.verifyMfaChallenge(challengeId, mfaCode);
            
            // Now User is Verified -> Fetch Profile
            const user = await authService.getCurrentUser();
            if (!user) throw new Error("Verification successful but profile load failed.");

            // Redux Update
            dispatch(authLogin(user));
            addToast({ title: "Verified", message: "Login successful!", type: "success" });
            
            if (onSuccess) {
                onSuccess();
            } else {
                onClose();
            }

        } catch (error) {
            console.error("MFA Verify Error:", error);
            setErrorMsg("Invalid or expired code.");
            setMfaCode('');
        } finally {
            setLoading(false);
        }
    };

    // --- RENDER ---
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={handleUserCancel} />

            {/* Modal Card */}
            <div className="relative bg-white dark:bg-slate-950 w-full max-w-[440px] rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-scale-in">
                
                {/* Close Button */}
                <button 
                    onClick={handleUserCancel} 
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-20"
                >
                    <X size={20} />
                </button>

                {/* VIEW 1: LOGIN / SIGNUP */}
                {view !== 'mfa' && (
                    <div className="p-8 sm:p-10">
                        <div className="mb-8 text-center sm:text-left">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                                {view === 'login' ? 'Welcome Back' : 'Get Started'}
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                {view === 'login' ? 'Access your workspace and tools.' : 'Create your free account today.'}
                            </p>
                        </div>

                        {errorMsg && (
                            <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm animate-shake">
                                <AlertCircle size={18} />
                                <span>{errorMsg}</span>
                            </div>
                        )}

                        <button 
                            onClick={handleGoogleLogin}
                            className="w-full py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-700 dark:text-white flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all hover:shadow-sm mb-6 group"
                        >
                            <GoogleIcon />
                            <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Continue with Google</span>
                        </button>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
                            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">OR</span>
                            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {view === 'signup' && (
                                <div className="relative group animate-fade-in-up">
                                    <User className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                                    <input 
                                        type="text" name="name" placeholder="Full Name" 
                                        value={formData.name} onChange={handleInputChange} 
                                        className="w-full pl-11 p-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:text-white transition-all placeholder:text-slate-400" 
                                        required 
                                    />
                                </div>
                            )}

                            <div className="relative group">
                                <Mail className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                                <input 
                                    type="email" name="email" placeholder="Email Address" 
                                    value={formData.email} onChange={handleInputChange} 
                                    className="w-full pl-11 p-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:text-white transition-all placeholder:text-slate-400" 
                                    required 
                                />
                            </div>

                            <div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                                    <input 
                                        type="password" name="password" placeholder="Password" 
                                        value={formData.password} onChange={handleInputChange} 
                                        className="w-full pl-11 p-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:text-white transition-all placeholder:text-slate-400" 
                                        required 
                                    />
                                </div>
                                {view === 'login' && (
                                    <div className="flex justify-end mt-2">
                                        <button type="button" onClick={() => { onClose(); navigate('/reset-password'); }} className="text-xs font-bold text-blue-600 hover:text-blue-500 transition-colors">
                                            Forgot Password?
                                        </button>
                                    </div>
                                )}
                            </div>

                            <button 
                                disabled={loading} 
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20}/> : (view === 'login' ? 'Sign In' : 'Create Account')}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center text-sm text-slate-500 dark:text-slate-400">
                            {view === 'login' ? "New here? " : "Already joined? "}
                            <button onClick={() => setView(view === 'login' ? 'signup' : 'login')} className="font-bold text-blue-600 hover:text-blue-500 transition-colors ml-1">
                                {view === 'login' ? 'Create Account' : 'Log In'}
                            </button>
                        </div>
                    </div>
                )}

                {/* VIEW 2: MFA CHALLENGE */}
                {view === 'mfa' && (
                    <div className="p-8 sm:p-10 animate-slide-in-right">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                                <ShieldCheck size={40} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Security Check</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-[260px] mx-auto">
                                Enter the 6-digit code from your authenticator app.
                            </p>
                        </div>

                        {errorMsg && (
                            <div className="mb-6 text-center text-red-500 text-sm font-medium animate-shake">
                                {errorMsg}
                            </div>
                        )}

                        <form onSubmit={handleMfaVerify} className="space-y-6">
                            <div className="space-y-2">
                                <input 
                                    type="text" 
                                    maxLength={6}
                                    value={mfaCode}
                                    onChange={(e) => {
                                        setMfaCode(e.target.value.replace(/\D/g, ''));
                                        setErrorMsg('');
                                    }}
                                    autoFocus
                                    placeholder="000 000"
                                    className="w-full text-center text-4xl tracking-[0.4em] font-mono py-5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none dark:text-white transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                />
                            </div>

                            <button disabled={loading || mfaCode.length !== 6} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all disabled:opacity-50">
                                {loading ? <Loader2 className="animate-spin" size={20}/> : <>Verify Login <ArrowRight size={18}/></>}
                            </button>
                        </form>

                        <button onClick={handleUserCancel} className="w-full mt-8 flex items-center justify-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                            <ArrowLeft size={16}/> Cancel & Logout
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}