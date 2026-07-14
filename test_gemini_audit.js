import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const match = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);
const apiKey = match ? match[1].trim() : '';

const maskedKey = apiKey.length > 6 ? apiKey.substring(0, 6) + '***' : 'Missing';
console.log(`Loaded Key: ${maskedKey}`);

async function test() {
  const requestBody = {
    contents: [
      { role: 'user', parts: [{ text: 'Reply with ONLY the word SUCCESS' }] }
    ],
    generationConfig: { temperature: 0.1, maxOutputTokens: 10 }
  };

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  
  console.log('Model used: gemini-2.5-flash');

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    console.log('HTTP status code:', response.status);

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.log('Response body:', JSON.stringify(err, null, 2));
      console.log('\nFAIL');
    } else {
      const data = await response.json();
      console.log('Response body:', JSON.stringify(data, null, 2));
      console.log('\nPASS');
    }
  } catch (err) {
    console.error('Fetch error:', err.message);
    console.log('\nFAIL');
  }
}
test();
