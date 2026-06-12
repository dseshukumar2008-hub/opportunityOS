import { useEffect, useMemo, useState } from 'react';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

export function normalizeUserProfile(raw = {}, fallbackId = '') {
  const id = raw.id || raw.uid || raw.userId || fallbackId;
  const name =
    raw.name ||
    raw.fullName ||
    raw.full_name ||
    raw.displayName ||
    raw.email ||
    id ||
    'OpportunityOS User';

  const education = Array.isArray(raw.education) ? raw.education[0] : null;
  const socialLinks = raw.socialLinks || {};

  return {
    ...raw,
    id,
    uid: raw.uid || id,
    name,
    fullName: raw.fullName || raw.full_name || name,
    headline: raw.headline || raw.title || 'OpportunityOS User',
    college: raw.college || education?.institution || '',
    branch: raw.branch || raw.degree || education?.field || '',
    gradYear: raw.gradYear || raw.expectedGraduation || education?.endYear || '',
    skills: Array.isArray(raw.skills) ? raw.skills : [],
    avatarSeed: raw.avatarSeed || raw.photoURL || raw.photo_url || name,
    photoURL: raw.photoURL || raw.photo_url || raw.avatarUrl || raw.avatar_url || '',
    linkedin: raw.linkedin || socialLinks.linkedin || '',
    github: raw.github || socialLinks.github || '',
    portfolio: raw.portfolio || socialLinks.portfolio || '',
    location: raw.location || '',
    bio: raw.bio || '',
    discoverable: raw.discoverable !== false,
  };
}

export function createFallbackUserProfile(id) {
  return normalizeUserProfile({
    id,
    name: id || 'OpportunityOS User',
    headline: 'OpportunityOS User',
    discoverable: true,
  }, id);
}

export function useUserDirectory() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        setUsers(snapshot.docs.map((d) => normalizeUserProfile({ id: d.id, ...d.data() }, d.id)));
        setError(null);
        setLoading(false);
      },
      (err) => {
        console.error('User directory listener error:', err);
        setUsers([]);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const usersById = useMemo(() => {
    const map = new Map();
    users.forEach((user) => map.set(user.id, user));
    return map;
  }, [users]);

  return { users, usersById, loading, error };
}

export function useUserProfileRecord(userId) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(Boolean(userId));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId || userId === 'me') {
      setProfile(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(
      doc(db, 'users', userId),
      (snapshot) => {
        setProfile(snapshot.exists() ? normalizeUserProfile({ id: snapshot.id, ...snapshot.data() }, snapshot.id) : null);
        setError(null);
        setLoading(false);
      },
      (err) => {
        console.error('User profile listener error:', err);
        setProfile(null);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { profile, loading, error };
}
