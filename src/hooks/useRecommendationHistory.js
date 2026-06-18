import { useState, useCallback } from 'react';

const STORAGE_KEY = 'oppOs_recHistory';

const INITIAL_MOCK_HISTORY = [];

export function useRecommendationHistory() {
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      } else {
        // Initialize with mock history to demonstrate timeline
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_HISTORY));
        return INITIAL_MOCK_HISTORY;
      }
    } catch {
      return INITIAL_MOCK_HISTORY;
    }
  });

  const saveHistory = useCallback((newHistory) => {
    setHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  }, []);

  const addSnapshot = useCallback((averageMatchScore, topRecommendation, recommendationCount) => {
    const lastSnapshot = history[history.length - 1];
    
    // Only add if there's a meaningful change (e.g., score went up or top rec changed)
    if (
      lastSnapshot && 
      lastSnapshot.averageMatchScore === averageMatchScore && 
      lastSnapshot.topRecommendationId === topRecommendation.id
    ) {
      return false; // No snapshot needed
    }

    // Determine simulated improvements based on score changes
    const improvements = [];
    const skillsAdded = [];
    const skillsMissing = ['GraphQL', 'Docker', 'AWS'];
    
    if (lastSnapshot) {
      if (averageMatchScore > lastSnapshot.averageMatchScore) {
        improvements.push('Improved overall match scores');
        
        // Randomly simulate reasons for the jump
        const possibleReasons = [
          'Added missing skills to resume',
          'Improved ATS resume layout score',
          'Completed professional certifications',
          'Increased user profile completeness',
          'Participated in collaborative team projects'
        ];
        improvements.push(possibleReasons[Math.floor(Math.random() * possibleReasons.length)]);
        skillsAdded.push('Advanced JavaScript', 'Tailwind CSS');
      } else {
        improvements.push('Updated baseline snapshot');
      }
      
      if (topRecommendation.id !== lastSnapshot.topRecommendationId) {
        improvements.push(`Unlocked higher match for ${topRecommendation.title || topRecommendation}`);
      }
    } else {
      improvements.push('Initial baseline established');
    }

    const currentAts = lastSnapshot ? Math.min(95, lastSnapshot.atsScore + 4) : 70;
    const currentApps = lastSnapshot ? lastSnapshot.applicationsSubmitted + 1 : 1;
    const currentGoals = lastSnapshot ? lastSnapshot.goalsCompleted + 1 : 1;

    const newSnapshot = {
      id: `snap-${Date.now()}`,
      date: new Date().toISOString(),
      averageMatchScore,
      atsScore: currentAts,
      topRecommendation: topRecommendation.title || topRecommendation,
      topRecommendationId: topRecommendation.id || 'opp-custom',
      recommendationCount,
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
        { role: topRecommendation.title || topRecommendation, score: averageMatchScore, type: 'Internship' },
        { role: 'Frontend Developer', score: Math.max(50, averageMatchScore - 5), type: 'Full-time' }
      ]
    };

    saveHistory([...history, newSnapshot]);
    return true;
  }, [history, saveHistory]);

  const clearHistory = useCallback(() => {
    saveHistory(INITIAL_MOCK_HISTORY);
  }, [saveHistory]);

  return {
    history,
    addSnapshot,
    clearHistory
  };
}
