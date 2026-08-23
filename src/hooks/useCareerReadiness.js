import { useMemo } from 'react';
import { useUserProfile } from './useUserProfile';
import { useResumeInsights } from './useResumeInsights';
import { useMatchResume } from './useMatchResume';
import { useCareer } from '../contexts/CareerContext';
import { calculateAggregatedReadiness } from '../utils/scoringAggregator';

export function useCareerReadiness() {
  const { profile } = useUserProfile();
  const { hasInsights, atsScore } = useResumeInsights();

  const { matchResume } = useMatchResume();
  const { careerContext } = useCareer();

  const readinessData = useMemo(() => {
    // Calculate profile completion percentage locally for the hook
    const requiredFields = ['name', 'email', 'bio', 'college', 'branch', 'location'];
    let filled = 0;
    requiredFields.forEach(field => {
      if (profile?.[field]) filled++;
    });
    
    let totalFilled = filled;
    const hasResume = !!matchResume || hasInsights;
    if (hasResume) totalFilled++;
    if (profile?.skills?.length > 0) totalFilled++;
    
    const profileCompletionPct = Math.round((totalFilled / (requiredFields.length + 2)) * 100);

    const githubScore = profile?.githubAnalysis?.githubScore || careerContext?.githubScore || 0;
    const linkedinScore = careerContext?.linkedinScore || 0;

    const { score, status, breakdown } = calculateAggregatedReadiness({
      profileCompletionPct,
      hasResume,
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
// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, hasInsights, atsScore, matchResume, careerContext]);

  return readinessData;
}
