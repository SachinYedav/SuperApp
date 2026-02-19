import React, { useEffect, useState } from 'react';
import { Trophy, Crown, Loader2, WifiOff } from 'lucide-react';
import databaseService from '@/services/database';
import UserAvatar from '@/components/ui/UserAvatar';
import useOnlineStatus from '@/hooks/useOnlineStatus'; 
import { ARCADE_GAMES } from '../constants';
import { cn } from '@/utils/cn';

export default function LeaderboardView() {
    const [selectedGameId, setSelectedGameId] = useState(ARCADE_GAMES[0].id);
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // 1. Hook for Reactive UI updates
    const isOnline = useOnlineStatus();

    const activeGameConfig = ARCADE_GAMES.find(g => g.id === selectedGameId);

    useEffect(() => {
        const fetchScores = async () => {
            if (!navigator.onLine) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setScores([]); 

            try {
                const response = await databaseService.getLeaderboard(selectedGameId);
                if (response?.documents) {
                    setScores(response.documents);
                }
            } catch (error) {
                console.error("Leaderboard Error:", error);
            } finally {
                setLoading(false);
            }
        };

        if (isOnline) {
            fetchScores();
        } else {
            setLoading(false);
        }
    }, [selectedGameId, isOnline]);

    return (
        <div className="w-full max-w-4xl mx-auto h-full flex flex-col animate-fade-in relative z-10">
            
            {/* Header Section */}
            <div className="text-center mb-6 shrink-0">
                <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
                    <Trophy className="text-yellow-500" fill="currentColor" /> Hall of Fame
                </h2>
                <p className="text-slate-400 text-sm mt-1">Top players across the world</p>
            </div>

            {/* Game Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar justify-start md:justify-center shrink-0">
                {ARCADE_GAMES.map(game => (
                    <button
                        key={game.id}
                        onClick={() => setSelectedGameId(game.id)}
                        className={cn(
                            "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-2",
                            selectedGameId === game.id 
                                ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-500/20' 
                                : 'bg-slate-900/50 text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-slate-200'
                        )}
                    >
                        <game.icon size={14}/> {game.label}
                    </button>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-0">
                {/* 3. Offline State UI */}
                {!isOnline ? (
                     <div className="flex-1 flex flex-col items-center justify-center text-slate-500 bg-slate-900/30 rounded-3xl border border-slate-800/50 p-10 m-4 animate-in fade-in">
                        <div className="bg-slate-800 p-4 rounded-full mb-4">
                            <WifiOff size={32} className="text-slate-400" />
                        </div>
                        <p className="font-bold text-lg text-slate-300">You are offline</p>
                        <p className="text-sm opacity-70 mt-1">Connect to the internet to view rankings.</p>
                    </div>
                ) : loading ? (
                    <div className="flex-1 flex items-center justify-center text-purple-500">
                        <Loader2 size={40} className="animate-spin" />
                    </div>
                ) : scores.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-500 bg-slate-900/30 rounded-3xl border border-slate-800/50 p-10 m-4">
                        <Trophy size={64} className="mb-4 opacity-20" />
                        <p className="font-medium">No champions yet.</p>
                        <p className="text-sm opacity-70">Be the first to set a record!</p>
                    </div>
                ) : (
                    <div className="flex flex-col h-full">
                        
                        {/* PODIUM (Top 3) */}
                        <div className="flex-1 flex items-end justify-center pb-8 min-h-[250px]">
                            <div className="flex items-end gap-3 sm:gap-6 md:gap-8">
                                {/* 2nd Place */}
                                {scores[1] && <PodiumCard rank={2} data={scores[1]} unit={activeGameConfig.unit} color="from-slate-400/20" border="border-slate-400/50" />}
                                
                                {/* 1st Place */}
                                {scores[0] && <PodiumCard rank={1} data={scores[0]} unit={activeGameConfig.unit} color="from-yellow-500/20" border="border-yellow-400/50" isWinner />}
                                
                                {/* 3rd Place */}
                                {scores[2] && <PodiumCard rank={3} data={scores[2]} unit={activeGameConfig.unit} color="from-orange-500/20" border="border-orange-400/50" />}
                            </div>
                        </div>

                        {/* LIST (Rank 4+) */}
                        {scores.length > 3 && (
                            <div className="bg-slate-900/60 backdrop-blur-md rounded-t-3xl border-t border-x border-slate-800 p-2 overflow-y-auto max-h-[30vh] custom-scrollbar">
                                {scores.slice(3).map((score, index) => (
                                    <div key={score.$id} className="flex items-center justify-between p-3 sm:p-4 rounded-xl hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 last:mb-0 mb-1">
                                        <div className="flex items-center gap-4">
                                            <span className="font-mono font-bold text-slate-500 w-6 text-center text-sm">{index + 4}</span>
                                            <UserAvatar user={{ name: score.userName }} size="sm" />
                                            <span className="font-bold text-slate-300 text-sm sm:text-base">{score.userName}</span>
                                        </div>
                                        <span className="font-mono font-bold text-purple-400 text-sm">{score.score} <span className="text-[10px] text-slate-600 uppercase">{activeGameConfig.unit}</span></span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// Sub-Component: Podium Card
function PodiumCard({ rank, data, unit, color, border, isWinner }) {
    return (
        <div className={cn("flex flex-col items-center animate-scale-in relative", isWinner ? "z-10 -mt-4" : "delay-100")}>
            {/* Avatar & Crown */}
            <div className="relative mb-3">
                <UserAvatar 
                    user={{ name: data.userName }} 
                    size={isWinner ? "lg" : "md"} 
                    className={cn(
                        "border-4 shadow-lg", 
                        isWinner ? "border-yellow-400 w-16 h-16 sm:w-20 sm:h-20" : "border-slate-600 w-12 h-12 sm:w-14 sm:h-14"
                    )} 
                />
                {isWinner && <Crown size={28} className="absolute -top-8 left-1/2 -translate-x-1/2 text-yellow-400 fill-yellow-400 animate-bounce drop-shadow-lg" />}
            </div>

            {/* The Bar */}
            <div className={cn(
                "w-20 sm:w-28 rounded-t-2xl border-t border-x flex flex-col items-center justify-end pb-4 relative shadow-2xl backdrop-blur-sm bg-gradient-to-t to-transparent", 
                color, 
                border, 
                isWinner ? "h-48 sm:h-56" : rank === 2 ? "h-36 sm:h-40" : "h-24 sm:h-28"
            )}>
                {/* User Info inside bar */}
                <span className="text-slate-200 font-bold text-xs truncate w-full text-center px-1 mb-1">{data.userName}</span>
                <span className="text-white font-mono font-black text-lg">{data.score} <span className="text-[10px] opacity-70 uppercase">{unit}</span></span>
                
                {/* Big Rank Number Background */}
                <div className="absolute top-2 text-white font-black text-4xl opacity-10 select-none">{rank}</div>
            </div>
        </div>
    );
}