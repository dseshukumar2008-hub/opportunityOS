const fs = require('fs');
const files = [
  'src/features/projectRecommendations/RecommendationReasoning.jsx',
  'src/components/analytics/CareerGrowthTimeline.jsx',
  'src/components/analytics/AIInsightsSummary.jsx',
  'src/features/projectRecommendations/LoadingState.jsx',
  'src/features/projectRecommendations/HowItWorksModal.jsx',
  'src/features/careerExplorer/components/CareerExplorerHowItWorksModal.jsx',
  'src/features/careerExplorer/components/CareerPathCard.jsx',
  'src/components/copilot/OpportunityOSCopilot.jsx',
  'src/components/analytics/SkillGapProgressWidget.jsx',
  'src/components/analytics/PlatformAnalysisRadar.jsx',
  'src/components/analytics/ImprovementTrackerWidget.jsx',
  'src/components/dashboard/skeletons/DashboardSkeletons.jsx',
  'src/components/onboarding/MentorScreen.jsx',
  'src/components/onboarding/ProgressBar.jsx',
  'src/components/onboarding/QuestionElements.jsx',
  'src/components/onboarding/FloatingOnboarding.jsx',
  'src/components/onboarding/QuestionRenderer.jsx',
  'src/components/navigation/ContextualBackButton.jsx',
  'src/components/onboarding/WelcomeStep.jsx',
  'src/components/team/TeamCard.jsx'
];
files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/^import from '.*';\r?\n?/gm, '');
    fs.writeFileSync(file, content);
  } catch (e) {
    console.error('Failed on ' + file, e.message);
  }
});
console.log('Done');
