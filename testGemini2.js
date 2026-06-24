import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const apiKey = process.env.VITE_GEMINI_API_KEY;

const githubData = [
  { name: 'repo', description: 'test repo', language: 'JavaScript' }
];
const username = 'testuser';
const targetRole = 'Frontend Developer';

const prompt = `You are a senior engineering manager and technical recruiter.
Analyze the provided GitHub portfolio data for user "${username}" against the target role of "${targetRole}".

GITHUB DATA:
${JSON.stringify(githubData).substring(0, 30000)}

CRITICAL INSTRUCTIONS:
1. Evaluate the repositories, languages, descriptions, and activity.
2. Calculate a githubScore (0-100) representing overall portfolio quality.
3. Calculate an alignmentScore (0-100) representing how well the portfolio matches the "${targetRole}".
4. Identify specific strengths and weaknesses.
5. Identify detected technologies and crucially, missing technologies expected for the role.
6. Analyze portfolio diversity (frontend, backend, AI, etc.) and identify gaps.
7. Provide actionable improvement suggestions.
8. Generate a list of explicitly "missingSkills" and "missingProjects" that the user should build next to improve their chances.

Required JSON Schema:
{
  "githubScore": 82,
  "alignmentScore": 74,
  "strengths": ["..."],
  "weaknesses": ["..."],
  "technologyAnalysis": {
    "detected": ["..."],
    "missing": ["..."]
  },
  "portfolioDiversity": {
    "analysis": "...",
    "gaps": ["..."]
  },
  "improvementSuggestions": ["..."],
  "missingSkills": ["..."],
  "missingProjects": ["..."]
}

Return JSON only.`;

const systemInstruction = "You are an expert technical recruiter. Output valid JSON only.";

const requestBody = {
    contents: [{ parts: [{text: prompt}] }],
    generationConfig: { 
      temperature: 0.3, 
      responseMimeType: 'application/json' 
    },
    systemInstruction: {
      parts: [{ text: systemInstruction }]
    }
  };

async function run() {
  console.log("SENDING REQUEST:");
  console.log(JSON.stringify(requestBody, null, 2));

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(requestBody)
      }
    );
    
    if (!response.ok) {
        const errText = await response.text();
        console.log("RESPONSE ERROR:", errText);
        return;
    }
    
    const data = await response.json();
    console.log("RESPONSE DATA:");
    console.log(JSON.stringify(data, null, 2));
    
  } catch (e) {
      console.log("NETWORK EXCEPTION:", e);
  }
}

run();
