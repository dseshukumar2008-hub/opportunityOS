import { BUG_HUNTER_CONFIG } from '../config/bugHunterConfig';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import BugHunterGame from './BugHunterGame';
import * as bugHunterQuestionsData from '../data/bugHunterQuestions';

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  Bug: () => <div data-testid="icon-bug" />,
  Clock: () => <div data-testid="icon-clock" />,
  CheckCircle2: () => <div data-testid="icon-check" />,
  XCircle: () => <div data-testid="icon-x" />,
  ArrowRight: () => <div data-testid="icon-arrow" />,
  Code2: () => <div data-testid="icon-code" />,
  Play: () => <div data-testid="icon-play" />,
  X: () => <div data-testid="icon-x-icon" />,
  Coffee: () => <div data-testid="icon-coffee" />,
  Dices: () => <div data-testid="icon-dices" />,
  Lightbulb: () => <div data-testid="icon-lightbulb" />,
  Target: () => <div data-testid="icon-target" />,
  Brain: () => <div data-testid="icon-brain" />,
  Star: () => <div data-testid="icon-star" />,
  Info: () => <div data-testid="icon-info" />,
  Check: () => <div data-testid="icon-check-icon" />,
  Trophy: () => <div data-testid="icon-trophy" />,
  Settings2: () => <div data-testid="icon-settings" />,
  Flame: () => <div data-testid="icon-flame" />,
  BookOpen: () => <div data-testid="icon-book-open" />,
  Bookmark: () => <div data-testid="icon-bookmark" />
}));

// Mock hooks
vi.mock('../hooks/useGameCompletion', () => ({
  useGameCompletion: () => ({
    handleGameCompletion: vi.fn().mockResolvedValue({
      game: BUG_HUNTER_CONFIG.id,
      score: 10,
      accuracy: '100%',
      xpEarned: 10
    })
  })
}));

describe('BugHunterGame', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    
    // Mock the question bank function to return predictable test data
    vi.spyOn(bugHunterQuestionsData, 'getRandomBugHunterQuestions').mockReturnValue([
      {
        id: "test-bh-1",
        language: "JavaScript",
        difficulty: "Easy",
        code: "const x = 1;",
        question: "Find bug 1",
        options: ["A", "B", "C", "D"],
        answer: "A",
        explanation: "Because A"
      },
      {
        id: "test-bh-2",
        language: "JavaScript",
        difficulty: "Easy",
        code: "const y = 2;",
        question: "Find bug 2",
        options: ["A", "B", "C", "D"],
        answer: "B",
        explanation: "Because B"
      }
    ]);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders language selection first', () => {
    render(<BugHunterGame onClose={vi.fn()} />);
    expect(screen.getByText('Select your language')).toBeInTheDocument();
    expect(screen.getAllByText('JavaScript').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Python').length).toBeGreaterThan(0);
  });

  it('progresses to difficulty selection after choosing language', () => {
    render(<BugHunterGame onClose={vi.fn()} />);
    fireEvent.click(screen.getAllByText('JavaScript')[0].closest('button'));
    fireEvent.click(screen.getByText(/Continue/i));
    expect(screen.getByText('Choose Difficulty')).toBeInTheDocument();
    expect(screen.getByText('Language: JavaScript')).toBeInTheDocument();
    expect(screen.getByText('Easy')).toBeInTheDocument();
    expect(screen.getByText('Hard')).toBeInTheDocument();
  });

  it('starts the game after selecting difficulty', () => {
    render(<BugHunterGame onClose={vi.fn()} />);
    fireEvent.click(screen.getAllByText('JavaScript')[0].closest('button'));
    fireEvent.click(screen.getByText(/Continue/i));
    fireEvent.click(screen.getByText('Easy'));
    fireEvent.click(screen.getByText(/Continue/i));
    fireEvent.click(screen.getByRole('button', { name: /Hunt/i }));
    
    // Game screen should appear
    expect(screen.getByText('Find bug 1')).toBeInTheDocument();
    expect(screen.getByText('const x = 1;')).toBeInTheDocument();
  });

  it('awards exactly 10 points for a correct answer and shows explanation', () => {
    render(<BugHunterGame onClose={vi.fn()} />);
    fireEvent.click(screen.getAllByText('JavaScript')[0].closest('button'));
    fireEvent.click(screen.getByText(/Continue/i));
    fireEvent.click(screen.getByText('Easy'));
    fireEvent.click(screen.getByText(/Continue/i));
    fireEvent.click(screen.getByRole('button', { name: /Hunt/i }));
    
    // Select correct answer "A"
    const optionA = screen.getByText('A').closest('button');
    fireEvent.click(optionA);
    
    act(() => { vi.advanceTimersByTime(1000); });

    expect(screen.getAllByText('Correct!').length).toBeGreaterThan(0);
    expect(screen.getByText('Because A')).toBeInTheDocument();
    
    // Score should be 10
    expect(screen.getByText('10')).toBeInTheDocument();
    
    // Clicking again should not increase score
    fireEvent.click(optionA);
    expect(screen.getByText('10')).toBeInTheDocument(); // Still 10
  });

  it('progresses to the next question', () => {
    render(<BugHunterGame onClose={vi.fn()} />);
    fireEvent.click(screen.getAllByText('JavaScript')[0].closest('button'));
    fireEvent.click(screen.getByText(/Continue/i));
    fireEvent.click(screen.getByText('Easy'));
    fireEvent.click(screen.getByText(/Continue/i));
    fireEvent.click(screen.getByRole('button', { name: /Hunt/i }));
    
    // Answer Q1
    fireEvent.click(screen.getByText('A').closest('button'));
    
    act(() => { vi.advanceTimersByTime(1000); });

    // Click Next
    fireEvent.click(screen.getByText('Next Question'));
    
    // Should see Q2
    expect(screen.getByText('Find bug 2')).toBeInTheDocument();
  });

  it('gracefully handles empty question pools', () => {
    vi.spyOn(bugHunterQuestionsData, 'getRandomBugHunterQuestions').mockReturnValue([]);
    render(<BugHunterGame onClose={vi.fn()} />);
    
    fireEvent.click(screen.getAllByText('C++')[0].closest('button'));
    fireEvent.click(screen.getByText(/Continue/i));
    fireEvent.click(screen.getByText('Hard'));
    fireEvent.click(screen.getByText(/Continue/i));
    fireEvent.click(screen.getByRole('button', { name: /Hunt/i }));
    
    expect(screen.getByText('No Bugs Found')).toBeInTheDocument();
    expect(screen.getByText('Try Another Pool')).toBeInTheDocument();
  });
});
