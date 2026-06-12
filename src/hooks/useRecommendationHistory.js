import { useState, useCallback } from 'react';

const STORAGE_KEY = 'oppOs_recHistory';

const INITIAL_MOCK_HISTORY = [
  {
    id: 'snap-1',
    date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
    averageMatchScore: 55,
    atsScore: 48,
    topRecommendation: 'Junior QA Engineer',
    topRecommendationId: 'opp-1',
    recommendationCount: 2,
    improvements: ['Baseline established', 'Created initial profile', 'Uploaded first resume version'],
    skillsAdded: ['HTML', 'CSS', 'Manual Testing'],
    skillsMissing: ['JavaScript', 'React', 'Node.js', 'Git', 'Tailwind CSS'],
    applicationsSubmitted: 0,
    goalsCompleted: 1,
    matchBreakdown: { skills: 40, experience: 50, formatting: 75 },
    recommendedRoles: [
      { role: 'Junior QA Engineer', score: 62, type: 'Full-time' },
      { role: 'Technical Support Intern', score: 58, type: 'Internship' }
    ]
  },
  {
    id: 'snap-2',
    date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
    averageMatchScore: 68,
    atsScore: 60,
    topRecommendation: 'Frontend Web Developer (HTML/CSS)',
    topRecommendationId: 'opp-2',
    recommendationCount: 4,
    improvements: ['Added JavaScript & Git to profile', 'Linked GitHub account', 'Improved layout and formatting'],
    skillsAdded: ['JavaScript', 'Git', 'GitHub', 'Markdown'],
    skillsMissing: ['React', 'Tailwind CSS', 'REST APIs', 'TypeScript'],
    applicationsSubmitted: 2,
    goalsCompleted: 3,
    matchBreakdown: { skills: 60, experience: 62, formatting: 82 },
    recommendedRoles: [
      { role: 'Frontend Web Developer (HTML/CSS)', score: 72, type: 'Contract' },
      { role: 'Junior Web Developer', score: 68, type: 'Full-time' },
      { role: 'Web Support Specialist', score: 64, type: 'Part-time' }
    ]
  },
  {
    id: 'snap-3',
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    averageMatchScore: 78,
    atsScore: 75,
    topRecommendation: 'React Developer Intern',
    topRecommendationId: 'opp-3',
    recommendationCount: 7,
    improvements: ['Completed React Basics certification', 'Added Tailwind CSS styling skills', 'Created Portfolio project'],
    skillsAdded: ['React', 'Tailwind CSS', 'REST APIs', 'Vite', 'Responsive Design'],
    skillsMissing: ['Redux', 'TypeScript', 'Jest', 'Next.js'],
    applicationsSubmitted: 5,
    goalsCompleted: 5,
    matchBreakdown: { skills: 78, experience: 70, formatting: 90 },
    recommendedRoles: [
      { role: 'React Developer Intern', score: 83, type: 'Internship' },
      { role: 'Frontend Engineer (Junior)', score: 79, type: 'Full-time' },
      { role: 'UI Developer', score: 76, type: 'Full-time' }
    ]
  },
  {
    id: 'snap-4',
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    averageMatchScore: 87,
    atsScore: 86,
    topRecommendation: 'Google SWE Internship',
    topRecommendationId: 'opp-4',
    recommendationCount: 10,
    improvements: ['Added TypeScript & Redux State Management', 'Built advanced Next.js project', 'Optimized resume formatting with ATS checklist'],
    skillsAdded: ['TypeScript', 'Redux Toolkit', 'Next.js', 'Jest', 'Unit Testing'],
    skillsMissing: ['GraphQL', 'Docker', 'AWS'],
    applicationsSubmitted: 8,
    goalsCompleted: 8,
    matchBreakdown: { skills: 89, experience: 82, formatting: 95 },
    recommendedRoles: [
      { role: 'Google SWE Internship', score: 92, type: 'Internship' },
      { role: 'Software Engineer Intern (Meta)', score: 88, type: 'Internship' },
      { role: 'Frontend React Engineer', score: 86, type: 'Full-time' },
      { role: 'Full Stack Engineer (Vercel)', score: 82, type: 'Full-time' }
    ]
  }
];

export function useRecommendationHistory() {
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      } else {
        // Initialize with mock history to demonstrate timeline
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_HISTORY));
        return INITIAL_MOCK_HISTORY;
      }
    } catch {
      return INITIAL_MOCK_HISTORY;
    }
  });

  const saveHistory = useCallback((newHistory) => {
    setHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  }, []);

  const addSnapshot = useCallback((averageMatchScore, topRecommendation, recommendationCount) => {
    const lastSnapshot = history[history.length - 1];
    
    // Only add if there's a meaningful change (e.g., score went up or top rec changed)
    if (
      lastSnapshot && 
      lastSnapshot.averageMatchScore === averageMatchScore && 
      lastSnapshot.topRecommendationId === topRecommendation.id
    ) {
      return false; // No snapshot needed
    }

    // Determine simulated improvements based on score changes
    const improvements = [];
    const skillsAdded = [];
    const skillsMissing = ['GraphQL', 'Docker', 'AWS'];
    
    if (lastSnapshot) {
      if (averageMatchScore > lastSnapshot.averageMatchScore) {
        improvements.push('Improved overall match scores');
        
        // Randomly simulate reasons for the jump
        const possibleReasons = [
          'Added missing skills to resume',
          'Improved ATS resume layout score',
          'Completed professional certifications',
          'Increased user profile completeness',
          'Participated in collaborative team projects'
        ];
        improvements.push(possibleReasons[Math.floor(Math.random() * possibleReasons.length)]);
        skillsAdded.push('Advanced JavaScript', 'Tailwind CSS');
      } else {
        improvements.push('Updated baseline snapshot');
      }
      
      if (topRecommendation.id !== lastSnapshot.topRecommendationId) {
        improvements.push(`Unlocked higher match for ${topRecommendation.title || topRecommendation}`);
      }
    } else {
      improvements.push('Initial baseline established');
    }

    const currentAts = lastSnapshot ? Math.min(95, lastSnapshot.atsScore + 4) : 70;
    const currentApps = lastSnapshot ? lastSnapshot.applicationsSubmitted + 1 : 1;
    const currentGoals = lastSnapshot ? lastSnapshot.goalsCompleted + 1 : 1;

    const newSnapshot = {
      id: `snap-${Date.now()}`,
      date: new Date().toISOString(),
      averageMatchScore,
      atsScore: currentAts,
      topRecommendation: topRecommendation.title || topRecommendation,
      topRecommendationId: topRecommendation.id || 'opp-custom',
      recommendationCount,
      improvements,
      skillsAdded,
      skillsMissing,
      applicationsSubmitted: currentApps,
      goalsCompleted: currentGoals,
      matchBreakdown: { 
        skills: Math.round(averageMatchScore * 1.02), 
        experience: Math.round(averageMatchScore * 0.95), 
        formatting: Math.round(averageMatchScore * 1.08) 
      },
      recommendedRoles: [
        { role: topRecommendation.title || topRecommendation, score: averageMatchScore, type: 'Internship' },
        { role: 'Frontend Developer', score: Math.max(50, averageMatchScore - 5), type: 'Full-time' }
      ]
    };

    saveHistory([...history, newSnapshot]);
    return true;
  }, [history, saveHistory]);

  const clearHistory = useCallback(() => {
    saveHistory(INITIAL_MOCK_HISTORY);
  }, [saveHistory]);

  return {
    history,
    addSnapshot,
    clearHistory
  };
}
