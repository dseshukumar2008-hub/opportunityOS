/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useActivity } from './ActivityContext';
import { auth, db } from '../config/firebase';
import { collection, doc, setDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
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
    portfolio: ''
  },
  education: [],
  skills: [],
  projects: [],
  experience: [],
  certifications: [],
  workshops: []
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
  const [saveState, setSaveState] = useState(''); // 'Saving...', 'Saved ✓', 'Save failed', 'Last saved just now', ''
  const [lastUpdated, setLastUpdated] = useState(() => Date.now());
  const [hasLocalMigration, setHasLocalMigration] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const isSavingRef = useRef(false);
  const saveQueueRef = useRef(false);

  // Fetch resumes from Firestore
  const fetchResumes = useCallback(async () => {
    if (!user || !user.uid) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const q = query(
        collection(db, 'resumes'),
        where('userId', '==', user.uid)
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => {
        const docData = doc.data();
        return { 
          ...docData,
          id: doc.id, 
          title: docData.resumeName || docData.title || 'Untitled Resume'
        };
      });
      
      // Sort by updatedAt descending
      data.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));

      if (data && data.length > 0) {
        setResumes(data);
        // Automatically select the most recently updated resume if none selected
        if (!activeResumeId || !data.find(r => r.id === activeResumeId)) {
          setActiveResumeId(data[0].id);
          setActiveTemplate(data[0].template || 'Modern');
          
          setResumeData({
            personalInfo: data[0].personalInfo || DEFAULT_RESUME_STATE.personalInfo,
            education: data[0].education || [],
            skills: data[0].skills || [],
            projects: data[0].projects || [],
            experience: data[0].experience || [],
            certifications: data[0].certifications || [],
            workshops: data[0].workshops || [],
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
              fullName: '',
              email: ''
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
        personalInfo: resume.personalInfo || DEFAULT_RESUME_STATE.personalInfo,
        education: resume.education || [],
        skills: resume.skills || [],
        projects: resume.projects || [],
        experience: resume.experience || [],
        certifications: resume.certifications || [],
        workshops: resume.workshops || [],
        languages: resume.languages || [],
        achievements: resume.achievements || []
      });
    }
  };

  // Migrate local resume
  const migrateLocalResume = async () => {
    if (!user || !user.uid) return;
    
    setSaveState('Saving...');
    try {
      const localData = JSON.parse(localStorage.getItem('resumeData'));
      const resumeId = crypto.randomUUID();
      const newResume = {
        resumeId,
        userId: user.uid,
        resumeName: 'Migrated Resume',
        template: activeTemplate,
        personalInfo: localData.personalInfo || {},
        education: localData.education || [],
        experience: localData.experience || [],
        projects: localData.projects || [],
        skills: localData.skills || [],
        certifications: localData.certifications || [],
        workshops: localData.workshops || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'resumes', resumeId), newResume);
      
      // Clean up local storage
      localStorage.removeItem('resumeData');
      setHasLocalMigration(false);
      
      // Update state
      setResumes([newResume, ...resumes]);
      setActiveResumeId(resumeId);
      setSaveState('Saved');
      toast.success('Resume successfully migrated to cloud!');
    } catch (err) {
      console.error('Error migrating resume:', err);
      toast.error(`Failed to migrate resume: ${err.message}`);
      setSaveState('');
    }
  };

  // Create new resume
  const createResume = async (resumeName = 'Untitled Resume') => {
    if (!user || !user.uid) {
      console.error('No authenticated user found for creating resume');
      toast.error('You must be logged in to create a resume.');
      return null;
    }
    
    console.log('[ResumeContext] Creating resume for user:', user.uid);
    setSaveState('Saving...');
    
    try {
      const resumeId = crypto.randomUUID();
      const newResume = {
        id: resumeId,
        resumeId,
        title: resumeName,
        resumeName,
        userId: user.uid,
        template: 'Modern',
        personalInfo: { fullName: '', email: '', phone: '', location: '', website: '', summary: '' },
        education: [],
        skills: [],
        projects: [],
        experience: [],
        certifications: [],
        workshops: [],
        languages: [],
        achievements: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      console.log("User:", auth.currentUser);
      console.log("Resume Payload:", newResume);
      
      await setDoc(doc(db, 'resumes', resumeId), newResume);
      console.log('[ResumeContext] Firestore Response: Success');

      setResumes(prev => [newResume, ...prev]);
      
      // Directly update the active resume state because setResumes is async
      setActiveResumeId(resumeId);
      setActiveTemplate('Modern');
      localStorage.removeItem('resumeData');
      setResumeData({
        personalInfo: newResume.personalInfo || DEFAULT_RESUME_STATE.personalInfo,
        education: newResume.education || [],
        skills: newResume.skills || [],
        projects: newResume.projects || [],
        experience: newResume.experience || [],
        certifications: newResume.certifications || [],
        workshops: newResume.workshops || [],
        languages: newResume.languages || [],
        achievements: newResume.achievements || []
      });

      setSaveState('Saved');
      toast.success('Created new resume');
      return resumeId;
    } catch (err) {
      console.error('[ResumeContext] Error creating resume in Firestore:', err);
      toast.error(`Failed to create resume: ${err.message}`);
      setSaveState('');
      return null;
    }
  };

  // Delete resume
  const deleteResume = async (id) => {
    if (!user || !user.uid) return;
    try {
      const targetResume = resumes.find(r => r.id === id || r.resumeId === id);

      // Primary delete operation
      await deleteDoc(doc(db, 'resumes', id));
      
      // Secondary cleanups - wrap in try/catch to prevent partial failures from blocking UI
      try {
        const historyQ = query(
          collection(db, 'resume_history'), 
          where('resumeId', '==', id),
          where('uid', '==', user.uid)
        );
        const historySnapshot = await getDocs(historyQ);
        const deletePromises = historySnapshot.docs.map(docSnap => deleteDoc(doc(db, 'resume_history', docSnap.id)));
        await Promise.all(deletePromises);

        if (targetResume?.storagePath) {
          import('../services/resumeStorageService').then(mod => {
            mod.resumeStorageService.deleteResume(targetResume.storagePath);
          }).catch(err => console.warn('Storage cleanup failed', err));
        }

        try {
          await deleteDoc(doc(db, 'users', user.uid, 'match_resume', 'current'));
        } catch (e) {
          console.log('No current match to delete');
        }
      } catch (cleanupErr) {
        console.warn('Resume secondary cleanup failed', cleanupErr);
      }

      // UI state updates must happen unconditionally if the primary delete succeeded
      setResumes(prev => prev.filter(r => r.id !== id && r.resumeId !== id));
      
      if (activeResumeId === id) {
        setActiveResumeId(null);
        localStorage.removeItem('resumeData');
        setResumeData({ ...DEFAULT_RESUME_STATE });
      }
      toast.success('Resume deleted successfully');
    } catch (err) {
      console.error('Error deleting resume:', err);
      toast.error(`Failed to delete resume: ${err.message}`);
      throw err;
    }
  };

  // Rename resume
  const renameResume = async (id, newTitle) => {
    if (!user || !user.uid) return;
    try {
      await updateDoc(doc(db, 'resumes', id), {
        resumeName: newTitle,
        title: newTitle,
        updatedAt: new Date().toISOString()
      });

      setResumes(prev => prev.map(r => (r.id === id || r.resumeId === id) ? { ...r, resumeName: newTitle, title: newTitle } : r));
      toast.success('Resume renamed');
    } catch (err) {
      console.error('Error renaming resume:', err);
      toast.error(`Failed to rename resume: ${err.message}`);
    }
  };

  // Save changes automatically via explicit debounced call inside components or manual save
  const saveResume = async () => {
    if (!user) {
      // Fallback local persistence if not logged in
      localStorage.setItem('resumeData', JSON.stringify(resumeData));
      setLastUpdated(Date.now());
      setIsDirty(false);
      return;
    }

    if (!activeResumeId) {
      // First time save generates a new resume
      await migrateLocalResume();
      return;
    }

    if (isSavingRef.current) {
      saveQueueRef.current = true;
      return;
    }

    isSavingRef.current = true;
    setSaveState('Saving...');

    const updatedData = {
      template: activeTemplate,
      personalInfo: resumeData.personalInfo || {},
      education: resumeData.education || [],
      experience: resumeData.experience || [],
      projects: resumeData.projects || [],
      skills: resumeData.skills || [],
      certifications: resumeData.certifications || [],
      workshops: resumeData.workshops || [],
      updatedAt: new Date().toISOString()
    };

    const attemptSave = async () => {
      await updateDoc(doc(db, 'resumes', activeResumeId), updatedData);
      
      const dataForState = { ...resumes.find(r => r.id === activeResumeId || r.resumeId === activeResumeId), ...updatedData };

      try {
        const key = `resume_snapshots_${activeResumeId}`;
        const snapshots = JSON.parse(localStorage.getItem(key) || '[]');
        snapshots.push({ timestamp: Date.now(), data: resumeData });
        if (snapshots.length > 10) snapshots.shift(); // Keep last 10 versions
        localStorage.setItem(key, JSON.stringify(snapshots));
      } catch (e) {
        console.error('Failed to save snapshot', e);
      }

      setLastUpdated(Date.now());
      setIsDirty(false);
      setSaveState('Saved ✓');
      setResumes(resumes.map(r => (r.id === activeResumeId || r.resumeId === activeResumeId) ? dataForState : r));

      // Clear 'Saved' indicator after 2s
      setTimeout(() => {
        setSaveState(prev => prev === 'Saved ✓' ? 'Last saved just now' : prev);
      }, 2000);

      addActivity({
        category: 'Resume',
        type: 'updated_resume',
        title: `Updated Resume`,
        description: `Resume Score: ${getResumeStrength()}%`,
        iconType: 'FileText',
        color: 'bg-emerald-50 text-emerald-500'
      });
    };

    try {
      await attemptSave();
    } catch (err) {
      console.error('Error saving resume:', err);
      // Auto retry once after 1 second
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await attemptSave();
      } catch (retryErr) {
        console.error('Retry failed:', retryErr);
        setSaveState('Save failed');
        setIsDirty(true);
      }
    } finally {
      isSavingRef.current = false;
      if (saveQueueRef.current) {
        saveQueueRef.current = false;
        saveResume();
      }
    }
  };

  // Debounced auto-save hook utility (can be utilized by consuming components)
  // We'll call saveResume directly when needed.

  const getResumeStrength = () => {
    let score = 0;
    const isValidString = (val) => typeof val === 'string' && val.trim().length > 0;
    const pi = resumeData.personalInfo || {};
    
    if (isValidString(pi.fullName)) score += 5;
    if (isValidString(pi.email)) score += 5;
    if (isValidString(pi.phone)) score += 5;
    if (isValidString(pi.location)) score += 5;
    if (isValidString(pi.linkedin)) score += 5;
    if (isValidString(pi.github) || isValidString(pi.portfolio)) score += 5;
    
    const validEdu = (resumeData.education || []).filter(item => isValidString(item.degree) && isValidString(item.school));
    if (validEdu.length > 0) score += 20;

    const validSkills = (resumeData.skills || []).filter(isValidString);
    if (validSkills.length > 3) score += 15;
    else if (validSkills.length > 0) score += 5;

    const validProjects = (resumeData.projects || []).filter(item => isValidString(item.title) && isValidString(item.description) && isValidString(item.techStack));
    if (validProjects.length > 1) score += 15;
    else if (validProjects.length > 0) score += 10;

    const validExp = (resumeData.experience || []).filter(item => isValidString(item.company) && isValidString(item.role) && isValidString(item.responsibilities));
    if (validExp.length > 0) score += 15;

    const validCerts = (resumeData.certifications || []).filter(item => isValidString(item.title) && isValidString(item.issuer));
    if (validCerts.length > 0) score += 5;

    return Math.min(score, 100);
  };

  const validateSection = (section) => {
    let required = [];
    let filled = [];
    let isComplete = false;

    const isValidString = (val) => typeof val === 'string' && val.trim().length > 0;

    if (section === 'Personal Info') {
      const pi = resumeData.personalInfo || {};
      required = ['fullName', 'email', 'phone', 'location'];
      filled = required.filter(field => isValidString(pi[field]));
      isComplete = filled.length === required.length;
    }
    else if (section === 'Summary') {
      const pi = resumeData.personalInfo || {};
      required = ['summary'];
      filled = required.filter(field => isValidString(pi[field]));
      isComplete = filled.length === required.length;
    }
    else if (section === 'Education') {
      const items = resumeData.education || [];
      required = ['degree', 'school'];
      if (items.length === 0) {
        isComplete = false;
      } else {
        // All items must have required fields
        isComplete = items.every(item => isValidString(item.degree) && isValidString(item.school));
        if (items.length > 0) {
          // Just for logging, we count the first item's fields
          filled = required.filter(field => isValidString(items[0][field]));
        }
      }
    }
    else if (section === 'Skills') {
      const items = resumeData.skills || [];
      required = ['skills'];
      if (items.length > 0 && items.some(isValidString)) {
        filled = ['skills'];
        isComplete = true;
      }
    }
    else if (section === 'Projects') {
      const items = resumeData.projects || [];
      required = ['title', 'description', 'techStack'];
      if (items.length === 0) {
        isComplete = false;
      } else {
        isComplete = items.every(item => isValidString(item.title) && isValidString(item.description) && isValidString(item.techStack));
        if (items.length > 0) {
          filled = required.filter(field => isValidString(items[0][field]));
        }
      }
    }
    else if (section === 'Experience') {
      const items = resumeData.experience || [];
      required = ['company', 'role', 'responsibilities'];
      if (items.length === 0) {
        isComplete = false;
      } else {
        isComplete = items.every(item => isValidString(item.company) && isValidString(item.role) && isValidString(item.responsibilities));
        if (items.length > 0) {
          filled = required.filter(field => isValidString(items[0][field]));
        }
      }
    }
    else if (section === 'Certifications') {
      const items = resumeData.certifications || [];
      required = ['title', 'issuer'];
      if (items.length === 0) {
        isComplete = false;
      } else {
        isComplete = items.every(item => isValidString(item.title) && isValidString(item.issuer));
        if (items.length > 0) {
          filled = required.filter(field => isValidString(items[0][field]));
        }
      }
    }
    else if (section === 'Workshops') {
      const items = resumeData.workshops || [];
      required = ['title', 'issuer'];
      if (items.length === 0) {
        isComplete = false;
      } else {
        isComplete = items.every(item => isValidString(item.title) && isValidString(item.issuer));
        if (items.length > 0) {
          filled = required.filter(field => isValidString(items[0][field]));
        }
      }
    }

    const percentage = required.length > 0 ? Math.round((filled.length / required.length) * 100) : 0;
    
    // Log output as requested
    console.log(`[Resume Builder] Section: ${section} | Required: ${required.join(', ')} | Filled: ${filled.join(', ')} | Completion: ${percentage}%`);

    return isComplete;
  };

  const getSectionsCompleted = () => {
    let completed = 0;
    if (validateSection('Personal Info')) completed++;
    if (validateSection('Summary')) completed++;
    if (validateSection('Education')) completed++;
    if (validateSection('Skills')) completed++;
    if (validateSection('Projects')) completed++;
    if (validateSection('Experience')) completed++;
    if (validateSection('Certifications')) completed++;
    if (validateSection('Workshops')) completed++;
    return completed;
  };

  const isSectionComplete = (section) => {
    return validateSection(section);
  };

  // Mutable functions trigger state update + auto-save
  useEffect(() => {
    // Implement an auto-save effect that triggers whenever resumeData changes, debounced
    if (!isDirty) return;

    const timeout = setTimeout(() => {
      // Only auto-save if we have an active cloud resume
      if (activeResumeId) {
        saveResume();
      }
    }, 1500);
    return () => clearTimeout(timeout);
  }, [resumeData, activeTemplate, isDirty, activeResumeId]);

  const handleSetActiveTemplate = (tmpl) => {
    setIsDirty(true);
    setActiveTemplate(tmpl);
  };

  const updatePersonalInfo = (updates) => {
    setIsDirty(true);
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...updates }
    }));
  };

  const restoreSnapshot = (snapshotData) => {
    setIsDirty(true);
    setResumeData(snapshotData);
  };

  const addArrayItem = (section, item) => {
    setIsDirty(true);
    setResumeData(prev => ({
      ...prev,
      [section]: [...(prev[section] || []), { ...item, id: Date.now().toString() }]
    }));
  };

  const updateArrayItem = (section, id, updates) => {
    setIsDirty(true);
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].map(item => item.id === id ? { ...item, ...updates } : item)
    }));
  };

  const removeArrayItem = (section, id) => {
    setIsDirty(true);
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].filter(item => item.id !== id)
    }));
  };

  const updateSkills = (skillsArray) => {
    setIsDirty(true);
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
      setActiveTemplate: handleSetActiveTemplate,
      lastUpdated,
      isDirty,
      setIsDirty,
      saveResume,
      createResume,
      deleteResume,
      renameResume,
      switchResume,
      migrateLocalResume,
      getResumeStrength,
      getSectionsCompleted,
      isSectionComplete,
      updatePersonalInfo,
      addArrayItem,
      updateArrayItem,
      removeArrayItem,
      updateSkills,
      restoreSnapshot,
      setResumeData
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
