import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Zap } from 'lucide-react';
import { getRandomSprintQuestions } from '../data/skillSprintQuestions';
import GameResultsView from './GameResultsView';
import { useGameCompletion } from '../hooks/useGameCompletion';

export default function SkillSprintGame({ onClose }) {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(true);
  const [results, setResults] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrectArray, setIsCorrectArray] = useState([]);

  const { handleGameCompletion } = useGameCompletion();
  const timerRef = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    setQuestions(getRandomSprintQuestions(15));
  }, []);

  const finishGame = async (finalCorrectArr) => {
    setIsPlaying(false);
    clearInterval(timerRef.current);

    const score = finalCorrectArr.filter(c => c).length * 100;
    const accuracy = finalCorrectArr.length > 0 ? Math.round((finalCorrectArr.filter(c => c).length / finalCorrectArr.length) * 100) + '%' : '0%';
    
    const gameResult = {
      game: 'Skill Sprint',
      score,
      accuracy,
      isCorrectArray: finalCorrectArr
    };

    const finalResults = await handleGameCompletion(gameResult, isMounted);
    if (finalResults) {
      setResults(finalResults);
    }
  };

  // Controls the 60-second countdown timer.
  // The timer automatically clears itself when a user selects an option
  // or when the component unmounts to prevent state leaks.
  useEffect(() => {
    if (isPlaying && !selectedOption) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, selectedOption]);

  // Handle timeout
  useEffect(() => {
    if (timeLeft === 0 && isPlaying && !selectedOption) {
      setSelectedOption('TIMEOUT'); // prevent clicking
      const newCorrectArr = [...isCorrectArray, false];
      setIsCorrectArray(newCorrectArr);

      setTimeout(() => {
        if (!isMounted.current) return;
        setSelectedOption(null);
        if (currentIdx + 1 < questions.length) {
          setCurrentIdx(prev => prev + 1);
          setTimeLeft(60);
        } else {
          finishGame(newCorrectArr);
        }
      }, 600);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isPlaying, selectedOption]);

  const handleOptionClick = (option) => {
    if (selectedOption || !isPlaying || timeLeft === 0) return;
    
    setSelectedOption(option);
    const isCorrect = option === questions[currentIdx].answer;
    const newCorrectArr = [...isCorrectArray, isCorrect];
    setIsCorrectArray(newCorrectArr);

    setTimeout(() => {
      if (!isMounted.current) return;
      setSelectedOption(null);
      if (currentIdx + 1 < questions.length) {
        setCurrentIdx(prev => prev + 1);
        setTimeLeft(60);
      } else {
        finishGame(newCorrectArr);
      }
    }, 600);
  };

  if (results) {
    return (
      <GameResultsView 
        gameResult={results} 
        onPlayAgain={() => {
          setQuestions(getRandomSprintQuestions(15));
          setCurrentIdx(0);
          setTimeLeft(60);
          setIsPlaying(true);
          setResults(null);
          setSelectedOption(null);
          setIsCorrectArray([]);
        }}
        onClose={onClose}
      />
    );
  }

  if (questions.length === 0) return null;

  const q = questions[currentIdx];
  const score = isCorrectArray.filter(c => c).length * 100;
  const currentQNum = currentIdx + 1;
  const totalQ = questions.length;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-4 h-full flex flex-col overflow-y-auto scrollbar-hide bg-[#F8FAFC]">
      
      {/* 1. TOP HEADER */}
      <div className="flex items-center mb-4 shrink-0">
        <div className="flex items-center gap-6 flex-1 min-w-0">
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-sm shrink-0"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex items-center gap-4 shrink-0">
            <div className="w-14 h-14 bg-[#F3F0FF] rounded-2xl flex items-center justify-center shrink-0 border border-[#6C4CF1]/20">
              <Zap size={28} className="text-[#6C4CF1] fill-[#6C4CF1]" />
            </div>
            <div className="min-w-0">
              <h1 className="text-[24px] font-bold text-slate-900 leading-tight flex items-center gap-2 truncate">
                Skill Sprint <Zap size={20} className="text-[#6C4CF1] fill-[#6C4CF1] shrink-0" />
              </h1>
              <p className="text-[14px] font-medium text-slate-500 truncate">
                Question {currentQNum} of {totalQ}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 shrink-0 pr-4 pl-4 overflow-visible">
          <div className="text-right">
            <p className="text-[13px] font-medium text-slate-500 mb-0.5">Score</p>
            <p className="text-[28px] font-black text-[#6C4CF1] leading-none tabular-nums">{score}</p>
          </div>
          
          <div className="h-16 w-[1px] bg-slate-200 shrink-0" />
          
          <div className="w-[84px] h-[84px] rounded-full border-[5px] border-slate-100 flex flex-col items-center justify-center relative shrink-0 overflow-visible">
            <svg className="absolute inset-0 w-full h-full -rotate-90 overflow-visible">
              <circle cx="37" cy="37" r="37" fill="transparent" stroke="transparent" strokeWidth="5" />
              <circle cx="37" cy="37" r="37" fill="transparent" stroke="#6C4CF1" strokeWidth="5" 
                strokeDasharray="232" 
                strokeDashoffset={232 - (232 * timeLeft) / 60} 
                className="transition-all duration-1000 ease-linear"
                style={{ transformOrigin: 'center', transform: 'translate(5px, 5px)' }}
              />
            </svg>
            <div className="text-[22px] font-black text-slate-900 z-10 tabular-nums leading-none mb-0.5">{timeLeft}</div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider z-10 leading-none">sec</div>
          </div>
        </div>
      </div>

      {/* 2. PROGRESS SECTION */}
      <div className="bg-white border border-slate-200 rounded-[20px] px-8 py-4 shadow-sm mb-4 flex items-center gap-8 shrink-0">
        <div className="shrink-0 text-[15px] font-medium text-slate-700">
          Question <span className="font-bold text-[#6C4CF1]">{currentQNum}</span> of {totalQ}
        </div>
        
        <div className="flex-1 flex items-center justify-between relative h-8">
          {/* Progress Line */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-slate-100 z-0"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#6C4CF1] z-0 transition-all duration-300"
            style={{ width: `${(Math.max(1, currentQNum) / totalQ) * 100}%` }}
          ></div>
          
          {/* Progress Circles */}
          {[1, 2, 3, 4, 5, '...', 15].map((step, idx) => {
            if (step === '...') {
              return (
                <div key="dots" className="w-8 h-8 flex items-center justify-center bg-white z-10 text-slate-400 font-bold tracking-widest text-[14px]">
                  ...
                </div>
              );
            }
            
            const isCompleted = step < currentQNum;
            const isActive = step === currentQNum;
            
            return (
              <div 
                key={step} 
                className={`w-8 h-8 rounded-full flex items-center justify-center z-10 text-[13px] font-bold transition-colors ${
                  isActive 
                    ? 'bg-[#6C4CF1] text-white shadow-[0_0_0_4px_white,0_0_0_6px_rgba(108,76,241,0.2)]'
                    : isCompleted
                      ? 'bg-[#F3F0FF] text-[#6C4CF1] border-2 border-[#6C4CF1] shadow-[0_0_0_4px_white]'
                      : 'bg-white text-slate-400 border-2 border-slate-200 shadow-[0_0_0_4px_white]'
                }`}
              >
                {step}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. MAIN QUESTION CARD */}
      <div className="bg-white border border-slate-200 rounded-[24px] p-6 md:p-8 shadow-sm flex flex-col items-center flex-1 min-h-0 justify-center">
        <div className="flex items-center gap-2 bg-[#F3F0FF] text-[#6C4CF1] px-4 py-1.5 rounded-full text-[12px] font-bold tracking-wide uppercase mb-6 border border-[#6C4CF1]/20 shrink-0">
          <Zap size={14} className="fill-[#6C4CF1]" /> QUICK CHALLENGE
        </div>
        
        <h2 className="text-[24px] md:text-[28px] font-bold text-slate-900 text-center mb-8 leading-tight max-w-3xl shrink-0">
          {q.question}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl shrink-0">
          {q.options.map((opt, i) => {
            const letters = ['A', 'B', 'C', 'D'];
            const letter = letters[i];
            
            let cardClass = "bg-white border border-slate-200 hover:border-[#6C4CF1]/40 hover:shadow-md hover:-translate-y-0.5 cursor-pointer";
            let letterBgClass = "bg-[#F3F0FF] text-[#6C4CF1]";
            let textClass = "text-slate-700";
            
            if (selectedOption === opt) {
              if (opt === q.answer) {
                cardClass = "bg-green-50 border-green-500 shadow-sm cursor-default";
                letterBgClass = "bg-green-100 text-green-700";
                textClass = "text-green-800 font-bold";
              } else {
                cardClass = "bg-red-50 border-red-500 shadow-sm cursor-default";
                letterBgClass = "bg-red-100 text-red-700";
                textClass = "text-red-800 font-bold";
              }
            } else if (selectedOption && opt === q.answer) {
              cardClass = "bg-green-50/50 border-green-400 shadow-sm cursor-default";
              letterBgClass = "bg-green-100 text-green-700";
              textClass = "text-green-800 font-bold";
            } else if (selectedOption) {
              cardClass = "bg-white border-slate-200 opacity-50 cursor-default";
            }

            return (
              <button
                key={i}
                onClick={() => handleOptionClick(opt)}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 ${cardClass}`}
                disabled={!!selectedOption}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[16px] font-bold shrink-0 ${letterBgClass}`}>
                  {letter}
                </div>
                <div className={`text-[15px] md:text-[16px] font-medium leading-tight ${textClass}`}>
                  {opt}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
    </div>
  );
}
