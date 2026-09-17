import { Trophy, Target, Play, X, Bookmark, Code2, Check } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BUG_HUNTER_CONFIG } from '../config/bugHunterConfig';
import { getBugHunterQuestionById } from '../data/bugHunterQuestions';
import { useSkillArcade } from '../../../contexts/SkillArcadeContext';

export default function GameResultsView({ gameResult, onPlayAgain, onPlayAgainSameSettings, onClose }) {
  const { game, score, accuracy, streak, isNewHighScore, xpEarned, questions, isCorrectArray, selectedOptionsArray, isPracticeMode, isSpeedMode, displayScore } = gameResult;
  const { stats, toggleSavedBugHunterQuestion } = useSkillArcade();
  const visualScore = displayScore !== undefined ? displayScore : score;

  const missedQuestions = game === BUG_HUNTER_CONFIG.id
    ? (gameResult.sessionMistakes || []).map(m => {
      const fullQ = getBugHunterQuestionById(m.questionId);
      return {
        ...fullQ,
        selectedOption: m.selectedAnswer
      };
    })
    : (questions && isCorrectArray ? questions.reduce((acc, q, idx) => {
      if (!isCorrectArray[idx]) {
        acc.push({ ...q, selectedOption: selectedOptionsArray ? selectedOptionsArray[idx] : null });
      }
      return acc;
    }, []) : []);

    const headingRef = useRef(null);

  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.focus();
    }
  }, []);

  const missedCategories = [...new Set(missedQuestions.map(q => q.category || 'General'))];
  const missedTags = [...new Set(missedQuestions.flatMap(q => q.tags || []))].filter(Boolean);
  const isPerfect = missedQuestions.length === 0;

  const categoryStats = gameResult.categoryStats || (questions ? questions.reduce((acc, q, idx) => {
    const cat = q.category || 'General';
    if (!acc[cat]) acc[cat] = { total: 0, correct: 0 };
    acc[cat].total++;
    if (isCorrectArray && isCorrectArray[idx]) {
      acc[cat].correct++;
    }
    return acc;
  }, {}) : {});

  const validCategoryStats = Object.entries(categoryStats).filter(([_, stats]) => stats.total > 0);
  const validLanguageStats = Object.entries(gameResult.languageStats || {}).filter(([_, stats]) => stats.total > 0);

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 bg-white text-center">
      <div className="w-20 h-20 bg-[#EBE8FF] rounded-[20px] flex items-center justify-center mb-6 shadow-sm shadow-[#6C4CF1]/20">
        <Trophy size={40} className="text-primary" />
      </div>

      <h2
        ref={headingRef}
        tabIndex={-1}
        className="text-[28px] font-black text-slate-900 mb-3 outline-none focus-visible:ring-2 focus-visible:ring-[#6C4CF1] rounded-lg"
      >
        Game Over!
      </h2>

      {gameResult.mastery && (
        <div className={`mb-3 px-4 py-1.5 rounded-full border-2 inline-flex items-center gap-2 font-bold text-sm ${gameResult.mastery.color}`}>
          <Trophy size={16} className="shrink-0" /> {gameResult.mastery.title}
        </div>
      )}

      <p className="text-[16px] font-medium text-slate-500 mb-6">{game} Challenge Completed</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl mb-8">
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex flex-col items-center">
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2" aria-hidden="true">Score</p>
          <p className="text-[28px] font-black text-primary" aria-label={`Score: ${visualScore} points`}>{visualScore}</p>
          <div className="flex flex-col items-center gap-1 mt-1">
            {isPracticeMode && <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">PRACTICE</span>}
            {isSpeedMode && <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">SPEED RUN</span>}
            {!isPracticeMode && isNewHighScore && <span aria-label="New high score!" className="text-[10px] font-bold text-white bg-primary px-2 py-0.5 rounded-full">NEW HIGH!</span>}
            {!isPracticeMode && gameResult.isPersonalBest && !isNewHighScore && <span aria-label="New personal best!" className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">PERSONAL BEST</span>}
            {!isPracticeMode && gameResult.previousSession && !isNewHighScore && !gameResult.isPersonalBest && (
              <span className={`text-[10px] font-bold ${visualScore >= (gameResult.previousSession.score || 0) ? 'text-emerald-600' : 'text-rose-500'}`}>
                {visualScore >= (gameResult.previousSession.score || 0) ? '▲' : '▼'} {Math.abs(visualScore - (gameResult.previousSession.score || 0))} pts
                {gameResult.difficulty !== gameResult.previousSession.difficulty && <span className="text-slate-400 ml-1 font-medium">(Prev: {gameResult.previousSession.difficulty})</span>}
              </span>
            )}
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex flex-col items-center">
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2" aria-hidden="true">Accuracy</p>
          <p className="text-[28px] font-black text-green-500" aria-label={`Accuracy: ${accuracy}`}>{accuracy}</p>
          {!isPracticeMode && gameResult.previousSession && gameResult.previousSession.accuracy && (
            <div className="mt-1">
              {(() => {
                const currAcc = parseInt(accuracy) || 0;
                const prevAcc = parseInt(gameResult.previousSession.accuracy) || 0;
                if (currAcc === prevAcc) return <span className="text-[10px] font-bold text-slate-400">Even with last run</span>;
                const isBetter = currAcc > prevAcc;
                return (
                  <span className={`text-[10px] font-bold ${isBetter ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {isBetter ? '▲' : '▼'} {Math.abs(currAcc - prevAcc)}%
                  </span>
                );
              })()}
            </div>
          )}
        </div>

      </div>

      {game === BUG_HUNTER_CONFIG.id && gameResult.totalQuestions && (
        <div className="w-full max-w-2xl bg-[#F8F7FF] border border-primary/20 rounded-2xl p-6 mb-10 text-left">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Target size={20} className="text-primary" />
            Session Recap
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-5 gap-x-4 mb-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Config</p>
              <p className="text-sm font-bold text-slate-700">{gameResult.language} • {gameResult.difficulty}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Time</p>
              <p className="text-sm font-bold text-slate-700">
                {gameResult.status === 'TIME_EXPIRED' ? 'Expired' : 'Completed'}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Attempted</p>
              <p className="text-sm font-bold text-slate-700">
                {gameResult.isCorrectArray ? gameResult.isCorrectArray.length : 0} / {gameResult.totalQuestions}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Correct</p>
              <p className="text-sm font-bold text-emerald-600">{gameResult.questionsSolved}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Accuracy</p>
              <p className="text-sm font-bold text-slate-700">{accuracy}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Score</p>
              <p className="text-sm font-bold text-primary">{visualScore}</p>
            </div>
          </div>

          {!isPerfect && (missedCategories.length > 0 || missedTags.length > 0) && (
            <div className="mt-4 bg-amber-50 border border-amber-100 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">Practice Suggestion</p>
                <p className="text-sm font-medium text-amber-900 leading-relaxed">
                  You missed a few concepts. Try brushing up on: <span className="font-bold">{[...missedCategories, ...missedTags].filter(t => t !== 'General').slice(0, 4).join(', ')}</span>.
                </p>
              </div>
              <Link to="/skill-gap" className="shrink-0 text-xs font-bold bg-white text-amber-700 px-3 py-1.5 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors whitespace-nowrap">
                Review Skills
              </Link>
            </div>
          )}
          {isPerfect && gameResult.totalQuestions > 0 && (
            <div className="mt-4 bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
              <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">Category Strengths</p>
              <p className="text-sm font-medium text-emerald-900 leading-relaxed">
                Flawless performance across all categories! Great job.
              </p>
            </div>
          )}

          {game === BUG_HUNTER_CONFIG.id && (
            <>
              {validLanguageStats.length > 0 && (
                <>
                  <div className="h-px bg-primary/10 w-full my-5"></div>
                  <div className="text-left w-full mb-6">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Language Performance</h3>
                    <div className="flex flex-wrap gap-3">
                      {validLanguageStats.map(([language, stats]) => (
                        <div key={language} className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 flex items-center gap-3">
                          <span className="text-xs font-bold text-slate-600">{language}</span>
                          <span className={`text-sm font-black ${stats.correct === stats.total ? 'text-emerald-600' : 'text-slate-800'}`}>
                            {stats.correct} / {stats.total}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {validCategoryStats.length > 0 && (
                <>
                  <div className="h-px bg-primary/10 w-full my-5"></div>
                  <div className="text-left w-full mb-6">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Category Breakdown</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {validCategoryStats.map(([category, stats]) => (
                        <div key={category} className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col justify-center">
                          <span className="text-xs font-bold text-slate-500 mb-1">{category}</span>
                          <span className={`text-lg font-black ${stats.correct === stats.total ? 'text-emerald-600' : 'text-slate-800'}`}>
                            {stats.correct} / {stats.total}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {missedQuestions.length > 0 && (
                <>
                  <div className="h-px bg-primary/10 w-full my-5"></div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Bugs to Review</p>
                    <div className="flex flex-col gap-3">
                      {missedQuestions.map((q) => (
                        <div key={q.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:border-indigo-200 transition-colors">
                          <div className="p-4 flex items-start justify-between gap-4 text-left border-b border-slate-100">
                            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider"><Code2 size={12} /> {q.language}</span>
                              <p className="text-sm font-semibold text-slate-800 leading-relaxed">{q.question}</p>
                            </div>
                            <button
                              onClick={() => toggleSavedBugHunterQuestion(q.id)}
                              className={`shrink-0 p-2 rounded-lg transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${stats?.savedBugHunterQuestions?.includes(q.id)
                                  ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                  : 'bg-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-200'
                                }`}
                              aria-label="Bookmark bug"
                            >
                              <Bookmark size={18} strokeWidth={2.5} className={stats?.savedBugHunterQuestions?.includes(q.id) ? 'fill-amber-700' : ''} />
                            </button>
                          </div>

                          {q.code && (
                            <div className="bg-slate-900 text-slate-50 p-4 text-sm font-mono overflow-x-auto text-left max-h-[30vh]">
                              <pre className="w-fit"><code>{q.code}</code></pre>
                            </div>
                          )}

                          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-sm">
                            <div className="bg-rose-50 border border-rose-100 rounded-lg p-3">
                              <span className="flex items-center gap-1 text-xs font-bold text-rose-600 uppercase tracking-wider mb-1"><X size={14} /> You Selected</span>
                              <span className="text-rose-900 font-medium">{q.selectedOption || 'Time Expired / No Answer'}</span>
                            </div>
                            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1"><Check size={14} /> Correct Answer</span>
                              <span className="text-emerald-900 font-medium">{q.answer}</span>
                            </div>
                          </div>

                          {q.explanation && (
                            <div className="px-4 pb-4 text-left text-sm border-t border-slate-100 pt-4">
                              <div className="bg-slate-50 rounded-lg border border-slate-100 p-4">
                                {typeof q.explanation === 'string' ? (
                                  <p className="text-slate-700 leading-relaxed font-medium">{q.explanation}</p>
                                ) : (
                                  <div className="flex flex-col gap-3">
                                    {q.explanation.intent && (
                                      <div><span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">The Goal</span><p className="text-slate-700 font-medium">{q.explanation.intent}</p></div>
                                    )}
                                    {q.explanation.bug && (
                                      <div><span className="text-[11px] font-bold text-red-500 uppercase tracking-wider block mb-0.5">The Bug</span><p className="text-slate-700 font-medium">{q.explanation.bug}</p></div>
                                    )}
                                    {q.explanation.reason && (
                                      <div><span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider block mb-0.5">Why it fails</span><p className="text-slate-700 font-medium">{q.explanation.reason}</p></div>
                                    )}
                                    {q.explanation.fix && (
                                      <div><span className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider block mb-0.5">The Fix</span><p className="text-slate-700 font-medium">{q.explanation.fix}</p></div>
                                    )}
                                  </div>
                                )}
                              </div>
                              {q.takeaway && (
                                <div className="mt-3 bg-indigo-50/50 border border-indigo-100 p-3 rounded-lg flex gap-2 items-start">
                                  <p className="text-indigo-900 text-[13px] font-bold leading-relaxed">{q.takeaway}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}

      <div className="w-full">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-xs sm:max-w-none mx-auto justify-center">
        {onPlayAgainSameSettings ? (
          <>
            <button
              onClick={onPlayAgainSameSettings}
              className="flex items-center justify-center gap-2 bg-primary hover:bg-[#5A3EE0] text-white px-8 py-3.5 rounded-xl font-bold text-[15px] transition-colors shadow-md shadow-[#6C4CF1]/30 w-full sm:w-auto focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#6C4CF1] outline-none"
            >
              <Play size={18} className="fill-white shrink-0" /> Play Again
            </button>
            <button
              onClick={onPlayAgain}
              className="flex items-center justify-center gap-2 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 px-8 py-3.5 rounded-xl font-bold text-[15px] transition-colors w-full sm:w-auto focus-visible:ring-2 focus-visible:ring-slate-400 outline-none"
            >
              Change Settings
            </button>
          </>
        ) : (
          <button
            onClick={onPlayAgain}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-[#5A3EE0] text-white px-8 py-3.5 rounded-xl font-bold text-[15px] transition-colors w-full sm:w-auto outline-none"
          >
            <Play size={18} className="fill-white shrink-0" /> Play Again
          </button>
        )}
        <button
          onClick={onClose}
          className="flex items-center justify-center gap-2 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 px-8 py-3.5 rounded-xl font-bold text-[15px] transition-colors w-full sm:w-auto focus-visible:ring-2 focus-visible:ring-slate-400 outline-none"
        >
          <X size={18} className="shrink-0" /> Back to Arcade
        </button>
        </div>
      </div>
    </div>
  );
}
