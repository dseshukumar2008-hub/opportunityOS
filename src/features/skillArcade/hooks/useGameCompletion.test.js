import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useGameCompletion } from './useGameCompletion';
import * as SkillArcadeContext from '../../../contexts/SkillArcadeContext';

// Mock Context
vi.mock('../../../contexts/SkillArcadeContext', () => ({
  useSkillArcade: vi.fn()
}));

describe('useGameCompletion', () => {
  const mockSaveGameState = vi.fn();
  
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should compute XP, streak, and daily reward correctly when mounted', async () => {
    mockSaveGameState.mockResolvedValue({ 
      updatedState: { bestStreak: 5 }, 
      earnedDailyReward: true 
    });

    vi.mocked(SkillArcadeContext.useSkillArcade).mockReturnValue({
      saveGameState: mockSaveGameState,
      stats: { highScore: 100 }
    });

    const { result } = renderHook(() => useGameCompletion());
    const isMounted = { current: true };
    const gameResult = { score: 150 };

    let computedResult;
    await act(async () => {
      computedResult = await result.current.handleGameCompletion(gameResult, isMounted);
    });

    expect(mockSaveGameState).toHaveBeenCalledWith(gameResult);
    expect(computedResult).toEqual({
      score: 150,
      streak: 5,
      isNewHighScore: true, // 150 > 100
      xpEarned: 150,
      earnedDailyReward: true
    });
  });

  it('should return null and not leak state when unmounted', async () => {
    mockSaveGameState.mockResolvedValue({ 
      updatedState: { bestStreak: 5 }, 
      earnedDailyReward: false 
    });

    vi.mocked(SkillArcadeContext.useSkillArcade).mockReturnValue({
      saveGameState: mockSaveGameState,
      stats: { highScore: 100 }
    });

    const { result } = renderHook(() => useGameCompletion());
    const isMounted = { current: false }; // component unmounted mid-flight
    const gameResult = { score: 50 };

    let computedResult;
    await act(async () => {
      computedResult = await result.current.handleGameCompletion(gameResult, isMounted);
    });

    expect(computedResult).toBeNull();
  });

  it('should correctly identify when a score is NOT a new high score', async () => {
    mockSaveGameState.mockResolvedValue({ 
      updatedState: { bestStreak: 2 }, 
      earnedDailyReward: false 
    });

    vi.mocked(SkillArcadeContext.useSkillArcade).mockReturnValue({
      saveGameState: mockSaveGameState,
      stats: { highScore: 200 }
    });

    const { result } = renderHook(() => useGameCompletion());
    const isMounted = { current: true };
    
    let computedResult;
    await act(async () => {
      computedResult = await result.current.handleGameCompletion({ score: 150 }, isMounted);
    });

    expect(computedResult.isNewHighScore).toBe(false); // 150 < 200
  });
});
