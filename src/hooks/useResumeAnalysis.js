import { useState, useCallback, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { resumeStorageService } from '../services/resumeStorageService';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { fileToBase64 } from '../utils/fileUtils';

const ENABLE_AI_NOTIFICATIONS = false;

export function useResumeAnalysis() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
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
    console.log('[Resume Analysis] Upload Started');
    
    setIsAnalyzing(true);
    setError(null);
    setUploadProgress(0);
    setProgressText('Uploading...');

    try {
      let payloadForGemini = dataOrFile;
      let extractedText = '';

      if (dataOrFile instanceof File) {
        if (dataOrFile.size > 10 * 1024 * 1024) {
          throw new Error('Your resume exceeds the 10 MB upload limit. Please compress your PDF or remove unnecessary images before uploading.');
        }
        
        setProgressText('Extracting Resume...');
        console.log(`[Resume Analysis] Processing file: ${dataOrFile.name} (${dataOrFile.size} bytes)`);
        
        // Extract text locally first
        try {
          const { extractTextFromFile, optimizeLargeResumeText } = await import('../utils/fileUtils');
          console.log('[Resume Analyzer] Text extraction started');
          extractedText = await extractTextFromFile(dataOrFile);
          console.log(`[Resume Analyzer] Text extraction success: ${extractedText?.length} characters`);
          
          if (!extractedText || extractedText.trim().length === 0) {
            throw new Error('No readable text was found in this resume.');
          }
          if (extractedText.length < 100) {
            throw new Error(`Extracted text is too short (${extractedText.length} chars). Please upload a valid resume with selectable text.`);
          }
          
          // Smart Text Truncation
          const originalLength = extractedText.length;
          extractedText = optimizeLargeResumeText(extractedText, 25000);
          if (extractedText.length < originalLength) {
             console.log(`[Resume Analyzer] Text optimized from ${originalLength} to ${extractedText.length} chars`);
          }
        } catch (extractionError) {
          console.error('[Resume Analyzer] Local extraction failed:', extractionError);
          console.log('[Resume Analyzer] Text extraction failure');
          setIsAnalyzing(false);
          setUploadProgress(0);
          setProgressText('');
          
          let errMsg = extractionError.message || 'Unexpected error occurred.';
          if (extractionError.type === 'PDF_EXTRACTION_FAILURE') errMsg = "We couldn't read this resume. Please upload a valid PDF or DOCX document.";
          else if (extractionError.type === 'DOCX_EXTRACTION_FAILURE') errMsg = "We couldn't read this resume. Please upload a valid PDF or DOCX document.";
          else if (extractionError.type === 'UNSUPPORTED_FILE') errMsg = 'Unsupported file format.';
          
          setError(errMsg);
          return { _error: true, message: errMsg };
        }

        // Avoid base64 payload if file is too large (> 4MB) to protect AI limits
        if (dataOrFile.size > 4 * 1024 * 1024) {
          console.log('[Resume Analysis] Skipping Base64 conversion for large file');
          payloadForGemini = extractedText;
        } else {
          setProgressText('Preparing AI Analysis...');
          payloadForGemini = await fileToBase64(dataOrFile);
          console.log('[Resume Analysis] Base64 Generated');
        }
      } else if (typeof dataOrFile === 'string') {
        const { optimizeLargeResumeText } = await import('../utils/fileUtils');
        extractedText = optimizeLargeResumeText(dataOrFile, 25000);
        payloadForGemini = extractedText;
      }

      setProgressText('Analyzing Resume...');

      let results = null;
      let localMetrics = null;
      
      // Phase 1: Local Analysis Engine
      try {
        const { extractTextMetrics } = await import('../utils/resumeRuleEngine');
        const { calculateATSScore } = await import('../utils/atsScoringEngine');
        
        localMetrics = extractTextMetrics(extractedText);
        console.log('[Resume Analyzer] Phase 1 Local Extraction Complete. Profile:', localMetrics.profileType);
        
        // Calculate ATS Score Locally
        const scoring = calculateATSScore(localMetrics);
        localMetrics.atsScore = scoring.totalScore;
        localMetrics.scoreBreakdown = scoring.breakdown;
        localMetrics.explanation = scoring.explanation;
        localMetrics.rating = scoring.rating;
        
      } catch (err) {
        console.error('Phase 1 Local Analysis failed:', err);
        throw new Error('Resume parsing failed.');
      }

      // Phase 2: Gemini Analysis Engine
      if (import.meta.env.VITE_GEMINI_API_KEY) {
        try {
          console.log('[Resume Analysis] Phase 2: Requesting Insights');
          const aiInsights = await geminiService.analyzeResume(payloadForGemini, extractedText, localMetrics.profileType);
          console.log('[Resume Analysis] Phase 2 Insights Received');
          
          // Phase 3: Validation Layer
          if (!aiInsights || !aiInsights.suggestedRole || !Array.isArray(aiInsights.strengths)) {
            throw new Error('Invalid AI insight schema.');
          }
          
          // Generate Smart Suggestions dynamically based on the analysis
          const smartSuggestions = [];

          // 1. Local ATS Deductions (Losses)
          if (localMetrics.explanation) {
            localMetrics.explanation.forEach(exp => {
              if (exp.type === 'loss') {
                smartSuggestions.push({
                  area: 'ATS Formatting',
                  priority: 'HIGH',
                  title: exp.label,
                  description: `This caused an ATS deduction of ${exp.points} points. Add or improve this section to increase your parsing score.`
                });
              }
            });
          }

          // 2. Missing Keywords
          if (localMetrics.missingKeywords && localMetrics.missingKeywords.length > 0) {
            smartSuggestions.push({
              area: 'Keywords',
              priority: 'MEDIUM',
              title: 'Missing Crucial Keywords',
              description: `Your resume is missing important industry keywords. Consider adding: ${localMetrics.missingKeywords.slice(0, 5).join(', ')}.`
            });
          }

          // 3. AI Areas for Growth
          if (aiInsights.areasForGrowth && Array.isArray(aiInsights.areasForGrowth)) {
            aiInsights.areasForGrowth.forEach(area => {
              const desc = area.includes('. ') ? area : `${area}. Ensure you incorporate this feedback into your next revision.`;
              smartSuggestions.push({
                area: 'Content Strategy',
                priority: 'MEDIUM',
                title: 'Area for Growth',
                description: desc
              });
            });
          }

          // 4. AI Action Plan - Immediate Fixes
          if (aiInsights.actionPlan?.immediateFixes && Array.isArray(aiInsights.actionPlan.immediateFixes)) {
            aiInsights.actionPlan.immediateFixes.forEach(fix => {
              const desc = fix.includes('. ') ? fix : `${fix}. Apply this fix immediately.`;
              smartSuggestions.push({
                area: 'Priority Fix',
                priority: 'HIGH',
                title: 'Immediate Action Needed',
                description: desc
              });
            });
          }

          // 5. AI Action Plan - Skills
          if (aiInsights.actionPlan?.skillsToLearn && Array.isArray(aiInsights.actionPlan.skillsToLearn)) {
            aiInsights.actionPlan.skillsToLearn.forEach(skill => {
              smartSuggestions.push({
                area: 'Skill Development',
                priority: 'LOW',
                title: `Learn ${skill}`,
                description: `You are missing this skill for target roles. Acquire this skill and add it to your resume to boost your match rate.`
              });
            });
          }

          // Enforce ATS Score Rule: If score is < 90 but no suggestions exist, add a fallback.
          if (localMetrics.atsScore < 90 && smartSuggestions.length === 0) {
            smartSuggestions.push({
              area: 'Optimization',
              priority: 'LOW',
              title: 'Minor Polish Needed',
              description: 'Your resume is good but not perfect. Try quantifying more achievements to push your score above 90.'
            });
          }
          
          // Merge
          results = {
            ...aiInsights,
            ...localMetrics, // override any hallucinations if they sneaked in
            extractedSkills: localMetrics.extractedSkills,
            missingKeywords: aiInsights.missingKeywords || localMetrics.missingKeywords, // use AI's keyword explanation first
            atsScore: localMetrics.atsScore,
            scoreBreakdown: localMetrics.scoreBreakdown,
            explanation: localMetrics.explanation,
            qualityRating: aiInsights.qualityRating || localMetrics.rating || 'Good',
            smartSuggestions,
            contentSuggestions: aiInsights.contentSuggestions,
            recommendedSkills: aiInsights.recommendedSkills,
            recommendedCertifications: aiInsights.recommendedCertifications,
            recommendedProjects: aiInsights.recommendedProjects
          };
          
        } catch (geminiError) {
          console.error('[Resume Analysis Error] Phase 3 Validation Failed:', geminiError);
          throw new Error('Resume analysis could not be completed. Please try again.');
        }
      } else {
        throw new Error('VITE_GEMINI_API_KEY missing, cannot proceed.');
      }

      setAnalysisResults(results);

      // 3. Upload file to Firebase Storage (only for actual File uploads)
      if (user?.id && dataOrFile instanceof File) {
        try {
          console.log('[Resume Analyzer] Starting Firebase Storage upload...');
          setUploadProgress(1); // Signal upload starting
          
          // Add timeout to upload to prevent infinite hang
          const uploadPromise = resumeStorageService.uploadResume(
            dataOrFile,
            user.id,
            (progress) => setUploadProgress(progress)
          );
          
          const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Upload timeout")), 10000));
          const { downloadURL, fileName, storagePath } = await Promise.race([uploadPromise, timeoutPromise]);
          
          console.log('[Resume Analyzer] Firebase Storage upload complete:', fileName);

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
          console.log('[Resume Analyzer] Saving analysis to Firestore...');
          
          // Use Promise.race to prevent infinite hanging from Firestore offline mode
          const savePromise = resumeStorageService.saveAnalysisToFirestore(user.id, results);
          const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Firestore save timeout")), 5000));
          await Promise.race([savePromise, timeoutPromise]);
          
          console.log('[Resume Analyzer] Firestore save complete.');

          // 6. Auto-merge extracted skills into user profile
          if (results.extractedSkills?.length > 0) {
            console.log('[Resume Analyzer] Merging skills to profile...');
            await resumeStorageService.mergeSkillsToProfile(user.id, results.extractedSkills);
          }

          // 7. Sync to match_resumes for Match Engine integration
          // Match Engine now reads from Firestore.
        } catch (persistErr) {
          console.error('[Resume Analyzer] Failed to persist analysis to Firestore:', persistErr);
          // Non-fatal
        }
      }

      console.log(`[Resume Analyzer] ATS score calculated: ${results.atsScore}`);
      console.log('[Resume Analyzer] Adding notification and finalizing...');

      if (ENABLE_AI_NOTIFICATIONS) {
        addNotification({
          title: 'Resume Analysis Ready',
          message: `Your resume scored ${results.atsScore}%. Click to view details.`,
          type: 'System',
          targetUrl: '/resume-review'
        });
      }

      setIsAnalyzing(false);
      setUploadProgress(100);
      setProgressText('Complete ✓');
      console.log('[Resume Analyzer] Analysis completed');
      return results;

    } catch (err) {
      console.error('[Resume Analyzer] Error:', err);
      
      let errMsg = 'Unexpected error occurred.';
      if (err.type === 'NETWORK_ERROR') errMsg = 'Network connection issue detected.';
      else if (err.type === 'GEMINI_QUOTA_EXCEEDED') errMsg = 'AI analysis temporarily unavailable due to quota/rate limits.';
      else if (err.type === 'GEMINI_SERVER_ERROR') errMsg = 'AI analysis temporarily unavailable.';
      else errMsg = 'Unexpected error occurred.';
      
      setError(errMsg);
      
      const fallbackResults = {
        _error: true,
        message: errMsg
      };

      setAnalysisResults(fallbackResults);
      setIsAnalyzing(false);
      setUploadProgress(100);
      setProgressText('');
      return fallbackResults;
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
    setProgressText('');
  }, []);

  return {
    analyzeResume,
    resetAnalysis,
    deleteStoredResume,
    loadSavedAnalysis,
    isAnalyzing,
    uploadProgress,
    progressText,
    analysisResults,
    storedResumeUrl,
    storedResumeName,
    error
  };
}
