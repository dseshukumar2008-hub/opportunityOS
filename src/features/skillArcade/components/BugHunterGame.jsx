import { useState, useEffect, useRef, useCallback } from 'react';
import { Bug, Clock, CheckCircle2, XCircle, ArrowRight, Code2, Target, Brain, Lightbulb, Check, X, Info, Dices, AlertCircle, Tag, Flame, BookOpen } from 'lucide-react';
import { getRandomBugHunterQuestions, getDailyBugHunterChallenge } from '../data/bugHunterQuestions';
import { BUG_HUNTER_GLOSSARY } from '../data/bugHunterGlossary';
import GameResultsView from './GameResultsView';
import { AnswerOption } from './AnswerOption';
import { useGameCompletion } from '../hooks/useGameCompletion';
import { useSkillArcade } from '../../../contexts/SkillArcadeContext';
import { BUG_HUNTER_CONFIG } from '../config/bugHunterConfig';
import { analyticsService } from '../../../services/analyticsService';

const getSafeConcept = (q) => {
  if (!q.tags || q.tags.length === 0) return q.category || null;

  for (const tag of q.tags) {
    const tagLower = tag.toLowerCase();
    const isGiveaway = q.options.some(opt => String(opt).toLowerCase().includes(tagLower));
    if (!isGiveaway) return tag;
  }

  return q.category || null;
};

import { GameTimer } from './GameTimer';



