/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { auth, googleProvider, db } from '../config/firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut as firebaseSignOut, updateProfile as updateFirebaseAuthProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const unsubscribeFirebase = onAuthStateChanged(auth, async (user) => {
      if (isMounted) {
        setFirebaseUser(user);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribeFirebase();
    };
  }, []);

  const initFirestoreProfile = async (user, additionalData = {}) => {
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await setDoc(userRef, newProfile, { merge: true });
    }
  };

  // Firebase Email/Password login
  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result;
  };

  // Firebase Email/Password signup
  const signup = async (email, password, name, userType = 'student') => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateFirebaseAuthProfile(result.user, { displayName: name });
    await initFirestoreProfile(result.user, { name, userType });
    return result;
  };

  const logout = async () => {
    await firebaseSignOut(auth);
  };

  const loginWithGoogle = async (onPopupResolved) => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (onPopupResolved) onPopupResolved();
      await initFirestoreProfile(result.user, { userType: 'student' });
      return result;
    } catch (error) {
      throw error;
    }
  };

  const updateUser = async (newUserData) => {
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
  };

  const isEmployer = false; // We can resolve this from Firestore if needed in the future

  const mappedUser = useMemo(() => {
    if (firebaseUser) {
      const canonicalId = firebaseUser.uid;
      return {
        id: canonicalId,
        uid: canonicalId,
        email: firebaseUser.email,
        name: firebaseUser.displayName || 'User',
        photoURL: firebaseUser.photoURL,
        user_type: 'student' 
      };
    }
    return null;
  }, [firebaseUser]);

  return (
    <AuthContext.Provider value={{ 
      user: mappedUser, 
      session: null, // Removed supabase session
      isAuthenticated: !!mappedUser,
      loading, 
      isEmployer,
      login, 
      signup, 
      logout, 
      updateUser,
      loginWithGoogle
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

