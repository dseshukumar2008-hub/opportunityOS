const extractNameFromEmail = (email) => {
  // eslint-disable-next-line no-useless-escape
  const namePart = email.split('@')[0].split(/[\._0-9]/)[0];
  if (namePart && namePart.length > 1) {
    return namePart.charAt(0).toUpperCase() + namePart.slice(1).toLowerCase();
  }
  return null;
};

export const getUserFirstName = (user, profile = null) => {
  if (user?.displayName) {
    return user.displayName; // use the exact displayName
  }
  if (profile?.full_name) {
    return profile.full_name.split(' ')[0];
  }
  if (profile?.name) {
    return profile.name.split(' ')[0];
  }
  if (user?.name) {
    return user.name.split(' ')[0];
  }
  if (user?.email) {
    const extracted = extractNameFromEmail(user.email);
    if (extracted) return extracted;
  }
  return null; // Return null so we can fallback to just "Welcome back! 👋"
};

export const getUserFullName = (user, profile = null) => {
  if (user?.displayName) {
    return user.displayName;
  }
  if (profile?.full_name) {
    return profile.full_name;
  }
  if (profile?.name) {
    return profile.name;
  }
  if (user?.name) {
    return user.name;
  }
  if (user?.email) {
    const extracted = extractNameFromEmail(user.email);
    if (extracted) return extracted;
  }
  return 'User'; // Generic fallback
};

export const calculateProfileCompletion = (profile, hasResume) => {
  const fieldMapping = {
    name: profile?.name || profile?.profile?.fullName,
    email: profile?.email,
    bio: profile?.bio || profile?.about?.bio,
    college: profile?.college || profile?.education?.university,
    branch: profile?.branch || profile?.education?.branch,
    location: profile?.location || profile?.city || profile?.profile?.location || profile?.country
  };

  let filled = 0;
  const missingProfileItems = [];
  Object.entries(fieldMapping).forEach(([field, value]) => {
    if (value) {
      filled++;
    } else {
      missingProfileItems.push(field);
    }
  });
  
  if (!hasResume) missingProfileItems.push('resume');
  if (!profile?.skills || (profile.skills || []).length === 0) missingProfileItems.push('skills');

  const totalFields = Object.keys(fieldMapping).length + 2;
  let totalFilled = filled;
  if (hasResume) totalFilled++;
  if (profile?.skills?.length > 0) totalFilled++;
  
  const percentage = Math.round((totalFilled / totalFields) * 100);

  return { percentage, missingProfileItems };
};
