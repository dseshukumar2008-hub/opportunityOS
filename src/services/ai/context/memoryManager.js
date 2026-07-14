/**
 * In-Memory Conversation Memory System for AI Context Engine
 * Stores histories for various AI features strictly in runtime memory.
 * No Firestore connections yet.
 */

class AIMemoryManager {
  constructor() {
    this.memory = {
      conversations: [],
      careerCoachHistory: [],
      copilotHistory: [],
      resumeReviewHistory: [],
      roadmapGenerationHistory: []
    };
  }

  /**
   * Saves a new memory entry for a specific feature category.
   * @param {string} category - Category (e.g. 'careerCoachHistory', 'copilotHistory')
   * @param {Object} data - The memory payload
   */
  saveMemory(category, data) {
    if (!this.memory[category]) {
      console.warn(`[AIMemoryManager] Invalid memory category: ${category}`);
      return;
    }
    
    this.memory[category].push({
      ...data,
      timestamp: Date.now()
    });
    
    // Bounded memory to prevent memory leaks in long sessions
    if (this.memory[category].length > 50) {
      this.memory[category].shift();
    }
  }

  /**
   * Loads the memory history for a specific category or the entire memory tree.
   * @param {string} [category] - Optional category to load
   * @returns {Array|Object}
   */
  loadMemory(category) {
    if (category) {
      if (!this.memory[category]) {
        console.warn(`[AIMemoryManager] Invalid memory category: ${category}`);
        return [];
      }
      return [...this.memory[category]];
    }
    
    // Return shallow copy of the entire memory object
    return { ...this.memory };
  }

  /**
   * Clears memory for a specific category or the entire memory block.
   * @param {string} [category] - Optional category to clear
   */
  clearMemory(category) {
    if (category) {
      if (this.memory[category]) {
        this.memory[category] = [];
      }
    } else {
      this.memory = {
        conversations: [],
        careerCoachHistory: [],
        copilotHistory: [],
        resumeReviewHistory: [],
        roadmapGenerationHistory: []
      };
    }
  }

  summarizeMemory() {
    const summary = {
      importantGoals: [],
      preferences: [],
      decisions: [],
      aiRecommendations: []
    };

    // Aggregate compressed data from all categories
    for (const key of Object.keys(this.memory)) {
      this.memory[key].forEach(entry => {
        if (entry.importantGoals) summary.importantGoals.push(...entry.importantGoals);
        if (entry.preferences) summary.preferences.push(...entry.preferences);
        if (entry.decisions) summary.decisions.push(...entry.decisions);
        if (entry.aiRecommendations) summary.aiRecommendations.push(...entry.aiRecommendations);
      });
    }

    // Deduplicate array values
    return {
      importantGoals: [...new Set(summary.importantGoals)],
      preferences: [...new Set(summary.preferences)],
      decisions: [...new Set(summary.decisions)],
      aiRecommendations: [...new Set(summary.aiRecommendations)],
      lastInteractionTime: this._getLastInteractionTime()
    };
  }

  /**
   * Helper to find the most recent interaction across all histories.
   */
  _getLastInteractionTime() {
    let latest = null;
    for (const key of Object.keys(this.memory)) {
      const history = this.memory[key];
      if (history.length > 0) {
        const last = history[history.length - 1];
        if (!latest || last.timestamp > latest) {
          latest = last.timestamp;
        }
      }
    }
    return latest;
  }
}

export const memoryManager = new AIMemoryManager();
