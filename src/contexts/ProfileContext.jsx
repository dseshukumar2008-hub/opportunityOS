import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const ProfileContext = createContext({});

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const { user, session } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          if (error.code !== 'PGRST116') { // not found error
            console.error('Error fetching profile:', error);
          }
        } else {
          setProfile(data);
        }
      } catch (err) {
        console.error('Error in profile fetch:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, session]);

  const updateProfile = async (updates) => {
    if (!user) return { error: 'No user logged in' };
    
    try {
      // Optimistic update
      setProfile(prev => ({ ...prev, ...updates }));

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setProfile(data);
      return { data, error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
      return { data: null, error };
    }
  };

  // Function to fetch any user's profile by ID
  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  };

  return (
    <ProfileContext.Provider value={{ 
      profile, 
      loading, 
      updateProfile,
      fetchUserProfile 
    }}>
      {children}
    </ProfileContext.Provider>
  );
};
