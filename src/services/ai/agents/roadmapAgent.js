import { generate } from '../aiProvider';

/**
 * Specialized AI Agent for Career Roadmap Generation
 */
export const roadmapAgent = {
  /**
   * Generates a step-by-step career roadmap.
   * @param {Object} aiContext - The unified AI context
   * @param {Object} payload - Additional specific data for this run
   * @returns {Object} Standardized AIResponse
   */
  async execute(aiContext, payload = {}) {
    const prompt = `You are the Roadmap Agent.
    Your specific responsibility is to map out a clear, chronological path for the user to reach their career goals based on their current context.
    
    Payload: ${JSON.stringify(payload)}
    
    Required JSON Output:
    {
      "overallGoal": "",
      "estimatedTimeframe": "",
      "milestones": [
        {
          "phase": "",
          "focus": "",
          "actionItems": []
        }
      ]
    }
    `;
    
    try {
      const response = await generate({
        providerName: 'gemini',
        feature: 'Agent_Roadmap',
        prompt,
        responseType: 'json',
        options: { temperature: 0.4 }
      });
      
      return {
        agentName: 'RoadmapAgent',
        success: !response.error,
        data: response.data || null,
        error: response.error || null,
        timestamp: Date.now()
      };
    } catch (e) {
      return { agentName: 'RoadmapAgent', success: false, data: null, error: e.message, timestamp: Date.now() };
    }
  }
};
