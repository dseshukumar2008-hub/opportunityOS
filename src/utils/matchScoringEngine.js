export const calculateMatchScore = (resumeData, opportunityReqs) => {
  // Phase 1: Skill Normalization
  const skillSynonyms = {
    'oop concepts': 'object-oriented programming',
    'oop': 'object-oriented programming',
    'react js': 'react',
    'react.js': 'react',
    'js': 'javascript',
    'node': 'node.js',
    'restful apis': 'rest apis',
    'problem analysis': 'analytical skills',
    'logical thinking': 'analytical skills',
    'git & github': 'git',
    'github': 'git',
    'dbms': 'database management systems',
    'sql databases': 'sql',
    'data structures & algorithms': 'dsa',
    'data structures and algorithms': 'dsa'
  };

  const normalize = (str) => {
    if (typeof str !== 'string') return '';
    const lower = str.toLowerCase().trim();
    return skillSynonyms[lower] || lower;
  };

  // Collect and normalize all skills from resume
  const rawResumeSkills = [
    ...(resumeData?.skills || []),
    ...(resumeData?.extractedSkills || [])
  ];
  
  const resumeSkillsNorm = rawResumeSkills.map(normalize);
  const resumeTextBlob = JSON.stringify(resumeData || {}).toLowerCase();

  const reqSkills = opportunityReqs.requiredSkills || [];
  let skillsScore = 0;
  const strengths = [];
  const missingSkills = [];
  const recommendations = [];

  // Phase 6: Console Logs
  console.log('Resume Skills:', resumeSkillsNorm);
  console.log('Opportunity Skills:', reqSkills);

  // 1. Skills Match (50%)
  reqSkills.forEach(req => {
    const normReq = normalize(req);
    
    // Check if the required skill is exactly in the normalized skills array
    const foundInSkillsArray = resumeSkillsNorm.some(s => s === normReq || s.includes(normReq) || normReq.includes(s));
    
    // Check if the required skill is mentioned anywhere in the resume text
    const foundInText = resumeTextBlob.includes(req.toLowerCase()) || resumeTextBlob.includes(normReq);

    if (foundInSkillsArray) {
      const matchWord = rawResumeSkills.find(r => normalize(r) === normReq || normalize(r).includes(normReq) || normReq.includes(normalize(r))) || req;
      strengths.push({ 
        name: req, 
        evidence: {
          opportunity: req,
          resume: matchWord
        }
      });
      skillsScore += 1;
    } else if (foundInText) {
      strengths.push({ 
        name: req, 
        evidence: {
          opportunity: req,
          resume: `Found in text: "${req}"`
        }
      });
      skillsScore += 1;
    } else {
      missingSkills.push({ 
        name: req, 
        evidence: {
          opportunity: req,
          resume: 'Not detected'
        }
      });
      
      const impact = Math.max(1, Math.round(50 / reqSkills.length));
      
      recommendations.push({
        category: 'Skill Gap',
        priority: 'High',
        matchImpact: `+${impact}%`,
        issue: `Missing required skill: ${req}`,
        evidence: {
          opportunity: req,
          resume: 'Not detected'
        },
        recommendedAction: `Add ${req} to your skills section if you possess this skill, or begin learning it.`
      });
    }
  });

  const skillsPercentage = reqSkills.length > 0 ? (skillsScore / reqSkills.length) : 1;

  // 2. Keywords Match (10%)
  const reqKeywords = opportunityReqs.tools || opportunityReqs.requiredKeywords || [];
  let keywordsScore = 0;

  reqKeywords.forEach(kw => {
    if (resumeTextBlob.includes(kw.toLowerCase())) {
      keywordsScore += 1;
      strengths.push({
        name: kw,
        evidence: {
          opportunity: kw,
          resume: `Found keyword: "${kw}"`
        }
      });
    } else {
      missingSkills.push({
        name: kw,
        evidence: {
          opportunity: kw,
          resume: 'Not detected'
        }
      });
      
      const impact = Math.max(1, Math.round(10 / reqKeywords.length));
      recommendations.push({
        category: 'Keyword Optimization',
        priority: 'Medium',
        matchImpact: `+${impact}%`,
        issue: `Missing keyword: ${kw}`,
        evidence: {
          opportunity: kw,
          resume: 'Not detected'
        },
        recommendedAction: `Integrate the keyword "${kw}" naturally into your experience or project descriptions.`
      });
    }
  });
  
  const keywordsPercentage = reqKeywords.length > 0 ? (keywordsScore / reqKeywords.length) : 1;

  // 3. Projects Match (20%)
  const hasProjects = (resumeData?.projects && resumeData.projects.length > 0);
  
  // Deterministic local logic to check if projects are required
  const textBlob = (opportunityReqs.opportunityText || '').toLowerCase();
  const requiresProjects = opportunityReqs.requiresProjects !== undefined 
    ? opportunityReqs.requiresProjects 
    : (textBlob.includes('portfolio') || textBlob.includes('project') || textBlob.includes('github'));

  let projectsPercentage = 1;
  if (requiresProjects) {
    projectsPercentage = hasProjects ? 1 : 0;
    if (!hasProjects) {
      missingSkills.push({ 
        name: 'Portfolio/Projects', 
        evidence: {
          opportunity: 'Projects Required',
          resume: 'Not detected'
        }
      });
      recommendations.push({
        category: 'Experience Validation',
        priority: 'High',
        matchImpact: `+20%`,
        issue: `Missing Portfolio/Projects`,
        evidence: {
          opportunity: 'Requires Portfolio',
          resume: 'No projects section found'
        },
        recommendedAction: `Add a Projects section demonstrating practical application of your skills.`
      });
    } else {
      strengths.push({ 
        name: 'Portfolio/Projects', 
        evidence: {
          opportunity: 'Projects Required',
          resume: 'Projects section found'
        }
      });
    }
  }

  // 4. Experience Match (15%)
  let resumeYears = 0;
  if (resumeData?.experience && resumeData.experience.length > 0) {
    resumeYears = resumeData.experience.length; // Heuristic
  }
  let expPercentage = 1;
  if (opportunityReqs.requiredExperienceYears > 0) {
    expPercentage = Math.min(resumeYears / opportunityReqs.requiredExperienceYears, 1);
    if (expPercentage < 1) {
      missingSkills.push({ 
        name: `Experience (${opportunityReqs.requiredExperienceYears} years)`, 
        evidence: {
          opportunity: `${opportunityReqs.requiredExperienceYears} years`,
          resume: `${resumeYears} years detected`
        }
      });
      const lostExp = 15 - (expPercentage * 15);
      recommendations.push({
        category: 'Experience Gap',
        priority: 'Medium',
        matchImpact: `+${Math.round(lostExp)}%`,
        issue: `Short on required experience`,
        evidence: {
          opportunity: `${opportunityReqs.requiredExperienceYears} years`,
          resume: `${resumeYears} years detected`
        },
        recommendedAction: `Highlight academic projects, internships, or open-source contributions to offset formal experience gaps.`
      });
    } else {
      strengths.push({ 
        name: `Experience (${opportunityReqs.requiredExperienceYears} years)`, 
        evidence: {
          opportunity: `${opportunityReqs.requiredExperienceYears} years`,
          resume: `${resumeYears} years detected`
        }
      });
    }
  }

  // 5. Education Match (5%)
  let eduPercentage = 1;
  if (opportunityReqs.requiredEducation) {
    const hasEdu = resumeData?.education && resumeData.education.length > 0;
    eduPercentage = hasEdu ? 1 : 0;
    if (!hasEdu) {
      missingSkills.push({ 
        name: `Education: ${opportunityReqs.requiredEducation}`, 
        evidence: {
          opportunity: opportunityReqs.requiredEducation,
          resume: `Not detected`
        }
      });
      recommendations.push({
        category: 'Education Gap',
        priority: 'Medium',
        matchImpact: `+5%`,
        issue: `Missing Education details`,
        evidence: {
          opportunity: opportunityReqs.requiredEducation,
          resume: `No education section found`
        },
        recommendedAction: `Add your formal education or current degree program to your profile.`
      });
    } else {
      strengths.push({ 
        name: `Education: ${opportunityReqs.requiredEducation}`, 
        evidence: {
          opportunity: opportunityReqs.requiredEducation,
          resume: `Education section found`
        }
      });
    }
  }

  // Phase 2: Final deterministic score calculation
  const currentMatchScore = Math.round(
    (skillsPercentage * 50) +
    (keywordsPercentage * 10) +
    (projectsPercentage * 20) +
    (expPercentage * 15) +
    (eduPercentage * 5)
  );

  const potentialMatchScore = Math.round(
    (1.0 * 50) + // Assume max skills
    (1.0 * 10) + // Assume max keywords
    (projectsPercentage * 20) + 
    (expPercentage * 15) +
    (1.0 * 5) // Assume can add education
  );

  // Phase 6 Logging
  console.log('Matched Skills:', strengths.map(s => s.name));
  console.log('Missing Skills:', missingSkills.map(s => s.name));
  
  console.log('Skills Score:', Math.round(skillsPercentage * 50));
  console.log('Projects Score:', Math.round(projectsPercentage * 20));
  console.log('Keyword Score:', Math.round(keywordsPercentage * 10));
  console.log('Experience Score:', Math.round(expPercentage * 15));
  
  console.log('Final Score:', currentMatchScore);

  return {
    currentMatchScore,
    potentialMatchScore: Math.max(currentMatchScore, potentialMatchScore),
    strengths,
    missingSkills,
    recommendations
  };
};
