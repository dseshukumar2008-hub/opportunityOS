import { createEmptyContext } from './contextTypes';

/**
 * Context Builder Pattern
 * Allows incremental construction of the AI Context payload.
 */
export class ContextBuilder {
  constructor() {
    this.context = createEmptyContext();
  }

  withProfile(profile) {
    this.context.profile = profile || null;
    return this;
  }

  withResume(resume) {
    this.context.resume = resume || null;
    return this;
  }

  withCareerGoal(careerGoal) {
    this.context.careerGoal = careerGoal || null;
    return this;
  }

  withSkills(skills) {
    this.context.skills = skills || [];
    return this;
  }

  withProjects(projects) {
    this.context.projects = projects || [];
    return this;
  }

  withCareerRoadmap(roadmap) {
    this.context.careerRoadmap = roadmap || null;
    return this;
  }

  withAchievements(achievements) {
    this.context.achievements = achievements || [];
    return this;
  }

  withMemorySummary(summary) {
    this.context.memorySummary = summary || null;
    return this;
  }

  build() {
    // Return a fresh clone of the fully assembled context object
    return { ...this.context };
  }
}
