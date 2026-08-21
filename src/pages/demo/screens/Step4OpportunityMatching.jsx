import {  CheckCircle2, XCircle, Target } from 'lucide-react';

export default function Step4OpportunityMatching() {
  const matchResult = {
    currentMatchScore: 92,
    strengths: ['React', 'JavaScript', 'Node.js', 'Frontend Architecture'],
    missingSkills: ['GraphQL', 'AWS'],
    recommendations: [
      { recommendedAction: 'Add GraphQL experience to your resume', matchImpact: '+4%' },
      { recommendedAction: 'Highlight AWS certifications', matchImpact: '+2%' }
    ]
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto w-full p-4 lg:p-8 animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row items-center md:justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50 to-transparent rounded-bl-full pointer-events-none -z-10"></div>
        <div className="flex flex-col sm:flex-row items-center gap-5 relative z-10 w-full md:w-auto text-center sm:text-left">
          <div className="w-20 h-20 shrink-0 relative flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90 absolute top-0 left-0">
              <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f1f5f9" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="3" strokeDasharray="92 8" strokeDashoffset="0" strokeLinecap="round" />
            </svg>
            <span className="text-[18px] font-black text-slate-900 absolute">{matchResult.currentMatchScore}%</span>
          </div>
          <div>
            <h2 className="text-[18px] font-extrabold text-slate-900 mb-2">Match Analysis</h2>
            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-[12px] font-bold shadow-sm ring-1 ring-inset bg-emerald-50 text-emerald-600 border-emerald-200">
              Strong Match
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex-1 md:flex-none bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 flex flex-col items-center justify-center min-w-[110px]">
            <div className="flex items-center gap-1.5 text-emerald-600 font-bold mb-1">
              <CheckCircle2 size={16} />
              <span className="text-[18px]">{matchResult.strengths.length}</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Matched</span>
          </div>
          <div className="flex-1 md:flex-none bg-rose-50/50 border border-rose-100 rounded-xl p-4 flex flex-col items-center justify-center min-w-[110px]">
            <div className="flex items-center gap-1.5 text-rose-600 font-bold mb-1">
              <XCircle size={16} />
              <span className="text-[18px]">{matchResult.missingSkills.length}</span>
            </div>
            <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">Missing</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Skill Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-4 border-b border-slate-100 pb-2">
              <CheckCircle2 size={16} className="text-emerald-500" /> Matched Skills
            </h4>
            <ul className="space-y-2">
              {matchResult.strengths.map((skill, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm font-medium text-slate-700">
                  <span className="text-emerald-500 mt-0.5">•</span> {skill}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-4 border-b border-slate-100 pb-2">
              <XCircle size={16} className="text-red-500" /> Missing Requirements
            </h4>
            <ul className="space-y-2">
              {matchResult.missingSkills.map((skill, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm font-medium text-slate-700">
                  <span className="text-red-500 mt-0.5">•</span> {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Top Improvements</h3>
        <div className="space-y-4">
          {matchResult.recommendations.map((rec, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800">{rec.recommendedAction}</p>
                <p className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1">
                  <Target size={12} /> Expected Impact: {rec.matchImpact}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
