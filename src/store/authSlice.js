import { createSlice } from "@reduxjs/toolkit";

const loadUserFromStorage = () => {
    try {
        const storedUser = localStorage.getItem("userData");
        return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
        return null;
    }
};

const savedUser = loadUserFromStorage();

const initialState = {
    status: !!savedUser,      
    mfaPending: false,  
    userData: savedUser,
    
    // UI State (Modal Control)
    isAuthModalOpen: false,
    authModalView: 'login' // 'login' | 'signup' | 'mfa'
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // --- Core Auth Logic ---
        login: (state, action) => {
            state.status = true;
            state.mfaPending = false; 
            state.userData = action.payload;
            // PERSIST: Save to LocalStorage
            localStorage.setItem("userData", JSON.stringify(action.payload));
        },
        
        // Partial Login for MFA
        setMfaRequired: (state, action) => {
            state.status = false;       
            state.mfaPending = true;    
            state.userData = action.payload; 
        },

        logout: (state) => {
            state.status = false;
            state.mfaPending = false;   
            state.userData = null;
            // PERSIST: Clear LocalStorage
            localStorage.removeItem("userData");
        },

        // --- UI Logic (Modal) ---
        openAuthModal: (state, action) => {
            state.isAuthModalOpen = true;
            state.authModalView = action.payload || 'login'; 
        },
        closeAuthModal: (state) => {
            state.isAuthModalOpen = false;
            state.authModalView = 'login'; 
        }
    }
});

export const { login, logout, setMfaRequired, openAuthModal, closeAuthModal } = authSlice.actions;

export default authSlice.reducer;