import { useMemo } from 'react';


export function calculateMatchScore(opportunity, userProfile) {
  if (!opportunity) return null;

  let score = 0;
  const reasons = [];

  // Parse User Profile Data
  const userCountryRaw = userProfile?.country || userProfile?.profile?.country || '';
  const userCountry = String(userCountryRaw).toLowerCase();
  
  const userBranchRaw = userProfile?.branch || '';
  const userBranch = String(userBranchRaw).toLowerCase();

  const onboardingSkills = (userProfile?.skills || []).map(s => s.toLowerCase());
  const resumeSkills = (userProfile?.resumeSkills || []).map(s => s.toLowerCase());
  const userSkillsRaw = [...new Set([...(userProfile?.skills || []), ...(userProfile?.resumeSkills || [])])];
  const userSkills = [...new Set([...onboardingSkills, ...resumeSkills])];

  const userInterestsRaw = userProfile?.interests || [];
  const userInterests = userInterestsRaw.map(i => i.toLowerCase());
  
  const userGoalsRaw = userProfile?.careerGoals || userProfile?.goals || [];
  const userGoals = userGoalsRaw.map(g => g.toLowerCase());

  // Prepare Opportunity Data for matching
  const oppTitle = String(opportunity.title || '').toLowerCase();
  const oppDesc = String(opportunity.description || '').toLowerCase();
  const oppSkills = (opportunity.skills || []).map(s => String(s).toLowerCase());
  const oppType = String(opportunity.type || '').toLowerCase();
  const oppCountryRaw = opportunity.country || opportunity.location || '';
  const oppCountry = (Array.isArray(oppCountryRaw) ? oppCountryRaw.join(' ') : String(oppCountryRaw)).toLowerCase();

  const searchContent = `${oppTitle} ${oppDesc} ${oppSkills.join(' ')} ${oppType}`;

  // 1. Country Match (+30)
  if (userCountry && oppCountry.includes(userCountry)) {
    score += 30;
    const displayCountry = userCountryRaw.charAt(0).toUpperCase() + userCountryRaw.slice(1);
    reasons.push(`Available in ${displayCountry}`);
  }

  // 2. Branch Match (+25)
  if (userBranch && searchContent.includes(userBranch)) {
    score += 25;
    reasons.push(`Matches your ${userBranchRaw} background`);
  }

  // 3. Skills Match (+35)
  let matchedSkillsCount = 0;
  let matchedSkillNames = [];
  if (userSkills.length > 0) {
    userSkills.forEach((skill, index) => {
      if (searchContent.includes(skill)) {
        matchedSkillsCount++;
        matchedSkillNames.push(userSkillsRaw[index]);
      }
    });
    
    const skillsRatio = matchedSkillsCount / Math.max(1, userSkills.length);
    const skillsPoints = Math.round(skillsRatio * 35);
    score += skillsPoints;

    if (matchedSkillNames.length > 0) {
      // Pick the first matched skill for the reason
      reasons.push(`Matches your ${matchedSkillNames[0]} skills`);
    }
  }

  // 4. Career Goal / Interest Match (+10)
  let goalOrInterestMatched = false;
  let matchedItemName = '';
  
  if (userGoals.length > 0) {
    for (let i = 0; i < userGoals.length; i++) {
      const goal = userGoals[i];
      const goalKw = goal.endsWith('s') ? goal.slice(0, -1) : goal;
      if (searchContent.includes(goalKw)) {
        goalOrInterestMatched = true;
        matchedItemName = userGoalsRaw[i];
        reasons.push(`Matches your ${matchedItemName} goals`);
        break;
      }
    }
  }

  if (!goalOrInterestMatched && userInterests.length > 0) {
    for (let i = 0; i < userInterests.length; i++) {
      const interest = userInterests[i];
      if (searchContent.includes(interest)) {
        goalOrInterestMatched = true;
        matchedItemName = userInterestsRaw[i];
        reasons.push(`Matches your ${matchedItemName} interests`);
        break;
      }
    }
  }

  if (goalOrInterestMatched) {
    score += 10;
  }

  // Cap score at 100
  score = Math.min(100, Math.max(0, score));

  // Remove duplicate reasons
  const uniqueReasons = [...new Set(reasons)].slice(0, 3); // Max 3 reasons on UI

  return {
    score,
    reasons: uniqueReasons,
    matchedSkillsCount,
    totalSkillsCount: userSkills.length,
    matchedGoal: goalOrInterestMatched
  };
}

import { useProfile } from '../contexts/ProfileContext';

export function useMatchScore(opportunity) {
  const { profile } = useProfile();

  const matchData = useMemo(() => {
    return calculateMatchScore(opportunity, profile);
  }, [opportunity, profile]);

  return matchData;
}
