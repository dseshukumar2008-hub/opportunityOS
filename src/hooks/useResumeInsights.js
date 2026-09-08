import { useCallback, useMemo } from 'react';
import { useProfile } from '../contexts/ProfileContext';

export function useResumeInsights() {
  const { profile, loading: isLoading } = useProfile();

  // No-op for backwards compatibility — data is now live via ProfileContext
  const loadInsights = useCallback(() => {}, []);

  const analysis = profile?.resumeAnalysis || null;
  const resume = profile?.resume || null;

  const hasInsights = !!analysis;

  const atsScore = useMemo(() => {
    if (!analysis?.atsScore) return null;
    const parsedScore = parseInt(analysis.atsScore, 10);
    return !isNaN(parsedScore) ? parsedScore : null;
  }, [analysis]);

  const topStrength = analysis?.strengths?.[0] || null;
  const topWeakness = analysis?.weaknesses?.[0] || null;
  const missingSkills = useMemo(() => analysis?.missingKeywords?.slice(0, 3) || [], [analysis]);

  const nextAction = useMemo(() => {
    if (!analysis) return null;
    const highPriority = analysis.improvements?.find(i => i.priority === 'HIGH');
    if (highPriority) return highPriority.description;
    if (analysis.recommendedSkills?.length > 0) {
      return `Build a project using ${analysis.recommendedSkills[0]} to strengthen your profile.`;
    }
    return 'Add quantifiable metrics to your experience section to improve your ATS score.';
  }, [analysis]);

  const storedResumeName = resume?.fileName || null;

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
