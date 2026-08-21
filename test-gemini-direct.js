async function testGemini() {
  const apiKey = process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error("NO API KEY FOUND IN .env");
    return;
  }
  
  const prompt = `You are a senior engineering manager and expert technical recruiter.
Analyze the provided GitHub portfolio data for user "testuser" against their target role of "Frontend Developer".

GITHUB PROFILE STATS:
Followers: 10
Total Stars: 50
Languages Detected: JavaScript, TypeScript, HTML, CSS

TOP REPOSITORY DEEP ANALYSIS:
[
  {
    "repoName": "test-repo",
    "readme": "# Test Repo\\nThis is a test repo.",
    "packageJson": "{\\"dependencies\\":{\\"react\\":\\\"^18.0.0\\\"}}",
    "requirementsTxt": null,
    "hasActions": true,
    "hasDocker": false
  }
]

CRITICAL INSTRUCTIONS:
1. You must dynamically generate the entire analysis based ONLY on the provided Top Repository Deep Analysis data.
2. Every string in "strengths" and "weaknesses" MUST cite a specific repository name, file (e.g. package.json, Dockerfile), or metric from the data as evidence.
3. Calculate a "githubScore" (0-100) based on repository complexity, documentation (README), tech diversity, and commit consistency.
4. Calculate a "careerMatch" breakdown (0-100 for each: frontend, backend, aiTools, cloudDevOps) based strictly on the detected technologies in the deep analysis.
5. Provide exactly 5 personalized "recommendations" based on detected gaps (e.g. if no Dockerfile, recommend Docker).
6. Provide an "analysisSummary" (array of exactly 5-6 string bullet points) summarizing key metrics.
7. Provide an "overallAssessment" paragraph.

Required JSON Schema:
{
  "githubScore": 0,
  "analysisSummary": [
    "string"
  ],
  "overallAssessment": "string",
  "careerMatch": {
    "frontend": 0,
    "backend": 0,
    "aiTools": 0,
    "cloudDevOps": 0
  },
  "strengths": ["..."],
  "weaknesses": ["..."],
  "recommendations": [
    { "title": "...", "desc": "...", "priority": "High" }
  ]
}

Return JSON only.`;

  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.3,
      responseMimeType: 'application/json'
    },
    systemInstruction: {
      parts: [{ text: "You are an expert tech recruiter. Output valid JSON only." }]
    }
  };

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      }
    );
    
    if (!res.ok) {
      console.log("HTTP ERROR:", res.status, await res.text());
      return;
    }
    
    const data = await res.json();
    console.log("SUCCESS!");
    const text = data.candidates[0].content.parts[0].text;
    console.log(text);
  } catch (err) {
    console.error("FETCH ERROR:", err);
  }
}

testGemini();
