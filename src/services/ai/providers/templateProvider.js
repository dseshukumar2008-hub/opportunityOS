import { analyticsService } from '../../analyticsService';

export const templateProvider = {
  name: 'template',
  async generate(request) {
    const { feature } = request;
    const startTime = Date.now();

    console.log(`\n--- VERIFICATION AUDIT (templateProvider) ---`);
    console.log(`FEATURE: ${feature}`);
    console.log(`Using Professional Templates offline fallback.`);

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
      default:
        responseData = { message: "Offline template response for " + feature };
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
