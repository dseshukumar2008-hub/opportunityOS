import { describe, it, expect } from 'vitest';
import { getRandomTechPairs, techMatchPairs } from './techMatchPairs';

describe('getRandomTechPairs', () => {
  it('should not mutate the original techMatchPairs array', () => {
    const originalLength = techMatchPairs.length;
    const originalFirstItem = { ...techMatchPairs[0] };
    
    // Call the function multiple times to ensure internal states change
    getRandomTechPairs(6);
    getRandomTechPairs(6);
    
    // Verify the original array length is identical
    expect(techMatchPairs.length).toBe(originalLength);
    
    // Verify the first item hasn't been modified in place
    expect(techMatchPairs[0]).toEqual(originalFirstItem);
  });

  it('should return exactly the requested number of pairs with valid properties', () => {
    const pairs = getRandomTechPairs(4);
    
    expect(pairs).toHaveLength(4);
    pairs.forEach(pair => {
      expect(pair).toHaveProperty('id');
      expect(pair).toHaveProperty('tech');
      expect(pair).toHaveProperty('category');
    });
  });
});
