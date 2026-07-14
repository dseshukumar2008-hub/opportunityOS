const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function test() {
  const apiKey = process.env.VITE_GEMINI_API_KEY;
  const requestBody = {
    contents: [
      { role: 'user', parts: [{ text: 'You are an expert AI Career Coach inside OpportunityOS.' }] },
      { role: 'model', parts: [{ text: 'Understood. I have your profile context loaded. How can I help you today?' }] },
      { role: 'user', parts: [{ text: 'Hello' }] }
    ],
    generationConfig: { temperature: 0.4, maxOutputTokens: 600 }
  };

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  console.log('MODEL: gemini-2.0-flash');
  console.log('API URL:', apiUrl.replace(apiKey, 'HIDDEN_KEY'));
  console.log('REQUEST SENT:\n' + JSON.stringify(requestBody, null, 2));

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  console.log('STATUS:', response.status);

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    console.log('RESPONSE RECEIVED:\n' + JSON.stringify(err, null, 2));
    console.log('UI UPDATED: NO (Error thrown)');
  } else {
    const data = await response.json();
    console.log('RESPONSE RECEIVED:\n' + JSON.stringify(data, null, 2));
    console.log('UI UPDATED: YES');
  }
}
test();
