import { useSkillArcade } from '../../../contexts/SkillArcadeContext';

export function useGameCompletion() {
  const { saveGameState, stats } = useSkillArcade();

  const handleGameCompletion = async (gameResult, isMounted) => {
    const prevHighScore = stats?.highScore || 0;
    
    // For Career Quiz, saveGameState returns earnedDailyReward
    const { updatedState, earnedDailyReward } = await saveGameState(gameResult);

    if (isMounted.current) {
      return {
        ...gameResult,
        streak: updatedState?.bestStreak || 0,
        isNewHighScore: gameResult.score > prevHighScore && gameResult.score > 0,
        xpEarned: gameResult.score,
        earnedDailyReward
      };
    }
    return null;
  };

  return { handleGameCompletion };
}
