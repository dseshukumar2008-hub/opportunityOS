import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { resumeStorageService } from '../services/resumeStorageService';

/**
 * Reads the persisted resume analysis from Firestore and exposes
 * structured insights for the dashboard widget.
 */
export function useResumeInsights() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [atsScore, setAtsScore] = useState(null);
  const [topStrength, setTopStrength] = useState(null);
  const [topWeakness, setTopWeakness] = useState(null);
  const [missingSkills, setMissingSkills] = useState([]);
  const [nextAction, setNextAction] = useState(null);
  const [storedResumeName, setStoredResumeName] = useState(null);
  const [hasInsights, setHasInsights] = useState(false);



  const loadInsights = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const saved = await resumeStorageService.getAnalysisFromFirestore(user.id);

      if (saved?.analysis) {
        const a = saved.analysis;
        const score = typeof a.atsScore === 'number' ? a.atsScore : null;
        setAtsScore(score);
        setTopStrength(a.strengths?.[0] || null);
        setTopWeakness(a.weaknesses?.[0] || null);
        setMissingSkills(a.missingKeywords?.slice(0, 3) || []);

        // Generate a concise next action from improvements or recommendations
        const highPriority = a.improvements?.find(i => i.priority === 'HIGH');
        if (highPriority) {
          setNextAction(highPriority.description);
        } else if (a.recommendedSkills?.length > 0) {
          setNextAction(`Build a project using ${a.recommendedSkills[0]} to strengthen your profile.`);
        } else {
          setNextAction('Add quantifiable metrics to your experience section to improve your ATS score.');
        }

        setHasInsights(true);
      } else {
        setHasInsights(false);
      }

      if (saved?.resume?.fileName) {
        setStoredResumeName(saved.resume.fileName);
      }
    } catch (err) {
      console.error('useResumeInsights error:', err);
      setHasInsights(false);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadInsights();
  }, [loadInsights]);

  return {
    isLoading,
    hasInsights,
    atsScore,
    topStrength,
    topWeakness,
    missingSkills,
    nextAction,
    storedResumeName,
    reload: loadInsights
  };
}
