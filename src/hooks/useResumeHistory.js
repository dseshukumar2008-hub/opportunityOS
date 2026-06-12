import { useState, useEffect, useCallback } from 'react';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { 
  collection, query, where, orderBy, onSnapshot, 
  addDoc, getDocs, writeBatch, doc
} from 'firebase/firestore';

const STORAGE_KEY = 'oppOs_resume_history';

export function useResumeHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Subscribe to real-time resume history from Firestore
  useEffect(() => {
    if (!user?.id) {
      setHistory([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const q = query(
      collection(db, 'resume_history'), 
      where('uid', '==', user.id),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const docs = [];
      snapshot.forEach(doc => {
        docs.push({ id: doc.id, ...doc.data() });
      });

      // Migration check: If Firestore is empty, check if there is legacy localStorage history to rescue
      if (docs.length === 0) {
        const localDataStr = localStorage.getItem(STORAGE_KEY);
        if (localDataStr) {
          try {
            const localData = JSON.parse(localDataStr);
            if (Array.isArray(localData) && localData.length > 0) {
              const batch = writeBatch(db);
              localData.forEach((item, index) => {
                const docRef = collection(db, 'resume_history');
                const newDocRef = doc(docRef);
                batch.set(newDocRef, {
                  uid: user.id,
                  versionNumber: item.versionNumber || (index + 1),
                  timestamp: item.timestamp || new Date().toISOString(),
                  sourceName: item.sourceName || 'Uploaded Resume',
                  results: item.results
                });
              });
              await batch.commit();
              // Successfully migrated, clean localStorage
              localStorage.removeItem(STORAGE_KEY);
              return; // Let onSnapshot refire
            }
          } catch (err) {
            console.error('Failed to migrate local resume history:', err);
          }
        }
      }

      setHistory(docs);
      setIsLoading(false);
    }, (err) => {
      console.error('Error listening to resume history:', err);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user?.id]);

  const addHistory = useCallback(async (results, sourceName) => {
    if (!user?.id) return;
    try {
      const newVersionNum = history.length + 1;
      await addDoc(collection(db, 'resume_history'), {
        uid: user.id,
        versionNumber: newVersionNum,
        timestamp: new Date().toISOString(),
        sourceName: sourceName || 'Uploaded Resume',
        results: results
      });
    } catch (err) {
      console.error('Error adding resume history:', err);
      throw err;
    }
  }, [user?.id, history]);

  const clearHistory = useCallback(async () => {
    if (!user?.id) return;
    try {
      const q = query(collection(db, 'resume_history'), where('uid', '==', user.id));
      const snap = await getDocs(q);
      if (snap.empty) return;
      const batch = writeBatch(db);
      snap.docs.forEach(doc => batch.delete(doc.ref));
      await batch.commit();
    } catch (err) {
      console.error('Error clearing resume history:', err);
      throw err;
    }
  }, [user?.id]);

  const getBestVersion = useCallback(() => {
    if (history.length === 0) return null;
    return history.reduce((best, current) => {
      const currentScore = current.results?.overallScore || 0;
      const bestScore = best.results?.overallScore || 0;
      return (currentScore > bestScore) ? current : best;
    }, history[0]);
  }, [history]);

  const compareVersions = useCallback((v1Id, v2Id) => {
    const v1 = history.find(h => h.id === v1Id);
    const v2 = history.find(h => h.id === v2Id);
    
    if (!v1 || !v2) return null;

    const v1Score = v1.results?.overallScore || 0;
    const v2Score = v2.results?.overallScore || 0;
    const scoreDiff = v2Score - v1Score;

    const v1Skills = v1.results?.categories?.Skills?.score || 0;
    const v2Skills = v2.results?.categories?.Skills?.score || 0;
    const skillsDiff = v2Skills - v1Skills;

    const v1Projects = v1.results?.categories?.Projects?.score || 0;
    const v2Projects = v2.results?.categories?.Projects?.score || 0;
    const projectsDiff = v2Projects - v1Projects;

    const v1Keywords = v1.results?.categories?.Keywords?.score || 0;
    const v2Keywords = v2.results?.categories?.Keywords?.score || 0;
    const keywordsDiff = v2Keywords - v1Keywords;
    
    const summary = [];
    if (skillsDiff > 0) summary.push(`Improved Skills score by ${skillsDiff} points.`);
    if (projectsDiff > 0) summary.push(`Improved Projects score by ${projectsDiff} points.`);
    if (keywordsDiff > 0) summary.push(`Improved Keywords coverage by ${keywordsDiff} points.`);
    
    const v1Missing = v1.results?.missingKeywords || [];
    const v2Missing = v2.results?.missingKeywords || [];
    const addedKeywords = v1Missing.filter(kw => !v2Missing.includes(kw));
    
    if (addedKeywords.length > 0) {
      summary.push(`Added keywords: ${addedKeywords.join(', ')}.`);
    }

    if (summary.length === 0 && scoreDiff > 0) {
      summary.push(`Overall optimization increased ATS score by ${scoreDiff} points.`);
    }

    return {
      v1,
      v2,
      scoreDiff,
      skillsDiff,
      projectsDiff,
      keywordsDiff,
      summary
    };
  }, [history]);

  return {
    history,
    isLoading,
    addHistory,
    clearHistory,
    getBestVersion,
    compareVersions
  };
}
