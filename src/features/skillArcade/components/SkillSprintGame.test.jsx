import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import SkillSprintGame from './SkillSprintGame';


vi.mock('../../../contexts/SkillArcadeContext', () => ({
  useSkillArcade: vi.fn(() => ({ stats: {}, toggleSavedBugHunterQuestion: vi.fn() }))
}));

vi.mock('../../../contexts/AuthContext', () => ({
  useAuth: vi.fn(() => ({ currentUser: { uid: 'test-user-123' } }))
}));

const mockHandleGameCompletion = vi.fn().mockImplementation(async (res) => ({
  ...res,
  streak: 1,
  xpEarned: res.score
}));

vi.mock('../hooks/useGameCompletion', () => ({
  useGameCompletion: () => ({
    handleGameCompletion: mockHandleGameCompletion
  })
}));

// Mock the questions so we know exactly what is rendering
vi.mock('../data/skillSprintQuestions', () => ({
  getRandomSprintQuestions: vi.fn(() => [
    { id: 1, question: "Q1", options: ["A", "B"], answer: "A", category: "Web" },
    { id: 2, question: "Q2", options: ["C", "D"], answer: "C", category: "Web" }
  ])
}));

describe('SkillSprintGame', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('awards 100 points per correct answer and ends game when out of questions', async () => {
    const onGameEnd = vi.fn();
    render(<SkillSprintGame onGameEnd={onGameEnd} />);

    // Answer Q1 correctly
    const optionA = screen.getAllByText('A')[0].closest('button');
    fireEvent.click(optionA);

    // Fast forward to next question (delay is 600ms)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    // Answer Q2 correctly
    const optionC = screen.getAllByText('C')[0].closest('button');
    fireEvent.click(optionC);

    // Fast forward completion (delay is 600ms) + microtasks
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1500);
    });

    // Game should end. 2 questions * 10 points = 20 points
    expect(screen.getByText('Game Over!')).toBeTruthy();
    expect(screen.getByText('20')).toBeTruthy();
  });

  it('ends game when timer reaches zero', async () => {
    const onGameEnd = vi.fn();
    render(<SkillSprintGame onGameEnd={onGameEnd} />);

    // Q1 timer counts down 60s
    await act(async () => {
      await vi.advanceTimersByTimeAsync(60000);
    });
    // Q1 transitions to Q2 (600ms)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    // Q2 timer counts down 60s
    await act(async () => {
      await vi.advanceTimersByTimeAsync(60000);
    });
    // Q2 finishes game (600ms)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    expect(screen.getByText('Game Over!')).toBeTruthy();
    expect(screen.getByText('0')).toBeTruthy();
  });

  it('preserves visual state during final question transition', async () => {
    let resolveCompletion;
    const completionPromise = new Promise(resolve => { resolveCompletion = resolve; });
    
    mockHandleGameCompletion.mockImplementationOnce(() => completionPromise);

    render(<SkillSprintGame onClose={vi.fn()} />);

    // Answer Q1 correctly
    const optionA = screen.getAllByText('A')[0].closest('button');
    fireEvent.click(optionA);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    // Answer Q2 correctly (final question)
    const optionC = screen.getAllByText('C')[0].closest('button');
    fireEvent.click(optionC);

    // Fast forward completion delay (600ms) 
    await act(async () => {
      await vi.advanceTimersByTimeAsync(600);
    });

    // Verify option is still selected while waiting for results
    expect(optionC.getAttribute('aria-pressed')).toBe('true');
    expect(mockHandleGameCompletion).toHaveBeenCalled();

    // Resolve network request
    await act(async () => {
      resolveCompletion({
        sessionId: 'test',
        game: 'Skill Sprint',
        score: 20,
        accuracy: '100%',
        isCorrectArray: [true, true],
        streak: 2,
        xpEarned: 20
      });
      // Allow re-renders
      await Promise.resolve();
    });

    // Game should be over
    expect(screen.getByText('Game Over!')).toBeTruthy();
  });
});
