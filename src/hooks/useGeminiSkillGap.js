import { useState, useEffect, useCallback } from 'react';
import { useResume } from '../contexts/ResumeContext';
import { useResumeHistory } from './useResumeHistory';

import { useTeam } from '../contexts/TeamContext';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import { geminiService } from '../services/geminiService';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNotifications } from '../contexts/NotificationContext';

const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000;
const ENABLE_AI_NOTIFICATIONS = false;

export function useGeminiSkillGap(opportunity) {
  const { resumeData } = useResume();
  const { getBestVersion } = useResumeHistory();

  const { teams } = useTeam();
  const { user } = useAuth();
  const { profile, mergeProfileData } = useProfile();
  const { addNotification } = useNotifications();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gapData, setGapData] = useState(null);

  const bestVersion = getBestVersion();

  const generateGapAnalysis = useCallback(async (forceRefresh = false) => {
    if (!opportunity || !opportunity.id) return;
    if (!user) return;

    const cacheKey = `gemini_skill_gap_${opportunity.id}`;

    if (!forceRefresh) {
      const cachedString = localStorage.getItem(cacheKey);
      if (cachedString) {
        try {
          const cached = JSON.parse(cachedString);
          if (Date.now() - cached.timestamp < CACHE_EXPIRY_MS) {
            setGapData(cached.data);
            return;
          }
        } catch (e) {
          console.warn("Invalid cache data", e);
        }
      }
    }

    setIsLoading(true);
    setError(null);

    const contextData = {
      opportunity: {
        title: opportunity.title,
        company: opportunity.company,
        requiredSkills: opportunity.requiredSkills,
        description: opportunity.fullDescription,
        type: opportunity.type,
      },
      user: {
        skills: profile?.extractedSkills || user.skills || [],
        interests: user.interests || [],
        goals: user.goals || [],
      },
      resume: {
        skills: resumeData?.skills || [],
        experience: resumeData?.experience || [],
        projects: resumeData?.projects || [],
        certifications: resumeData?.certifications || [],
      },
      atsScore: bestVersion?.results?.overallScore || 0,
      applicationsCount: 0,
      teamsCount: teams?.length || 0,
    };

    try {
      if (!import.meta.env.VITE_GEMINI_API_KEY) {
        throw new Error('VITE_GEMINI_API_KEY is not configured.');
      }

      const results = await geminiService.analyzeSkillGap(contextData);
      
      if (results) {
        setGapData(results);
        localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: results }));
        
        // Save generated analysis to Firebase
        await addDoc(collection(db, 'skill_gap_analysis'), {
          uid: user.id,
          generatedAt: serverTimestamp(),
          currentSkills: results.currentSkills || [],
          missingSkills: results.missingSkills || [],
          prioritySkills: results.prioritySkills || [],
          recommendations: results.recommendations || [],
          reasoning: results.reasoning || ""
        }).catch(err => console.error("Firebase save failed", err));

        if (results.missingSkills?.length > 0) {
          await mergeProfileData({ missingSkills: results.missingSkills });
        }

        if (!cachedString && ENABLE_AI_NOTIFICATIONS) {
          addNotification({
            title: 'Skill Gap Analysis Ready',
            message: `Analysis completed for ${opportunity.title} at ${opportunity.company}.`,
            type: 'System',
            targetUrl: '/skill-gap'
          });
        }
      }
    } catch (err) {
      console.error("Skill Gap Analysis Error:", err);
      setError("Unable to generate analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [opportunity, resumeData, bestVersion, teams, user]);

  // Removed automatic execution on load. Call generateGapAnalysis manually.

  return {
    isLoading,
    error,
    gapData,
    generateGapAnalysis
  };
}
