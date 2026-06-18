import { useState } from 'react';
import { ArrowUpRight, CheckCircle2, TrendingUp, ChevronDown, ChevronUp, Zap, AlertCircle } from 'lucide-react';

export default function ResumeSmartSuggestions({ suggestions, currentScore, potentialScore }) {
  const [showAll, setShowAll] = useState(false);

  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="mt-8 bg-emerald-50 border border-emerald-100 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4 text-emerald-600">
          <CheckCircle2 size={24} />
        </div>
        <h3 className="text-lg font-bold text-emerald-800 mb-2">Your resume looks perfect!</h3>
        <p className="text-sm font-medium text-emerald-600/80 max-w-sm">
          We couldn't find any critical areas for improvement. Your formatting, keyword density, and section details are highly optimized.
        </p>
      </div>
    );
  }

  const displayedSuggestions = showAll ? suggestions : suggestions.slice(0, 3);
  const hiddenCount = suggestions.length - 3;

  return (
    <div className="mt-8 space-y-6">

      {/* Header & Score Simulation */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
              <TrendingUp size={18} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Action Plan</h2>
          </div>
          <p className="text-sm font-medium text-slate-500">
            Top recommendations to increase your ATS match rate.
          </p>
        </div>

        {/* Score Simulator Box */}
        <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm shrink-0">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Current</span>
            <span className="text-lg font-black text-slate-700 leading-none">{currentScore}</span>
          </div>
          <div className="flex flex-col items-center px-1">
            <ArrowUpRight size={16} className="text-emerald-500" />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-0.5">Potential</span>
            <span className="text-lg font-black text-emerald-600 leading-none">{potentialScore}</span>
          </div>
        </div>
      </div>

      {/* Suggestions List */}
      {/* Suggestions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedSuggestions.map((suggestion, idx) => {
          
          let priorityColor = 'bg-slate-100 text-slate-600 border-slate-200';
          let dotColor = 'bg-slate-400';
          let impactScore = '+2';
          
          if (suggestion.priority === 'HIGH') {
            priorityColor = 'bg-red-50 text-red-700 border-red-100';
            dotColor = 'bg-red-500';
            impactScore = '+10';
          } else if (suggestion.priority === 'MEDIUM') {
            priorityColor = 'bg-amber-50 text-amber-700 border-amber-100';
            dotColor = 'bg-amber-500';
            impactScore = '+5';
          } else if (suggestion.priority === 'LOW') {
            priorityColor = 'bg-blue-50 text-blue-700 border-blue-100';
            dotColor = 'bg-blue-500';
            impactScore = '+2';
          }

          const parts = suggestion.description.split('. ');
          let issue = parts[0] + (parts[0].endsWith('.') ? '' : '.');
          let fix = parts.slice(1).join('. ') || `Update your ${suggestion.area.toLowerCase()} section to resolve this.`;

          return (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:border-indigo-300 transition-colors flex flex-col h-full relative group">
              
              {/* Top Row: Category Label & ATS Badge */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{suggestion.area}</span>
                </div>
                <div className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider flex items-center gap-1 bg-emerald-50 text-emerald-700">
                  <TrendingUp size={12} className="text-emerald-500" />
                  {impactScore} ATS
                </div>
              </div>

              {/* Title */}
              <div className="min-h-[3.5rem] flex items-start mb-2">
                <h3 className="text-[17px] font-bold text-slate-900 pr-4 leading-snug">
                  {suggestion.title}
                </h3>
              </div>

              {/* Body: Issue & Fix */}
              <div className="flex flex-col mt-auto">
                
                {/* Divider 1 */}
                <div className="h-px bg-slate-100 w-full mb-4"></div>

                {/* Issue */}
                <div className="flex gap-2.5 items-start min-h-[4.5rem]">
                  <AlertCircle size={14} className="text-slate-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 block">Issue</span>
                    <p className="text-sm font-medium text-slate-600 leading-snug">{issue}</p>
                  </div>
                </div>
                
                {/* Divider 2 */}
                <div className="h-px bg-slate-100 w-full my-4"></div>

                {/* Quick Fix */}
                <div className="flex gap-2.5 items-start min-h-[5rem]">
                  <Zap size={14} className="text-indigo-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-0.5 block">Quick Fix</span>
                    <p className="text-sm font-medium text-slate-800 leading-snug">{fix}</p>
                  </div>
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* View More Toggle */}
      {hiddenCount > 0 && (
        <button 
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-4 py-3 flex items-center justify-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 border border-slate-200 border-dashed rounded-xl transition-colors"
        >
          {showAll ? (
            <>Hide {hiddenCount} Suggestions <ChevronUp size={16} /></>
          ) : (
            <>View {hiddenCount} More Suggestions <ChevronDown size={16} /></>
          )}
        </button>
      )}

    </div>
  );
}
