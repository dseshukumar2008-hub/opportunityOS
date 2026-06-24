import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  RefreshCw, Trophy, Target, CheckCircle, AlertTriangle, 
  Code, PieChart, Lightbulb, ArrowRight, BrainCircuit, Sparkles 
} from 'lucide-react';

export default function GithubResults({ results, onReset }) {
  const navigate = useNavigate();
  
  if (!results) return null;

  const {
    username,
    targetRole,
    githubScore,
    alignmentScore,
    strengths,
    weaknesses,
    technologyAnalysis,
    portfolioDiversity,
    improvementSuggestions,
    missingSkills
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            GitHub Analysis <span className="text-[#6D4AFF]">@{username}</span>
          </h2>
          <p className="text-slate-500 font-medium mt-1">Target Role: {targetRole}</p>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
        >
          <RefreshCw size={16} /> Analyze Another Profile
        </button>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-center gap-6">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center shrink-0 ${getScoreBg(githubScore)}`}>
            <Trophy size={36} className={getScoreColor(githubScore)} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">GitHub Score</p>
            <div className={`text-5xl font-extrabold ${getScoreColor(githubScore)}`}>{githubScore}<span className="text-2xl text-slate-400">/100</span></div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-center gap-6">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center shrink-0 ${getScoreBg(alignmentScore)}`}>
            <Target size={36} className={getScoreColor(alignmentScore)} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Career Alignment</p>
            <div className={`text-5xl font-extrabold ${getScoreColor(alignmentScore)}`}>{alignmentScore}<span className="text-2xl text-slate-400">%</span></div>
            <p className="text-xs font-semibold text-slate-500 mt-1">Match for {targetRole}</p>
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <CheckCircle className="text-emerald-500" size={20} /> Strengths
          </h3>
          <ul className="space-y-3">
            {strengths?.map((strength, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="mt-1"><CheckCircle className="text-emerald-500" size={16} /></div>
                <span className="text-slate-700 font-medium">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="text-amber-500" size={20} /> Weaknesses
          </h3>
          <ul className="space-y-3">
            {weaknesses?.map((weakness, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="mt-1"><AlertTriangle className="text-amber-500" size={16} /></div>
                <span className="text-slate-700 font-medium">{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Technology Analysis & Diversity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Code className="text-[#6D4AFF]" size={20} /> Technology Analysis
          </h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Detected Technologies</p>
              <div className="flex flex-wrap gap-2">
                {technologyAnalysis?.detected?.map((tech, idx) => (
                  <span key={idx} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold border border-indigo-100">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                <AlertTriangle size={14} /> Missing Technologies for Role
              </p>
              <div className="flex flex-wrap gap-2">
                {technologyAnalysis?.missing?.map((tech, idx) => (
                  <span key={idx} className="px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-sm font-semibold border border-rose-100">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <PieChart className="text-[#6D4AFF]" size={20} /> Portfolio Diversity
          </h3>
          <p className="text-slate-700 font-medium leading-relaxed mb-4">
            {portfolioDiversity?.analysis}
          </p>
          
          <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-2 flex items-center gap-1">
            <Lightbulb size={14} /> Identified Gaps
          </p>
          <ul className="space-y-2">
            {portfolioDiversity?.gaps?.map((gap, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5" /> {gap}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Cross-Module Integrations */}
      {/* Removed Next Actions as requested */}

    </motion.div>
  );
}
