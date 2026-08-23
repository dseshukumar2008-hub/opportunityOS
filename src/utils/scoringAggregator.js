/**
 * Aggregates multiple individual scores into a single 0-100 Career Readiness Score.
 * 
 * Weights:
 * 1. Profile & Skills Completion (Skill Gap Proxy): 25%
 * 2. Resume Upload & ATS Score: 55%
 * 3. GitHub Score: 20%
 */

export function calculateAggregatedReadiness({
  profileCompletionPct = 0,
  hasResume = false,
  atsScore = 0,
  githubScore = 0
}) {
  // 1. Profile & Skills (25%)
  const profilePts = Math.min((profileCompletionPct / 100) * 25, 25);

  // 2. Resume & ATS (55%)
  // If resume is uploaded, give base 20 points. Remaining 35 depends on ATS score.
  let resumePts = 0;
  if (hasResume) {
    resumePts += 20;
    const validAts = typeof atsScore === 'number' ? atsScore : 0;
    resumePts += (validAts / 100) * 35;
  }

  // 3. GitHub Score (20%)
  const githubPts = (githubScore / 100) * 20;

  // Total Score
  const score = Math.round(profilePts + resumePts + githubPts);

  // Status mapping
  let status = 'Beginner';
  if (score >= 80) status = 'Career Ready';
  else if (score >= 50) status = 'Advanced';
  else if (score >= 20) status = 'Intermediate';

  const breakdown = {
    profile: { done: profilePts >= 20, current: Math.round(profilePts), max: 25 },
    resume: { done: resumePts >= 45, current: Math.round(resumePts), max: 55 },
    github: { done: githubPts >= 15, current: Math.round(githubPts), max: 20 }
  };

  return { score, status, breakdown };
}
