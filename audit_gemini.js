import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envContent = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf-8');
const match = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);
const apiKey = match ? match[1].trim() : '';
process.env.VITE_GEMINI_API_KEY = apiKey;

async function audit() {
  console.log('Auditing geminiService.js...');
  const { geminiService } = await import('./src/services/geminiService.js');
  
  try {
    const result = await geminiService.analyzeSkillGap({
      skills: ['HTML'],
      goals: ['Frontend Developer']
    });
    console.log('Skill Gap Result:', result);
  } catch (err) {
    console.error('Skill Gap Error:', err);
  }
}

audit();
