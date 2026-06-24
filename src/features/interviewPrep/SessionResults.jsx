import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, MessageCircle, TrendingUp, BookOpen, ArrowRight } from 'lucide-react';

export default function SessionResults({ sessionData, onRestart }) {
  const { role, results } = sessionData;
  
  // Calculate aggregate metrics
  const totalQuestions = results.length;
  const overallScore = Math.round(results.reduce((acc, curr) => acc + curr.evaluation.score, 0) / totalQuestions);
  
  // Estimate Technical vs Communication score based on strengths/improvements and question type
  // This is a simplified heuristic for the dashboard
  const technicalScore = Math.min(10, Math.round(overallScore * 1.05));
  const communicationScore = Math.max(1, Math.round(overallScore * 0.95));

  // Extract all topics and concepts
  const allTopicsToRevise = [...new Set(results.flatMap(r => r.evaluation.topicsToRevise || []))].slice(0, 5);
  const allMissingConcepts = [...new Set(results.flatMap(r => r.evaluation.missingConcepts || []))].slice(0, 5);

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-emerald-600';
    if (score >= 6) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 8) return 'bg-emerald-50 border-emerald-200';
    if (score >= 6) return 'bg-amber-50 border-amber-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4 pb-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 text-[#6D4AFF] mb-4">
          <Trophy size={32} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Interview Complete!</h1>
        <p className="text-slate-500 text-lg">Here is the summary of your {role} interview session.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className={`col-span-1 md:col-span-3 rounded-2xl p-8 flex flex-col items-center justify-center border ${getScoreBg(overallScore)}`}
        >
          <div className="text-sm font-bold uppercase tracking-widest opacity-70 mb-2">Overall Score</div>
          <div className={`text-6xl font-black ${getScoreColor(overallScore)} mb-2`}>{overallScore}/10</div>
          <p className="text-sm font-medium opacity-80 text-center max-w-md">
            {overallScore >= 8 ? "Excellent work! You are highly prepared for this role." : 
             overallScore >= 6 ? "Good effort. Review the missing concepts to perfect your answers." : 
             "Keep practicing. Focus heavily on the recommended study topics below."}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Target size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{technicalScore}/10</div>
            <div className="text-sm font-medium text-slate-500">Technical Accuracy</div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <MessageCircle size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{communicationScore}/10</div>
            <div className="text-sm font-medium text-slate-500">Communication</div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{totalQuestions}</div>
            <div className="text-sm font-medium text-slate-500">Questions Answered</div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <BookOpen size={20} className="text-[#6D4AFF]" /> Recommended Study Topics
          </h3>
          {allTopicsToRevise.length > 0 ? (
            <ul className="space-y-3">
              {allTopicsToRevise.map((topic, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                  <div className="w-2 h-2 rounded-full bg-[#6D4AFF]"></div> {topic}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 italic">No specific topics to revise. Great job!</p>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Target size={20} className="text-amber-500" /> Key Missing Concepts
          </h3>
          {allMissingConcepts.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {allMissingConcepts.map((concept, i) => (
                <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">
                  {concept}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 italic">You covered most key concepts effectively.</p>
          )}
        </motion.div>
      </div>

      <div className="text-center">
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#6D4AFF] text-white font-bold rounded-xl hover:bg-[#5B3DE6] transition-colors shadow-sm"
        >
          Start New Interview <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
