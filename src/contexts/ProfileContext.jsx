import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, onSnapshot, setDoc, getDoc, arrayUnion } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const ProfileContext = createContext({});

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const docRef = doc(db, 'users', user.uid);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      } else {
        setProfile(null);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error in profile snapshot:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const updateProfile = async (updates) => {
    if (!user) return { error: 'No user logged in' };
    
    try {
      // Optimistic update handled locally if needed, but snapshot triggers quickly
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      return { data: { ...profile, ...updates }, error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
      return { data: null, error };
    }
  };

  const mergeProfileData = async (updates) => {
    if (!user) return { error: 'No user logged in' };
    try {
      const docRef = doc(db, 'users', user.uid);
      const parsedUpdates = { ...updates, updatedAt: new Date().toISOString() };
      
      // Handle array merging (e.g. appending new missing skills or extracted skills)
      if (updates.extractedSkills && Array.isArray(updates.extractedSkills)) {
        parsedUpdates.extractedSkills = arrayUnion(...updates.extractedSkills);
      }
      if (updates.missingSkills && Array.isArray(updates.missingSkills)) {
        parsedUpdates.missingSkills = arrayUnion(...updates.missingSkills);
      }
      
      await setDoc(docRef, parsedUpdates, { merge: true });
      return { error: null };
    } catch (error) {
      console.error('Error merging profile data:', error);
      return { error };
    }
  };

  // Function to fetch any user's profile by ID
  const fetchUserProfile = async (userId) => {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { data: docSnap.data(), error: null };
      } else {
        return { data: null, error: new Error('Profile not found') };
      }
    } catch (err) {
      return { data: null, error: err };
    }
  };

  return (
    <ProfileContext.Provider value={{ 
      profile, 
      loading, 
      updateProfile,
      mergeProfileData,
      fetchUserProfile 
    }}>
      {children}
    </ProfileContext.Provider>
  );
};

