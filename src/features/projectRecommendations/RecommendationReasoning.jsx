import React from 'react';
import { BrainCircuit, Target, Briefcase, TrendingUp } from 'lucide-react';

export default function RecommendationReasoning({ recommendation }) {
  const { 
    reasoning, 
    careerRelevanceScore, 
    portfolioValueScore, 
    recommendationScore 
  } = recommendation;

  return (
    <div className="mt-4 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
      <div className="flex items-start gap-3 mb-4">
        <div className="mt-0.5 shrink-0">
          <BrainCircuit className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-1">Why this project fits you</h4>
          <p className="text-sm text-slate-700 leading-relaxed">{reasoning}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-indigo-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm">
            <Target className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Career Match</div>
            <div className="text-sm font-bold text-slate-900">{careerRelevanceScore}%</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm">
            <Briefcase className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Portfolio Value</div>
            <div className="text-sm font-bold text-slate-900">{portfolioValueScore}%</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 shadow-sm">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Overall Score</div>
            <div className="text-sm font-bold text-indigo-700">{recommendationScore}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
