import { describe, it, expect } from 'vitest';
import { getRandomCareerQuestions, careerQuizQuestions } from './careerQuizQuestions';

describe('getRandomCareerQuestions', () => {
  it('should return exactly the requested number of questions', () => {
    const questions = getRandomCareerQuestions(5);
    expect(questions.length).toBe(5);
  });

  it('should return all questions if requested count exceeds available questions', () => {
    const totalCount = careerQuizQuestions.length;
    const questions = getRandomCareerQuestions(totalCount + 10);
    expect(questions.length).toBe(totalCount);
  });

  it('should not contain duplicates', () => {
    const questions = getRandomCareerQuestions(15);
    const uniqueIds = new Set(questions.map(q => q.id));
    expect(uniqueIds.size).toBe(questions.length);
  });

  it('should return structurally valid question objects', () => {
    const questions = getRandomCareerQuestions(3);
    questions.forEach(q => {
      expect(q).toHaveProperty('id');
      expect(q).toHaveProperty('question');
      expect(q).toHaveProperty('options');
      expect(q).toHaveProperty('answer');
    });
  });
});
