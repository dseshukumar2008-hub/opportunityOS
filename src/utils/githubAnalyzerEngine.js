/**
 * Utility to deeply analyze GitHub portfolio and calculate metrics.
 */

// Helper to fetch the actual 52-week contribution heatmap
export async function fetchContributionHeatmap(username) {
  try {
    const res = await fetch(`https://github-contributions-api.jasonbarry.com/v1/${username}`);
    if (!res.ok) throw new Error("Heatmap fetch failed");
    const data = await res.json();
    
    // We want the last 52 weeks of data
    const weeks = data?.contributions || [];
    let totalContributions = 0;
    
    // Create a 52x7 matrix for the UI
    const heatmap = [];
    
    // The API returns an array of weeks (each week has an array of days)
    // We need the last 52 weeks
    const last52Weeks = weeks.slice(-52);
    
    last52Weeks.forEach(week => {
      const weekData = [];
      for (let j = 0; j < 7; j++) {
        const day = week.days[j];
        if (day) {
          totalContributions += day.count;
          // Map count to an intensity scale 0-4
          let intensity = 0;
          if (day.count > 0) intensity = 1;
          if (day.count > 3) intensity = 2;
          if (day.count > 6) intensity = 3;
          if (day.count > 10) intensity = 4;
          weekData.push(intensity);
        } else {
          weekData.push(0);
        }
      }
      heatmap.push({ days: weekData });
    });

    // Ensure we have exactly 52 weeks
    while (heatmap.length < 52) {
      heatmap.unshift({ days: Array(7).fill(0) });
    }

    return { heatmap, totalContributions };
  } catch (err) {
    console.warn("Failed to fetch real heatmap from proxy, falling back to Events API:", err);
    const heatmap = Array.from({ length: 52 }, () => ({ days: Array(7).fill(0) }));
    let totalContributions = 0;
    
    try {
      // Fallback: fetch recent events (up to 90 days, but max 100 events per page)
      const evRes = await fetch(`https://api.github.com/users/${username}/events?per_page=100`);
      if (evRes.ok) {
        const events = await evRes.json();
        const now = new Date();
        events.forEach(ev => {
          if (['PushEvent', 'CreateEvent', 'PullRequestEvent', 'IssuesEvent'].includes(ev.type)) {
            const d = new Date(ev.created_at);
            const diffTime = Math.abs(now - d);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays < 365) {
              const weekIdx = 51 - Math.floor(diffDays / 7);
              const dayIdx = d.getDay();
              if (heatmap[weekIdx] && heatmap[weekIdx].days[dayIdx] !== undefined) {
                 heatmap[weekIdx].days[dayIdx] = Math.min(heatmap[weekIdx].days[dayIdx] + 1, 4);
                 totalContributions++;
              }
            }
          }
        });
      }
    } catch (e) {
      console.warn("Fallback Events API also failed:", e);
    }
    
    return { heatmap, totalContributions };
  }
}

// Deeply fetch data for Top 5 repositories
export async function fetchDeepGithubData(username, allRepos) {
  // Sort by stars, then forks, then updated
  const sortedRepos = [...allRepos].sort((a, b) => {
    if (b.stargazers_count !== a.stargazers_count) return b.stargazers_count - a.stargazers_count;
    if (b.forks_count !== a.forks_count) return b.forks_count - a.forks_count;
    return new Date(b.updated_at) - new Date(a.updated_at);
  });

  const top5 = sortedRepos.slice(0, 5);
  const deepAnalysis = [];

  const headers = { 'Accept': 'application/vnd.github.v3+json' };

  await Promise.allSettled(top5.map(async (repo) => {
    try {
      let readme = "";
      let packageJson = null;
      let requirementsTxt = null;
      let hasActions = false;
      let hasDocker = false;

      // Fetch Tree (limit to 1 level for speed, or recursive if small)
      const treeRes = await fetch(`https://api.github.com/repos/${username}/${repo.name}/git/trees/${repo.default_branch}?recursive=1`, { headers });
      if (treeRes.ok) {
        const treeData = await treeRes.json();
        const files = treeData.tree || [];
        
        const filePaths = files.map(f => f.path.toLowerCase());
        hasActions = filePaths.some(p => p.includes('.github/workflows/'));
        hasDocker = filePaths.some(p => p.includes('dockerfile') || p.includes('docker-compose'));

        // If package.json exists, fetch it
        if (filePaths.includes('package.json')) {
          const pkgRes = await fetch(`https://raw.githubusercontent.com/${username}/${repo.name}/${repo.default_branch}/package.json`);
          if (pkgRes.ok) packageJson = await pkgRes.text();
        }
        
        // If requirements.txt exists, fetch it
        if (filePaths.includes('requirements.txt')) {
          const reqRes = await fetch(`https://raw.githubusercontent.com/${username}/${repo.name}/${repo.default_branch}/requirements.txt`);
          if (reqRes.ok) requirementsTxt = await reqRes.text();
        }
      }

      // Fetch README
      const readmeRes = await fetch(`https://raw.githubusercontent.com/${username}/${repo.name}/${repo.default_branch}/README.md`);
      if (readmeRes.ok) {
        readme = await readmeRes.text();
      }

      deepAnalysis.push({
        repoName: repo.name,
        readme: readme.substring(0, 2000), // truncate for AI token limits
        packageJson: packageJson ? packageJson.substring(0, 1000) : null,
        requirementsTxt,
        hasActions,
        hasDocker
      });
    } catch (e) {
      console.warn(`Failed to deep fetch ${repo.name}`, e);
    }
  }));

  return deepAnalysis;
}

// eslint-disable-next-line no-unused-vars
export function calculateLocalGithubMetrics(githubData, userData, targetRole) {
  let stars = 0;
// eslint-disable-next-line no-unused-vars
  let forks = 0;
  let repoCount = githubData.length;
  let languageCounts = {};
  let topics = new Set();
  
  // Calculate raw metrics
  githubData.forEach(repo => {
    stars += repo.stargazers_count || 0;
    forks += repo.forks_count || 0;
    if (repo.language) {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
    }
    if (repo.topics) {
      repo.topics.forEach(t => topics.add(t));
    }
  });

  const languagesArray = Object.entries(languageCounts).map(([name, count]) => ({
    name,
    count
  })).sort((a, b) => b.count - a.count);

  let totalLanguages = languagesArray.reduce((acc, l) => acc + l.count, 0);
  
  const languageStats = languagesArray.map(l => ({
    name: l.name,
    percentage: totalLanguages > 0 ? Math.round((l.count / totalLanguages) * 100) : 0
  }));

  // Extracted Technology
  const detected = languagesArray.map(l => l.name);

  // Calculate Years Active
  let activeSince = 0;
  if (userData && userData.created_at) {
    activeSince = new Date().getFullYear() - new Date(userData.created_at).getFullYear();
    if (activeSince === 0) activeSince = 1; // Minimum 1 year
  }

  return {
    basicStats: {
      publicRepos: userData?.public_repos || repoCount,
      followers: userData?.followers || 0,
      following: userData?.following || 0,
      totalStars: stars,
      activeSince: activeSince
    },
    languageStats,
    technologyAnalysis: {
      detected
    },
    repos: githubData
  };
}
