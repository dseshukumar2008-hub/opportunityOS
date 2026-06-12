import { useMemo } from 'react';
import { useUserProfile } from './useUserProfile';
import { useTeam } from '../contexts/TeamContext';

export function useTeamMatch() {
  const { profile } = useUserProfile();
  const { teams, getDiscoverTeams } = useTeam();

  const userSkills = useMemo(() => {
    const skills = new Set((profile?.skills || []).map(s => s.toLowerCase()));
    if (profile?.resumeSkills) {
      profile.resumeSkills.forEach(s => skills.add(s.toLowerCase()));
    }
    return skills;
  }, [profile]);

  const userInterests = useMemo(() => {
    return new Set((profile?.interests || []).map(i => i.toLowerCase()));
  }, [profile]);

  const userGoals = useMemo(() => {
    return new Set((profile?.careerGoals || []).map(g => g.toLowerCase()));
  }, [profile]);

  const calculateMatch = (team) => {
    let score = 0;
    const reasons = [];

    // 1. Skills Match (up to 50%)
    if (team.requiredSkills && team.requiredSkills.length > 0) {
      const matchedSkills = team.requiredSkills.filter(s => userSkills.has(s.toLowerCase()));
      const skillScore = (matchedSkills.length / team.requiredSkills.length) * 50;
      score += skillScore;
      
      matchedSkills.slice(0, 3).forEach(s => {
        reasons.push(`✓ ${s} (Skill)`);
      });
    } else {
      // If no required skills, give default points
      score += 30; 
    }

    // 2. Interests/Goals Match against Project Idea / Description (up to 50%)
    const textToSearch = `${team.projectIdea || ''} ${team.description || ''}`.toLowerCase();
    
    let interestMatches = 0;
    userInterests.forEach(interest => {
      if (textToSearch.includes(interest)) {
        interestMatches++;
        if (reasons.length < 5 && !reasons.includes(`✓ ${interest} (Interest)`)) {
          reasons.push(`✓ ${interest} (Interest)`);
        }
      }
    });

    userGoals.forEach(goal => {
      if (textToSearch.includes(goal)) {
        interestMatches++;
        if (reasons.length < 5 && !reasons.includes(`✓ ${goal} (Goal)`)) {
          reasons.push(`✓ ${goal} (Goal)`);
        }
      }
    });

    const contextScore = Math.min((interestMatches * 15), 50);
    score += contextScore;

    // Minimum score of 15 just so things don't look completely zero if there's no perfect match but they are exploring
    return {
      score: Math.max(15, Math.round(score)),
      reasons: reasons.slice(0, 3) // Return top 3 reasons
    };
  };

  const getRecommendedTeams = () => {
    const discoverable = getDiscoverTeams();
    
    const evaluated = discoverable.map(team => {
      const matchData = calculateMatch(team);
      return {
        ...team,
        matchData
      };
    });

    // Sort by highest match score
    return evaluated.sort((a, b) => b.matchData.score - a.matchData.score);
  };

  return {
    calculateMatch,
    getRecommendedTeams
  };
}
