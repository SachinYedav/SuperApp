import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Loader2 } from 'lucide-react';

import { login, logout, setMfaRequired } from '@/store/authSlice';
import authService from '@/services/auth';
import useOnlineStatus from '@/hooks/useOnlineStatus'; 

import AuthModal from '@/components/auth/AuthModal';
import AppRoutes from '@/routes/AppRoutes';
import InstallPrompt from '@/components/pwa/InstallPrompt';
import { SpeedInsights } from "@vercel/speed-insights/react";

export default function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  // Local Modal State
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState('login');
  
  // Challenge ID to avoid duplicate creation
  const [pendingChallengeId, setPendingChallengeId] = useState(null);

  // Online Status Check 
  const isOnline = useOnlineStatus();
  
  // Lock for Strict Mode
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const checkUserSession = async () => {
      if (!navigator.onLine) {
         console.log("⚠️ Offline Mode: Skipping Session Check");
         setLoading(false);
         return;
      }

      try {
        console.log("🕵️ Checking User Session...");
        
        const user = await authService.getCurrentUser();

        if (user) {
          // --- GATEKEEPER LOGIC (MFA Check) ---
          if (user.mfa) {
             const session = await authService.getCurrentSession();
             const factors = session?.factors || [];
             const hasTotp = factors.includes('totp');

             if (!hasTotp) {
                 console.log("🚨 OAuth MFA Pending Detected! (Gatekeeper)");
                 
                 try {
                     const challenge = await authService.createMfaChallenge();
                     console.log("🔐 Challenge Created:", challenge.$id);
                     
                     setPendingChallengeId(challenge.$id);
                     
                     dispatch(setMfaRequired(user));

                     // UI: Show MFA Modal
                     setAuthView('mfa');
                     setAuthModalOpen(true);
                 } catch(e) {
                     console.error("MFA Challenge Error:", e);
                     dispatch(logout()); 
                 }
                 setLoading(false);
                 return; 
             }
          }
          // --- END GATEKEEPER ---

          console.log("✅ User Fully Verified");
          dispatch(login(user));
        
        } else {
           dispatch(logout());
        }

      } catch (error) {
        console.error("Auth Check Error:", error);
        
        if (error.message && (error.message.includes('Network request failed') || error.message.includes('offline'))) {
             console.log("⚠️ Network Error during Auth Check. Keeping existing session.");
             setLoading(false);
             return;
        }
        
        // Handle 401 (Session valid but needs MFA)
        if (error.code === 401) {
             console.log("🔒 401 Detected - Trying MFA Recovery...");
             try {
                 const challenge = await authService.createMfaChallenge();
                 setPendingChallengeId(challenge.$id);
                 
                 dispatch(setMfaRequired({ name: 'User' })); 

                 setAuthView('mfa');
                 setAuthModalOpen(true);
                 setLoading(false);
                 return;
             } catch(e) {
                 console.warn("MFA recovery failed:", e.message);
                 dispatch(logout());
             }
        } else {
            dispatch(logout());
        }
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();
  }, [dispatch]); 

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-900">
        <Loader2 size={48} className="animate-spin text-blue-600 mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Initializing Workspace...</p>
      </div>
    );
  }

  return (
    <>
    <SpeedInsights />
    
      <AuthModal 
        isOpen={isAuthModalOpen} 
        
        onSuccess={() => {
            console.log("🎉 MFA Verified! Access Granted.");
            setAuthModalOpen(false);
            setPendingChallengeId(null);
            setAuthView('login');
        }}

        onClose={() => {
            console.log("❌ Modal Closed by User");
            if (authView === 'mfa') {
                console.log("🔒 Security Logout triggered");
                authService.logout().then(() => dispatch(logout()));
            }
            setAuthModalOpen(false);
            setPendingChallengeId(null);
        }}
        
        defaultView={authView}
        initialChallengeId={pendingChallengeId} 
      />
      <InstallPrompt />
      <AppRoutes />
    </>
  );
}