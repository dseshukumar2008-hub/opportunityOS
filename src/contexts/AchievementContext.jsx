/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/set-state-in-effect */
import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { useAuth } from './AuthContext';

import { useConnections } from './ConnectionContext';
import { useResume } from './ResumeContext';
import { useTeam } from './TeamContext';
import { useCareerReadiness } from '../hooks/useCareerReadiness';
import { useNotifications } from './NotificationContext';
import toast from 'react-hot-toast';

const AchievementContext = createContext(null);

export const BADGE_DEFINITIONS = [
  // Applications
  { id: 'app-1', title: 'First Application', description: 'Apply to first opportunity', category: 'Applications' },
  { id: 'app-25', title: 'Opportunity Hunter', description: 'Apply to 25 opportunities', category: 'Applications' },
  { id: 'app-50', title: 'Career Explorer', description: 'Apply to 50 opportunities', category: 'Applications' },

  // Networking
  { id: 'net-1', title: 'First Connection', description: 'Make first connection', category: 'Networking' },
  { id: 'net-25', title: 'Network Builder', description: 'Reach 25 connections', category: 'Networking' },
  { id: 'net-100', title: 'Networking Pro', description: 'Reach 100 connections', category: 'Networking' },

  // Resume
  { id: 'res-1', title: 'Resume Builder', description: 'Create first resume', category: 'Resume' },
  { id: 'res-90', title: 'ATS Expert', description: 'Reach ATS Score 90+', category: 'Resume' },

  // Teams
  { id: 'team-1', title: 'Team Player', description: 'Join first team', category: 'Teams' },
  { id: 'team-lead', title: 'Team Leader', description: 'Create first team', category: 'Teams' },

  // Learning
  { id: 'skill-5', title: 'Skill Builder', description: 'Add 5 skills', category: 'Learning' },
  { id: 'cert-1', title: 'Certified Learner', description: 'Earn first certification', category: 'Learning' },

  // Career Growth
  { id: 'ready-80', title: 'Career Ready', description: 'Reach Career Readiness Score 80+', category: 'Career Growth' },
  { id: 'champ-10', title: 'OpportunityOS Champion', description: 'Unlock 10 badges', category: 'Career Growth' }
];

