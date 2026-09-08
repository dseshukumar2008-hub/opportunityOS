export const parseSkillsString = (skillsStr) => {
  if (!skillsStr || typeof skillsStr !== 'string') return [];
  return skillsStr.split(',').map(s => s.trim()).filter(Boolean);
};

export const formatDateShort = (dateInput) => {
  if (!dateInput) return 'Recently';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return 'Recently';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const getRelativeTime = (timestamp) => {
  const parsed = typeof timestamp === 'number' ? timestamp : new Date(timestamp || 0).getTime();
  if (!parsed || isNaN(parsed)) return 'Recently';
  const diff = Math.floor((Date.now() - parsed) / 60000);
  if (diff < 1) return 'Just now';
  if (diff < 60) return `${diff} min ago`;
  const hours = Math.floor(diff / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};
