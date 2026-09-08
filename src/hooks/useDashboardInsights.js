import { useMemo } from 'react';
import { useUserProfile } from './useUserProfile';
import { useResumeInsights } from './useResumeInsights';
import { useCareerReadiness } from './useCareerReadiness';
import { calculateProfileCompletion } from '../utils/userUtils';

export function useDashboardInsights() {
  const { profile, isLoading: isProfileLoading } = useUserProfile();
  const { hasInsights: hasResume, atsScore } = useResumeInsights();
  const { score: readinessScore, breakdown } = useCareerReadiness();

  const insights = useMemo(() => {
    // eslint-disable-next-line no-useless-assignment
    let nextBestAction = null;
// eslint-disable-next-line no-useless-assignment
    let nextBestActionCta = null;
// eslint-disable-next-line no-useless-assignment
    let nextBestActionLink = null;
// eslint-disable-next-line no-useless-assignment
    let nextBestActionIcon = null;

    if (!profile?.name || !profile?.college) {
      nextBestAction = "Complete your profile to receive personalized recommendations.";
      nextBestActionCta = "Complete Profile";
      nextBestActionLink = "/profile";
      nextBestActionIcon = "User";
    } else if (!hasResume) {
      nextBestAction = "Upload a resume to get feedback.";
      nextBestActionCta = "Upload Resume";
      nextBestActionLink = "/resume-review";
      nextBestActionIcon = "FileText";
    } else if (!profile?.skills || (profile.skills || []).length < 3) {
      nextBestAction = "Add more skills to improve your recommendation accuracy.";
      nextBestActionCta = "Add Skills";
      nextBestActionLink = "/profile";
      nextBestActionIcon = "Code";
    } else if (typeof atsScore === 'number' && atsScore < 60) {
      nextBestAction = "Your ATS score is low. Update your resume to improve visibility.";
      nextBestActionCta = "Improve Resume";
      nextBestActionLink = "/resume-review";
      nextBestActionIcon = "AlertTriangle";
    } else {
      nextBestAction = "Keep up the momentum! Explore new career paths.";
      nextBestActionCta = "Explore Career Paths";
      nextBestActionLink = "/career-explorer";
      nextBestActionIcon = "Zap";
    }

        const { percentage: profileCompletionPct, missingProfileItems } = calculateProfileCompletion(profile, hasResume);

        // Aggregate required skills from top 5 recommendations
    const requiredByOps = {};
    const rawSkills = profile?.skills || [];
    const skillsArray = Array.isArray(rawSkills) ? rawSkills : (typeof rawSkills === 'string' ? rawSkills.split(',') : []);
    const userSkillsSet = new Set(skillsArray.map(s => s.trim().toLowerCase()).filter(Boolean));
    if (profile?.resumeSkills) {
      profile.resumeSkills.forEach(s => userSkillsSet.add(s.toLowerCase()));
    }

    const missingSkillsGap = Object.keys(requiredByOps)
      .filter(skill => !userSkillsSet.has(skill))
      .sort((a, b) => requiredByOps[b] - requiredByOps[a])
      .slice(0, 5); // Top 5 missing skills



    return {
      nextBestAction: {
        text: nextBestAction,
        cta: nextBestActionCta,
        link: nextBestActionLink,
        icon: nextBestActionIcon
      },
      profileCompletion: {
        score: profileCompletionPct,
        missing: missingProfileItems
      },

      skillGap: {
        current: Array.from(userSkillsSet).slice(0, 5),
        missing: missingSkillsGap
      },

      careerReadiness: {
        score: readinessScore,
        breakdown
      },

      resume: {
        hasInsights: hasResume,
        atsScore
      }
    };
  }, [profile, hasResume, atsScore, readinessScore, breakdown]);

  return {
    ...insights,
    isLoading: isProfileLoading
  };
}
