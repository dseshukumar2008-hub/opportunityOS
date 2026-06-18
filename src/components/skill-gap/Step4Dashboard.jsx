import { Briefcase, RefreshCw, AlertCircle, Clock, Target, Flame, Zap, Code, Layout, GraduationCap, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';

function CircularProgress({ pct, color = '#6C4CF1' }) {
  const size = 120;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative flex items-center justify-center w-full max-w-[120px] aspect-square mx-auto">
      <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90 w-full h-auto">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F1F5F9" strokeWidth={stroke}/>
        <circle
          cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (pct / 100) * c}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center inset-0">
        <span className="font-black text-slate-900 text-3xl">{pct}%</span>
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
  
  const pctStrong = strong / total;
  const pctModerate = moderate / total;
  const pctMissing = missing / total;

  const offStrong = 0;
  const offModerate = pctStrong * c;
  const offMissing = (pctStrong + pctModerate) * c;

  return (
    <div className="relative flex items-center justify-center w-full max-w-[160px] aspect-square mx-auto">
      <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90 w-full h-auto">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F1F5F9" strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#EF4444" strokeWidth={stroke} strokeDasharray={`${pctMissing * c} ${c}`} strokeDashoffset={-offMissing} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F59E0B" strokeWidth={stroke} strokeDasharray={`${pctModerate * c} ${c}`} strokeDashoffset={-offModerate} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#10B981" strokeWidth={stroke} strokeDasharray={`${pctStrong * c} ${c}`} strokeDashoffset={-offStrong} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[24px] font-black text-slate-900 leading-none">{total}</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Skills</span>
      </div>
    </div>
  );
}

