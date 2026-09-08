import { useState, useEffect, useRef, useMemo } from 'react';
import { Puzzle, ArrowLeft, Clock, Code2, LayoutGrid, AlertCircle, Check, X, ListChecks, XCircle } from 'lucide-react';
import { getRandomTechPairs } from '../data/techMatchPairs';
import GameResultsView from './GameResultsView';
import { useGameCompletion } from '../hooks/useGameCompletion';

// Implements the Fisher-Yates (Knuth) Shuffle algorithm.
// This is used to randomize the display order of the left/right columns
// independently so the correct matches aren't aligned horizontally.
const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

// UI helper for button styling based on state
const getButtonClass = (isMatched, isSelected, validationState, isCategory = false) => {
  if (isMatched) return "bg-green-50 border-2 border-green-500 text-green-700 opacity-50 cursor-default";
  if (isSelected) {
    if (validationState === 'correct') return "bg-green-50 border-2 border-green-500 text-green-700 shadow-md transform scale-[1.02]";
    if (validationState === 'wrong') return "bg-red-50 border-2 border-red-500 text-red-700 shadow-md";
    return "bg-[#F3F0FF] border-2 border-[#6C4CF1] text-[#6C4CF1] shadow-md transform scale-[1.02]";
  }
  if (isCategory) {
    return "bg-slate-50 border-2 border-slate-200 border-dashed text-slate-600 hover:border-[#6C4CF1]/40 hover:bg-[#F3F0FF]/50 hover:text-slate-800 shadow-sm";
  }
  return "bg-white border-2 border-slate-200 text-slate-900 hover:border-[#6C4CF1]/40 hover:bg-[#F3F0FF]/50 shadow-sm";
};

