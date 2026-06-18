/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useActivity } from './ActivityContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const ResumeContext = createContext(null);

export const DEFAULT_RESUME_STATE = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
    photo: ''
  },
  education: [],
  skills: [],
  projects: [],
  experience: [],
  certifications: []
};

export const ResumeProvider = ({ children }) => {
  const { user, session } = useAuth();
  const { addActivity } = useActivity();
  
  const [resumes, setResumes] = useState([]);
  const [activeResumeId, setActiveResumeId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // This state holds the currently active resume in a mutable form for the UI
  const [resumeData, setResumeData] = useState(() => {
    // Try to load a fallback local resume if not logged in or during initial load
    const saved = localStorage.getItem('resumeData');
    if (saved) return JSON.parse(saved);
    return { ...DEFAULT_RESUME_STATE };
  });

  const [activeTemplate, setActiveTemplate] = useState('Modern');
  const [saveState, setSaveState] = useState(''); // 'Saving...', 'Saved', ''
  const [lastUpdated, setLastUpdated] = useState(() => Date.now());
  const [hasLocalMigration, setHasLocalMigration] = useState(false);

  // Fetch resumes from Supabase
  const fetchResumes = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setResumes(data);
        // Automatically select the most recently updated resume if none selected
        if (!activeResumeId || !data.find(r => r.id === activeResumeId)) {
          setActiveResumeId(data[0].id);
          setActiveTemplate(data[0].template || 'Modern');
          
          setResumeData({
            personalInfo: data[0].personal_info || DEFAULT_RESUME_STATE.personalInfo,
            education: data[0].education || [],
            skills: data[0].skills || [],
            projects: data[0].projects || [],
            experience: data[0].experience || [],
            certifications: data[0].certifications || [],
            languages: data[0].languages || [],
            achievements: data[0].achievements || []
          });
        }
      } else {
        setResumes([]);
        // Check if there is local data to migrate
        const saved = localStorage.getItem('resumeData');
        if (saved) {
          setHasLocalMigration(true);
          setResumeData(JSON.parse(saved));
        } else {
          // Initialize empty state with user info
          setResumeData({
            ...DEFAULT_RESUME_STATE,
            personalInfo: {
              ...DEFAULT_RESUME_STATE.personalInfo,
              fullName: user.user_metadata?.name || '',
              email: user.email || ''
            }
          });
        }
      }
    } catch (err) {
      console.error('Error fetching resumes:', err);
    } finally {
      setLoading(false);
    }
  }, [user, activeResumeId]);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes, session]);

  // Handle switching active resume
  const switchResume = (id) => {
    const resume = resumes.find(r => r.id === id);
    if (resume) {
      setActiveResumeId(id);
      setActiveTemplate(resume.template || 'Modern');
      setResumeData({
        personalInfo: resume.personal_info || DEFAULT_RESUME_STATE.personalInfo,
        education: resume.education || [],
        skills: resume.skills || [],
        projects: resume.projects || [],
        experience: resume.experience || [],
        certifications: resume.certifications || [],
        languages: resume.languages || [],
        achievements: resume.achievements || []
      });
    }
  };

  // Migrate local resume
  const migrateLocalResume = async () => {
    if (!user) return;
    
    setSaveState('Saving...');
    try {
      const localData = JSON.parse(localStorage.getItem('resumeData'));
      
      const { data, error } = await supabase
        .from('resumes')
        .insert([{
          user_id: user.id,
          title: 'Migrated Resume',
          template: activeTemplate,
          personal_info: localData.personalInfo || {},
          education: localData.education || [],
          experience: localData.experience || [],
          projects: localData.projects || [],
          skills: localData.skills || [],
          certifications: localData.certifications || []
        }])
        .select()
        .single();

      if (error) throw error;
      
      // Clean up local storage
      localStorage.removeItem('resumeData');
      setHasLocalMigration(false);
      
      // Update state
      setResumes([data, ...resumes]);
      setActiveResumeId(data.id);
      setSaveState('Saved');
      toast.success('Resume successfully migrated to cloud!');
    } catch (err) {
      console.error('Error migrating resume:', err);
      toast.error('Failed to migrate resume');
      setSaveState('');
    }
  };

  // Create new resume
  const createResume = async (title = 'New Resume') => {
    if (!user) return;
    setSaveState('Saving...');
    try {
      const { data, error } = await supabase
        .from('resumes')
        .insert([{
          user_id: user.id,
          title,
          template: 'Modern',
          personal_info: { fullName: user.user_metadata?.name || '', email: user.email || '' }
        }])
        .select()
        .single();

      if (error) throw error;
      setResumes([data, ...resumes]);
      switchResume(data.id);
      setSaveState('Saved');
      toast.success('Created new resume');
    } catch (err) {
      console.error('Error creating resume:', err);
      toast.error('Failed to create resume');
      setSaveState('');
    }
  };

  // Delete resume
  const deleteResume = async (id) => {
    if (!user) return;
    try {
      const { error } = await supabase.from('resumes').delete().eq('id', id);
      if (error) throw error;
      
      const remaining = resumes.filter(r => r.id !== id);
      setResumes(remaining);
      
      if (activeResumeId === id) {
        if (remaining.length > 0) {
          switchResume(remaining[0].id);
        } else {
          setActiveResumeId(null);
          setResumeData({ ...DEFAULT_RESUME_STATE });
        }
      }
      toast.success('Resume deleted');
    } catch (err) {
      console.error('Error deleting resume:', err);
      toast.error('Failed to delete resume');
    }
  };

  // Duplicate resume
  const duplicateResume = async (id) => {
    if (!user) return;
    try {
      const source = resumes.find(r => r.id === id);
      if (!source) return;

      const { data, error } = await supabase
        .from('resumes')
        .insert([{
          user_id: user.id,
          title: `${source.title} (Copy)`,
          template: source.template,
          personal_info: source.personal_info,
          education: source.education,
          experience: source.experience,
          projects: source.projects,
          skills: source.skills,
          certifications: source.certifications,
          languages: source.languages,
          achievements: source.achievements
        }])
        .select()
        .single();

      if (error) throw error;
      setResumes([data, ...resumes]);
      switchResume(data.id);
      toast.success('Resume duplicated');
    } catch (err) {
      console.error('Error duplicating resume:', err);
      toast.error('Failed to duplicate resume');
    }
  };

  // Save changes automatically via explicit debounced call inside components or manual save
  const saveResume = async () => {
    if (!user) {
      // Fallback local persistence if not logged in
      localStorage.setItem('resumeData', JSON.stringify(resumeData));
      setLastUpdated(Date.now());
      return;
    }

    if (!activeResumeId) {
      // First time save generates a new resume
      await migrateLocalResume();
      return;
    }

    setSaveState('Saving...');
    try {
      const { data, error } = await supabase
        .from('resumes')
        .update({
          template: activeTemplate,
          personal_info: resumeData.personalInfo,
          education: resumeData.education,
          experience: resumeData.experience,
          projects: resumeData.projects,
          skills: resumeData.skills,
          certifications: resumeData.certifications,
          updated_at: new Date().toISOString()
        })
        .eq('id', activeResumeId)
        .select()
        .single();

      if (error) throw error;
      
      // Auto-sync with Match Engine (Persistent Resume Storage)
      try {
        let text = `Name: ${resumeData.personalInfo?.fullName || ''}\n`;
        text += `Email: ${resumeData.personalInfo?.email || ''}\n\n`;

        if (resumeData.education?.length) {
          text += `Education:\n`;
          resumeData.education.forEach(e => {
            text += `- ${e.degree} at ${e.school} (${e.startDate} - ${e.endDate})\n`;
          });
          text += `\n`;
        }

        if (resumeData.experience?.length) {
          text += `Experience:\n`;
          resumeData.experience.forEach(e => {
            text += `- ${e.title} at ${e.company} (${e.startDate} - ${e.endDate})\n  ${e.description}\n`;
          });
          text += `\n`;
        }

        if (resumeData.projects?.length) {
          text += `Projects:\n`;
          resumeData.projects.forEach(p => {
            text += `- ${p.title}\n  ${p.description}\n`;
          });
          text += `\n`;
        }

        if (resumeData.skills?.length) {
          text += `Skills:\n${resumeData.skills.join(', ')}\n`;
        }

        const payload = {
          user_id: user.id,
          resume_file_name: 'Resume Builder Profile',
          resume_text: text,
          extracted_skills: resumeData.skills || [],
          upload_date: new Date().toISOString(),
          last_updated: new Date().toISOString()
        };

        await supabase
          .from('match_resumes')
          .upsert(payload, { onConflict: 'user_id' });
          
      } catch (syncErr) {
        console.error('Error syncing resume builder with match engine:', syncErr);
      }

      setLastUpdated(Date.now());
      setSaveState('Saved');
      setResumes(resumes.map(r => r.id === data.id ? data : r));

      // Clear 'Saved' indicator after 2s
      setTimeout(() => {
        setSaveState('');
      }, 2000);

      addActivity({
        category: 'Resume',
        type: 'updated_resume',
        title: `Updated Resume`,
        description: `Resume Score: ${getResumeStrength()}%`,
        iconType: 'FileText',
        color: 'bg-emerald-50 text-emerald-500'
      });
    } catch (err) {
      console.error('Error saving resume:', err);
      setSaveState('');
      toast.error('Failed to save resume automatically');
    }
  };

  // Debounced auto-save hook utility (can be utilized by consuming components)
  // We'll call saveResume directly when needed.

  const getResumeStrength = () => {
    let score = 0;
    const pi = resumeData.personalInfo;
    if (pi.fullName) score += 5;
    if (pi.email) score += 5;
    if (pi.phone) score += 5;
    if (pi.location) score += 5;
    if (pi.linkedin) score += 5;
    if (pi.github || pi.portfolio) score += 5;
    if (resumeData.education?.length > 0) score += 20;
    if (resumeData.skills?.length > 3) score += 15;
    else if (resumeData.skills?.length > 0) score += 5;
    if (resumeData.projects?.length > 1) score += 15;
    else if (resumeData.projects?.length > 0) score += 10;
    if (resumeData.experience?.length > 0) score += 15;
    if (resumeData.certifications?.length > 0) score += 5;
    return Math.min(score, 100);
  };

  const getSectionsCompleted = () => {
    let completed = 0;
    const pi = resumeData.personalInfo;
    if (pi.fullName && pi.email) completed++;
    if (resumeData.education?.length > 0) completed++;
    if (resumeData.skills?.length > 0) completed++;
    if (resumeData.projects?.length > 0) completed++;
    if (resumeData.experience?.length > 0) completed++;
    if (resumeData.certifications?.length > 0) completed++;
    return completed;
  };

  const isSectionComplete = (section) => {
    if (section === 'Personal Info') {
      const pi = resumeData.personalInfo;
      return !!(pi.fullName && pi.email && pi.phone);
    }
    const key = section.toLowerCase();
    return resumeData[key] && resumeData[key].length > 0;
  };

  // Mutable functions trigger state update + auto-save
  useEffect(() => {
    // Implement an auto-save effect that triggers whenever resumeData changes, debounced
    const timeout = setTimeout(() => {
      // Only auto-save if we have an active cloud resume
      if (activeResumeId) {
        saveResume();
      }
    }, 2000);
    return () => clearTimeout(timeout);
  }, [resumeData, activeTemplate]);

  const updatePersonalInfo = (updates) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...updates }
    }));
  };

  const addArrayItem = (section, item) => {
    setResumeData(prev => ({
      ...prev,
      [section]: [...(prev[section] || []), { ...item, id: Date.now().toString() }]
    }));
  };

  const updateArrayItem = (section, id, updates) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].map(item => item.id === id ? { ...item, ...updates } : item)
    }));
  };

  const removeArrayItem = (section, id) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].filter(item => item.id !== id)
    }));
  };

  const updateSkills = (skillsArray) => {
    setResumeData(prev => ({
      ...prev,
      skills: skillsArray
    }));
  };

  return (
    <ResumeContext.Provider value={{
      resumes,
      activeResumeId,
      loading,
      saveState,
      hasLocalMigration,
      resumeData,
      activeTemplate,
      setActiveTemplate,
      lastUpdated,
      saveResume,
      createResume,
      deleteResume,
      duplicateResume,
      switchResume,
      migrateLocalResume,
      getResumeStrength,
      getSectionsCompleted,
      isSectionComplete,
      updatePersonalInfo,
      addArrayItem,
      updateArrayItem,
      removeArrayItem,
      updateSkills
    }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};
