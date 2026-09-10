import { getDefaultProvider, getProvider, registerProvider } from './providerRegistry';
import { normalizeResponse, createErrorResponse } from './responseParser';
import { geminiProvider } from './providers/geminiProvider';
import { groqProvider } from './providers/groqProvider';
import { openRouterProvider } from './providers/openRouterProvider';
import { templateProvider } from './providers/templateProvider';
import { aiLogger } from './aiLogger';
import { providerHealth } from './providerHealth';
import { aiCache } from './aiCache';
import { AIErrorTypes, AIError } from './aiErrors';

registerProvider('gemini', geminiProvider);
registerProvider('groq', groqProvider);
registerProvider('openrouter', openRouterProvider);
registerProvider('template', templateProvider);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function executeWithRetry(provider, request, isFallback = false) {
  let attempt = 1;
  const maxAttempts = isFallback ? 1 : 2;
  while (attempt <= maxAttempts) {
    try {
      return await provider.generate(request);
    } catch (error) {
      const isRetryEligible =
        error.type === AIErrorTypes.AI_NETWORK_ERROR ||
        error.type === AIErrorTypes.AI_RATE_LIMIT ||
        error.type === AIErrorTypes.AI_SERVER_ERROR ||
        (!isFallback && error.type === AIErrorTypes.AI_TIMEOUT);

      if (!isRetryEligible || attempt === maxAttempts || error.type === AIErrorTypes.AI_QUOTA_EXHAUSTED) {
        throw error;
      }

      const delay = attempt === 1 ? 2000 : 5000;
      console.warn(`[AIProvider] ${provider.name} failed (Attempt ${attempt}): ${error.message}. Retrying in ${delay}ms...`);
      await sleep(delay);
      attempt++;
    }
  }
}

async function executeAndProcess(providerName, modelUsed, request, isFallback) {
  const provider = getProvider(providerName);
  if (!provider) {
    throw new Error(`Provider ${providerName} not found.`);
  }

  const { feature = 'UnknownFeature' } = request;
  const startTime = Date.now();

  try {
    const rawResponse = await executeWithRetry(provider, request, isFallback);
    const endTime = Date.now();

    aiLogger.logRequest({
      feature,
      provider: providerName,
      model: modelUsed,
      startTime,
      endTime,
      success: true,
      errorType: null,
      fallbackOccurred: isFallback
    });

    providerHealth.recordSuccess(providerName, endTime - startTime);

    const normalizedResponse = normalizeResponse(rawResponse, providerName, modelUsed);

    // Never cache template/offline sentinel responses — they must not be served
    // from cache on retries, so real providers always get another chance.
    const isTemplateFallback = providerName === 'template';
    const _cacheData = normalizedResponse?.data;
    const isOfflineSentinel =
      _cacheData?.targetRole === 'Offline' ||
      _cacheData?._fallbackMode === true ||
      (_cacheData?.readinessScore === 0 && _cacheData?.skillGapPercentage === 100 &&
       Array.isArray(_cacheData?.currentSkills) && _cacheData.currentSkills.length === 0);

    if (normalizedResponse && _cacheData && !normalizedResponse.error && !isTemplateFallback && !isOfflineSentinel) {
      aiCache.set(request, normalizedResponse);
    }

    return normalizedResponse;
  } catch (error) {
    providerHealth.recordFailure(providerName, error);
    aiLogger.logRequest({
      feature,
      provider: providerName,
      model: modelUsed,
      startTime,
      endTime: Date.now(),
      success: false,
      errorType: error.type || (isFallback ? 'FALLBACK_ERROR' : 'UNKNOWN_ERROR'),
      fallbackOccurred: isFallback
    });
    throw error;
  }
}

export async function generate(request) {
  const startTime = Date.now();
  const { providerName, feature = 'UnknownFeature' } = request;


  if (!request.options) request.options = {};

  if (request.options.injectGlobalContext) {
    const safeParse = (key) => {
      try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
    };

    const resumeData = safeParse('resumeData') || {};
    const careerData = safeParse('oppOs_career_context') || {};

    const aiContext = {
      profile: resumeData.profile || null,
      resume: resumeData,
      careerGoal: careerData,
      skills: resumeData.skills || [],
      projects: resumeData.projects || [],
      careerRoadmap: safeParse('oppOs_roadmap') || null,
      achievements: resumeData.achievements || [],
      memorySummary: null
    };

    const contextString = `
<OPPORTUNITY_OS_CONTEXT>
${JSON.stringify(aiContext)}
</OPPORTUNITY_OS_CONTEXT>
`;

    if (request.options.systemInstruction) {
      request.options.systemInstruction = request.options.systemInstruction + '\n' + contextString;
    } else {
      request.options.systemInstruction = contextString;
    }
  }

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
    return createErrorResponse(error, targetProviderName, 'unknown');
  }

  const primaryModel = primaryProvider.name === 'groq' ? 'llama-3.3-70b-versatile' : 'gemini-2.5-flash';

  try {
    return await executeAndProcess(primaryProvider.name, primaryModel, request, false);
  } catch (primaryError) {
    const isFallbackEligible =
      primaryError.type === AIErrorTypes.AI_NETWORK_ERROR ||
      primaryError.type === AIErrorTypes.AI_RATE_LIMIT ||
      primaryError.type === AIErrorTypes.AI_QUOTA_EXHAUSTED ||
      primaryError.type === AIErrorTypes.AI_SERVER_ERROR ||
      primaryError.type === AIErrorTypes.AI_TIMEOUT ||
      primaryError.type === AIErrorTypes.AI_PARSE_ERROR ||
      primaryError.type === AIErrorTypes.AI_UNKNOWN_ERROR;

    if (isFallbackEligible) {
      const fallbacks = [
        { name: 'groq', model: 'llama-3.3-70b-versatile' },
        { name: 'openrouter', model: 'deepseek/deepseek-chat-v3-0324' },
        { name: 'template', model: 'local-templates' }
      ];

      for (const fb of fallbacks) {
        if (fb.name === primaryProvider.name) continue;

        console.warn(`[AIProvider] Attempting fallback to ${fb.name}...`);

        try {
          return await executeAndProcess(fb.name, fb.model, request, true);
        } catch (fbError) {
          console.error(`[AIProvider] ${fb.name} fallback failed:`, fbError.message);

        }
      }


      if (primaryError.type === AIErrorTypes.AI_QUOTA_EXHAUSTED || primaryError.type === AIErrorTypes.AI_RATE_LIMIT) {
        const capacityError = new AIError(
          primaryError.type,
          'All AI providers are currently at capacity. Please wait a few minutes and try again.',
          primaryError.provider,
          primaryError.status
        );
        return createErrorResponse(capacityError, primaryProvider.name, primaryModel);
      }
      return createErrorResponse(primaryError, primaryProvider.name, primaryModel);
    }

    // Not eligible for fallback, or not gemini
    return createErrorResponse(primaryError, primaryProvider.name, primaryModel);
  }
}
