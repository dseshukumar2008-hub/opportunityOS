import { useMemo } from 'react';
import { useUserProfile } from './useUserProfile';
import { useResumeInsights } from './useResumeInsights';
import { useCareer } from '../contexts/CareerContext';
import { calculateAggregatedReadiness } from '../utils/scoringAggregator';
import { calculateProfileCompletion } from '../utils/userUtils';

export function useCareerReadiness() {
  const { profile } = useUserProfile();
  const { hasInsights, atsScore } = useResumeInsights();
  const { careerContext } = useCareer();

  const readinessData = useMemo(() => {
    // Calculate profile completion percentage locally for the hook
    const hasResumeForCompletion = !!profile?.resume || hasInsights;
    const { percentage: profileCompletionPct } = calculateProfileCompletion(profile, hasResumeForCompletion);

    const githubScore = profile?.githubAnalysis?.githubScore || careerContext?.githubScore || 0;
    const linkedinScore = careerContext?.linkedinScore || 0;

    const { score, status, breakdown } = calculateAggregatedReadiness({
      profileCompletionPct,
      hasResume: hasResumeForCompletion,
      atsScore: (hasInsights && typeof atsScore === 'number') ? atsScore : 0,
      githubScore,
      linkedinScore
    });

    return { 
      score, 
      status, 
      breakdown, 
      insights: [], 
      history: [] 
    };
  }, [profile, hasInsights, atsScore, careerContext]);

  return readinessData;
}
