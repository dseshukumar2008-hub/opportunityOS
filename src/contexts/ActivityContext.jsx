import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db } from '../config/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, where } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const ActivityContext = createContext(null);

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (!context) throw new Error('useActivity must be used within ActivityProvider');
  return context;
};

export function ActivityProvider({ children }) {
  const { user } = useAuth();
  const currentUserId = user?.id || null;

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Real-time listener for activities
  useEffect(() => {
    if (!currentUserId) {
      setActivities([]);
      setLoading(false);
      return;
    }

    // We only fetch activities for the current user to save reads
    const q = query(
      collection(db, 'activities'), 
      where('userId', '==', currentUserId),
      // To order by timestamp, we need an index on userId and timestamp. If it fails, we'll see a console error.
    );
    
    // Actually, to avoid needing a composite index immediately during dev, let's just fetch by userId and sort locally if needed,
    // but orderBy usually works if we only filter by equality.
    const qWithOrder = query(
      collection(db, 'activities'),
      where('userId', '==', currentUserId),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(qWithOrder, (snapshot) => {
      const fetchedActivities = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamp to ISO string for consistency
        timestamp: doc.data().timestamp?.toDate().toISOString() || new Date().toISOString()
      }));
      setActivities(fetchedActivities);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching activities:", error);
      // Fallback if index is missing: just fetch without orderBy
      if (error.code === 'failed-precondition') {
        const fallbackQ = query(collection(db, 'activities'), where('userId', '==', currentUserId));
        fallbackUnsubscribe = onSnapshot(fallbackQ, (fallbackSnapshot) => {
            const fetched = fallbackSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate().toISOString() || new Date().toISOString()
            })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setActivities(fetched);
            setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [currentUserId]);

  const addActivity = useCallback(async (activity) => {
    const targetUserId = activity.userId || currentUserId;
    if (!targetUserId) return;

    try {
      await addDoc(collection(db, 'activities'), {
        userId: targetUserId,
        category: activity.category || 'General',
        type: activity.type || 'action',
        title: activity.title,
        description: activity.description || '',
        iconType: activity.iconType || 'Activity',
        color: activity.color || 'bg-slate-50 text-slate-600',
        timestamp: serverTimestamp()
      });
    } catch (err) {
      console.error('Failed to save activity:', err);
    }
  }, [currentUserId]);

  const getUserActivities = useCallback((userId) => {
    return activities.filter(a => a.userId === userId);
  }, [activities]);

  return (
    <ActivityContext.Provider value={{ activities, loading, addActivity, getUserActivities }}>
      {children}
    </ActivityContext.Provider>
  );
}
