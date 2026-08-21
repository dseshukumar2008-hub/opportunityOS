import  { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, onSnapshot, setDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const CareerContext = createContext({});

export const useCareer = () => useContext(CareerContext);

const DEFAULT_STATE = {
  targetRole: '',
  githubScore: 0,
  linkedinScore: 0,
  alignmentScore: 0,
  strengths: [],
  weaknesses: [],
  missingSkills: [],
  missingProjects: [],
  technologyAnalysis: null,
  portfolioDiversity: null
};

export const CareerProvider = ({ children }) => {
  const { user } = useAuth();
  const [careerContext, setCareerContext] = useState(DEFAULT_STATE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
// eslint-disable-next-line react-hooks/set-state-in-effect
      setCareerContext(DEFAULT_STATE);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const docRef = doc(db, 'users', user.id, 'career', 'context');

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setCareerContext({ ...DEFAULT_STATE, ...docSnap.data() });
      } else {
        setCareerContext(DEFAULT_STATE);
      }
      setIsLoading(false);
    }, (error) => {
      console.error('[CareerContext] Real-time Fetch Error:', error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user?.id]);

  const updateCareerContext = async (updates) => {
    if (!user?.id) return;
    try {
      const docRef = doc(db, 'users', user.id, 'career', 'context');
      await setDoc(docRef, updates, { merge: true });
    } catch (error) {
      console.error('[CareerContext] Update Error:', error);
    }
  };

  const clearCareerContext = async () => {
    if (!user?.id) return;
    try {
      const docRef = doc(db, 'users', user.id, 'career', 'context');
      await deleteDoc(docRef);
    } catch (error) {
      console.error('[CareerContext] Clear Error:', error);
    }
  };

  return (
    <CareerContext.Provider value={{ careerContext, updateCareerContext, clearCareerContext, isLoading }}>
      {children}
    </CareerContext.Provider>
  );
};
