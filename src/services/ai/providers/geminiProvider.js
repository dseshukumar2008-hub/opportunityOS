import { analyticsService } from '../../analyticsService';
import { AIError, AIErrorTypes } from '../aiErrors';

const getApiKey = () => {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) throw new Error('VITE_GEMINI_API_KEY is not configured.');
  return key;
};

export const geminiProvider = {
  name: 'gemini',
  async generate(request) {
    const { prompt, feature, options = {} } = request;
    const { systemInstruction = null, inlineDataItems = [], temperature = 0.3, timeoutMs = 30000 } = options;
    const featureName = feature || 'Unknown';

    const apiKey = getApiKey();
  
    const parts = [{ text: prompt }];
    if (inlineDataItems && inlineDataItems.length > 0) {
      inlineDataItems.forEach(item => {
        parts.push({
          inline_data: {
            mime_type: item.mimeType,
            data: item.data
          }
        });
      });
    }

    let contents = [{ parts }];
    if (options.contents) {
      contents = options.contents;
    }

    const requestBody = {
      contents: contents,
      generationConfig: { 
        temperature: temperature, 
      }
    };

    if (request.responseType === 'json') {
      requestBody.generationConfig.responseMimeType = 'application/json';
    }

    if (systemInstruction) {
      requestBody.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    // Fast hash function for the prompt to use as cache key
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
        // Ignored
      }
    }

    const apiKeyPrefix = apiKey.substring(0, 20) + '...';
    console.log('\n--- VERIFICATION AUDIT (geminiProvider) ---');
    console.log(`RUNTIME API KEY (first 20): ${apiKeyPrefix}`);
    console.log(`VITE ENV KEY (first 20): ${import.meta.env.VITE_GEMINI_API_KEY?.substring(0, 20)}...`);
    console.log(`MODEL: gemini-2.5-flash`);
    console.log(`FEATURE: ${featureName}`);

    let response;
    const startTime = Date.now();
    try {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify(requestBody),
          signal: controller.signal
        }
      );
      console.log(`HTTP STATUS: ${response.status}`);
    } catch (err) {
      console.error(`EXACT EXCEPTION in fetch (geminiProvider.js):`, err.message);
      if (err.name === 'AbortError') {
        analyticsService.trackError('Gemini API Timeout', err);
        analyticsService.trackAIOperation(featureName, 0, Date.now() - startTime, false, 'Timeout');
        throw new AIError(AIErrorTypes.AI_TIMEOUT, 'Request timed out.', 'gemini');
      }
      analyticsService.trackError('Gemini API Error', err);
      analyticsService.trackAIOperation(featureName, 0, Date.now() - startTime, false, err.message);
      throw new AIError(AIErrorTypes.AI_NETWORK_ERROR, 'Network connection issue detected.', 'gemini');
    }

    if (response.status === 429 || response.status >= 500) {
      clearTimeout(timeoutId);
      console.warn(`[Gemini Service] AI Service Unavailable (${response.status}).`);
      analyticsService.trackAIOperation(featureName, 0, Date.now() - startTime, false, `Rate Limit or Server Error: ${response.status}`);
      
      const type = response.status === 429 ? AIErrorTypes.AI_RATE_LIMIT : AIErrorTypes.AI_SERVER_ERROR;
      throw new AIError(type, `Service unavailable (${response.status}).`, 'gemini', response.status);
    }

    if (!response.ok) {
      clearTimeout(timeoutId);
      const rawErrorText = await response.text();
      console.error('[Gemini Service] HTTP Error response body:', rawErrorText);
      let errorMsg = `HTTP Error: ${response.status}`;
      try {
        const errJson = JSON.parse(rawErrorText);
        if (errJson?.error?.message) errorMsg = errJson.error.message;
      } catch (e) {
        // Ignored
      }
      analyticsService.trackError('Gemini API HTTP Error', new Error(errorMsg));
      analyticsService.trackAIOperation(featureName, 0, Date.now() - startTime, false, errorMsg);
      
      const type = (response.status === 401 || response.status === 403) 
        ? AIErrorTypes.AI_AUTH_ERROR 
        : AIErrorTypes.AI_UNKNOWN_ERROR;
        
      throw new AIError(type, errorMsg, 'gemini', response.status);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    const responseTime = Date.now() - startTime;
    const tokenUsage = data.usageMetadata?.totalTokenCount || 'N/A';
    console.log(`[Gemini API] Request completed. Time: ${responseTime}ms | Tokens: ${tokenUsage} | Prompt length: ${prompt.length} chars`);

    if (!rawText) {
      console.error('[Gemini Service] Missing rawText in response body:', JSON.stringify(data));
      analyticsService.trackError('Gemini Empty Response', new Error('Empty response'));
      analyticsService.trackAIOperation(featureName, tokenUsage, responseTime, false, 'Empty response');
      throw new AIError(AIErrorTypes.AI_UNKNOWN_ERROR, 'Empty response from provider.', 'gemini');
    }

    console.log(`RAW GEMINI RESPONSE:\n${rawText}`);

    if (request.responseType === 'text') {
      analyticsService.trackAIOperation(featureName, tokenUsage, responseTime, true, null);
      return rawText.trim();
    }

    // Extract JSON object/array robustly even if there's conversational preamble
    const cleaned = rawText.replace(/[\s\S]*?(?:```(?:json)?\s*)?({[\s\S]*}|\[[\s\S]*\])[\s\S]*/i, '$1').trim();
    
    try {
      const parsed = JSON.parse(cleaned);
      console.log(`PARSED GEMINI RESPONSE:`, JSON.stringify(parsed, null, 2));
      analyticsService.trackAIOperation(featureName, tokenUsage, responseTime, true, null);
      
      // Save to cache on success
      try {
        localStorage.setItem(cacheKey, JSON.stringify(parsed));
      } catch(e) {
        console.warn("Could not cache Gemini result (maybe too large):", e);
      }
      
      return parsed;
    } catch (parseError) {
      console.error('[Resume Analysis Error] Failed to parse Gemini JSON response.', parseError);
      console.error('Raw text received:', rawText);
      analyticsService.trackError('Gemini Parse Error', parseError);
      analyticsService.trackAIOperation(featureName, tokenUsage, responseTime, false, 'JSON Parse Error');
      throw new AIError(AIErrorTypes.AI_UNKNOWN_ERROR, `Failed to parse JSON response: ${parseError.message}`, 'gemini');
    } finally {
      clearTimeout(timeoutId);
    }
  }
};
