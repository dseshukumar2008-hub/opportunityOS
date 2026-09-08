const isValidString = (val) => typeof val === 'string' && val.trim().length > 0;

const isValidEducation = (item) => isValidString(item.degree) && isValidString(item.school);
const isValidProject = (item) => isValidString(item.title) && isValidString(item.description) && isValidString(item.techStack);
const isValidExperience = (item) => isValidString(item.company) && isValidString(item.role) && isValidString(item.responsibilities);
const isValidCertOrWorkshop = (item) => isValidString(item.title) && isValidString(item.issuer);

export const getResumeStrength = (resumeData) => {
  let score = 0;
  const pi = resumeData.personalInfo || {};
  
  if (isValidString(pi.fullName)) score += 5;
  if (isValidString(pi.email)) score += 5;
  if (isValidString(pi.phone)) score += 5;
  if (isValidString(pi.location)) score += 5;
  if (isValidString(pi.linkedin)) score += 5;
  if (isValidString(pi.github) || isValidString(pi.portfolio)) score += 5;
  
  const validEdu = (resumeData.education || []).filter(isValidEducation);
  if (validEdu.length > 0) score += 20;

  const validSkills = (resumeData.skills || []).filter(isValidString);
  if (validSkills.length > 3) score += 15;
  else if (validSkills.length > 0) score += 5;

  const validProjects = (resumeData.projects || []).filter(isValidProject);
  if (validProjects.length > 1) score += 15;
  else if (validProjects.length > 0) score += 10;

  const validExp = (resumeData.experience || []).filter(isValidExperience);
  if (validExp.length > 0) score += 15;

  const validCerts = (resumeData.certifications || []).filter(isValidCertOrWorkshop);
  if (validCerts.length > 0) score += 5;

  return Math.min(score, 100);
};

export const validateSection = (section, resumeData) => {
  if (section === 'Personal Info') {
    const info = resumeData.personalInfo || {};
    return isValidString(info.fullName) && isValidString(info.email) && isValidString(info.phone) && isValidString(info.location);
  }
  if (section === 'Summary') {
    return isValidString(resumeData.personalInfo?.summary);
  }
  if (section === 'Education') {
    const items = resumeData.education || [];
    return items.length > 0 && items.every(isValidEducation);
  }
  if (section === 'Skills') {
    const items = resumeData.skills || [];
    return items.length > 0 && items.some(isValidString);
  }
  if (section === 'Projects') {
    const items = resumeData.projects || [];
    return items.length > 0 && items.every(isValidProject);
  }
  if (section === 'Experience') {
    const items = resumeData.experience || [];
    return items.length > 0 && items.every(isValidExperience);
  }
  if (section === 'Certifications') {
    const items = resumeData.certifications || [];
    return items.length > 0 && items.every(isValidCertOrWorkshop);
  }
  if (section === 'Workshops') {
    const items = resumeData.workshops || [];
    return items.length > 0 && items.every(isValidCertOrWorkshop);
  }
  return false;
};
