import { useState, useCallback, useEffect, useRef } from 'react';
import { useUserProfile } from './useUserProfile';
import { useResumeInsights } from './useResumeInsights';
import { useRecommendations } from './useRecommendations';
import { useApplications } from '../contexts/ApplicationContext';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import { collection, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const CACHE_SESSION_KEY = 'career_coach_session';

/**
 * Builds a rich context object to inject into every Gemini prompt.
 */
function buildContext({ profile, atsScore, topStrength, topWeakness, recommendations, applications }) {
  return {
    profile: {
      skills: profile?.skills || [],
      goals: profile?.careerGoals || [],
      interests: profile?.interests || [],
      college: profile?.college || '',
      degree: profile?.degree || '',
    },
    resumeAnalysis: {
      atsScore: atsScore || 0,
      topStrength: topStrength || 'N/A',
      topWeakness: topWeakness || 'N/A',
    },
    topRecommendations: (recommendations || []).slice(0, 3).map(r => ({
      title: r.title,
      company: r.company,
      matchScore: r.matchData?.score,
    })),
    applicationsSubmitted: applications?.length || 0,
  };
}

/**
 * Calls the Gemini API with a full message history for true conversation memory.
 */
async function callGeminiChat(contextData, history, userMessage) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error('VITE_GEMINI_API_KEY is not configured.');

  const systemPrompt = `You are an expert AI Career Coach inside OpportunityOS. Your role is to give highly personalized, actionable career advice to students and professionals.

Always ground your answers in the user's specific context below. Be concise, encouraging, and specific — avoid generic platitudes.

User Context:
${JSON.stringify(contextData, null, 2)}

Instructions:
- When asked about ATS scores, reference their actual score of ${contextData.resumeAnalysis.atsScore}.
- When asked about skills, reference their listed skills: ${contextData.profile.skills.join(', ') || 'none listed'}.
- When asked about opportunities, reference their top recommendations.
- Keep responses under 200 words unless a detailed breakdown is requested.`;

  // Build conversation turns for Gemini
  const contents = [];

  // Inject context as the first user turn, then a model ack
  contents.push({ role: 'user', parts: [{ text: systemPrompt }] });
  contents.push({ role: 'model', parts: [{ text: 'Understood. I have your profile context loaded. How can I help you today?' }] });

  // Add prior conversation history
  for (const msg of history) {
    contents.push({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    });
  }

  // Add the current user message
  contents.push({ role: 'user', parts: [{ text: userMessage }] });

  const requestBody = {
    contents,
    generationConfig: { temperature: 0.4, maxOutputTokens: 600 }
  };

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Gemini API Error: ${response.status}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error('Empty response from Gemini.');
  return rawText.trim();
}

export const SUGGESTED_PROMPTS = [
  'How do I improve my ATS score?',
  'What skills should I learn next?',
  'Which opportunities fit my profile?',
  'How can I become internship-ready?',
];

export function useCareerCoach() {
  const { profile } = useUserProfile();
  const { atsScore, topStrength, topWeakness } = useResumeInsights();
  const { recommendations } = useRecommendations();
  const { applications } = useApplications();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const contextRef = useRef(null);

  // Load existing chat session from Firebase on mount
  useEffect(() => {
    if (!user) return;
    const loadSession = async () => {
      try {
        const docRef = doc(db, 'career_coach_chats', user.id);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const saved = snap.data();
          if (saved.messages && saved.messages.length > 0) {
            setMessages(saved.messages);
          }
        }
      } catch (e) {
        // Silently ignore offline errors — start fresh
        const local = sessionStorage.getItem(`${CACHE_SESSION_KEY}_${user.id}`);
        if (local) {
          try { setMessages(JSON.parse(local)); } catch {}
        }
      }
    };
    loadSession();
  }, [user]);

  // Keep context fresh
  useEffect(() => {
    contextRef.current = buildContext({ profile, atsScore, topStrength, topWeakness, recommendations, applications });
  }, [profile, atsScore, topStrength, topWeakness, recommendations, applications]);

  const persistMessages = useCallback(async (updatedMessages) => {
    if (!user) return;
    // Always save to sessionStorage immediately (works offline)
    sessionStorage.setItem(`${CACHE_SESSION_KEY}_${user.id}`, JSON.stringify(updatedMessages));
    try {
      await setDoc(doc(db, 'career_coach_chats', user.id), {
        uid: user.id,
        messages: updatedMessages,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      }, { merge: true });
    } catch (e) {
      // Firebase offline — session is still safe in sessionStorage
    }
  }, [user]);

  const sendMessage = useCallback(async (userText) => {
    if (!userText?.trim() || isLoading) return;

    const userMsg = { role: 'user', content: userText, timestamp: new Date().toISOString() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);
    setError(null);

    try {
      // Pass history BEFORE this message (not including it, since callGeminiChat appends it)
      const responseText = await callGeminiChat(contextRef.current || {}, messages, userText);

      const assistantMsg = { role: 'assistant', content: responseText, timestamp: new Date().toISOString() };
      const finalMessages = [...newMessages, assistantMsg];
      setMessages(finalMessages);
      await persistMessages(finalMessages);
    } catch (err) {
      console.error('Career Coach Error:', err);
      setError('Career Coach is temporarily unavailable. Please try again.');
      // Remove the user message we optimistically added so the user can retry
      setMessages(messages);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, persistMessages]);

  const clearChat = useCallback(async () => {
    setMessages([]);
    setError(null);
    if (user) {
      sessionStorage.removeItem(`${CACHE_SESSION_KEY}_${user.id}`);
      try {
        await setDoc(doc(db, 'career_coach_chats', user.id), {
          uid: user.id,
          messages: [],
          updatedAt: serverTimestamp(),
        }, { merge: true });
      } catch {}
    }
  }, [user]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    suggestedPrompts: SUGGESTED_PROMPTS,
  };
}
