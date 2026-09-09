export function parseJSONResponse(responseString) {
  if (!responseString) return null;

  const tryParse = (text) => {
    try { return JSON.parse(text); } catch { return null; }
  };


  let parsed = tryParse(responseString);
  if (parsed) return parsed;

  const firstBrace = responseString.indexOf('{');
  const firstBracket = responseString.indexOf('[');
  const lastBrace = responseString.lastIndexOf('}');
  const lastBracket = responseString.lastIndexOf(']');

  const objStr = firstBrace !== -1 && lastBrace !== -1 ? responseString.substring(firstBrace, lastBrace + 1) : null;
  const arrStr = firstBracket !== -1 && lastBracket !== -1 ? responseString.substring(firstBracket, lastBracket + 1) : null;

  const isObjectFirst = firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket);
  const isArrayFirst = firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace);

  if (isObjectFirst) {
    if (objStr) parsed = tryParse(objStr);
    if (!parsed && arrStr) parsed = tryParse(arrStr);
  } else if (isArrayFirst) {
    if (arrStr) parsed = tryParse(arrStr);
    if (!parsed && objStr) parsed = tryParse(objStr);
  } else {
    if (objStr) parsed = tryParse(objStr);
    if (!parsed && arrStr) parsed = tryParse(arrStr);
  }

  if (parsed) return parsed;


  if (responseString.includes('```')) {
    let blocks = responseString.split('```');
    for (let i = 1; i < blocks.length; i += 2) {
      let blockContent = blocks[i].trim();
      if (blockContent.startsWith('json')) blockContent = blockContent.substring(4).trim();
      parsed = tryParse(blockContent);
      if (parsed) return parsed;
    }
  }


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
