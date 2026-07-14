import { Link } from 'react-router-dom';
import { FileText, Sparkles, TrendingUp, Target } from 'lucide-react';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useDashboardInsights } from '../../hooks/useDashboardInsights';
import { useResumeInsights } from '../../hooks/useResumeInsights';

function getScoreColor(score) {
  if (score >= 80) return { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', ring: 'bg-emerald-500', label: 'Excellent' };
  if (score >= 60) return { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', ring: 'bg-amber-500', label: 'Good' };
  return { text: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200', ring: 'bg-red-400', label: 'Needs Work' };
}

function StatPill({ icon: Icon, label, value, subtext, color = 'indigo', to }) {
  const colorMap = {
    indigo: { icon: 'text-indigo-500', bg: 'bg-indigo-50/50', value: 'text-slate-900', subtext: 'text-indigo-600' },
    emerald: { icon: 'text-emerald-500', bg: 'bg-emerald-50/50', value: 'text-slate-900', subtext: 'text-emerald-600' },
    amber: { icon: 'text-amber-500', bg: 'bg-amber-50/50', value: 'text-slate-900', subtext: 'text-amber-600' },
    violet: { icon: 'text-violet-500', bg: 'bg-violet-50/50', value: 'text-slate-900', subtext: 'text-violet-600' },
    rose: { icon: 'text-rose-500', bg: 'bg-rose-50/50', value: 'text-slate-900', subtext: 'text-rose-600' },
  };
  const c = colorMap[color] || colorMap.indigo;

  const inner = (
    <div className="flex flex-col p-5 rounded-[16px] border border-slate-100 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer h-full">
      <div className={`w-8 h-8 rounded-xl ${c.bg} flex items-center justify-center mb-4`}>
        <Icon size={16} className={c.icon} />
      </div>
      <span className="text-[28px] font-black leading-none text-slate-900 block mb-1">{value}</span>
      <span className="text-[12px] font-bold text-slate-500 mb-2">{label}</span>
      {subtext && (
        <div className="flex items-center gap-1 mt-auto pt-2 border-t border-slate-100">
          <TrendingUp size={10} className={c.subtext} />
          <span className={`text-[11px] font-bold ${c.subtext}`}>{subtext}</span>
        </div>
      )}
    </div>
  );

  return to ? <Link to={to} className="h-full block">{inner}</Link> : <div className="h-full">{inner}</div>;
}

export default function DashboardKPIsWidget() {
  const { profile, isLoading: profileLoading } = useUserProfile();
  const {
    careerReadiness,
    profileCompletion,
    isLoading: insightsLoading,
  } = useDashboardInsights();
  const { atsScore, hasInsights } = useResumeInsights();

  const isLoading = profileLoading || insightsLoading;

  const resumeScore = hasInsights ? atsScore : 0;
  const aiScore = careerReadiness?.score ?? 0;
  const completion = profileCompletion?.score ?? 0;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-white border border-slate-100 rounded-[16px] animate-pulse" />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {/* Profile Completion */}
      <StatPill icon={Target} label="Profile Completion" value={`${completion}%`} subtext={completion >= 80 ? "Great" : "Complete profile"} color="indigo" to="/profile" />

      {/* Resume Score */}
      <StatPill icon={FileText} label="Resume Score" value={`${resumeScore}%`} subtext={resumeScore >= 70 ? "Good" : "Needs work"} color="violet" to="/resume-review" />
      {/* Career Readiness Score */}
      <StatPill icon={Sparkles} label="Career Readiness" value={`${aiScore}%`} subtext={aiScore >= 70 ? "Ready" : "Needs work"} color="emerald" to="/career-coach" />
    </div>
  );
}
