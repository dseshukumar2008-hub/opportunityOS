import { generate } from '../aiProvider';
import { AgentRoles, createEmptyOrchestrationState } from './orchestrationTypes';
import { responseFusion } from './responseFusion';
import { resumeAgent } from '../agents/resumeAgent';
import { skillGapAgent } from '../agents/skillGapAgent';
import { roadmapAgent } from '../agents/roadmapAgent';
import { opportunityAgent } from '../agents/opportunityAgent';
import { careerPlannerAgent } from '../agents/careerPlannerAgent';

const AGENT_MAP = {
  [AgentRoles.RESUME]: resumeAgent,
  [AgentRoles.SKILL_GAP]: skillGapAgent,
  [AgentRoles.ROADMAP]: roadmapAgent,
  [AgentRoles.OPPORTUNITY]: opportunityAgent,
  [AgentRoles.CAREER_PLANNER]: careerPlannerAgent
};

/**
 * AI Orchestrator
 * Coordinates multiple AI agents to fulfill complex requests.
 */
export const aiOrchestrator = {
  /**
   * Processes a complex AI request by orchestrating multiple agents.
   */
  async processRequest(userPrompt, aiContext = {}, basePayload = {}) {
    const state = createEmptyOrchestrationState();
    state.originalRequest = userPrompt;

    try {
      // Phase 1: EVALUATION - Decide which agents are needed
      state.status = 'EVALUATING';
      let plan = await this._evaluateRequirements(userPrompt);
      
      // Enforce the specific planning flow per user requirements
      // Planner decides the agents. We always route to Career Planner last if it's a career query.
      if (!plan || plan.length === 0) {
        plan = [AgentRoles.CAREER_PLANNER];
      } else {
        // Ensure career planner synthesizes at the end
        if (!plan.includes(AgentRoles.CAREER_PLANNER)) {
          plan.push(AgentRoles.CAREER_PLANNER);
        }
      }
      
      state.requiredAgents = plan;

      // Phase 2: EXECUTION - Execute independent agents in parallel
      state.status = 'EXECUTING';
      
      const independentAgents = state.requiredAgents.filter(a => a !== AgentRoles.CAREER_PLANNER);
      
      const parallelPromises = independentAgents.map(async (agentName) => {
        const agentImpl = AGENT_MAP[agentName];
        if (agentImpl) {
          const payload = {
            ...basePayload,
            userRequest: userPrompt
          };
          const output = await agentImpl.execute(aiContext, payload);
          return { agentName, output };
        }
        return null;
      });
      
      const parallelResults = await Promise.all(parallelPromises);
      
      // Store parallel results
      for (const result of parallelResults) {
        if (result) {
          state.agentOutputs[result.agentName] = result.output;
        }
      }
      
      // Execute the Synthesizer/Planner agent last if it's in the required list
      if (state.requiredAgents.includes(AgentRoles.CAREER_PLANNER)) {
        const plannerImpl = AGENT_MAP[AgentRoles.CAREER_PLANNER];
        const payload = {
          ...basePayload,
          userRequest: userPrompt,
          previousAgentOutputs: state.agentOutputs // Hand off parallel results to the planner
        };
        const output = await plannerImpl.execute(aiContext, payload);
        state.agentOutputs[AgentRoles.CAREER_PLANNER] = output;
      }

      // Phase 3: SYNTHESIS - Return unified response using Response Fusion Engine
      state.status = 'SYNTHESIZING';
      state.unifiedResponse = await responseFusion.mergeOutputs(userPrompt, state.agentOutputs);
      
      state.status = 'COMPLETED';
      state.endTime = Date.now();
      
      return state.unifiedResponse;
    } catch (error) {
      console.error('[AI Orchestrator] Orchestration failed:', error);
      state.status = 'FAILED';
      state.errors.push(error.message);
      state.endTime = Date.now();
      
      // Fallback
      return this._fallbackResponse(userPrompt, error);
    }
  },

  /**
   * Asks an LLM to evaluate which agents are required to fulfill the request.
   */
  async _evaluateRequirements(prompt) {
    const evalPrompt = `
You are the AI Planning Engine.
Your job is to decide which specialized agents are required to fulfill the user's request:
User Request: "${prompt}"

Available Agents:
- "ResumeAgent": Analyzes resumes.
- "SkillGapAgent": Identifies missing skills for a role.
- "RoadmapAgent": Builds step-by-step career timelines.
- "OpportunityAgent": Evaluates job matches.
- "CareerPlannerAgent": High-level strategist and synthesizer.

Return ONLY a JSON array of the exact agent names required in sequential logical order.
Example: ["ResumeAgent", "SkillGapAgent", "RoadmapAgent", "CareerPlannerAgent"]
`;
    try {
      const response = await generate({
        providerName: 'gemini',
        feature: 'OrchestratorEvaluation',
        prompt: evalPrompt,
        responseType: 'json',
        options: { temperature: 0.1 }
      });
      return Array.isArray(response.data) ? response.data : [AgentRoles.CAREER_PLANNER];
    } catch (e) {
      console.warn('[AI Orchestrator] Evaluation failed, defaulting to CareerPlanner', e);
      return [AgentRoles.CAREER_PLANNER];
    }
  },



  /**
   * Fallback if the multi-agent system fails.
   */
  async _fallbackResponse(prompt, error) {
    try {
      const fallback = await generate({
        providerName: 'groq',
        feature: 'OrchestratorFallback',
        prompt: prompt,
        responseType: 'text'
      });
      return {
        finalAnswer: fallback.content,
        agentsUsed: ['FALLBACK'],
        error: error.message
      };
    } catch (e) {
      return {
        finalAnswer: "I apologize, but I am currently unable to process your request.",
        agentsUsed: [],
        error: 'Critical orchestration failure.'
      };
    }
  }
};
