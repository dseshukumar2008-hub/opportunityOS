/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { auth, googleProvider, db } from '../config/firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut as firebaseSignOut, updateProfile as updateFirebaseAuthProfile } from 'firebase/auth';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [firestoreProfile, setFirestoreProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let unsubscribeFirestore = null;

    const unsubscribeFirebase = onAuthStateChanged(auth, (user) => {
      if (isMounted) {
        setFirebaseUser(user);
        if (user) {
          if (unsubscribeFirestore) unsubscribeFirestore();
          unsubscribeFirestore = onSnapshot(doc(db, 'users', user.uid), (snap) => {
            if (isMounted) {
              setFirestoreProfile(snap.exists() ? snap.data() : null);
              setLoading(false);
            }
          }, (err) => {
            console.error('AuthContext profile snapshot error:', err);
            if (isMounted) {
              setFirestoreProfile(null);
              setLoading(false);
            }
          });
        } else {
          if (unsubscribeFirestore) {
            unsubscribeFirestore();
            unsubscribeFirestore = null;
          }
          setFirestoreProfile(null);
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribeFirebase();
      if (unsubscribeFirestore) unsubscribeFirestore();
    };
  }, []);

  const initFirestoreProfile = useCallback(async (user, additionalData = {}) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      const newProfile = {
        uid: user.uid,
        email: user.email,
        name: user.displayName || additionalData.name || 'User',
        photoURL: user.photoURL || null,
        user_type: additionalData.userType || 'student',
        onboardingCompleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await setDoc(userRef, newProfile, { merge: true });
    }
  }, []);

  // Firebase Email/Password login
  const login = useCallback(async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    // Heal missing profile if signup was interrupted previously
    await initFirestoreProfile(result.user);
    return result;
  }, [initFirestoreProfile]);

  // Firebase Email/Password signup
  const signup = useCallback(async (email, password, name, userType = 'student') => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateFirebaseAuthProfile(result.user, { displayName: name });
    await initFirestoreProfile(result.user, { name, userType });
    return result;
  }, [initFirestoreProfile]);

  const logout = useCallback(async () => {
    // Clear user-specific cached local storage before signing out to prevent cross-user data leakage
    try {
      localStorage.removeItem('resumeData');
      localStorage.removeItem('resumeAnalyzerTab');
      localStorage.removeItem('resumeAnalyzerShowResults');
      
      // Clear any cached snapshots dynamically
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('resume_snapshots_') || key.startsWith('github_') || key.startsWith('resume_analysis_') || key.startsWith('gemini_'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));

      // Clear all session storage which contains gemini fallback and skill gap analysis state
      sessionStorage.clear();
    } catch (e) {
      console.warn('Failed to clear local/session storage during logout', e);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('oppOs_logout'));
    }
    
    await firebaseSignOut(auth);
  }, []);

  const loginWithGoogle = useCallback(async (onPopupResolved) => {
    const result = await signInWithPopup(auth, googleProvider);
    if (onPopupResolved) onPopupResolved();
    await initFirestoreProfile(result.user, { userType: 'student' });
    return result;
  }, [initFirestoreProfile]);

  const updateUser = useCallback(async (newUserData) => {
    if (!firebaseUser) throw new Error('No active user');
    // For Firebase Auth, if they want to update email/password we use specific methods.
    // We assume updating profile data goes to Firestore, which is handled via ProfileContext.
    // Update Auth Profile:
    if (newUserData.name || newUserData.photoURL) {
      await updateFirebaseAuthProfile(firebaseUser, {
        displayName: newUserData.name || firebaseUser.displayName,
        photoURL: newUserData.photoURL || firebaseUser.photoURL
      });
    }
    return { user: firebaseUser };
  }, [firebaseUser]);

  const isEmployer = false; // We can resolve this from Firestore if needed in the future

  const mappedUser = useMemo(() => {
    if (firebaseUser) {
      const canonicalId = firebaseUser.uid;
      return {
        id: canonicalId,
        uid: canonicalId,
        email: firebaseUser.email,
        name: firebaseUser.displayName || firestoreProfile?.name || 'User',
        photoURL: firebaseUser.photoURL || firestoreProfile?.photoURL || null,
        user_type: firestoreProfile?.user_type || 'student'
      };
    }
    return null;
  }, [firebaseUser, firestoreProfile]);

  const contextValue = useMemo(() => ({
    user: mappedUser, 
    session: null,
    isAuthenticated: !!mappedUser,
    loading: loading, 
    isEmployer,
    login, 
    signup, 
    logout, 
    updateUser,
    loginWithGoogle
  }), [mappedUser, loading, isEmployer, login, signup, logout, updateUser, loginWithGoogle]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

