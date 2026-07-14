/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useActivity } from './ActivityContext';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  arrayUnion,
  getDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import toast from 'react-hot-toast';

const TeamContext = createContext(null);

export const TeamProvider = ({ children }) => {
  const { user } = useAuth();
  const { addActivity } = useActivity();

  const currentUserId = user?.id || user?.uid || null;
  const currentUserName = user?.displayName || user?.email || 'Current User';

  const [teams, setTeams] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [teamMessages, setTeamMessages] = useState([]);
  const [teamLastRead, setTeamLastRead] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Refs to hold unsubscribe functions for cleanup
  const unsubTeams = useRef(null);
  const unsubRequests = useRef(null);
  const unsubMessages = useRef(null);

  // ─── Real-time Firestore listeners ─────────────────────────────────────────
  useEffect(() => {
    // Clean up previous listeners
    if (unsubTeams.current) unsubTeams.current();
    if (unsubRequests.current) unsubRequests.current();
    if (unsubMessages.current) unsubMessages.current();

    if (!user) {
      setTeams([]);
      setJoinRequests([]);
      setTeamMessages([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    // --- Teams listener (all teams, ordered by creation) ---
    const teamsQuery = query(
      collection(db, 'teams'),
      orderBy('createdAt', 'desc')
    );
    unsubTeams.current = onSnapshot(
      teamsQuery,
      (snapshot) => {
        const fetchedTeams = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          // Normalize Firestore timestamp to milliseconds for consistency
          createdAt: d.data().createdAt?.toMillis?.() ?? Date.now(),
        }));
        setTeams(fetchedTeams);
        setLoading(false);
      },
      (err) => {
        console.error('Teams listener error:', err);
        setError('Failed to load teams.');
        setLoading(false);
      }
    );

    // --- Join Requests listener ---
    const requestsQuery = query(
      collection(db, 'team_requests'),
      orderBy('createdAt', 'desc')
    );
    unsubRequests.current = onSnapshot(
      requestsQuery,
      (snapshot) => {
        setJoinRequests(
          snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
            createdAt: d.data().createdAt?.toMillis?.() ?? Date.now(),
          }))
        );
      },
      (err) => {
        console.error('Requests listener error:', err);
        setError('Failed to load join requests.');
      }
    );

    // --- Team Messages listener ---
    const messagesQuery = query(
      collection(db, 'team_messages'),
      orderBy('createdAt', 'asc')
    );
    unsubMessages.current = onSnapshot(
      messagesQuery,
      (snapshot) => {
        setTeamMessages(
          snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
            timestamp: d.data().createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
          }))
        );
      },
      (err) => {
        console.error('Messages listener error:', err);
        setError('Failed to load team messages.');
      }
    );

    // Cleanup on unmount or user change
    return () => {
      if (unsubTeams.current) unsubTeams.current();
      if (unsubRequests.current) unsubRequests.current();
      if (unsubMessages.current) unsubMessages.current();
    };
  }, [user]);



  // ─── CRUD: Create Team ──────────────────────────────────────────────────────
  const createTeam = useCallback(async (teamData) => {
    if (!user) return;
    try {
      const docRef = await addDoc(collection(db, 'teams'), {
        ownerId: currentUserId,
        name: teamData.name,
        description: teamData.description || '',
        category: teamData.category || 'General',
        maxMembers: teamData.maxMembers || 5,
        requiredSkills: teamData.requiredSkills || [],
        status: 'recruiting',
        visibility: teamData.visibility || 'Public',
        logo: teamData.logo || null,
        members: [currentUserId],
        createdAt: serverTimestamp(),
      });

      addActivity({
        category: 'Teams',
        type: 'created_team',
        title: `Created Team: ${teamData.name}`,
        description: teamData.category || 'General',
        iconType: 'Users',
        color: 'bg-indigo-50 text-[#6C4CF1]',
      });

      toast.success('Team created!');
      return { id: docRef.id, ...teamData };
    } catch (err) {
      console.error('Failed to create team:', err);
      setError('Failed to create team.');
      toast.error('Failed to create team.');
      throw err;
    }
  }, [user, currentUserId, addActivity]);

  // ─── CRUD: Join Team (send request) ────────────────────────────────────────
  const joinTeam = useCallback(async (teamId, message = "I would love to join your team!") => {
    if (!user) return;

    // Prevent duplicate pending requests
    const alreadyPending = joinRequests.some(
      (r) => r.teamId === teamId && r.userId === currentUserId && r.status === 'pending'
    );
    if (alreadyPending) {
      toast('You already have a pending request for this team.', { icon: '⏳' });
      return;
    }

    try {
      await addDoc(collection(db, 'team_requests'), {
        teamId,
        userId: currentUserId,
        userName: currentUserName,
        message,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      toast.success('Join request sent!');
    } catch (err) {
      console.error('Error joining team:', err);
      setError('Could not send join request.');
      toast.error('Could not send join request.');
      throw err;
    }
  }, [user, currentUserId, currentUserName, joinRequests]);

  // ─── CRUD: Accept Join Request ──────────────────────────────────────────────
  const acceptRequest = useCallback(async (requestId) => {
    if (!user) return;
    const req = joinRequests.find((r) => r.id === requestId);
    if (!req) return;

    try {
      // Add user to team members array
      await updateDoc(doc(db, 'teams', req.teamId), {
        members: arrayUnion(req.userId),
      });

      // Delete the request document
      await deleteDoc(doc(db, 'team_requests', requestId));

      toast.success('Member accepted!');
    } catch (err) {
      console.error('Accept request failed:', err);
      setError('Failed to accept request.');
      toast.error('Failed to accept request.');
    }
  }, [user, joinRequests]);

  // ─── CRUD: Reject Join Request ──────────────────────────────────────────────
  const rejectRequest = useCallback(async (requestId) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'team_requests', requestId));
      toast.success('Request rejected.');
    } catch (err) {
      console.error('Reject request failed:', err);
      setError('Failed to reject request.');
      toast.error('Failed to reject request.');
    }
  }, [user]);

  // ─── CRUD: Send Team Message ────────────────────────────────────────────────
  const sendTeamMessage = useCallback(async (teamId, content) => {
    if (!user || !content?.trim()) return;
    try {
      await addDoc(collection(db, 'team_messages'), {
        teamId,
        senderId: currentUserId,
        senderName: currentUserName,
        content: content.trim(),
        createdAt: serverTimestamp(),
      });
      markTeamAsRead(teamId);
    } catch (err) {
      console.error('Failed to send team message:', err);
      setError('Failed to send message.');
      toast.error('Failed to send message.');
    }
  }, [user, currentUserId, currentUserName]);

  // ─── Mark team chat as read ─────────────────────────────────────────────────
  const markTeamAsRead = useCallback((teamId) => {
    setTeamLastRead((prev) => ({ ...prev, [teamId]: new Date().toISOString() }));
  }, []);

  // ─── Derived selectors ──────────────────────────────────────────────────────
  const getMyTeams = useCallback(() => {
    if (!currentUserId) return [];
    return (teams || []).filter((t) => Array.isArray(t.members) && t.members.includes(currentUserId));
  }, [teams, currentUserId]);

  const getMyPendingRequests = useCallback(() => {
    if (!currentUserId) return [];
    return joinRequests.filter((r) => r.userId === currentUserId && r.status === 'pending');
  }, [joinRequests, currentUserId]);

  const getDiscoverTeams = useCallback(() => {
    if (!currentUserId) return teams;
    return (teams || []).filter((t) => !(Array.isArray(t.members) && t.members.includes(currentUserId)));
  }, [teams, currentUserId]);

  // teamsTotal mirrors real-time team count from Firestore
  const teamsTotal = (teams || []).length;

  // fetchTeams is a no-op stub kept for backward API compatibility with consuming components
  // Real data now flows via onSnapshot — no manual fetch needed.
  const fetchTeams = useCallback(() => { }, []);

  return (
    <TeamContext.Provider
      value={{
        teams,
        teamsTotal,
        joinRequests,
        teamMessages,
        teamLastRead,
        loading,
        error,
        fetchTeams,
        createTeam,
        joinTeam,
        acceptRequest,
        rejectRequest,
        sendTeamMessage,
        markTeamAsRead,
        getMyTeams,
        getMyPendingRequests,
        getDiscoverTeams,
        currentUserId,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
};
