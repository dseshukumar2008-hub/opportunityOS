/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { auth, googleProvider } from '../config/firebase';
import { signInWithPopup, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [supabaseUser, setSupabaseUser] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let pendingSupabase = true;
    let pendingFirebase = true;

    const checkLoading = () => {
      if (!pendingSupabase && !pendingFirebase && isMounted) {
        setLoading(false);
      }
    };

    // 1. Supabase Auth Listener
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) {
        setSession(session);
        setSupabaseUser(session?.user ?? null);
        pendingSupabase = false;
        checkLoading();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setSession(session);
        setSupabaseUser(session?.user ?? null);
      }
    });

    // 2. Firebase Auth Listener
    const unsubscribeFirebase = onAuthStateChanged(auth, (user) => {
      if (isMounted) {
        setFirebaseUser(user);
        pendingFirebase = false;
        checkLoading();
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      unsubscribeFirebase();
    };
  }, []);

  // Supabase login
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  // Supabase signup
  const signup = async (email, password, name, userType = 'student') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: name.split(' ')[0],
          last_name: name.split(' ').slice(1).join(' ') || '',
          name: name,
          user_type: userType
        }
      }
    });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    await firebaseSignOut(auth);
    if (error) throw error;
  };

  const loginWithGoogle = async (onPopupResolved) => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (onPopupResolved) onPopupResolved();
      
      const user = result.user;
      
      const profile = {
        id: user.uid,
        name: user.displayName || 'Google User',
        email: user.email,
        photo_url: user.photoURL,
        provider: 'google',
        user_type: 'student', // Default fallback
        created_at: new Date().toISOString(),
      };
      
      await supabase.from('profiles').upsert(profile).select().maybeSingle();

      return result;
    } catch (error) {
      throw error;
    }
  };



  const updateUser = async (newUserData) => {
    const { data, error } = await supabase.auth.updateUser({
      data: newUserData
    });
    if (error) throw error;
    setSupabaseUser(data.user);
    return data;
  };

  const activeUser = supabaseUser || firebaseUser;
  
  // Combine user metadata based on which provider is active
  const isEmployer = supabaseUser?.user_metadata?.user_type === 'employer';

  const mapUser = () => {
    if (supabaseUser) {
      const canonicalId = supabaseUser.id;
      return {
        id: canonicalId,
        uid: canonicalId,
        email: supabaseUser.email,
        name: supabaseUser.user_metadata?.name || 'User',
        ...supabaseUser.user_metadata
      };
    }
    if (firebaseUser) {
      // Find out if it's google or github
      const providerId = firebaseUser.providerData[0]?.providerId || 'firebase';
      const canonicalId = firebaseUser.uid;
      
      return {
        id: canonicalId,
        uid: canonicalId,
        email: firebaseUser.email,
        name: firebaseUser.displayName || 'OAuth User',
        photo_url: firebaseUser.photoURL,
        provider: providerId.replace('.com', ''),
        user_type: 'student' // Defaulting to student for Firebase OAuth
      };
    }
    return null;
  };

  const mappedUser = mapUser();

  return (
    <AuthContext.Provider value={{ 
      user: mappedUser, 
      session, 
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
