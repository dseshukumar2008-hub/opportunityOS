import fs from 'fs';

const API_KEY = "AQ.Ab8RN6L3DYTFtZUmuk5OXuixccro7noTXRr4GeiZzH6xj_AvfA";

async function callGemini(prompt) {
  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { 
      temperature: 0.3, 
      responseMimeType: 'application/json' 
    },
    systemInstruction: {
      parts: [{ text: "You are a master career AI. Output only valid JSON." }]
    }
  };

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
    { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(requestBody) 
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(`Gemini API Error: ${response.status} - ${JSON.stringify(err)}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  const cleaned = rawText.replace(/^```json\s*/m, '').replace(/```\s*$/m, '').trim();
  return JSON.parse(cleaned);
}

const targetRole = "Software Engineer";

const resumes = [
  {
    name: "Beginner Student",
    text: "Education: B.S. in Computer Science. Coursework: Intro to Programming, Basic Data Structures. Skills: HTML, CSS, basic Python. Experience: School projects building simple calculators."
  },
  {
    name: "Full Stack Developer",
    text: "Experience: 4 years building scalable web applications. Skills: JavaScript, TypeScript, React.js, Node.js, Express, MongoDB, PostgreSQL, REST APIs, Git, Docker, AWS EC2. Projects: Built an e-commerce platform handling 10k daily active users."
  },
  {
    name: "AI Engineer",
    text: "Experience: 3 years as a Machine Learning Engineer. Skills: Python, PyTorch, TensorFlow, Scikit-Learn, SQL, Pandas, NumPy, NLP, Computer Vision, Model Deployment (FastAPI). Projects: Fine-tuned LLMs for sentiment analysis, achieving 95% accuracy."
  }
];

async function runTest() {
  let output = `# Skill Gap Analysis Validation Test\n\nTarget Role: **${targetRole}**\n\n`;

  for (const resume of resumes) {
    console.log(`Analyzing: ${resume.name}`);
    
    const prompt = `You are a world-class AI Career Coach & Technical Recruiter.
Generate a highly personalized Skill Gap Analysis for the user targeting the role of: "${targetRole}"

# USER CONTEXT:
1. Manual Skills Provided: None
2. GitHub Data: Not connected
3. LinkedIn Profile URL: Not connected
4. Resume Context: A resume document is provided: "${resume.text}"

# INSTRUCTIONS:
1. Merge all extracted skills from the provided context (including the attached resume if present).
2. Compare the merged skills against the standard industry requirements for a "${targetRole}".
3. Calculate a realistic "readinessScore" (0 to 100) and a "skillGapPercentage" (0 to 100).
4. Categorize skills into strong, moderate, and missing.
5. Identify the single most important "nextSkill" to learn.
6. Group missing skills by priority (high, medium, low).
7. Create a 6-step personalized "learningPath" roadmap.
8. Generate personalized "aiAdvice" (2-3 sentences max) addressing their specific gaps.
9. Generate a short "consistencyTip" (1-2 sentences max).

# REQUIRED JSON SCHEMA:
{
  "targetRole": "${targetRole}",
  "readinessScore": 75,
  "skillGapPercentage": 25,
  "currentSkills": ["List", "of", "all", "extracted", "skills", "no", "duplicates"],
  "skillBreakdown": { "strong": 8, "moderate": 4, "missing": 6 },
  "nextSkill": {
    "name": "Skill Name",
    "priority": "High",
    "time": "X Weeks",
    "impact": "High",
    "reason": "Short reason why."
  },
  "missingSkills": {
    "high": ["..."],
    "medium": ["..."],
    "low": ["..."]
  },
  "learningPath": [
    { "title": "Topic 1", "time": "X Weeks" },
    { "title": "Topic 2", "time": "Y Weeks" },
    { "title": "Topic 3", "time": "Y Weeks" },
    { "title": "Topic 4", "time": "Y Weeks" },
    { "title": "Topic 5", "time": "Y Weeks" },
    { "title": "Topic 6", "time": "Y Weeks" }
  ],
  "aiAdvice": "Personalized career advice based on their profile.",
  "consistencyTip": "Short tip on how to stay consistent."
}`;

    try {
      const result = await callGemini(prompt);
      
      output += `## Resume: ${resume.name}\n`;
      output += `- **Extracted Skills:** ${result.currentSkills.join(', ')}\n`;
      output += `- **Readiness Score:** ${result.readinessScore}%\n`;
      output += `- **Skill Gap:** ${result.skillGapPercentage}%\n`;
      output += `- **Missing Skills (High Priority):** ${result.missingSkills.high.join(', ')}\n`;
      output += `- **Next Skill To Learn:** ${result.nextSkill.name} (${result.nextSkill.reason})\n`;
      output += `- **Learning Path:** ${result.learningPath.map(p => p.title).join(' -> ')}\n`;
      output += `- **AI Advice:** ${result.aiAdvice}\n\n`;
      
      output += `<details><summary>View Raw JSON Response</summary>\n\n\`\`\`json\n${JSON.stringify(result, null, 2)}\n\`\`\`\n</details>\n\n`;
      
    } catch (e) {
      console.error(e);
      output += `## Resume: ${resume.name}\nFailed: ${e.message}\n\n`;
    }
  }

  fs.writeFileSync('C:/Users/HP/.gemini/antigravity-ide/brain/a7b5b896-26cd-448c-97a8-3d56c4cd6b74/validation_results.md', output);
  console.log("Done. Results saved.");
}

runTest();
