import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import { usePersistentReadiness } from './usePersistentReadiness';
import { useCareer } from '../contexts/CareerContext';
import { hiddenPotentialService } from '../services/hiddenPotentialService';
import { geminiService } from '../services/geminiService';

export function useHiddenPotential() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { persistentData: readinessData } = usePersistentReadiness();
  const { careerContext } = useCareer();

  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const currentTarget = profile?.targetRole || 'Software Engineer';

  const fetchReport = useCallback(async () => {
    if (!user?.uid) return;
    try {
      setIsLoading(true);
      setError(null);
      const data = await hiddenPotentialService.getReport(user.uid);
      if (data) {
        setReport(data);
      }
    } catch (err) {
      console.error('Failed to fetch hidden potential report:', err);
      setError('Failed to load your hidden potential report.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const generateReport = async () => {
    if (!user?.uid) return;
    setIsGenerating(true);
    setError(null);
    try {
      // Aggregate massive context
      const contextData = {
        targetRole: currentTarget,
        skills: profile?.skills || [],
        extractedSkills: profile?.extractedSkills || [],
        missingSkills: profile?.missingSkills || [],
        readinessScore: readinessData?.score || 0,
        githubData: careerContext?.githubScore ? { score: careerContext.githubScore } : null,
        linkedinData: careerContext?.linkedinScore ? { score: careerContext.linkedinScore } : null
      };

      const aiResponse = await geminiService.detectHiddenPotential(contextData);
      
      const savedPayload = await hiddenPotentialService.saveReport(
        user.uid,
        currentTarget,
        aiResponse.detectedCareers
      );

      setReport(savedPayload);
      return savedPayload;
    } catch (err) {
      console.error('Error generating hidden potential:', err);
      setError('Failed to run the AI detection engine. Please try again.');
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    report,
    currentTarget,
    isLoading,
    isGenerating,
    error,
    generateReport
  };
}
