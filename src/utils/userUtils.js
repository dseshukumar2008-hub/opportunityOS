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
    // Try to extract a clean first name from email by removing numbers/symbols
    const namePart = user.email.split('@')[0].split(/[\._0-9]/)[0];
    if (namePart && namePart.length > 1) {
      return namePart.charAt(0).toUpperCase() + namePart.slice(1).toLowerCase();
    }
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
    const namePart = user.email.split('@')[0].split(/[\._0-9]/)[0];
    if (namePart && namePart.length > 1) {
      return namePart.charAt(0).toUpperCase() + namePart.slice(1).toLowerCase();
    }
  }
  return 'User'; // Generic fallback
};
