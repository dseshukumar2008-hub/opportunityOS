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
      const timeoutMs = options.timeoutMs || 15000;
      
      let response;
      const startTime = Date.now();
      const envUrl = import.meta.env.VITE_API_BASE_URL;
      const baseUrl = envUrl !== undefined ? envUrl : 'https://opportunityos-backend-frlw.onrender.com';
      
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), timeoutMs);
      
      const onAbort = () => abortController.abort();
      if (options.signal) {
        if (options.signal.aborted) throw new DOMException('Aborted', 'AbortError');
        options.signal.addEventListener('abort', onAbort);
      }
      
      try {
        if (!auth.currentUser) {
          throw new AIError(AIErrorTypes.AI_AUTH_ERROR, 'User must be authenticated to use AI features.', providerName);
        }

        if (abortController.signal.aborted) throw new DOMException('Aborted', 'AbortError');
        const abortPromise = new Promise((_, reject) => {
          abortController.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
        });
        const idToken = await Promise.race([
          auth.currentUser.getIdToken(),
          abortPromise
        ]);

        const apiOptions = optionsFormatter(options, prompt);

        const makeRequest = async (url) => {
          return await fetch(`${url}/api/ai/generate`, {
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
        };

        let res;
        try {
          res = await makeRequest(baseUrl);
        } catch (fetchErr) {
          if (baseUrl.includes('localhost') && fetchErr.name !== 'AbortError') {
            console.warn(`[${providerName}Provider] Localhost fetch failed, falling back to production URL...`);
            res = await makeRequest('https://opportunityos-backend-frlw.onrender.com');
          } else {
            throw fetchErr;
          }
        }

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
        let errorMessage = err.message || 'Unknown error occurred.';
        const lowerMsg = errorMessage.toLowerCase();

        if (lowerMsg.includes('[401]') || lowerMsg.includes('unauthenticated') || lowerMsg.includes('invalid or expired')) {
          errorType = AIErrorTypes.AI_AUTH_ERROR;
        } else if (lowerMsg.includes('[429]') || lowerMsg.includes('429')) {
          errorType = AIErrorTypes.AI_RATE_LIMIT;
        } else if (lowerMsg.includes('quota') || lowerMsg.includes('exhausted')) {
          errorType = AIErrorTypes.AI_QUOTA_EXHAUSTED;
        } else if (lowerMsg.includes('[500]') || lowerMsg.includes('500')) {
          errorType = AIErrorTypes.AI_SERVER_ERROR;
        } else if (lowerMsg.includes('failed to fetch') || lowerMsg.includes('networkerror') || lowerMsg.includes('fetch')) {
          errorType = AIErrorTypes.AI_NETWORK_ERROR;
          errorMessage = `Could not reach the AI backend server. Please check your internet connection and try again.`;
        } else if (err.name === 'AbortError' || lowerMsg.includes('timeout') || lowerMsg.includes('aborted')) {
          errorType = AIErrorTypes.AI_TIMEOUT;
          errorMessage = `The connection to the AI provider timed out after ${timeoutMs / 1000} seconds.`;
        }

        throw new AIError(errorType, errorMessage, providerName);
      } finally {
        // ensure timeout is cleared if error happens before fetch resolves
        if (typeof timeoutId !== 'undefined') clearTimeout(timeoutId);
        if (options.signal) options.signal.removeEventListener('abort', onAbort);
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
        throw new AIError(AIErrorTypes.AI_PARSE_ERROR, `Failed to parse JSON response from ${providerName}.`, providerName);
      }
    }
  };
}
