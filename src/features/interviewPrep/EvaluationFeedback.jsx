import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, Lightbulb, BookOpen, Target, ChevronRight, RefreshCw, ListFilter } from 'lucide-react';

export default function EvaluationFeedback({ evaluation, userAnswer, onNext, onRetry, isLastQuestion }) {
  const getScoreColor = (score) => {
    if (score >= 8) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 6) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Score Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">AI Evaluation Complete</h2>
          <p className="text-sm text-slate-500">Review your feedback to improve your answer.</p>
        </div>
        <div className={`flex flex-col items-center justify-center w-24 h-24 rounded-full border-4 ${getScoreColor(evaluation.score)}`}>
          <span className="text-3xl font-black">{evaluation.score}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">out of 10</span>
        </div>
      </div>

      {/* User Answer vs Ideal Answer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Target size={16} /> Your Answer
          </h3>
          <p className="text-slate-700 whitespace-pre-wrap">{userAnswer}</p>
        </div>

        <div className="bg-white border border-[#6D4AFF]/20 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#6D4AFF]/5 rounded-bl-full -z-10"></div>
          <h3 className="text-sm font-bold text-[#6D4AFF] uppercase tracking-wider mb-4 flex items-center gap-2">
            <Lightbulb size={16} /> Ideal Answer
          </h3>
          <p className="text-slate-800 font-medium whitespace-pre-wrap leading-relaxed">
            {evaluation.idealAnswer}
          </p>
        </div>
      </div>

      {/* Detailed Feedback */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Feedback</h3>
        <p className="text-slate-700 mb-6">{evaluation.feedback}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-3 flex items-center gap-2">
              <CheckCircle size={16} /> Strengths
            </h4>
            <ul className="space-y-2">
              {evaluation.strengths?.length > 0 ? (
                evaluation.strengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    {str}
                  </li>
                ))
              ) : (
                <li className="text-sm text-slate-400 italic">No notable strengths identified.</li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-3 flex items-center gap-2">
              <AlertTriangle size={16} /> Areas for Improvement
            </h4>
            <ul className="space-y-2">
              {evaluation.improvements?.length > 0 ? (
                evaluation.improvements.map((imp, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-amber-500 mt-0.5">•</span>
                    {imp}
                  </li>
                ))
              ) : (
                <li className="text-sm text-slate-400 italic">No major improvements needed.</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Missing Concepts & Topics to Revise */}
      {(evaluation.missingConcepts?.length > 0 || evaluation.topicsToRevise?.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {evaluation.missingConcepts?.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                <ListFilter size={16} /> Missing Concepts
              </h4>
              <div className="flex flex-wrap gap-2">
                {evaluation.missingConcepts.map((concept, i) => (
                  <span key={i} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 shadow-sm">
                    {concept}
                  </span>
                ))}
              </div>
            </div>
          )}

          {evaluation.topicsToRevise?.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                <BookOpen size={16} /> Topics to Revise
              </h4>
              <div className="flex flex-wrap gap-2">
                {evaluation.topicsToRevise.map((topic, i) => (
                  <span key={i} className="px-3 py-1.5 bg-[#6D4AFF]/10 text-[#6D4AFF] rounded-lg text-sm font-semibold">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <RefreshCw size={18} /> Retry Answer
        </button>
        <button
          onClick={onNext}
          className="px-6 py-3 bg-[#6D4AFF] text-white font-bold rounded-xl hover:bg-[#5B3DE6] transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          {isLastQuestion ? 'Finish Session' : 'Next Question'} <ChevronRight size={18} />
        </button>
      </div>
    </motion.div>
  );
}
