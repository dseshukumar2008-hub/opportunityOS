import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';

export const saveInterviewSession = async (userId, sessionData) => {
  if (!userId) throw new Error("User ID is required to save interview session");
  
  const sessionsRef = collection(db, 'users', userId, 'interviewSessions');
  const docRef = doc(sessionsRef);
  
  await setDoc(docRef, {
    ...sessionData,
    completedAt: serverTimestamp(),
  });
  
  return docRef.id;
};

export const getInterviewHistory = async (userId) => {
  if (!userId) return [];
  
  try {
    const sessionsRef = collection(db, 'users', userId, 'interviewSessions');
    const q = query(sessionsRef, orderBy('completedAt', 'desc'));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching interview history:", error);
    return [];
  }
};
