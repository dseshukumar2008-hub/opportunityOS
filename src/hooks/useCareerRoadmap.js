import { useReducer, useEffect, useRef, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { useNotifications } from '../contexts/NotificationContext';
import { useProfile } from '../contexts/ProfileContext';
import { analyticsService } from '../services/analyticsService';

const INITIAL = {
  status: 'idle',
  uid: null,
  roadmap: null,
  error: null,
  genError: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'NO_USER':         return { ...INITIAL, status: 'wizard' };
    case 'FETCH_START':     return { ...state,   status: 'loading',     uid: action.uid, error: null };
    case 'FETCH_OK':        return { ...state,   status: 'ready',       roadmap: action.data };
    case 'NO_ROADMAP':      return { ...state,   status: 'wizard' };
    case 'FETCH_ERROR':     return { ...state,   status: 'error',       error: action.error };
    case 'GEN_START':       return { ...state,   status: 'generating',  genError: null };
    case 'GEN_OK':          return { ...state,   status: 'ready',       roadmap: action.data, genError: null };
    case 'GEN_ERROR':       return { ...state,   status: 'wizard',      genError: action.error };
    case 'GEN_TIMEOUT':     return { ...state,   status: 'wizard',      genError: 'Generation timed out after 60 seconds. Please try again.' };
    case 'RESET':           return { ...state,   status: 'wizard',      roadmap: null, genError: null };
    case 'TASK_UPDATE':     return { ...state,   roadmap: action.roadmap };
    default:                return state;
  }
}

function buildPrompt(w) {
  return `You are the Career Intelligence Engine of OpportunityOS.
Your job is to generate a premium Career Operating System roadmap.

USER PROFILE
Course: ${w.course}
Branch: ${w.branch}
Current Year: ${w.year}
Target Career: ${w.targetCareer}
${w.missingSkills && w.missingSkills.length > 0 ? `Known Missing Skills: ${w.missingSkills.join(', ')}` : ''}

IMPORTANT
Generate roadmap CONTENT ONLY.
Return ONLY VALID JSON.
Do NOT generate markdown code fences (\`\`\`json). Just return the raw JSON object.

ROADMAP DESIGN
Always create EXACTLY 5 phases:
1. Foundation
2. Core Skills
3. Projects
4. Industry Readiness
5. Placement / Career Launch
${w.missingSkills && w.missingSkills.length > 0 ? `CRITICAL: Ensure the provided "Known Missing Skills" are heavily prioritized and explicitly included in the phases.` : ''}

INITIAL STATE
Set all progress to 0 and all tasks to uncompleted.

JSON SCHEMA REQUIREMENT:
{
  "header": {
    "careerTitle": "${w.targetCareer}",
    "estimatedDuration": "e.g. 12 Months",
    "nextMilestone": "e.g. Build first project",
    "overallRank": "Beginner"
  },
  "phases": [
    {
      "id": "phase_1",
      "title": "Foundation",
      "description": "Short description of the phase",
      "overview": "Detailed overview of what will be learned",
      "tasks": [
        { "id": "p1_t1", "title": "Specific actionable task", "completed": false, "status": "Not Started" }
      ],
      "skills": ["Skill 1"],
      "projects": [{ "title": "Project Name", "difficulty": "Beginner", "description": "Project description" }],
      "resources": [{ "title": "Resource Name", "type": "Course", "provider": "Provider Name", "url": "https://actual-link.com", "rating": "4.8" }],
      "certifications": ["Cert 1"],
      "milestones": ["Milestone 1"]
    },
    {
      "id": "phase_2",
      "title": "Core Skills",
      "description": "Short description",
      "overview": "Detailed overview",
      "tasks": [{ "id": "p2_t1", "title": "Task", "completed": false, "status": "Not Started" }],
      "skills": ["Skill 1"],
      "projects": [],
      "resources": [],
      "certifications": [],
      "milestones": []
    },
    {
      "id": "phase_3",
      "title": "Projects",
      "description": "Short description",
      "overview": "Detailed overview",
      "tasks": [{ "id": "p3_t1", "title": "Task", "completed": false, "status": "Not Started" }],
      "skills": [],
      "projects": [],
      "resources": [],
      "certifications": [],
      "milestones": []
    },
    {
      "id": "phase_4",
      "title": "Industry Readiness",
      "description": "Short description",
      "overview": "Detailed overview",
      "tasks": [{ "id": "p4_t1", "title": "Task", "completed": false, "status": "Not Started" }],
      "skills": [],
      "projects": [],
      "resources": [],
      "certifications": [],
      "milestones": []
    },
    {
      "id": "phase_5",
      "title": "Placement / Career Launch",
      "description": "Short description",
      "overview": "Detailed overview",
      "tasks": [{ "id": "p5_t1", "title": "Task", "completed": false, "status": "Not Started" }],
      "skills": [],
      "projects": [],
      "resources": [],
      "certifications": [],
      "milestones": []
    }
  ],
  "sidebar": {
    "currentFocus": {
      "title": "First major topic",
      "description": "Description of the focus"
    },
    "recommendedResource": {
      "title": "Best resource for phase 1",
      "platform": "Platform name",
      "rating": "4.9 (10k)"
    }
  },
  "qualityScores": {
    "accuracy": 0,
    "relevance": 0,
    "personalization": 0,
    "consistency": 0
  }
}

RULES:
- EXACTLY 5 phases.
- Phases MUST build logically. Do NOT give beginner users advanced content too early.
- 5 tasks per phase.
- 3-5 skills per phase.
- 2 real-world projects per phase.
- 3-4 resources per phase. ALL resource URLs MUST be real, valid links to trusted platforms. NEVER use placeholder links or empty URLs.
- Use these trusted providers for resources: Coursera, Udemy, edX, Harvard CS50, DeepLearning.AI, MDN, React Docs, Python Docs, Node.js Docs, TensorFlow Docs, PyTorch Docs, AWS Docs, Azure Docs, Google Cloud Docs, LeetCode, HackerRank, Codeforces, GeeksforGeeks, Exercism, freeCodeCamp, Traversy Media, CodeWithHarry, Abdul Bari, Tech With Tim, Books (Cracking the Coding Interview, Clean Code, Grokking Algorithms, System Design Interview).
- Map resources specifically to the Target Career. For example, Software Engineers need LeetCode, OOP, System Design. AI Engineers need Machine Learning Specialization, Kaggle, HuggingFace, PyTorch. Use similar strict mapping logic for ${w.targetCareer}.
- 2 certifications per phase.
- 2 milestones per phase.
- Tailor entirely to ${w.targetCareer}.
- Include a qualityScores object to evaluate your output.
- Return ONLY the JSON object.`;
}

