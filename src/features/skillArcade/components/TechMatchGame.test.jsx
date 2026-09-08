import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import TechMatchGame from './TechMatchGame';
import { useGameCompletion } from '../hooks/useGameCompletion';

vi.mock('../../../contexts/SkillArcadeContext', () => ({
  useSkillArcade: vi.fn(() => ({ stats: {}, toggleSavedBugHunterQuestion: vi.fn() }))
}));

vi.mock('../../../contexts/AuthContext', () => ({
  useAuth: vi.fn(() => ({ currentUser: { uid: 'test-user-123' } }))
}));

const mockHandleGameCompletion = vi.fn(async (res) => ({
  ...res,
  streak: 1,
  xpEarned: res.score
}));

vi.mock('../hooks/useGameCompletion', () => ({
  useGameCompletion: () => ({
    handleGameCompletion: mockHandleGameCompletion
  })
}));

vi.mock('../data/techMatchPairs', () => ({
  getRandomTechPairs: vi.fn(() => [
    { id: 1, tech: "React", category: "Frontend" },
    { id: 2, tech: "Node", category: "Backend" }
  ])
}));

describe('TechMatchGame', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockHandleGameCompletion.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calculates score based on 50 points per match and -10 points per mistake', async () => {
    const onGameEnd = vi.fn();
    render(<MemoryRouter><TechMatchGame onClose={onGameEnd} /></MemoryRouter>);
    fireEvent.click(screen.getByText('Start'));

    fireEvent.click(screen.getByRole('button', { name: 'React' })); // Tech
    fireEvent.click(screen.getByRole('button', { name: 'Backend' })); // Category (MISTAKE)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    fireEvent.click(screen.getByRole('button', { name: 'React' }));
    fireEvent.click(screen.getByRole('button', { name: 'Frontend' }));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    fireEvent.click(screen.getByRole('button', { name: 'Node' }));
    fireEvent.click(screen.getByRole('button', { name: 'Backend' }));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000);
    });

    // Advance again to flush the completion timeout
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    expect(screen.getByText('Return to Skill Arcade')).toBeTruthy();
    expect(mockHandleGameCompletion).toHaveBeenCalledWith(expect.objectContaining({
      score: 90,
      accuracy: '67%' // 2 matches / (2 matches + 1 mistake) = 2/3 = 67%
    }), expect.anything());
  });

  it('calculates accuracy using Math.max(totalPossible, totalAttempts) to penalize unanswered pairs on timeout', async () => {
    const onGameEnd = vi.fn();
    render(<MemoryRouter><TechMatchGame onClose={onGameEnd} /></MemoryRouter>);
    fireEvent.click(screen.getByText('Start'));

    // Match 1 pair correctly
    fireEvent.click(screen.getByRole('button', { name: 'React' }));
    fireEvent.click(screen.getByRole('button', { name: 'Frontend' }));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    // Fast forward to timeout (300 seconds)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300000);
    });

    expect(mockHandleGameCompletion).toHaveBeenCalledWith(expect.objectContaining({
      score: 50,
      accuracy: '50%'
    }), expect.anything());
  });

  it('captures pending matches if the timer expires exactly during the validation delay', async () => {
    const onGameEnd = vi.fn();
    render(<MemoryRouter><TechMatchGame onClose={onGameEnd} /></MemoryRouter>);
    fireEvent.click(screen.getByText('Start'));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(299500);
    });

    // Match 1 pair correctly right before timeout
    fireEvent.click(screen.getByRole('button', { name: 'React' }));
    fireEvent.click(screen.getByRole('button', { name: 'Frontend' }));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    expect(mockHandleGameCompletion).toHaveBeenCalledWith(expect.objectContaining({
      score: 50,
      accuracy: '50%'
    }), expect.anything());
  });

  it('captures pending mistakes if the timer expires exactly during the validation delay', async () => {
    const onGameEnd = vi.fn();
    render(<MemoryRouter><TechMatchGame onClose={onGameEnd} /></MemoryRouter>);
    fireEvent.click(screen.getByText('Start'));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(299500);
    });

    // Match 1 pair incorrectly right before timeout
    fireEvent.click(screen.getByRole('button', { name: 'React' }));
    fireEvent.click(screen.getByRole('button', { name: 'Backend' }));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    expect(mockHandleGameCompletion).toHaveBeenCalledWith(expect.objectContaining({
      score: 0,
      accuracy: '0%'
    }), expect.anything());
  });

  it('allows exiting the game via Return to Skill Arcade', async () => {
    const onClose = vi.fn();
    render(<MemoryRouter><TechMatchGame onClose={onClose} /></MemoryRouter>);
    fireEvent.click(screen.getByText('Start'));

    fireEvent.click(screen.getByRole('button', { name: 'React' }));
    fireEvent.click(screen.getByRole('button', { name: 'Frontend' }));
    await act(async () => { await vi.advanceTimersByTimeAsync(1000); });

    fireEvent.click(screen.getByRole('button', { name: 'Node' }));
    fireEvent.click(screen.getByRole('button', { name: 'Backend' }));
    await act(async () => { 
      await vi.advanceTimersByTimeAsync(2000); 
    });
    
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    const returnBtn = screen.getByText('Return to Skill Arcade');
    expect(returnBtn).toBeTruthy();

    fireEvent.click(returnBtn);
    expect(onClose).toHaveBeenCalled();
  });
});

