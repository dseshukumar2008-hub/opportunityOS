import { generate } from '../aiProvider';

/**
 * Response Fusion Engine
 * Responsible for merging parallel agent outputs into a unified, coherent response.
 */
export const responseFusion = {
  /**
   * Merges all agent outputs into a final AIResponse.
   * @param {string} originalRequest - The user's original request
   * @param {Object} agentOutputs - Map of agent names to their output payloads
   * @returns {Object} Final standardized AIResponse
   */
  async mergeOutputs(originalRequest, agentOutputs) {
    const fusionPrompt = `
You are the Response Fusion Engine.
Your responsibility is to merge the outputs from multiple specialized AI agents into ONE highly cohesive, deduplicated, and ranked response.

Original User Request: "${originalRequest}"

Raw Agent Outputs:
${JSON.stringify(agentOutputs, null, 2)}

CRITICAL INSTRUCTIONS:
1. Merge insights from all provided agents (Resume, Skill Gap, Roadmap, Opportunity, Career Planner).
2. AVOID duplicated advice (e.g., if Resume and Skill Gap both suggest learning Python, combine it into one powerful recommendation).
3. RANK all actionable recommendations by impact (High, Medium, Low).
4. Do NOT mention the names of the internal agents in your response.

Required JSON Output:
{
  "executiveSummary": "",
  "unifiedAnalysis": {
    "strengths": [],
    "criticalGaps": []
  },
  "rankedRecommendations": [
    {
      "priority": "High | Medium | Low",
      "action": "",
      "reasoning": ""
    }
  ],
  "strategicRoadmap": []
}
`;

    try {
      const response = await generate({
        providerName: 'gemini',
        feature: 'ResponseFusion',
        prompt: fusionPrompt,
        responseType: 'json',
        options: { temperature: 0.3 }
      });

      return {
        success: !response.error,
        data: response.data || null,
        error: response.error || null,
        agentsFused: Object.keys(agentOutputs),
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('[Response Fusion] Fusion failed:', error);
      return {
        success: false,
        data: null,
        error: error.message,
        agentsFused: Object.keys(agentOutputs),
        timestamp: Date.now()
      };
    }
  }
};