export function useCareerRoadmap() {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const { addNotification } = useNotifications();
  const { profile, mergeProfileData } = useProfile();
  const uidRef = useRef(null);
  const dispatch$ = useRef(dispatch);
  dispatch$.current = dispatch;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        uidRef.current = null;
        dispatch$.current({ type: 'NO_USER' });
        return;
      }

      const uid = firebaseUser.uid;
      uidRef.current = uid;
      dispatch$.current({ type: 'FETCH_START', uid });

      try {
        const snap = await getDoc(doc(db, 'career_roadmaps', uid));
        if (snap.exists()) {
          dispatch$.current({ type: 'FETCH_OK', data: snap.data() });
        } else {
          dispatch$.current({ type: 'NO_ROADMAP' });
        }
      } catch (err) {
        if (err.code === 'permission-denied') {
          dispatch$.current({ type: 'NO_ROADMAP' });
        } else {
          dispatch$.current({ type: 'FETCH_ERROR', error: `Could not load roadmap (${err.message})` });
        }
      }
    });

    return unsub;
  }, []);

  const generate = useCallback(async (wizardData) => {
    const uid = uidRef.current;
    if (!uid) return dispatch$.current({ type: 'GEN_ERROR', error: 'Not authenticated.' });

    dispatch$.current({ type: 'GEN_START' });
    // Local fallback timeout to ensure UI unblocks
    const localTimeoutId = setTimeout(() => dispatch$.current({ type: 'GEN_TIMEOUT' }), 60000);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error('API Key missing');

      const wizardWithProfile = { ...wizardData, missingSkills: profile?.missingSkills || [] };
      const promptText = buildPrompt(wizardWithProfile);
      
      const modelUsed = 'gemini-2.5-flash';
      const promptSize = new Blob([promptText]).size;
      const promptLength = promptText.length;
      
      console.log(`[Roadmap Gen] Model: ${modelUsed} | Prompt Length: ${promptLength} chars | Prompt Size: ${promptSize} bytes`);

      const startTime = Date.now();
      
      const controller = new AbortController();
      const fetchTimeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout for Roadmap
      
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelUsed}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
            generationConfig: { temperature: 0.2, responseMimeType: 'application/json' },
          }),
          signal: controller.signal
        }
      );

      clearTimeout(fetchTimeoutId);

      if (!res.ok) throw new Error(`API error: ${res.status}`);
      
      const json = await res.json();
      
      const responseTime = Date.now() - startTime;
      const tokenUsage = json.usageMetadata?.totalTokenCount || 'N/A';
      console.log(`[Roadmap Gen] Completed | Time: ${responseTime}ms | Tokens: ${tokenUsage}`);

      const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error('Empty response');

      const cleanText = rawText.replace(/^s*```json/i, '').replace(/```s*$/i, '').trim();
      let parsed;
      try {
        parsed = JSON.parse(cleanText);
        analyticsService.trackAIOperation('Career Roadmap', tokenUsage, responseTime, true, null);
      } catch (parseError) {
        analyticsService.trackError('Career Roadmap Parse Error', parseError);
        analyticsService.trackAIOperation('Career Roadmap', tokenUsage, responseTime, false, 'JSON Parse Error');
        throw parseError;
      }

      // Ensure IDs
      (parsed.phases || []).forEach((p, i) => {
        if (!p.id) p.id = `phase_${i + 1}`;
        (p.tasks || []).forEach((t, j) => {
          if (!t.id) t.id = `${p.id}_t${j + 1}`;
        });
      });

      const docData = {
        userId: uid,
        ...wizardData,
        roadmapData: parsed,
        completedTasks: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'career_roadmaps', uid), docData);
      dispatch$.current({ type: 'GEN_OK', data: { ...docData, createdAt: new Date() } });
      
      // Also save roadmap progress to profile so AI Coach knows about it
      await mergeProfileData({ 
        targetRole: wizardData.targetCareer,
        hasRoadmap: true,
        roadmapProgress: { totalTasks: 25, completedTasks: 0 } 
      });

      addNotification({
        title: 'Career Roadmap Created',
        message: `Your new roadmap for ${wizardData.targetCareer} is ready.`,
        type: 'System',
        targetUrl: '/career-roadmap'
      });

      analyticsService.trackEvent('Roadmap Generated', { targetCareer: wizardData.targetCareer });

    } catch (err) {
      analyticsService.trackError('Career Roadmap Generation Error', err);
      dispatch$.current({ type: 'GEN_ERROR', error: err.message });
    } finally {
      clearTimeout(localTimeoutId);
    }
  }, [profile]);

  const toggleTask = useCallback(async (taskId, done) => {
    const uid = uidRef.current;
    if (!uid || !state.roadmap) return;

    const prev = state.roadmap.completedTasks || [];
    const next = done ? [...new Set([...prev, taskId])] : prev.filter(id => id !== taskId);

    const updated = { ...state.roadmap, completedTasks: next };
    dispatch$.current({ type: 'TASK_UPDATE', roadmap: updated });

    try {
      await updateDoc(doc(db, 'career_roadmaps', uid), { completedTasks: next, updatedAt: serverTimestamp() });
      
      await mergeProfileData({ 
        roadmapProgress: { totalTasks: 25, completedTasks: next.length } 
      });
      
      if (done) {
        const phase = state.roadmap.roadmapData?.phases?.find(p => p.tasks.some(t => t.id === taskId));
        if (phase) {
          const allPhaseTasks = phase.tasks.map(t => t.id);
          const wereAllCompleted = allPhaseTasks.every(id => prev.includes(id));
          const areAllCompleted = allPhaseTasks.every(id => next.includes(id));
          if (!wereAllCompleted && areAllCompleted) {
             addNotification({
               title: 'Phase Completed & Unlocked',
               message: `You completed "${phase.title}". Next phase unlocked!`,
               type: 'Opportunities',
               targetUrl: '/career-roadmap'
             });
          }
        }
      }
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  }, [state.roadmap, addNotification]);

  const reset = useCallback(async () => {
    const uid = uidRef.current;
    if (uid) {
      try {
        await deleteDoc(doc(db, 'career_roadmaps', uid));
      } catch (err) {
        console.error('Failed to delete roadmap:', err);
      }
    }
    dispatch$.current({ type: 'RESET' });
  }, []);

  return { state, generate, toggleTask, reset };
}
