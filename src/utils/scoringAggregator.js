/**
 * Aggregates multiple individual scores into a single 0-100 Career Readiness Score.
 * 
 * Weights:
 * 1. Profile & Skills Completion (Skill Gap Proxy): 20%
 * 2. Resume Upload & ATS Score: 30%
 * 3. Application Momentum: 20%
 * 4. GitHub Score: 15%
 * 5. LinkedIn Score: 15%
 */

export function calculateAggregatedReadiness({
  profileCompletionPct = 0,
  hasResume = false,
  atsScore = 0,
  applicationsCount = 0,
  githubScore = 0,
  linkedinScore = 0
}) {
  // 1. Profile & Skills (20%)
  const profilePts = Math.min((profileCompletionPct / 100) * 20, 20);

  // 2. Resume & ATS (30%)
  // If resume is uploaded, give base 10 points. Remaining 20 depends on ATS score.
  let resumePts = 0;
  if (hasResume) {
    resumePts += 10;
    const validAts = typeof atsScore === 'number' ? atsScore : 0;
    resumePts += (validAts / 100) * 20;
  }

  // 3. Applications (20%) - Max out at 5 applications
  const appsPts = Math.min((applicationsCount / 5), 1) * 20;

  // 4. GitHub Score (15%)
  const githubPts = (githubScore / 100) * 15;

  // 5. LinkedIn Score (15%)
  const linkedinPts = (linkedinScore / 100) * 15;

  // Total Score
  const score = Math.round(profilePts + resumePts + appsPts + githubPts + linkedinPts);

  // Status mapping
  let status = 'Beginner';
  if (score >= 80) status = 'Career Ready';
  else if (score >= 50) status = 'Advanced';
  else if (score >= 20) status = 'Intermediate';

  const breakdown = {
    profile: { done: profilePts >= 15, current: Math.round(profilePts), max: 20 },
    resume: { done: resumePts >= 25, current: Math.round(resumePts), max: 30 },
    applications: { done: appsPts >= 20, current: Math.round(appsPts), max: 20 },
    github: { done: githubPts >= 10, current: Math.round(githubPts), max: 15 },
    linkedin: { done: linkedinPts >= 10, current: Math.round(linkedinPts), max: 15 }
  };

  return { score, status, breakdown };
}
