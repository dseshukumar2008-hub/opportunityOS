// SCORING BOUNDARIES
const MAX_EXPERIENCE_SCORE = 25;
const MAX_PROJECT_SCORE = 20;
const MAX_SKILLS_SCORE = 20;
const MAX_STRUCTURE_SCORE = 15;
const MAX_KEYWORD_SCORE = 10;
const MAX_ATS_SCORE = 10;

export function calculateATSScore(metrics) {
  // Ensure defaults
  const safeMetrics = {
    numberOfSkills: 0,
    numberOfProjects: 0,
    yearsOfExperience: 0,
    quantifiedAchievements: 0,
    hasSummary: false,
    hasEducation: false,
    missingCrucialKeywords: 0,
    formattingErrors: 0,
    hasGitHub: false,
    hasPortfolio: false,
    hasEmail: false,
    hasPhone: false,
    profileType: 'student', // default
    ...metrics
  };

  let totalScore;
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
  if (safeMetrics.yearsOfExperience > 0) {
    let expScore = Math.min(15, safeMetrics.yearsOfExperience * 5); // 3+ years = 15
    let impactScore = Math.min(10, safeMetrics.quantifiedAchievements * 3);
    breakdown.experienceStrength = expScore + impactScore;
    explanation.push({ type: 'gain', label: 'Professional Experience detected', points: `+${expScore}` });
    if (impactScore > 0) {
      explanation.push({ type: 'gain', label: 'Quantified impact detected', points: `+${impactScore}` });
    }
  } else {
    explanation.push({ type: 'loss', label: 'No professional experience detected', points: `-${MAX_EXPERIENCE_SCORE}` });
  }

  // 2. Project Strength (Max 20 pts)
  if (safeMetrics.numberOfProjects > 0) {
    let projScore = Math.min(MAX_PROJECT_SCORE, safeMetrics.numberOfProjects * 7); 
    breakdown.projectStrength = projScore;
    explanation.push({ type: 'gain', label: 'Projects detected', points: `+${projScore}` });
  } else {
    explanation.push({ type: 'loss', label: 'No projects detected', points: `-${MAX_PROJECT_SCORE}` });
  }

  // 3. Skills Coverage (Max 20 pts)
  if (safeMetrics.numberOfSkills > 0) {
    let skillScore = Math.min(MAX_SKILLS_SCORE, Math.round((safeMetrics.numberOfSkills / 15) * MAX_SKILLS_SCORE)); // needs ~15 skills for max points
    breakdown.skillsCoverage = skillScore;
    explanation.push({ type: 'gain', label: 'Skills coverage', points: `+${skillScore}` });
  } else {
    explanation.push({ type: 'loss', label: 'No technical skills detected', points: `-${MAX_SKILLS_SCORE}` });
  }

  // 4. Resume Structure (Max 15 pts)
  let structureScore = 0;
  if (safeMetrics.hasSummary) {
    structureScore += 5;
    explanation.push({ type: 'gain', label: 'Professional summary included', points: '+5' });
  }
  if (safeMetrics.hasEducation) {
    structureScore += 5;
    explanation.push({ type: 'gain', label: 'Education section found', points: '+5' });
  }
  if (safeMetrics.hasEmail && safeMetrics.hasPhone) {
    structureScore += 5;
    explanation.push({ type: 'gain', label: 'Contact information complete', points: '+5' });
  }
  breakdown.resumeStructure = Math.min(MAX_STRUCTURE_SCORE, structureScore);

  // 5. Keyword Match (Max 10 pts)
  let keywordScore = MAX_KEYWORD_SCORE;
  if (safeMetrics.missingCrucialKeywords > 0) {
    let penalty = Math.min(10, safeMetrics.missingCrucialKeywords * 2);
    keywordScore -= penalty;
    explanation.push({ type: 'loss', label: 'Missing crucial industry keywords', points: `-${penalty}` });
  } else {
    explanation.push({ type: 'gain', label: 'Good keyword density', points: `+${MAX_KEYWORD_SCORE}` });
  }
  breakdown.keywordMatch = Math.max(0, keywordScore);

  // 6. ATS Compatibility (Max 10 pts)
  let atsCompatScore = MAX_ATS_SCORE;
  if (safeMetrics.formattingErrors > 0) {
    let penalty = Math.min(10, safeMetrics.formattingErrors * 3);
    atsCompatScore -= penalty;
    explanation.push({ type: 'loss', label: 'ATS formatting errors detected (tables, columns, graphics)', points: `-${penalty}` });
  } else {
    explanation.push({ type: 'gain', label: 'ATS-friendly formatting', points: `+${MAX_ATS_SCORE}` });
  }
  breakdown.atsCompatibility = Math.max(0, atsCompatScore);

  // Deductions applied directly to final score calculation if applicable
  // For example, if quantifiedAchievements is completely 0 across the entire resume
  let deductionPoints = 0;
  if (safeMetrics.quantifiedAchievements === 0) {
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
