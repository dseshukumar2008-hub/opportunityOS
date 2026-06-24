/**
 * Utility to calculate GitHub portfolio metrics locally.
 */
export function calculateLocalGithubMetrics(githubData, targetRole) {
  let stars = 0;
  let forks = 0;
  let repoCount = githubData.length;
  let languages = new Set();
  let topics = new Set();
  
  // Calculate raw metrics
  githubData.forEach(repo => {
    stars += repo.stargazers_count || 0;
    forks += repo.forks_count || 0;
    if (repo.language) languages.add(repo.language);
    if (repo.topics) {
      repo.topics.forEach(t => topics.add(t));
    }
  });

  // 1. Calculate GitHub Score (0-100)
  // Base score on repos (up to 40), stars (up to 30), forks (up to 10), languages (up to 20)
  let repoScore = Math.min(repoCount * 4, 40);
  let starScore = Math.min(stars * 2, 30);
  let forkScore = Math.min(forks * 3, 10);
  let langScore = Math.min(languages.size * 5, 20);
  let githubScore = Math.round(repoScore + starScore + forkScore + langScore);
  if (githubScore > 100) githubScore = 100;
  if (repoCount === 0) githubScore = 0;

  // 2. Alignment Score (0-100)
  // Simple keyword matching based on target role
  const targetRoleLower = (targetRole || "").toLowerCase();
  let keywords = [];
  if (targetRoleLower.includes('frontend')) keywords = ['react', 'vue', 'angular', 'js', 'javascript', 'typescript', 'html', 'css', 'ui', 'frontend'];
  else if (targetRoleLower.includes('backend')) keywords = ['node', 'python', 'java', 'go', 'ruby', 'backend', 'api', 'database', 'sql', 'docker'];
  else if (targetRoleLower.includes('full stack') || targetRoleLower.includes('fullstack')) keywords = ['react', 'node', 'javascript', 'typescript', 'python', 'api', 'fullstack', 'database'];
  else if (targetRoleLower.includes('data') || targetRoleLower.includes('machine learning') || targetRoleLower.includes('ai')) keywords = ['python', 'r', 'jupyter', 'data', 'ml', 'ai', 'tensor', 'pandas', 'numpy', 'model'];
  else keywords = targetRoleLower.split(' ');

  let matchCount = 0;
  keywords.forEach(kw => {
    if (Array.from(languages).some(l => l.toLowerCase().includes(kw))) matchCount++;
    if (Array.from(topics).some(t => t.toLowerCase().includes(kw))) matchCount++;
    if (githubData.some(r => (r.description || "").toLowerCase().includes(kw))) matchCount++;
    if (githubData.some(r => (r.name || "").toLowerCase().includes(kw))) matchCount++;
  });
  
  let alignmentScore = Math.min(Math.round((matchCount / Math.max(keywords.length, 3)) * 100), 100);
  if (repoCount === 0) alignmentScore = 0;

  // 3. Technology Analysis
  const detected = Array.from(languages);
  const coreTargetSkills = keywords.slice(0, 5);
  const missing = coreTargetSkills.filter(kw => !detected.some(d => d.toLowerCase().includes(kw)));

  // 4. Portfolio Diversity
  let diversityAnalysis = "Portfolio consists of standard repositories.";
  if (languages.size > 4) {
    diversityAnalysis = `High diversity detected with ${languages.size} different languages.`;
  } else if (languages.size === 1) {
    diversityAnalysis = `Highly specialized portfolio focusing almost entirely on ${detected[0]}.`;
  } else if (languages.size > 1) {
    diversityAnalysis = `Good mix of ${languages.size} technologies including ${detected.join(', ')}.`;
  }

  let gaps = [];
  if (repoCount < 3) gaps.push("Needs more visible projects.");
  if (stars === 0) gaps.push("Repositories have low community engagement (no stars).");
  if (missing.length > 0) gaps.push(`Missing core technologies for ${targetRole}: ${missing.join(', ')}.`);

  return {
    githubScore,
    alignmentScore,
    technologyAnalysis: {
      detected,
      missing
    },
    portfolioDiversity: {
      analysis: diversityAnalysis,
      gaps
    }
  };
}
