import { useState, useCallback, useMemo } from 'react';
import { geminiService } from '../services/geminiService';
import { useProfile } from '../contexts/ProfileContext';
import { useResume } from '../contexts/ResumeContext';
import { useCareerRoadmap } from './useCareerRoadmap';
import { useMatchResume } from './useMatchResume';

export function useOpportunityMatch() {
  const { resumeData } = useResume();
  const { state: roadmapState } = useCareerRoadmap();
  const { matchResume, uploadNewResume } = useMatchResume();
  const { mergeProfileData } = useProfile();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [error, setError] = useState(null);

  const profileContext = useMemo(() => {
    // A real resume exists if it's stored in match_resumes
    const actuallyHasResume = !!matchResume;
    
    // Check for other context data
    const hasRoadmap = roadmapState?.roadmap != null;

    // Collect skills primarily from matchResume and resumeData
    const extractedSkills = matchResume?.extracted_skills || [];
    const builderSkills = resumeData?.skills || [];
    
    const allSkills = new Set([
      ...extractedSkills,
      ...builderSkills
    ]);

    // Phase 4: Match Confidence
    let confidence = 'Low';
    const totalSkillsExtracted = allSkills.size;

    if (actuallyHasResume) {
      if (totalSkillsExtracted > 10 || (totalSkillsExtracted > 5 && hasRoadmap)) {
        confidence = 'High';
      } else if (totalSkillsExtracted > 0) {
        confidence = 'Medium';
      }
    }

    const sources = [];
    if (actuallyHasResume) sources.push('Uploaded Resume');
    else if (allSkills.size > 0) sources.push('Manual Profile');
    
    if (hasRoadmap) sources.push('Career Roadmap');

    console.log('[Opportunity Match Profile Detection]', {
      resumeFound: actuallyHasResume,
      skillsCount: allSkills.size,
      hasRoadmap,
      confidenceCalculation: confidence
    });

    return {
      skills: Array.from(allSkills),
      sourcesUsed: sources,
      confidence,
      actuallyHasResume
    };
  }, [resumeData, roadmapState, matchResume]);

  const analyzeMatch = useCallback(async (opportunityText, uploadedResumeFile = null) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const contextToUse = { ...profileContext };

      // If user provided a new file right now, parse it and extract skills via useMatchResume
      if (uploadedResumeFile) {
        const newMatchResume = await uploadNewResume(uploadedResumeFile);
        if (newMatchResume?.extracted_skills) {
          contextToUse.skills = [...new Set([...contextToUse.skills, ...newMatchResume.extracted_skills])];
          if (!contextToUse.sourcesUsed.includes('Uploaded Resume')) {
            contextToUse.sourcesUsed.push('Uploaded Resume');
            contextToUse.confidence = 'High';
            contextToUse.actuallyHasResume = true;
          }
        }
      }

      if (contextToUse.skills.length === 0) {
        throw new Error('No resume profile data found. Please upload a resume first.');
      }

      // Pass the full resumeData along with contextToUse so the deterministic engine has access to projects and experience
      const fullResumePayload = {
        ...resumeData,
        skills: contextToUse.skills // Ensure we use the merged skills (including any newly extracted ones)
      };

      const result = await geminiService.analyzeOpportunityMatch(contextToUse, opportunityText, fullResumePayload);
      
      if (result?.missingSkills?.length > 0) {
        mergeProfileData({ missingSkills: result.missingSkills });
      }

      setMatchResult({
        ...result,
        sourcesUsed: contextToUse.sourcesUsed,
        confidence: contextToUse.confidence
      });
      
    } catch (err) {
      console.error('[Opportunity Match Error]', err);
      setError(err.message || 'Failed to analyze match.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [profileContext, uploadNewResume, resumeData]);

  return {
    analyzeMatch,
    isAnalyzing,
    matchResult,
    error,
    profileContext
  };
}
