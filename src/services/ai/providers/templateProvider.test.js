import { describe, it, expect } from 'vitest';
import { templateProvider } from './templateProvider';

describe('templateProvider', () => {
  it('should return structurally valid fallback data for CareerCoach', async () => {
    const result = await templateProvider.generate({ feature: 'CareerCoach' });
    expect(result).toHaveProperty('reply');
    expect(result).toHaveProperty('suggestedActions');
    expect(result).toHaveProperty('newGoals');
    expect(result.suggestedActions.length).toBeGreaterThan(0);
  });

  it('should return structurally valid fallback data for ResumeAnalysis', async () => {
    const result = await templateProvider.generate({ feature: 'ResumeAnalysis' });
    expect(result).toHaveProperty('score');
    expect(result).toHaveProperty('strengths');
    expect(result).toHaveProperty('weaknesses');
    expect(result).toHaveProperty('recommendations');
    expect(result.score).toBe(50);
  });

  it('should safely fallback for unknown features', async () => {
    const result = await templateProvider.generate({ feature: 'UnknownFeature123' });
    expect(result).toHaveProperty('message');
    expect(result.message).toContain('Offline template response for');
  });
});
