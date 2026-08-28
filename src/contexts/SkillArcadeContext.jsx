import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useProfile } from './ProfileContext';

const SkillArcadeContext = createContext({});

export const useSkillArcade = () => useContext(SkillArcadeContext);

const DEFAULT_SKILL_ARCADE_STATE = {
  highScore: 0,
  gamesPlayed: 0,
  bestStreak: 0,
  lastPlayedDate: null,
  recentActivity: [],
  dailyChallenge: {
    lastResetDate: null,
    progress: 0,
    completed: false
  }
};

const getTodayString = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const SkillArcadeProvider = ({ children }) => {
  const { profile, updateProfile } = useProfile();
  const [localState, setLocalState] = useState(DEFAULT_SKILL_ARCADE_STATE);
  const [isInitializing, setIsInitializing] = useState(true);

  // Sync with profile on load
  useEffect(() => {
    if (profile) {
      if (profile.skillArcade) {
        setLocalState(profile.skillArcade);
      }
      setIsInitializing(false);
    } else {
      setLocalState(DEFAULT_SKILL_ARCADE_STATE);
    }
  }, [profile]);

  // Check and reset Daily Challenge if a new calendar day has started
  useEffect(() => {
    if (isInitializing || !profile) return;
    
    const today = getTodayString();
    const safeState = localState || DEFAULT_SKILL_ARCADE_STATE;
    const currentChallengeDate = safeState.dailyChallenge?.lastResetDate;

    if (currentChallengeDate !== today) {
      const updatedState = {
        ...safeState,
        dailyChallenge: {
          lastResetDate: today,
          progress: 0,
          completed: false
        }
      };
      setLocalState(updatedState);
      
      // We do not await this, just fire and forget to sync backend
      updateProfile({ skillArcade: updatedState });
    }
  }, [localState, isInitializing, profile, updateProfile]);

  const saveGameState = useCallback(async (gameResult) => {
    // gameResult expects: { game: string, score: number, accuracy: string, isCorrectArray: [boolean] }
    const today = getTodayString();
    const safeState = localState || DEFAULT_SKILL_ARCADE_STATE;
    
    // Calculate new streak
    let newStreak = safeState.bestStreak || 0;
    
    if (safeState.lastPlayedDate) {
      const lastDateObj = new Date(safeState.lastPlayedDate);
      const lastDate = `${lastDateObj.getFullYear()}-${String(lastDateObj.getMonth() + 1).padStart(2, '0')}-${String(lastDateObj.getDate()).padStart(2, '0')}`;
      
      if (lastDate === today) {
        // already played today, streak remains the same
      } else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
        
        if (lastDate === yesterdayStr) {
          newStreak += 1;
        } else {
          newStreak = 1; // broken streak
        }
      }
    } else {
      newStreak = 1; // first game ever
    }

    const newHighScore = Math.max(safeState.highScore || 0, gameResult.score || 0);
    const newGamesPlayed = (safeState.gamesPlayed || 0) + 1;

    const activityRecord = {
      id: Date.now().toString(),
      game: gameResult.game,
      score: gameResult.score,
      accuracy: gameResult.accuracy,
      streak: newStreak,
      playedOn: new Date().toISOString()
    };

    const newRecentActivity = [activityRecord, ...(safeState.recentActivity || [])].slice(0, 50); // Keep last 50

    // Handle daily challenge (Answer 5 Career Questions)
    let newDailyProgress = safeState.dailyChallenge?.progress || 0;
    let newDailyCompleted = safeState.dailyChallenge?.completed || false;
    let earnedDailyReward = false;

    if (gameResult.game === 'Career Quiz' && !newDailyCompleted) {
       // Just count the number of answered questions. If they answered 5, they get it.
       const questionsAnswered = (gameResult.isCorrectArray || []).length;
       newDailyProgress = Math.min(5, newDailyProgress + questionsAnswered);
       
       if (newDailyProgress >= 5) {
         newDailyCompleted = true;
         earnedDailyReward = true; // Needs XP allocation logic later
       }
    }

    const updatedState = {
      highScore: newHighScore,
      gamesPlayed: newGamesPlayed,
      bestStreak: newStreak,
      lastPlayedDate: new Date().toISOString(),
      recentActivity: newRecentActivity,
      dailyChallenge: {
        lastResetDate: safeState.dailyChallenge?.lastResetDate || today,
        progress: newDailyProgress,
        completed: newDailyCompleted
      }
    };

    setLocalState(updatedState);
    await updateProfile({ skillArcade: updatedState });

    // Handle XP reward if earned
    if (earnedDailyReward) {
      await updateProfile({ xp: (profile?.xp || 0) + 100 });
    }

    return { earnedDailyReward, updatedState };
  }, [localState, updateProfile, profile]);

  const value = useMemo(() => ({
    stats: localState || DEFAULT_SKILL_ARCADE_STATE,
    saveGameState,
    isInitializing
  }), [localState, saveGameState, isInitializing]);

  return (
    <SkillArcadeContext.Provider value={value}>
      {children}
    </SkillArcadeContext.Provider>
  );
};
