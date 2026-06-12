const getApiKey = () => {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) throw new Error('VITE_GEMINI_API_KEY is not configured.');
  return key;
};

const callGemini = async (prompt, systemInstruction = null) => {
  const apiKey = getApiKey();
  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { 
      temperature: 0.3, 
      responseMimeType: 'application/json' 
    }
  };

  if (systemInstruction) {
    requestBody.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(requestBody) 
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Gemini API Error: ${response.status}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error('Empty response from Gemini.');

  const cleaned = rawText.replace(/^```json\s*/m, '').replace(/```\s*$/m, '').trim();
  return JSON.parse(cleaned);
};

export const geminiService = {
  async analyzeResume(dataOrFile) {
    try {
      // Stub implementation since file uploading to Gemini API requires the File API or base64
      // We will assume dataOrFile is a text payload of the parsed resume for now
      const prompt = `Analyze the following resume data and provide a JSON response:
      ${JSON.stringify(dataOrFile)}
      
      Required JSON format:
      {
        "atsScore": 85,
        "summary": "...",
        "strengths": ["..."],
        "weaknesses": ["..."],
        "missingKeywords": ["..."],
        "extractedSkills": ["..."],
        "recommendedSkills": ["..."],
        "improvements": ["..."],
        "careerSuggestions": ["..."]
      }`;
      
      return await callGemini(prompt, "You are an expert ATS and Resume Analyzer.");
    } catch (error) {
      console.error('Gemini Resume Analysis Error:', error);
      throw error;
    }
  },

  async analyzeCareerCoach(contextData) {
    try {
      const prompt = `Based on the following user context, provide actionable career coaching advice.
      Context: ${JSON.stringify(contextData)}
      
      Required JSON format:
      {
        "immediateActions": ["..."],
        "shortTermGoals": ["..."],
        "longTermStrategy": "...",
        "recommendedResources": ["..."]
      }`;
      
      return await callGemini(prompt, "You are a top-tier Career Coach AI.");
    } catch (error) {
      console.error('Gemini Career Coach Error:', error);
      throw error;
    }
  },

  async analyzeSkillGap(contextData) {
    try {
      const prompt = `Analyze the skill gap between the candidate and the target opportunity.
      Context: ${JSON.stringify(contextData)}
      
      Required JSON format:
      {
        "currentSkills": ["skills they already have that match"],
        "missingSkills": ["skills required but missing"],
        "prioritySkills": ["top 3 skills to learn immediately"],
        "recommendations": ["actionable steps to bridge the gap"],
        "reasoning": "brief explanation of the gap analysis"
      }`;
      
      return await callGemini(prompt, "You are an expert Technical Recruiter and Career Advisor.");
    } catch (error) {
      console.error('Gemini Skill Gap Analysis Error:', error);
      throw error;
    }
  },

  async evaluateCandidateFit(candidateData, opportunityData) {
    try {
      const prompt = `Evaluate how well this candidate fits the opportunity.
      Candidate: ${JSON.stringify(candidateData)}
      Opportunity: ${JSON.stringify(opportunityData)}
      
      Required JSON format:
      {
        "matchScore": 85,
        "fitAnalysis": "...",
        "strengths": ["..."],
        "concerns": ["..."],
        "recommendation": "Strong Hire | Proceed | Reject"
      }`;
      
      return await callGemini(prompt, "You are an expert AI Recruiter.");
    } catch (error) {
      console.error('Gemini Candidate Evaluation Error:', error);
      throw error;
    }
  },

  async chatWithCopilot({ mode, contextData, history, message }) {
    try {
      // For chat, we need a different format, we don't necessarily want JSON if it's a direct chat
      // but if the app expects JSON with a 'response' field, we'll format it.
      const prompt = `Chat Context: Mode=${mode}
      Context Data: ${JSON.stringify(contextData)}
      Chat History: ${JSON.stringify(history)}
      User Message: ${message}
      
      Required JSON format:
      {
        "response": "Your conversational response here"
      }`;
      
      return await callGemini(prompt, "You are OpportunityOS Copilot, a helpful AI career assistant.");
    } catch (error) {
      console.error('Gemini Copilot Error:', error);
      throw error;
    }
  }
};
