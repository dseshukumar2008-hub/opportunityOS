import { generate } from '../aiProvider';

/**
 * Specialized AI Agent for Opportunity Matching
 */
export const opportunityAgent = {
  /**
   * Analyzes an opportunity against the user's profile to determine fit.
   * @param {Object} aiContext - The unified AI context
   * @param {Object} payload - Specific opportunity description/requirements
   * @returns {Object} Standardized AIResponse
   */
  async execute(aiContext, payload = {}) {
    const prompt = `You are the Opportunity Agent.
    Your specific responsibility is to calculate how well the user fits a given job/opportunity description.
    
    Opportunity Payload: ${JSON.stringify(payload)}
    
    Required JSON Output:
    {
      "matchScore": 0,
      "keyMatches": [],
      "criticalGaps": [],
      "recommendation": "Apply | Upskill First | Pass"
    }
    `;
    
    try {
      const response = await generate({
        providerName: 'gemini',
        feature: 'Agent_Opportunity',
        prompt,
        responseType: 'json',
        options: { temperature: 0.2 }
      });
      
      return {
        agentName: 'OpportunityAgent',
        success: !response.error,
        data: response.data || null,
        error: response.error || null,
        timestamp: Date.now()
      };
    } catch (e) {
      return { agentName: 'OpportunityAgent', success: false, data: null, error: e.message, timestamp: Date.now() };
    }
  }
};