export default function TechMatchGame({ onClose }) {
  const [pairs, setPairs] = useState([]);
  
  const [selectedTech, setSelectedTech] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  
  const shuffledTechs = useMemo(() => pairs.length > 0 ? shuffleArray(pairs.map(p => p.tech)) : [], [pairs]);
  const shuffledCategories = useMemo(() => pairs.length > 0 ? shuffleArray(pairs.map(p => p.category)) : [], [pairs]);
  
  const matchedCategories = useMemo(() => {
    const matchedSet = new Set(matchedPairs);
    return new Set(pairs.filter(p => matchedSet.has(p.tech)).map(p => p.category));
  }, [pairs, matchedPairs]);

  const hasSelectedBoth = selectedTech !== null && selectedCategory !== null;
  
  let validationState = 'none';
  if (hasSelectedBoth) {
    const isCorrectMatch = pairs.some(p => p.tech === selectedTech && p.category === selectedCategory);
    validationState = isCorrectMatch ? 'correct' : 'wrong';
  }
  
  const [timerAnnouncement, setTimerAnnouncement] = useState('');
  const [feedbackAnnouncement, setFeedbackAnnouncement] = useState('');
  
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [gameState, setGameState] = useState('IDLE'); // 'IDLE', 'PLAYING', 'RESULTS'
  const [results, setResults] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [lastFeedback, setLastFeedback] = useState(null);

  const { handleGameCompletion } = useGameCompletion();
  const timerRef = useRef(null);
  const isMounted = useRef(true);
  const matchedPairsRef = useRef([]);
  const mistakesRef = useRef(0);
  const sessionIdRef = useRef(null);
  const validationTimeoutRef = useRef(null);
  const firstAvailableTechRef = useRef(null);
  const prevMatchCountRef = useRef(0);

  useEffect(() => {
    if (matchedPairs.length > prevMatchCountRef.current && gameState === 'PLAYING') {
      firstAvailableTechRef.current?.focus();
    }
    prevMatchCountRef.current = matchedPairs.length;
  }, [matchedPairs, gameState]);

  useEffect(() => {
    return () => {
      clearTimeout(validationTimeoutRef.current);
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    matchedPairsRef.current = matchedPairs;
    mistakesRef.current = mistakes;
  }, [matchedPairs, mistakes]);

  const initGame = (startImmediately = false) => {
    // Prevent pending timeouts from a previous session (e.g. ended by timeout) from leaking
    clearTimeout(validationTimeoutRef.current);
    
    sessionIdRef.current = Date.now().toString();
    
    try {
      const selectedPairs = getRandomTechPairs(6);
      if (!selectedPairs || selectedPairs.length === 0) {
        throw new Error("No pairs loaded");
      }
      setPairs(selectedPairs);
      setLoadError(false);
    } catch (err) {
      console.error("Failed to initialize Tech Match:", err);
      setLoadError(true);
      return;
    }

    setMatchedPairs([]);
    setMistakes(0);
    setSelectedTech(null);
    setSelectedCategory(null);
    setTimeLeft(300);
    setGameState(startImmediately === true ? 'PLAYING' : 'IDLE');
    setResults(null);
    setTimerAnnouncement('');
    setFeedbackAnnouncement('');
    setLastFeedback(null);
  };

  const startGame = () => {
    setGameState('PLAYING');
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    initGame();
  }, []);

  const finishGame = (finalMatchedCount, finalMistakes) => {
    if (gameState !== 'PLAYING') return; // Prevent double firing
    setGameState('RESULTS');
    clearInterval(timerRef.current);

    const totalPossible = pairs.length;
    const score = Math.max(0, (finalMatchedCount * 50) - (finalMistakes * 10));
    const totalAttempts = Math.max(totalPossible, finalMatchedCount + finalMistakes);
    const accuracy = totalAttempts > 0 
      ? Math.round((finalMatchedCount / totalAttempts) * 100) + '%' 
      : '0%';
    
    const gameResult = {
      sessionId: sessionIdRef.current,
      game: 'Tech Match',
      score,
      accuracy,
      matchedCount: finalMatchedCount,
      mistakes: finalMistakes,
      totalPairs: totalPossible,
      isCorrectArray: []
    };

    // Fire and forget save operation
    handleGameCompletion(gameResult, isMounted).catch(err => {
      console.error('Failed to save game state:', err);
    });
  };

  useEffect(() => {
    if (gameState === 'PLAYING') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'PLAYING') return;
    
    if (timeLeft === 0) {
      const pendingMatchCount = validationState === 'correct' ? 1 : 0;
      const pendingMistakeCount = validationState === 'wrong' ? 1 : 0;
      finishGame(
        matchedPairsRef.current.length + pendingMatchCount, 
        mistakesRef.current + pendingMistakeCount
      );
    } else if (timeLeft === 60) {
      setTimerAnnouncement('1 minute remaining');
    } else if (timeLeft === 30) {
      setTimerAnnouncement('30 seconds remaining');
    } else if (timeLeft === 10) {
      setTimerAnnouncement('10 seconds remaining, hurry up!');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, gameState]);

  useEffect(() => {
    if (hasSelectedBoth) {
      const isCorrect = validationState === 'correct';
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFeedbackAnnouncement(isCorrect ? 'Valid mapping!' : 'Invalid mapping.');
      if (!isCorrect) {
         
        setMistakes(prev => prev + 1);
        const correctCategory = pairs.find(p => p.tech === selectedTech)?.category;
         
        setLastFeedback({ 
          tech: selectedTech, 
          category: correctCategory 
        });
      } else {
         
        setLastFeedback(null);
      }

            validationTimeoutRef.current = setTimeout(() => {
        if (isCorrect) {
          setMatchedPairs(prev => [...prev, selectedTech]);
        }
        setSelectedTech(null);
        setSelectedCategory(null);
        setFeedbackAnnouncement('');
      }, isCorrect ? 600 : 800);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTech, selectedCategory]);
  useEffect(() => {
    let completionTimeout;
    if (gameState === 'PLAYING' && pairs.length > 0 && matchedPairs.length === pairs.length) {
      completionTimeout = setTimeout(() => finishGame(matchedPairs.length, mistakesRef.current), 500);
    }
    return () => clearTimeout(completionTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchedPairs, pairs, gameState]);


  if (loadError) {
    return (
      <div className="flex flex-col justify-center items-center h-full bg-slate-50 p-6 gap-4">
        <p className="text-[15px] font-medium text-slate-600 text-center">
          Unable to load game data. Please try again.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => initGame()}
            className="px-6 py-2.5 bg-[#6C4CF1] text-white text-[14px] font-bold rounded-xl hover:bg-[#5b3ce0] transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 text-[14px] font-bold rounded-xl hover:bg-slate-50 transition-colors"
          >
            Return to Arcade
          </button>
        </div>
      </div>
    );
  }

  if (pairs.length === 0) {
    return (
      <div className="flex justify-center items-center h-full bg-slate-50">
        <div className="w-8 h-8 border-4 border-[#6C4CF1] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (gameState === 'IDLE') {
    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-4 h-full flex flex-col justify-center items-center bg-[#F8FAFC]">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-lg w-full text-center shadow-sm">
          <div className="w-16 h-16 bg-[#F3F0FF] rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#6C4CF1]/20">
            <Puzzle size={32} className="text-[#6C4CF1] fill-[#6C4CF1]" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Tech Stack Mapper</h2>
          <p className="text-[14px] text-slate-600 mb-8 leading-relaxed">
            Match each tool or framework to its correct architectural category before the timer runs out.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-8 text-left">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Puzzle size={14} /> Pairs
              </p>
              <p className="text-[14px] font-semibold text-slate-700">{pairs.length} to match</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Clock size={14} /> Timeout Limit
              </p>
              <p className="text-[14px] font-semibold text-slate-700">5 Minutes</p>
            </div>
          </div>
          
          <button 
            onClick={startGame}
            className="w-full bg-[#6C4CF1] text-white font-bold text-[15px] py-3.5 rounded-xl hover:bg-[#5b3ce0] transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-[#6C4CF1] outline-none"
          >
            Start
          </button>
          <button 
            onClick={onClose}
            className="mt-5 text-[14px] font-medium text-slate-500 hover:text-slate-700 transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <ArrowLeft size={16} /> Return to Arcade
          </button>
        </div>
      </div>
    );
  }

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-5 h-full min-h-0 flex flex-col overflow-y-auto scrollbar-hide bg-[#F8FAFC]">
      {/* Game Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 shrink-0">
        <div className="flex items-center gap-4 md:gap-6 flex-1 min-w-0">
          <button
            onClick={onClose}
            aria-label="Exit game"
            className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-sm shrink-0 focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex items-center gap-4 shrink-0">
            <div className="w-14 h-14 bg-[#F3F0FF] rounded-2xl flex items-center justify-center shrink-0 border border-[#6C4CF1]/20">
              <Puzzle size={28} className="text-[#6C4CF1] fill-[#6C4CF1]" />
            </div>
            <div className="min-w-0">
              <h2 className="text-[20px] md:text-[24px] font-bold text-slate-900 leading-tight truncate flex items-center gap-2">Tech Stack Mapper</h2>
              <p className="text-[13px] font-medium text-slate-400 truncate hidden md:block">Select a tool or framework, then assign it to the correct architectural category</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0 md:pr-2">
          {/* Progress */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 bg-[#F3F0FF] rounded-lg border border-[#6C4CF1]/20" aria-label={`Validated: ${matchedPairs.length} of ${pairs.length}`}>
            <ListChecks size={16} className="text-[#6C4CF1] shrink-0 hidden sm:block" />
            <span className="text-[13px] sm:text-[14px] font-bold text-[#6C4CF1]">{matchedPairs.length} / {pairs.length}</span>
          </div>

          {/* Errors */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 bg-red-50 rounded-lg border border-red-200" aria-label={`Errors: ${mistakes}`}>
            <XCircle size={16} className="text-red-500 shrink-0 hidden sm:block" />
            <span className="text-[13px] sm:text-[14px] font-bold text-red-600">{mistakes}</span>
          </div>

          {/* Time */}
          <div className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg border ${
            gameState === 'RESULTS' && timeLeft === 0 
              ? 'bg-red-50 border-red-200' 
              : gameState === 'RESULTS' && matchedPairs.length === pairs.length
                ? 'bg-green-50 border-green-200'
                : 'bg-slate-50 border-slate-200'
          }`} aria-label="Remaining time">
            <Clock size={16} className={
              gameState === 'RESULTS' && timeLeft === 0 ? 'text-red-500 shrink-0 hidden sm:block' : 
              gameState === 'RESULTS' && matchedPairs.length === pairs.length ? 'text-green-600 shrink-0 hidden sm:block' : 
              'text-slate-500 shrink-0 hidden sm:block'
            } />
            <span className={`text-[13px] sm:text-[14px] font-bold tabular-nums ${
              gameState === 'RESULTS' && timeLeft === 0 ? 'text-red-600' :
              gameState === 'RESULTS' && matchedPairs.length === pairs.length ? 'text-green-700' :
              'text-slate-700'
            }`}>
              {gameState === 'RESULTS' && timeLeft === 0 ? "Time's Up!" : 
               gameState === 'RESULTS' && matchedPairs.length === pairs.length ? "Complete!" : 
               `${mins}:${secs.toString().padStart(2, '0')}`}
            </span>
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="bg-white border border-slate-200 rounded-[20px] p-4 sm:p-6 md:p-8 shadow-sm flex flex-col items-center flex-1 overflow-y-auto">
        
        {/* ARIA Live Regions */}
        <div aria-live="assertive" className="sr-only">{timerAnnouncement}</div>
        <div aria-live="polite" className="sr-only">{feedbackAnnouncement}</div>
        {/* Explain why category buttons are disabled when no tech is selected */}
        <div aria-live="polite" className="sr-only">
          {!selectedTech && !hasSelectedBoth && matchedPairs.length < pairs.length
            ? 'Select a technology first, then select its matching category.'
            : ''}
        </div>

        {/* Feedback Banner */}
        <div className="h-10 mb-4 w-full max-w-4xl flex items-center justify-center shrink-0">
          {lastFeedback && (
            <div className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-[13px] font-medium animate-in fade-in zoom-in-95 flex items-center gap-2 shadow-sm">
              <AlertCircle size={16} className="shrink-0" />
              <span><strong>{lastFeedback.tech}</strong> maps to <strong>{lastFeedback.category}</strong>.</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-12 w-full max-w-4xl">
          {/* Techs Column */}
          <div className="flex flex-col gap-3">
            <h3 className="flex items-center justify-center gap-2 font-bold text-slate-700 uppercase tracking-widest text-[11px]">
              <Code2 size={14} className="text-slate-400" /> Technologies
            </h3>
            {shuffledTechs.map((tech, idx) => {
              const isMatched = matchedPairs.includes(tech);
              const isSelected = selectedTech === tech;
              const isDisabled = gameState !== 'PLAYING' || isMatched || hasSelectedBoth;
              const btnClass = getButtonClass(isMatched, isSelected, validationState, false);
              // Track the first interactive tech button so we can return
              // focus here after each validated pair is cleared.
              const isFirstAvailable = !isMatched && idx === shuffledTechs.findIndex(t => !matchedPairs.includes(t));

              return (
                <button
                  key={tech}
                  ref={isFirstAvailable ? firstAvailableTechRef : null}
                  aria-disabled={isDisabled}
                  tabIndex={isMatched ? -1 : 0}
                  onClick={() => !isDisabled && setSelectedTech(isSelected ? null : tech)}
                  aria-pressed={isSelected}
                  className={`relative flex items-center justify-center p-4 md:p-5 rounded-2xl text-[16px] md:text-[18px] font-extrabold transition-all text-center focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none ${btnClass} ${isMatched ? 'opacity-40 cursor-default' : isDisabled && !isMatched ? 'cursor-default opacity-60' : ''}`}
                >
                  <span className="z-10">{tech}</span>
                  {isSelected && validationState === 'correct' && (
                    <Check className="absolute right-3 md:right-4 text-green-600" size={20} />
                  )}
                  {isSelected && validationState === 'wrong' && (
                    <X className="absolute right-3 md:right-4 text-red-600" size={20} />
                  )}
                  {isMatched && !isSelected && (
                    <Check className="absolute right-3 md:right-4 text-green-600 opacity-50" size={20} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Categories Column */}
          <div className="flex flex-col gap-3">
            <h3 className="flex items-center justify-center gap-2 font-bold text-slate-700 uppercase tracking-widest text-[11px]">
              <LayoutGrid size={14} className="text-slate-400" /> Categories
            </h3>
            {shuffledCategories.map(cat => {
              const isMatched = matchedCategories.has(cat);
              const isSelected = selectedCategory === cat;
              const isDisabled = gameState !== 'PLAYING' || isMatched || hasSelectedBoth || !selectedTech;
              const btnClass = getButtonClass(isMatched, isSelected, validationState, true);

              return (
                <button
                  key={cat}
                  aria-disabled={isDisabled}
                  tabIndex={isMatched || !selectedTech ? -1 : 0}
                  onClick={() => !isDisabled && setSelectedCategory(isSelected ? null : cat)}
                  aria-pressed={isSelected}
                  className={`relative flex items-center justify-center p-3 md:p-4 rounded-xl text-[14px] md:text-[15px] font-semibold transition-all text-center focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none ${btnClass} ${isMatched ? 'opacity-40 cursor-default' : isDisabled && !isMatched ? 'cursor-default opacity-60' : ''}`}
                >
                  <span className="z-10">{cat}</span>
                  {isSelected && validationState === 'correct' && (
                    <Check className="absolute right-3 md:right-4 text-green-600" size={18} />
                  )}
                  {isSelected && validationState === 'wrong' && (
                    <X className="absolute right-3 md:right-4 text-red-600" size={18} />
                  )}
                  {isMatched && !isSelected && (
                    <Check className="absolute right-3 md:right-4 text-green-600 opacity-50" size={18} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {gameState === 'RESULTS' && (
          <div className="mt-10 mb-4 w-full flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button
              onClick={onClose}
              className="flex items-center justify-center gap-2 bg-[#6C4CF1] hover:bg-[#5b3ce0] text-white px-8 py-3.5 rounded-xl font-bold text-[15px] transition-all shadow-md shadow-[#6C4CF1]/20 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6C4CF1] outline-none"
            >
              <ArrowLeft size={18} /> Return to Skill Arcade
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
