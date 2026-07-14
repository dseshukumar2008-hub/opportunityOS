/**
 * Single entry point for every AI request.
 */
import { getDefaultProvider, getProvider, registerProvider } from './providerRegistry';
import { normalizeResponse, createErrorResponse } from './responseParser';
import { geminiProvider } from './providers/geminiProvider';
import { groqProvider } from './providers/groqProvider';
import { openRouterProvider } from './providers/openRouterProvider';
import { templateProvider } from './providers/templateProvider';
import { aiLogger } from './aiLogger';
import { providerHealth } from './providerHealth';
import { aiCache } from './aiCache';
import { AIErrorTypes } from './aiErrors';
import { contextEngine } from './context/contextEngine';
import { memoryManager } from './context/memoryManager';

// Register providers
registerProvider('gemini', geminiProvider);
registerProvider('groq', groqProvider);
registerProvider('openrouter', openRouterProvider);
registerProvider('template', templateProvider);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function executeWithRetry(provider, request) {
  let attempt = 1;
  while (attempt <= 3) {
    try {
      return await provider.generate(request);
    } catch (error) {
      const isRetryEligible = 
        error.type === AIErrorTypes.AI_NETWORK_ERROR ||
        error.type === AIErrorTypes.AI_RATE_LIMIT ||
        error.type === AIErrorTypes.AI_SERVER_ERROR ||
        error.type === AIErrorTypes.AI_TIMEOUT;

      if (!isRetryEligible || attempt === 3) {
        throw error;
      }
      
      const delay = attempt === 1 ? 2000 : 5000;
      console.warn(`[AIProvider] ${provider.name} failed (Attempt ${attempt}): ${error.message}. Retrying in ${delay}ms...`);
      await sleep(delay);
      attempt++;
    }
  }
}

export async function generate(request) {
  const startTime = Date.now();
  const { providerName, feature = 'UnknownFeature' } = request;
  
  // --- AI CONTEXT INJECTION (PHASE 5.3) ---
  const safeParse = (key) => {
    try { return JSON.parse(localStorage.getItem(key)); } catch(e) { return null; }
  };

  const resumeData = safeParse('resumeData') || {};
  const careerData = safeParse('oppOs_career_context') || {};

  const rawContextData = {
    resume: resumeData,
    skills: resumeData.skills || [],
    projects: resumeData.projects || [],
    careerGoal: careerData,
    careerRoadmap: safeParse('oppOs_roadmap') || null,
    memorySummary: memoryManager.summarizeMemory()
  };

  const aiContext = contextEngine.buildContext(rawContextData);

  const contextString = `
<OPPORTUNITY_OS_CONTEXT>
${JSON.stringify(aiContext)}
</OPPORTUNITY_OS_CONTEXT>
`;

  if (!request.options) request.options = {};
  if (request.options.systemInstruction) {
    request.options.systemInstruction = request.options.systemInstruction + '\n' + contextString;
  } else {
    request.options.systemInstruction = contextString;
  }
  // ----------------------------------------
  
  // 1. Check Cache
  const cachedResponse = aiCache.get(request);
  if (cachedResponse) {
    console.log(`[AIProvider] CACHE HIT for feature: ${feature}`);
    aiLogger.logRequest({
      feature,
      provider: 'cache',
      model: 'memory',
      startTime,
      endTime: Date.now(),
      success: true,
      errorType: null,
      fallbackOccurred: false
    });
    return cachedResponse;
  }
  
  // Select provider, defaulting to 'gemini'
  const targetProviderName = providerName || 'gemini';
  const primaryProvider = getProvider(targetProviderName) || getDefaultProvider();
  
  if (!primaryProvider) {
    const error = new Error(`Provider ${targetProviderName} not found.`);
    aiLogger.logRequest({
      feature,
      provider: targetProviderName,
      model: 'unknown',
      startTime,
      endTime: Date.now(),
      success: false,
      errorType: 'PROVIDER_NOT_FOUND',
      fallbackOccurred: false
    });
    return createErrorResponse(error, request.providerName || 'gemini', 'unknown');
  }

  try {
    // Try the primary provider with Smart Retry Engine
    const rawResponse = await executeWithRetry(primaryProvider, request);
    
    const modelUsed = primaryProvider.name === 'groq' ? 'llama-3.3-70b-versatile' : 'gemini-2.5-flash';
    const endTime = Date.now();
    
    aiLogger.logRequest({
      feature,
      provider: primaryProvider.name,
      model: modelUsed,
      startTime,
      endTime,
      success: true,
      errorType: null,
      fallbackOccurred: false
    });
    
    providerHealth.recordSuccess(primaryProvider.name, endTime - startTime);
    
    const normalizedResponse = normalizeResponse(rawResponse, primaryProvider.name, modelUsed);
    
    // Only cache successful, non-empty responses
    if (normalizedResponse && normalizedResponse.content && !normalizedResponse.error) {
      aiCache.set(request, normalizedResponse);
    }
    
    return normalizedResponse;
  } catch (primaryError) {
    providerHealth.recordFailure(primaryProvider.name, primaryError);

    const isFallbackEligible = 
      primaryError.type === AIErrorTypes.AI_NETWORK_ERROR ||
      primaryError.type === AIErrorTypes.AI_RATE_LIMIT ||
      primaryError.type === AIErrorTypes.AI_SERVER_ERROR ||
      primaryError.type === AIErrorTypes.AI_TIMEOUT;
      
    if (isFallbackEligible && primaryProvider.name === 'gemini') {
      const fallbacks = [
        { name: 'groq', model: 'llama-3.3-70b-versatile' },
        { name: 'openrouter', model: 'deepseek/deepseek-chat-v3-0324' },
        { name: 'template', model: 'local-templates' }
      ];

      for (const fb of fallbacks) {
        const provider = getProvider(fb.name);
        if (!provider) continue;
        
        console.warn(`[AIProvider] Attempting fallback to ${fb.name}...`);
        const fbStartTime = Date.now();
        
        try {
          const fbResponse = await provider.generate(request);
          const fbEndTime = Date.now();
          
          aiLogger.logRequest({
            feature,
            provider: fb.name,
            model: fb.model,
            startTime: fbStartTime,
            endTime: fbEndTime,
            success: true,
            errorType: null,
            fallbackOccurred: true
          });
          providerHealth.recordSuccess(fb.name, fbEndTime - fbStartTime);
          
          const normFb = normalizeResponse(fbResponse, fb.name, fb.model);
          if (normFb && normFb.content && !normFb.error) {
            aiCache.set(request, normFb);
          }
          return normFb;
        } catch (fbError) {
          console.error(`[AIProvider] ${fb.name} fallback failed:`, fbError.message);
          aiLogger.logRequest({
            feature,
            provider: fb.name,
            model: fb.model,
            startTime: fbStartTime,
            endTime: Date.now(),
            success: false,
            errorType: fbError.type || 'FALLBACK_ERROR',
            fallbackOccurred: true
          });
          providerHealth.recordFailure(fb.name, fbError);
          // continue to next fallback
        }
      }
      
      // If all fallbacks fail, surface the original primary error
      throw primaryError;
    }
    
    aiLogger.logRequest({
      feature,
      provider: primaryProvider.name,
      model: primaryProvider.name === 'groq' ? 'llama-3.3-70b-versatile' : 'gemini-2.5-flash',
      startTime,
      endTime: Date.now(),
      success: false,
      errorType: primaryError.type || 'UNKNOWN_ERROR',
      fallbackOccurred: false
    });
    
    // Not eligible for fallback, or not gemini
    return createErrorResponse(primaryError, primaryProvider.name, 'unknown');
  }
}
