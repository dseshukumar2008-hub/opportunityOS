import { useState, useCallback, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { resumeStorageService } from '../services/resumeStorageService';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { fileToBase64 } from '../utils/fileUtils';

export function useResumeAnalysis() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
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
    console.log('[Resume Analysis] Upload Started');
    
    setIsAnalyzing(true);
    setError(null);
    setUploadProgress(0);

    try {
      let payloadForGemini = dataOrFile;

      if (dataOrFile instanceof File) {
        payloadForGemini = await fileToBase64(dataOrFile);
        console.log('[Resume Analysis] Base64 Generated');
      }

      let results = null;
      if (import.meta.env.VITE_GEMINI_API_KEY) {
        try {
          console.log('[Resume Analysis] Sending to Gemini');
          results = await geminiService.analyzeResume(payloadForGemini);
          console.log('[Resume Analysis] Response Received');
          
          if (typeof results?.atsScore !== 'number' || !Array.isArray(results?.strengths)) {
            throw new Error('Gemini returned invalid schema.');
          }
        } catch (geminiError) {
          console.error('[Resume Analysis Error]', geminiError);
          throw new Error('AI Analysis failed to process the resume. ' + (geminiError.message || ''));
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
          try {
            const { supabase } = await import('../lib/supabase');
            const payload = {
              user_id: user.id,
              resume_file_name: dataOrFile instanceof File ? dataOrFile.name : 'Analyzed Resume',
              resume_text: results.summary || 'Resume analyzed automatically.',
              extracted_skills: results.extractedSkills || [],
              upload_date: new Date().toISOString(),
              last_updated: new Date().toISOString()
            };
            await supabase.from('match_resumes').upsert(payload, { onConflict: 'user_id' });
          } catch (syncErr) {
            console.error('Failed to sync with match_resumes:', syncErr);
          }
        } catch (persistErr) {
          console.error('[Resume Analyzer] Failed to persist analysis to Firestore:', persistErr);
          // Non-fatal
        }
      }

      console.log('[Resume Analyzer] Adding notification and finalizing...');

      addNotification({
        title: 'Resume Analysis Ready',
        message: `Your resume scored ${results.atsScore}%. Click to view details.`,
        type: 'System',
        targetUrl: '/resume-review'
      });

      setIsAnalyzing(false);
      setUploadProgress(100);
      console.log('[Resume Analyzer] Pipeline completed successfully.');
      return results;

    } catch (err) {
      console.error('[Resume Analysis Error]', err);
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
