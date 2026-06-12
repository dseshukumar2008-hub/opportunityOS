import { CheckCircle2, AlertCircle, FileSearch, Sparkles, RefreshCw, ChevronRight, Zap } from 'lucide-react';

function CircularScore({ score }) {
  // Simple SVG circle implementation for the score
  const strokeDasharray = 283; // 2 * pi * 45
  const strokeDashoffset = strokeDasharray - (strokeDasharray * score) / 100;
  
  let colorClass = 'text-red-500';
  if (score >= 90) colorClass = 'text-emerald-500';
  else if (score >= 70) colorClass = 'text-amber-500';

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100" />
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="8" 
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className={`${colorClass} transition-all duration-1000 ease-out`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className={`text-3xl font-black tracking-tight ${colorClass}`}>{score}%</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Score</span>
      </div>
    </div>
  );
}

export default function ResumeAnalysisResults({ results, onReset }) {
  if (!results) return null;

  // Support both old mock payload and new Gemini payload
  const score = results.atsScore || results.overallScore || 0;
  const summary = results.summary || 'Resume analysis completed.';
  const missingKeywords = results.missingKeywords || [];
  const strengths = results.strengths || [];
  const weaknesses = results.weaknesses || [];
  const recommendedSkills = results.recommendedSkills || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Sparkles className="text-indigo-500" size={20} />
          AI Analysis Complete
        </h2>
        <button 
          onClick={onReset}
          className="flex items-center justify-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors bg-white px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 shadow-sm"
        >
          <RefreshCw size={14} />
          Analyze Another
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score & Summary */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 p-6 flex flex-col items-center text-center">
            <h3 className="text-sm font-bold text-slate-700 mb-6">ATS Compatibility Score</h3>
            <CircularScore score={score} />
            <p className="text-xs font-medium text-slate-500 mt-6 max-w-[200px]">
              {score >= 90 ? 'Great job! Your resume is highly compatible.' : score >= 70 ? 'Your resume is decent but could be improved for better ATS visibility.' : 'Your resume needs significant improvements to pass standard ATS filters.'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-indigo-100/50 p-6">
            <h3 className="text-sm font-bold text-indigo-900 mb-3 flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-600" />
              AI Summary
            </h3>
            <p className="text-sm font-medium text-indigo-800/80 leading-relaxed">
              {summary}
            </p>
          </div>
        </div>

        {/* Detailed Feedback */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Keywords Check */}
          <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50/50 p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <FileSearch size={16} />
                </div>
                <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">Keyword Coverage</h3>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-sm font-semibold text-slate-700 mb-3">Missing Keywords (Suggested additions):</p>
              <div className="flex flex-wrap gap-2">
                {missingKeywords.map((kw, i) => (
                  <span key={i} className="inline-flex items-center gap-1 bg-red-50 text-red-600 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-red-100/50">
                    <AlertCircle size={12} />
                    {kw}
                  </span>
                ))}
                {missingKeywords.length === 0 && (
                  <span className="text-sm font-medium text-emerald-500 flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    No critical keywords missing!
                  </span>
                )}
              </div>
              
              {recommendedSkills.length > 0 && (
                <div className="mt-6 pt-5 border-t border-slate-100">
                   <p className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                     <Zap size={14} className="text-amber-500" />
                     Recommended Skills to Learn:
                   </p>
                   <div className="flex flex-wrap gap-2">
                     {recommendedSkills.map((skill, i) => (
                       <span key={i} className="inline-flex items-center bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1.5 rounded-lg">
                         {skill}
                       </span>
                     ))}
                   </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 p-6 h-full">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={14} />
                </div>
                <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">Current Strengths</h3>
              </div>
              <ul className="space-y-3">
                {strengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <ChevronRight size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-sm font-medium text-slate-600 leading-relaxed">{str}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Weaknesses */}
            <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 p-6 h-full">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-6 h-6 rounded-md bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <AlertCircle size={14} />
                </div>
                <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">Areas for Growth</h3>
              </div>
              <ul className="space-y-3">
                {weaknesses.map((weak, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <ChevronRight size={14} className="text-red-500 mt-0.5 shrink-0" />
                    <span className="text-sm font-medium text-slate-600 leading-relaxed">{weak}</span>
                  </li>
                ))}
                {weaknesses.length === 0 && (
                  <span className="text-sm font-medium text-slate-500">No major weaknesses detected.</span>
                )}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

