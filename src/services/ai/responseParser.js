/**
 * Reusable response parsing utilities.
 * No provider-specific parsing here.
 */

export function parseJSONResponse(responseString) {
  try {
    // Attempt to extract JSON from markdown blocks if present
    const jsonMatch = responseString.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const rawJson = jsonMatch ? jsonMatch[1] : responseString;
    return JSON.parse(rawJson);
  } catch (error) {
    console.error("Failed to parse JSON response:", error);
    return null;
  }
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
