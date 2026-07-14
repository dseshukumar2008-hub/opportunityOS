import { ContextBuilder } from './contextBuilder';

/**
 * The Centralized AI Context Engine
 * Responsible for aggregating and standardizing diverse user data 
 * into a single unified AI Context Object.
 */
export const contextEngine = {
  /**
   * Assembles a comprehensive AI context from disparate data sources.
   * 
   * @param {Object} rawData - Raw data fragments supplied by React hooks/services
   * @returns {Object} A standardized AIContext payload
   */
  buildContext: (rawData = {}) => {
    const builder = new ContextBuilder();

    builder
      .withProfile(rawData.profile)
      .withResume(rawData.resume)
      .withCareerGoal(rawData.careerGoal)
      .withSkills(rawData.skills)
      .withProjects(rawData.projects)
      .withCareerRoadmap(rawData.careerRoadmap)
      .withAchievements(rawData.achievements)
      .withMemorySummary(rawData.memorySummary);

    return builder.build();
  }
};
