import { generate } from '../aiProvider';

/**
 * Specialized AI Agent for Resume Analysis
 */
export const resumeAgent = {
  /**
   * Analyzes a resume against the user's context.
   * @param {Object} aiContext - The unified AI context
   * @param {Object} payload - Additional specific data for this run
   * @returns {Object} Standardized AIResponse
   */
  async execute(aiContext, payload = {}) {
    const prompt = `You are the Resume Agent.
    Your specific responsibility is to analyze the user's resume, extract key metrics, and provide optimization feedback.
    
    Payload: ${JSON.stringify(payload)}
    
    Required JSON Output:
    {
      "summary": "",
      "strengths": [],
      "weaknesses": [],
      "actionableFeedback": []
    }
    `;
    
    try {
      const response = await generate({
        providerName: 'gemini',
        feature: 'Agent_Resume',
        prompt,
        responseType: 'json',
        options: { temperature: 0.2 }
      });
      
      return {
        agentName: 'ResumeAgent',
        success: !response.error,
        data: response.data || null,
        error: response.error || null,
        timestamp: Date.now()
      };
    } catch (e) {
      return { agentName: 'ResumeAgent', success: false, data: null, error: e.message, timestamp: Date.now() };
    }
  }
};
