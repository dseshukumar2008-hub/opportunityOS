import { useProfile } from '../contexts/ProfileContext';

export function useUserProfile() {
  const { profile, loading, updateProfile } = useProfile();

  // Map to the legacy return signature to avoid breaking components that use useUserProfile
  return { 
    profile, 
    isLoading: loading, 
    updateCache: updateProfile // alias for legacy support, though they should transition to updateProfile
  };
}
