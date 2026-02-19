import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import databaseService from '@/services/database';
import { useToast } from '@/context/ToastContext';

export default function useGameEngine(gameId) {
    const userData = useSelector((state) => state.auth.userData);
    const { addToast } = useToast();
    
    const [gameState, setGameState] = useState('idle'); 
    const [score, setScore] = useState(0);
    const [isSaving, setIsSaving] = useState(false);

    const startGame = () => {
        setGameState('playing');
        setScore(0);
    };

    const endGame = useCallback(async (finalScore) => {
        setScore(finalScore);
        setGameState('gameOver');

        // Logic: Save only if logged in
        if (userData) {
            setIsSaving(true);
            try {
                await databaseService.saveHighScore({
                    userId: userData.$id,
                    userName: userData.name,
                    userAvatar: '', 
                    gameId: gameId,
                    score: finalScore
                });
                addToast({ message: "Score Saved to Leaderboard!", type: "success" });
            } catch (error) {
                addToast({ message: "Failed to save score", type: "error" });
            } finally {
                setIsSaving(false);
            }
        }
    }, [userData, gameId, addToast]);

    return { gameState, setGameState, score, startGame, endGame, isSaving, userData };
}