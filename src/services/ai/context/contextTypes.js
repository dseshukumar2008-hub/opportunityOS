/**
 * Standardized AIContext structure
 * Defines the strict schema for AI Context injected into prompts.
 * 
 * @typedef {Object} AIContext
 * @property {Object} profile - User's core profile (name, headline, bio)
 * @property {Object} resume - Parsed resume data
 * @property {Object} careerGoal - Target role, timeline, and aspirations
 * @property {Array} skills - Current and missing skills
 * @property {Array} projects - User's portfolio projects
 * @property {Object} careerRoadmap - Currently active roadmap milestones
 * @property {Array} achievements - Certifications, awards, and milestones
 * @property {Object} memorySummary - History of interactions from memoryManager
 */

export const createEmptyContext = () => ({
  profile: null,
  resume: null,
  careerGoal: null,
  skills: [],
  projects: [],
  careerRoadmap: null,
  achievements: [],
  memorySummary: null
});
