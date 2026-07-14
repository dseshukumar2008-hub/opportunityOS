import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Hacky setup to run Vite project files in raw Node
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the .env file
const envFile = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf-8');
let apiKey = '';
for (const line of envFile.split('\n')) {
  if (line.startsWith('VITE_GEMINI_API_KEY=')) {
    apiKey = line.split('=')[1].trim();
  }
}

if (!apiKey) {
  console.error("NO API KEY FOUND");
  process.exit(1);
}

// Copy geminiService but replace import.meta.env
const geminiServiceCode = fs.readFileSync(path.join(__dirname, 'src', 'services', 'geminiService.js'), 'utf-8');
const modifiedCode = geminiServiceCode
  .replace("import.meta.env.VITE_GEMINI_API_KEY", `"${apiKey}"`)
  .replace("import { calculateATSScore } from '../utils/atsScoringEngine';", "const calculateATSScore = () => {};")
  .replace("import { analyticsService } from './analyticsService';", "const analyticsService = { trackEvent: () => {}, trackError: () => {}, trackAIOperation: () => {} };");

fs.writeFileSync(path.join(__dirname, 'tempGeminiService.js'), modifiedCode);

// Mock localStorage
global.localStorage = {
  getItem: () => null,
  setItem: () => {}
};

const testPayload = {
  targetRole: "Software Engineer",
  manualSkills: ["React", "JavaScript"],
  githubData: null,
  linkedinData: null,
  resumeData: null
};

async function run() {
  try {
    const { geminiService } = await import('./tempGeminiService.js');
    console.log("Starting test...");
    const result = await geminiService.generateDynamicSkillGapReport(testPayload);
    console.log("SUCCESS:");
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("FAILED:");
    console.error(error.message);
    if (error.status) console.error("Status:", error.status);
    if (error.body) console.error("Body:", error.body);
  }
}

run();
