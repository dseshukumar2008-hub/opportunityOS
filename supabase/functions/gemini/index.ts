import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('Server configuration error: Gemini API key is missing.');
    }

    const { action, payload } = await req.json();
    if (!action || !payload) {
      throw new Error('Invalid request format. Action and payload are required.');
    }

    let prompt = '';
    const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];

    // Route actions to specific prompts
    if (action === 'analyzeResume') {
      prompt = `
Act as an expert technical recruiter and Applicant Tracking System (ATS) evaluator.
Analyze the following candidate resume.

Return ONLY a valid JSON object matching exactly this schema, and nothing else (do not wrap in markdown \`\`\`json):
{ 
  "atsScore": number (0-100),
  "summary": "A 2-3 sentence overarching summary of their profile",
  "strengths": ["string", "string"],
  "weaknesses": ["string", "string"],
  "missingKeywords": ["string", "string"],
  "improvements": [
    {
      "area": "Experience/Skills/Projects/Education/Formatting",
      "priority": "HIGH" | "MEDIUM" | "LOW",
      "title": "Short title",
      "description": "Actionable advice"
    }
  ],
  "recommendedSkills": ["string", "string"]
}
`;
      if (payload.type === 'file') {
        parts.push({ text: prompt });
        parts.push({
          inlineData: {
            mimeType: payload.mimeType === 'application/pdf' ? 'application/pdf' : 'text/plain',
            data: payload.data
          }
        });
      } else {
        parts.push({ text: prompt + '\nResume Data:\n' + JSON.stringify(payload) });
      }

    } else if (action === 'analyzeCareerCoach') {
      prompt = `
Act as an expert Career Coach and Mentor. Review the following user profile and career goal.

Context Data:
${JSON.stringify(payload, null, 2)}

Return ONLY a valid JSON object matching exactly this schema, and nothing else (do not wrap in markdown \`\`\`json):
{
  "dailyAdvice": "Short, highly specific advice for today.",
  "weeklyFocus": "One area they should focus on this week.",
  "biggestGap": "The most glaring missing piece in their profile.",
  "actionItem": "A highly specific, immediate next step.",
  "motivation": "A 1-sentence encouraging wrap-up."
}
`;
      parts.push({ text: prompt });
    } else if (action === 'analyzeSkillGap') {
      prompt = `
Act as an expert Technical Recruiter and Career Strategist.
Perform a strict Skill Gap Analysis comparing the candidate's profile against the Target Role.

Context Data:
${JSON.stringify(payload, null, 2)}

Return ONLY a valid JSON object matching exactly this schema, and nothing else (do not wrap in markdown \`\`\`json):
{
  "matchedSkills": ["string", "string"],
  "missingSkills": [
    {
      "skill": "string",
      "impact": "High Impact" | "Medium Impact" | "Low Impact",
      "points": number (estimated impact on matching score, e.g. 5, 10, 15)
    }
  ],
  "softSkillGaps": ["string", "string"],
  "missingExperience": ["string", "string"],
  "recommendedProjects": ["string", "string"],
  "recommendedCertifications": ["string", "string"],
  "learningRoadmap": [
    {
      "step": "string (e.g. Step 1)",
      "title": "string",
      "description": "string"
    }
  ],
  "priorityGaps": ["string", "string"],
  "matchScore": number (0-100)
}
`;
      parts.push({ text: prompt });
    } else if (action === 'evaluateFit') {
      prompt = `
Act as an expert Senior Technical Recruiter. Evaluate the following candidate profile against the opportunity requirements.

Opportunity Details:
${JSON.stringify(payload.opportunityData, null, 2)}

Candidate Profile:
${JSON.stringify(payload.candidateData, null, 2)}

Analyze the fit based on:
1. Skill Match
2. Project Relevance
3. Experience Relevance
4. Missing Skills
5. Growth Potential

Return ONLY a valid JSON object matching exactly this schema, and nothing else (do not wrap in markdown \`\`\`json):
{
  "candidateScore": number (0-100),
  "strengths": ["string", "string"],
  "concerns": ["string", "string"],
  "missingSkills": ["string", "string"],
  "recommendation": "string (A 1-2 sentence recommendation for the hiring manager)",
  "interviewPriority": "HIGH" | "MEDIUM" | "LOW",
  "summary": "string (A 3-4 sentence comprehensive evaluation summary)"
}
`;
      parts.push({ text: prompt });
    } else if (action === 'copilotChat') {
      const { mode, contextData, message } = payload;

      const systemInstruction = mode === 'student'
        ? "You are the OpportunityOS Copilot, an expert AI assistant for students. Use the provided Student Context to answer their career, resume, and application questions. Be helpful, concise, and highly specific to their data."
        : "You are the OpportunityOS Copilot, an expert AI assistant for employers. Use the provided Employer Context to answer questions about candidates, job postings, and recruitment strategies. Be helpful, analytical, and concise.";

      prompt = `
System Instruction: ${systemInstruction}

Context Data:
${JSON.stringify(contextData, null, 2)}

User Message: ${message}

Return ONLY a valid JSON object matching exactly this schema, and nothing else (do not wrap in markdown \`\`\`json):
{
  "response": "string (your detailed answer to the user)"
}
`;
      parts.push({ text: prompt });
    } else {
      throw new Error(`Unsupported action: ${action}`);
    }

    let requestBody: Record<string, unknown> = {
      contents: [],
      generationConfig: { temperature: 0.2, responseMimeType: "application/json" }
    };

    if (action === 'copilotChat' && payload.history && Array.isArray(payload.history)) {
      // Add history
      const formattedHistory = payload.history.map((msg: { role: string; content: string }) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));
      requestBody.contents = [...formattedHistory, { role: 'user', parts }];
    } else {
      requestBody.contents = [{ parts }];
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.error?.message || `Gemini API Error: ${response.status}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error('Received empty response from Gemini.');
    }

    // Clean Markdown wrapper if present and attempt parse to validate
    const cleanedText = rawText.replace(/^\s*```json/m, '').replace(/```\s*$/m, '').trim();
    let jsonResult;
    try {
      jsonResult = JSON.parse(cleanedText);
    } catch {
      throw new Error('Gemini returned malformed JSON.');
    }

    return new Response(JSON.stringify(jsonResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: unknown) {
    console.error('Edge Function Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
