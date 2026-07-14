/**
 * Types and constants for the AI Orchestrator
 */

export const AgentRoles = {
  RESUME: 'ResumeAgent',
  SKILL_GAP: 'SkillGapAgent',
  ROADMAP: 'RoadmapAgent',
  OPPORTUNITY: 'OpportunityAgent',
  CAREER_PLANNER: 'CareerPlannerAgent'
};

export const OrchestrationPhases = {
  EVALUATION: 'EVALUATION', 
  EXECUTION: 'EXECUTION',   
  SYNTHESIS: 'SYNTHESIS'    
};

export const createEmptyOrchestrationState = () => ({
  requestId: crypto.randomUUID(),
  originalRequest: null,
  requiredAgents: [],
  agentOutputs: {},
  unifiedResponse: null,
  status: 'PENDING',
  startTime: Date.now(),
  endTime: null,
  errors: []
});
