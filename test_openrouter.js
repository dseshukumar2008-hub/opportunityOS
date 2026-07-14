const https = require('https');

const apiKey = process.env.VITE_OPENROUTER_API_KEY || 'dummy_key_for_test';

const data = JSON.stringify({
  model: "deepseek/deepseek-chat-v3-0324",
  messages: [
    { role: "user", content: "Say hello!" }
  ]
});

const options = {
  hostname: 'openrouter.ai',
  path: '/api/v1/chat/completions',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
    'HTTP-Referer': 'https://opportunityos.app',
    'X-Title': 'OpportunityOS Test'
  }
};

const req = https.request(options, (res) => {
  let responseBody = '';

  console.log('Status Code:', res.statusCode);
  
  res.on('data', (chunk) => {
    responseBody += chunk;
  });

  res.on('end', () => {
    console.log('Response Body:', responseBody);
    if (res.statusCode === 200 || res.statusCode === 401) {
       console.log('Connectivity test successful (even if 401, endpoint is reachable).');
    } else {
       console.log('Connectivity test failed or returned unexpected status.');
    }
  });
});

req.on('error', (e) => {
  console.error('Connectivity test failed with error:', e);
});

req.write(data);
req.end();
