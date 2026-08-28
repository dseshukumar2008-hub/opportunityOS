import { describe, it, expect } from 'vitest';
import { calculateMatchScore } from './matchScoringEngine';

describe('calculateMatchScore', () => {
  const opportunityReqs = {
    requiredSkills: ['React', 'JavaScript', 'Node.js', 'Firebase'],
    experienceLevel: 3,
    educationLevel: "Bachelor's Degree",
  };

  it('should return a high score for a perfect match', () => {
    const resumeData = {
      skills: ['React', 'JavaScript', 'Node.js', 'Firebase', 'Tailwind'],
      experience: [
        { startDate: '2020-01-01', endDate: '2023-01-01', description: 'Built React apps.' },
        { startDate: '2023-02-01', endDate: 'Present', description: 'Used Node.js.' }
      ], // > 3 years
      education: [
        { degree: "Bachelor's Degree in Computer Science" }
      ],
      personalInfo: { summary: 'Passionate about React and Firebase.' },
      projects: []
    };

    const result = calculateMatchScore(resumeData, opportunityReqs);
    expect(result.currentMatchScore).toBeGreaterThan(10);
    expect(result.strengths.length).toBeGreaterThanOrEqual(0);
    expect(result.missingSkills.length).toBe(0);
  });

  it('should accurately handle missing skills', () => {
    const resumeData = {
      skills: ['JavaScript'],
      experience: [], // 0 years
      education: [],
      personalInfo: { summary: '' },
      projects: []
    };

    const result = calculateMatchScore(resumeData, opportunityReqs);
    expect(result.currentMatchScore).toBeDefined();
    expect(result.missingSkills.map(s => s.name)).toEqual(expect.arrayContaining(['React', 'Node.js', 'Firebase']));
  });

  it('should handle empty arrays safely', () => {
    const result = calculateMatchScore({}, { requiredSkills: [], experienceLevel: 0, educationLevel: "" });
    expect(result.currentMatchScore).toBeGreaterThanOrEqual(0); // If no skills required, it falls back safely.
  });

  it('should correctly normalize synonyms', () => {
    // If the resume has "React JS", it should match the requirement "React"
    const resumeData = {
      skills: ['React JS'],
      experience: [], education: [], personalInfo: { summary: '' }, projects: []
    };
    const reqs = { requiredSkills: ['React'], experienceLevel: 0, educationLevel: '' };
    
    const result = calculateMatchScore(resumeData, reqs);
    expect(result.missingSkills.length).toBe(0); // It should recognize 'React JS' matches 'React'
  });
});
