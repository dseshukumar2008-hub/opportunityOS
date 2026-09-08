import { useState, useEffect, useRef } from 'react';
import { Brain, Clock, CheckCircle2, XCircle, ArrowRight, X } from 'lucide-react';
import { getRandomCareerQuestions } from '../data/careerQuizQuestions';
import GameResultsView from './GameResultsView';
import { useGameCompletion } from '../hooks/useGameCompletion';

export default function CareerQuizGame({ onClose }) {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes for a calm experience
  const [isPlaying, setIsPlaying] = useState(true);
  const [results, setResults] = useState(null);
  
  // State for the current question's interaction
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrectArray, setIsCorrectArray] = useState([]);
  
  // Accessibility state
  const [timerAnnouncement, setTimerAnnouncement] = useState('');
  const [feedbackAnnouncement, setFeedbackAnnouncement] = useState('');
  const questionHeadingRef = useRef(null);

  const { handleGameCompletion } = useGameCompletion();
  const timerRef = useRef(null);
  const isMounted = useRef(true);
  const isCorrectArrayRef = useRef([]);
  const isFinishedRef = useRef(false);
  const sessionIdRef = useRef(null);
  const hasAnsweredRef = useRef(false);
  const isTransitioningRef = useRef(false);

  useEffect(() => {
    isCorrectArrayRef.current = isCorrectArray;
  }, [isCorrectArray]);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const initGame = () => {
    sessionIdRef.current = Date.now().toString();
    setQuestions(getRandomCareerQuestions(10));
    setCurrentIdx(0);
    setTimeLeft(600);
    setIsPlaying(true);
    setResults(null);
    setSelectedOption(null);
    setShowExplanation(false);
    setIsCorrectArray([]);
    isCorrectArrayRef.current = [];
    isFinishedRef.current = false;
    hasAnsweredRef.current = false;
    isTransitioningRef.current = false;
  };

  useEffect(() => {
    hasAnsweredRef.current = false;
    isTransitioningRef.current = false;
  }, [currentIdx]);


  useEffect(() => {
    initGame();
  }, []);

  // Manage focus when navigating questions
  useEffect(() => {
    if (questionHeadingRef.current && isPlaying) {
      questionHeadingRef.current.focus();
    }
  }, [currentIdx, isPlaying]);

  const finishGame = (finalCorrectArr) => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    setIsPlaying(false);
    clearInterval(timerRef.current);

    const score = finalCorrectArr.filter(c => c).length * 10;
    const accuracy = finalCorrectArr.length > 0 ? Math.round((finalCorrectArr.filter(c => c).length / finalCorrectArr.length) * 100) + '%' : '0%';
    
    const gameResult = {
      sessionId: sessionIdRef.current,
      game: 'Career Quiz',
      score,
      accuracy,
      isCorrectArray: finalCorrectArr
    };

    // Immediately show optimistic results to prevent UI from being stuck
    if (isMounted.current) {
      setResults({
        ...gameResult,
        streak: 0,
        isNewHighScore: false,
        xpEarned: score,
        earnedDailyReward: false
      });
    }

    // Fire and forget save operation
    handleGameCompletion(gameResult, isMounted)
      .then(finalResults => {
        if (finalResults && isMounted.current) {
          if (finalResults.earnedDailyReward) {
            finalResults.xpEarned += 100;
          }
          setResults(finalResults);
        }
      })
      .catch(err => {
        console.error('Failed to save game state:', err);
      });
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            finishGame(isCorrectArrayRef.current);
            return 0;
          }
          
          if (prev === 300) setTimerAnnouncement('5 minutes remaining');
          else if (prev === 60) setTimerAnnouncement('1 minute remaining');
          else if (prev === 30) setTimerAnnouncement('30 seconds remaining');
          else if (prev === 10) setTimerAnnouncement('10 seconds remaining, hurry up!');

          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  const handleOptionClick = (option) => {
    if (selectedOption || !isPlaying || hasAnsweredRef.current || isTransitioningRef.current) return;
    
    hasAnsweredRef.current = true;
    setSelectedOption(option);
    const isCorrect = option === questions[currentIdx].answer;
    const newCorrectArr = [...isCorrectArray, isCorrect];
    setIsCorrectArray(newCorrectArr);
    isCorrectArrayRef.current = newCorrectArr;
    setShowExplanation(true);
    setFeedbackAnnouncement(isCorrect ? 'Correct!' : 'Incorrect.');
  };

  const handleNextQuestion = () => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      finishGame(isCorrectArray);
    }
  };

  if (results) {
    return (
      <GameResultsView 
        gameResult={results} 
        onPlayAgain={initGame}
        onClose={onClose}
      />
    );
  }

  if (questions.length === 0) return null;

  const q = questions[currentIdx];
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Game Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 gap-4 bg-white border-b border-slate-100 shrink-0">
        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 shrink-0 bg-[#EBF5FF] border border-blue-500/20 rounded-[14px] flex items-center justify-center">
              <Brain size={24} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-slate-900 leading-tight">Career Quiz</h2>
              <p className="text-[13px] font-medium text-slate-500">Question {currentIdx + 1} of {questions.length}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            aria-label="Close Career Quiz" 
            className="sm:hidden text-slate-400 hover:text-slate-600 border border-slate-200 hover:bg-slate-50 p-1.5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-8 w-full sm:w-auto">
          <div className="text-right">
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-0.5" aria-hidden="true">Score</p>
            <p className="text-[24px] font-black text-blue-600 leading-none tabular-nums" aria-label={`Score: ${isCorrectArray.filter(c=>c).length * 10} points`}>{isCorrectArray.filter(c=>c).length * 10}</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl" aria-hidden="true">
            <Clock size={16} className="text-slate-400" />
            <span className="text-[20px] font-black text-slate-700 tabular-nums">
              {mins}:{secs.toString().padStart(2, '0')}
            </span>
          </div>
          <button 
            onClick={onClose} 
            aria-label="Close Career Quiz" 
            className="hidden sm:flex text-slate-400 hover:text-slate-600 border border-slate-200 hover:bg-slate-50 p-1.5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-full shrink-0"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div
        role="progressbar"
        aria-valuenow={currentIdx}
        aria-valuemin={0}
        aria-valuemax={questions.length}
        aria-label="Quiz progress"
        className="w-full h-1 bg-slate-200 shrink-0"
      >
        <div 
          className="h-full bg-blue-500 transition-all duration-300" 
          style={{ width: `${(currentIdx / questions.length) * 100}%` }}
        />
      </div>

      {/* Game Content */}
      <div className="flex-1 overflow-y-auto min-h-0 p-8">
        
        {/* ARIA Live Regions */}
        <div aria-live="assertive" className="sr-only">{timerAnnouncement}</div>
        <div aria-live="polite" className="sr-only">{feedbackAnnouncement}</div>

        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <h3 
            ref={questionHeadingRef}
            tabIndex={-1}
            className="text-[20px] md:text-[24px] font-bold text-slate-900 text-center mb-8 leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
          >
            {q.question}
          </h3>
          
          <div className="flex flex-col gap-3 w-full max-w-xl mb-8">
            {q.options.map((opt, i) => {
              let btnClass = "bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50 shadow-sm";
              
              if (showExplanation) {
                if (opt === q.answer) {
                  btnClass = "bg-green-50 border-2 border-green-500 text-green-700 shadow-md";
                } else if (selectedOption === opt) {
                  btnClass = "bg-red-50 border-2 border-red-500 text-red-700 shadow-md";
                } else {
                  btnClass = "bg-white border-2 border-slate-200 text-slate-400 opacity-50 cursor-default";
                }
              } else if (selectedOption === opt) {
                btnClass = "bg-blue-50 border-2 border-blue-500 text-blue-700 shadow-md transform scale-[1.02]";
              }

              return (
                <button
                  key={i}
                  onClick={() => handleOptionClick(opt)}
                  aria-disabled={showExplanation}
                  aria-pressed={selectedOption === opt}
                  className={`p-4 rounded-xl text-[15px] font-bold transition-all text-left flex items-center justify-between focus-visible:ring-2 focus-visible:ring-blue-500 outline-none ${btnClass}`}
                >
                  <span>{opt}</span>
                  {showExplanation && opt === q.answer && <CheckCircle2 size={20} className="text-green-600 shrink-0 ml-4" aria-hidden="true" />}
                  {showExplanation && selectedOption === opt && opt !== q.answer && <XCircle size={20} className="text-red-600 shrink-0 ml-4" aria-hidden="true" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Section */}
          {showExplanation && (
            <div className="w-full max-w-xl animate-fade-in-up flex flex-col gap-6">
              <div aria-live="polite" className={`p-5 rounded-2xl border-2 ${selectedOption === q.answer ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {selectedOption === q.answer ? (
                    <span className="text-[14px] font-black text-green-700 uppercase tracking-wider">Correct!</span>
                  ) : (
                    <span className="text-[14px] font-black text-amber-700 uppercase tracking-wider">Not quite...</span>
                  )}
                </div>
                <p className="text-[15px] font-medium text-slate-700 leading-relaxed">
                  {q.explanation}
                </p>
              </div>
              
              <button
                onClick={handleNextQuestion}
                disabled={!isPlaying}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-bold text-[16px] transition-colors shadow-md shadow-blue-500/20 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 outline-none disabled:opacity-75 disabled:cursor-wait"
              >
                {!isPlaying ? "Saving Results..." : (currentIdx + 1 < questions.length ? "Next Question" : "Finish Quiz")}
                {isPlaying && <ArrowRight size={20} />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
