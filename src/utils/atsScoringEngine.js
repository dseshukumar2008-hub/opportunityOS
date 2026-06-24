export function calculateATSScore(metrics) {
  // Ensure defaults
  const m = {
    numberOfSkills: 0,
    numberOfProjects: 0,
    yearsOfExperience: 0,
    quantifiedAchievements: 0,
    hasSummary: false,
    hasEducation: false,
    missingCrucialKeywords: 0,
    formattingErrors: 0,
    hasGitHub: false,
    hasLinkedIn: false,
    hasPortfolio: false,
    hasEmail: false,
    hasPhone: false,
    profileType: 'student', // default
    ...metrics
  };

  let totalScore = 0;
  const breakdown = {
    experienceStrength: 0,
    projectStrength: 0,
    skillsCoverage: 0,
    resumeStructure: 0,
    keywordMatch: 0,
    atsCompatibility: 0
  };
  const explanation = [];

  // 1. Experience Strength (Max 25 pts)
  // Strict: Requires actual experience. If yearsOfExperience is 0, they get 0.
  if (m.yearsOfExperience > 0) {
    let expScore = Math.min(15, m.yearsOfExperience * 5); // 3+ years = 15
    let impactScore = Math.min(10, m.quantifiedAchievements * 3);
    breakdown.experienceStrength = expScore + impactScore;
    explanation.push({ type: 'gain', label: 'Professional Experience detected', points: `+${expScore}` });
    if (impactScore > 0) {
      explanation.push({ type: 'gain', label: 'Quantified impact detected', points: `+${impactScore}` });
    }
  } else {
    explanation.push({ type: 'loss', label: 'No professional experience detected', points: '-25' });
  }

  // 2. Project Strength (Max 20 pts)
  if (m.numberOfProjects > 0) {
    let projScore = Math.min(20, m.numberOfProjects * 7); 
    breakdown.projectStrength = projScore;
    explanation.push({ type: 'gain', label: 'Projects detected', points: `+${projScore}` });
  } else {
    explanation.push({ type: 'loss', label: 'No projects detected', points: '-20' });
  }

  // 3. Skills Coverage (Max 20 pts)
  if (m.numberOfSkills > 0) {
    let skillScore = Math.min(20, Math.round((m.numberOfSkills / 15) * 20)); // needs ~15 skills for max points
    breakdown.skillsCoverage = skillScore;
    explanation.push({ type: 'gain', label: 'Skills coverage', points: `+${skillScore}` });
  } else {
    explanation.push({ type: 'loss', label: 'No technical skills detected', points: '-20' });
  }

  // 4. Resume Structure (Max 15 pts)
  let structScore = 0;
  if (m.hasEducation) {
    structScore += 5;
    explanation.push({ type: 'gain', label: 'Education section present', points: '+5' });
  }
  if (m.hasEmail && m.hasPhone) {
    structScore += 10;
    explanation.push({ type: 'gain', label: 'Contact info present', points: '+10' });
  } else {
    explanation.push({ type: 'loss', label: 'Missing contact information', points: '-10' });
  }
  breakdown.resumeStructure = structScore;

  // 5. Keyword Match (Max 10 pts)
  let kwScore = 10;
  if (m.missingCrucialKeywords > 0) {
    const penalty = Math.min(10, m.missingCrucialKeywords * 5);
    kwScore -= penalty;
    explanation.push({ type: 'loss', label: 'Missing core role keywords', points: `-${penalty}` });
    if (kwScore > 0) {
      explanation.push({ type: 'gain', label: 'Partial keyword match', points: `+${kwScore}` });
    }
  } else {
    explanation.push({ type: 'gain', label: 'Strong keyword match', points: '+10' });
  }
  breakdown.keywordMatch = kwScore;

  // 6. ATS Compatibility (Max 10 pts)
  let atsCompScore = 10;
  if (m.formattingErrors > 0) {
    atsCompScore -= 5;
    explanation.push({ type: 'loss', label: 'Formatting/spacing issues', points: '-5' });
  }
  
  if (m.profileType !== 'experienced' && !m.hasGitHub && !m.hasPortfolio) {
    atsCompScore -= 5;
    explanation.push({ type: 'loss', label: 'Missing GitHub or Portfolio link', points: '-5' });
  } else if (m.hasGitHub || m.hasLinkedIn || m.hasPortfolio) {
    explanation.push({ type: 'gain', label: 'Professional links detected', points: '+5' });
  }
  breakdown.atsCompatibility = atsCompScore;

  // Deductions applied directly to final score calculation if applicable
  // For example, if quantifiedAchievements is completely 0 across the entire resume
  let deductionPoints = 0;
  if (m.quantifiedAchievements === 0) {
    deductionPoints += 5;
    explanation.push({ type: 'loss', label: 'Missing quantified achievements (e.g. %, $)', points: '-5' });
  }

  // Calculate Total
  totalScore = Object.values(breakdown).reduce((a, b) => a + b, 0);
  totalScore -= deductionPoints;
  
  // Ensure score stays within 0-100 bounds
  totalScore = Math.max(0, Math.min(100, totalScore));

  // Recalibrate rating
  let rating = 'Poor';
  if (totalScore >= 86) rating = 'Excellent';
  else if (totalScore >= 76) rating = 'Strong';
  else if (totalScore >= 61) rating = 'Good';
  else if (totalScore >= 41) rating = 'Fair';

  return {
    totalScore,
    rating,
    breakdown,
    explanation
  };
}
