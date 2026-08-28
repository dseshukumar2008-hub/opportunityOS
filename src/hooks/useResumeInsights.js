import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export function useResumeInsights() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [savedData, setSavedData] = useState({ analysis: null, resume: null });

  useEffect(() => {
    if (!user?.id) {
      setSavedData({ analysis: null, resume: null });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const docRef = doc(db, 'users', user.id);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSavedData({
          analysis: data.resumeAnalysis || null,
          resume: data.resume || null
        });
      } else {
        setSavedData({ analysis: null, resume: null });
      }
      setIsLoading(false);
    }, (err) => {
      console.error('useResumeInsights Real-time Fetch Error:', err);
      setSavedData({ analysis: null, resume: null });
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user?.id]);

  const loadInsights = useCallback(() => {
    // No-op for backwards compatibility, handled by onSnapshot
  }, []);

  const hasInsights = !!savedData.analysis;

  const atsScore = useMemo(() => {
    if (!savedData.analysis?.atsScore) return null;
    const parsedScore = parseInt(savedData.analysis.atsScore, 10);
    return !isNaN(parsedScore) ? parsedScore : null;
  }, [savedData.analysis]);

  const topStrength = savedData.analysis?.strengths?.[0] || null;
  const topWeakness = savedData.analysis?.weaknesses?.[0] || null;
  const missingSkills = useMemo(() => savedData.analysis?.missingKeywords?.slice(0, 3) || [], [savedData.analysis]);

  const nextAction = useMemo(() => {
    const a = savedData.analysis;
    if (!a) return null;
    
    const highPriority = a.improvements?.find(i => i.priority === 'HIGH');
    if (highPriority) {
      return highPriority.description;
    } else if (a.recommendedSkills?.length > 0) {
      return `Build a project using ${a.recommendedSkills[0]} to strengthen your profile.`;
    }
    return 'Add quantifiable metrics to your experience section to improve your ATS score.';
  }, [savedData.analysis]);

  const storedResumeName = savedData.resume?.fileName || null;

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
