import { useState, useCallback, useEffect } from 'react';
import { useResume } from '../contexts/ResumeContext';
import { useResumeHistory } from './useResumeHistory';
import { useAuth } from '../contexts/AuthContext';
import { geminiService } from '../services/geminiService';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000;
const CACHE_KEY_PREFIX = 'career_roadmap_';

export function useCareerRoadmap() {
  const { resumeData } = useResume();
  const { getBestVersion } = useResumeHistory();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [roadmapData, setRoadmapData] = useState(null);

  const bestVersion = getBestVersion();

  const generateRoadmap = useCallback(async (forceRefresh = false) => {
    if (!user) return;

    const cacheKey = `${CACHE_KEY_PREFIX}${user.id}`;

    if (!forceRefresh) {
      const cachedString = localStorage.getItem(cacheKey);
      if (cachedString) {
        try {
          const cached = JSON.parse(cachedString);
          if (Date.now() - cached.timestamp < CACHE_EXPIRY_MS) {
            setRoadmapData(cached.data);
            return;
          }
        } catch (e) {
          console.warn('Invalid roadmap cache', e);
        }
      }
    }

    setIsLoading(true);
    setError(null);

    const contextData = {
      user: {
        skills: user.skills || [],
        interests: user.interests || [],
        goals: user.goals || [],
      },
      resume: {
        skills: resumeData?.skills || [],
        experience: resumeData?.experience || [],
        projects: resumeData?.projects || [],
        certifications: resumeData?.certifications || [],
        summary: resumeData?.summary || '',
      },
      atsScore: bestVersion?.results?.overallScore || 0,
    };

    const prompt = `You are an expert AI Career Coach. Generate a highly personalized, structured career roadmap for this student.

User Context:
${JSON.stringify(contextData, null, 2)}

Return ONLY a valid JSON object matching this exact schema:
{
  "goals": ["overall career goal 1", "overall career goal 2"],
  "milestones": ["milestone 1", "milestone 2", "milestone 3"],
  "plan": {
    "30_days": {
      "title": "30-Day Plan",
      "focus": "Short summary of the 30 day focus",
      "skills": ["skill to learn"],
      "projects": ["project to build"],
      "certifications": ["certification to pursue"],
      "opportunities": ["type of opportunity to apply to"],
      "actions": ["specific action step"]
    },
    "90_days": {
      "title": "90-Day Plan",
      "focus": "Short summary of the 90 day focus",
      "skills": ["skill to learn"],
      "projects": ["project to build"],
      "certifications": ["certification to pursue"],
      "opportunities": ["type of opportunity to apply to"],
      "actions": ["specific action step"]
    },
    "6_months": {
      "title": "6-Month Plan",
      "focus": "Short summary of the 6 month focus",
      "skills": ["skill to learn"],
      "projects": ["project to build"],
      "certifications": ["certification to pursue"],
      "opportunities": ["type of opportunity to apply to"],
      "actions": ["specific action step"]
    },
    "12_months": {
      "title": "12-Month Plan",
      "focus": "Short summary of the 12 month focus",
      "skills": ["skill to learn"],
      "projects": ["project to build"],
      "certifications": ["certification to pursue"],
      "opportunities": ["type of opportunity to apply to"],
      "actions": ["specific action step"]
    }
  }
}`;

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error('VITE_GEMINI_API_KEY is not configured.');

      const requestBody = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, responseMimeType: 'application/json' }
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
      const results = JSON.parse(cleaned);

      setRoadmapData(results);
      localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: results }));

      // Save to Firebase
      await addDoc(collection(db, 'career_roadmaps'), {
        uid: user.id,
        generatedAt: serverTimestamp(),
        roadmap: results.plan,
        goals: results.goals || [],
        milestones: results.milestones || [],
      }).catch(err => console.error('Firebase roadmap save failed:', err));

    } catch (err) {
      console.error('Career Roadmap Error:', err);
      setError('Unable to generate roadmap. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [user, resumeData, bestVersion]);

  useEffect(() => {
    if (user && !roadmapData && !isLoading && !error) {
      generateRoadmap();
    }
  }, [user, roadmapData, isLoading, error, generateRoadmap]);

  return {
    isLoading,
    error,
    roadmapData,
    generateRoadmap,
  };
}
