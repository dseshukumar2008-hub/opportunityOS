import { describe, it, expect } from 'vitest';
import { getResumeStrength, validateSection } from './resumeValidationUtils';

describe('resumeValidationUtils', () => {
  describe('getResumeStrength', () => {
    it('should calculate strength correctly for an empty resume', () => {
      const resume = {};
      const score = getResumeStrength(resume);
      expect(score).toBe(0);
    });

    it('should calculate strength correctly for a complete resume', () => {
      const resume = {
        personalInfo: { fullName: 'John Doe', email: 'john@example.com', phone: '1234567890', summary: 'A great dev' },
        experience: [{ company: 'A', role: 'B', description: 'C' }],
        education: [{ institution: 'X', degree: 'Y' }],
        skills: ['React', 'Node'],
        projects: [{ name: 'Project 1', description: 'Desc' }]
      };
      const score = getResumeStrength(resume);
      expect(score).toBeGreaterThan(15);
    });
  });

  describe('validateSection', () => {
    it('should invalidate experience section if required fields are missing', () => {
      const experience = [{ company: 'Only Company Name' }];
      const result = validateSection('Experience', { experience });
      expect(result).toBe(false);
    });

    it('should validate skills section if it has enough skills', () => {
      const skills = ['React', 'Node', 'Firebase', 'Tailwind'];
      const result = validateSection('Skills', { skills });
      expect(result).toBe(true);
    });

    it('should invalidate skills section if less than 3 skills', () => {
      const skills = ['React'];
      const result = validateSection('Skills', { skills });
      expect(result).toBe(true);
    });
  });
});
