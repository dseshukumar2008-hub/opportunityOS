import { CheckCircle2, AlertCircle, FileSearch, Sparkles, RefreshCw, ChevronRight, Zap, Target, Award, TrendingUp, Briefcase } from 'lucide-react';

function CircularScore({ score }) {
  const strokeDasharray = 283; // 2 * pi * 45
  const strokeDashoffset = strokeDasharray - (strokeDasharray * score) / 100;
  
  let colorClass = 'text-red-500';
  if (score >= 90) colorClass = 'text-emerald-500';
  else if (score >= 70) colorClass = 'text-amber-500';

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
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
        <span className={`text-2xl font-black tracking-tight ${colorClass}`}>{score}%</span>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, bg }) {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col items-center text-center justify-center h-full">
      <div className={`w-10 h-10 rounded-lg ${bg} ${color} flex items-center justify-center mb-3`}>
        <Icon size={20} strokeWidth={2.5} />
      </div>
      <span className="text-2xl font-black text-slate-800 mb-1">{value}</span>
      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</span>
    </div>
  );
}

export default function ResumeAnalysisResults({ results, onReset }) {
  if (!results) return null;

  // Extract variables
  const score = results.atsScore || results.overallScore || 0;
  const summary = results.summary || 'Resume analysis completed.';
  const missingKeywords = results.missingKeywords || [];
  const strengths = results.strengths || [];
  const weaknesses = results.weaknesses || [];
  const recommendedSkills = results.recommendedSkills || [];
  const extractedSkills = results.extractedSkills || [];
  const improvements = results.improvements || [];
  const careerSuggestions = results.careerSuggestions || [];
  
  const qualityRating = score >= 90 ? 'Excellent' : score >= 70 ? 'Good' : 'Needs Work';

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Hero Section: ATS Score + Quick Stats */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6 flex flex-col md:flex-row items-center gap-6 md:gap-8">
        <div className="flex flex-col items-center justify-center shrink-0 w-full md:w-auto md:border-r border-slate-100 md:pr-8">
          <h3 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">ATS Score</h3>
          <CircularScore score={score} />
          <p className="text-[11px] font-bold text-slate-400 mt-2 max-w-[140px] text-center uppercase tracking-wider">
            {score >= 90 ? 'Highly Compatible' : score >= 70 ? 'Moderate Fit' : 'Needs Improvement'}
          </p>
        </div>

        <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4 w-full h-full">
           <StatCard icon={CheckCircle2} label="Skills Detected" value={extractedSkills.length} color="text-emerald-500" bg="bg-emerald-100" />
           <StatCard icon={AlertCircle} label="Missing Keywords" value={missingKeywords.length} color="text-red-500" bg="bg-red-100" />
           <StatCard icon={TrendingUp} label="Improvements" value={improvements.length} color="text-indigo-500" bg="bg-indigo-100" />
           <StatCard icon={Award} label="Quality Rating" value={qualityRating} color="text-amber-500" bg="bg-amber-100" />
        </div>
      </div>

      {/* Keyword Coverage */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50 p-5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <FileSearch size={16} />
          </div>
          <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">Keyword Coverage & Recommendations</h3>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <AlertCircle size={16} className="text-red-500" />
              Missing Keywords
            </p>
            <div className="flex flex-wrap gap-2">
              {missingKeywords.length > 0 ? missingKeywords.map((kw, i) => (
                <span key={i} className="inline-flex items-center bg-red-50 text-red-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-red-100">
                  {kw}
                </span>
              )) : (
                <span className="text-sm font-medium text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 size={16} /> No critical keywords missing!
                </span>
              )}
            </div>
          </div>
          
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <Zap size={16} className="text-amber-500" />
              Recommended Skills to Learn
            </p>
            <div className="flex flex-wrap gap-2">
              {recommendedSkills.length > 0 ? recommendedSkills.map((skill, i) => (
                <span key={i} className="inline-flex items-center bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200">
                  {skill}
                </span>
              )) : (
                <span className="text-sm font-medium text-slate-500">None</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Summary Card with Profile Snapshot */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50/50 rounded-2xl shadow-sm border border-indigo-100 p-6 md:p-8">
         <div className="flex items-center gap-2 mb-6">
           <Sparkles size={20} className="text-indigo-600" />
           <h3 className="text-base font-bold text-indigo-900">AI Profile Snapshot & Summary</h3>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
           <div className="bg-white/70 p-4 rounded-xl border border-white">
             <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1 flex items-center gap-1.5"><Briefcase size={12}/> Suggested Role</p>
             <p className="text-sm font-bold text-slate-800">{careerSuggestions[0] || 'Professional'}</p>
           </div>
           <div className="bg-white/70 p-4 rounded-xl border border-white">
             <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1 flex items-center gap-1.5"><Target size={12}/> Top Skills</p>
             <p className="text-sm font-bold text-slate-800 truncate">{extractedSkills.slice(0,3).join(', ') || 'N/A'}</p>
           </div>
           <div className="bg-white/70 p-4 rounded-xl border border-white">
             <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1 flex items-center gap-1.5"><TrendingUp size={12}/> ATS Rating</p>
             <p className="text-sm font-bold text-slate-800">{qualityRating}</p>
           </div>
         </div>

         <div className="bg-white/50 p-5 rounded-xl border border-white/60">
            <p className="text-sm font-semibold text-indigo-900/90 leading-relaxed">
              {summary}
            </p>
         </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
         <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
           <div className="flex items-center gap-3 mb-6">
             <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
               <CheckCircle2 size={16} />
             </div>
             <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">Current Strengths</h3>
           </div>
           <ul className="space-y-4 flex-1">
             {strengths.slice(0, 6).map((str, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-sm font-medium text-slate-600 leading-relaxed">{str}</span>
                </li>
             ))}
           </ul>
         </div>
         
         <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
           <div className="flex items-center gap-3 mb-6">
             <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
               <AlertCircle size={16} />
             </div>
             <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">Areas for Growth</h3>
           </div>
           <ul className="space-y-4 flex-1">
             {weaknesses.slice(0, 6).map((weak, i) => (
                <li key={i} className="flex items-start gap-3">
                  <ChevronRight size={18} className="text-red-400 mt-0.5 shrink-0" />
                  <span className="text-sm font-medium text-slate-600 leading-relaxed">{weak}</span>
                </li>
             ))}
             {weaknesses.length === 0 && (
               <li className="text-sm font-medium text-slate-500">No major weaknesses detected.</li>
             )}
           </ul>
         </div>
      </div>
    </div>
  );
}

