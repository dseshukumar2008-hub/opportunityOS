import fs from 'fs';
const envContent = fs.readFileSync('.env.local', 'utf-8');
const apiKeyMatch = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : null;

if (!apiKey) {
  console.error('API key not found');
  process.exit(1);
}

const smallJD = "Looking for a React developer with 2 years of experience. Must know JavaScript, HTML, CSS.";
const mediumJD = "We are seeking a Frontend Engineer with 3+ years of experience building scalable web applications. You should be proficient in React, Redux, TypeScript, and modern CSS frameworks like Tailwind. Experience with REST APIs, Git, and Agile methodologies is required. A bachelor's degree in Computer Science is preferred. You will work closely with designers and backend engineers.";
const largeJD = `Senior Full Stack Developer
Company Overview: We are a fast-growing tech startup revolutionizing the e-commerce space.

Role:
We are looking for a Senior Full Stack Developer with at least 5 years of experience to lead our engineering team. You will be responsible for designing and building scalable backend services and responsive frontend applications.

Responsibilities:
- Architect and develop complex web applications.
- Lead a team of 4 junior developers.
- Collaborate with product managers and designers.
- Optimize application performance and ensure security.

Required Skills & Experience:
- 5+ years of experience in full-stack web development.
- Strong proficiency in JavaScript/TypeScript, Node.js, and React.
- Experience with GraphQL, PostgreSQL, and Redis.
- Knowledge of AWS infrastructure (EC2, S3, RDS, Lambda).
- Familiarity with CI/CD pipelines and Docker.
- Excellent problem-solving skills and attention to detail.

Education:
- Master's degree in Computer Science, Engineering, or a related field.

Nice to have:
- Experience with React Native.
- Knowledge of machine learning algorithms.

We offer competitive salary, health insurance, and flexible working hours.`;

const oldPromptTemplate = (jd) => `Extract the exact requirements from the following opportunity description.

OPPORTUNITY DESCRIPTION:
${jd}

INSTRUCTIONS:
1. Extract a list of required technical and soft skills (requiredSkills).
2. Extract a list of important keywords or tools (requiredKeywords).
3. Determine the required years of experience (requiredExperienceYears) - use 0 if not specified.
4. Determine if a portfolio or projects are explicitly required (requiresProjects).
5. Determine the required education or degree (requiredEducation) - leave null if not explicitly required.
6. CRITICAL: You must extract information purely from the provided description. Do not generate random claims or hallucinate requirements.
7. Include a qualityScores object evaluating your extraction accuracy and relevance.

REQUIRED JSON FORMAT:
{
  "requiredSkills": ["skill1", "skill2"],
  "requiredKeywords": ["keyword1", "keyword2"],
  "requiredExperienceYears": 2,
  "requiresProjects": true,
  "requiredEducation": "Bachelor's Degree in Computer Science",
  "qualityScores": {
    "accuracy": 0,
    "relevance": 0,
    "personalization": 0,
    "consistency": 0
  }
}`;

const newPromptTemplate = (jd) => `Extract requirements from the job description.

DESCRIPTION:
${jd}

JSON FORMAT:
{
  "requiredSkills": ["skill1", "skill2"],
  "tools": ["tool1", "tool2"],
  "requiredExperienceYears": 2,
  "requiredEducation": "Bachelor's Degree"
}`;

async function callGemini(prompt, systemInstruction) {
  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.0,
      responseMimeType: "application/json"
    }
  };

  if (systemInstruction) {
    requestBody.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  const startTime = Date.now();
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(requestBody)
    }
  );
  
  const data = await response.json();
  const duration = Date.now() - startTime;
  
  return {
    duration,
    promptLength: prompt.length,
    responseSize: JSON.stringify(data).length
  };
}

async function runBenchmark() {
  console.log("Starting Benchmark...");
  
  const jds = [
    { name: 'Small JD', text: smallJD },
    { name: 'Medium JD', text: mediumJD },
    { name: 'Large JD', text: largeJD }
  ];

  for (const jd of jds) {
    console.log(`\n--- ${jd.name} ---`);
    
    // Old Prompt
    const oldPrompt = oldPromptTemplate(jd.text);
    const oldResult = await callGemini(oldPrompt, "You are a precise data extractor.");
    console.log(`[BEFORE] Duration: ${oldResult.duration}ms, Prompt Length: ${oldResult.promptLength}, Response Size: ${oldResult.responseSize}`);

    // New Prompt
    const newPrompt = newPromptTemplate(jd.text);
    const newResult = await callGemini(newPrompt, "You are a precise data extractor.");
    console.log(`[AFTER] Duration: ${newResult.duration}ms, Prompt Length: ${newResult.promptLength}, Response Size: ${newResult.responseSize}`);
    
    console.log(`Savings: ${oldResult.duration - newResult.duration}ms (${Math.round((oldResult.duration - newResult.duration)/oldResult.duration * 100)}% faster)`);
  }
}

runBenchmark().catch(console.error);
