import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

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

  const applyAnalysisData = useCallback((saved) => {
    if (saved?.analysis) {
      const a = saved.analysis;
      const parsedScore = parseInt(a.atsScore, 10);
      const score = !isNaN(parsedScore) ? parsedScore : null;
      setAtsScore(score);
      setTopStrength(a.strengths?.[0] || null);
      setTopWeakness(a.weaknesses?.[0] || null);
      setMissingSkills(a.missingKeywords?.slice(0, 3) || []);

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
  }, []);
  useEffect(() => {
    if (!user?.id) {
// eslint-disable-next-line react-hooks/set-state-in-effect
      setHasInsights(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const docRef = doc(db, 'users', user.id);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const saved = {
          analysis: data.resumeAnalysis || null,
          resume: data.resume || null
        };
        applyAnalysisData(saved);
      } else {
        setHasInsights(false);
      }
      setIsLoading(false);
    }, (err) => {
      console.error('useResumeInsights Real-time Fetch Error:', err);
      setHasInsights(false);
      setIsLoading(false);
    });

    return () => unsubscribe();
// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);



  const loadInsights = useCallback(() => {
    // No-op for backwards compatibility, handled by onSnapshot
  }, []);

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
