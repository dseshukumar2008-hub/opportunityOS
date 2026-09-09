import { analyticsService } from '../../analyticsService';

// The templateProvider acts as the absolute last resort in the AI orchestration chain.
// If all network providers (Gemini, Groq, etc.) fail due to rate limits or network issues,
// this provider intercepts the request and returns hardcoded, structurally valid JSON.
// This ensures the application fails gracefully without breaking the UI.
export const templateProvider = {
  name: 'template',
  async generate(request) {
    const { feature } = request;
    const startTime = Date.now();

    console.log(`\n--- VERIFICATION AUDIT (templateProvider) ---`);
    console.log(`FEATURE: ${feature}`);
    console.log(`Using Professional Templates offline fallback.`);

// eslint-disable-next-line no-useless-assignment
    let responseData = {};

    // Generate basic offline templates based on the feature
    switch (feature) {
      case 'CareerCoach':
        responseData = {
          reply: "I'm operating in offline template mode. Please check your network connection, but in the meantime, I recommend focusing on foundational skills and updating your resume.",
          suggestedActions: ["Update Resume", "Review Roadmap", "Check connection"],
          newGoals: []
        };
        break;
      case 'ResumeAnalysis':
        responseData = {
          score: 50,
          strengths: ["Basic structure is present"],
          weaknesses: ["Cannot perform deep analysis offline"],
          recommendations: [
            { category: "Impact", suggestion: "Add more quantifiable metrics to your experience." },
            { category: "Formatting", suggestion: "Ensure consistent typography." }
          ],
          missingKeywords: ["Leadership", "Communication"]
        };
        break;
      case 'SkillGapAnalysis':
        responseData = {
          overallMatch: 50,
          missingSkills: [
            { skill: "Advanced Algorithms", importance: "High", howToAcquire: "Online courses" },
            { skill: "System Design", importance: "Medium", howToAcquire: "Read textbooks" }
          ],
          strengths: ["General programming"],
          actionPlan: ["Take an online course", "Build a side project"]
        };
        break;
      case 'RoadmapGeneration':
        responseData = {
          title: "Standard Career Roadmap",
          summary: "A standard path for career development.",
          milestones: [
            { title: "Learn Basics", timeframe: "0-3 Months", items: ["Complete tutorials", "Build simple projects"] },
            { title: "Gain Experience", timeframe: "3-6 Months", items: ["Contribute to Open Source", "Apply for internships"] },
            { title: "Advanced Topics", timeframe: "6-12 Months", items: ["Specialize in a niche", "Network"] }
          ],
          recommendedResources: []
        };
        break;
      case 'OpportunityMatching':
        responseData = {
          matchScore: 50,
          analysis: "Offline mode: Cannot perform deep match. This opportunity seems generally aligned.",
          pros: ["Good for experience"],
          cons: ["Offline analysis limited"],
          missingRequirements: ["Check full description manually"],
          recommendation: "Apply if the role description matches your interests."
        };
        break;
      case 'HiddenPotential':
        responseData = {
          hiddenStrengths: [
            { trait: "Adaptability", evidence: "You are navigating this offline mode well.", application: "Thriving in dynamic environments." }
          ],
          pivotOpportunities: [
            { role: "Generalist", rationale: "Broad skills are always useful.", skillOverlap: 50, newSkillsNeeded: ["Domain expertise"] }
          ],
          uniqueValueProposition: "You have a diverse background."
        };
        break;
      case 'ResponseFusion':
        responseData = {
          executiveSummary: "Offline Mode: Full AI synthesis unavailable. Displaying generic recommendations.",
          unifiedAnalysis: { strengths: ["Basic profile complete"], criticalGaps: ["Network connection required"] },
          rankedRecommendations: [
            { priority: "High", action: "Restore network connection", reasoning: "To enable full AI features." }
          ],
          strategicRoadmap: ["Reconnect", "Regenerate insights"]
        };
        break;
      case 'Resume Enhancement':
        responseData = { enhancedText: "Offline Mode: Unable to enhance text." };
        break;
      case 'ATS Target Role Scan':
        responseData = { atsScore: 0, skillsDetected: [], missingSkills: [], summary: "Offline Mode: Unable to perform ATS scan.", strengths: [], improvements: [], atsRating: "Poor" };
        break;
      case 'Dynamic Skill Gap':
        responseData = { targetRole: "Offline", readinessScore: 0, skillGapPercentage: 100, currentSkills: [], skillBreakdown: { strong: 0, moderate: 0, missing: 0 }, nextSkill: { name: "Reconnect", priority: "High", time: "0", impact: "High", reason: "Network required" }, missingSkills: { high: [], medium: [], low: [] }, learningPath: [], aiAdvice: "Offline mode.", consistencyTip: "Offline" };
        break;
      case 'Project Recommendations':
        responseData = { _fallbackMode: true, message: "AI providers are currently unavailable. Please check your network connection or try again later." };
        break;
      case 'GitHub Analysis':
        responseData = { _fallbackMode: true, githubScore: 0, analysisSummary: ["Offline mode enabled. Cannot perform AI analysis."], overallAssessment: "Network connection unavailable.", careerMatch: { frontend: 0, backend: 0, aiTools: 0, cloudDevOps: 0 }, strengths: [], weaknesses: [], recommendations: [] };
        break;
      case 'Copilot Chat':
        responseData = { response: "I'm operating in offline mode. Please check your network connection." };
        break;
      case 'Readiness Analysis':
        responseData = { strengths: ["Offline Mode"], weaknesses: ["Network required"], recommendations: ["Check connection"] };
        break;
      case 'Evaluate Candidate Fit':
        responseData = { matchScore: 0, fitAnalysis: "Offline mode", strengths: [], concerns: ["Network required"], recommendation: "Reject" };
        break;
      case 'Opportunity Match Extraction':
        responseData = { requiredSkills: [], tools: [], requiredExperienceYears: 0, requiredEducation: "Offline" };
        break;
      default:
        responseData = { _fallbackMode: true, message: "Offline template response for " + feature };
    }

    const responseTime = Date.now() - startTime;
    
    if (request.responseType === 'text') {
      analyticsService.trackAIOperation(feature, 0, responseTime, true, null);
      return JSON.stringify(responseData);
    }
    
    analyticsService.trackAIOperation(feature, 0, responseTime, true, null);
    return responseData;
  }
};
