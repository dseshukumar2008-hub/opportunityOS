import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { db, auth } from '../config/firebase';
import { collection, doc, getDocs, addDoc, setDoc, orderBy, query, limit, serverTimestamp } from 'firebase/firestore';
import { getErrorMessage } from '../utils/errorUtils';

export function useCopilotMemory() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      if (!user?.uid) {
        setLoading(false);
        return;
      }
      
      // Guard against race condition with Firebase SDK auth state
      if (!auth.currentUser) {
        console.warn("[CareerCoach] loadHistory skipped — auth.currentUser not ready yet.");
        return;
      }

      try {
        const chatsRef = collection(db, "users", user.uid, "career_coach_chats");
        const q = query(chatsRef, orderBy("timestamp", "asc"), limit(50));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          const history = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setMessages(history);
        }
      } catch (err) {
        console.error("Error loading chat history:", err);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, [user?.uid]);

  const addMessage = async (messageObj) => {
    const tempId = Math.random().toString(36).substring(7);
    const newMessage = { ...messageObj, id: tempId, timestamp: new Date().toISOString() };
    
    // Capture previous state for rollback
    let previousMessages = [];
    setMessages(prev => {
      previousMessages = [...prev];
      return [...prev, newMessage];
    });

    if (user?.uid) {
      if (!auth.currentUser) {
         toast.error("Still connecting to server. Please try again.");
         return;
      }
      try {
        const chatsRef = collection(db, "users", user.uid, "career_coach_chats");
        await addDoc(chatsRef, {
          role: messageObj.role,
          content: messageObj.content,
          timestamp: serverTimestamp()
        });
      } catch (err) {
        console.error("Error saving message:", err);
        toast.error(getErrorMessage(err, "Failed to save message. Please try again."));
      }
    }
  };

  const clearMemory = async () => {
    setMessages([]);
  };

  return { messages, addMessage, clearMemory, loading };
}
