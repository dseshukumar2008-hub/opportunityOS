import { useMemo } from 'react';
import { useUserProfile } from './useUserProfile';
import { useResumeInsights } from './useResumeInsights';
import { useCareerReadiness } from './useCareerReadiness';

export function useDashboardInsights() {
  const { profile, isLoading: isProfileLoading } = useUserProfile();
  const { hasInsights: hasResume, atsScore, missingSkills: resumeMissingSkills } = useResumeInsights();
  const { score: readinessScore, breakdown } = useCareerReadiness();

  const insights = useMemo(() => {
    // 1. Next Best Action
    let nextBestAction = null;
    let nextBestActionCta = null;
    let nextBestActionLink = null;
    let nextBestActionIcon = null;

    if (!profile?.name || !profile?.college) {
      nextBestAction = "Complete your profile to unlock better matches.";
      nextBestActionCta = "Complete Profile";
      nextBestActionLink = "/profile";
      nextBestActionIcon = "User";
    } else if (!hasResume) {
      nextBestAction = "Upload a resume to unlock AI analysis.";
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

    // 2. Profile Completion
    const requiredFields = ['name', 'email', 'bio', 'college', 'branch', 'location'];
    let filled = 0;
    const missingProfileItems = [];
    requiredFields.forEach(field => {
      if (profile?.[field]) {
        filled++;
      } else {
        missingProfileItems.push(field);
      }
    });
    if (!hasResume) missingProfileItems.push('resume');
    if (!profile?.skills || (profile.skills || []).length === 0) missingProfileItems.push('skills');

    // Calculate total fields to evaluate completion
    const totalFields = requiredFields.length + 2;
    let totalFilled = filled;
    if (hasResume) totalFilled++;
    if (profile?.skills?.length > 0) totalFilled++;
    const profileCompletionPct = Math.round((totalFilled / totalFields) * 100);

    // 5. Skill Gap Analysis
    // Aggregate required skills from top 5 recommendations
    const requiredByOps = {};
    const userSkillsSet = new Set((profile?.skills || []).map(s => s.toLowerCase()));
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
      }
    };
  }, [profile, hasResume, atsScore, readinessScore, breakdown]);

  return {
    ...insights,
    isLoading: isProfileLoading
  };
}
