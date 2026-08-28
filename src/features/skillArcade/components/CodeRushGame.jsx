import { useState, useEffect, useRef, useMemo } from 'react';
import { Keyboard, Clock } from 'lucide-react';
import { getRandomSnippet } from '../data/codeRushSnippets';
import GameResultsView from './GameResultsView';
import { useGameCompletion } from '../hooks/useGameCompletion';

const computeSyntaxStyles = (code) => {
  const styles = new Array(code.length).fill("text-slate-400");
  
  const applyStyle = (regex, colorClass) => {
    let match;
    while ((match = regex.exec(code)) !== null) {
      for (let i = 0; i < match[0].length; i++) {
        styles[match.index + i] = colorClass;
      }
    }
  };

  // Keywords
  applyStyle(/\b(const|let|var|function|return|import|from|export|default|if|else|for|while|async|await|class|new|true|false|null|undefined|try|catch|with|as|def|print|public|static|void|SELECT|FROM|WHERE|ORDER BY|DESC|ASC|INSERT INTO|VALUES|UPDATE|SET)\b/g, "text-[#c678dd]");
  
  // Types & Built-ins
  applyStyle(/\b(console|document|window|Math|JSON|String|Number|Boolean|Array|Object|List|ArrayList|System|User|app|res|req)\b/g, "text-[#e5c07b]");

  // HTML / CSS / DOM
  applyStyle(/\b(body|display|justify-content|align-items|height|width|margin|padding|color|background|container|header|main|Button|div|li|span)\b/g, "text-[#61afef]");
  
  // Operators & Punctuation
  applyStyle(/[\{\}\(\)\[\]\.\,\;\:\=\+\-\*\/\%\>\<\!]/g, "text-slate-500");
  
  // Numbers
  applyStyle(/\b\d+(\.\d+)?\b/g, "text-[#d19a66]");
  
  // Strings
  applyStyle(/'[^']*'|"[^"]*"/g, "text-[#98c379]");
  applyStyle(/`[^`]*`/g, "text-[#98c379]"); 
  
  return styles;
};

export default function CodeRushGame({ onClose }) {
  const [snippet, setSnippet] = useState("");
  const [userInput, setUserInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [results, setResults] = useState(null);

  const { handleGameCompletion } = useGameCompletion();
  const timerRef = useRef(null);
  const inputRef = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);
  
  const userInputRef = useRef(userInput);
  useEffect(() => {
    userInputRef.current = userInput;
  }, [userInput]);

  const initGame = () => {
    setSnippet(getRandomSnippet());
    setUserInput("");
    setTimeLeft(30);
    setIsPlaying(false);
    setIsFinished(false);
    setResults(null);
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);
  };

  useEffect(() => {
    initGame();
  }, []);

  const finishGame = async (finalInput) => {
    if (isFinished) return; // Prevent double firing
    setIsPlaying(false);
    setIsFinished(true);
    clearInterval(timerRef.current);

    // Calculate accuracy and score
    let correctChars = 0;
    const minLength = Math.min(snippet.length, finalInput.length);
    for (let i = 0; i < minLength; i++) {
      if (snippet[i] === finalInput[i]) {
        correctChars++;
      }
    }

    const accuracyVal = finalInput.length > 0 ? (correctChars / finalInput.length) : 0;
    const wpm = (correctChars / 5) / ((30 - timeLeft || 1) / 60); 
    
    // Score based on speed and accuracy
    const score = Math.round(wpm * 10 * accuracyVal) || 0;
    const accuracyStr = Math.round(accuracyVal * 100) + '%';
    
    const gameResult = {
      game: 'Code Rush',
      score,
      accuracy: accuracyStr,
      isCorrectArray: [] 
    };

    const finalResults = await handleGameCompletion(gameResult, isMounted);
    if (finalResults) {
      setResults(finalResults);
    }
  };

  useEffect(() => {
    if (isPlaying && !isFinished) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            finishGame(userInputRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, isFinished]);

  const handleChange = (e) => {
    if (isFinished) return;
    if (!isPlaying) setIsPlaying(true);
    
    const val = e.target.value;
    setUserInput(val);

    // Complete if they type the full snippet successfully
    if (val === snippet) {
      finishGame(val);
    }
  };

  const syntaxStyles = useMemo(() => computeSyntaxStyles(snippet), [snippet]);

  if (results) {
    return (
      <GameResultsView 
        gameResult={results} 
        onPlayAgain={initGame}
        onClose={onClose}
      />
    );
  }

  const renderedSnippet = useMemo(() => {
    const chars = snippet.split('');
    const els = [];
    
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      let colorClass = syntaxStyles[i] || "text-slate-400";
      
      const isCurrent = i === userInput.length;
      let caretClass = "";
      if (isCurrent && !isFinished) {
        caretClass = "border-l-2 border-[#6C4CF1] animate-pulse -ml-[2px] pl-[2px]";
      }

      if (i < userInput.length) {
        const isCorrect = userInput[i] === char;
        // Subtle colored text, NO background blocks!
        colorClass = isCorrect ? "text-emerald-400 drop-shadow-[0_0_2px_rgba(52,211,153,0.5)]" : "text-red-400 underline decoration-red-500/50 underline-offset-4";
      }

      els.push(<span key={i} className={`${colorClass} ${caretClass}`}>{char}</span>);
    }
    
    // Check if the cursor is at the very end of the string
    if (userInput.length === chars.length && !isFinished) {
      els.push(<span key="end" className="border-l-2 border-[#6C4CF1] animate-pulse -ml-[2px]" />);
    }
    
    return els;
  }, [snippet, userInput, isFinished, syntaxStyles]);

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Game Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 shrink-0 bg-[#F3F0FF] border border-[#6C4CF1]/20 rounded-[14px] flex items-center justify-center">
            <Keyboard size={24} className="text-[#6C4CF1]" />
          </div>
          <div>
            <h2 className="text-[20px] font-bold text-slate-900 leading-tight">Code Rush</h2>
            <p className="text-[13px] font-medium text-slate-500">Type the snippet as fast as possible</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl">
          <Clock size={16} className={timeLeft <= 5 ? "text-red-500" : "text-slate-400"} />
          <span className={`text-[20px] font-black tabular-nums ${timeLeft <= 5 ? "text-red-500" : "text-slate-700"}`}>
            0:{timeLeft.toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Game Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-4xl mx-auto w-full relative">
        <div className="w-full relative rounded-2xl bg-[#0d1117] border border-slate-800 p-8 shadow-2xl font-mono text-[18px] md:text-[20px] leading-relaxed whitespace-pre-wrap tracking-wide text-left overflow-hidden">
          {renderedSnippet}
          
          <textarea
            ref={inputRef}
            aria-label="Code typing input"
            value={userInput}
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-text resize-none z-10"
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
          />
        </div>
      </div>
    </div>
  );
}
