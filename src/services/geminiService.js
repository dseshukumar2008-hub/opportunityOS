import { analyticsService } from './analyticsService';

import { generate } from './ai/aiProvider';

async function callGemini(prompt, systemInstruction = '', inlineDataItems = [], temperature = 0.3, featureName = 'Unknown', timeout = 30000) {
  const request = {
    providerName: 'gemini',
    feature: featureName,
    prompt: prompt,
    responseType: 'json', // geminiService always expects JSON
    options: {
      systemInstruction,
      temperature,
      inlineData: inlineDataItems,
      timeout
    }
  };
  
  const response = await generate(request);
  if (response.error) {
    throw response.error;
  }
  return response.data;
}

export const geminiService = {
  /**
   * New strictly formatted ATS scanner logic
   */
  async extractResumeData(textData, fileData) {
    analyticsService.trackEvent('Resume Extraction Started');
    try {
      const inlineDataItems = [];
      let prompt = `You are an expert resume parser.\nExtract the following information from the provided resume text or document and format it into the exact JSON schema provided.\n\n`;

      if (fileData) {
        inlineDataItems.push({
          mimeType: fileData.mimeType || 'application/pdf',
          data: fileData.base64
        });
        prompt += `A PDF/DOCX of the resume is attached.\n`;
      } else if (textData) {
        prompt += `Here is the pasted text from the resume:\n${textData}\n`;
      } else {
        throw new Error("No resume data provided.");
      }

      prompt += `
CRITICAL INSTRUCTIONS:
1. Extract ALL information accurately. Do not invent any data.
2. If a section is missing from the resume, return an empty array or empty string as per the schema.
3. For education, if cgpa is missing, leave it blank.
4. For projects, infer the tech stack if not explicitly listed but technologies are mentioned in the description.

Required JSON Schema:
{
  "personalInfo": {
    "fullName": "",
    "role": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "github": "",
    "portfolio": ""
  },
  "education": [
    { "id": "uuid1", "degree": "", "school": "", "year": "", "cgpa": "" }
  ],
  "skills": ["skill1", "skill2"],
  "projects": [
    { "id": "uuid2", "title": "", "link": "", "description": "", "techStack": "" }
  ],
  "experience": [
    { "id": "uuid3", "role": "", "company": "", "duration": "", "responsibilities": "- bullet 1\\n- bullet 2" }
  ],
  "certifications": [
    { "id": "uuid4", "title": "", "issuer": "", "year": "" }
  ]
}

Return JSON only.`;

      const result = await callGemini(prompt, "You are an expert resume parser. Output valid JSON only.", inlineDataItems, 0.1, 'Resume Extraction', 60000);
      analyticsService.trackEvent('Resume Extraction Completed');
      return result;
    } catch (error) {
      console.error('Gemini Resume Extraction Error:', error);
      analyticsService.trackError('Resume Extraction Error', error);
      throw error;
    }
  },

  async enhanceResumeText(text, contextType, actionType = 'enhance') {
    analyticsService.trackEvent('Resume Text Enhancement Started', { actionType });
    try {
      let instructions = '';
      if (actionType === 'ats') {
        instructions = 'Rewrite the following text to maximize ATS compatibility by integrating relevant industry keywords and standard formatting while preserving the original meaning.';
      } else if (actionType === 'shorten') {
        instructions = 'Shorten the following text to make it extremely concise and punchy without losing key achievements or context.';
      } else if (actionType === 'professional') {
        instructions = 'Rewrite the following text using highly professional business language and powerful action verbs.';
      } else {
        instructions = 'Rewrite the following text to make it highly professional, impactful, and ATS-friendly. Use strong action verbs and ensure it highlights achievements and metrics if present.';
      }

      const prompt = `You are an expert technical resume writer.
${instructions}
(Context: ${contextType})

Original Text:
${text}

CRITICAL INSTRUCTIONS:
1. Do NOT invent new facts, metrics, or technologies not implied in the original text.
2. If it is a list of bullet points, preserve the bullet point format (e.g. starting with "-").

Output JSON format:
{
  "enhancedText": "The fully enhanced text string"
}`;

      const result = await callGemini(prompt, "You are an expert resume writer. Output JSON only.", [], 0.3, 'Resume Enhancement');
      analyticsService.trackEvent('Resume Text Enhancement Completed');
      return result.enhancedText;
    } catch (error) {
      console.error('Gemini Enhance Text Error:', error);
      throw error;
    }
  },

  async scanResumeAgainstTargetRole(resumeText, targetRole) {
    analyticsService.trackEvent('ATS Target Role Scan Started');
    try {
      const prompt = `You are an ATS scanner and Senior Career Coach.

Analyze the uploaded resume based ONLY on the content present in the resume.

STRICT RULES:

* Do not invent skills.
* Do not invent projects.
* Do not invent experience.
* Do not invent certifications.
* Do not assume technologies not explicitly mentioned.
* If information is missing, state that it is missing.
* Every recommendation must be supported by resume content.

RESUME TEXT:
${resumeText}

TARGET ROLE:
${targetRole}

Perform the following analysis:

1. ATS SCORE (0-100)
   Break down the score:
   * Contact Information
   * Education
   * Skills
   * Projects
   * Experience
   * Certifications
   * Keywords
   * Formatting

2. SKILLS DETECTED
   Return only skills explicitly found in the resume.

3. MISSING SKILLS
   Compare the resume against the target role and list only genuinely missing skills.

4. RESUME SUMMARY
   Write a concise professional summary based only on the resume.

5. STRENGTHS
   List strengths supported by resume evidence.

6. AREAS FOR IMPROVEMENT
   List concrete improvements supported by resume evidence.



7. ATS RATING
   Return:
   * Poor
   * Fair
   * Good
   * Excellent

Return JSON only in this format:

{
  "atsScore": 0,
  "skillsDetected": [],
  "missingSkills": [],
  "summary": "",
  "strengths": [],
  "improvements": [],
  "atsRating": ""
}`;

      const result = await callGemini(prompt, "You are a precise ATS scanner. Output JSON only.", [], 0.0, 'ATS Target Role Scan');
      analyticsService.trackEvent('ATS Target Role Scan Completed');
      return result;
    } catch (err) {
      console.error('Gemini Target Role Scan Error:', err);
      analyticsService.trackError('ATS Target Role Scan Error', err);
      throw err;
    }
  },

  async analyzeResume(dataOrFile, extractedText = '', profileType = 'experienced') {
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
        
        if (extractedText) {
           prompt += `\n\nHere is the locally extracted raw text from the document for reference:\n"""\n${extractedText}\n"""\n\n`;
        }
      } else {
        prompt = `Analyze the following resume data and provide a JSON response:
        ${JSON.stringify(dataOrFile)}`;
      }

      prompt += `
      
      CRITICAL INSTRUCTIONS:
      1. Profile Type Context: This candidate is identified as a(n) **${profileType.toUpperCase()}**.
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
      }`;
      
      console.log('[Resume Analyzer] Gemini request started');
      const result = await callGemini(prompt, "You are an expert ATS and Resume Analyzer. Count resume facts accurately.", inlineDataItems, 0.0, 'Resume Analysis');
      console.log('[Resume Analyzer] Gemini response received');
      
      // We do not calculate ATS here anymore; it's done before calling this in useResumeAnalysis.
      
      analyticsService.trackEvent('Resume Analysis Completed');
      return result;
    } catch (error) {
      console.error('[Resume Analyzer] Gemini Resume Analysis Error:', error);
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

  async analyzeReadiness(contextData) {
    analyticsService.trackEvent('Readiness Analysis Started');
    try {
      const prompt = `You are an expert Career Coach.
      Analyze this user's Career Readiness data, including their scores and sub-component breakdowns:
      ${JSON.stringify(contextData)}

      CRITICAL INSTRUCTIONS:
      1. Identify exactly 3 key strengths based on their highest scores or completion status.
      2. Identify exactly 2 critical weaknesses or gaps based on their lowest scores or missing data.
      3. Provide the 3 most impactful "recommendations" they should take today to improve their score.

      Required JSON output:
      {
        "strengths": ["...", "...", "..."],
        "weaknesses": ["...", "..."],
        "recommendations": ["...", "...", "..."]
      }`;
      
      const result = await callGemini(prompt, "You are a top-tier Career Coach AI. Output valid JSON only.", [], 0.3, 'Readiness Analysis');
      analyticsService.trackEvent('Readiness Analysis Completed');
      return result;
    } catch (error) {
      console.error('Gemini Readiness Analysis Error:', error);
      analyticsService.trackError('Readiness Analysis Feature Error', error);
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
      
      return await callGemini(prompt, "You are an expert AI Career Coach.", [], 0.3, 'Evaluate Candidate Fit');
    } catch (error) {
      console.error('Gemini Candidate Evaluation Error:', error);
      analyticsService.trackError('Candidate Fit Feature Error', error);
      throw error;
    }
  },

  async chatWithCopilot({ mode, contextData, history, message, generateGoals = false }) {
    try {
      let prompt = `Chat Context: Mode=${mode}
      Context Data: ${JSON.stringify(contextData)}
      Chat History: ${JSON.stringify(history)}
      User Message: ${message}
      
      CRITICAL INSTRUCTIONS:
      1. You must use the provided Context Data to ground your answers.
      2. Do not provide generic advice. Be highly specific to their profile context.
      3. Keep responses conversational but strictly career-focused.`;
      
      if (generateGoals) {
        prompt += `
        4. Generate actionable weekly goals and daily actions based on their current career readiness and skill gaps.
        
        Required JSON format:
        {
          "weeklyGoals": ["Goal 1", "Goal 2"],
          "dailyActions": ["Action 1", "Action 2"],
          "personalizedAdvice": "Your conversational response here"
        }`;
      } else {
        prompt += `
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
      }
      
      return await callGemini(prompt, "You are OpportunityOS Copilot V2, a highly personalized AI career assistant. You ONLY reason from available profile data.", [], 0.3, 'Copilot Chat');
    } catch (error) {
      console.error('Gemini Copilot Error:', error);
      analyticsService.trackError('Copilot Feature Error', error);
      throw error;
    }
  },

  async generateDynamicSkillGapReport(payload) {
    analyticsService.trackEvent('Dynamic Skill Gap Started');
    
    // Check cache based on payload length and target role
    const cacheKey = `sg_cache_${JSON.stringify(payload).length}_${payload.targetRole?.replace(/[^a-zA-Z0-9]/g, '')}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      console.log('[Skill Gap] Using cached result');
      return JSON.parse(cached);
    }
    
    try {
      const { targetRole, manualSkills, githubData, resumeData } = payload;
      
      const inlineDataItems = [];
      let resumeContext = "No resume provided.";
      
      if (resumeData) {
        inlineDataItems.push({
          mimeType: resumeData.mimeType,
          data: resumeData.base64
        });
        resumeContext = "A resume document is provided as an attachment. Extract all technical skills, programming languages, tools, frameworks, and experience from it.";
      }


      const prompt = `You are a world-class AI Career Coach.
Generate a highly personalized Skill Gap Analysis for the user targeting the role of: "${targetRole}"

# USER CONTEXT:
1. Manual Skills Provided: ${manualSkills?.length ? manualSkills.join(", ") : "None"}
2. GitHub Data: ${githubData ? JSON.stringify(githubData) : "Not connected"}
3. Resume Context: ${resumeContext}

# INSTRUCTIONS:
1. Extract all skills from the attached Resume, as well as GitHub and Manual skills.
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
      
      sessionStorage.setItem(cacheKey, JSON.stringify(result));
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
      const { specialization, targetRole, missingSkills, excludedProjects = [] } = contextData;
      
      const prompt = `You are an expert technology mentor.

Based on the user's specialization, target role, and identified missing skills, generate innovative and industry-relevant project ideas that will help them close their skill gap.

Inputs:

Specialization:
${specialization || 'Computer Science'}

Target Role:
${targetRole || 'Software Engineer'}

Missing Skills to Target:
${missingSkills?.length > 0 ? missingSkills.join(', ') : 'None specified. Generate well-rounded projects.'}

Excluded Projects (DO NOT recommend these or highly similar variations):
${excludedProjects?.length > 0 ? excludedProjects.join(', ') : 'None'}

Requirements:

* Generate projects relevant to the specialization.
* Generate projects relevant to the target role.
* Focus on portfolio-worthy and real-world projects.
* Avoid generic beginner projects.
* Recommend modern technologies and current industry use cases.
* MUST NOT recommend any project title or concept listed in the 'Excluded Projects' section.
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
  },



  async analyzeGithubPortfolio(username, githubData, targetRole, localMetrics) {
    analyticsService.trackEvent('GitHub Analysis Started');
    try {
      const prompt = `You are a senior engineering manager and expert technical recruiter.
Analyze the provided GitHub portfolio data for user "${username}" against their target role of "${targetRole}".

GITHUB PROFILE STATS:
Followers: ${localMetrics.basicStats.followers}
Total Stars: ${localMetrics.basicStats.totalStars}
Languages Detected: ${localMetrics.technologyAnalysis.detected.join(', ')}

TOP REPOSITORY DEEP ANALYSIS:
${JSON.stringify(localMetrics.deepAnalysis, null, 2)}

CRITICAL INSTRUCTIONS:
1. You must dynamically generate the entire analysis based ONLY on the provided Top Repository Deep Analysis data. Do not hallucinate projects, languages, or tools not present in the data.
2. Every string in "strengths" and "weaknesses" MUST cite a specific repository name, file (e.g. package.json, Dockerfile), or metric from the data as evidence.
   - Good Example: "The 'opportunity-os' repository demonstrates strong React architecture with its package.json dependencies."
   - Bad Example: "You have strong React skills."
3. Calculate a "githubScore" (0-100) based on repository complexity, documentation (README), tech diversity, and commit consistency.
4. Calculate a "careerMatch" breakdown (0-100 for each: frontend, backend, aiTools, cloudDevOps) based strictly on the detected technologies in the deep analysis.
5. Provide exactly 5 personalized "recommendations" based on detected gaps (e.g. if no Dockerfile, recommend Docker).
   - "title" must be short (max 4-5 words).
   - "desc" must be exactly 2-3 lines (around 18-25 words). It MUST be highly professional, action-oriented, and easy to scan. Do NOT sound conversational.
   - "priority" must be "High", "Medium", or "Low".
6. Provide an "analysisSummary" (array of exactly 5-6 string bullet points) summarizing key metrics. Examples: "18 public repositories analyzed.", "Primary language: JavaScript.", "Documentation quality is moderate." DO NOT return empty strings.
7. Provide an "overallAssessment" paragraph. It MUST be different for every profile and based entirely on the analyzed repositories. Do NOT return empty strings, null, or placeholders. This MUST be a professional engineering audit summary. Do NOT use generic AI phrases like "Great job" or "Good start".

Required JSON Schema:
{
  "githubScore": 0,
  "analysisSummary": [
    "string",
    "string",
    "string",
    "string",
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

      // Use longer timeout as this is a heavy reasoning task (passing deep repo data)
      console.log("[geminiService] Sending prompt to callGemini...");
      const result = await callGemini(prompt, "You are an expert tech recruiter. Output valid JSON only.", [], 0.3, 'GitHub Analysis', 60000);
      console.log("[geminiService] callGemini returned:", result);
      
      if (result && result._fallbackMode) {
        console.warn("[geminiService] Result has _fallbackMode = true");
        return result; // Pass fallback flag up
      }

      analyticsService.trackEvent('GitHub Analysis Completed');
      return result;
    } catch (error) {
      console.error('=== [geminiService] Gemini GitHub Analysis ERROR CAUGHT ===', error);
      analyticsService.trackError('GitHub Analysis Feature Error', error);
      // Return fallback mode object if it completely throws
      return { _fallbackMode: true, _status: "Error", _errorMessage: error.message };
    }
  }
};
