// src/utils/sound.js
import successSfx from '../assets/sounds/success.mp3'; // Ensure you have these files
import errorSfx from '../assets/sounds/error.mp3'; 

export const playSound = (type = 'success') => {
    // 1. Check if sound is enabled in LocalStorage
    const isSoundEnabled = JSON.parse(localStorage.getItem('pref_sound') || 'false');
    if (!isSoundEnabled) return;

    // 2. Play Sound (Simulated for now if no assets)
    // audio.play().catch(e => console.log("Audio play failed", e));
    
    console.log(`🎵 Playing ${type} sound effect`);
};