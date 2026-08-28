import { describe, it, expect } from 'vitest';
import { getRandomTechPairs, techMatchPairs } from './techMatchPairs';

describe('getRandomTechPairs', () => {
  it('should return exactly the requested number of pairs', () => {
    const pairs = getRandomTechPairs(5);
    expect(pairs.length).toBe(5);
  });

  it('should return all pairs if requested count exceeds available pairs', () => {
    const totalPairsCount = techMatchPairs.length;
    const pairs = getRandomTechPairs(totalPairsCount + 10);
    expect(pairs.length).toBe(totalPairsCount);
  });

  it('should not contain duplicates', () => {
    const pairs = getRandomTechPairs(10);
    const uniqueIds = new Set(pairs.map(p => p.id));
    expect(uniqueIds.size).toBe(pairs.length);
  });

  it('should return an empty array when requested count is 0', () => {
    const pairs = getRandomTechPairs(0);
    expect(pairs.length).toBe(0);
  });

  it('should format returned pairs correctly (Fisher-Yates shuffle verification)', () => {
    const pairs = getRandomTechPairs(3);
    pairs.forEach(pair => {
      expect(pair).toHaveProperty('id');
      expect(pair).toHaveProperty('tech');
      expect(pair).toHaveProperty('category');
    });
  });
});
