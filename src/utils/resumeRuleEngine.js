const SKILL_DICTIONARY = {
  Programming: ['Python', 'Java', 'JavaScript', 'TypeScript', 'C', 'C++', 'C#', 'Ruby', 'Go', 'Rust', 'PHP', 'Swift', 'Kotlin', 'R', 'Dart'],
  Frontend: ['HTML', 'CSS', 'React', 'Angular', 'Vue', 'Next.js', 'Svelte', 'Tailwind', 'Bootstrap', 'Redux', 'Material-UI', 'Framer Motion'],
  Backend: ['Node.js', 'Express', 'Django', 'Flask', 'Spring Boot', 'Laravel', 'Ruby on Rails', 'FastAPI', 'REST', 'GraphQL', 'gRPC'],
  Database: ['MySQL', 'PostgreSQL', 'MongoDB', 'SQLite', 'Firebase', 'Redis', 'Cassandra', 'Oracle', 'SQL Server', 'DynamoDB', 'Elasticsearch'],
  Cloud: ['AWS', 'Azure', 'GCP', 'Heroku', 'DigitalOcean', 'Vercel', 'Netlify', 'Cloudflare', 'EC2', 'S3', 'Lambda'],
  DevOps_Tools: ['Git', 'GitHub', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab', 'Bitbucket', 'Jira', 'Webpack', 'Babel', 'CI/CD', 'GitHub Actions', 'Terraform', 'Ansible'],
  Security_Auth: ['JWT', 'OAuth', 'Authentication', 'Authorization', 'SSL', 'OWASP'],
  Concepts: ['DSA', 'OOP', 'DBMS', 'OS', 'CN', 'Agile', 'Scrum', 'Microservices', 'System Design', 'TDD', 'Design Patterns']
};

export function extractTextMetrics(text) {
  if (!text) return { extractedSkills: [], projectsCount: 0, educationCount: 0, hasGitHub: false, hasPortfolio: false };

  const lowerText = text.toLowerCase();
  
  // 1. Skill Extraction
  const extractedSkills = new Set();
  
  Object.values(SKILL_DICTIONARY).flat().forEach(skill => {
    // Special handling for C++ and C# which are hard to match with \b
    let regex;
    if (skill === 'C++') {
      regex = /(?:^|\s)C\+\+(?:\s|$|[.,])/i;
    } else if (skill === 'C#') {
      regex = /(?:^|\s)C#(?:\s|$|[.,])/i;
    } else if (skill === 'Next.js') {
      regex = /\bnext\.?js\b/i;
    } else if (skill === 'Node.js') {
      regex = /\bnode\.?js\b/i;
    } else {
      regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    }
    
    if (regex.test(text)) {
      extractedSkills.add(skill);
    }
  });

  // 2. Section Detection
  const hasProjects = /\b(projects|personal projects|academic projects)\b/i.test(lowerText);
  // Estimate number of projects by counting occurrences of dates, bullet points, or specific keywords under a "projects" section, but here we'll just check existence and give a baseline count.
  const projectsCount = hasProjects ? 2 : 0; // Baseline assumption for rule engine

  const hasEducation = /\b(education|academic background|coursework|university|college|degree|bachelor|master|phd)\b/i.test(lowerText);
  const educationCount = hasEducation ? 1 : 0;

  const hasExperience = /\b(experience|employment|work history|professional experience|internship)\b/i.test(lowerText);

  // 3. Link Detection
  const hasGitHub = /github\.com/i.test(lowerText);

  const hasPortfolio = /(portfolio|website|linktr\.ee)/i.test(lowerText); // Rough check

  // 4. Quantified Achievements Check
  const numbersMatch = lowerText.match(/\b\d+(\.\d+)?[%kmb]?\b/gi) || [];
  const dollarMatch = lowerText.match(/\$\d+/g) || [];
  const quantifiedAchievements = (numbersMatch.length > 5 || dollarMatch.length > 0) ? 3 : 0;

  // 5. Contact Info Detection
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(lowerText);
  const hasPhone = /(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/.test(lowerText);

  // 6. Formatting & Parsing Checks
  // Simple heuristic: if we couldn't find spacing or it's mostly unreadable characters
  const formattingErrors = (text.length < 100 || !text.includes(' ')) ? 1 : 0;

  // 7. Profile Type Detection
  const isStudent = /\b(student|bachelor|master|phd|undergraduate|graduate|first-year|second-year|third-year|final-year)\b/i.test(lowerText);
  const isIntern = /\b(intern|internship|fresher)\b/i.test(lowerText);
  const isEntryLevel = /\b(entry-level|entry level|junior|associate)\b/i.test(lowerText);

  let profileType = 'experienced';
  if (isStudent && !hasExperience) {
    profileType = 'student';
  } else if (isIntern || (isStudent && hasExperience)) {
    profileType = 'internship';
  } else if (isEntryLevel || !hasExperience) {
    profileType = 'entry-level';
  }

  // 8. Missing Keywords (Local logic)
  const coreKeywords = ['Git', 'Database', 'API', 'Testing'];
  const localMissingKeywords = coreKeywords.filter(kw => 
    !extractedSkills.has(kw) && !lowerText.includes(kw.toLowerCase())
  );

  return {
    profileType,
    extractedSkills: Array.from(extractedSkills),
    missingKeywords: localMissingKeywords,
    projectsCount,
    educationCount,
    hasExperience,
    hasGitHub,

    hasPortfolio,
    hasEmail,
    hasPhone,
    formattingErrors,
    quantifiedAchievements,
    hasSummary: /\b(summary|objective|profile|about me)\b/i.test(lowerText),
    // Map to rawMetrics schema for scoring
    numberOfSkills: extractedSkills.size,
    numberOfProjects: projectsCount,
    yearsOfExperience: hasExperience ? 2 : 0, // baseline local guess
  };
}

