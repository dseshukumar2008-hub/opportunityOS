/**
 * Reusable response parsing utilities.
 * No provider-specific parsing here.
 */

export function parseJSONResponse(responseString) {
  if (!responseString) return null;

  const tryParse = (text) => {
    try { return JSON.parse(text); } catch { return null; }
  };

  // Pass 1: Try raw parsing
  let parsed = tryParse(responseString);
  if (parsed) return parsed;

  // Pass 2: Try stripping markdown fences manually
  if (responseString.includes('```')) {
    let blocks = responseString.split('```');
    for (let i = 1; i < blocks.length; i+=2) {
      let blockContent = blocks[i].trim();
      if (blockContent.startsWith('json')) blockContent = blockContent.substring(4).trim();
      parsed = tryParse(blockContent);
      if (parsed) return parsed;
    }
  }

  // Pass 3: Regex fallback (find anything resembling an object or array)
  const cleaned = responseString.replace(/[\s\S]*?(?:```(?:json)?\s*)?({[\s\S]*}|\[[\s\S]*\])[\s\S]*/i, '$1').trim();
  parsed = tryParse(cleaned);
  
  if (!parsed) {
    console.error("[responseParser] Failed to parse JSON. Raw string:", responseString);
  }
  return parsed;
}

export function normalizeResponse(rawResponse, provider = "unknown", model = "unknown") {
  return {
    success: true,
    provider,
    model,
    data: rawResponse,
    metadata: {
      timestamp: new Date().toISOString()
    },
    error: null
  };
}

export function createErrorResponse(error, provider = "unknown", model = "unknown") {
  return {
    success: false,
    provider,
    model,
    data: null,
    metadata: {
      timestamp: new Date().toISOString()
    },
    error: error
  };
}
