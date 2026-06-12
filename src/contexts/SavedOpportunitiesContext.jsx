/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useActivity } from './ActivityContext';
import { useAuth } from './AuthContext';
import { db } from '../config/firebase';
import {
  collection, query, where, onSnapshot,
  setDoc, deleteDoc, doc, serverTimestamp
} from 'firebase/firestore';

const SavedOpportunitiesContext = createContext(null);

export function SavedOpportunitiesProvider({ children }) {
  const { addActivity } = useActivity();
  const { user } = useAuth();
  const [savedOpportunities, setSavedOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Realtime listener — automatically updates across all devices
  useEffect(() => {
    if (!user) {
      setSavedOpportunities([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'saved_opportunities'),
      where('uid', '==', user.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const saved = snapshot.docs.map(d => ({ _docId: d.id, ...d.data() }));
      setSavedOpportunities(saved);
      setLoading(false);
    }, (err) => {
      console.error('SavedOpportunities onSnapshot error:', err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const isSaved = useCallback((opportunityOrId) => {
    if (!opportunityOrId) return false;
    const id = typeof opportunityOrId === 'object' 
      ? (opportunityOrId.opportunityId || opportunityOrId.id) 
      : opportunityOrId;
    return savedOpportunities.some(opp => opp.opportunityId === id);
  }, [savedOpportunities]);

  const getDocId = useCallback((opportunityId) => {
    return user ? `${user.id}_${opportunityId}` : null;
  }, [user]);

  const getSavedOpportunities = useCallback(() => {
    return savedOpportunities;
  }, [savedOpportunities]);

  const saveOpportunity = useCallback(async (opportunity) => {
    if (!user) { toast.error('Sign in to save opportunities.'); return; }
    
    const oppId = opportunity.opportunityId || opportunity.id;
    if (!oppId) return;
    if (isSaved(oppId)) return;

    try {
      const docId = getDocId(oppId);
      await setDoc(doc(db, 'saved_opportunities', docId), {
        uid: user.id,
        opportunityId: oppId,
        title: opportunity.title || opportunity.role || '',
        company: opportunity.company || '',
        source: opportunity.source || '',
        url: opportunity.url || opportunity.applyLink || '',
        type: opportunity.type || '',
        savedAt: serverTimestamp(),
      });

      addActivity({
        category: 'Opportunities',
        type: 'saved',
        title: `Saved ${opportunity.role || opportunity.title || 'Opportunity'}`,
        description: `At ${opportunity.company || 'Company'}`,
        iconType: 'Briefcase',
        color: 'bg-indigo-50 text-[#6C4CF1]'
      });
    } catch (err) {
      console.error('Failed to save opportunity:', err);
      toast.error('Failed to save. Please try again.');
    }
  }, [user, isSaved, addActivity, getDocId]);

  const removeSavedOpportunity = useCallback(async (opportunityOrId) => {
    if (!user) return;
    
    const oppId = typeof opportunityOrId === 'object' 
      ? (opportunityOrId.opportunityId || opportunityOrId.id) 
      : opportunityOrId;
      
    if (!oppId) return;

    const docId = getDocId(oppId);
    if (!docId) return;
    
    try {
      await deleteDoc(doc(db, 'saved_opportunities', docId));
    } catch (err) {
      console.error('Failed to remove saved opportunity:', err);
      toast.error('Failed to unsave. Please try again.');
    }
  }, [user, getDocId]);

  const toggleSavedOpportunity = useCallback(async (opportunity) => {
    const oppId = opportunity.opportunityId || opportunity.id;
    if (isSaved(oppId)) {
      await removeSavedOpportunity(oppId);
      toast.success('Removed from Saved');
    } else {
      await saveOpportunity(opportunity);
      toast.success('Saved Successfully');
    }
  }, [isSaved, saveOpportunity, removeSavedOpportunity]);

  return (
    <SavedOpportunitiesContext.Provider value={{
      savedOpportunities,
      loading,
      getSavedOpportunities,
      saveOpportunity,
      removeSavedOpportunity,
      toggleSavedOpportunity,
      isSaved
    }}>
      {children}
    </SavedOpportunitiesContext.Provider>
  );
}

export function useSavedOpportunities() {
  const context = useContext(SavedOpportunitiesContext);
  if (!context) {
    throw new Error('useSavedOpportunities must be used within a SavedOpportunitiesProvider');
  }
  return context;
}
