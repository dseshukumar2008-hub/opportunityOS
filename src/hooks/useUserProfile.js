import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

const profileCache = new Map();
const pendingFetches = new Map();

export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(profileCache.get(user?.id) || null);
  const [isLoading, setIsLoading] = useState(!profileCache.has(user?.id));

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    if (profileCache.has(user.id)) {
      setProfile(profileCache.get(user.id));
      setIsLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        let fetchPromise = pendingFetches.get(user.id);
        if (!fetchPromise) {
          const docRef = doc(db, 'users', user.id);
          fetchPromise = getDoc(docRef);
          pendingFetches.set(user.id, fetchPromise);
        }

        const docSnap = await fetchPromise;
        if (docSnap.exists()) {
          const data = docSnap.data();
          profileCache.set(user.id, data);
          setProfile(data);
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      } finally {
        pendingFetches.delete(user.id);
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const updateCache = (newProfile) => {
    if (user?.id) {
      profileCache.set(user.id, newProfile);
      setProfile(newProfile);
    }
  };

  return { profile, isLoading, updateCache };
}
