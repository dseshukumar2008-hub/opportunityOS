/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { useActivity } from './ActivityContext';
import {
  collection,
  addDoc,
  query,
// eslint-disable-next-line no-unused-vars
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
// eslint-disable-next-line no-unused-vars
  writeBatch,
  // eslint-disable-next-line no-unused-vars
  getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import toast from 'react-hot-toast';

const TeamContext = createContext(null);

export const TeamProvider = ({ children }) => {
  const { user } = useAuth();
  const { addActivity } = useActivity();

  const currentUserId = user?.id || user?.uid || null;
  
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Refs to hold unsubscribe functions for cleanup
  const unsubTeams = useRef(null);

  // 
  useEffect(() => {
    // Clean up previous listeners
    if (unsubTeams.current) unsubTeams.current();

    if (!user) {
// eslint-disable-next-line react-hooks/set-state-in-effect
      setTeams([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    // Teams listener
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
          createdAt: d.data().createdAt?.toMillis?.() ?? Date.now() }));
        setTeams(fetchedTeams);
        setLoading(false);
      },
      (err) => {
        console.error('Teams listener error:', err);
        setError('Failed to load teams.');
        setLoading(false);
      }
    );

    // Cleanup on unmount or user change
    return () => {
      if (unsubTeams.current) unsubTeams.current();
    };
  }, [currentUserId]);



  // 
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
        createdAt: serverTimestamp() });

      addActivity({
        category: 'Teams',
        type: 'created_team',
        title: `Created Team: ${teamData.name}`,
        description: teamData.category || 'General',
        iconType: 'Users',
        color: 'bg-indigo-50 text-primary' });

      toast.success('Team created!');
      return { id: docRef.id, ...teamData };
    } catch (err) {
      console.error('Failed to create team:', err);
      setError('Failed to create team.');
      toast.error('Failed to create team.');
      throw err;
    }
  }, [user, currentUserId, addActivity]);

  const getMyTeams = useCallback(() => {
    if (!currentUserId) return [];
    return (teams || []).filter((t) => Array.isArray(t.members) && t.members.includes(currentUserId));
  }, [teams, currentUserId]);

  const getDiscoverTeams = useCallback(() => {
    if (!currentUserId) return teams;
    return (teams || []).filter((t) => !(Array.isArray(t.members) && t.members.includes(currentUserId)));
  }, [teams, currentUserId]);

  // teamsTotal mirrors real-time team count from Firestore
  const teamsTotal = (teams || []).length;

  // fetchTeams is a no-op stub kept for backward API compatibility with consuming components
  // Real data now flows via onSnapshot — no manual fetch needed.
  const fetchTeams = useCallback(() => { }, []);

  const contextValue = useMemo(() => ({
    teams,
    teamsTotal,
    loading,
    error,
    fetchTeams,
    createTeam,
    getMyTeams,
    getDiscoverTeams,
    currentUserId }), [teams, teamsTotal, loading, error, fetchTeams, createTeam, getMyTeams, getDiscoverTeams, currentUserId]);

  return (
    <TeamContext.Provider value={contextValue}>
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
