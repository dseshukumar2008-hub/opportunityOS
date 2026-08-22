import { analyticsService } from '../../analyticsService';
import { AIError, AIErrorTypes } from '../aiErrors';
import { auth } from '../../../config/firebase';

export const geminiProvider = {
  name: 'gemini',
  async generate(request) {
    const { prompt, feature, options = {} } = request;
    const { systemInstruction = null, inlineDataItems = [], temperature = 0.3, timeoutMs = 30000 } = options;
    const featureName = feature || 'Unknown';

    let hash = 0;
    for (let i = 0; i < prompt.length; i++) {
      hash = ((hash << 5) - hash) + prompt.charCodeAt(i);
      hash |= 0;
    }
    const cacheKey = `gemini_cache_${hash}_${featureName.replace(/\s+/g, '')}`;
    
    const cachedResponse = localStorage.getItem(cacheKey);
    if (cachedResponse) {
      try {
        const parsedCache = JSON.parse(cachedResponse);
        console.log(`[Gemini API] Returned CACHED result for ${featureName}`);
        return parsedCache;
      } catch(e) {
      }
    }

    let response;
    const startTime = Date.now();
    try {
      if (!auth.currentUser) {
        throw new AIError(AIErrorTypes.AI_AUTH_ERROR, 'User must be authenticated to use AI features.', 'gemini');
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
          providerName: 'gemini',
          feature: featureName,
          prompt: prompt,
          responseType: request.responseType,
          options: {
            systemInstruction,
            temperature,
            inlineDataItems,
            maxTokens: options.maxTokens
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
      console.error(`EXACT EXCEPTION in Render backend (geminiProvider.js):`, err.message);
      analyticsService.trackError('Gemini API Error (Render)', err);
      analyticsService.trackAIOperation(featureName, 0, Date.now() - startTime, false, err.message);
      
      let errorType = AIErrorTypes.AI_UNKNOWN_ERROR;
      if (err.message && err.message.toLowerCase().includes('unauthenticated')) errorType = AIErrorTypes.AI_AUTH_ERROR;
      
      throw new AIError(errorType, err.message || 'Unknown error occurred.', 'gemini');
    }

    const responseTime = Date.now() - startTime;
    console.log(`[Gemini API] Cloud Function Request completed. Time: ${responseTime}ms`);

    const rawText = response.data;
    if (!rawText) {
      analyticsService.trackError('Gemini Empty Response', new Error('Empty response'));
      analyticsService.trackAIOperation(featureName, 'N/A', responseTime, false, 'Empty response');
      throw new AIError(AIErrorTypes.AI_UNKNOWN_ERROR, 'Empty response from provider.', 'gemini');
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
      analyticsService.trackError('Gemini Parse Error', parseError);
      analyticsService.trackAIOperation(featureName, 'N/A', responseTime, false, 'JSON Parse Error');
      throw new AIError(AIErrorTypes.AI_UNKNOWN_ERROR, `Failed to parse JSON response: ${parseError.message}`, 'gemini');
    }
  }
};
