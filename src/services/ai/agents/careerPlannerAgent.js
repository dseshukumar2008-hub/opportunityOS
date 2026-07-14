import { generate } from '../aiProvider';

/**
 * Specialized AI Agent for High-Level Career Planning
 */
export const careerPlannerAgent = {
  /**
   * Synthesizes overarching career strategies and identifies hidden potential.
   * @param {Object} aiContext - The unified AI context
   * @param {Object} payload - Additional context or specific user questions
   * @returns {Object} Standardized AIResponse
   */
  async execute(aiContext, payload = {}) {
    const prompt = `You are the Career Planner Agent.
    Your specific responsibility is to act as a high-level strategist. Identify alternative career paths (hidden potential) and synthesize a macro-level career strategy.
    
    Payload: ${JSON.stringify(payload)}
    
    Required JSON Output:
    {
      "primaryStrategy": "",
      "alternativePaths": [
        {
          "role": "",
          "viabilityScore": 0,
          "reasoning": ""
        }
      ],
      "strategicAdvice": []
    }
    `;
    
    try {
      const response = await generate({
        providerName: 'gemini',
        feature: 'Agent_CareerPlanner',
        prompt,
        responseType: 'json',
        options: { temperature: 0.5 }
      });
      
      return {
        agentName: 'CareerPlannerAgent',
        success: !response.error,
        data: response.data || null,
        error: response.error || null,
        timestamp: Date.now()
      };
    } catch (e) {
      return { agentName: 'CareerPlannerAgent', success: false, data: null, error: e.message, timestamp: Date.now() };
    }
  }
};
