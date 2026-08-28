import { useState, useEffect, useRef } from 'react';
import { Puzzle, Clock } from 'lucide-react';
import { getRandomTechPairs } from '../data/techMatchPairs';
import GameResultsView from './GameResultsView';
import { useGameCompletion } from '../hooks/useGameCompletion';

export default function TechMatchGame({ onClose }) {
  const [pairs, setPairs] = useState([]);
  const [shuffledTechs, setShuffledTechs] = useState([]);
  const [shuffledCategories, setShuffledCategories] = useState([]);
  
  const [selectedTech, setSelectedTech] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [validationState, setValidationState] = useState('none'); // 'none', 'correct', 'wrong'
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isPlaying, setIsPlaying] = useState(true);
  const [results, setResults] = useState(null);

  const { handleGameCompletion } = useGameCompletion();
  const timerRef = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

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

  const initGame = () => {
    const selectedPairs = getRandomTechPairs(6);
    setPairs(selectedPairs);
    setShuffledTechs(shuffleArray(selectedPairs.map(p => p.tech)));
    setShuffledCategories(shuffleArray(selectedPairs.map(p => p.category)));
    setMatchedPairs([]);
    setMistakes(0);
    setSelectedTech(null);
    setSelectedCategory(null);
    setValidationState('none');
    setTimeLeft(300);
    setIsPlaying(true);
    setResults(null);
  };

  useEffect(() => {
    initGame();
  }, []);

  const finishGame = async (finalMatchedCount, finalMistakes) => {
    if (!isPlaying) return; // Prevent double firing
    setIsPlaying(false);
    clearInterval(timerRef.current);

    const totalPossible = pairs.length;
    const score = Math.max(0, (finalMatchedCount * 50) - (finalMistakes * 10));
    const accuracy = totalPossible > 0 
      ? Math.round((finalMatchedCount / (finalMatchedCount + finalMistakes)) * 100) + '%' 
      : '0%';
    
    const gameResult = {
      game: 'Tech Match',
      score,
      accuracy,
      isCorrectArray: []
    };

    const finalResults = await handleGameCompletion(gameResult, isMounted);
    if (finalResults) {
      setResults(finalResults);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            finishGame(matchedPairs.length, mistakes);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, matchedPairs.length, mistakes]);

  // Handle selection validation logic
  useEffect(() => {
    if (selectedTech && selectedCategory && validationState === 'none') {
      const isMatch = pairs.find(p => p.tech === selectedTech && p.category === selectedCategory);
      
      if (isMatch) {
        setValidationState('correct');
        setTimeout(() => {
          setMatchedPairs(prev => {
            const newMatched = [...prev, selectedTech];
            if (newMatched.length === pairs.length) {
              setTimeout(() => finishGame(newMatched.length, mistakes), 500);
            }
            return newMatched;
          });
          setSelectedTech(null);
          setSelectedCategory(null);
          setValidationState('none');
        }, 600);
      } else {
        setValidationState('wrong');
        setMistakes(prev => prev + 1);
        setTimeout(() => {
          setSelectedTech(null);
          setSelectedCategory(null);
          setValidationState('none');
        }, 800);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTech, selectedCategory, validationState, pairs, mistakes]);

  if (results) {
    return <GameResultsView gameResult={results} onPlayAgain={initGame} onClose={onClose} />;
  }

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Game Header */}
      <div className="flex items-center justify-between p-6 bg-white border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 shrink-0 bg-[#F3F0FF] border border-[#6C4CF1]/20 rounded-[14px] flex items-center justify-center">
            <Puzzle size={24} className="text-[#6C4CF1]" />
          </div>
          <div>
            <h2 className="text-[20px] font-bold text-slate-900 leading-tight">Tech Match</h2>
            <p className="text-[13px] font-medium text-slate-500">Select a technology, then select its matching category</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Completed</p>
            <p className="text-[24px] font-black text-[#6C4CF1] leading-none tabular-nums">{matchedPairs.length} / 6</p>
          </div>
          <div className="h-10 w-[1px] bg-slate-200" />
          <div className="text-right">
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Mistakes</p>
            <p className="text-[24px] font-black text-red-500 leading-none tabular-nums">{mistakes}</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl">
            <Clock size={16} className="text-slate-400" />
            <span className="text-[20px] font-black text-slate-700 tabular-nums">
              {mins}:{secs.toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="flex-1 flex justify-center items-center p-8 overflow-y-auto">
        <div className="grid grid-cols-2 gap-12 w-full max-w-4xl">
          {/* Techs Column */}
          <div className="flex flex-col gap-3">
            <h3 className="text-center font-bold text-slate-400 uppercase tracking-wider mb-2 text-[13px]">Technologies</h3>
            {shuffledTechs.map(tech => {
              const isMatched = matchedPairs.includes(tech);
              const isSelected = selectedTech === tech;
              let btnClass = "bg-white border-2 border-slate-200 text-slate-700 hover:border-[#6C4CF1]/40 hover:bg-[#F3F0FF]/50 shadow-sm";
              
              if (isMatched) {
                btnClass = "bg-green-50 border-2 border-green-500 text-green-700 opacity-50 cursor-default";
              } else if (isSelected) {
                if (validationState === 'correct') {
                  btnClass = "bg-green-50 border-2 border-green-500 text-green-700 shadow-md transform scale-[1.02]";
                } else if (validationState === 'wrong') {
                  btnClass = "bg-red-50 border-2 border-red-500 text-red-700 shadow-md";
                } else {
                  btnClass = "bg-[#F3F0FF] border-2 border-[#6C4CF1] text-[#6C4CF1] shadow-md transform scale-[1.02]";
                }
              }

              return (
                <button
                  key={tech}
                  disabled={isMatched || validationState !== 'none' || (selectedTech && selectedTech !== tech)}
                  onClick={() => setSelectedTech(tech)}
                  className={`p-4 rounded-xl text-[15px] font-bold transition-all text-center ${btnClass} disabled:cursor-default`}
                >
                  {tech}
                </button>
              );
            })}
          </div>

          {/* Categories Column */}
          <div className="flex flex-col gap-3">
            <h3 className="text-center font-bold text-slate-400 uppercase tracking-wider mb-2 text-[13px]">Categories</h3>
            {shuffledCategories.map(cat => {
              const matchingTechForThisCat = pairs.find(p => p.category === cat)?.tech;
              const isMatched = matchedPairs.includes(matchingTechForThisCat);
              const isSelected = selectedCategory === cat;
              let btnClass = "bg-white border-2 border-slate-200 text-slate-700 hover:border-[#6C4CF1]/40 hover:bg-[#F3F0FF]/50 shadow-sm";
              
              if (isMatched) {
                btnClass = "bg-green-50 border-2 border-green-500 text-green-700 opacity-50 cursor-default";
              } else if (isSelected) {
                if (validationState === 'correct') {
                  btnClass = "bg-green-50 border-2 border-green-500 text-green-700 shadow-md transform scale-[1.02]";
                } else if (validationState === 'wrong') {
                  btnClass = "bg-red-50 border-2 border-red-500 text-red-700 shadow-md";
                } else {
                  btnClass = "bg-[#F3F0FF] border-2 border-[#6C4CF1] text-[#6C4CF1] shadow-md transform scale-[1.02]";
                }
              }

              return (
                <button
                  key={cat}
                  disabled={isMatched || validationState !== 'none' || (selectedCategory && selectedCategory !== cat) || !selectedTech}
                  onClick={() => setSelectedCategory(cat)}
                  className={`p-4 rounded-xl text-[15px] font-bold transition-all text-center ${btnClass} disabled:cursor-default`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
