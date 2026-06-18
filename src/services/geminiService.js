import { calculateATSScore } from '../utils/atsScoringEngine';
import { analyticsService } from './analyticsService';

const getApiKey = () => {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) throw new Error('VITE_GEMINI_API_KEY is not configured.');
  return key;
};

const callGemini = async (prompt, systemInstruction = null, inlineDataItems = [], temperature = 0.3, featureName = 'Unknown', timeoutMs = 30000) => {
  const apiKey = getApiKey();
  
  const parts = [{ text: prompt }];
  if (inlineDataItems && inlineDataItems.length > 0) {
    inlineDataItems.forEach(item => {
      parts.push({
        inline_data: {
          mime_type: item.mimeType,
          data: item.data
        }
      });
    });
  }

  const requestBody = {
    contents: [{ parts }],
    generationConfig: { 
      temperature: temperature, 
      responseMimeType: 'application/json' 
    }
  };

  if (systemInstruction) {
    requestBody.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let response;
  const startTime = Date.now();
  try {
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(requestBody),
        signal: controller.signal
      }
    );
  } catch (err) {
    if (err.name === 'AbortError') {
      analyticsService.trackError('Gemini API Timeout', err);
      analyticsService.trackAIOperation(featureName, 0, Date.now() - startTime, false, 'Timeout');
      throw new Error(`Gemini API request timed out after ${timeoutMs / 1000} seconds.`);
    }
    analyticsService.trackError('Gemini API Error', err);
    analyticsService.trackAIOperation(featureName, 0, Date.now() - startTime, false, err.message);
    throw err;
  }

  if (!response.ok) {
    clearTimeout(timeoutId);
    const rawErrorText = await response.text();
    console.error('[Gemini Service] HTTP Error response body:', rawErrorText);
    let errorMsg = `Gemini API Error: ${response.status}`;
    try {
      const errJson = JSON.parse(rawErrorText);
      if (errJson?.error?.message) errorMsg = errJson.error.message;
    } catch (e) {
      // Ignored
    }
    const error = new Error(errorMsg);
    error.status = response.status;
    analyticsService.trackError('Gemini API HTTP Error', error);
    analyticsService.trackAIOperation(featureName, 0, Date.now() - startTime, false, errorMsg);
    throw error;
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  const responseTime = Date.now() - startTime;
  const tokenUsage = data.usageMetadata?.totalTokenCount || 'N/A';
  console.log(`[Gemini API] Request completed. Time: ${responseTime}ms | Tokens: ${tokenUsage} | Prompt length: ${prompt.length} chars`);

  if (!rawText) {
    console.error('[Gemini Service] Missing rawText in response body:', JSON.stringify(data));
    analyticsService.trackError('Gemini Empty Response', new Error('Empty response'));
    analyticsService.trackAIOperation(featureName, tokenUsage, responseTime, false, 'Empty response');
    throw new Error('Empty response from Gemini.');
  }

  const cleaned = rawText.replace(/^```json\s*/m, '').replace(/```\s*$/m, '').trim();
  
  try {
    const parsed = JSON.parse(cleaned);
    analyticsService.trackAIOperation(featureName, tokenUsage, responseTime, true, null);
    return parsed;
  } catch (parseError) {
    console.error('[Resume Analysis Error] Failed to parse Gemini JSON response.', parseError);
    console.error('Raw text received:', rawText);
    analyticsService.trackError('Gemini Parse Error', parseError);
    analyticsService.trackAIOperation(featureName, tokenUsage, responseTime, false, 'JSON Parse Error');
    throw new Error('Failed to parse Gemini JSON response.');
  } finally {
    clearTimeout(timeoutId);
  }
};