export default function Step4Dashboard({ data, onReset }) {
  const { 
    targetRole, readinessScore, skillGapPercentage, currentSkills, 
    skillBreakdown, nextSkill, missingSkills, learningPath 
  } = data;

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
          <RefreshCw size={16} /> Analyze Again
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        
        {/* MAIN COLUMN (Left 9 cols) */}
        <div className="lg:col-span-9 flex flex-col gap-6 w-full">
          
          {/* ROW 1: Hero KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {/* Target Role Card */}
            <div className="bg-white rounded-[24px] border border-slate-100 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300 w-full h-full">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0">
                  <Briefcase size={28} className="text-[#6C4CF1]" />
                </div>
                <div>
                  <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Target Role</p>
                  <h3 className="font-black text-slate-900 text-[18px] leading-tight line-clamp-2">{targetRole}</h3>
                </div>
              </div>
              <div className="mt-auto">
                <button onClick={onReset} className="text-[13px] font-bold text-[#6C4CF1] hover:text-indigo-700 transition-colors">Change Goal →</button>
              </div>
            </div>

            {/* Readiness Score Card */}
            <div className="bg-white rounded-[24px] border border-slate-100 p-6 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow duration-300 w-full h-full">
              <div className="w-[100px] shrink-0">
                <CircularProgress pct={readinessScore} />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <p className="font-black text-slate-900 text-[18px] mb-2 leading-tight">Overall Readiness</p>
                <p className="text-[13px] text-slate-500 font-medium leading-snug">You are <strong className="text-[#6C4CF1]">{readinessScore}%</strong> ready for your target role.</p>
              </div>
            </div>

            {/* Skill Gap Card */}
            <div className="bg-white rounded-[24px] border border-slate-100 p-6 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow duration-300 w-full h-full">
              <div className="w-[100px] h-[100px] shrink-0 rounded-full border-[10px] border-red-50 flex items-center justify-center bg-white shadow-inner">
                <div className="flex items-baseline">
                  <span className="text-[28px] font-black text-red-500 tracking-tighter">{skillGapPercentage}</span>
                  <span className="text-[16px] font-bold text-red-500">%</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Skill Gap</p>
                <p className="text-[13px] text-slate-500 font-medium leading-snug">You need to work on missing technical skills.</p>
              </div>
            </div>
          </div>

          {/* ROW 2: Skills Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-stretch">
            {/* Current Skills */}
            <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col w-full h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2Icon className="text-emerald-500 w-5 h-5" />
                  <h3 className="font-bold text-slate-900 text-[15px]">Current Skills</h3>
                </div>
                <span className="text-[10px] font-extrabold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">{currentSkills.length} Total</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-4 flex-1 content-start overflow-y-auto max-h-[190px] pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                {currentSkills.map(s => (
                  <span key={s} className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-semibold rounded-md transition-colors hover:border-slate-300">
                    {s}
                  </span>
                ))}
              </div>
              <div className="mt-auto pt-3 border-t border-slate-100">
                <button className="text-[12px] font-bold text-[#6C4CF1] hover:text-indigo-700 transition-colors flex items-center gap-1.5">
                  <EditIcon className="w-3.5 h-3.5" /> Edit Skills
                </button>
              </div>
            </div>

            {/* Skills Breakdown */}
            <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col w-full h-full">
              <h3 className="font-bold text-slate-900 text-[15px] mb-5 w-full text-left">Skills Breakdown</h3>
              <div className="flex flex-col items-center gap-6 w-full flex-1 justify-center">
                <div className="w-[160px] shrink-0">
                  <DonutChart strong={skillBreakdown.strong} moderate={skillBreakdown.moderate} missing={skillBreakdown.missing} />
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-center justify-between text-[12px] font-bold py-1.5 border-b border-slate-50">
                    <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-sm bg-[#10B981]" /> <span className="text-slate-700">Strong</span></div>
                    <span className="text-slate-900">{skillBreakdown.strong} <span className="text-slate-400 font-medium ml-1">({(skillBreakdown.strong / (skillBreakdown.strong + skillBreakdown.moderate + skillBreakdown.missing) * 100).toFixed(0)}%)</span></span>
                  </div>
                  <div className="flex items-center justify-between text-[12px] font-bold py-1.5 border-b border-slate-50">
                    <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-sm bg-[#F59E0B]" /> <span className="text-slate-700">Moderate</span></div>
                    <span className="text-slate-900">{skillBreakdown.moderate} <span className="text-slate-400 font-medium ml-1">({(skillBreakdown.moderate / (skillBreakdown.strong + skillBreakdown.moderate + skillBreakdown.missing) * 100).toFixed(0)}%)</span></span>
                  </div>
                  <div className="flex items-center justify-between text-[12px] font-bold py-1.5">
                    <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-sm bg-[#EF4444]" /> <span className="text-slate-700">Missing</span></div>
                    <span className="text-slate-900">{skillBreakdown.missing} <span className="text-slate-400 font-medium ml-1">({(skillBreakdown.missing / (skillBreakdown.strong + skillBreakdown.moderate + skillBreakdown.missing) * 100).toFixed(0)}%)</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Skill - Focal Point */}
            <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col relative w-full h-full border-t-4 border-t-[#6C4CF1]">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                  <Target size={16} className="text-[#6C4CF1]" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-[13px] uppercase tracking-wide">Next Skill To Learn</h3>
              </div>
              
              <h2 className="text-[20px] font-black text-slate-900 mb-5 leading-tight line-clamp-2">{nextSkill.name}</h2>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-red-50 text-red-700 border border-red-100 px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5">
                  <AlertCircle size={12}/> {nextSkill.priority} Priority
                </span>
                <span className="bg-slate-50 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5">
                  <Clock size={12}/> {nextSkill.time}
                </span>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5">
                  <Zap size={12}/> {nextSkill.impact} Impact
                </span>
              </div>

              <p className="text-[13px] text-slate-500 font-medium leading-relaxed mb-6 flex-1 line-clamp-3">{nextSkill.reason}</p>
              
              <button className="w-full py-3.5 bg-gradient-to-r from-[#6C4CF1] to-[#8B5CF6] hover:opacity-90 text-white rounded-xl text-[14px] font-bold transition-all shadow-md hover:shadow-lg mt-auto shrink-0 flex justify-center items-center gap-2">
                Start Learning
              </button>
            </div>
          </div>

          {/* ROW 3: Missing Skills By Priority */}
          <div className="w-full flex flex-col h-full">
            <h3 className="font-black text-slate-900 mb-5 text-[18px]">Missing Skills by Priority</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full flex-1">
              {/* High */}
              <div className="bg-[#FFF5F5] rounded-[24px] p-6 relative overflow-hidden w-full h-full flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between mb-5">
                  <h4 className="font-bold text-red-600 text-[15px]">High Priority</h4>
                  <span className="w-7 h-7 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-[12px] font-black">{missingSkills.high.length}</span>
                </div>
                <ul className="space-y-3 relative z-10 flex-1">
                  {missingSkills.high.map(s => (
                    <li key={s} className="text-[13px] font-semibold text-slate-700 flex items-start gap-2.5 leading-relaxed">
                      <span className="text-red-400 mt-1 shrink-0">•</span> <span>{s}</span>
                    </li>
                  ))}
                </ul>
                <AlertCircle className="absolute -bottom-6 -right-6 text-red-100 w-32 h-32 opacity-40 z-0 pointer-events-none" />
              </div>
              
              {/* Medium */}
              <div className="bg-[#FFFBEB] rounded-[24px] p-6 relative overflow-hidden w-full h-full flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between mb-5">
                  <h4 className="font-bold text-amber-600 text-[15px]">Medium Priority</h4>
                  <span className="w-7 h-7 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-[12px] font-black">{missingSkills.medium.length}</span>
                </div>
                <ul className="space-y-3 relative z-10 flex-1">
                  {missingSkills.medium.map(s => (
                    <li key={s} className="text-[13px] font-semibold text-slate-700 flex items-start gap-2.5 leading-relaxed">
                      <span className="text-amber-400 mt-1 shrink-0">•</span> <span>{s}</span>
                    </li>
                  ))}
                </ul>
                <Clock className="absolute -bottom-6 -right-6 text-amber-100 w-32 h-32 opacity-40 z-0 pointer-events-none" />
              </div>

              {/* Low */}
              <div className="bg-[#F0FDF4] rounded-[24px] p-6 relative overflow-hidden w-full h-full flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between mb-5">
                  <h4 className="font-bold text-emerald-600 text-[15px]">Low Priority</h4>
                  <span className="w-7 h-7 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-[12px] font-black">{missingSkills.low.length}</span>
                </div>
                <ul className="space-y-3 relative z-10 flex-1">
                  {missingSkills.low.map(s => (
                    <li key={s} className="text-[13px] font-semibold text-slate-700 flex items-start gap-2.5 leading-relaxed">
                      <span className="text-emerald-400 mt-1 shrink-0">•</span> <span>{s}</span>
                    </li>
                  ))}
                </ul>
                <div className="absolute -bottom-6 -right-6 text-emerald-100 w-32 h-32 opacity-40 flex items-center justify-center z-0 pointer-events-none">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
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
                
                {learningPath.map((step, idx) => (
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

        </div>

        {/* RIGHT SIDEBAR (Right 3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-6 w-full lg:sticky lg:top-6 self-start">
          {/* AI Advice */}
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-[24px] p-6 lg:p-8 w-full shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <Sparkles size={20} className="text-[#6C4CF1]" />
              </div>
              <h3 className="font-black text-slate-900 text-[16px]">AI Career Advice</h3>
            </div>
            <p className="text-[14px] text-slate-700 font-medium leading-loose">
              {data.aiAdvice || "Keep up the good work. Focus on closing your skill gaps to achieve your career goals."}
            </p>
          </div>

          {/* Consistency Tip */}
          <div className="bg-orange-50 border border-orange-100 rounded-[24px] p-6 lg:p-8 w-full shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <Flame size={20} className="text-orange-500" />
              </div>
              <h3 className="font-black text-slate-900 text-[16px]">Consistency Tip</h3>
            </div>
            <p className="text-[14px] text-slate-700 font-medium leading-loose">
              {data.consistencyTip || "Learn for at least 1-2 hours daily to stay consistent and build strong fundamentals."}
            </p>
          </div>

        </div>

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
function BookOpen({ className, size=24 }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
}
