import { geminiService } from './src/services/geminiService.js';

async function test() {
  const localMetrics = {
    basicStats: { followers: 10, totalStars: 50 },
    technologyAnalysis: { detected: ['JavaScript', 'React'] },
    deepAnalysis: [
      { repoName: 'test', readme: 'test', packageJson: '{}', requirementsTxt: null, hasActions: false, hasDocker: false }
    ]
  };

  try {
    const result = await geminiService.analyzeGithubPortfolio('testuser', [], 'Frontend Developer', localMetrics);
    console.log(JSON.stringify(result, null, 2));
  } catch (e) {
    console.error(e);
  }
}
test();
