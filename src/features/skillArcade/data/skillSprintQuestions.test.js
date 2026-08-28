import { describe, it, expect } from 'vitest';
import { getRandomSprintQuestions, skillSprintQuestions } from './skillSprintQuestions';

describe('getRandomSprintQuestions', () => {
  it('should return exactly the requested number of questions', () => {
    const questions = getRandomSprintQuestions(5);
    expect(questions.length).toBe(5);
  });

  it('should return all questions if requested count exceeds available questions', () => {
    const totalCount = skillSprintQuestions.length;
    const questions = getRandomSprintQuestions(totalCount + 10);
    expect(questions.length).toBe(totalCount);
  });

  it('should not contain duplicates', () => {
    const questions = getRandomSprintQuestions(15);
    const uniqueIds = new Set(questions.map(q => q.id));
    expect(uniqueIds.size).toBe(questions.length);
  });

  it('should return an empty array when requested count is 0', () => {
    const questions = getRandomSprintQuestions(0);
    expect(questions.length).toBe(0);
  });

  it('should return structurally valid question objects', () => {
    const questions = getRandomSprintQuestions(3);
    questions.forEach(q => {
      expect(q).toHaveProperty('id');
      expect(q).toHaveProperty('question');
      expect(q).toHaveProperty('options');
      expect(q).toHaveProperty('answer');
      expect(Array.isArray(q.options)).toBe(true);
      expect(q.options.includes(q.answer)).toBe(true);
    });
  });
});
