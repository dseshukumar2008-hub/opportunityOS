import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

const INITIAL_HISTORY = [];

const loadHistory = (key) => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        // Filter out malformed records (e.g. missing averageMatchScore which would cause UI crashes)
        return parsed.filter(item => 
          item && 
          item.id && 
          typeof item.averageMatchScore === 'number'
        );
      }
    }
    return INITIAL_HISTORY;
  } catch (err) {
    console.warn('Failed to parse recommendation history from local storage:', err);
    return INITIAL_HISTORY;
  }
};

export function useRecommendationHistory() {
  const { user } = useAuth();
  const storageKey = user?.id ? `oppOs_recHistory_${user.id}` : 'oppOs_recHistory_anonymous';

  const [history, setHistory] = useState(() => loadHistory(storageKey));
  const [prevStorageKey, setPrevStorageKey] = useState(storageKey);

  if (storageKey !== prevStorageKey) {
    setPrevStorageKey(storageKey);
    setHistory(loadHistory(storageKey));
  }

  const saveHistory = useCallback((newHistory) => {
    setHistory(newHistory);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newHistory));
    } catch (err) {
      console.warn('Failed to save recommendation history to local storage:', err);
    }
  }, [storageKey]);

  const addSnapshot = useCallback((averageMatchScore, topRecommendation, recommendationCount) => {
    setHistory(prevHistory => {
      const lastSnapshot = prevHistory[prevHistory.length - 1];
      const topRecId = topRecommendation.id || 'opp-custom';
      
      // Only add if there's a meaningful change (e.g., score went up or top rec changed)
      if (
        lastSnapshot && 
        lastSnapshot.averageMatchScore === averageMatchScore && 
        lastSnapshot.topRecommendationId === topRecId
      ) {
        return prevHistory; // No snapshot needed
      }

      const improvements = [];
      const skillsAdded = [];
      const skillsMissing = [];
      
      const topRecTitle = topRecommendation.title || topRecommendation;
      
      if (lastSnapshot) {
        if (averageMatchScore > lastSnapshot.averageMatchScore) {
          improvements.push('Improved overall match scores');
        } else {
          improvements.push('Updated baseline snapshot');
        }
        
        if (topRecId !== lastSnapshot.topRecommendationId) {
          improvements.push(`Unlocked higher match for ${topRecTitle}`);
        }
      } else {
        improvements.push('Initial baseline established');
      }

      const currentAts = lastSnapshot ? lastSnapshot.atsScore : 70;
      const currentApps = lastSnapshot ? lastSnapshot.applicationsSubmitted : 0;
      const currentGoals = lastSnapshot ? lastSnapshot.goalsCompleted : 0;

      const newSnapshot = {
        id: `snap-${Date.now()}`,
        date: new Date().toISOString(),
        averageMatchScore,
        atsScore: currentAts,
        topRecommendation: topRecTitle,
        topRecommendationId: topRecId,
        recommendationCount: recommendationCount || 1,
        improvements,
        skillsAdded,
        skillsMissing,
        applicationsSubmitted: currentApps,
        goalsCompleted: currentGoals,
        matchBreakdown: { 
          skills: Math.round(averageMatchScore * 1.02), 
          experience: Math.round(averageMatchScore * 0.95), 
          formatting: Math.round(averageMatchScore * 1.08) 
        },
        recommendedRoles: [
          { role: topRecTitle, score: averageMatchScore, type: 'Internship' },
          { role: 'Frontend Developer', score: Math.max(50, averageMatchScore - 5), type: 'Full-time' }
        ]
      };

      const newHistory = [...prevHistory, newSnapshot];
      
      try {
        localStorage.setItem(storageKey, JSON.stringify(newHistory));
      } catch (err) {
        console.warn('Failed to save recommendation history to local storage:', err);
      }
      
      return newHistory;
    });
    
    return true;
  }, [storageKey]);

  const clearHistory = useCallback(() => {
    saveHistory(INITIAL_HISTORY);
  }, [saveHistory]);

  return {
    history,
    addSnapshot,
    clearHistory
  };
}
