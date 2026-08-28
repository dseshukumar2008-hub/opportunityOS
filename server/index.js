require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

const app = express();
const PORT = process.env.PORT || 8080;

// Set up CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json({ limit: '10mb' }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize Firebase Admin SDK
let firebaseApp;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    firebaseApp = initializeApp({
      credential: cert(serviceAccount)
    });
  } else if (process.env.FIREBASE_PROJECT_ID) {
    firebaseApp = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined
      })
    });
  } else {
    // Local development fallback: no service account key needed.
    // Passing projectId allows verifyIdToken() to validate tokens via Firebase's
    // public JWKS endpoint without requiring a downloaded credentials file.
    firebaseApp = initializeApp({
      projectId: 'oppurtunity-os'
    });
  }
} catch (error) {
  console.error("CRITICAL: Firebase Admin Initialization Error:", error);
  process.exit(1);
}

const ALLOWED_PROVIDERS = ["gemini", "groq", "openrouter"];

// --- Middleware to verify Firebase Auth Token ---
const verifyAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'unauthenticated', message: 'Missing or invalid Authorization header.' });
  }

  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await getAuth(firebaseApp).verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying Firebase ID token:", error);
    return res.status(401).json({ error: 'unauthenticated', message: 'Invalid or expired authentication token.' });
  }
};

// --- API Endpoint ---
app.post('/api/ai/generate', verifyAuth, async (req, res) => {
  const { providerName, feature, prompt, responseType, options } = req.body;

  if (!providerName || !ALLOWED_PROVIDERS.includes(providerName)) {
    return res.status(400).json({ error: 'invalid-argument', message: `Unsupported provider: ${providerName}` });
  }
  
  if (!prompt) {
    return res.status(400).json({ error: 'invalid-argument', message: 'Prompt is required.' });
  }

  try {
    let result;
    if (providerName === "gemini") {
      result = await callGemini(process.env.GEMINI_API_KEY, prompt, responseType, options);
    } else if (providerName === "groq") {
      result = await callGroq(process.env.GROQ_API_KEY, prompt, responseType, options);
    } else if (providerName === "openrouter") {
      result = await callOpenRouter(process.env.OPENROUTER_API_KEY, prompt, responseType, options);
    }

    // Return the successful response in an object holding { data: result } 
    // to mimic Firebase Callable Function format for the frontend
    res.json({ data: result });
  } catch (error) {
    console.error(`[BACKEND] Error calling provider ${providerName}:`, error.message);
    
    // Attempt to extract status code if available (e.g. from "Gemini API Error: 429 - ...")
    let statusCode = 500;
    const match = error.message.match(/Error: (\d{3})/);
    if (match && match[1]) {
      statusCode = parseInt(match[1], 10);
    }
    
    res.status(statusCode).json({ 
      error: 'provider_error',
      statusCode: statusCode,
      message: `AI Provider failed: ${error.message || "Unknown error"}` 
    });
  }
});


// --- Provider Implementations ---

async function callGemini(apiKey, prompt, responseType, options = {}) {
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured on the server.");
  const modelName = options.model || (responseType === "json" ? "gemini-2.5-flash" : "gemini-1.5-pro");
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
  
  let finalContents;
  
  if (options.contents && Array.isArray(options.contents)) {
    finalContents = [...options.contents];
    // If inlineDataItems exist, attach them to the last user message
    if (options.inlineDataItems && options.inlineDataItems.length > 0 && finalContents.length > 0) {
      const lastItem = finalContents[finalContents.length - 1];
      if (lastItem.role === 'user') {
        const formattedItems = options.inlineDataItems.map(item => {
          if (item.inlineData) return item;
          if (item.mimeType && item.data) return { inlineData: { mimeType: item.mimeType, data: item.data } };
          return item;
        });
        lastItem.parts = [...formattedItems, ...lastItem.parts];
      }
    }
  } else {
    const parts = [];
    if (options.inlineDataItems && options.inlineDataItems.length > 0) {
      const formattedItems = options.inlineDataItems.map(item => {
        if (item.inlineData) return item;
        if (item.mimeType && item.data) {
          return { inlineData: { mimeType: item.mimeType, data: item.data } };
        }
        return item;
      });
      parts.push(...formattedItems);
    }
    parts.push({ text: prompt });
    finalContents = [{ role: "user", parts: parts }];
  }

  const payload = {
    contents: finalContents,
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
  if (!text) throw new Error("Invalid response format from Gemini");
  
  return { success: true, provider: "gemini", model: modelName, data: text };
}

async function callGroq(apiKey, prompt, responseType, options = {}) {
  if (!apiKey) throw new Error("GROQ_API_KEY is not configured on the server.");
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
  if (!text) throw new Error("Invalid response format from Groq");

  return { success: true, provider: "groq", model: modelName, data: text };
}

async function callOpenRouter(apiKey, prompt, responseType, options = {}) {
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not configured on the server.");
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
  if (!text) throw new Error("Invalid response format from OpenRouter");

  return { success: true, provider: "openrouter", model: modelName, data: text };
}

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
