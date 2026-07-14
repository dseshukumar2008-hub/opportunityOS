/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from './AuthContext';

import { useResume } from './ResumeContext';
import { useTeam } from './TeamContext';
import { useConnections } from './ConnectionContext';
import { useNotifications } from './NotificationContext';
import toast from 'react-hot-toast';

const GoalContext = createContext(null);

export const useGoals = () => {
  const context = useContext(GoalContext);
  if (!context) {
    throw new Error('useGoals must be used within a GoalProvider');
  }
  return context;
};

export const GoalProvider = ({ children }) => {
  const { user } = useAuth();

  const { resumeData, getResumeStrength } = useResume();
  const { teams } = useTeam();
  const connectionsData = useConnections(); 
  
  // Safe extraction of connections length
  const connectionsLength = Array.isArray(connectionsData?.connections) 
    ? connectionsData.connections.length 
    : (Array.isArray(connectionsData) ? connectionsData.length : 0);

  const { addNotification } = useNotifications();

  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setGoals([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'users', user.id, 'goals'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const mapped = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          title: data.title,
          description: data.description,
          category: data.category,
          targetValue: Number(data.targetValue),
          currentValue: Number(data.currentValue),
          status: data.status,
          notifiedMilestones: data.notifiedMilestones || [],
          dateCreated: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
        };
      });
      setGoals(mapped);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching goals:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addGoal = async (goalData) => {
    if (!user) return;

    try {
      const docRef = await addDoc(collection(db, 'users', user.id, 'goals'), {
        title: goalData.title,
        description: goalData.description || null,
        category: goalData.category,
        targetValue: goalData.targetValue,
        currentValue: 0,
        status: 'Not Started',
        notifiedMilestones: [],
        createdAt: serverTimestamp()
      });

      const mapped = {
        id: docRef.id,
        title: goalData.title,
        description: goalData.description,
        category: goalData.category,
        targetValue: Number(goalData.targetValue),
        currentValue: 0,
        status: 'Not Started',
        notifiedMilestones: [],
        dateCreated: new Date().toISOString()
      };

      setGoals(prev => [mapped, ...prev]);
    } catch (err) {
      console.error('Failed to add goal:', err);
    }
  };

  const deleteGoal = async (id) => {
    // Optimistic
    setGoals(prev => prev.filter(g => g.id !== id));
    if (!user) return;

    try {
      await deleteDoc(doc(db, 'users', user.id, 'goals', id));
    } catch (err) {
      console.error('Failed to delete goal:', err);
    }
  };

  const syncGoalProgressToDb = async (goalId, updates) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.id, 'goals', goalId), {
        currentValue: updates.currentValue,
        status: updates.status,
        notifiedMilestones: updates.notifiedMilestones
      });
    } catch (err) {
      console.error('Failed to sync goal progress:', err);
    }
  };

  // ─── Auto-Tracking Engine ───────────────────────────────────────────────────
  useEffect(() => {
    if (goals.length === 0) return;

    let hasChangesGlobally = false;
    const updatedGoals = goals.map(goal => {
      let newCurrentValue = goal.currentValue;

      // 1. Calculate true current value based on category
      switch (goal.category) {
        case 'Applications':
          newCurrentValue = 0;
          break;
        case 'Skills':
          newCurrentValue = resumeData?.skills?.length || 0;
          break;
        case 'Resume': 
          newCurrentValue = getResumeStrength();
          break;
        case 'Networking':
          newCurrentValue = connectionsLength;
          break;
        case 'Teams':
          newCurrentValue = (teams || []).length;
          break;
        case 'Certifications':
          newCurrentValue = 0;
          break;
        default:
          break;
      }

      // Cap at target
      if (newCurrentValue > goal.targetValue) {
        newCurrentValue = goal.targetValue;
      }

      // 2. Determine new status
      let newStatus;
      if (newCurrentValue === 0) newStatus = 'Not Started';
      else if (newCurrentValue >= goal.targetValue) newStatus = 'Completed';
      else newStatus = 'In Progress';

      // 3. Milestone Notifications
      const progressPercentage = (newCurrentValue / goal.targetValue) * 100;
      const milestones = [25, 50, 75, 100];
      
      let newNotifiedMilestones = [...(goal.notifiedMilestones || [])];
      
      milestones.forEach(milestone => {
        if (progressPercentage >= milestone && !newNotifiedMilestones.includes(milestone)) {
          // Trigger Notification
            if (milestone === 100) {
              addNotification({
                category: 'System',
                title: '🎉 Goal Completed',
                message: `Congratulations! You completed your "${goal.title}" Goal.`,
                targetUrl: '/goals'
              });
              toast.success(`Goal Completed: ${goal.title} 🎯`);
            } else {
            addNotification({
              category: 'System',
              title: '🎉 Goal Milestone Reached',
              message: `Your "${goal.title}" Goal is now ${milestone}% complete. Keep it up!`,
              targetUrl: '/goals'
            });
          }
          newNotifiedMilestones.push(milestone);
        }
      });

      // 4. Return updated goal if changed
      if (
        newCurrentValue !== goal.currentValue || 
        newStatus !== goal.status ||
        newNotifiedMilestones.length !== goal.notifiedMilestones.length
      ) {
        hasChangesGlobally = true;
        const updatedGoal = {
          ...goal,
          currentValue: newCurrentValue,
          status: newStatus,
          notifiedMilestones: newNotifiedMilestones
        };
        
        // Sync to DB
        syncGoalProgressToDb(goal.id, updatedGoal);
        
        return updatedGoal;
      }

      return goal;
    });

    if (hasChangesGlobally) {
      setGoals(updatedGoals);
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [

    resumeData, 
    (teams || []).length, 
    connectionsLength, 
    getResumeStrength,
    addNotification,
    goals.length // Only depend on length/structural changes to avoid infinite loops
  ]);

  return (
    <GoalContext.Provider value={{ goals, loading, addGoal, deleteGoal }}>
      {children}
    </GoalContext.Provider>
  );
};
