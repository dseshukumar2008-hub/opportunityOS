import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { geminiService } from '../services/geminiService';
import { toast } from 'react-hot-toast';

export function useMatchResume() {
  const { user, session } = useAuth();
  
  const [matchResume, setMatchResume] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const fetchMatchResume = useCallback(async () => {
    if (!user) {
      setMatchResume(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('match_resumes')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setMatchResume(data || null);
    } catch (err) {
      console.error('[Match Resume] Fetch Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMatchResume();
  }, [fetchMatchResume, session]);

  const uploadNewResume = async (file) => {
    if (!user) {
      toast.error('You must be logged in to upload a resume.');
      return null;
    }

    console.log('[Resume Pipeline] Upload started');
    setIsUploading(true);
    try {
      // Extract base64
      const fileBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
      });
      console.log('[Resume Pipeline] Text extraction completed');

      // Pass to Gemini for text & skill extraction
      console.log('[Resume Pipeline] Gemini request started');
      const analysisResult = await geminiService.analyzeResume({
        mimeType: file.type,
        base64: fileBase64
      });
      console.log('[Resume Pipeline] Gemini response received');

      const extractedSkills = analysisResult?.extractedSkills || [];
      console.log('[Resume Pipeline] Skills parsed', extractedSkills.length);
      
      const resumeText = analysisResult?.summary || "Resume parsed successfully.";

      // Upsert to match_resumes
      const payload = {
        user_id: user.id,
        resume_file_name: file.name,
        resume_text: resumeText,
        extracted_skills: extractedSkills,
        upload_date: new Date().toISOString(),
        last_updated: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('match_resumes')
        .upsert(payload, { onConflict: 'user_id' })
        .select()
        .single();

      if (error) throw error;
      
      // Attempting to replicate "Profile updated" log context
      console.log('[Resume Pipeline] Profile updated');

      setMatchResume(data);
      console.log('[Resume Pipeline] Upload completed');
      toast.success('Resume successfully processed and saved.');
      return data;
    } catch (err) {
      console.error('[Match Resume] Upload Error:', err);
      toast.error('Error: ' + (err.message || 'Failed to parse and save resume'));
      return null;
    } finally {
      console.log('[Resume Pipeline] Loading state cleared');
      setIsUploading(false);
    }
  };

  const syncBuilderResume = async (builderData) => {
    if (!user) return null;

    try {
      // Format builder data into raw text
      const generateText = (data) => {
        let text = `Name: ${data.personalInfo?.fullName || ''}\n`;
        text += `Email: ${data.personalInfo?.email || ''}\n\n`;

        if (data.education?.length) {
          text += `Education:\n`;
          data.education.forEach(e => {
            text += `- ${e.degree} at ${e.school} (${e.startDate} - ${e.endDate})\n`;
          });
          text += `\n`;
        }

        if (data.experience?.length) {
          text += `Experience:\n`;
          data.experience.forEach(e => {
            text += `- ${e.title} at ${e.company} (${e.startDate} - ${e.endDate})\n  ${e.description}\n`;
          });
          text += `\n`;
        }

        if (data.projects?.length) {
          text += `Projects:\n`;
          data.projects.forEach(p => {
            text += `- ${p.title}\n  ${p.description}\n`;
          });
          text += `\n`;
        }

        if (data.skills?.length) {
          text += `Skills:\n${data.skills.join(', ')}\n`;
        }

        return text;
      };

      const payload = {
        user_id: user.id,
        resume_file_name: 'Resume Builder Profile',
        resume_text: generateText(builderData),
        extracted_skills: builderData.skills || [],
        upload_date: matchResume?.upload_date || new Date().toISOString(),
        last_updated: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('match_resumes')
        .upsert(payload, { onConflict: 'user_id' })
        .select()
        .single();

      if (error) throw error;

      setMatchResume(data);
      return data;
    } catch (err) {
      console.error('[Match Resume] Sync Builder Error:', err);
      return null;
    }
  };

  return {
    matchResume,
    isLoading,
    isUploading,
    uploadNewResume,
    syncBuilderResume,
    fetchMatchResume
  };
}
