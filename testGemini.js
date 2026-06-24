import { geminiService } from '../src/services/geminiService.js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function test() {
  try {
    const res = await geminiService.analyzeGithubPortfolio('testuser', [{name: 'test', description: 'test', language: 'js'}], 'Frontend Developer');
    console.log(res);
  } catch(e) {
    console.error("CAUGHT ERROR:", e.message);
    if(e.status) console.error("STATUS:", e.status);
  }
}

test();