export const geminiService = {
  async analyzeResume(dataOrFile) {
    analyticsService.trackEvent('Resume Analysis Started');
    try {
      const inlineDataItems = [];
      let prompt = `Analyze the following resume data and provide a JSON response:`;
      
      // If dataOrFile is a base64 extracted object
      if (dataOrFile && dataOrFile.base64) {
        inlineDataItems.push({
          mimeType: dataOrFile.mimeType || 'application/pdf',
          data: dataOrFile.base64
        });
        prompt = `Analyze the attached resume document and provide a JSON response. Extract all skills, experiences, and metrics. Calculate an ATS score.`;
      } else {
        prompt = `Analyze the following resume data and provide a JSON response:
        ${JSON.stringify(dataOrFile)}`;
      }

      prompt += `
      
      CRITICAL INSTRUCTIONS:
      1. Recommendations MUST be highly specific and reference actual content from the resume.
      2. Do NOT provide generic advice like "add more metrics" - instead, give specific examples based on their stated experience.
      3. Only extract skills that are genuinely present in the resume. Do NOT hallucinate.
      4. Ensure there is no contradictory feedback (e.g., do not say a section is strong and then list it as a weakness).
      5. Include a qualityScores object assessing the accuracy, relevance, personalization, and consistency of your analysis on a scale of 1 to 10.
      
      Required JSON format:
      {
        "rawMetrics": {
          "numberOfSkills": 0,
          "numberOfProjects": 0,
          "yearsOfExperience": 0,
          "quantifiedAchievements": 0,
          "hasSummary": true,
          "hasEducation": true,
          "missingCrucialKeywords": 0,
          "formattingErrors": 0
        },
        "summary": "...",
        "strengths": ["..."],
        "weaknesses": ["..."],
        "missingKeywords": ["..."],
        "extractedSkills": ["..."],
        "recommendedSkills": ["..."],
        "improvements": [
          {
            "area": "Experience/Skills/Projects/Education/Formatting",
            "priority": "HIGH" | "MEDIUM" | "LOW",
            "title": "Short title",
            "description": "Specific actionable advice referencing actual resume text"
          }
        ],
        "careerSuggestions": ["..."],
        "qualityScores": {
          "accuracy": 0,
          "relevance": 0,
          "personalization": 0,
          "consistency": 0
        }
      }`;
      
      const result = await callGemini(prompt, "You are an expert ATS and Resume Analyzer. Count resume facts accurately.", inlineDataItems, 0.0, 'Resume Analysis');
      
      // Calculate deterministic ATS score using rule-based engine
      const scoring = calculateATSScore(result.rawMetrics || {});
      
      // Override Gemini's score with the deterministic score
      result.atsScore = scoring.totalScore;
      result.scoreBreakdown = scoring.breakdown;
      
      analyticsService.trackEvent('Resume Analysis Completed', { atsScore: result.atsScore });
      return result;
    } catch (error) {
      console.error('Gemini Resume Analysis Error:', error);
      analyticsService.trackError('Resume Analysis Feature Error', error);
      throw error;
    }
  },

  async analyzeCareerCoach(contextData) {
    try {
      const prompt = `Based on the following user context, provide actionable career coaching advice.
      Context: ${JSON.stringify(contextData)}
      
      CRITICAL INSTRUCTIONS:
      1. You must use the provided context (Resume, Roadmap, Skill Gap) to generate your advice.
      2. Do not drift into generic career advice. Be highly specific to their exact profile.
      3. Maintain a supportive, professional career coach tone.
      4. Include a qualityScores object assessing accuracy, relevance, personalization, and consistency.
      
      Required JSON format:
      {
        "immediateActions": ["..."],
        "shortTermGoals": ["..."],
        "longTermStrategy": "...",
        "recommendedResources": ["..."],
        "qualityScores": {
          "accuracy": 0,
          "relevance": 0,
          "personalization": 0,
          "consistency": 0
        }
      }`;
      
      const result = await callGemini(prompt, "You are a top-tier Career Coach AI.", [], 0.3, 'Career Coach');
      return result;
    } catch (error) {
      console.error('Gemini Career Coach Error:', error);
      analyticsService.trackError('Career Coach Feature Error', error);
      throw error;
    }
  },

  async analyzeSkillGap(contextData) {
    analyticsService.trackEvent('Skill Gap Analysis Started');
    try {
      const prompt = `Analyze the skill gap between the candidate and the target opportunity.
      Context: ${JSON.stringify(contextData)}
      
      CRITICAL INSTRUCTIONS:
      1. Resolve synonyms strictly (e.g. OOP = Object-Oriented Programming, ReactJS = React).
      2. Missing skills must be genuinely missing from the candidate's profile.
      3. Skill recommendations must be directly relevant to the target role. Do not hallucinate technologies.
      4. Include a qualityScores object assessing accuracy, relevance, personalization, and consistency out of 10.
      
      Required JSON format:
      {
        "currentSkills": ["skills they already have that match"],
        "missingSkills": ["skills required but missing"],
        "prioritySkills": ["top 3 skills to learn immediately"],
        "recommendations": ["actionable steps to bridge the gap"],
        "reasoning": "brief explanation of the gap analysis",
        "qualityScores": {
          "accuracy": 0,
          "relevance": 0,
          "personalization": 0,
          "consistency": 0
        }
      }`;
      
      const result = await callGemini(prompt, "You are an expert Career Coach.", [], 0.3, 'Skill Gap Analysis');
      analyticsService.trackEvent('Skill Gap Analysis Completed');
      return result;
    } catch (error) {
      console.error('Gemini Skill Gap Analysis Error:', error);
      analyticsService.trackError('Skill Gap Feature Error', error);
      throw error;
    }
  },

  async analyzeOpportunityMatch(userProfileContext, opportunityText, resumeData) {
    analyticsService.trackEvent('Match Analysis Started');
    try {
      const startTime = Date.now();
      
      // LOG: requested metrics
      const resumeLen = JSON.stringify(resumeData || {}).length;
      const oppLen = opportunityText.length;
      
      console.log('--- MATCH ENGINE TIMEOUT INVESTIGATION LOGS ---');
      console.log('Request Start Time:', new Date(startTime).toISOString());
      console.log('Model Used:', 'gemini-2.5-flash'); // Hardcoded in callGemini
      console.log('Resume Length (not sent to Gemini):', resumeLen, 'chars');
      console.log('Opportunity Description Length:', oppLen, 'chars');
      console.log('Prompt sending: ONLY Opportunity Description (Extracting requirements)');

      // Step 1: Extract deterministic requirements from opportunity (with strict caching)
      const cacheKey = `opp_match_cache_${opportunityText.trim().substring(0, 100).replace(/[^a-zA-Z0-9]/g, '')}_${opportunityText.length}`;
      let reqsResult;
      
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        console.log('Match Engine: Using Cached Extraction');
        reqsResult = JSON.parse(cached);
      } else {
        const extractPrompt = `Extract requirements from the job description.

DESCRIPTION:
${opportunityText}

JSON FORMAT:
{
  "requiredSkills": ["skill1", "skill2"],
  "tools": ["tool1", "tool2"],
  "requiredExperienceYears": 2,
  "requiredEducation": "Bachelor's Degree"
}`;

        const promptLength = extractPrompt.length;
        console.log('Prompt Length:', promptLength, 'chars');
        
        // Use 60000ms timeout for Match Engine to prevent premature timeout
        reqsResult = await callGemini(extractPrompt, "You are a precise data extractor.", [], 0.0, 'Opportunity Match Extraction', 60000);
        
        // Inject opportunity text for local deterministic checks
        reqsResult.opportunityText = opportunityText;

        const endTime = Date.now();
        console.log('Request End Time:', new Date(endTime).toISOString());
        console.log('Duration:', endTime - startTime, 'ms');
        console.log('Response Size:', JSON.stringify(reqsResult).length, 'chars');
        
        localStorage.setItem(cacheKey, JSON.stringify(reqsResult));
      }
      
      // Step 2: Calculate Deterministic Score locally
      const { calculateMatchScore } = await import('../utils/matchScoringEngine');
      const deterministicResult = calculateMatchScore(resumeData || userProfileContext, reqsResult);

      // Return results directly from deterministic engine
      analyticsService.trackEvent('Match Analysis Completed');
      return {
        currentMatchScore: deterministicResult.currentMatchScore,
        potentialMatchScore: deterministicResult.potentialMatchScore,
        strengths: deterministicResult.strengths,
        missingSkills: deterministicResult.missingSkills,
        recommendations: deterministicResult.recommendations || []
      };
    } catch (error) {
      console.error('Gemini Opportunity Match Error:', error);
      analyticsService.trackError('Opportunity Match Feature Error', error);
      throw error;
    }
  },

  async evaluateCandidateFit(candidateData, opportunityData) {
    try {
      const prompt = `Evaluate how well this candidate fits the opportunity.
      Candidate: ${JSON.stringify(candidateData)}
      Opportunity: ${JSON.stringify(opportunityData)}
      
      CRITICAL INSTRUCTIONS:
      1. Explanations must be evidence-based and precisely reference the opportunity text.
      2. Do not invent missing skills.
      3. Do not generate random claims or hallucinated experiences.
      4. Include a qualityScores object to evaluate your output.
      
      Required JSON format:
      {
        "matchScore": 85,
        "fitAnalysis": "...",
        "strengths": ["..."],
        "concerns": ["..."],
        "recommendation": "Strong Hire | Proceed | Reject",
        "qualityScores": {
          "accuracy": 0,
          "relevance": 0,
          "personalization": 0,
          "consistency": 0
        }
      }`;
      
      return await callGemini(prompt, "You are an expert AI Recruiter.", [], 0.3, 'Evaluate Candidate Fit');
    } catch (error) {
      console.error('Gemini Candidate Evaluation Error:', error);
      analyticsService.trackError('Candidate Fit Feature Error', error);
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
      
      CRITICAL INSTRUCTIONS:
      1. You must use the provided Context Data to ground your answers.
      2. Do not provide generic advice. Be highly specific to their profile context.
      3. Keep responses conversational but strictly career-focused.
      4. Include a qualityScores object.
      
      Required JSON format:
      {
        "response": "Your conversational response here",
        "qualityScores": {
          "accuracy": 0,
          "relevance": 0,
          "personalization": 0,
          "consistency": 0
        }
      }`;
      
      return await callGemini(prompt, "You are OpportunityOS Copilot, a highly personalized AI career assistant. You ONLY reason from available profile data.", [], 0.3, 'Copilot Chat');
    } catch (error) {
      console.error('Gemini Copilot Error:', error);
      analyticsService.trackError('Copilot Feature Error', error);
      throw error;
    }
  },

  async generateDynamicSkillGapReport(payload) {
    analyticsService.trackEvent('Dynamic Skill Gap Started');
    try {
      const { targetRole, manualSkills, githubData, linkedinData, resumeData } = payload;
      
      const inlineDataItems = [];
      let resumeContext = "No resume provided.";
      let linkedinContext = "No LinkedIn profile provided.";
      
      if (resumeData) {
        inlineDataItems.push({
          mimeType: resumeData.mimeType,
          data: resumeData.base64
        });
        resumeContext = "A resume document is provided as an attachment. Extract all technical skills, programming languages, tools, frameworks, and experience from it.";
      }

      if (linkedinData) {
        inlineDataItems.push({
          mimeType: linkedinData.mimeType,
          data: linkedinData.base64
        });
        linkedinContext = "A LinkedIn Profile PDF is provided as an attachment. Extract Skills, Experience, Education, Certifications, and Projects. IMPORTANT QUALITY CHECK: If the LinkedIn PDF contains very little information, you MUST output the exact phrase: 'Limited LinkedIn profile data detected. Resume and GitHub analysis will be prioritized.' inside the 'aiAdvice' field.";
      }

      const prompt = `You are a world-class AI Career Coach & Technical Recruiter.
Generate a highly personalized Skill Gap Analysis for the user targeting the role of: "${targetRole}"

# USER CONTEXT:
1. Manual Skills Provided: ${manualSkills?.length ? manualSkills.join(", ") : "None"}
2. GitHub Data: ${githubData ? JSON.stringify(githubData) : "Not connected"}
3. Resume Context: ${resumeContext}
4. LinkedIn Context: ${linkedinContext}

# INSTRUCTIONS:
1. Extract all skills from the attached Resume and LinkedIn Profile PDF (if provided), as well as GitHub and Manual skills.
2. Merge and deduplicate all extracted skills from all sources.
3. Compare the merged skills against the standard industry requirements for a "${targetRole}".
4. Calculate a realistic "readinessScore" (0 to 100) and a "skillGapPercentage" (0 to 100).
5. Categorize skills into strong, moderate, and missing.
6. Identify the single most important "nextSkill" to learn.
7. Group missing skills by priority (high, medium, low).
8. Create a 6-step personalized "learningPath" roadmap.
9. Generate personalized "aiAdvice" (2-3 sentences max) addressing their specific gaps.
10. Generate a short "consistencyTip" (1-2 sentences max).
11. CRITICAL: Handle synonyms perfectly (e.g. OOP = Object-Oriented Programming, React = ReactJS). Do NOT hallucinate technologies. Missing skills must be genuinely required for the role but absent from the user's profile.
12. Include a qualityScores object to evaluate your output.

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
    ... exactly 6 items
  ],
  "aiAdvice": "Personalized career advice based on their profile.",
  "consistencyTip": "Short tip on how to stay consistent.",
  "qualityScores": {
    "accuracy": 0,
    "relevance": 0,
    "personalization": 0,
    "consistency": 0
  }
}`;

      const result = await callGemini(prompt, "You are a master career AI. Output only valid JSON.", inlineDataItems, 0.3, 'Dynamic Skill Gap', 60000);
      analyticsService.trackEvent('Dynamic Skill Gap Completed');
      return result;
    } catch (error) {
      console.error('Gemini Dynamic Skill Gap Error:', error);
      analyticsService.trackError('Dynamic Skill Gap Feature Error', error);
      throw error;
    }
  },

  async generateProjectRecommendations(contextData) {
    analyticsService.trackEvent('Project Recommendations Started');
    try {
      const { specialization, targetRole } = contextData;
      
      const prompt = `You are an expert technology mentor.

Based on the user's specialization and target role, generate innovative and industry-relevant project ideas.

Inputs:

Specialization:
${specialization || 'Computer Science'}

Target Role:
${targetRole || 'Software Engineer'}

Requirements:

* Generate projects relevant to the specialization.
* Generate projects relevant to the target role.
* Focus on portfolio-worthy and real-world projects.
* Avoid generic beginner projects.
* Recommend modern technologies and current industry use cases.
* Make recommendations dynamic and AI-generated.
* Do not analyze skill gaps.
* Do not analyze user profiles.
* Do not calculate scores.

For each project return:
{
  "title": "",
  "description": "",
  "technologies": [],
  "whyThisProject": ""
}

Return JSON only. Format as an array of the above object.`;

      const result = await callGemini(prompt, "You are an expert technology mentor. Output valid JSON only.", [], 0.3, 'Project Recommendations');
      analyticsService.trackEvent('Project Recommendations Completed');
      return result;
    } catch (error) {
      console.error('Gemini Project Recommendations Error:', error);
      analyticsService.trackError('Project Recommendations Error', error);
      throw error;
    }
  }
};
