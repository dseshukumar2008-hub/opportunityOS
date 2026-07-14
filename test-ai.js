import { generate } from './src/services/ai/aiProvider.js';
import { geminiService } from './src/services/geminiService.js';
import { geminiProvider } from './src/services/ai/providers/geminiProvider.js';
import { groqProvider } from './src/services/ai/providers/groqProvider.js';

global.localStorage = {
  getItem: () => null,
  setItem: () => {}
};

async function runTests() {
  console.log("=== TEST 1: Gemini ===");
  try {
    const start1 = Date.now();
    const req1 = { providerName: 'gemini', feature: 'Test1', prompt: 'Respond with SUCCESS in json format like {"status": "SUCCESS"}', responseType: 'json' };
    const res1 = await generate(req1);
    console.log(`Gemini Status: ${res1.success ? 'SUCCESS' : 'FAILED'}`);
    console.log(`Model: ${res1.model}`);
    console.log(`Latency: ${Date.now() - start1}ms`);
    console.log('Response:', res1.data);
  } catch (e) {
    console.log("TEST 1 ERROR", e);
  }

  console.log("\n=== TEST 2: Groq ===");
  try {
    // Mock Gemini to fail
    const originalGeminiGen = geminiProvider.generate;
    geminiProvider.generate = async () => { throw { type: 'AI_SERVER_ERROR', message: 'Mocked 503 error' }; };
    
    const start2 = Date.now();
    const req2 = { providerName: 'gemini', feature: 'Test2', prompt: 'Respond with SUCCESS in json format like {"status": "SUCCESS"}', responseType: 'json' };
    const res2 = await generate(req2);
    console.log(`Fallback Provider Used: ${res2.provider}`);
    console.log(`Groq Status: ${res2.success ? 'SUCCESS' : 'FAILED'}`);
    console.log(`Model: ${res2.model}`);
    console.log(`Latency: ${Date.now() - start2}ms`);
    console.log('Response:', res2.data);
    
    // Restore Gemini
    geminiProvider.generate = originalGeminiGen;
  } catch (e) {
    console.log("TEST 2 ERROR", e);
  }

  console.log("\n=== TEST 3: OpenRouter ===");
  const openRouterKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  console.log(`VITE_OPENROUTER_API_KEY exists: ${!!openRouterKey}`);

  console.log("\n=== TEST 4: Template Provider ===");
  try {
    // Mock Gemini and Groq to fail
    const originalGeminiGen = geminiProvider.generate;
    const originalGroqGen = groqProvider.generate;
    geminiProvider.generate = async () => { throw { type: 'AI_SERVER_ERROR', message: 'Mocked 503 error' }; };
    groqProvider.generate = async () => { throw { type: 'AI_SERVER_ERROR', message: 'Mocked 503 error' }; };
    
    const start4 = Date.now();
    const req4 = { providerName: 'gemini', feature: 'Test4', prompt: 'Respond with SUCCESS in json format', responseType: 'json' };
    const res4 = await generate(req4);
    
    console.log(`Fallback Provider Used: ${res4.provider}`);
    console.log(`Template Status: ${res4.success ? 'SUCCESS' : 'FAILED'}`);
    console.log(`Model: ${res4.model}`);
    console.log(`Latency: ${Date.now() - start4}ms`);
    console.log('Response:', res4.data);
    
    geminiProvider.generate = originalGeminiGen;
    groqProvider.generate = originalGroqGen;
  } catch (e) {
    console.log("TEST 4 ERROR", e);
  }

  console.log("\n=== TEST 5: Career Coach ===");
  try {
    const res5 = await geminiService.chatWithCopilot({
      mode: 'career_coach',
      contextData: {},
      history: [],
      message: 'Hi',
      generateGoals: false
    });
    console.log('Career Coach Response:', res5);
  } catch (e) {
    console.log("TEST 5 ERROR", e);
  }
}

runTests();
