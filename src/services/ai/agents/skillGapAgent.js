import { generate } from '../aiProvider';

/**
 * Specialized AI Agent for Skill Gap Analysis
 */
export const skillGapAgent = {
  /**
   * Analyzes skill gaps between the user's current profile and a target role.
   * @param {Object} aiContext - The unified AI context
   * @param {Object} payload - Additional specific data for this run (e.g., target role)
   * @returns {Object} Standardized AIResponse
   */
  async execute(aiContext, payload = {}) {
    const prompt = `You are the Skill Gap Agent.
    Your specific responsibility is to identify missing skills by comparing the user's current profile against their target role.
    
    Payload: ${JSON.stringify(payload)}
    
    Required JSON Output:
    {
      "targetRole": "",
      "currentSkillsFound": [],
      "missingCoreSkills": [],
      "missingSecondarySkills": [],
      "learningRecommendations": []
    }
    `;
    
    try {
      const response = await generate({
        providerName: 'gemini',
        feature: 'Agent_SkillGap',
        prompt,
        responseType: 'json',
        options: { temperature: 0.3 }
      });
      
      return {
        agentName: 'SkillGapAgent',
        success: !response.error,
        data: response.data || null,
        error: response.error || null,
        timestamp: Date.now()
      };
    } catch (e) {
      return { agentName: 'SkillGapAgent', success: false, data: null, error: e.message, timestamp: Date.now() };
    }
  }
};
