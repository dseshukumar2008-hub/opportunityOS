import { analyticsService } from '../../analyticsService';
import { AIError, AIErrorTypes } from '../aiErrors';

const getApiKey = () => {
  const key = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!key) throw new Error('VITE_OPENROUTER_API_KEY is not configured.');
  return key;
};

export const openRouterProvider = {
  name: 'openrouter',
  async generate(request) {
    const { prompt, feature, options = {} } = request;
    const { systemInstruction = null, temperature = 0.3, timeoutMs = 30000 } = options;
    const featureName = feature || 'Unknown';

    const apiKey = getApiKey();
  
    let messages = [];

    if (systemInstruction) {
      messages.push({ role: 'system', content: systemInstruction });
    }

    // Convert Gemini 'contents' format to OpenAI 'messages' format if provided
    if (options.contents) {
      options.contents.forEach(item => {
        let role = item.role;
        if (role === 'model') role = 'assistant';
        
        const content = item.parts && item.parts[0] ? item.parts[0].text : '';
        if (content) {
          messages.push({ role, content });
        }
      });
    } else {
      messages.push({ role: 'user', content: prompt });
    }

    const requestBody = {
      model: 'deepseek/deepseek-chat-v3-0324',
      messages: messages,
      temperature: temperature,
    };

    if (request.responseType === 'json') {
      requestBody.response_format = { type: 'json_object' };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    // Fast hash function for the prompt to use as cache key
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
      } catch(e) {
        // Ignored
      }
    }

    const apiKeyPrefix = apiKey.substring(0, 20) + '...';
    console.log('\n--- VERIFICATION AUDIT (openRouterProvider) ---');
    console.log(`RUNTIME API KEY (first 20): ${apiKeyPrefix}`);
    console.log(`MODEL: deepseek/deepseek-chat-v3-0324`);
    console.log(`FEATURE: ${featureName}`);

    let response;
    const startTime = Date.now();
    try {
      response = await fetch(
        `https://openrouter.ai/api/v1/chat/completions`,
        { 
          method: 'POST', 
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': 'https://opportunityos.app',
            'X-Title': 'OpportunityOS'
          }, 
          body: JSON.stringify(requestBody),
          signal: controller.signal
        }
      );
      console.log(`HTTP STATUS: ${response.status}`);
    } catch (err) {
      console.error(`EXACT EXCEPTION in fetch (openRouterProvider.js):`, err.message);
      if (err.name === 'AbortError') {
        analyticsService.trackError('OpenRouter API Timeout', err);
        analyticsService.trackAIOperation(featureName, 0, Date.now() - startTime, false, 'Timeout');
        throw new AIError(AIErrorTypes.AI_TIMEOUT, 'Request timed out.', 'openrouter');
      }
      analyticsService.trackError('OpenRouter API Error', err);
      analyticsService.trackAIOperation(featureName, 0, Date.now() - startTime, false, err.message);
      throw new AIError(AIErrorTypes.AI_NETWORK_ERROR, 'Network connection issue detected.', 'openrouter');
    }

    if (response.status === 429 || response.status >= 500) {
      clearTimeout(timeoutId);
      console.warn(`[OpenRouter Service] AI Service Unavailable (${response.status}).`);
      analyticsService.trackAIOperation(featureName, 0, Date.now() - startTime, false, `Rate Limit or Server Error: ${response.status}`);
      
      const type = response.status === 429 ? AIErrorTypes.AI_RATE_LIMIT : AIErrorTypes.AI_SERVER_ERROR;
      throw new AIError(type, `Service unavailable (${response.status}).`, 'openrouter', response.status);
    }

    if (!response.ok) {
      clearTimeout(timeoutId);
      const rawErrorText = await response.text();
      console.error('[OpenRouter Service] HTTP Error response body:', rawErrorText);
      let errorMsg = `HTTP Error: ${response.status}`;
      try {
        const errJson = JSON.parse(rawErrorText);
        if (errJson?.error?.message) errorMsg = errJson.error.message;
      } catch (e) {
        // Ignored
      }
      analyticsService.trackError('OpenRouter API HTTP Error', new Error(errorMsg));
      analyticsService.trackAIOperation(featureName, 0, Date.now() - startTime, false, errorMsg);
      
      const type = (response.status === 401 || response.status === 403) 
        ? AIErrorTypes.AI_AUTH_ERROR 
        : AIErrorTypes.AI_UNKNOWN_ERROR;
        
      throw new AIError(type, errorMsg, 'openrouter', response.status);
    }

    const data = await response.json();
    const rawText = data.choices?.[0]?.message?.content;
    
    const responseTime = Date.now() - startTime;
    const tokenUsage = data.usage?.total_tokens || 'N/A';
    console.log(`[OpenRouter API] Request completed. Time: ${responseTime}ms | Tokens: ${tokenUsage}`);

    if (!rawText) {
      console.error('[OpenRouter Service] Missing rawText in response body:', JSON.stringify(data));
      analyticsService.trackError('OpenRouter Empty Response', new Error('Empty response'));
      analyticsService.trackAIOperation(featureName, tokenUsage, responseTime, false, 'Empty response');
      throw new AIError(AIErrorTypes.AI_UNKNOWN_ERROR, 'Empty response from provider.', 'openrouter');
    }

    console.log(`RAW OPENROUTER RESPONSE:\n${rawText}`);

    if (request.responseType === 'text') {
      analyticsService.trackAIOperation(featureName, tokenUsage, responseTime, true, null);
      return rawText.trim();
    }

    // Extract JSON object/array robustly
    const cleaned = rawText.replace(/[\s\S]*?(?:```(?:json)?\s*)?({[\s\S]*}|\[[\s\S]*\])[\s\S]*/i, '$1').trim();
    
    try {
      const parsed = JSON.parse(cleaned);
      console.log(`PARSED OPENROUTER RESPONSE:`, JSON.stringify(parsed, null, 2));
      analyticsService.trackAIOperation(featureName, tokenUsage, responseTime, true, null);
      
      // Save to cache on success
      try {
        localStorage.setItem(cacheKey, JSON.stringify(parsed));
      } catch(e) {
        console.warn("Could not cache OpenRouter result:", e);
      }
      
      return parsed;
    } catch (parseError) {
      console.error('[OpenRouter Service] Failed to parse JSON response.', parseError);
      console.error('Raw text received:', rawText);
      analyticsService.trackError('OpenRouter Parse Error', parseError);
      analyticsService.trackAIOperation(featureName, tokenUsage, responseTime, false, 'JSON Parse Error');
      throw new AIError(AIErrorTypes.AI_UNKNOWN_ERROR, `Failed to parse JSON response: ${parseError.message}`, 'openrouter');
    } finally {
      clearTimeout(timeoutId);
    }
  }
};
