import { analyticsService } from '../../analyticsService';
import { AIError, AIErrorTypes } from '../aiErrors';
import { auth } from '../../../config/firebase';
import { parseJSONResponse } from '../responseParser';

export function createApiProvider(providerName, optionsFormatter) {
  return {
    name: providerName,
    async generate(request) {
      const { prompt, feature, options = {} } = request;
      const featureName = feature || 'Unknown';
      const timeoutMs = options.timeoutMs || 60000;
      
      let response;
      const startTime = Date.now();
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
      
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), timeoutMs);
      
      try {
        if (!auth.currentUser) {
          throw new AIError(AIErrorTypes.AI_AUTH_ERROR, 'User must be authenticated to use AI features.', providerName);
        }

        const idToken = await auth.currentUser.getIdToken(true);

        const apiOptions = optionsFormatter(options, prompt);

        const res = await fetch(`${baseUrl}/api/ai/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
          signal: abortController.signal,
          body: JSON.stringify({
            providerName,
            feature: featureName,
            prompt: prompt,
            responseType: request.responseType || 'json',
            options: apiOptions
          })
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(`[${res.status}] ${errorData.message || `Server error: ${res.status}`}`);
        }

        const functionResponse = await res.json();
        response = functionResponse.data;
      } catch (err) {
        console.error(`[${providerName}Provider] Backend error:`, err.message);
        analyticsService.trackError(`${providerName} API Error`, err);
        analyticsService.trackAIOperation(featureName, 0, Date.now() - startTime, false, err.message);

        let errorType = AIErrorTypes.AI_UNKNOWN_ERROR;
        const lowerMsg = err.message ? err.message.toLowerCase() : '';

        if (lowerMsg.includes('[401]') || lowerMsg.includes('unauthenticated') || lowerMsg.includes('invalid or expired')) {
          errorType = AIErrorTypes.AI_AUTH_ERROR;
        } else if (lowerMsg.includes('[429]') || lowerMsg.includes('429')) {
          errorType = AIErrorTypes.AI_RATE_LIMIT;
        } else if (lowerMsg.includes('quota') || lowerMsg.includes('exhausted')) {
          errorType = AIErrorTypes.AI_QUOTA_EXHAUSTED;
        } else if (lowerMsg.includes('[500]') || lowerMsg.includes('500')) {
          errorType = AIErrorTypes.AI_SERVER_ERROR;
        } else if (lowerMsg.includes('failed to fetch') || lowerMsg.includes('networkerror')) {
          errorType = AIErrorTypes.AI_NETWORK_ERROR;
          err.message = `Cannot reach backend at ${baseUrl}. Is the local server running?`;
        } else if (err.name === 'AbortError' || lowerMsg.includes('timeout') || lowerMsg.includes('aborted')) {
          errorType = AIErrorTypes.AI_TIMEOUT;
          err.message = `The connection to the AI provider timed out after ${timeoutMs / 1000} seconds.`;
        }

        throw new AIError(errorType, err.message || 'Unknown error occurred.', providerName);
      } finally {
        // ensure timeout is cleared if error happens before fetch resolves
        if (typeof timeoutId !== 'undefined') clearTimeout(timeoutId);
      }

      const responseTime = Date.now() - startTime;
      console.log(`[${providerName} API] Cloud Function Request completed. Time: ${responseTime}ms`);

      const rawText = response?.data || response; // handle different nested structures if needed, usually response.data holds the string
      
      const textToParse = typeof rawText === 'object' ? rawText.data || JSON.stringify(rawText) : rawText;

      if (!textToParse) {
        analyticsService.trackError(`${providerName} Empty Response`, new Error('Empty response'));
        analyticsService.trackAIOperation(featureName, 'N/A', responseTime, false, 'Empty response');
        throw new AIError(AIErrorTypes.AI_UNKNOWN_ERROR, 'Empty response from provider.', providerName);
      }

      if (request.responseType === 'text') {
        analyticsService.trackAIOperation(featureName, 'N/A', responseTime, true, null);
        return textToParse.trim();
      }

      const parsed = parseJSONResponse(textToParse);
      if (parsed) {
        analyticsService.trackAIOperation(featureName, 'N/A', responseTime, true, null);
        return parsed;
      } else {
        console.error(`[${providerName}Provider] JSON Parse Error. Raw Text was:\n`, textToParse);
        analyticsService.trackError(`${providerName} Parse Error`, new Error('Failed to parse JSON'));
        analyticsService.trackAIOperation(featureName, 'N/A', responseTime, false, 'JSON Parse Error');
        throw new AIError(AIErrorTypes.AI_UNKNOWN_ERROR, `Failed to parse JSON response from ${providerName}.`, providerName);
      }
    }
  };
}
