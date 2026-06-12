import { useMemo } from 'react';
import { useUserProfile } from './useUserProfile';
import { useResumeInsights } from './useResumeInsights';
import { useApplications } from '../contexts/ApplicationContext';

export function useCareerReadiness() {
  const { profile } = useUserProfile();
  const { hasInsights, atsScore } = useResumeInsights();
  const { applications } = useApplications();

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

    // 3. Resume Upload (20%)
    const resumePts = hasInsights ? 20 : 0;

    // 4. ATS Score (20%)
    const validAts = typeof atsScore === 'number' ? atsScore : 0;
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
      applications: { done: appsPts >= 20, current: appsPts, max: 20 }
    };

    return { score, breakdown };
  }, [profile, hasInsights, atsScore, applications]);

  return readinessData;
}
