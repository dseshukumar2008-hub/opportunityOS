import { useState, useCallback, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { resumeStorageService } from '../services/resumeStorageService';
import { useAuth } from '../contexts/AuthContext';

export function useResumeAnalysis() {
  const { user } = useAuth();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [storedResumeUrl, setStoredResumeUrl] = useState(null);
  const [storedResumeName, setStoredResumeName] = useState(null);
  const [storedResumePath, setStoredResumePath] = useState(null);
  const [error, setError] = useState(null);

  // Load saved analysis + resume metadata from Firestore on mount
  const loadSavedAnalysis = useCallback(async () => {
    if (!user?.id) return;
    try {
      const saved = await resumeStorageService.getAnalysisFromFirestore(user.id);
      if (saved?.analysis) {
        setAnalysisResults(saved.analysis);
      }
      if (saved?.resume) {
        setStoredResumeUrl(saved.resume.resumeUrl || null);
        setStoredResumeName(saved.resume.fileName || null);
        setStoredResumePath(saved.resume.storagePath || null);
      }
    } catch (err) {
      console.warn('Could not load saved analysis:', err);
    }
  }, [user?.id]);

  useEffect(() => {
    loadSavedAnalysis();
  }, [loadSavedAnalysis]);

  const analyzeResume = useCallback(async (dataOrFile) => {
    setIsAnalyzing(true);
    setError(null);
    setUploadProgress(0);

    try {
      // 1. Run Gemini AI analysis
      let results = null;
      if (import.meta.env.VITE_GEMINI_API_KEY) {
        try {
          results = await geminiService.analyzeResume(dataOrFile);
          if (typeof results?.atsScore !== 'number' || !Array.isArray(results?.strengths)) {
            console.warn('Gemini returned invalid schema, falling back to mock.');
            results = null;
          }
        } catch (geminiError) {
          console.error('Gemini AI failed, falling back to mock engine:', geminiError);
          results = null;
        }
      }

      // 2. Fallback to rule-based mock if Gemini unavailable
      if (!results) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        results = generateMockFeedback(dataOrFile);
      }

      setAnalysisResults(results);

      // 3. Upload file to Firebase Storage (only for actual File uploads)
      if (user?.id && dataOrFile instanceof File) {
        try {
          setUploadProgress(1); // Signal upload starting
          const { downloadURL, fileName, storagePath } = await resumeStorageService.uploadResume(
            dataOrFile,
            user.id,
            (progress) => setUploadProgress(progress)
          );

          setStoredResumeUrl(downloadURL);
          setStoredResumeName(fileName);
          setStoredResumePath(storagePath);

          // 4. Persist resume metadata to Firestore
          await resumeStorageService.saveResumeMetaToFirestore(user.id, {
            resumeUrl: downloadURL,
            fileName,
            storagePath
          });
        } catch (uploadErr) {
          console.error('Resume upload to Firebase Storage failed:', uploadErr);
          // Non-fatal: analysis still succeeded
        }
      }

      // 5. Persist analysis results to Firestore
      if (user?.id) {
        try {
          await resumeStorageService.saveAnalysisToFirestore(user.id, results);

          // 6. Auto-merge extracted skills into user profile
          if (results.extractedSkills?.length > 0) {
            await resumeStorageService.mergeSkillsToProfile(user.id, results.extractedSkills);
          }
        } catch (persistErr) {
          console.error('Failed to persist analysis to Firestore:', persistErr);
          // Non-fatal
        }
      }

      setIsAnalyzing(false);
      setUploadProgress(100);
      return results;

    } catch (err) {
      setError(err.message || 'Failed to analyze resume.');
      setIsAnalyzing(false);
      return null;
    }
  }, [user?.id]);

  const deleteStoredResume = useCallback(async () => {
    if (!user?.id || !storedResumePath) return;
    try {
      await resumeStorageService.deleteResume(storedResumePath);
      setStoredResumeUrl(null);
      setStoredResumeName(null);
      setStoredResumePath(null);
    } catch (err) {
      console.error('Failed to delete resume:', err);
    }
  }, [user?.id, storedResumePath]);

  const resetAnalysis = useCallback(() => {
    setAnalysisResults(null);
    setError(null);
    setIsAnalyzing(false);
    setUploadProgress(0);
  }, []);

  return {
    analyzeResume,
    resetAnalysis,
    deleteStoredResume,
    loadSavedAnalysis,
    isAnalyzing,
    uploadProgress,
    analysisResults,
    storedResumeUrl,
    storedResumeName,
    error
  };
}

// Rule-based fallback mock engine
function generateMockFeedback(dataOrFile) {
  let atsScore = 82;
  const missingKeywords = ['Leadership', 'Problem Solving'];
  const strengths = ['Strong project section', 'Good technical skills'];
  const weaknesses = ['Lacks quantifiable metrics', 'Missing some industry standard keywords'];
  const improvements = [
    { area: 'Experience', priority: 'HIGH', title: 'Highlight Achievements', description: 'Transform task descriptions into achievement statements for your experience entries.' },
    { area: 'Projects', priority: 'MEDIUM', title: 'Add Project Metrics', description: 'Include measurable outcomes to demonstrate real impact.' }
  ];
  const recommendedSkills = ['TypeScript', 'GraphQL'];
  const extractedSkills = [];

  if (dataOrFile && !(dataOrFile instanceof File) && dataOrFile.personalInfo) {
    const d = dataOrFile;
    let score = 50;
    const pi = d.personalInfo || {};
    if (pi.fullName && pi.email) score += 10;
    if (d.skills?.length > 3) score += 15;
    if (d.projects?.length > 0) score += 10;
    if (d.experience?.length > 0) score += 15;
    atsScore = score;
    extractedSkills.push(...(d.skills || []));
    if (d.skills?.length < 3) missingKeywords.push('React', 'Node.js');
    if (d.skills?.length >= 3) strengths.push('Good technical skill variety');
  }

  return {
    atsScore,
    summary: 'Your resume shows a solid foundation but could benefit from stronger achievement metrics and broader keyword coverage to pass standard ATS filters.',
    strengths,
    weaknesses,
    missingKeywords,
    extractedSkills,
    improvements,
    recommendedSkills,
    careerSuggestions: ['Software Engineer', 'Full Stack Developer']
  };
}
