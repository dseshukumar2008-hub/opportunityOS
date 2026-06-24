import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, CheckCircle, AlertTriangle, Lightbulb, Trophy, Target, Eye, ChevronRight } from 'lucide-react';

export default function LinkedInResults({ results, onReset }) {
  const navigate = useNavigate();

  if (!results) return null;

  const {
    overallScore,
    completenessScore,
    searchVisibilityScore,
    analysis,
    topSuggestions
  } = results;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-emerald-50';
    if (score >= 60) return 'bg-amber-50';
    return 'bg-rose-50';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto px-4 py-8 space-y-8"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-extrabold text-slate-900">Analysis Results</h2>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
        >
          <RefreshCw size={16} /> Analyze Another Profile
        </button>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${getScoreBg(overallScore)}`}>
            <Trophy size={28} className={getScoreColor(overallScore)} />
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Overall Score</p>
          <div className={`text-4xl font-extrabold ${getScoreColor(overallScore)}`}>{overallScore}</div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${getScoreBg(completenessScore)}`}>
            <Target size={28} className={getScoreColor(completenessScore)} />
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Completeness</p>
          <div className={`text-4xl font-extrabold ${getScoreColor(completenessScore)}`}>{completenessScore}</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${getScoreBg(searchVisibilityScore)}`}>
            <Eye size={28} className={getScoreColor(searchVisibilityScore)} />
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Search Visibility</p>
          <div className={`text-4xl font-extrabold ${getScoreColor(searchVisibilityScore)}`}>{searchVisibilityScore}</div>
        </div>
      </div>

      {/* Top Suggestions */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-6 sm:p-8">
        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Lightbulb className="text-amber-500" size={24} /> Top 5 Improvement Suggestions
        </h3>
        <div className="grid gap-4">
          {topSuggestions?.map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl p-4 shadow-sm flex items-start gap-3">
              <div className="mt-0.5">
                {item.priority === 'High' ? (
                  <AlertTriangle className="text-rose-500" size={20} />
                ) : (
                  <CheckCircle className="text-emerald-500" size={20} />
                )}
              </div>
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 inline-block ${
                  item.priority === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {item.priority} Priority
                </span>
                <p className="text-slate-800 font-medium">{item.suggestion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Analysis */}
      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Detailed Breakdown</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {Object.entries(analysis || {}).map(([key, value]) => (
          <div key={key} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h4 className="text-lg font-bold text-slate-900 mb-3 capitalize flex items-center gap-2">
              <ChevronRight className="text-[#6D4AFF]" size={18} /> {key} Section
            </h4>
            <p className="text-slate-600 leading-relaxed text-sm">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Cross-Module Integrations */}
      {/* Removed Next Actions as requested */}

    </motion.div>
  );
}
