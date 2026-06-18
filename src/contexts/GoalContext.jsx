/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { useApplications } from './ApplicationContext';
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
  const { applications } = useApplications();
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

  const fetchGoals = useCallback(async () => {
    if (!user) {
      setGoals([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === '42P01') {
          console.warn('goals table missing. Fallback to empty.');
          setGoals([]);
        } else {
          throw error;
        } 
      } else {
        const mapped = data.map(g => ({
          id: g.id,
          title: g.title,
          description: g.description,
          category: g.category,
          targetValue: Number(g.target_value),
          currentValue: Number(g.current_value),
          status: g.status,
          notifiedMilestones: g.notified_milestones || [],
          dateCreated: g.created_at
        }));
        setGoals(mapped);
      }
    } catch (err) {
      console.error('Error fetching goals:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchGoals();

    if (!user) return;

    const channel = supabase
      .channel('public:goals')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'goals', filter: `user_id=eq.${user.id}` },
        (payload) => {
          fetchGoals();
          if (payload.eventType === 'UPDATE' && payload.old && payload.new) {
            if (payload.old.status !== 'Completed' && payload.new.status === 'Completed') {
              toast.success(`Goal Completed: ${payload.new.title} 🎯`);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchGoals, user]);

  const addGoal = async (goalData) => {
    if (!user) return;

    const newGoalDb = {
      user_id: user.id,
      title: goalData.title,
      description: goalData.description || null,
      category: goalData.category,
      target_value: goalData.targetValue,
      current_value: 0,
      status: 'Not Started',
      notified_milestones: []
    };

    try {
      const { data, error } = await supabase
        .from('goals')
        .insert([newGoalDb])
        .select()
        .single();

      if (error) {
        if (error.code === '42P01') return;
        throw error;
      }

      const mapped = {
        id: data.id,
        title: data.title,
        description: data.description,
        category: data.category,
        targetValue: Number(data.target_value),
        currentValue: Number(data.current_value),
        status: data.status,
        notifiedMilestones: data.notified_milestones || [],
        dateCreated: data.created_at
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
      await supabase
        .from('goals')
        .delete()
        .eq('id', id);
    } catch (err) {
      console.error('Failed to delete goal:', err);
    }
  };

  const syncGoalProgressToDb = async (goalId, updates) => {
    if (!user) return;
    try {
      await supabase
        .from('goals')
        .update({
          current_value: updates.currentValue,
          status: updates.status,
          notified_milestones: updates.notifiedMilestones
        })
        .eq('id', goalId);
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
          newCurrentValue = (applications || []).length;
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
          newCurrentValue = resumeData?.certifications?.length || 0;
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
    (applications || []).length, 
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
