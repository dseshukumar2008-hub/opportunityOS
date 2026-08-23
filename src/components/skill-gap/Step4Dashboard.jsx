import { useState } from 'react';
import { Briefcase, RefreshCw, AlertCircle, Clock, Target, Flame, Zap, Code, Bot } from 'lucide-react';

function CircularProgress({ pct, color = '#6C4CF1', trackColor = '#F1F5F9', textColor = 'text-slate-900' }) {
  const size = 120;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative flex items-center justify-center w-full max-w-[120px] aspect-square mx-auto">
      <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90 w-full h-auto">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke}/>
        <circle
          cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (pct / 100) * c}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center inset-0">
        <span className={`font-black ${textColor} text-3xl`}>{pct}%</span>
      </div>
    </div>
  );
}

function DonutChart({ strong, moderate, missing }) {
  const size = 180;
  const stroke = 24;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const total = strong + moderate + missing;
  
  const pctStrong = total > 0 ? strong / total : 0;
  const pctModerate = total > 0 ? moderate / total : 0;
  const pctMissing = total > 0 ? missing / total : 0;

  const offStrong = 0;
  const offModerate = pctStrong * c;
  const offMissing = (pctStrong + pctModerate) * c;

  return (
    <div className="relative flex items-center justify-center w-full max-w-[160px] aspect-square mx-auto">
      <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90 w-full h-auto">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F1F5F9" strokeWidth={stroke}/>
        {total > 0 && (
          <>
            <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#EF4444" strokeWidth={stroke} strokeDasharray={`${pctMissing * c} ${c}`} strokeDashoffset={-offMissing} />
            <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F59E0B" strokeWidth={stroke} strokeDasharray={`${pctModerate * c} ${c}`} strokeDashoffset={-offModerate} />
            <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#10B981" strokeWidth={stroke} strokeDasharray={`${pctStrong * c} ${c}`} strokeDashoffset={-offStrong} />
          </>
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[24px] font-black text-slate-900 leading-none">{total}</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Skills</span>
      </div>
    </div>
  );
}

export default function Step4Dashboard({ data, onReset }) {
  const [showAllSkills, setShowAllSkills] = useState(false);
  const { 
    targetRole = "Unknown Role", readinessScore = 0, skillGapPercentage = 0, currentSkills = [], 
    skillBreakdown = { strong: 0, moderate: 0, missing: 0 }, 
    missingSkills: rawMissingSkills, 
    learningPath = [] 
  } = data || {};

  // Normalize missingSkills to ensure it's always the expected object format, even if legacy flat array
  const missingSkills = Array.isArray(rawMissingSkills) 
    ? { high: rawMissingSkills, medium: [], low: [] } 
    : rawMissingSkills || { high: [], medium: [], low: [] };

  if (data?._error) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-500 bg-white rounded-[24px] border border-slate-100 shadow-sm">
        <AlertCircle size={64} className="text-red-500 mb-6" />
        <h2 className="text-2xl font-black text-slate-900 mb-4">Analysis Failed</h2>
        <p className="text-slate-500 font-medium mb-8 text-center max-w-md">
          {data.message || "We encountered an error while generating your skill gap analysis. Please try again."}
        </p>
        <button 
          onClick={onReset}
          className="px-8 py-3 bg-[#6C4CF1] hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md flex items-center gap-2"
        >
          <RefreshCw size={18} /> Retry Analysis
        </button>
      </div>
    );
  }

  const totalSkills = skillBreakdown.strong + skillBreakdown.moderate + skillBreakdown.missing;

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Skill Gap Analysis</h1>
          <p className="text-slate-500 font-medium mt-1">Discover the gap between your current skills and your target role</p>
        </div>
        <button 
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-[#6C4CF1] hover:bg-indigo-50 hover:text-[#6C4CF1] text-slate-700 rounded-xl font-bold transition-all shadow-sm shrink-0"
        >
          <RefreshCw size={16} /> Start New Analysis
        </button>
      </div>

      <div className="flex flex-col gap-6 w-full">
        
        {/* ROW 1: Hero KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-stretch">
          {/* Target Role Card */}
          <div className="bg-white rounded-[24px] border border-slate-100 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300 h-full w-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0">
                <Briefcase size={28} className="text-[#6C4CF1]" />
              </div>
              <div>
                <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Target Role</p>
                <h3 className="font-black text-slate-900 text-[18px] leading-tight line-clamp-2">{targetRole}</h3>
              </div>
            </div>
            <div className="mt-auto pt-4 border-t border-slate-50">
              <button onClick={onReset} className="text-[13px] font-bold text-[#6C4CF1] hover:text-indigo-700 transition-colors">Change Goal →</button>
            </div>
          </div>

          {/* Readiness Score Card */}
          <div className="bg-white rounded-[24px] border border-slate-100 p-6 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow duration-300 h-full w-full">
            <div className="w-[100px] shrink-0">
              <CircularProgress pct={readinessScore} />
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <p className="font-black text-slate-900 text-[18px] mb-2 leading-tight">Overall Readiness</p>
              <p className="text-[13px] text-slate-500 font-medium leading-snug">You are <strong className="text-[#6C4CF1]">{readinessScore}%</strong> ready for your target role.</p>
            </div>
          </div>

          {/* Skill Gap Card */}
          <div className="bg-white rounded-[24px] border border-slate-100 p-6 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow duration-300 h-full w-full">
            <div className="w-[100px] shrink-0">
              <CircularProgress pct={skillGapPercentage} color="#EF4444" trackColor="#FEF2F2" textColor="text-red-500" />
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Skill Gap</p>
              <p className="text-[13px] text-slate-500 font-medium leading-snug">You need to work on missing technical skills.</p>
            </div>
          </div>
        </div>

        {/* AI Advice Banner */}
        {data?.aiAdvice && (
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-[24px] p-6 w-full shadow-sm flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
              <Sparkles size={24} className="text-[#6C4CF1]" />
            </div>
            <div className="flex-1">
              <h3 className="font-black text-slate-900 text-[16px] mb-2">AI Career Advice</h3>
              <p className="text-[14px] text-slate-700 font-medium leading-relaxed">
                {data.aiAdvice}
              </p>
            </div>
          </div>
        )}

        {/* ROW 2: Skills Overview */}
        <div className="grid grid-cols-1 gap-6 w-full items-start">
          
          {/* Current Skills & Breakdown */}
          <div className="flex flex-col gap-6 w-full">
            
            {/* Current Skills - Compact with View All */}
            <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col w-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-slate-50 to-transparent rounded-bl-full pointer-events-none opacity-50" />
              <div className="flex items-center justify-between mb-4 shrink-0 relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-500">
                    <CheckCircle2Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-[16px]">Verified Skills</h3>
                </div>
                <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">{currentSkills?.length || 0} Detected</span>
              </div>
              <div className="flex flex-wrap gap-2 relative z-10">
                {(showAllSkills ? currentSkills : currentSkills?.slice(0, 8) || []).map(s => (
                  <span key={s} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-[12px] font-bold rounded-lg shadow-sm hover:border-[#6C4CF1] transition-colors hover:text-[#6C4CF1] cursor-default">
                    {s}
                  </span>
                ))}
                {currentSkills?.length === 0 && (
                  <span className="text-[13px] text-slate-500 italic">No skills detected.</span>
                )}
                {currentSkills?.length > 8 && (
                  <button 
                    onClick={() => setShowAllSkills(!showAllSkills)}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 text-[12px] font-bold rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    {showAllSkills ? "Show Less" : `+${currentSkills.length - 8} More`}
                  </button>
                )}
              </div>
            </div>

            {/* Skills Breakdown - Horizontal Progress */}
            <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col w-full">
              <h3 className="font-extrabold text-slate-900 text-[16px] mb-4">Readiness Breakdown</h3>
              <div className="flex flex-col gap-4">
                
                {/* Progress Bar Container */}
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                  <div style={{ width: `${totalSkills > 0 ? (skillBreakdown.strong / totalSkills) * 100 : 0}%` }} className="h-full bg-[#10B981] transition-all duration-1000" />
                  <div style={{ width: `${totalSkills > 0 ? (skillBreakdown.moderate / totalSkills) * 100 : 0}%` }} className="h-full bg-[#F59E0B] transition-all duration-1000" />
                  <div style={{ width: `${totalSkills > 0 ? (skillBreakdown.missing / totalSkills) * 100 : 0}%` }} className="h-full bg-[#EF4444] transition-all duration-1000" />
                </div>
                
                {/* Legend */}
                <div className="flex items-center justify-between mt-1">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 mb-0.5"><div className="w-2 h-2 rounded-full bg-[#10B981]" /> <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Strong</span></div>
                    <span className="text-[18px] font-black text-slate-900">{skillBreakdown.strong} <span className="text-[12px] text-slate-400 font-bold ml-0.5">({totalSkills > 0 ? (skillBreakdown.strong / totalSkills * 100).toFixed(0) : 0}%)</span></span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1.5 mb-0.5"><div className="w-2 h-2 rounded-full bg-[#F59E0B]" /> <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Moderate</span></div>
                    <span className="text-[18px] font-black text-slate-900">{skillBreakdown.moderate} <span className="text-[12px] text-slate-400 font-bold ml-0.5">({totalSkills > 0 ? (skillBreakdown.moderate / totalSkills * 100).toFixed(0) : 0}%)</span></span>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1.5 mb-0.5"><div className="w-2 h-2 rounded-full bg-[#EF4444]" /> <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Missing</span></div>
                    <span className="text-[18px] font-black text-slate-900">{skillBreakdown.missing} <span className="text-[12px] text-slate-400 font-bold ml-0.5">({totalSkills > 0 ? (skillBreakdown.missing / totalSkills * 100).toFixed(0) : 0}%)</span></span>
                  </div>
                </div>

              </div>
            </div>
          </div>
          
        </div>

        {/* ROW 3: Missing Skills By Priority */}
        <div className="w-full flex flex-col mb-8">
          <h3 className="font-black text-slate-900 mb-5 text-[18px]">Missing Skills by Priority</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-stretch">
            {/* High */}
            <div className="bg-white rounded-[24px] p-6 relative overflow-hidden w-full h-full flex flex-col shadow-sm hover:shadow-lg border border-slate-100 hover:border-red-200 transition-all duration-300 group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-rose-400 opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-50 rounded-full blur-2xl group-hover:bg-red-100 transition-colors pointer-events-none" />
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center shrink-0 border border-red-100 group-hover:scale-110 transition-transform duration-300">
                    <AlertCircle size={20} className="text-red-500" />
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-[16px]">High Priority</h4>
                </div>
                <span className="bg-white border border-slate-100 shadow-sm text-slate-700 px-3 py-1 rounded-xl text-[13px] font-black">{missingSkills?.high?.length || 0}</span>
              </div>
              
              <div className="flex flex-col gap-3 relative z-10 flex-1">
                {(missingSkills?.high || []).map(s => (
                  <div key={s} className="flex items-center gap-3 px-3.5 py-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md hover:border-red-200 transition-all group/item">
                    <div className="w-2 h-2 rounded-full bg-red-500 ring-4 ring-red-50 group-hover/item:ring-red-100 group-hover/item:scale-110 transition-all" />
                    <span className="text-[14px] font-bold text-slate-700 group-hover/item:text-slate-900 transition-colors">{s}</span>
                  </div>
                ))}
                {(!missingSkills?.high || missingSkills.high.length === 0) && (
                   <div className="flex-1 flex items-center justify-center text-[13px] text-slate-400 font-medium italic py-4">No high priority skills missing</div>
                )}
              </div>
            </div>
            
            {/* Medium */}
            <div className="bg-white rounded-[24px] p-6 relative overflow-hidden w-full h-full flex flex-col shadow-sm hover:shadow-lg border border-slate-100 hover:border-amber-200 transition-all duration-300 group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-400 opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-50 rounded-full blur-2xl group-hover:bg-amber-100 transition-colors pointer-events-none" />
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100 group-hover:scale-110 transition-transform duration-300">
                    <Clock size={20} className="text-amber-500" />
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-[16px]">Medium Priority</h4>
                </div>
                <span className="bg-white border border-slate-100 shadow-sm text-slate-700 px-3 py-1 rounded-xl text-[13px] font-black">{missingSkills?.medium?.length || 0}</span>
              </div>
              
              <div className="flex flex-col gap-3 relative z-10 flex-1">
                {(missingSkills?.medium || []).map(s => (
                  <div key={s} className="flex items-center gap-3 px-3.5 py-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md hover:border-amber-200 transition-all group/item">
                    <div className="w-2 h-2 rounded-full bg-amber-500 ring-4 ring-amber-50 group-hover/item:ring-amber-100 group-hover/item:scale-110 transition-all" />
                    <span className="text-[14px] font-bold text-slate-700 group-hover/item:text-slate-900 transition-colors">{s}</span>
                  </div>
                ))}
                {(!missingSkills?.medium || missingSkills.medium.length === 0) && (
                   <div className="flex-1 flex items-center justify-center text-[13px] text-slate-400 font-medium italic py-4">No medium priority skills missing</div>
                )}
              </div>
            </div>

            {/* Low */}
            <div className="bg-white rounded-[24px] p-6 relative overflow-hidden w-full h-full flex flex-col shadow-sm hover:shadow-lg border border-slate-100 hover:border-emerald-200 transition-all duration-300 group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-400 opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-50 rounded-full blur-2xl group-hover:bg-emerald-100 transition-colors pointer-events-none" />
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:scale-110 transition-transform duration-300">
                    <Target size={20} className="text-emerald-500" />
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-[16px]">Low Priority</h4>
                </div>
                <span className="bg-white border border-slate-100 shadow-sm text-slate-700 px-3 py-1 rounded-xl text-[13px] font-black">{missingSkills?.low?.length || 0}</span>
              </div>
              
              <div className="flex flex-col gap-3 relative z-10 flex-1">
                {(missingSkills?.low || []).map(s => (
                  <div key={s} className="flex items-center gap-3 px-3.5 py-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group/item">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-50 group-hover/item:ring-emerald-100 group-hover/item:scale-110 transition-all" />
                    <span className="text-[14px] font-bold text-slate-700 group-hover/item:text-slate-900 transition-colors">{s}</span>
                  </div>
                ))}
                {(!missingSkills?.low || missingSkills.low.length === 0) && (
                   <div className="flex-1 flex items-center justify-center text-[13px] text-slate-400 font-medium italic py-4">No low priority skills missing</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ROW 4: Learning Path */}
        <div className="w-full mb-2">
          <h3 className="font-black text-slate-900 mb-5 text-[18px]">Recommended Learning Path</h3>
          <div className="bg-white rounded-[24px] border border-slate-100 p-8 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-x-auto w-full scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            <div className="flex justify-between w-full relative pb-4 px-4 min-w-[800px]">
              {/* Connecting Line */}
              <div className="absolute top-[22px] left-16 right-16 h-1 bg-slate-100 rounded-full" />
              
              {(learningPath || []).map((step, idx) => (
                <div key={idx} className="flex flex-col items-center w-36 relative z-10 group shrink-0">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 text-[#6C4CF1] flex items-center justify-center text-[12px] font-black mb-4 border-2 border-white ring-4 ring-white shadow-sm transition-transform group-hover:scale-110">
                    {idx + 1}
                  </div>
                  <div className="w-14 h-14 bg-white rounded-[16px] border border-slate-200 group-hover:border-[#6C4CF1] group-hover:bg-[#6C4CF1]/5 flex items-center justify-center mb-4 shadow-sm transition-all">
                    <Code size={24} className="text-slate-400 group-hover:text-[#6C4CF1] transition-colors" />
                  </div>
                  <h5 className="text-[13px] font-bold text-slate-800 text-center leading-tight mb-1.5 px-2 group-hover:text-[#6C4CF1] transition-colors">{step.title}</h5>
                  <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-2.5 py-0.5 rounded-md">{step.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Consistency Tip Banner */}
        {data?.consistencyTip && (
          <div className="bg-orange-50/50 border border-orange-100 rounded-[24px] p-6 w-full shadow-sm flex flex-col sm:flex-row sm:items-start gap-4 mb-8">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
              <Flame size={24} className="text-orange-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-black text-slate-900 text-[16px] mb-2">Consistency Tip</h3>
              <p className="text-[14px] text-slate-700 font-medium leading-relaxed">
                {data.consistencyTip}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Icon Helpers
function CheckCircle2Icon({ className }) {
  return <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>;
}
function EditIcon({ className }) {
  return <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>;
}
function Sparkles({ className, size=24 }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;
}
// eslint-disable-next-line no-unused-vars
function BookOpen({ className, size=24 }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
}
