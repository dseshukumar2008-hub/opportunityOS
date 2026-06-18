import { Sparkles, Target, Zap, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useApplications } from '../../contexts/ApplicationContext';
import { useResume } from '../../contexts/ResumeContext';
import { useGoals } from '../../contexts/GoalContext';
import { useProfile } from '../../contexts/ProfileContext';

export default function AICommandCenterWidget() {
  const { applications } = useApplications();
  const { getResumeStrength } = useResume();
  const { goals } = useGoals();
  const { profile } = useProfile();

  const atsScore = getResumeStrength ? getResumeStrength() : 0;
  const activeApps = (applications || []).filter(a => a.status !== 'Rejected' && a.status !== 'Offer').length;
  const interviewApps = (applications || []).filter(a => a.status === 'Interview').length;

  // AI Mock Calculations for Demo/Premium Feel
  const interviewReadiness = Math.min(100, Math.max(0, atsScore + (interviewApps * 5) + 10));
  
  const offerProbability = Math.min(98, 15 + (activeApps * 2) + (interviewApps * 15) + (atsScore > 80 ? 10 : 0));

  // Skill Gaps based on profile
  const targetRole = profile?.targetRole || (goals.length > 0 ? goals[0].title : 'Software Engineer');
  const skillGaps = (profile?.missingSkills || []).slice(0, 3).map(skill => ({
    skill,
    match: Math.floor(Math.random() * 40) + 20, // Mock match percentage for missing skills
    impact: Math.random() > 0.5 ? 'High' : 'Medium'
  }));

  return (
    <div className="mb-6 w-full relative overflow-hidden bg-white border border-slate-200/60 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
      {/* Decorative Gradient Background */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <div className="p-6 relative z-10">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-inner">
            <Sparkles size={16} className="text-white" />
          </div>
          <h2 className="text-[16px] font-extrabold text-slate-900 tracking-tight">AI Command Center</h2>
          <span className="ml-2 bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-emerald-100">
            Live Analysis
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          
          {/* Module 1: Offer Probability */}
          <div className="flex flex-col pt-4 md:pt-0 md:pr-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp size={14} className="text-indigo-500" /> Offer Probability
              </p>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+12% vs last week</span>
            </div>
            <div className="mt-auto">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-[42px] font-black text-slate-900 leading-none tracking-tighter">{offerProbability}%</span>
              </div>
              <p className="text-[13px] font-medium text-slate-500 mt-2 leading-relaxed">
                Based on your {activeApps} active applications and {atsScore} ATS score. Apply to 3 more roles to break 80%.
              </p>
            </div>
          </div>

          {/* Module 2: Interview Readiness */}
          <div className="flex flex-col pt-4 md:pt-0 md:px-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Target size={14} className="text-pink-500" /> Interview Readiness
              </p>
            </div>
            <div className="flex items-center gap-5 mt-auto">
              <div className="relative w-20 h-20 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100" />
                  <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="transparent" 
                    strokeDasharray={2 * Math.PI * 36} 
                    strokeDashoffset={2 * Math.PI * 36 * (1 - interviewReadiness / 100)} 
                    className="text-pink-500 transition-all duration-1000 ease-out" strokeLinecap="round" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[20px] font-black text-slate-900 leading-none">{interviewReadiness}</span>
                </div>
              </div>
              <div>
                <p className="text-[14px] font-bold text-slate-900 mb-1">Strong Technical Fit</p>
                <p className="text-[12px] text-slate-500 font-medium">Your resume aligns well, but behavioral prep needs work.</p>
                <button className="text-[12px] font-bold text-indigo-600 hover:text-indigo-700 mt-2 flex items-center gap-1">
                  Start Mock Interview →
                </button>
              </div>
            </div>
          </div>

          {/* Module 3: Skill Gap Analysis */}
          <div className="flex flex-col pt-4 md:pt-0 md:pl-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Zap size={14} className="text-amber-500" /> Top Skill Gaps
              </p>
              <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                vs {targetRole}
              </span>
            </div>
            <div className="space-y-3 mt-auto">
              {skillGaps.length > 0 ? skillGaps.map((gap, i) => (
                <div key={i} className="group">
                  <div className="flex justify-between text-[12px] font-bold mb-1.5">
                    <span className="text-slate-700 flex items-center gap-1">
                      {gap.impact === 'High' ? <AlertCircle size={12} className="text-amber-500" /> : <CheckCircle2 size={12} className="text-emerald-500" />}
                      {gap.skill}
                    </span>
                    <span className="text-slate-500">{gap.match}% Match</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-1000 ${gap.impact === 'High' ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${gap.match}%` }}></div>
                  </div>
                </div>
              )) : (
                <p className="text-[12px] text-slate-500">No skill gaps detected yet. Run a skill gap analysis!</p>
              )}
              <button className="text-[12px] font-bold text-indigo-600 hover:text-indigo-700 mt-2 w-full text-left">
                Generate Study Plan →
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
