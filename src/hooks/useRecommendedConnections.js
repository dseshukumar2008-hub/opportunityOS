import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useConnections } from '../contexts/ConnectionContext';
import { useTeam } from '../contexts/TeamContext';
import { useUserDirectory } from './useUserDirectory';

export function useRecommendedConnections(limit = null) {
  const { user: authUser } = useAuth();
  const { connections, requests, currentUserId } = useConnections();
  const { users, usersById, loading, error } = useUserDirectory();
  const { teams } = useTeam();

  const recommendations = useMemo(() => {
    const currentUserProfile = usersById.get(currentUserId) || authUser || {};
    
    // Get all user IDs we are already connected with
    const connectedUserIds = new Set(
      connections
        .filter(c => c.userId1 === currentUserId || c.userId2 === currentUserId)
        .map(c => (c.userId1 === currentUserId ? c.userId2 : c.userId1))
    );

    // Get all user IDs where there is an active pending request (sent or received)
    const pendingRequestUserIds = new Set(
      requests
        .filter(r => r.status === 'pending' && (r.fromUserId === currentUserId || r.toUserId === currentUserId))
        .map(r => (r.fromUserId === currentUserId ? r.toUserId : r.fromUserId))
    );

    // Filter out current user, connected users, and pending request users
    const potentialUsers = users.filter(u => 
      u.id !== currentUserId && 
      u.discoverable !== false &&
      !connectedUserIds.has(u.id) &&
      !pendingRequestUserIds.has(u.id)
    );

    // Calculate score for each potential user
    const scoredUsers = potentialUsers.map(targetUser => {
      let score = 0;
      let sharedSkills = [];

      // 1. Shared Skills (15 pts per skill, max 45)
      const currentSkills = Array.isArray(currentUserProfile.skills) ? currentUserProfile.skills : [];
      const targetSkills = Array.isArray(targetUser.skills) ? targetUser.skills : [];
      
      if (currentSkills.length > 0 && targetSkills.length > 0) {
        sharedSkills = targetSkills.filter(s => currentSkills.includes(s));
        score += Math.min(sharedSkills.length * 15, 45);
      }

      // 2. Same College (25 pts)
      if (currentUserProfile.college && currentUserProfile.college === targetUser.college) {
        score += 25;
      }

      // 3. Same Branch (15 pts)
      if (currentUserProfile.branch && currentUserProfile.branch === targetUser.branch) {
        score += 15;
      }

      // 4. Common Teams (15 pts per team, max 15)
      const mutualTeams = (teams || []).filter(t => t.members?.includes(currentUserId) && t.members?.includes(targetUser.id));
      if (mutualTeams.length > 0) {
        score += 15; // Cap at 15 for simplicity
      }

      return {
        ...targetUser,
        matchScore: Math.min(score, 100), // Cap at 100
        sharedSkillsCount: sharedSkills.length
      };
    });

    // Sort by match score descending
    const sorted = scoredUsers
      .filter(u => u.matchScore > 0) // Only recommend if there is some overlap
      .sort((a, b) => b.matchScore - a.matchScore);

    return limit ? sorted.slice(0, limit) : sorted;
  }, [users, usersById, connections, requests, currentUserId, authUser, teams, limit]);

  return { recommendations, loading, error };
}
