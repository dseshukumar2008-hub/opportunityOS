import { Calendar, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function SnapshotDetailPanel({ activeSnapshot }) {
  if (!activeSnapshot) {
    return (
      <div className="bg-slate-50 rounded-2xl border border-slate-200 border-dashed p-8 text-center text-slate-400">
        Select a history snapshot to inspect breakdown analytics.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#6D5DF6]/30 shadow-lg shadow-indigo-100/30 overflow-hidden sticky top-8 animate-fade-in">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white relative">
        <div className="absolute top-4 right-4 bg-white/10 px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider text-indigo-200">
          Checkpoint Detail
        </div>
        <span className="text-[12px] text-slate-300 font-bold flex items-center gap-1">
          <Calendar size={13} />
          {new Date(activeSnapshot.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </span>
        
        <h3 className="text-[18px] font-extrabold text-white mt-3 leading-snug line-clamp-2">
          {activeSnapshot.topRecommendation}
        </h3>
        
        <div className="flex items-center gap-4 mt-5 pt-4 border-t border-slate-700/60">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Checkpoint Score</span>
            <p className="text-[22px] font-black text-emerald-400">{activeSnapshot.averageMatchScore}%</p>
          </div>
          <div className="h-8 w-[1px] bg-slate-700" />
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">ATS Score</span>
            <p className="text-[22px] font-black text-blue-300">{activeSnapshot.atsScore || 70}%</p>
          </div>
          <div className="h-8 w-[1px] bg-slate-700" />
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Recommendations</span>
            <p className="text-[22px] font-black text-indigo-300">{activeSnapshot.recommendationCount || 2}</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-3.5">Algorithm Match Breakdown</h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[12px] font-bold text-slate-700 mb-1">
                <span>Skills Match Score</span>
                <span>{activeSnapshot.matchBreakdown?.skills || 78}%</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                  style={{ width: `${activeSnapshot.matchBreakdown?.skills || 78}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[12px] font-bold text-slate-700 mb-1">
                <span>Experience Compatibility</span>
                <span>{activeSnapshot.matchBreakdown?.experience || 70}%</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                  style={{ width: `${activeSnapshot.matchBreakdown?.experience || 70}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[12px] font-bold text-slate-700 mb-1">
                <span>ATS Layout & Formatting</span>
                <span>{activeSnapshot.matchBreakdown?.formatting || 85}%</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 rounded-full transition-all duration-500" 
                  style={{ width: `${activeSnapshot.matchBreakdown?.formatting || 85}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">Key System Actions</h4>
          <ul className="space-y-2">
            {activeSnapshot.improvements && activeSnapshot.improvements.map((insight, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] text-slate-600 font-semibold leading-relaxed">
                <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                {insight}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div>
            <h5 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2 text-emerald-600 flex items-center gap-1">
              <CheckCircle2 size={11} /> Unlocked
            </h5>
            <div className="flex flex-wrap gap-1">
              {activeSnapshot.skillsAdded && activeSnapshot.skillsAdded.map((skill, i) => (
                <span key={i} className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-100">
                  {skill}
                </span>
              ))}
              {(!activeSnapshot.skillsAdded || activeSnapshot.skillsAdded.length === 0) && (
                <span className="text-[11px] text-slate-400 italic font-medium">None added</span>
              )}
            </div>
          </div>
          <div>
            <h5 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2 text-amber-600 flex items-center gap-1">
              <ShieldAlert size={11} /> Missing
            </h5>
            <div className="flex flex-wrap gap-1">
              {activeSnapshot.skillsMissing && activeSnapshot.skillsMissing.map((skill, i) => (
                <span key={i} className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-100">
                  {skill}
                </span>
              ))}
              {(!activeSnapshot.skillsMissing || activeSnapshot.skillsMissing.length === 0) && (
                <span className="text-[11px] text-slate-400 italic font-medium">None missing</span>
              )}
            </div>
          </div>
        </div>

        {activeSnapshot.recommendedRoles && activeSnapshot.recommendedRoles.length > 0 && (
          <div className="border-t border-slate-100 pt-4 space-y-2.5">
            <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Top Recommended Roles</h4>
            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {activeSnapshot.recommendedRoles.map((roleObj, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 border border-slate-100 hover:bg-slate-50 transition-colors rounded-xl bg-slate-50/30">
                  <div>
                    <p className="text-[13px] font-black text-slate-800 line-clamp-1">{roleObj.role}</p>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{roleObj.type}</span>
                  </div>
                  <span className="text-[12px] font-black text-[#6D5DF6] bg-indigo-50 px-2 py-0.5 rounded-lg shrink-0">
                    {roleObj.score}% Match
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
