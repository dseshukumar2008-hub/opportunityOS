import { useState, useEffect, useRef } from 'react';
import { Brain, Clock, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
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

  const { handleGameCompletion } = useGameCompletion();
  const timerRef = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  const initGame = () => {
    setQuestions(getRandomCareerQuestions(10));
    setCurrentIdx(0);
    setTimeLeft(600);
    setIsPlaying(true);
    setResults(null);
    setSelectedOption(null);
    setShowExplanation(false);
    setIsCorrectArray([]);
  };

  useEffect(() => {
    initGame();
  }, []);

  const finishGame = async (finalCorrectArr) => {
    setIsPlaying(false);
    clearInterval(timerRef.current);

    const score = finalCorrectArr.filter(c => c).length * 50;
    const accuracy = finalCorrectArr.length > 0 ? Math.round((finalCorrectArr.filter(c => c).length / finalCorrectArr.length) * 100) + '%' : '0%';
    
    const gameResult = {
      game: 'Career Quiz',
      score,
      accuracy,
      isCorrectArray: finalCorrectArr
    };

    const finalResults = await handleGameCompletion(gameResult, isMounted);
    if (finalResults) {
      // CareerQuiz adds a potential 100 extra XP for daily reward inside the component display
      if (finalResults.earnedDailyReward) {
        finalResults.xpEarned += 100;
      }
      setResults(finalResults);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            finishGame(isCorrectArray);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, isCorrectArray]);

  const handleOptionClick = (option) => {
    if (selectedOption || !isPlaying) return;
    
    setSelectedOption(option);
    const isCorrect = option === questions[currentIdx].answer;
    const newCorrectArr = [...isCorrectArray, isCorrect];
    setIsCorrectArray(newCorrectArr);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
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
      <div className="flex items-center justify-between p-6 bg-white border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 shrink-0 bg-[#EBF5FF] border border-blue-500/20 rounded-[14px] flex items-center justify-center">
            <Brain size={24} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-[20px] font-bold text-slate-900 leading-tight">Career Quiz</h2>
            <p className="text-[13px] font-medium text-slate-500">Question {currentIdx + 1} of {questions.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="text-right">
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Score</p>
            <p className="text-[24px] font-black text-blue-600 leading-none tabular-nums">{isCorrectArray.filter(c=>c).length * 50}</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl">
            <Clock size={16} className="text-slate-400" />
            <span className="text-[20px] font-black text-slate-700 tabular-nums">
              {mins}:{secs.toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-slate-200 shrink-0">
        <div 
          className="h-full bg-blue-500 transition-all duration-300" 
          style={{ width: `${(currentIdx / questions.length) * 100}%` }}
        />
      </div>

      {/* Game Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <h3 className="text-[20px] md:text-[24px] font-bold text-slate-900 text-center mb-8 leading-relaxed">
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
                  btnClass = "bg-white border-2 border-slate-200 text-slate-400 opacity-50 cursor-not-allowed";
                }
              } else if (selectedOption === opt) {
                btnClass = "bg-blue-50 border-2 border-blue-500 text-blue-700 shadow-md transform scale-[1.02]";
              }

              return (
                <button
                  key={i}
                  onClick={() => handleOptionClick(opt)}
                  disabled={showExplanation}
                  className={`p-4 rounded-xl text-[15px] font-bold transition-all text-left flex items-center justify-between ${btnClass}`}
                >
                  <span>{opt}</span>
                  {showExplanation && opt === q.answer && <CheckCircle2 size={20} className="text-green-600 shrink-0 ml-4" />}
                  {showExplanation && selectedOption === opt && opt !== q.answer && <XCircle size={20} className="text-red-600 shrink-0 ml-4" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Section */}
          {showExplanation && (
            <div className="w-full max-w-xl animate-fade-in-up flex flex-col gap-6">
              <div className={`p-5 rounded-2xl border-2 ${selectedOption === q.answer ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
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
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-bold text-[16px] transition-colors shadow-md shadow-blue-500/20"
              >
                {currentIdx + 1 < questions.length ? "Next Question" : "Finish Quiz"}
                <ArrowRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
