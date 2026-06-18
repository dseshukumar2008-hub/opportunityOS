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
    ...metrics
  };

  // 1. Skills Match (Max 25)
  // Ideal is around 12-15 skills.
  let skillsScore = Math.min(25, Math.round((m.numberOfSkills / 12) * 25));

  // 2. Keywords Coverage (Max 20)
  // Penalize missing keywords
  let keywordsScore = 20 - (m.missingCrucialKeywords * 4);
  keywordsScore = Math.max(0, keywordsScore);

  // 3. Projects Quality (Max 15)
  // Ideal is 2-3 projects.
  let projectsScore = Math.min(15, m.numberOfProjects * 5);

  // 4. Experience & Impact (Max 20)
  // Look at years of experience and quantified achievements
  let experienceScore = Math.min(10, m.yearsOfExperience * 3);
  let impactScore = Math.min(10, m.quantifiedAchievements * 2);
  let totalExperienceScore = experienceScore + impactScore;

  // 5. Resume Structure (Max 10)
  let structureScore = 0;
  if (m.hasSummary) structureScore += 5;
  if (m.hasEducation) structureScore += 5;

  // 6. Formatting (Max 10)
  // Penalize formatting errors
  let formattingScore = 10 - (m.formattingErrors * 3);
  formattingScore = Math.max(0, formattingScore);

  const totalScore = skillsScore + keywordsScore + projectsScore + totalExperienceScore + structureScore + formattingScore;

  return {
    totalScore: Math.min(100, Math.max(0, totalScore)),
    breakdown: {
      skillsMatch: skillsScore,
      keywordsCoverage: keywordsScore,
      projectsQuality: projectsScore,
      experience: totalExperienceScore,
      resumeStructure: structureScore,
      formatting: formattingScore
    }
  };
}
