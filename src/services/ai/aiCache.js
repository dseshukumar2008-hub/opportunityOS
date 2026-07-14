/**
 * AI Response Cache
 * In-memory caching layer to prevent redundant LLM calls.
 */

// Cache structure: Map<string, { response: any, timestamp: number }>
const memoryCache = new Map();

// Default cache window: 5 minutes (in ms)
let cacheWindowMs = 5 * 60 * 1000;

/**
 * Generates a stable cache key based on the request content.
 */
function generateCacheKey(request) {
  const { prompt, feature, options } = request;
  
  // Create a payload object with the relevant data
  const payload = {
    prompt: prompt || '',
    feature: feature || '',
    contents: options?.contents || [],
    systemInstruction: options?.systemInstruction || '',
    responseType: request.responseType || 'json'
  };

  const stringified = JSON.stringify(payload);
  
  // Fast hash function
  let hash = 0;
  for (let i = 0; i < stringified.length; i++) {
    hash = ((hash << 5) - hash) + stringified.charCodeAt(i);
    hash |= 0;
  }
  
  return `ai_cache_${hash}`;
}

export const aiCache = {
  setCacheWindow: (ms) => {
    cacheWindowMs = ms;
  },
  
  getCacheWindow: () => cacheWindowMs,

  get: (request) => {
    const key = generateCacheKey(request);
    const entry = memoryCache.get(key);
    
    if (!entry) return null;

    const isExpired = (Date.now() - entry.timestamp) > cacheWindowMs;
    if (isExpired) {
      memoryCache.delete(key);
      return null;
    }

    return entry.response;
  },

  set: (request, response) => {
    if (!response) return;
    
    const key = generateCacheKey(request);
    memoryCache.set(key, {
      response,
      timestamp: Date.now()
    });
  },

  clear: () => {
    memoryCache.clear();
  },
  
  getStats: () => {
    return {
      size: memoryCache.size,
      windowMs: cacheWindowMs
    };
  }
};