export const AchievementProvider = ({ children }) => {
  const { user } = useAuth();

  const connectionsData = useConnections();
  const { resumeData, getResumeStrength } = useResume();
  const { teams } = useTeam();
  const { score: readinessScore } = useCareerReadiness();
  const { addNotification } = useNotifications();

  const currentUserId = user?.id || null;

  const [unlockedBadges, setUnlockedBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUserId) {
      setUnlockedBadges([]);
      setLoading(false);
      return;
    }

    const achievementsRef = collection(db, 'users', currentUserId, 'achievements');
    const unsubscribe = onSnapshot(achievementsRef, (snapshot) => {
      const badges = [];
      snapshot.docs.forEach(docSnap => {
        const data = docSnap.data();
        const badgeDef = BADGE_DEFINITIONS.find(b => b.id === data.badgeId);
        if (badgeDef) {
          badges.push({
            ...badgeDef,
            unlocked: true,
            unlockedDate: data.unlockedDate?.toDate?.()?.toISOString() || new Date().toISOString()
          });
        }
      });
      setUnlockedBadges(badges);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching achievements:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUserId]);

  const checkAndUnlock = async (badgeId) => {
    if (!currentUserId) return;

    // Local state guard
    if (unlockedBadges.some(b => b.id === badgeId)) return;

    const badgeDef = BADGE_DEFINITIONS.find(b => b.id === badgeId);
    if (!badgeDef) return;

    const newBadge = { ...badgeDef, unlocked: true, unlockedDate: new Date().toISOString() };

    // Optimistic update
    setUnlockedBadges(prev => {
      if (prev.some(b => b.id === badgeId)) return prev;
      return [...prev, newBadge];
    });

    try {
      const badgeRef = doc(db, 'users', currentUserId, 'achievements', badgeId);
      await setDoc(badgeRef, {
        badgeId: badgeId,
        unlockedDate: serverTimestamp()
      }, { merge: true });

      // Trigger Notification and Toast on actual success
      addNotification({
        category: 'Achievements',
        title: '🎉 Badge Unlocked',
        message: `${badgeDef.title}\n${badgeDef.description}`
      });
      toast.success(`Achievement Unlocked: ${badgeDef.title} 🎉`);
    } catch (err) {
      console.error('Failed to save achievement:', err);
    }
  };

  // Evaluate conditions periodically based on dependencies
  useEffect(() => {
    if (!currentUserId) return;

    const appsCount = 0;
    const connectionsArray = Array.isArray(connectionsData?.connections)
      ? connectionsData.connections
      : (Array.isArray(connectionsData) ? connectionsData : []);
    const connCount = connectionsArray.length;

    const atsScore = getResumeStrength();
    const skillsCount = resumeData?.skills?.length || 0;
    const certsCount = resumeData?.certifications?.length || 0;

    const myTeams = teams?.filter(t => t.members.includes(currentUserId)) || [];
    const amLeader = myTeams.some(t => t.leaderId === currentUserId);

    const hasResumeContent = resumeData?.personalInfo?.fullName || resumeData?.experience?.length > 0 || skillsCount > 0;

    // Evaluate Applications
    if (appsCount >= 1) checkAndUnlock('app-1');
    if (appsCount >= 25) checkAndUnlock('app-25');
    if (appsCount >= 50) checkAndUnlock('app-50');

    // Evaluate Networking
    if (connCount >= 1) checkAndUnlock('net-1');
    if (connCount >= 25) checkAndUnlock('net-25');
    if (connCount >= 100) checkAndUnlock('net-100');

    // Evaluate Resume
    if (hasResumeContent) checkAndUnlock('res-1');
    if (atsScore >= 90) checkAndUnlock('res-90');

    // Evaluate Teams
    if (myTeams.length >= 1) checkAndUnlock('team-1');
    if (amLeader) checkAndUnlock('team-lead');

    // Evaluate Learning
    if (skillsCount >= 5) checkAndUnlock('skill-5');
    if (certsCount >= 1) checkAndUnlock('cert-1');

    // Evaluate Career Growth
    if (readinessScore >= 80) checkAndUnlock('ready-80');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionsData, resumeData, getResumeStrength, teams, readinessScore, currentUserId]);

  // Champion Badge check
  useEffect(() => {
    if (!currentUserId) return;
    if (unlockedBadges.length >= 10 && !unlockedBadges.some(b => b.id === 'champ-10')) {
      checkAndUnlock('champ-10');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlockedBadges.length, currentUserId]);

  const getBadgeProgress = (badgeId) => {
    const appsCount = 0;
    const connectionsArray = Array.isArray(connectionsData?.connections)
      ? connectionsData.connections
      : (Array.isArray(connectionsData) ? connectionsData : []);
    const connCount = connectionsArray.length;
    const atsScore = getResumeStrength();
    const skillsCount = resumeData?.skills?.length || 0;
    const certsCount = resumeData?.certifications?.length || 0;
    const myTeams = teams?.filter(t => t.members.includes(currentUserId)) || [];
    const amLeader = myTeams.some(t => t.leaderId === currentUserId);
    const hasResumeContent = resumeData?.personalInfo?.fullName || resumeData?.experience?.length > 0 || skillsCount > 0;
    const unlockedCount = unlockedBadges.length;

    switch (badgeId) {
      case 'app-1': return { current: appsCount, target: 1, label: 'Applications' };
      case 'app-25': return { current: appsCount, target: 25, label: 'Applications' };
      case 'app-50': return { current: appsCount, target: 50, label: 'Applications' };
      case 'net-1': return { current: connCount, target: 1, label: 'Connections' };
      case 'net-25': return { current: connCount, target: 25, label: 'Connections' };
      case 'net-100': return { current: connCount, target: 100, label: 'Connections' };
      case 'res-1': return { current: hasResumeContent ? 1 : 0, target: 1, label: 'Resume Created' };
      case 'res-90': return { current: atsScore, target: 90, label: 'ATS Score' };
      case 'team-1': return { current: myTeams.length, target: 1, label: 'Teams Joined' };
      case 'team-lead': return { current: amLeader ? 1 : 0, target: 1, label: 'Teams Led' };
      case 'skill-5': return { current: skillsCount, target: 5, label: 'Skills' };
      case 'cert-1': return { current: certsCount, target: 1, label: 'Certifications' };
      case 'ready-80': return { current: readinessScore, target: 80, label: 'Readiness Score' };
      case 'champ-10': return { current: unlockedCount, target: 10, label: 'Badges Unlocked' };
      default: return { current: 0, target: 1, label: 'Progress' };
    }
  };

  return (
    <AchievementContext.Provider value={{ unlockedBadges, allBadges: BADGE_DEFINITIONS, getBadgeProgress, loading }}>
      {children}
    </AchievementContext.Provider>
  );
};

export const useAchievements = () => useContext(AchievementContext);
