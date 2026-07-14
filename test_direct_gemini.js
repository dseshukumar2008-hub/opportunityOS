import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const match = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);
const apiKey = match ? match[1].trim() : '';

const requestBody = {
  contents: [
    { role: 'user', parts: [{ text: 'Generate a JSON object with keys id and name. Do not use markdown blocks. Reply with just JSON.' }] }
  ]
};

const model = 'gemini-2.5-flash';
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

async function test() {
  console.log(`Model used: ${model}`);
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    console.log(`HTTP status: ${response.status}`);
    
    if (response.ok) {
        const data = await response.json();
        console.log(`Response body:\n${JSON.stringify(data, null, 2)}`);
    } else {
        const error = await response.json().catch(() => ({}));
        console.log(`Response body:\n${JSON.stringify(error, null, 2)}`);
    }

  } catch (err) {
    console.error(`Fetch error: ${err.message}`);
  }
}

test();
