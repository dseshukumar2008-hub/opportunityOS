import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import { collection, doc, getDocs, setDoc, orderBy, query, limit, serverTimestamp } from 'firebase/firestore';

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

      try {
        const chatsRef = collection(db, 'users', user.uid, 'career_coach_chats');
        // Fetch last 50 messages
        const q = query(chatsRef, orderBy('timestamp', 'asc'), limit(50));
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
  }, [user]);

  const addMessage = async (messageObj) => {
    // Optimistic update
    const tempId = Math.random().toString(36).substring(7);
    const newMessage = { ...messageObj, id: tempId, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, newMessage]);

    if (user?.uid) {
      try {
        const chatsRef = collection(db, 'users', user.uid, 'career_coach_chats');
        const docRef = doc(chatsRef, tempId); // In a real app we'd let Firestore auto-gen ID, but optimistic UI needs ID
        await setDoc(docRef, {
          role: messageObj.role,
          content: messageObj.content,
          timestamp: serverTimestamp()
        });
      } catch (err) {
        console.error("Error saving message:", err);
      }
    }
  };

  const clearMemory = async () => {
    setMessages([]);
    // Note: Actually deleting from Firestore requires batch delete which we can skip for now
    // or just rely on a new session ID approach.
  };

  return { messages, addMessage, clearMemory, loading };
}
