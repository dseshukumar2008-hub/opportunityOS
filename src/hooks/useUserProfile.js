import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const profileCache = new Map();

export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(profileCache.get(user?.id) || null);
  const [isLoading, setIsLoading] = useState(!profileCache.has(user?.id));

  useEffect(() => {
    if (!user?.id) {
// eslint-disable-next-line react-hooks/set-state-in-effect
      setProfile(null);
      setIsLoading(false);
      return;
    }

    if (!profileCache.has(user.id)) {
      setIsLoading(true);
    }

    const docRef = doc(db, 'users', user.id);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          profileCache.set(user.id, data);
          setProfile(data);
        } else {
          setProfile(null);
        }
        setIsLoading(false);
      },
      (err) => {
        console.error("Error subscribing to user profile:", err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.id]);

  const updateCache = (newProfile) => {
    if (user?.id) {
      profileCache.set(user.id, newProfile);
      setProfile(newProfile);
    }
  };

  return { profile, isLoading, updateCache };
}
