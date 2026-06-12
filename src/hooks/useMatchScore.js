import { useMemo } from 'react';
import { useUserProfile } from './useUserProfile';

export function calculateMatchScore(opportunity, userProfile) {
  if (!opportunity) return null;

  let score = 0;
  const reasons = [];

  // Parse User Profile Data (onboarding skills + resume-extracted skills merged)
  const onboardingSkills = (userProfile?.skills || []).map(s => s.toLowerCase());
  const resumeSkills = (userProfile?.resumeSkills || []).map(s => s.toLowerCase());
  // Union of all skills for matching (deduped)
  const userSkills = [...new Set([...onboardingSkills, ...resumeSkills])];

  const userInterests = (userProfile?.interests || []).map(i => i.toLowerCase());
  const userGoals = (userProfile?.careerGoals || userProfile?.goals || []).map(g => g.toLowerCase());
  const atsScore = typeof userProfile?.resumeAnalysis?.atsScore === 'number'
    ? userProfile.resumeAnalysis.atsScore
    : null;

  // Prepare Opportunity Data for matching
  const oppTitle = (opportunity.title || '').toLowerCase();
  const oppDesc = (opportunity.description || '').toLowerCase();
  const oppSkills = (opportunity.skills || []).map(s => s.toLowerCase());
  const oppType = (opportunity.type || '').toLowerCase();

  // 1. Skills Match (50%)
  let matchedSkillsCount = 0;
  let skillsScore = 0;
  if (userSkills.length > 0) {
    userSkills.forEach(skill => {
      const matchInSkills = oppSkills.some(req => req.includes(skill) || skill.includes(req));
      const matchInText = oppTitle.includes(skill) || oppDesc.includes(skill);
      if (matchInSkills || matchInText) {
        matchedSkillsCount++;
        reasons.push(`Matches ${skill} skill`);
      }
    });
    skillsScore = Math.min(50, Math.round((matchedSkillsCount / Math.max(1, userSkills.length)) * 50));
    if (matchedSkillsCount > 0 && skillsScore < 10) skillsScore = 15;
  } else {
    skillsScore = 25;
  }
  score += skillsScore;

  // 2. Interest Match (30%)
  let matchedInterestsCount = 0;
  let interestsScore = 0;
  if (userInterests.length > 0) {
    userInterests.forEach(interest => {
      const keywords = interest.split(' ').map(w => w.trim()).filter(w => w.length > 2);
      const isMatch = keywords.some(kw => oppTitle.includes(kw) || oppDesc.includes(kw));
      if (isMatch) {
        matchedInterestsCount++;
        reasons.push(`Matches ${interest} interest`);
      }
    });
    interestsScore = Math.min(30, Math.round((matchedInterestsCount / Math.max(1, userInterests.length)) * 30));
    if (matchedInterestsCount > 0 && interestsScore < 10) interestsScore = 15;
  } else {
    interestsScore = 15;
  }
  score += interestsScore;

  // 3. Goal Match (20%)
  let goalScore = 0;
  if (userGoals.length > 0) {
    let goalMatched = false;
    if (userGoals.includes('internships') && oppType === 'internship') {
      goalMatched = true;
      reasons.push('Matches Internship goal');
    }
    if (userGoals.includes('jobs') && oppType === 'job') {
      goalMatched = true;
      reasons.push('Matches Jobs goal');
    }
    if (!goalMatched) {
      userGoals.forEach(goal => {
        const goalLower = goal.toLowerCase();
        if (goalLower !== 'internships' && goalLower !== 'jobs') {
          const kw = goalLower.endsWith('s') ? goalLower.slice(0, -1) : goalLower;
          if (oppTitle.includes(kw) || oppType.includes(kw)) {
            goalMatched = true;
            reasons.push(`Matches ${goal} goal`);
          }
        }
      });
    }
    if (goalMatched) goalScore = 20;
  } else {
    goalScore = 10;
  }
  score += goalScore;

  // 4. Resume Bonus (up to +8 points, capped at 100)
  // If the user has a strong ATS score, they get a quality signal bonus
  if (atsScore !== null) {
    if (atsScore >= 80) {
      score += 8;
      reasons.push('Strong resume quality');
    } else if (atsScore >= 70) {
      score += 5;
      reasons.push('Good resume quality');
    } else if (atsScore >= 50) {
      score += 2;
    }
  }

  // De-duplicate reasons and limit to top 4 most relevant
  const uniqueReasons = [...new Set(reasons)].slice(0, 4);

  return {
    score: Math.min(100, Math.max(0, score)),
    reasons: uniqueReasons
  };
}

export function useMatchScore(opportunity) {
  const { profile } = useUserProfile();

  const matchData = useMemo(() => {
    return calculateMatchScore(opportunity, profile);
  }, [opportunity, profile]);

  return matchData;
}
