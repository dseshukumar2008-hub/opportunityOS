import { useMemo } from 'react';
import { useUserProfile } from './useUserProfile';
import { useResumeInsights } from './useResumeInsights';
import { useApplications } from '../contexts/ApplicationContext';
import { useMatchResume } from './useMatchResume';

export function useCareerReadiness() {
  const { profile } = useUserProfile();
  const { hasInsights, atsScore } = useResumeInsights();
  const { applications } = useApplications();
  const { matchResume } = useMatchResume();

  const readinessData = useMemo(() => {
    // 1. Profile Completion (20%)
    let profilePts = 0;
    const requiredProfileFields = ['name', 'email', 'bio', 'college', 'branch', 'location'];
    let filledFields = 0;
    requiredProfileFields.forEach(field => {
      if (profile?.[field]) filledFields++;
    });
    profilePts = Math.round((filledFields / requiredProfileFields.length) * 20);

    // 2. Skills Count (20%)
    const skills = profile?.skills || [];
    const skillsPts = Math.min((skills.length / 5), 1) * 20;

    // 3. Resume Upload (20%) - Verify via Supabase single source of truth
    const actuallyHasResume = !!matchResume;
    const resumePts = actuallyHasResume ? 20 : 0;

    // 4. ATS Score (20%)
    const validAts = (actuallyHasResume && typeof atsScore === 'number') ? atsScore : 0;
    const atsPts = Math.round((validAts / 100) * 20);

    // 5. Applications Submitted (20%)
    const appsCount = applications?.length || 0;
    const appsPts = Math.min((appsCount / 5), 1) * 20;

    const score = Math.round(profilePts + skillsPts + resumePts + atsPts + appsPts);

    const breakdown = {
      profile: { done: profilePts >= 15, current: profilePts, max: 20 },
      skills: { done: skillsPts >= 20, current: skillsPts, max: 20 },
      resume: { done: resumePts === 20, current: resumePts, max: 20 },
      ats: { done: atsPts >= 15, current: atsPts, max: 20 },
      applications: { done: appsPts >= 20, current: appsPts, max: 20 },
      networking: { done: false, current: 0, max: 20 },
      teams: { done: false, current: 0, max: 20 },
      certifications: { done: false, current: 0, max: 20 },
      goals: { done: false, current: 0, max: 20 }
    };

    let status = 'Beginner';
    if (score >= 80) status = 'Career Ready';
    else if (score >= 50) status = 'Advanced';
    else if (score >= 20) status = 'Intermediate';

    return { 
      score, 
      status, 
      breakdown, 
      insights: [], 
      history: [] 
    };
  }, [profile, hasInsights, atsScore, applications, matchResume]);

  return readinessData;
}
