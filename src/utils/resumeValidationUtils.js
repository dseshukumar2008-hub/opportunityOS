export const getResumeStrength = (resumeData) => {
  let score = 0;
  const isValidString = (val) => typeof val === 'string' && val.trim().length > 0;
  const pi = resumeData.personalInfo || {};
  
  if (isValidString(pi.fullName)) score += 5;
  if (isValidString(pi.email)) score += 5;
  if (isValidString(pi.phone)) score += 5;
  if (isValidString(pi.location)) score += 5;
  if (isValidString(pi.linkedin)) score += 5;
  if (isValidString(pi.github) || isValidString(pi.portfolio)) score += 5;
  
  const validEdu = (resumeData.education || []).filter(item => isValidString(item.degree) && isValidString(item.school));
  if (validEdu.length > 0) score += 20;

  const validSkills = (resumeData.skills || []).filter(isValidString);
  if (validSkills.length > 3) score += 15;
  else if (validSkills.length > 0) score += 5;

  const validProjects = (resumeData.projects || []).filter(item => isValidString(item.title) && isValidString(item.description) && isValidString(item.techStack));
  if (validProjects.length > 1) score += 15;
  else if (validProjects.length > 0) score += 10;

  const validExp = (resumeData.experience || []).filter(item => isValidString(item.company) && isValidString(item.role) && isValidString(item.responsibilities));
  if (validExp.length > 0) score += 15;

  const validCerts = (resumeData.certifications || []).filter(item => isValidString(item.title) && isValidString(item.issuer));
  if (validCerts.length > 0) score += 5;

  return Math.min(score, 100);
};

export const validateSection = (section, resumeData) => {
  let required = [];
  let filled = [];
  let isComplete = false;

  const isValidString = (val) => typeof val === 'string' && val.trim().length > 0;

  if (section === 'Personal Info') {
    const pi = resumeData.personalInfo || {};
    required = ['fullName', 'email', 'phone', 'location'];
    filled = required.filter(field => isValidString(pi[field]));
    isComplete = filled.length === required.length;
  }
  else if (section === 'Summary') {
    const pi = resumeData.personalInfo || {};
    required = ['summary'];
    filled = required.filter(field => isValidString(pi[field]));
    isComplete = filled.length === required.length;
  }
  else if (section === 'Education') {
    const items = resumeData.education || [];
    required = ['degree', 'school'];
    if (items.length === 0) {
      isComplete = false;
    } else {
      isComplete = items.every(item => isValidString(item.degree) && isValidString(item.school));
      if (items.length > 0) {
        filled = required.filter(field => isValidString(items[0][field]));
      }
    }
  }
  else if (section === 'Skills') {
    const items = resumeData.skills || [];
    required = ['skills'];
    if (items.length > 0 && items.some(isValidString)) {
      filled = ['skills'];
      isComplete = true;
    }
  }
  else if (section === 'Projects') {
    const items = resumeData.projects || [];
    required = ['title', 'description', 'techStack'];
    if (items.length === 0) {
      isComplete = false;
    } else {
      isComplete = items.every(item => isValidString(item.title) && isValidString(item.description) && isValidString(item.techStack));
      if (items.length > 0) {
        filled = required.filter(field => isValidString(items[0][field]));
      }
    }
  }
  else if (section === 'Experience') {
    const items = resumeData.experience || [];
    required = ['company', 'role', 'responsibilities'];
    if (items.length === 0) {
      isComplete = false;
    } else {
      isComplete = items.every(item => isValidString(item.company) && isValidString(item.role) && isValidString(item.responsibilities));
      if (items.length > 0) {
        filled = required.filter(field => isValidString(items[0][field]));
      }
    }
  }
  else if (section === 'Certifications') {
    const items = resumeData.certifications || [];
    required = ['title', 'issuer'];
    if (items.length === 0) {
      isComplete = false;
    } else {
      isComplete = items.every(item => isValidString(item.title) && isValidString(item.issuer));
      if (items.length > 0) {
        filled = required.filter(field => isValidString(items[0][field]));
      }
    }
  }
  else if (section === 'Workshops') {
    const items = resumeData.workshops || [];
    required = ['title', 'issuer'];
    if (items.length === 0) {
      isComplete = false;
    } else {
      isComplete = items.every(item => isValidString(item.title) && isValidString(item.issuer));
      if (items.length > 0) {
        filled = required.filter(field => isValidString(items[0][field]));
      }
    }
  }

  const percentage = required.length > 0 ? Math.round((filled.length / required.length) * 100) : 0;
  
  console.log(`[Resume Builder] Section: ${section} | Required: ${required.join(', ')} | Filled: ${filled.join(', ')} | Completion: ${percentage}%`);

  return isComplete;
};