const renderExplanation = (q) => {
  const expObj = typeof q.explanation === 'object' && q.explanation !== null ? q.explanation : {};

  const bug = q.bugDescription || expObj.bugDescription || expObj.bug;
  const why = q.whyItHappens || expObj.whyItHappens || expObj.reason;
  const fix = q.correctApproach || expObj.correctApproach || expObj.fix;
  const code = q.correctedCode || expObj.correctedCode;

  const hasRichExp = bug || why || fix || code;
  const hasBehavior = q.expectedBehavior || q.actualBehavior;

  if (!hasRichExp && !hasBehavior) {
    const text = typeof q.explanation === 'string' ? q.explanation : (expObj.text || '');
    return <p className="text-slate-700 text-sm leading-relaxed mt-1">{text}</p>;
  }

  return (
    <div className="flex flex-col gap-4 mt-3 bg-white rounded-xl border border-slate-100 p-4">
      {hasBehavior && (
        <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-100">
          {q.expectedBehavior && (
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase">Expected</span>
              <p className="text-sm text-slate-700 leading-snug mt-1">{q.expectedBehavior}</p>
            </div>
          )}
          {q.actualBehavior && (
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase">Actual</span>
              <p className="text-sm text-slate-700 leading-snug mt-1">{q.actualBehavior}</p>
            </div>
          )}
        </div>
      )}

      {expObj.intent && (
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1"><Target size={14} /> The Goal</span>
          <p className="text-sm text-slate-700 leading-relaxed">{expObj.intent}</p>
        </div>
      )}
      {bug && (
        <div>
          <span className="text-[11px] font-bold text-red-500 uppercase tracking-wider flex items-center gap-1.5 mb-1"><Bug size={14} /> Bug</span>
          <p className="text-sm text-slate-700 leading-relaxed">{bug}</p>
        </div>
      )}
      {why && (
        <div>
          <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5 mb-1"><AlertCircle size={14} /> Why</span>
          <p className="text-sm text-slate-700 leading-relaxed">{why}</p>
        </div>
      )}
      {fix && (
        <div>
          <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1.5 mb-1"><CheckCircle2 size={14} /> Fix</span>
          <p className="text-sm text-slate-700 leading-relaxed">{fix}</p>
        </div>
      )}
      {code && (
        <div className="mt-2">
          <span className="text-[11px] font-bold text-indigo-500 uppercase tracking-wider flex items-center gap-1.5 mb-2"><Code2 size={14} /> Corrected Code</span>
          <pre className="bg-slate-900 text-slate-300 p-3 rounded-lg text-xs font-mono overflow-x-auto border border-slate-800">
            <code>{code}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

const calculateMastery = (correctCount, diff) => {
  const multiplier = diff === 'Hard' ? 3 : (diff === 'Medium' || diff === 'Mixed' ? 2 : 1);
  const masteryPoints = correctCount * multiplier;

  if (masteryPoints >= 40) return { title: 'Master Debugger', color: 'text-purple-700 bg-purple-50 border-purple-200' };
  if (masteryPoints >= 30) return { title: 'Expert Debugger', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' };
  if (masteryPoints >= 20) return { title: 'Proficient Debugger', color: 'text-blue-700 bg-blue-50 border-blue-200' };
  if (masteryPoints >= 10) return { title: 'Competent Debugger', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  if (masteryPoints >= 5) return { title: 'Apprentice Debugger', color: 'text-amber-700 bg-amber-50 border-amber-200' };
  return { title: 'Novice Debugger', color: 'text-slate-600 bg-slate-100 border-slate-200' };
};

export default function BugHunterGame({ onClose }) {
  const [gameState, setGameState] = useState('IDLE');

  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem('bugHunter_pref_language');
      const validLangs = BUG_HUNTER_CONFIG.options.languages.map(l => l.name);
      return saved && validLangs.includes(saved) ? saved : BUG_HUNTER_CONFIG.defaults.language;
    } catch {
      return BUG_HUNTER_CONFIG.defaults.language;
    }
  });

  const [selectedDifficulty, setSelectedDifficulty] = useState(() => {
    try {
      const saved = localStorage.getItem('bugHunter_pref_difficulty');
      return saved && BUG_HUNTER_CONFIG.options.difficulties.includes(saved) ? saved : BUG_HUNTER_CONFIG.defaults.difficulty;
    } catch {
      return BUG_HUNTER_CONFIG.defaults.difficulty;
    }
  });
  const [isDailyChallenge, setIsDailyChallenge] = useState(false);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [isSpeedMode, setIsSpeedMode] = useState(false);



  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [results, setResults] = useState(null);
  const [sessionStreak, setSessionStreak] = useState(0);


  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrectArray, setIsCorrectArray] = useState([]);
  const [selectedOptionsArray, setSelectedOptionsArray] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [confidence, setConfidence] = useState(null);

  const [showGlossary, setShowGlossary] = useState(false);


  const [timerAnnouncement, setTimerAnnouncement] = useState('');
  const [feedbackAnnouncement, setFeedbackAnnouncement] = useState('');




  const questionHeadingRef = useRef(null);
  const isMounted = useRef(true);
  const isCorrectArrayRef = useRef([]);
  const selectedOptionsArrayRef = useRef([]);

  const isFinishedRef = useRef(false);
  const sessionIdRef = useRef(null);
  const sessionMistakesRef = useRef([]);
  const answerDelayTimeoutRef = useRef(null);

  const { handleGameCompletion } = useGameCompletion();
  const { isInitializing, stats } = useSkillArcade();


  const correctAnswersCount = isCorrectArray.filter(Boolean).length;
  const score = correctAnswersCount * BUG_HUNTER_CONFIG.session.pointsPerQuestion;

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (answerDelayTimeoutRef.current) clearTimeout(answerDelayTimeoutRef.current);
    };
  }, []);

  const resetInteractionState = () => {
    setSelectedOption(null);
    setShowHint(false);
    setConfidence(null);
    setFeedbackAnnouncement('');
    setTimerAnnouncement('');
    isFinishedRef.current = false;
    isCorrectArrayRef.current = [];
    sessionMistakesRef.current = [];
    setIsCorrectArray([]);
    setSelectedOptionsArray([]);
    selectedOptionsArrayRef.current = [];
  };

  const startGame = (language, difficulty, practice = false, speed = false, countOverride = null) => {

    sessionIdRef.current = Date.now().toString();


    const seed = parseInt(sessionIdRef.current, 10);
    const qCount = countOverride || BUG_HUNTER_CONFIG.session.questionCount;
    const qList = getRandomBugHunterQuestions(qCount, language, difficulty, speed, seed);

    setIsDailyChallenge(false);
    setIsPracticeMode(practice);
    setIsSpeedMode(speed);
    setQuestions(qList);
    setCurrentIdx(0);
    setResults(null);
    setSessionStreak(0);
    resetInteractionState();

    setGameState('PLAYING');
  };



  const startDailyChallenge = () => {
    const qList = getDailyBugHunterChallenge(BUG_HUNTER_CONFIG.session.questionCount);
    if (!qList || qList.length === 0) {
      setFeedbackAnnouncement('Failed to load Daily Challenge.');
      return;
    }
    setIsDailyChallenge(true);
    setIsPracticeMode(false);
    setIsSpeedMode(false);
    setQuestions(qList);
    setSelectedLanguage('Daily Mix');
    setSelectedDifficulty('Mixed');
    setCurrentIdx(0);
    setResults(null);
    setSessionStreak(0);
    resetInteractionState();


    sessionIdRef.current = 'daily_' + Date.now().toString();
    setGameState('PLAYING');
  };


  const finishGame = useCallback(async (finalCorrectArr, completionStatus = 'COMPLETED') => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    setGameState('RESULTS');

    const finalCorrectCount = finalCorrectArr.filter(Boolean).length;
    const finalScore = finalCorrectCount * BUG_HUNTER_CONFIG.session.pointsPerQuestion;
    const recordedScore = isPracticeMode ? 0 : finalScore;
    const accuracy = finalCorrectArr.length > 0 ? Math.round((finalCorrectCount / finalCorrectArr.length) * 100) + '%' : '0%';


    const categoryStats = {};
    const languageStats = {};

    finalCorrectArr.forEach((isCorrect, idx) => {
      const q = questions[idx];
      if (!q) return;

      const cat = q.category || 'General';
      if (!categoryStats[cat]) {
        categoryStats[cat] = { total: 0, correct: 0 };
      }
      categoryStats[cat].total += 1;
      if (isCorrect) {
        categoryStats[cat].correct += 1;
      }

      const lang = q.language || 'Unknown';
      if (!languageStats[lang]) {
        languageStats[lang] = { total: 0, correct: 0 };
      }
      languageStats[lang].total += 1;
      if (isCorrect) {
        languageStats[lang].correct += 1;
      }
    });

    let strongestCategory = 'N/A';
    let weakestCategory = 'N/A';
    let highestRatio = -1;
    let lowestRatio = 2;

    Object.entries(categoryStats).forEach(([cat, stats]) => {
      const ratio = stats.correct / stats.total;
      if (ratio > highestRatio) { highestRatio = ratio; strongestCategory = cat; }

      if (ratio < lowestRatio && ratio < 1) { lowestRatio = ratio; weakestCategory = cat; }
    });

    const gameResult = {
      sessionId: sessionIdRef.current,
      status: completionStatus,
      game: isSpeedMode ? `${BUG_HUNTER_CONFIG.id} Speed` : BUG_HUNTER_CONFIG.id,
      score: recordedScore,
      displayScore: finalScore,
      isPracticeMode,
      isSpeedMode,
      accuracy,
      isCorrectArray: finalCorrectArr,
      selectedOptionsArray: selectedOptionsArrayRef.current,
      sessionMistakes: sessionMistakesRef.current,
      questionsSolved: finalCorrectCount,
      totalQuestions: questions.length,
      language: selectedLanguage,
      difficulty: selectedDifficulty,
      strongestPerformance: strongestCategory,
      areasToImprove: weakestCategory !== 'N/A' ? weakestCategory : 'None! Perfect run.',
      mastery: calculateMastery(finalCorrectCount, selectedDifficulty),
      categoryStats,
      languageStats
    };

    const currentModeId = isSpeedMode ? `${BUG_HUNTER_CONFIG.id} Speed` : BUG_HUNTER_CONFIG.id;
    const bugHunterHistory = stats?.recentActivity?.filter(a => a.game === currentModeId && a.status === 'COMPLETED') || [];


    const sortedHistory = [...bugHunterHistory].sort((a, b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0));
    const previousSession = sortedHistory.length > 0 ? sortedHistory[0] : null;

    const prevPersonalBest = bugHunterHistory.length > 0 ? Math.max(...bugHunterHistory.map(a => a.score || 0)) : null;
    if (prevPersonalBest !== null) {
      gameResult.prevPersonalBest = prevPersonalBest;
      gameResult.isPersonalBest = finalScore > prevPersonalBest;
    }
    if (previousSession) {
      gameResult.previousSession = previousSession;
    }

    if (isDailyChallenge) {
      try {
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem('bh_daily_completed_date', today);
      } catch { /* ignore */ }
    }

    try {
      const finalResults = await handleGameCompletion(gameResult, isMounted);
      if (finalResults && isMounted.current) {
        setResults(finalResults);
      }
    } catch (err) {
      console.error('Failed to save game state:', err);
      if (isMounted.current) {

        setResults({
          ...gameResult,
          streak: 0,
          isNewHighScore: false,
          xpEarned: 0,
          earnedDailyReward: false
        });
      }
    }
  }, [handleGameCompletion, questions, selectedLanguage, selectedDifficulty, stats?.recentActivity, isPracticeMode, isSpeedMode, isDailyChallenge]);



  useEffect(() => {
    if (gameState === 'TIME_EXPIRED' || gameState === 'COMPLETED') {
      finishGame(isCorrectArrayRef.current, gameState);
    }
  }, [gameState, finishGame]);

  const handleTimerExpire = useCallback(() => setGameState('TIME_EXPIRED'), []);


  useEffect(() => {
    if ((gameState === 'PLAYING' || gameState === 'FEEDBACK') && questionHeadingRef.current) {
      questionHeadingRef.current.focus();
    }
  }, [currentIdx, gameState]);

  const handleAnswerSelect = (option) => {
    if (gameState !== 'PLAYING') return;

    const currentQ = questions[currentIdx];
    const isCorrect = option === currentQ.answer;

    analyticsService.trackEvent(BUG_HUNTER_CONFIG.analytics.answerEvent, {
      questionId: currentQ.id,
      correct: isCorrect,
      confidence: confidence || 'Not Provided'
    });

    setSelectedOption(option);

    if (isCorrect) {
      setSessionStreak(prev => prev + 1);
    } else {
      setSessionStreak(0);
      sessionMistakesRef.current.push({
        questionId: currentQ.id,
        language: currentQ.language,
        difficulty: currentQ.difficulty,
        category: currentQ.category || 'General',
        selectedAnswer: option,
        correctAnswer: currentQ.answer
      });
    }

    const updatedCorrectArray = [...isCorrectArray, isCorrect];
    const updatedOptionsArray = [...selectedOptionsArray, option];
    setIsCorrectArray(updatedCorrectArray);
    setSelectedOptionsArray(updatedOptionsArray);
    isCorrectArrayRef.current = updatedCorrectArray;
    selectedOptionsArrayRef.current = updatedOptionsArray;

    setFeedbackAnnouncement(isCorrect ? 'Correct!' : 'Incorrect.');

    // Go directly to FEEDBACK — no delay, no timeout, no isMounted race
    setGameState('FEEDBACK');
  };

  const handleNext = () => {
    if (gameState !== 'FEEDBACK' && gameState !== 'ANSWERED') return; // Strict lock

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setShowHint(false);
      setConfidence(null);
      setGameState('PLAYING');
      setFeedbackAnnouncement('');
    } else {
      setGameState('COMPLETED');
    }
  };

  const handlePlayAgain = () => {

    setGameState('IDLE');
    setQuestions([]);
    setCurrentIdx(0);
    setResults(null);
    resetInteractionState();
  };

  const handlePlayAgainSameSettings = () => {
    if (isDailyChallenge) {
      startDailyChallenge();
    } else {
      startGame(selectedLanguage, selectedDifficulty, isPracticeMode, isSpeedMode);
    }
  };



  // RENDER: SETUP PHASES
  if (gameState === 'IDLE') {
    const languages = BUG_HUNTER_CONFIG.options.languages;

    const renderLangIcon = (langObj) => {
      if (langObj.iconType === 'svg') {
        return (
          <svg viewBox="0 0 128 128" className="w-12 h-12 mb-2">
            {langObj.svgPaths.map((p, i) => (
              <path key={i} fill={p.fill} d={p.d} />
            ))}
          </svg>
        );
      }
      if (langObj.iconType === 'lucide' && langObj.iconName === 'Dices') {
        return <Dices size={44} strokeWidth={1.5} className="text-indigo-600 mb-2" />;
      }
      return <Code2 size={44} className="text-slate-400 mb-2" />;
    };

    return (
      <div className="bug-hunter-app flex flex-col w-full h-full max-w-[1100px] mx-auto overflow-y-auto scrollbar-hide py-4 px-2">
        {/* Main Bug Hunter Container */}
        {isInitializing ? (
          <div className="flex flex-col items-center justify-center h-full bg-white rounded-3xl shadow-sm border border-slate-200 min-h-[400px]">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-slate-600 font-medium">Preparing Bug Hunter...</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 flex flex-col relative overflow-hidden">

            {/* Header */}
            <div className="flex justify-between items-start mb-8 w-full shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-[52px] h-[52px] rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
                  <Bug size={28} />
                </div>
                <div>
                  <h2 className="text-[20px] font-bold text-slate-900 tracking-tight leading-tight">Bug Hunter</h2>
                  <p className="text-[14px] font-medium text-slate-500 mt-0.5">Debug faster. Think sharper.</p>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">

                <button onClick={onClose} aria-label="Close Bug Hunter" className="text-slate-400 hover:text-slate-600 border border-slate-200 hover:bg-slate-50 p-1.5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#6C4CF1] rounded-full">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Main Two-Column Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 shrink-0">

              {/* Left Panel */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
                <div>
                  <h1 className="text-[32px] sm:text-[42px] font-extrabold text-slate-900 mb-5 tracking-tight leading-[1.1]">
                    Find the <span className="text-rose-500">bug.</span><br />
                    Beat the <span className="text-indigo-600">clock.</span>
                  </h1>

                  <div className="flex items-start justify-between gap-4 mb-8">
                    <p className="text-[14px] sm:text-[15px] text-slate-600 max-w-[280px] sm:max-w-[300px] leading-relaxed font-medium">
                      Test your debugging skills by finding real programming mistakes in short code snippets. Choose the correct answer, earn points, and sharpen your coding instincts.
                    </p>

                    {/* CSS Illustration */}
                    <div className="hidden sm:block relative w-[210px] h-[140px] bg-[#1E293B] rounded-xl shadow-lg border border-slate-700/50 p-4 mt-[-10px] shrink-0">
                      <div className="flex gap-1.5 mb-4">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-[#EAB308]"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E]"></div>
                      </div>
                      <div className="space-y-2 opacity-80">
                        <div className="w-[80%] h-2 bg-[#60A5FA]/40 rounded-full"></div>
                        <div className="w-[50%] h-2 bg-[#A78BFA]/40 rounded-full ml-6"></div>
                        <div className="w-[70%] h-2 bg-[#4ADE80]/40 rounded-full ml-6"></div>
                        <div className="w-[40%] h-2 bg-[#FACC15]/40 rounded-full ml-10"></div>
                        <div className="w-[60%] h-2 bg-[#60A5FA]/40 rounded-full"></div>
                      </div>
                      {/* Magnifying Glass with Bug */}
                      <div className="absolute -bottom-8 -right-6 flex items-center justify-center z-10 w-28 h-28">
                        <div className="relative w-[72px] h-[72px] rounded-full border-[6px] border-indigo-600 bg-white/10 backdrop-blur-md shadow-[0_0_25px_rgba(108,76,241,0.4)] flex items-center justify-center">
                          <Bug size={36} className="text-rose-500 mt-[-2px] ml-[2px]" />
                        </div>
                        <div className="absolute bottom-1 right-2 w-[10px] h-10 bg-indigo-600 rounded-full rotate-[-45deg] shadow-lg"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-8 pb-8 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#F5F3FF] flex items-center justify-center shrink-0">
                        <Clock size={20} className="text-indigo-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-[13px] leading-tight mb-0.5">Timed</span>
                        <span className="text-slate-500 text-[11px] font-medium">Challenges</span>
                      </div>
                    </div>

                    <div className="hidden sm:block w-px h-10 bg-slate-100 mx-2"></div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                        <Target size={20} className="text-rose-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-[13px] leading-tight mb-0.5">{BUG_HUNTER_CONFIG.session.pointsPerQuestion} Points</span>
                        <span className="text-slate-500 text-[11px] font-medium">per Correct Answer</span>
                      </div>
                    </div>

                    <div className="hidden sm:block w-px h-10 bg-slate-100 mx-2"></div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#FEF9C3] flex items-center justify-center shrink-0">
                        <Brain size={20} className="text-[#CA8A04]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-[13px] leading-tight mb-0.5">Real Coding</span>
                        <span className="text-slate-500 text-[11px] font-medium">Problems</span>
                      </div>
                    </div>
                  </div>

                  {/* Lower Information Card */}
                  <div className="bg-indigo-50/50 rounded-2xl p-5 flex items-center gap-4 w-max pr-12 border border-indigo-600/10">
                    <Lightbulb size={24} className="text-indigo-600 shrink-0" />
                    <p className="text-[14px] text-slate-700 font-medium leading-snug">
                      From beginner-friendly mistakes<br />to challenging logic bugs.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Panel (Language Selection) */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 flex flex-col shadow-sm">
                <div className="mb-6">
                  <h3 className="text-[20px] font-bold text-slate-900">Select your language</h3>
                  <p className="text-[14px] text-slate-500 mt-1 font-medium">Choose the language you want to practice.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-auto">
                  {languages.map(langObj => {
                    const langName = langObj.name;
                    const isSelected = selectedLanguage === langName;
                    return (
                      <button
                        key={langName}
                        onClick={() => {
                          setSelectedLanguage(langName);
                          try { localStorage.setItem('bugHunter_pref_language', langName); } catch { /* ignore */ }
                        }}
                        className={`relative flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl transition-all outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6C4CF1] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-2 ${isSelected
                          ? 'border-indigo-600 bg-indigo-50/50'
                          : 'border-slate-100 hover:border-indigo-600/30 bg-white'
                          } ${langName === 'Random' ? 'sm:col-span-2' : ''}`}
                      >
                        {isSelected && (
                          <div className="absolute -top-[10px] -right-[10px] w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-sm border-2 border-white z-10">
                            <Check size={14} strokeWidth={4} />
                          </div>
                        )}
                        {renderLangIcon(langObj)}
                        <div className="flex flex-col items-center mt-1">
                          <span className={`font-bold text-[15px] ${isSelected ? 'text-indigo-900' : 'text-slate-900'}`}>
                            {langName}
                          </span>
                          {langName === 'Random' && langObj.description && (
                            <span className="text-[12px] text-slate-500 font-medium mt-0.5">
                              {langObj.description}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 flex flex-col items-center">
                  <button
                    onClick={() => setGameState('LANGUAGE_SELECTED')}
                    disabled={!selectedLanguage}
                    className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-[15px] transition-all outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6C4CF1] ${selectedLanguage
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200'
                      : 'bg-slate-50 text-slate-400 cursor-not-allowed border border-slate-100'
                      }`}
                  >
                    {selectedLanguage ? `Continue with ${selectedLanguage}` : 'Continue'} <ArrowRight size={18} />
                  </button>
                  {!selectedLanguage && (
                    <div className="flex items-center gap-1 mt-3 text-[12px] text-slate-400 font-medium">
                      Select a language to continue <Info size={12} />
                    </div>
                  )}
                </div>
              </div>
            </div>




          </div>
        )}
      </div>
    );
  }

  if (gameState === 'LANGUAGE_SELECTED') {
    const difficulties = BUG_HUNTER_CONFIG.options.difficulties;

    let recommendedDiff = null;
    if (stats?.recentActivity) {
      const bhActivity = stats.recentActivity.filter(
        a => a.game === BUG_HUNTER_CONFIG.id && a.language === selectedLanguage && a.status === 'COMPLETED'
      );
      if (bhActivity.length >= 3) {
        const recent3 = bhActivity.slice(0, 3);
        const easyGames = recent3.filter(a => a.difficulty === 'Easy');
        const medGames = recent3.filter(a => a.difficulty === 'Medium');
        const hardGames = recent3.filter(a => a.difficulty === 'Hard');

        const isStrong = (arr) => arr.length >= 2 && (arr.reduce((sum, curr) => sum + (parseFloat(curr.accuracy) || 0), 0) / arr.length) >= 80;
        const isWeak = (arr) => arr.length >= 2 && (arr.reduce((sum, curr) => sum + (parseFloat(curr.accuracy) || 0), 0) / arr.length) < 50;

        if (isStrong(easyGames)) recommendedDiff = 'Medium';
        else if (isStrong(medGames)) recommendedDiff = 'Hard';
        else if (isWeak(medGames)) recommendedDiff = 'Easy';
        else if (isWeak(hardGames)) recommendedDiff = 'Medium';
        else if (recent3.every(a => parseFloat(a.accuracy) >= 60)) recommendedDiff = 'Mixed';
      }
    }

    const masteryIndicators = {};
    if (stats?.recentActivity) {
      const allLangActivity = stats.recentActivity.filter(
        a => a.game === BUG_HUNTER_CONFIG.id && a.language === selectedLanguage && a.status === 'COMPLETED'
      );
      ['Easy', 'Medium', 'Hard'].forEach(diff => {
        const games = allLangActivity.filter(a => a.difficulty === diff);
        let totalQ = 0;
        let totalSolved = 0;
        games.forEach(g => {
          totalQ += (g.totalQuestions || 0);
          totalSolved += (g.questionsSolved || 0);
        });
        if (totalQ >= 10) {
          const acc = Math.round((totalSolved / totalQ) * 100);
          if (acc >= 85) {
            masteryIndicators[diff] = { label: `Excellent: ${acc}%`, style: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
          } else if (acc >= 70) {
            masteryIndicators[diff] = { label: `Strong: ${acc}%`, style: 'bg-blue-50 text-blue-700 border-blue-200' };
          }
        }
      });
    }

    return (
      <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex justify-between items-start mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 text-indigo-600">
              <Bug size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">Choose Difficulty</h2>
              <p className="text-sm font-medium text-slate-500">Language: {selectedLanguage}</p>
            </div>
          </div>
          <button onClick={() => setGameState('IDLE')} className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 p-2 rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto w-full mt-6">
          {difficulties.map(diff => {
            let desc = '';
            let icon = null;
            if (diff === 'Easy') {
              desc = 'Common beginner debugging mistakes.';
              icon = <CheckCircle2 className="text-emerald-500 mb-1" size={24} />;
            }
            else if (diff === 'Medium') {
              desc = 'Multi-step code reasoning.';
              icon = <Target className="text-amber-500 mb-1" size={24} />;
            }
            else if (diff === 'Hard') {
              desc = 'Deeper logic and language behavior.';
              icon = <Brain className="text-rose-500 mb-1" size={24} />;
            }
            else if (diff === 'Mixed') {
              desc = 'A combination of difficulties.';
              icon = <Dices className="text-indigo-500 mb-1" size={24} />;
            }

            const isSelected = selectedDifficulty === diff;

            return (
              <button
                key={diff}
                onClick={() => {
                  setSelectedDifficulty(diff);
                  try { localStorage.setItem('bugHunter_pref_difficulty', diff); } catch { /* ignore */ }
                }}
                className={`relative flex flex-col items-start text-left p-5 sm:p-6 rounded-2xl transition-all outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6C4CF1] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-2 ${isSelected
                  ? 'border-indigo-600 bg-indigo-50/50'
                  : 'border-slate-100 hover:border-indigo-600/30 bg-white'
                  }`}
              >
                {isSelected && (
                  <div className="absolute -top-[10px] -right-[10px] w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-sm border-2 border-white z-10">
                    <Check size={14} strokeWidth={4} />
                  </div>
                )}
                {icon}
                <div className="flex items-center gap-2 mt-2">
                  <span className={`font-bold text-[17px] ${isSelected ? 'text-indigo-900' : 'text-slate-900'}`}>{diff}</span>
                  {recommendedDiff === diff && (
                    <span className="text-[10px] font-bold bg-[#F4F2FF] text-[#6C4CF1] px-1.5 py-0.5 rounded uppercase tracking-wide border border-[#E0D4FF]">
                      Recommended
                    </span>
                  )}
                  {masteryIndicators[diff] && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide border ${masteryIndicators[diff].style}`}>
                      {masteryIndicators[diff].label}
                    </span>
                  )}
                </div>
                <span className="text-sm text-slate-500 font-medium mt-1 leading-snug">{desc}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col items-center max-w-2xl mx-auto w-full">
          <button
            onClick={() => setGameState('CONFIRM_SESSION')}
            disabled={!selectedDifficulty}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-[15px] transition-all outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6C4CF1] ${selectedDifficulty
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200'
              : 'bg-slate-50 text-slate-400 cursor-not-allowed border border-slate-100'
              }`}
          >
            {selectedDifficulty ? 'Continue' : 'Select Difficulty'} <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'CONFIRM_SESSION') {
    const timeLimitMinutes = Math.floor(BUG_HUNTER_CONFIG.session.timerDurationSeconds[selectedDifficulty] / 60);

    return (
      <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex justify-between items-start mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 text-indigo-600">
              <Bug size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">Ready to Hunt?</h2>
              <p className="text-sm font-medium text-slate-500">Confirm your mission parameters.</p>
            </div>
          </div>
          <button onClick={() => setGameState('IDLE')} className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 p-2 rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
            <X size={20} />
          </button>
        </div>

        <div className="max-w-xl mx-auto w-full bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Mission Briefing</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <span className="text-slate-600 font-medium">Target Language</span>
              <span className="font-bold text-slate-900">{selectedLanguage}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <span className="text-slate-600 font-medium">Difficulty Level</span>
              <span className="font-bold text-slate-900">{selectedDifficulty}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <span className="text-slate-600 font-medium">Number of Bugs</span>
              <span className="font-bold text-slate-900">{BUG_HUNTER_CONFIG.session.questionCount}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <span className="text-slate-600 font-medium">Points per Catch</span>
              <span className="font-bold text-slate-900">{BUG_HUNTER_CONFIG.session.pointsPerQuestion} Points</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 font-medium">Time Limit</span>
              <span className="font-bold text-slate-900">{timeLimitMinutes} Minutes</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 max-w-xl mx-auto w-full mt-auto flex-wrap sm:flex-nowrap">
          <button
            onClick={() => setGameState('LANGUAGE_SELECTED')}
            className="flex-1 py-4 rounded-xl font-bold text-[15px] bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400"
          >
            Back
          </button>
          <button
            onClick={() => startGame(selectedLanguage, selectedDifficulty, false, false)}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-[15px] bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600"
          >
            Hunt <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // RENDER: RESULTS PHASE
  if (gameState === 'RESULTS' || gameState === 'COMPLETED' || gameState === 'TIME_EXPIRED') {
    if (!results) {
      return (
        <div className="bug-hunter-app flex flex-col items-center justify-center h-full bg-white rounded-2xl shadow-sm border border-slate-200">

          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
          <p className="text-slate-600 font-medium">Calculating Results...</p>
        </div>
      );
    }
    return (
      <div className="bug-hunter-app h-full w-full">

        <GameResultsView gameResult={{ ...results, questions, isCorrectArray }} onPlayAgain={handlePlayAgain} onPlayAgainSameSettings={handlePlayAgainSameSettings} onClose={onClose} />
      </div>
    );
  }

  // RENDER: PLAYING PHASE
  if (questions.length === 0) {
    return (
      <div className="bug-hunter-app flex flex-col items-center justify-center h-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">

        <Bug size={48} className="text-slate-300 mb-4" />
        <h3 className="text-lg font-bold text-slate-900 mb-2">No Bugs Found</h3>
        <p className="text-slate-500 mb-6">We couldn't find enough bugs for {selectedLanguage} at {selectedDifficulty} difficulty.</p>
        <button
          onClick={() => setGameState('IDLE')}
          className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700"
        >
          Try Another Pool
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIdx];

  return (
    <div className="bug-hunter-app flex flex-col min-h-full bg-white">

      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-50 border-b border-slate-100 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between shrink-0 gap-2 shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3 shrink min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <Bug size={18} className="sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-slate-900 leading-tight text-sm sm:text-base truncate">Bug Hunter</h2>
            <div className="text-[10px] sm:text-xs font-medium text-slate-500 flex items-center gap-1 sm:gap-1.5 truncate">
              <span className="truncate">{selectedLanguage}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0"></span>
              <span className="truncate">{selectedDifficulty}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0"></span>
              <span className="font-semibold text-indigo-600 shrink-0">
                <span className="hidden sm:inline">Bug {currentIdx + 1} of {questions.length}</span>
                <span className="sm:hidden">B{currentIdx + 1}/{questions.length}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 md:gap-6 shrink-0">

          <div className="flex flex-col items-end shrink-0">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">Score</span>
            <span className="font-bold text-indigo-600 tabular-nums text-sm sm:text-base">{score}</span>
          </div>

          {isPracticeMode ? (
            <div className="flex flex-col items-end shrink-0 ml-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Mode</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded border border-emerald-200 bg-emerald-50 text-emerald-700">Practice</span>
            </div>
          ) : isSpeedMode ? (
            <GameTimer
              // eslint-disable-next-line react-hooks/refs
              key={sessionIdRef.current || 'default'}
              isActive={gameState === 'PLAYING' || gameState === 'ANSWERED' || gameState === 'FEEDBACK'}
              duration={BUG_HUNTER_CONFIG.session.speedModeTimerDurationSeconds?.[selectedDifficulty] || 150}
              onExpire={handleTimerExpire}
              setTimerAnnouncement={setTimerAnnouncement}
            />
          ) : (
            <GameTimer
              // eslint-disable-next-line react-hooks/refs
              key={sessionIdRef.current || 'default'}
              isActive={gameState === 'PLAYING' || gameState === 'ANSWERED' || gameState === 'FEEDBACK'}
              duration={BUG_HUNTER_CONFIG.session.timerDurationSeconds[selectedDifficulty] || 600}
              onExpire={handleTimerExpire}
              setTimerAnnouncement={setTimerAnnouncement}
            />
          )}

          <button onClick={() => { if (onClose) onClose(); else setGameState('IDLE'); }} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-full transition-colors" aria-label="Exit game">
            <X size={20} />
          </button>
        </div>
      </div>

      {showGlossary && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" aria-hidden="true" onClick={() => setShowGlossary(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg max-h-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-lg">Terms Glossary</h3>
              </div>
              <button
                onClick={() => setShowGlossary(false)}
                className="text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-5 overflow-y-auto">
              <div className="flex flex-col gap-4">
                {BUG_HUNTER_GLOSSARY.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-sm font-bold text-indigo-700 block mb-1">{item.term}</span>
                    <p className="text-sm text-slate-700">{item.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}



      {/* Progress Bar */}
      <div className={`w-full h-1.5 bg-slate-100 shrink-0 transition-all`}>
        <div
          className="h-full bg-indigo-500 transition-all duration-300"
          style={{ width: `${((currentIdx) / questions.length) * 100}%` }}
        />
      </div>

      {/* Announcements for Screen Readers */}
      <div className="sr-only" aria-live="assertive">{timerAnnouncement}</div>
      <div className="sr-only" aria-live="assertive">{feedbackAnnouncement}</div>

      {/* Game Content Area */}
      <div className="flex-1 p-4 sm:p-5 md:p-6">
        <div className="max-w-4xl mx-auto flex flex-col">

          <div className="mb-2 flex flex-wrap items-center gap-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Bug {currentIdx + 1} of {questions.length}
            </div>
            <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0"></span>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase tracking-wide shrink-0">
              {selectedDifficulty}
            </span>
            {selectedDifficulty === 'Mixed' && currentQ.difficulty && (
              <>
                <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0"></span>
                <span className="text-[10px] font-bold bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded uppercase tracking-wide shrink-0">
                  {currentQ.difficulty}
                </span>
              </>
            )}
            {currentQ.bugType && (
              <>
                <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0"></span>
                <span className="text-[10px] font-bold bg-[#F4F2FF] text-[#6C4CF1] px-2 py-0.5 rounded uppercase tracking-wide shrink-0">
                  {currentQ.bugType}
                </span>
              </>
            )}
            {currentQ.questionType === 'code-output' && (
              <>
                <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0"></span>
                <span className="text-[10px] font-bold bg-fuchsia-100 text-fuchsia-700 px-2 py-0.5 rounded uppercase tracking-wide shrink-0">
                  Code Output
                </span>
              </>
            )}
            {currentQ.questionType === 'behavior-prediction' && (
              <>
                <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0"></span>
                <span className="text-[10px] font-bold bg-teal-100 text-teal-700 px-2 py-0.5 rounded uppercase tracking-wide shrink-0">
                  Behavior Analysis
                </span>
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-4 mb-3">
            <h3
              ref={questionHeadingRef}
              tabIndex={-1}
              className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 outline-none"
            >
              {currentQ.question}
            </h3>
            <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">

              {currentQ.hint && (
                <button
                  onClick={() => setShowHint(true)}
                  disabled={showHint || gameState !== 'PLAYING'}
                  className="flex items-center gap-1.5 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  aria-label="Show hint"
                >
                  <Lightbulb size={16} strokeWidth={2.5} />
                  Hint
                </button>
              )}

            </div>
          </div>



          {showHint && currentQ.hint && (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-xl mb-3 text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <Info size={18} className="shrink-0 mt-0.5 text-amber-600" />
              <p className="font-medium">{currentQ.hint}</p>
            </div>
          )}

          {/* Code Snippet Block */}
          <div className="bg-slate-900 rounded-xl overflow-hidden mb-4 shadow-sm border border-slate-800">
            <div className="bg-slate-800/50 px-4 py-2 border-b border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Code2 size={16} className="text-slate-400" />
                <span className="text-xs font-mono text-slate-300">{currentQ.language}</span>
              </div>

              {(() => {
                const safeConcept = getSafeConcept(currentQ);
                return safeConcept ? (
                  <div className="flex items-center gap-1.5 opacity-80" title="Debugging Concept">
                    <Tag size={12} className="text-indigo-400" />
                    <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">
                      {safeConcept}
                    </span>
                  </div>
                ) : null;
              })()}
            </div>
            <div tabIndex={0} className="overflow-auto max-h-[50vh] min-h-[150px] w-full py-3 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 bg-[#0d1117]">
              <pre className={`font-mono text-[13px] sm:text-sm md:text-[15px] text-slate-300 leading-[1.65] min-w-max m-0`}>
                <code className="block">
                  {currentQ.code.split('\n').map((line, i) => {
                    const isTargetLine = (gameState === 'FEEDBACK' || gameState === 'ANSWERED') && currentQ.affectedLine === i + 1;
                    return (
                      <div
                        key={i}
                        className={`flex transition-colors group px-2 ${isTargetLine
                          ? 'bg-rose-500/20 border-l-2 border-rose-500 -ml-[2px]'
                          : 'hover:bg-white/5 border-l-2 border-transparent -ml-[2px]'
                          }`}
                      >

                          <span className={`w-8 md:w-12 shrink-0 text-right pr-3 md:pr-4 select-none font-mono text-[11px] md:text-xs pt-[3px] border-r border-slate-700/50 mr-4 flex items-center justify-end gap-1.5 ${isTargetLine ? 'text-rose-400' : 'text-slate-600 group-hover:text-slate-400'
                            }`}>
                            {isTargetLine && <Bug size={10} className="text-rose-400 shrink-0" />}
                            {i + 1}
                          </span>
                        <span className={`whitespace-pre flex-1 ${isTargetLine ? 'text-rose-100 font-semibold' : ''}`}>
                          {line || ' '}
                        </span>
                      </div>
                    );
                  })}
                </code>
              </pre>
            </div>
          </div>



          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-2 mb-4">
            {currentQ.options.map((option, idx) => (
              <AnswerOption
                key={idx}
                option={option}
                isSelected={selectedOption === option}
                isCorrect={option === currentQ.answer}
                isFeedbackState={gameState === 'FEEDBACK' || gameState === 'ANSWERED'}
                isPendingEvaluation={false}
                isDisabled={gameState !== 'PLAYING'}
                onSelect={handleAnswerSelect}
                questionType={currentQ.questionType}
              />
            ))}
          </div>



          {/* Explanation Area */}
          {(gameState === 'FEEDBACK' || gameState === 'ANSWERED') && selectedOption && (
            <div className="mt-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-4">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
                  <div className={`flex items-center gap-2 font-bold ${selectedOption === currentQ.answer ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {selectedOption === currentQ.answer ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                    {selectedOption === currentQ.answer ? 'Correct!' : 'Incorrect'}
                  </div>
                  <div className="flex flex-wrap gap-2 justify-end">
                    {currentQ.category && (
                      <div className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                        {currentQ.category}
                      </div>
                    )}
                    {currentQ.tags && currentQ.tags.filter(t => !['beginner', 'logic'].includes(t.toLowerCase())).slice(0, 1).map(tag => (
                      <div key={tag} className="bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>

                {selectedOption === currentQ.answer && [2, 3, 5, 10, 15, 20].includes(sessionStreak) && (
                  <div className="mb-6 bg-orange-50 border border-orange-200 text-orange-700 px-4 py-3 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <Flame className="text-orange-500 fill-orange-500 shrink-0" size={18} />
                    <span className="font-bold text-sm">{sessionStreak} bugs found in a row.</span>
                  </div>
                )}

                <div className="mb-6">
                  {renderExplanation(currentQ)}
                </div>

                {currentQ.affectedLine && (
                  <div className="bg-white rounded-xl border border-slate-100 p-4 mb-6">
                    <div className="col-span-1 md:col-span-2">
                      <span className="text-xs font-bold text-slate-400 uppercase">Bug Location: </span>
                      <span className="text-sm font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Line {currentQ.affectedLine}</span>
                    </div>
                  </div>
                )}



                {selectedOption !== currentQ.answer && (
                  <>
                    {currentQ.incorrectExplanations && currentQ.incorrectExplanations[selectedOption] && (
                      <div className="mb-6 bg-white border border-slate-100 p-4 rounded-xl">
                        <span className="text-sm font-bold text-rose-600 flex items-center gap-1.5 mb-1">
                          <X size={16} /> Why wasn't your answer the issue?
                        </span>
                        <p className="text-slate-700 text-sm leading-relaxed">
                          {currentQ.incorrectExplanations[selectedOption]}
                        </p>
                      </div>
                    )}

                    {currentQ.takeaway && (
                      <div className="mb-6 bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl">
                        <span className="text-sm font-bold text-indigo-700 flex items-center gap-1.5 mb-1">
                          <Lightbulb size={16} /> Debugging Takeaway
                        </span>
                        <p className="text-indigo-900 text-sm leading-relaxed">
                          {currentQ.takeaway}
                        </p>
                      </div>
                    )}
                  </>
                )}

                {currentQ.correctedCode && (
                  <div className="bg-emerald-50/50 rounded-xl border border-emerald-100 overflow-hidden mb-6">
                    <div className="bg-emerald-100/50 px-4 py-2 border-b border-emerald-100 flex items-center gap-2">
                      <Code2 size={16} className="text-emerald-700" />
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Corrected Code</span>
                    </div>
                    <div className="p-4 overflow-auto max-h-[30vh] outline-none">
                      <pre className="font-mono text-[13px] sm:text-sm text-emerald-900 leading-relaxed w-fit min-w-full">
                        <code>{currentQ.correctedCode}</code>
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Next Question Action */}
          {(gameState === 'FEEDBACK' || gameState === 'ANSWERED') && selectedOption && (
            <div className="flex justify-end mb-6 animate-in fade-in zoom-in-95 mt-6">
              <button
                onClick={handleNext}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6C4CF1] outline-none"
              >
                <span className="font-bold relative z-10">
                  {currentIdx < questions.length - 1 ? 'Next Question' : 'View Results'}
                </span>  <ArrowRight size={18} />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
