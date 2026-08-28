import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TechMatchGame from './TechMatchGame';
import * as SkillArcadeContext from '../../../contexts/SkillArcadeContext';

vi.mock('../../../contexts/SkillArcadeContext', () => ({
  useSkillArcade: vi.fn()
}));

vi.mock('../../../contexts/AuthContext', () => ({
  useAuth: vi.fn(() => ({ currentUser: { uid: 'test-user-123' } }))
}));

vi.mock('../hooks/useGameCompletion', () => ({
  useGameCompletion: () => ({
    handleGameCompletion: vi.fn().mockImplementation(async (res) => ({
      ...res,
      streak: 1,
      xpEarned: res.score
    }))
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
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calculates score based on 50 points per match and -10 points per mistake', async () => {
    const onGameEnd = vi.fn();
    render(<TechMatchGame onGameEnd={onGameEnd} />);

    // We have 2 pairs. Let's make 1 mistake and then match all.
    fireEvent.click(screen.getByText('React')); // Tech
    fireEvent.click(screen.getByText('Backend')); // Category (MISTAKE)

    // Wait for mistake animation/reset (800ms)
    await vi.advanceTimersByTimeAsync(1000);

    // Now match first pair correctly
    fireEvent.click(screen.getByText('React'));
    fireEvent.click(screen.getByText('Frontend'));

    // Wait for match animation (600ms)
    await vi.advanceTimersByTimeAsync(1000);

    // Match second pair correctly
    fireEvent.click(screen.getByText('Node'));
    fireEvent.click(screen.getByText('Backend'));

    // Wait for match animation (600ms) + completion timeout (500ms) and microtasks
    await vi.advanceTimersByTimeAsync(2000);

    // 2 matches * 50 = 100 points
    // 1 mistake * -10 = -10 points
    // Total = 90 points
    expect(screen.getByText('Game Over!')).toBeTruthy();
    expect(screen.getByText('90')).toBeTruthy();
  });
});
