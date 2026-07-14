import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load API Key
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const keyMatch = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);
const apiKey = keyMatch ? keyMatch[1].trim() : '';

if (!apiKey) {
  console.error("No API key found in .env.local");
  process.exit(1);
}

const prefix = apiKey.substring(0, 8) + '...';
console.log(`\n=== GEMINI CONNECTIVITY AUDIT ===`);
console.log(`API Key Prefix: ${prefix}`);
console.log(`Model: gemini-2.5-flash`);

const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

const payload = {
  contents: [
    { role: 'user', parts: [{ text: "Respond with the exact word SUCCESS." }] }
  ]
};

async function runAudit() {
  console.log(`\nSending request...`);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    console.log(`\n--- HTTP STATUS ---`);
    console.log(`${response.status} ${response.statusText}`);

    console.log(`\n--- HEADERS (Rate Limits/Quotas) ---`);
    const headersObj = {};
    for (const [key, value] of response.headers.entries()) {
      headersObj[key] = value;
      if (key.toLowerCase().includes('quota') || key.toLowerCase().includes('limit') || key.toLowerCase().includes('retry')) {
         console.log(`[!] ${key}: ${value}`);
      }
    }
    console.log(headersObj);

    console.log(`\n--- RAW RESPONSE BODY ---`);
    const responseText = await response.text();
    console.log(responseText);

    console.log(`\n--- AUDIT ANALYSIS ---`);
    if (response.status === 200) {
      console.log('Status: HTTP 200 OK');
      console.log('Failure Type: None (Success)');
      console.log('Quota: Quota Available');
      console.log('Model Status: Online and functioning');
      console.log('Recommended Fix: N/A - API is working perfectly. Check your local application parsing logic.');
    } else if (response.status === 429) {
      console.log('Status: HTTP 429 Too Many Requests');
      console.log('Failure Type: Quota exceeded (429)');
      console.log('Quota: Quota Blocked');
      console.log('Model Status: Unavailable for this key temporarily');
      console.log('Recommended Fix: Wait for quota to reset, upgrade billing on Google Cloud, or use a new API key.');
    } else if (response.status === 503) {
      console.log('Status: HTTP 503 Service Unavailable');
      console.log('Failure Type: Model unavailable (503)');
      console.log('Quota: N/A (Server-side issue)');
      console.log('Model Status: Experiencing downtime / Overloaded');
      console.log('Recommended Fix: Google servers are overloaded. Implement exponential backoff retries.');
    } else if (response.status === 400) {
      console.log('Status: HTTP 400 Bad Request');
      console.log('Failure Type: Invalid Request format or Model not found');
      console.log('Quota: N/A');
      console.log('Recommended Fix: Verify model name exists or payload is correctly formatted.');
    } else if (response.status === 403 || response.status === 401) {
      console.log('Status: HTTP 401/403 Unauthorized');
      console.log('Failure Type: Invalid API key');
      console.log('Quota: N/A');
      console.log('Recommended Fix: Check if API key is active, not revoked, and has the Generative Language API enabled.');
    } else {
      console.log(`Failure Type: Unknown HTTP ${response.status}`);
    }
    
  } catch (error) {
    console.log(`\n--- NETWORK FAILURE ---`);
    console.log('Failure Type: Network failure');
    console.error(error);
  }
}

runAudit();
