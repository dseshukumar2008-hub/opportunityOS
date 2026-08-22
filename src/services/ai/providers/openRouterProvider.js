import { analyticsService } from '../../analyticsService';
import { AIError, AIErrorTypes } from '../aiErrors';
import { auth } from '../../../config/firebase';

export const openRouterProvider = {
  name: 'openrouter',
  async generate(request) {
    const { prompt, feature, options = {} } = request;
    const { systemInstruction = null, temperature = 0.3, timeoutMs = 30000 } = options;
    const featureName = feature || 'Unknown';

    let messages = [];
    if (systemInstruction) {
      messages.push({ role: 'system', content: systemInstruction });
    }
    if (options.contents) {
      options.contents.forEach(item => {
        let role = item.role;
        if (role === 'model') role = 'assistant';
        const content = item.parts && item.parts[0] ? item.parts[0].text : '';
        if (content) messages.push({ role, content });
      });
    } else {
      messages.push({ role: 'user', content: prompt });
    }

    let hash = 0;
    const cacheString = JSON.stringify(messages);
    for (let i = 0; i < cacheString.length; i++) {
      hash = ((hash << 5) - hash) + cacheString.charCodeAt(i);
      hash |= 0;
    }
    const cacheKey = `openrouter_cache_${hash}_${featureName.replace(/\s+/g, '')}`;
    
    const cachedResponse = localStorage.getItem(cacheKey);
    if (cachedResponse) {
      try {
        const parsedCache = JSON.parse(cachedResponse);
        console.log(`[OpenRouter API] Returned CACHED result for ${featureName}`);
        return parsedCache;
      } catch(e) {}
    }

    let response;
    const startTime = Date.now();
    try {
      if (!auth.currentUser) {
        throw new AIError(AIErrorTypes.AI_AUTH_ERROR, 'User must be authenticated to use AI features.', 'openrouter');
      }

      const idToken = await auth.currentUser.getIdToken(true);
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

      const responsePromise = fetch(`${baseUrl}/api/ai/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          providerName: 'openrouter',
          feature: featureName,
          prompt: prompt,
          responseType: request.responseType,
          options: {
            systemInstruction,
            temperature,
            maxTokens: options.maxTokens,
            model: 'deepseek/deepseek-chat-v3-0324'
          }
        })
      });

      const res = await responsePromise;
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${res.status}`);
      }

      const functionResponse = await res.json();
      response = functionResponse.data;
    } catch (err) {
      console.error(`EXACT EXCEPTION in Render backend (openRouterProvider.js):`, err.message);
      analyticsService.trackError('OpenRouter API Error (Render)', err);
      analyticsService.trackAIOperation(featureName, 0, Date.now() - startTime, false, err.message);
      
      let errorType = AIErrorTypes.AI_UNKNOWN_ERROR;
      if (err.message && err.message.toLowerCase().includes('unauthenticated')) errorType = AIErrorTypes.AI_AUTH_ERROR;
      
      throw new AIError(errorType, err.message || 'Unknown error occurred.', 'openrouter');
    }

    const responseTime = Date.now() - startTime;
    console.log(`[OpenRouter API] Cloud Function Request completed. Time: ${responseTime}ms`);

    const rawText = response.data;
    if (!rawText) {
      analyticsService.trackError('OpenRouter Empty Response', new Error('Empty response'));
      analyticsService.trackAIOperation(featureName, 'N/A', responseTime, false, 'Empty response');
      throw new AIError(AIErrorTypes.AI_UNKNOWN_ERROR, 'Empty response from provider.', 'openrouter');
    }

    if (request.responseType === 'text') {
      analyticsService.trackAIOperation(featureName, 'N/A', responseTime, true, null);
      return rawText.trim();
    }

    const cleaned = rawText.replace(/[\s\S]*?(?:```(?:json)?\s*)?({[\s\S]*}|\[[\s\S]*\])[\s\S]*/i, '$1').trim();
    
    try {
      const parsed = JSON.parse(cleaned);
      analyticsService.trackAIOperation(featureName, 'N/A', responseTime, true, null);
      
      try {
        localStorage.setItem(cacheKey, JSON.stringify(parsed));
      } catch(e) {}
      
      return parsed;
    } catch (parseError) {
      analyticsService.trackError('OpenRouter Parse Error', parseError);
      analyticsService.trackAIOperation(featureName, 'N/A', responseTime, false, 'JSON Parse Error');
      throw new AIError(AIErrorTypes.AI_UNKNOWN_ERROR, `Failed to parse JSON response: ${parseError.message}`, 'openrouter');
    }
  }
};
