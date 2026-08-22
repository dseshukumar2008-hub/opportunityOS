const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");

admin.initializeApp();

// Define secrets that will be injected from Google Cloud Secret Manager
const GEMINI_API_KEY = defineSecret("GEMINI_API_KEY");
const GROQ_API_KEY = defineSecret("GROQ_API_KEY");
const OPENROUTER_API_KEY = defineSecret("OPENROUTER_API_KEY");

const ALLOWED_PROVIDERS = ["gemini", "groq", "openrouter"];

exports.generateAI = onCall(
  { secrets: [GEMINI_API_KEY, GROQ_API_KEY, OPENROUTER_API_KEY] },
  async (request) => {
    // 1. Authentication Check
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "The function must be called while authenticated."
      );
    }

    const { providerName, feature, prompt, responseType, options } = request.data;

    // 2. Validation
    if (!providerName || !ALLOWED_PROVIDERS.includes(providerName)) {
      throw new HttpsError(
        "invalid-argument",
        `Unsupported provider: ${providerName}`
      );
    }
    if (!prompt) {
      throw new HttpsError("invalid-argument", "Prompt is required.");
    }

    try {
      // 3. Route to the correct provider
      if (providerName === "gemini") {
        return await callGemini(GEMINI_API_KEY.value(), prompt, responseType, options);
      } else if (providerName === "groq") {
        return await callGroq(GROQ_API_KEY.value(), prompt, responseType, options);
      } else if (providerName === "openrouter") {
        return await callOpenRouter(OPENROUTER_API_KEY.value(), prompt, responseType, options);
      }
    } catch (error) {
      console.error(`Error calling provider ${providerName}:`, error);
      // Return a truthful, but sanitized error to the client
      throw new HttpsError("internal", `AI Provider failed: ${error.message || "Unknown error"}`);
    }
  }
);

// --- Provider Implementations ---

async function callGemini(apiKey, prompt, responseType, options = {}) {
  const modelName = options.model || (responseType === "json" ? "gemini-2.5-flash" : "gemini-1.5-pro");
  
  // Note: For a production app, it's best to use the official @google/genai SDK,
  // but to preserve exact backward compatibility with the frontend's REST format, 
  // we will use the REST API just like the frontend did.
  
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
  
  const parts = [];
  if (options.inlineDataItems && options.inlineDataItems.length > 0) {
    parts.push(...options.inlineDataItems);
  }
  parts.push({ text: prompt });

  const payload = {
    contents: [{ role: "user", parts: parts }],
    generationConfig: {
      temperature: options.temperature || 0.7,
      maxOutputTokens: options.maxTokens || 8192,
      responseMimeType: responseType === "json" ? "application/json" : "text/plain",
    }
  };

  if (options.systemInstruction) {
    payload.systemInstruction = {
      role: "user",
      parts: [{ text: options.systemInstruction }]
    };
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API Error: ${response.status} - ${errorBody}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!text) {
    throw new Error("Invalid response format from Gemini");
  }
  
  return {
    success: true,
    provider: "gemini",
    model: modelName,
    data: text
  };
}

async function callGroq(apiKey, prompt, responseType, options = {}) {
  const modelName = options.model || "mixtral-8x7b-32768";
  
  const messages = [];
  if (options.systemInstruction) {
    messages.push({ role: "system", content: options.systemInstruction });
  }
  messages.push({ role: "user", content: prompt });

  const payload = {
    model: modelName,
    messages: messages,
    temperature: options.temperature || 0.7,
    max_tokens: options.maxTokens || 1024,
    response_format: responseType === "json" ? { type: "json_object" } : { type: "text" }
  };

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Groq API Error: ${response.status} - ${errorBody}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  
  if (!text) {
    throw new Error("Invalid response format from Groq");
  }

  return {
    success: true,
    provider: "groq",
    model: modelName,
    data: text
  };
}

async function callOpenRouter(apiKey, prompt, responseType, options = {}) {
  const modelName = options.model || "anthropic/claude-3-haiku";
  
  const messages = [];
  if (options.systemInstruction) {
    messages.push({ role: "system", content: options.systemInstruction });
  }
  messages.push({ role: "user", content: prompt });

  const payload = {
    model: modelName,
    messages: messages,
    temperature: options.temperature || 0.7,
    max_tokens: options.maxTokens || 1024,
    response_format: responseType === "json" ? { type: "json_object" } : undefined
  };

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": "https://opportunityos.app",
      "X-Title": "OpportunityOS"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenRouter API Error: ${response.status} - ${errorBody}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  
  if (!text) {
    throw new Error("Invalid response format from OpenRouter");
  }

  return {
    success: true,
    provider: "openrouter",
    model: modelName,
    data: text
  };
}
