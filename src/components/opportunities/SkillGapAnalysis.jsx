import { Target, CheckCircle2, XCircle, AlertTriangle, Bot, Lightbulb } from 'lucide-react';
import { useGeminiSkillGap } from '../../hooks/useGeminiSkillGap';

export default function SkillGapAnalysis({ opportunity }) {
  const { isLoading, error, gapData, generateGapAnalysis } = useGeminiSkillGap(opportunity);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 border-4 border-indigo-100 border-t-[#6C4CF1] rounded-full animate-spin mb-4"></div>
        <h3 className="text-[16px] font-bold text-slate-900 mb-1">AI analyzing your profile...</h3>
        <p className="text-[14px] text-slate-500">Comparing your skills to the opportunity requirements.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col items-center justify-center text-center">
        <AlertTriangle size={32} className="text-red-500 mb-3" />
        <h3 className="text-[15px] font-bold text-slate-900 mb-1">Analysis Failed</h3>
        <p className="text-[13px] text-slate-500 mb-4">{error}</p>
        <button 
          onClick={() => generateGapAnalysis(true)}
          className="bg-indigo-50 text-indigo-600 font-bold px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!gapData) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm flex flex-col items-center justify-center min-h-[300px] text-center">
        <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
          <Target size={32} className="text-indigo-600" />
        </div>
        <h3 className="text-[18px] font-bold text-slate-900 mb-2">Skill Gap Analysis</h3>
        <p className="text-[14px] text-slate-500 max-w-sm mb-6">Compare your profile against this opportunity to find out what skills you need to learn.</p>
        <button 
          onClick={() => generateGapAnalysis()}
          disabled={isLoading}
          className="bg-[#6C4CF1] hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Bot size={18} />
          {isLoading ? "Generating..." : "Generate Analysis"}
        </button>
      </div>
    );
  }

  const { 
    currentSkills = [], 
    missingSkills = [], 
    prioritySkills = [], 
    recommendations = [], 
    reasoning 
  } = gapData;

  const isPerfectMatch = missingSkills.length === 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm">
      {/* Header */}
      <div className="mb-8 border-b border-slate-100 pb-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[20px] font-extrabold text-slate-900 flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                <Target size={16} className="text-indigo-600" />
              </div>
              Skill Gap Analysis
              <span className="ml-2 px-2.5 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-black uppercase tracking-wider rounded-md shadow-sm flex items-center gap-1">
                <Bot size={12} /> AI Powered
              </span>
            </h2>
            <p className="text-[14px] text-slate-500 font-medium">Identify what is missing to become a stronger candidate.</p>
          </div>
          <button 
            onClick={() => generateGapAnalysis(true)} 
            className="text-[12px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            Refresh
          </button>
        </div>

        {reasoning && (
          <div className="mt-5 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100/50 p-4 rounded-xl flex gap-3">
            <Bot className="text-indigo-500 shrink-0 mt-0.5" size={20} />
            <p className="text-[14px] text-indigo-900 font-medium leading-relaxed">{reasoning}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Skills Overview */}
        <div className="flex flex-col gap-6 h-full">
          {/* Matched */}
          <div>
            <h3 className="text-[15px] font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              Current Skills
            </h3>
            {currentSkills.length > 0 ? (
              <ul className="space-y-3">
                {currentSkills.map((skill, i) => (
                  <li key={i} className="flex items-center gap-3 bg-emerald-50/50 border border-emerald-100 px-3 py-2 rounded-xl">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    <span className="text-[14px] font-bold text-emerald-900">{skill}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[13px] text-slate-500 italic bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">No matched skills found.</p>
            )}
          </div>

          {/* Missing */}
          <div>
            <h3 className="text-[15px] font-bold text-slate-900 mb-4 flex items-center gap-2">
              <XCircle size={16} className="text-red-500" />
              Missing Skills
            </h3>
            {missingSkills.length > 0 ? (
              <ul className="space-y-3">
                {missingSkills.map((skill, i) => (
                  <li key={i} className="flex items-center justify-between bg-white border border-slate-200 px-4 py-3 rounded-xl shadow-sm">
                    <span className="text-[14px] font-bold text-slate-900">{skill}</span>
                    {prioritySkills.includes(skill) && (
                      <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded border bg-red-50 text-red-600 border-red-200">
                        High Priority
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[13px] text-slate-500 italic bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" /> You have all required skills!
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Recommendations */}
        <div className="flex flex-col gap-6">
          {!isPerfectMatch && (recommendations || []).length > 0 && (
            <div className="bg-slate-50 border border-slate-100 rounded-[20px] p-6 h-full">
              <h3 className="text-[15px] font-extrabold text-slate-900 mb-5 flex items-center gap-2">
                <Lightbulb size={18} className="text-amber-500" />
                Actionable Recommendations
              </h3>
              <div className="space-y-4 relative">
                <div className="absolute top-4 bottom-4 left-[15px] w-0.5 bg-indigo-100 z-0"></div>
                {(recommendations || []).map((rec, i) => (
                  <div key={i} className="flex items-start gap-4 relative z-10">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 border-4 border-white flex items-center justify-center shrink-0 shadow-sm">
                      <span className="text-[12px] font-black text-indigo-600">{i + 1}</span>
                    </div>
                    <div className="flex-1 bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all">
                      <p className="text-[13px] text-slate-700 font-medium leading-relaxed">{rec}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
