import { Award, Zap, Target, Users, Briefcase, Medal, LineChart } from 'lucide-react';
import { useCareerReadiness } from '../../hooks/useCareerReadiness';
import { Link } from 'react-router-dom';

export default function CareerReadinessPanel() {
  const { score, status, breakdown, insights, history } = useCareerReadiness();

  let color = 'text-slate-500';
  let bg = 'bg-slate-50';
  let gradient = 'from-slate-400 to-slate-500';
  
  if (status === 'Beginner') { color = 'text-orange-500'; bg = 'bg-orange-50'; gradient = 'from-orange-400 to-orange-500'; }
  else if (status === 'Intermediate') { color = 'text-indigo-500'; bg = 'bg-indigo-50'; gradient = 'from-indigo-400 to-indigo-500'; }
  else if (status === 'Advanced') { color = 'text-emerald-500'; bg = 'bg-emerald-50'; gradient = 'from-emerald-400 to-emerald-500'; }
  else if (status === 'Career Ready') { color = 'text-[#6C4CF1]'; bg = 'bg-[#6C4CF1]/10'; gradient = 'from-[#6C4CF1] to-[#8c74f5]'; }

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  if (score === 0 && history.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
          <Award size={28} className="text-indigo-600" />
        </div>
        <h3 className="text-[18px] font-extrabold text-slate-900 mb-2">Career Readiness Score</h3>
        <p className="text-[14px] text-slate-500 max-w-md mx-auto mb-6">
          Complete your profile and resume to calculate your readiness score and get personalized improvement insights.
        </p>
        <Link to="/profile" className="flex items-center gap-2 bg-[#6C4CF1] hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-[14px] transition-all">
          Complete Profile
        </Link>
      </div>
    );
  }

  const categories = [
    { id: 'profile', label: 'Profile Completeness', icon: UserIcon, data: breakdown.profile },
    { id: 'resume', label: 'Resume Quality', icon: FileTextIcon, data: breakdown.resume },
    { id: 'skills', label: 'Skills Coverage', icon: CodeIcon, data: breakdown.skills },
    { id: 'applications', label: 'Applications', icon: Briefcase, data: breakdown.applications },
    { id: 'networking', label: 'Networking', icon: Users, data: breakdown.networking },
    { id: 'teams', label: 'Team Participation', icon: Users, data: breakdown.teams }, // reused Users for now
    { id: 'certifications', label: 'Certifications', icon: Medal, data: breakdown.certifications },
    { id: 'goals', label: 'Goal Progress', icon: Target, data: breakdown.goals }
  ].filter(cat => cat.data !== undefined);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-6 md:p-8 border-b border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          
          {/* Circular Score */}
          <div className="flex items-center gap-8">
            <div className="relative flex items-center justify-center shrink-0">
              <svg className="transform -rotate-90 w-40 h-40">
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-slate-100"
                />
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className={`${color} transition-all duration-1000 ease-out`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1">Score</span>
                <span className="text-[36px] font-black text-slate-900 leading-none">{score}<span className="text-[18px]">%</span></span>
              </div>
            </div>
            
            <div>
              <h2 className="text-[24px] font-extrabold text-slate-900 mb-2">Career Readiness</h2>
              <p className="text-[14px] text-slate-500 font-medium mb-4 max-w-sm">
                Measure how prepared you are for internships, jobs, and career opportunities.
              </p>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1.5 rounded-lg text-[12px] font-extrabold uppercase tracking-wide ${bg} ${color}`}>
                  {status}
                </span>
              </div>
            </div>
          </div>

          {/* Trend Summary */}
          {history.length > 1 && (
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 min-w-[200px]">
              <h4 className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <LineChart size={14} /> Trend Tracking
              </h4>
              <div className="space-y-3">
                {history.slice(-3).map((h, i) => (
                  <div key={i} className="flex justify-between items-center text-[13px] font-bold">
                    <span className="text-slate-600">{h.week || h.date}</span>
                    <span className="text-slate-900">{h.score}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
        {/* Breakdown */}
        <div className="p-6 md:p-8">
          <h3 className="text-[15px] font-extrabold text-slate-900 mb-6 flex items-center gap-2">
            <BarChartIcon size={18} className="text-indigo-500" /> Breakdown Panel
          </h3>
          <div className="space-y-5">
            {categories.map(cat => {
              const progress = (cat.data.current / cat.data.max) * 100;
              return (
                <div key={cat.id}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[13px] font-bold text-slate-700">{cat.label}</span>
                    <span className="text-[13px] font-extrabold text-slate-900">{cat.data.current} <span className="text-slate-400 font-medium">/ {cat.data.max}</span></span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-fit bg-gradient-to-r ${gradient} rounded-full`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Insights */}
        <div className="p-6 md:p-8 bg-slate-50/50">
          <h3 className="text-[15px] font-extrabold text-slate-900 mb-6 flex items-center gap-2">
            <Zap size={18} className="text-amber-500" /> Improvement Insights
          </h3>
          {insights.length > 0 ? (
            <div className="space-y-4">
              {insights.map((insight, i) => (
                <div key={i} className="bg-white border border-slate-100 rounded-xl p-4 flex items-center justify-between shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
                  <span className="text-[14px] font-bold text-slate-700">{insight.text}</span>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[12px] font-extrabold">
                    {insight.boost}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 text-center">
              <Award size={32} className="text-emerald-500 mx-auto mb-3" />
              <h4 className="text-[15px] font-extrabold text-emerald-900 mb-1">You're doing great!</h4>
              <p className="text-[13px] text-emerald-700 font-medium">Keep up the good work across all categories to maintain your score.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Temporary icon components since I can't import all dynamically
function UserIcon(props) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> }
function FileTextIcon(props) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg> }
function CodeIcon(props) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> }
function BarChartIcon(props) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> }
