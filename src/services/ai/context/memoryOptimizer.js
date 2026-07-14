import { generate } from '../aiProvider';
import { memoryManager } from './memoryManager';

/**
 * Smart Memory Optimizer
 * Compresses raw conversation history into structured, high-value AI context.
 */
export const memoryOptimizer = {
  /**
   * Summarizes a full conversation into a compact memory block.
   * Discards greetings, small talk, and duplicate messages.
   * Extracts Important goals, Preferences, Decisions, and AI recommendations.
   * 
   * @param {Array} messages - The raw message history
   * @returns {Object} Compressed memory payload
   */
  async compressConversation(messages) {
    if (!messages || messages.length === 0) return null;

    const prompt = `
Analyze the following conversation history between a user and an AI Career Assistant.
Extract and summarize the most important context to keep for future memory.

Requirements:
- Store: Important goals, Preferences, Decisions, AI recommendations.
- Discard: Greetings, Small talk, Duplicate messages, Generic responses.
- Keep the output extremely compact and concise.

Conversation:
${JSON.stringify(messages.map(m => ({ role: m.role, text: m.text || m.content })))}

Return ONLY a JSON object with this exact structure:
{
  "importantGoals": ["goal 1", ...],
  "preferences": ["pref 1", ...],
  "decisions": ["decision 1", ...],
  "aiRecommendations": ["rec 1", ...]
}
`;

    try {
      const response = await generate({
        providerName: 'gemini', // Fast provider for summarization
        feature: 'MemoryOptimization',
        prompt: prompt,
        responseType: 'json',
        options: {
          temperature: 0.1,
          systemInstruction: 'You are an AI Memory Optimizer. Your job is to strictly compress conversation history into high-value JSON context.'
        }
      });

      if (response && response.data && !response.error) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('[MemoryOptimizer] Failed to compress conversation:', error);
      return null;
    }
  },

  /**
   * Optimizes and saves the conversation directly into memoryManager
   */
  async optimizeAndSave(category, messages) {
    const compressed = await this.compressConversation(messages);
    if (compressed) {
      memoryManager.saveMemory(category, compressed);
    }
  }
};
