import { ArrowUpRight, CheckCircle2, TrendingUp, Zap } from 'lucide-react';

export default function ResumeSmartSuggestions({ suggestions, currentScore, potentialScore }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="mt-8 space-y-6">

      {/* Header & Score Simulation */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
              <TrendingUp size={18} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Improvement Suggestions</h2>
          </div>
          <p className="text-sm font-medium text-slate-500">
            Actionable recommendations to improve your resume's ATS performance.
          </p>
        </div>

        {/* Score Simulator Box */}
        <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-xl px-5 py-3 shadow-sm shrink-0">
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Current</span>
            <span className="text-xl font-black text-slate-700">{currentScore}</span>
          </div>
          <div className="flex flex-col items-center px-2">
            <div className="w-8 h-px bg-slate-200 mb-1"></div>
            <ArrowUpRight size={16} className="text-emerald-500" />
            <div className="w-8 h-px bg-slate-200 mt-1"></div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-1">Potential</span>
            <span className="text-xl font-black text-emerald-600">{potentialScore}</span>
          </div>
        </div>
      </div>

      {/* Suggestions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suggestions.map((suggestion, idx) => {

          let priorityColor = 'bg-slate-100 text-slate-600 border-slate-200';
          if (suggestion.priority === 'HIGH') priorityColor = 'bg-red-50 text-red-600 border-red-200';
          if (suggestion.priority === 'MEDIUM') priorityColor = 'bg-amber-50 text-amber-600 border-amber-200';
          if (suggestion.priority === 'LOW') priorityColor = 'bg-blue-50 text-blue-600 border-blue-200';

          return (
            <div key={idx} className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 p-6 flex flex-col h-full hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{suggestion.area}</span>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${priorityColor}`}>
                  {suggestion.priority} PRIORITY
                </span>
              </div>

              <h3 className="text-[15px] font-bold text-slate-900 mb-2">{suggestion.title}</h3>
              <p className="text-sm font-medium text-slate-500 leading-relaxed flex-grow">
                {suggestion.description}
              </p>
            </div>
          );
        })}
      </div>

      {suggestions.length === 0 && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4 text-emerald-600">
            <CheckCircle2 size={24} />
          </div>
          <h3 className="text-lg font-bold text-emerald-800 mb-2">Your resume looks perfect!</h3>
          <p className="text-sm font-medium text-emerald-600/80 max-w-sm">
            We couldn't find any critical areas for improvement. Your formatting, keyword density, and section details are highly optimized.
          </p>
        </div>
      )}

    </div>
  );
}
