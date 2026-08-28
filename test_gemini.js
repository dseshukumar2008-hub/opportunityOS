const key = 'YOUR_API_KEY_HERE';
const prompt = `Analyze the following resume data and provide a JSON response:
        {"name": "John Doe", "experience": "Software Engineer"}
      
      CRITICAL INSTRUCTIONS:
      1. Profile Type Context: This candidate is identified as a(n) **EXPERIENCED**.
         - If STUDENT/INTERNSHIP/FRESHER: Do NOT penalize lack of professional work experience. Evaluate based on projects, coursework, certifications, hackathons, and learning trajectory.
         - Role Recommendations: For students/interns, ONLY recommend Intern, Junior, or Fresher roles (e.g., Software Engineer Intern, Full Stack Intern). Do not recommend senior roles.
      2. Strictly Qualitative Analysis: Do not extract skills, do not calculate mathematical scores, and do not attempt to count projects. Focus entirely on providing professional-grade insights.
      3. No Hallucinations: Use ONLY information present in the resume. Never invent skills, projects, or experience.
      
      Required JSON format:
      {
        "suggestedRole": "...",
        "summary": "...",
        "strengths": ["...", "...", "...", "..."],
        "areasForGrowth": ["...", "...", "...", "..."],
        "actionPlan": {
          "immediateFixes": ["..."],
          "skillsToLearn": ["..."],
          "projectsToBuild": ["..."],
          "certificationsToPursue": ["..."]
        },
        "qualityRating": "Poor | Fair | Good | Excellent"
      }
      
      OUTPUT ONLY RAW, VALID JSON. Do not include markdown formatting, \`\`\`json fences, or any other explanations.`;

fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + key, {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    contents: [{ role: 'user', parts: [{text: prompt}] }],
    systemInstruction: { role: 'user', parts: [{text: 'You are an expert ATS and Resume Analyzer. Count resume facts accurately.'}] },
    generationConfig: { temperature: 0.0, maxOutputTokens: 8192, responseMimeType: 'application/json' }
  })
}).then(r => r.json()).then(data => {
  console.log(data?.candidates?.[0]?.content?.parts?.[0]?.text);
}).catch(console.error);
