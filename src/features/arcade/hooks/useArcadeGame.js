import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import databaseService from '@/services/database'; 
// import { useToast } from '@/context/ToastContext'; 

export default function useArcadeGame(gameId) {
    // const { addToast } = useToast();
    const userData = useSelector((state) => state.auth.userData);
    
    const [gameState, setGameState] = useState('idle'); // idle | playing | gameOver | waiting
    const [score, setScore] = useState(0);
    const [isSaving, setIsSaving] = useState(false);

    const startGame = () => {
        setScore(0);
        setGameState('playing');
    };

    const endGame = useCallback(async (finalScore) => {
        setScore(finalScore);
        setGameState('gameOver');

        if (userData) {
            setIsSaving(true);
            try {
                // Database save logic
                await databaseService.saveHighScore({
                    userId: userData.$id,
                    userName: userData.name,
                    gameId: gameId,
                    score: finalScore
                });
                console.log("Score Saved:", finalScore);
            } catch (error) {
                console.error("Failed to save score", error);
            } finally {
                setIsSaving(false);
            }
        }
    }, [userData, gameId]);

    return { 
        gameState, 
        setGameState, 
        score, 
        setScore, 
        startGame, 
        endGame, 
        isSaving 
    };
}