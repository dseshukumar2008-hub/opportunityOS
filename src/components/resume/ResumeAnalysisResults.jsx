import { CheckCircle2, AlertCircle, FileSearch, Sparkles, RefreshCw, ChevronRight, Zap, Target, Award, TrendingUp, Briefcase, Activity } from 'lucide-react';

function CircularScore({ score }) {
  const r = 36;
  const strokeDasharray = 2 * Math.PI * r;
  const strokeDashoffset = strokeDasharray - (strokeDasharray * score) / 100;
  
  let colorClass = 'text-[#F97316]';
  if (score >= 80) colorClass = 'text-[#10B981]';
  else if (score >= 65) colorClass = 'text-[#F59E0B]';

  return (
    <div className="relative w-[96px] h-[96px] flex items-center justify-center shrink-0">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={r} fill="none" stroke="#F1F5F9" strokeWidth="8" />
        <circle 
          cx="48" 
          cy="48" 
          r={r} 
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
        <span className="text-[28px] font-black tracking-tight text-[#111827] leading-none">{score}</span>
        <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mt-0.5">/ 100</span>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, bg }) {
  return (
    <div className="bg-[#FAFBFF] border border-[#E5E7EB] rounded-xl p-4 flex flex-col items-center text-center justify-center h-full hover:shadow-sm transition-all duration-200">
      <div className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center mb-3 shadow-sm`}>
        <Icon size={18} strokeWidth={2.5} />
      </div>
      <span className="text-[22px] font-black text-[#111827] mb-1 leading-none">{value}</span>
      <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">{label}</span>
    </div>
  );
}

export default function ResumeAnalysisResults({ results, onReset }) {
  if (!results) return null;

  // Extract variables (Strictly from Hybrid pipeline)
  const score = results.atsScore || 0;
  const extractedSkills = results.extractedSkills || [];
  const missingKeywords = results.missingKeywords || [];
  
  const suggestedRole = results.suggestedRole || 'Not Specified';
  const summary = results.summary || 'Resume analysis completed.';
  const strengths = results.strengths || [];
  const areasForGrowth = results.areasForGrowth || [];
  const interviewReadiness = results.interviewReadiness || 'Not Ready';
  const qualityRating = results.qualityRating || (score >= 90 ? 'Excellent' : score >= 70 ? 'Good' : 'Needs Work');
  const actionPlan = results.actionPlan || {};
  const explanation = results.explanation || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Sparkles className="text-indigo-500" size={20} />
          Hybrid Analysis Complete
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
      <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#E5E7EB] p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="flex flex-col shrink-0 w-full md:w-[320px] md:border-r border-[#E5E7EB] md:pr-8">
          <div className="flex items-center gap-6">
            <CircularScore score={score} />
            <div className="flex flex-col justify-center">
              <h3 className="text-[18px] font-extrabold text-[#111827] leading-tight mb-1">ATS Compatibility</h3>
              <p className="text-[14px] font-semibold text-[#64748B] mb-3">{score}% Match</p>
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border bg-[#FAFBFF] border-[#E5E7EB] self-start">
                <div className={`w-2 h-2 rounded-full ${score >= 80 ? 'bg-[#10B981]' : score >= 65 ? 'bg-[#F59E0B]' : 'bg-[#F97316]'}`}></div>
                <span className="text-[12px] font-bold text-[#334155] tracking-wide uppercase">
                  {score >= 80 ? 'Excellent' : score >= 65 ? 'Good' : 'Needs Improvement'}
                </span>
              </div>
            </div>
          </div>
          <p className="text-[13px] text-[#64748B] font-medium mt-6 leading-relaxed">
            Based on resume structure, keywords and content quality
          </p>
        </div>

        <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4 w-full h-full">
           <StatCard icon={CheckCircle2} label="Skills" value={extractedSkills.length} color="text-[#10B981]" bg="bg-[#ECFDF5]" />
           <StatCard icon={AlertCircle} label="Missing" value={missingKeywords.length} color="text-[#F97316]" bg="bg-[#FFF7ED]" />
           <StatCard icon={TrendingUp} label="Readiness" value={interviewReadiness.split(' ')[0]} color="text-[#6D5DF6]" bg="bg-[#F4F2FF]" />
           <StatCard icon={Award} label="Quality" value={qualityRating} color="text-[#F59E0B]" bg="bg-[#FFFBEB]" />
        </div>
      </div>

      {/* AI Summary Card with Profile Snapshot */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50/50 rounded-2xl shadow-sm border border-indigo-100 p-6 md:p-8">
         <div className="flex items-center gap-2 mb-6">
           <Sparkles size={20} className="text-indigo-600" />
           <h3 className="text-base font-bold text-indigo-900">AI Profile Snapshot & Summary</h3>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
           <div className="bg-white/70 p-4 rounded-xl border border-white flex flex-col items-center text-center">
             <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1 flex items-center gap-1.5"><Briefcase size={12}/> Suggested Role</p>
             <p className="text-sm font-bold text-slate-800">{suggestedRole}</p>
           </div>
           <div className="bg-white/70 p-4 rounded-xl border border-white flex flex-col items-center text-center">
             <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1 flex items-center gap-1.5"><Target size={12}/> Top Skills</p>
             <p className="text-sm font-bold text-slate-800 truncate w-full">{extractedSkills.slice(0,3).join(', ') || 'N/A'}</p>
           </div>
           <div className="bg-white/70 p-4 rounded-xl border border-white flex flex-col items-center text-center">
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

      {/* Strengths & Areas for Growth */}
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
             <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
               <AlertCircle size={16} />
             </div>
             <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">Areas for Growth</h3>
           </div>
           <ul className="space-y-4 flex-1">
             {areasForGrowth.slice(0, 6).map((weak, i) => (
                <li key={i} className="flex items-start gap-3">
                  <ChevronRight size={18} className="text-amber-400 mt-0.5 shrink-0" />
                  <span className="text-sm font-medium text-slate-600 leading-relaxed">{weak}</span>
                </li>
             ))}
             {areasForGrowth.length === 0 && (
               <li className="text-sm font-medium text-slate-500">No major weaknesses detected.</li>
             )}
           </ul>
         </div>
      </div>

      {/* ATS Scoring Breakdown */}
      {explanation && explanation.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Activity size={16} />
            </div>
            <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">ATS Scoring Breakdown</h3>
          </div>
          
          <div className="space-y-3">
            {explanation.map((item, i) => (
              <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${item.type === 'gain' ? 'bg-emerald-50/50 border-emerald-100' : 'bg-red-50/50 border-red-100'}`}>
                <div className="flex items-center gap-3">
                  {item.type === 'gain' ? (
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  ) : (
                    <AlertCircle size={16} className="text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${item.type === 'gain' ? 'text-emerald-900' : 'text-red-900'}`}>{item.label}</span>
                </div>
                <span className={`text-sm font-bold ${item.type === 'gain' ? 'text-emerald-600' : 'text-red-600'}`}>{item.points}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Final ATS Score</span>
            <span className="text-xl font-black text-slate-900">{score}%</span>
          </div>
        </div>
      )}

      {/* Action Plan */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50 p-5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Target size={16} />
          </div>
          <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">Action Plan</h3>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {/* Immediate Fixes */}
           <div>
             <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Immediate Fixes</h4>
             <ul className="space-y-2">
               {(actionPlan.immediateFixes || []).map((fix, i) => (
                 <li key={i} className="text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">{fix}</li>
               ))}
               {!(actionPlan.immediateFixes?.length) && <p className="text-sm text-slate-400">None needed</p>}
             </ul>
           </div>
           
           {/* Skills to Learn */}
           <div>
             <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Skills to Learn</h4>
             <div className="flex flex-wrap gap-2">
               {(actionPlan.skillsToLearn || missingKeywords || []).map((skill, i) => (
                 <span key={i} className="inline-flex items-center bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-blue-100">
                   {skill}
                 </span>
               ))}
             </div>
           </div>
           
           {/* Projects to Build */}
           <div>
             <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Projects to Build</h4>
             <ul className="space-y-2">
               {(actionPlan.projectsToBuild || []).map((proj, i) => (
                 <li key={i} className="text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">{proj}</li>
               ))}
             </ul>
           </div>
           
           {/* Certifications */}
           <div>
             <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Certifications</h4>
             <ul className="space-y-2">
               {(actionPlan.certificationsToPursue || []).map((cert, i) => (
                 <li key={i} className="text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">{cert}</li>
               ))}
             </ul>
           </div>
        </div>
      </div>

    </div>
  );
}
