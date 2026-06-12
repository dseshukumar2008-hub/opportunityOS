import { useState, useCallback, useEffect, useRef } from 'react';
import { useUserProfile } from './useUserProfile';
import { useResumeInsights } from './useResumeInsights';
import { useRecommendations } from './useRecommendations';
import { useApplications } from '../contexts/ApplicationContext';
import { useAuth } from '../contexts/AuthContext';

const CACHE_KEY_PREFIX = 'ai_copilot_plan_';
const CACHE_EXPIRY_MS = 6 * 60 * 60 * 1000; // 6 hours

function buildContext({ profile, atsScore, topStrength, topWeakness, missingSkills, nextAction, recommendations, applications }) {
  return {
    profile: {
      name: profile?.name || 'Student',
      skills: profile?.skills || [],
      goals: profile?.careerGoals || [],
      interests: profile?.interests || [],
      college: profile?.college || '',
      branch: profile?.branch || '',
    },
    resume: {
      atsScore: atsScore || 0,
      topStrength: topStrength || 'N/A',
      topWeakness: topWeakness || 'N/A',
      missingSkills: missingSkills || [],
      nextAction: nextAction || '',
    },
    opportunities: {
      topMatches: (recommendations || []).slice(0, 3).map(r => ({
        title: r.title,
        company: r.company,
        matchScore: r.matchData?.score,
        skills: r.skills?.slice(0, 3),
      })),
    },
    applications: {
      total: applications?.length || 0,
      active: applications?.filter(a => ['Applied', 'In Review', 'Assessment'].includes(a.status)).length || 0,
      interviews: applications?.filter(a => a.status === 'Interview').length || 0,
    },
  };
}

async function generateActionPlan(contextData) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error('VITE_GEMINI_API_KEY is not configured.');

  const prompt = `You are an expert AI Career Copilot inside OpportunityOS. Generate a highly personalized Today's Action Plan for this student.

User Context:
${JSON.stringify(contextData, null, 2)}

Return ONLY valid JSON matching this exact schema:
{
  "greeting": "Short motivational sentence (max 12 words)",
  "focus_area": "One key theme for today (e.g. Resume Optimization)",
  "actions": [
    {
      "id": 1,
      "category": "Resume",
      "title": "Improve ATS score by adding quantifiable metrics",
      "detail": "One-line actionable tip",
      "priority": "high",
      "link": "/resume-review",
      "cta": "Open Resume"
    }
  ],
  "skill_recommendations": [
    { "skill": "React Testing Library", "reason": "Required in 3 of your top matches", "link": "/opportunities" }
  ],
  "resume_tips": [
    { "tip": "Add a quantified achievement in your experience section", "impact": "high" }
  ],
  "team_recommendation": {
    "message": "Join a team working on full-stack projects to boost your portfolio",
    "link": "/team-finder"
  },
  "weekly_goal": "Apply to 3 matching internships before Friday"
}

Rules:
- actions: 4 items exactly, covering Resume, Opportunities, Skills, and Teams
- priority must be one of: "high", "medium", "low"
- All links must be valid internal routes: /resume-review, /opportunities, /profile, /team-finder, /applications
- Be specific — reference the user's actual skills, ATS score (${contextData.resume.atsScore}), and top matches`;

  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.4, responseMimeType: 'application/json' },
  };

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) }
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
}

export function useAICopilot() {
  const { profile } = useUserProfile();
  const { atsScore, topStrength, topWeakness, missingSkills, nextAction } = useResumeInsights();
  const { recommendations } = useRecommendations();
  const { applications } = useApplications();
  const { user } = useAuth();

  const [plan, setPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const contextRef = useRef(null);

  useEffect(() => {
    contextRef.current = buildContext({ profile, atsScore, topStrength, topWeakness, missingSkills, nextAction, recommendations, applications });
  }, [profile, atsScore, topStrength, topWeakness, missingSkills, nextAction, recommendations, applications]);

  const loadPlan = useCallback(async (forceRefresh = false) => {
    if (!user) return;
    const cacheKey = `${CACHE_KEY_PREFIX}${user.uid || user.id}`;

    if (!forceRefresh) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < CACHE_EXPIRY_MS) {
            setPlan(parsed.data);
            return;
          }
        } catch { /* stale */ }
      }
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await generateActionPlan(contextRef.current || {});
      setPlan(result);
      localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: result }));
    } catch (err) {
      console.error('AI Copilot error:', err);
      setError('Unable to generate your action plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Auto-load plan once when user is available and no plan exists yet.
  // Using a ref to avoid re-triggering after loadPlan identity changes.
  const hasInitialized = useRef(false);
  useEffect(() => {
    if (user && !hasInitialized.current) {
      hasInitialized.current = true;
      loadPlan();
    }
  }, [user, loadPlan]);

  return { plan, isLoading, error, refresh: () => loadPlan(true) };
}
