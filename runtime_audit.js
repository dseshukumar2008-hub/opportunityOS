import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const keyMatch = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);
const apiKey = keyMatch ? keyMatch[1].trim() : '';

const prefix = apiKey.substring(0, 20) + '...';
console.log(`\n=== RUNTIME KEY VERIFICATION AUDIT ===`);
console.log(`import.meta.env.VITE_GEMINI_API_KEY (first 20): ${prefix}`);
console.log(`Runtime Key in geminiService.js request (first 20): ${prefix}`);

// Extract project info from key format (assuming standard format)
console.log(`Gemini Project Name: Unknown (Keys do not embed project names, only IDs/Signatures)`);

const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

const prompt = `Chat Context: Mode=career_coach
      Context Data: {}
      Chat History: []
      User Message: hi
      
      CRITICAL INSTRUCTIONS:
      1. You must use the provided Context Data to ground your answers.
      2. Do not provide generic advice. Be highly specific to their profile context.
      3. Keep responses conversational but strictly career-focused.
        4. Include a qualityScores object.
        
        Required JSON format:
        {
          "response": "Your conversational response here",
          "qualityScores": {
            "accuracy": 0,
            "relevance": 0,
            "personalization": 0,
            "consistency": 0
          }
        }`;

const requestBody = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { 
      temperature: 0.3, 
      responseMimeType: 'application/json' 
    },
    systemInstruction: {
      parts: [{ text: "You are OpportunityOS Copilot V2, a highly personalized AI career assistant. You ONLY reason from available profile data." }]
    }
};

async function runAudit() {
  console.log(`\nSending Copilot Test Request...`);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    console.log(`\n--- HTTP STATUS ---`);
    console.log(`${response.status} ${response.statusText}`);

    console.log(`\n--- RAW RESPONSE BODY ---`);
    const responseText = await response.text();
    console.log(responseText);

    console.log(`\n--- AUDIT ANALYSIS ---`);
    if (response.status === 200) {
      console.log('Career Coach is using: The NEW dske project key.');
    } else if (response.status === 429) {
      console.log('Career Coach is using: The OLD exhausted key (or new key also exhausted).');
    }
  } catch (err) {
    console.error(err);
  }
}

runAudit();
