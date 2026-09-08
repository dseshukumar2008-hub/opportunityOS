import { useState, useCallback} from 'react';
import { geminiService } from '../services/geminiService';
import { resumeStorageService } from '../services/resumeStorageService';
import { useAuth } from '../contexts/AuthContext';
import { useActivity } from '../contexts/ActivityContext';
import { validateResumeFile } from '../utils/fileUtils';
import { getErrorMessage } from '../utils/errorUtils';

import { useRef, useEffect } from 'react';

export function useResumeAnalysis() {
  const { user } = useAuth();
  const { addActivity } = useActivity();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [storedResumeUrl, setStoredResumeUrl] = useState(null);
  const [storedResumeName, setStoredResumeName] = useState(null);
  const [storedResumePath, setStoredResumePath] = useState(null);
  const [error, setError] = useState(null);
  const [analysisStatus, setAnalysisStatus] = useState('idle');
  const isAnalyzingRef = useRef(false);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

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
      isAnalyzingRef.current = false;
    }
  }, [user]);

  // Note: We intentionally do NOT call loadSavedAnalysis() automatically on mount anymore.
  // The user should start with a fresh upload state.
  // Historical analyses remain in the History tab.

  const analyzeResume = useCallback(async (dataOrFile) => {
    if (isAnalyzingRef.current) {
      return { _error: true, message: 'Analysis already in progress.' };
    }
    isAnalyzingRef.current = true;
    
    setIsAnalyzing(true);
    setAnalysisStatus('uploading');
    setError(null);
    setUploadProgress(0);
    setProgressText('Uploading...');

    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      let payloadForGemini = dataOrFile;
      let extractedText = '';

      if (dataOrFile instanceof File) {
        const { isValid, error: validationError } = validateResumeFile(dataOrFile);
        if (!isValid) {
          throw new Error(validationError);
        }
        
        setProgressText('Extracting Resume...');
        
        // Extract text locally first
        try {
          const { extractTextFromFile, optimizeLargeResumeText } = await import('../utils/fileUtils');
          extractedText = await extractTextFromFile(dataOrFile);
          
          if (!extractedText || extractedText.trim().length === 0) {
            throw new Error('Resume text could not be extracted.');
          }
          if (extractedText.length < 100) {
            throw new Error(`Extracted text is too short (${extractedText.length} chars). Please upload a valid resume with selectable text.`);
          }
          
          // Smart Text Truncation
          extractedText = optimizeLargeResumeText(extractedText, 25000);
        } catch (extractionError) {
          console.error('[Resume Analyzer] Local extraction failed:', extractionError);
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
          payloadForGemini = extractedText;
        } else {
          setProgressText('Preparing AI Analysis...');
          const { fileToBase64 } = await import('../utils/fileUtils');
          payloadForGemini = await fileToBase64(dataOrFile);
        }
      } else if (typeof dataOrFile === 'string') {
        const { optimizeLargeResumeText } = await import('../utils/fileUtils');
        extractedText = optimizeLargeResumeText(dataOrFile, 25000);
        payloadForGemini = extractedText;
      }

      setAnalysisStatus('analyzing');
      setProgressText('Analyzing Resume...');

      let results = null;
      let localMetrics = null;
      
            try {
        const { extractTextMetrics } = await import('../utils/resumeRuleEngine');
        const { calculateATSScore } = await import('../utils/atsScoringEngine');
        
        localMetrics = extractTextMetrics(extractedText);
        
        // Calculate ATS Score Locally
        const scoring = calculateATSScore(localMetrics);
        localMetrics.atsScore = scoring.totalScore;
        localMetrics.scoreBreakdown = scoring.breakdown;
        localMetrics.explanation = scoring.explanation;
        localMetrics.rating = scoring.rating;
        
      } catch (err) {
        console.error('Phase 1 Local Analysis failed:', err);
        throw new Error('Resume parsing failed.', { cause: err });
      }

            try {
        let aiInsights = await geminiService.analyzeResume(payloadForGemini, extractedText, localMetrics.profileType, signal);

        // Basic structural validation - if it's not even an object, fail entirely
        if (!aiInsights || typeof aiInsights !== 'object') {
          console.error('[Resume Analyzer Error] Expected an object from AI, got:', typeof aiInsights);
          throw new Error('The AI service returned incomplete or malformed data. Please try analyzing the resume again.', { cause: 'Invalid AI response' });
        }

        aiInsights = {
          suggestedRole: '',
          summary: 'Analysis completed successfully.',
          qualityRating: 'Fair',
          ...aiInsights,
          strengths: Array.isArray(aiInsights?.strengths) ? aiInsights.strengths : [],
          areasForGrowth: Array.isArray(aiInsights?.areasForGrowth) ? aiInsights.areasForGrowth : [],
          actionPlan: {
            immediateFixes: Array.isArray(aiInsights?.actionPlan?.immediateFixes) ? aiInsights.actionPlan.immediateFixes : [],
            skillsToLearn: Array.isArray(aiInsights?.actionPlan?.skillsToLearn) ? aiInsights.actionPlan.skillsToLearn : [],
            projectsToBuild: Array.isArray(aiInsights?.actionPlan?.projectsToBuild) ? aiInsights.actionPlan.projectsToBuild : [],
            certificationsToPursue: Array.isArray(aiInsights?.actionPlan?.certificationsToPursue) ? aiInsights.actionPlan.certificationsToPursue : [],
          }
        };

        // ── Fallback Strengths ───────────────────────────────────────────
        // When the AI returns an empty strengths array, derive meaningful
        // strengths from localMetrics so the report is never silently blank.
        if (aiInsights.strengths.length === 0) {
          const derivedStrengths = [];
          if (localMetrics.extractedSkills?.length > 0) {
            derivedStrengths.push(`Detected ${localMetrics.extractedSkills.length} technical skill${localMetrics.extractedSkills.length > 1 ? 's' : ''}: ${localMetrics.extractedSkills.slice(0, 5).join(', ')}${localMetrics.extractedSkills.length > 5 ? '…' : ''}`);
          }
          if (localMetrics.hasExperience) {
            derivedStrengths.push('Work experience section is present, which is a strong positive signal for ATS systems.');
          }
          if (localMetrics.projectsCount > 0) {
            derivedStrengths.push('Projects section detected — demonstrating hands-on application of skills.');
          }
          if (localMetrics.educationCount > 0) {
            derivedStrengths.push('Education section is present and properly formatted.');
          }
          if (localMetrics.hasGitHub) {
            derivedStrengths.push('GitHub profile link included — shows active portfolio and collaboration history.');
          }
          if (localMetrics.hasEmail && localMetrics.hasPhone) {
            derivedStrengths.push('Contact information (email and phone) is complete.');
          }
          if (localMetrics.quantifiedAchievements > 0) {
            derivedStrengths.push('Resume contains quantified achievements (numbers, percentages, or dollar amounts).');
          }
          if (localMetrics.hasSummary) {
            derivedStrengths.push('Professional summary or objective section is present.');
          }
          if (derivedStrengths.length > 0) {
            aiInsights.strengths = derivedStrengths;
          }
        }

        // ── Fallback Areas for Growth ────────────────────────────────────
        // When the AI returns an empty areasForGrowth array but the ATS
        // breakdown or localMetrics identify genuine issues, derive them
        // so the report is internally consistent.
        if (aiInsights.areasForGrowth.length === 0) {
          const derivedGrowth = [];
          if (localMetrics.missingKeywords?.length > 0) {
            derivedGrowth.push(`Missing important industry keywords: ${localMetrics.missingKeywords.slice(0, 5).join(', ')}. Adding these can significantly improve ATS match rate.`);
          }
          if (localMetrics.quantifiedAchievements === 0) {
            derivedGrowth.push('No quantified achievements detected. Adding metrics (e.g., "Improved load time by 40%") significantly strengthens impact.');
          }
          if (!localMetrics.hasGitHub && !localMetrics.hasPortfolio) {
            derivedGrowth.push('No GitHub or portfolio link found. Including a link to your work increases recruiter confidence.');
          }
          if (!localMetrics.hasSummary) {
            derivedGrowth.push('No professional summary or objective section detected. Adding one helps ATS and recruiters understand your goals quickly.');
          }
          if (localMetrics.extractedSkills?.length < 5) {
            derivedGrowth.push('Fewer than 5 recognized technical skills were detected. Expanding your skills section with specific technologies and tools will improve your score.');
          }
          // Add items from ATS loss explanations
          if (localMetrics.explanation) {
            localMetrics.explanation.forEach(exp => {
              if (exp.type === 'loss' && derivedGrowth.length < 6) {
                derivedGrowth.push(`${exp.label} — this caused an ATS deduction of ${exp.points} points.`);
              }
            });
          }
          if (derivedGrowth.length > 0) {
            aiInsights.areasForGrowth = derivedGrowth;
          }
        }
        
        // Generate Smart Suggestions dynamically based on the analysis
        const smartSuggestions = [];

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

                if (localMetrics.missingKeywords && localMetrics.missingKeywords.length > 0) {
          smartSuggestions.push({
            area: 'Keywords',
            priority: 'MEDIUM',
            title: 'Missing Crucial Keywords',
            description: `Your resume is missing important industry keywords. Consider adding: ${localMetrics.missingKeywords.slice(0, 5).join(', ')}.`
          });
        }

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
          recommendedSkills: aiInsights.recommendedSkills || aiInsights.actionPlan?.skillsToLearn || [],
          recommendedCertifications: aiInsights.recommendedCertifications || aiInsights.actionPlan?.certificationsToPursue || [],
          recommendedProjects: aiInsights.recommendedProjects || aiInsights.actionPlan?.projectsToBuild || []
        };
        
      } catch (geminiError) {
        console.error('[Resume Analysis Error] Phase 3 Validation Failed:', geminiError);
        throw new Error('Phase 3 Validation Failed', { cause: geminiError });
      }

      setAnalysisResults(results);

      // 3. Upload file to Firebase Storage (only for actual File uploads)
      if (user?.id && dataOrFile instanceof File) {
        try {
          setUploadProgress(1); // Signal upload starting
          
          // Add timeout to upload to prevent infinite hang
          const uploadPromise = resumeStorageService.uploadResume(
            dataOrFile,
            user.id,
            (progress) => setUploadProgress(progress)
          );
          
          let timeoutId;
          const timeoutPromise = new Promise((_, reject) => {
            timeoutId = setTimeout(() => reject(new Error("Upload timeout")), 10000);
          });
          const { downloadURL, fileName, storagePath } = await Promise.race([uploadPromise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
          

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
          
          // Use Promise.race to prevent infinite hanging from Firestore offline mode
          const savePromise = resumeStorageService.saveAnalysisToFirestore(user.id, results);
          let saveTimeoutId;
          const timeoutPromise = new Promise((_, reject) => {
            saveTimeoutId = setTimeout(() => reject(new Error("Firestore save timeout")), 5000);
          });
          await Promise.race([savePromise, timeoutPromise]).finally(() => clearTimeout(saveTimeoutId));
          

          // 6. Auto-merge extracted skills into user profile
          if (results.extractedSkills?.length > 0) {
            await resumeStorageService.mergeSkillsToProfile(user.id, results.extractedSkills);
          }

          // 8. Add to Activity Feed
          if (addActivity) {
            addActivity({
              category: 'resume',
              type: 'action',
              title: 'Resume Analyzed',
              description: `Resume analyzed with an ATS Score of ${results.atsScore}%`
            });
          }
        } catch (persistErr) {
          console.error('[Resume Analyzer] Failed to persist analysis to Firestore:', persistErr);
          // Non-fatal
        }
      }



      setIsAnalyzing(false);
      setAnalysisStatus('completed');
      setUploadProgress(100);
      setProgressText('Complete ✓');
      isAnalyzingRef.current = false;
      return results;

    } catch (err) {
      if (err.name === 'AbortError' || err.message === 'Request was cancelled') {
        setIsAnalyzing(false);
        setAnalysisStatus('idle');
        setUploadProgress(0);
        setProgressText('');
        isAnalyzingRef.current = false;
        return { _error: true, message: 'Analysis cancelled' };
      }
      
      console.error('[Resume Analyzer] Error:', err);
      
      let errMsg = getErrorMessage(err, 'Unexpected error occurred.');
      if (err.type === 'AI_SERVER_ERROR' && err.message?.includes('API_KEY is not configured')) {
        errMsg = 'Server configuration is missing.';
      } else if (err.type === 'AI_SERVER_ERROR') {
        errMsg = 'AI analysis temporarily unavailable.';
      }
      
      setError(errMsg);
      
      const fallbackResults = {
        _error: true,
        message: errMsg
      };

      setAnalysisResults(fallbackResults);
      setIsAnalyzing(false);
      setAnalysisStatus('idle');
      setUploadProgress(100);
      setProgressText('');
      isAnalyzingRef.current = false;
      return fallbackResults;
    }
// eslint-disable-next-line react-hooks/exhaustive-deps
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
    setAnalysisStatus('idle');
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
    error,
    analysisStatus
  };
}
