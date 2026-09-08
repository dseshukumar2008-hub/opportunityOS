import { createContext, useContext, useEffect, useMemo, useCallback } from 'react';
import { increment } from 'firebase/firestore';
import { useProfile } from './ProfileContext';
import { useAuth } from './AuthContext';

const SkillArcadeContext = createContext({});

export const useSkillArcade = () => useContext(SkillArcadeContext);

const DEFAULT_SKILL_ARCADE_STATE = {
  highScore: 0,
  gamesPlayed: 0,
  currentStreak: 0,
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
  const { profile, updateProfile, loading: profileLoading } = useProfile();
  const { user } = useAuth();
  
  const stats = profile?.skillArcade || DEFAULT_SKILL_ARCADE_STATE;

  // Check and reset Daily Challenge if a new calendar day has started
  useEffect(() => {
    if (profileLoading || !profile) return;
    
    const today = getTodayString();
    const currentChallengeDate = stats.dailyChallenge?.lastResetDate;

    if (currentChallengeDate !== today) {
      const updatedState = {
        ...stats,
        dailyChallenge: {
          lastResetDate: today,
          progress: 0,
          completed: false
        }
      };
      
      // Fire and forget
      updateProfile({ skillArcade: updatedState });
    }
  }, [stats.dailyChallenge?.lastResetDate, profileLoading, profile, updateProfile]);

  const saveGameState = useCallback(async (gameResult) => {
    // gameResult expects: { game: string, score: number, accuracy: string, isCorrectArray: [boolean] }
    const today = getTodayString();
    
    // Calculate new streak
    let newStreak = stats.currentStreak || 0;
    
    if (stats.lastPlayedDate) {
      const lastDateObj = new Date(stats.lastPlayedDate);
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

    const newHighScore = Math.max(stats.highScore || 0, gameResult.score || 0);
    const newGamesPlayed = (stats.gamesPlayed || 0) + 1;
    const newBestStreak = Math.max(stats.bestStreak || 0, newStreak);

    const recordId = gameResult.sessionId || Date.now().toString();

    // Protect against duplicate writes in Strict Mode or from re-renders
    if (stats.recentActivity?.some(activity => activity.id === recordId)) {
      return { earnedDailyReward: false, updatedState: stats };
    }

    const activityRecord = {
      id: recordId,
      userId: user?.uid || null,
      game: gameResult.game,
      score: gameResult.score,
      accuracy: gameResult.accuracy,
      streak: newStreak,
      playedOn: new Date().toISOString(),
      ...(gameResult.totalQuestions !== undefined && { totalQuestions: gameResult.totalQuestions }),
      ...(gameResult.questionsSolved !== undefined && { correctAnswers: gameResult.questionsSolved }),
      ...(gameResult.totalQuestions !== undefined && gameResult.questionsSolved !== undefined && { incorrectAnswers: gameResult.totalQuestions - gameResult.questionsSolved }),
      ...(gameResult.language && { language: gameResult.language }),
      ...(gameResult.difficulty && { difficulty: gameResult.difficulty }),
      ...(gameResult.status && { status: gameResult.status })
    };

    const newRecentActivity = [activityRecord, ...(stats.recentActivity || [])].slice(0, 50); // Keep last 50

    // Handle daily challenge (Answer 5 Career Questions)
    let newDailyProgress = stats.dailyChallenge?.progress || 0;
    let newDailyCompleted = stats.dailyChallenge?.completed || false;
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
      currentStreak: newStreak,
      bestStreak: newBestStreak,
      lastPlayedDate: new Date().toISOString(),
      recentActivity: newRecentActivity,
      dailyChallenge: {
        lastResetDate: stats.dailyChallenge?.lastResetDate || today,
        progress: newDailyProgress,
        completed: newDailyCompleted
      }
    };

    let xpToAdd = gameResult.score || 0;
    if (earnedDailyReward) {
      xpToAdd += 100;
    }

    let updateResult;
    if (xpToAdd > 0) {
      updateResult = await updateProfile({
        skillArcade: updatedState,
        xp: increment(xpToAdd)
      });
    } else {
      updateResult = await updateProfile({ skillArcade: updatedState });
    }

    if (updateResult.error) {
      throw updateResult.error;
    }

    return { earnedDailyReward, updatedState };
  }, [stats, updateProfile, profile, user]);

  const toggleSavedBugHunterQuestion = useCallback(async (questionId) => {
    if (!profile || !user) return;
    
    const currentSaved = stats.savedBugHunterQuestions || [];
    const isSaved = currentSaved.includes(questionId);
    
    let newSaved;
    if (isSaved) {
      newSaved = currentSaved.filter(id => id !== questionId);
    } else {
      newSaved = [...currentSaved, questionId];
    }
    
    await updateProfile({
      skillArcade: {
        ...stats,
        savedBugHunterQuestions: newSaved
      }
    });
  }, [stats, updateProfile, profile, user]);

  const value = useMemo(() => ({
    stats,
    saveGameState,
    toggleSavedBugHunterQuestion,
    isInitializing: profileLoading
  }), [stats, saveGameState, toggleSavedBugHunterQuestion, profileLoading]);

  return (
    <SkillArcadeContext.Provider value={value}>
      {children}
    </SkillArcadeContext.Provider>
  );
};
