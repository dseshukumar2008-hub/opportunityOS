import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  User, FileText, Briefcase, BookmarkCheck, Users2,
  Sparkles, ChevronRight, TrendingUp,
  Target, Zap,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useDashboardInsights } from '../../hooks/useDashboardInsights';
import { useResumeInsights } from '../../hooks/useResumeInsights';
import { useSavedOpportunities } from '../../contexts/SavedOpportunitiesContext';
import { useTeam } from '../../contexts/TeamContext';
import { getUserFirstName } from '../../utils/userUtils';

// ── helpers ──────────────────────────────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function getScoreColor(score) {
  if (score >= 80) return { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', ring: 'bg-emerald-500', label: 'Excellent' };
  if (score >= 60) return { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', ring: 'bg-amber-500', label: 'Good' };
  return { text: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200', ring: 'bg-red-400', label: 'Needs Work' };
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatPill({ icon: Icon, label, value, color = 'indigo', to }) {
  const colorMap = {
    indigo: { icon: 'text-indigo-500', bg: 'bg-indigo-50', value: 'text-indigo-700' },
    emerald: { icon: 'text-emerald-500', bg: 'bg-emerald-50', value: 'text-emerald-700' },
    amber: { icon: 'text-amber-500', bg: 'bg-amber-50', value: 'text-amber-700' },
    violet: { icon: 'text-violet-500', bg: 'bg-violet-50', value: 'text-violet-700' },
    rose: { icon: 'text-rose-500', bg: 'bg-rose-50', value: 'text-rose-700' },
    slate: { icon: 'text-slate-500', bg: 'bg-slate-100', value: 'text-slate-700' },
  };
  const c = colorMap[color] || colorMap.indigo;

  const inner = (
    <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer min-w-[90px]">
      <div className={`w-8 h-8 rounded-xl ${c.bg} flex items-center justify-center`}>
        <Icon size={15} className={c.icon} />
      </div>
      <span className={`text-[17px] font-black leading-none ${c.value}`}>{value}</span>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center leading-tight">{label}</span>
    </div>
  );

  return to ? <Link to={to}>{inner}</Link> : inner;
}

function QuickAction({ icon: Icon, label, to, primary = false }) {
  const base = 'flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[12px] font-bold transition-all duration-200 whitespace-nowrap';
  const style = primary
    ? `${base} bg-[#6C4CF1] text-white shadow-[0_4px_14px_rgba(108,76,241,0.35)] hover:bg-[#5a3dd4] hover:shadow-[0_6px_20px_rgba(108,76,241,0.4)] hover:-translate-y-0.5`
    : `${base} bg-white border border-slate-200 text-slate-700 shadow-sm hover:border-[#6C4CF1]/30 hover:text-[#6C4CF1] hover:shadow-md hover:-translate-y-0.5`;

  return (
    <Link to={to} className={style}>
      <Icon size={13} />
      {label}
    </Link>
  );
}

// ── Circular AI Score Ring ───────────────────────────────────────────────────

function ScoreRing({ score, size = 88 }) {
  const c = getScoreColor(score);
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 36 36" className="-rotate-90 absolute inset-0">
        <circle cx="18" cy="18" r="14" fill="none" stroke="#F1F5F9" strokeWidth="3.5" />
        <circle
          cx="18" cy="18" r="14" fill="none"
          stroke={score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : '#EF4444'}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={`${score} 100`}
          strokeDashoffset="0"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="relative z-10 flex flex-col items-center">
        <span className={`text-[18px] font-black leading-none ${c.text}`}>{score}</span>
        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wide">score</span>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function CareerCommandCenter() {
  const { user } = useAuth();
  const { profile, isLoading: profileLoading } = useUserProfile();
  const {
    applicationInsights,
    careerReadiness,
    profileCompletion,
    isLoading: insightsLoading,
  } = useDashboardInsights();
  const { atsScore, hasInsights } = useResumeInsights();
  const { savedOpportunities } = useSavedOpportunities();
  const { getMyTeams } = useTeam();

  const greeting = useMemo(() => getGreeting(), []);

  const isLoading = profileLoading || insightsLoading;

  const firstName = getUserFirstName(user, profile);
  const initials = (profile?.name || user?.displayName || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const profilePct = profileCompletion?.score ?? 0;
  const resumeScore = hasInsights ? atsScore : null;
  const totalApplications = applicationInsights?.submitted ?? 0;
  const savedCount = savedOpportunities?.length ?? 0;
  const activeTeams = getMyTeams()?.length ?? 0;
  const aiScore = careerReadiness?.score ?? 0;
  const profileColor = getScoreColor(profilePct);
  const readinessColor = getScoreColor(aiScore);

  // ── Skeleton ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="w-full rounded-[24px] bg-white border border-[#F1F3F9] shadow-[0_8px_24px_-12px_rgba(0,0,0,0.06)] p-6 animate-pulse">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-slate-200 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-slate-200 rounded w-48" />
            <div className="h-3 bg-slate-100 rounded w-64" />
          </div>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
          {[...Array(6)].map((_, i) => <div key={i} className="h-20 bg-slate-100 rounded-2xl" />)}
        </div>
        <div className="flex gap-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-9 bg-slate-100 rounded-2xl w-32" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-[24px] border border-[#F1F3F9] shadow-[0_8px_40px_-12px_rgba(108,76,241,0.12)] bg-white">
      
      {/* ── Decorative gradient blobs ── */}
      <div className="pointer-events-none absolute -top-16 -right-16 w-72 h-72 bg-gradient-to-br from-violet-100/60 to-indigo-100/30 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 w-56 h-56 bg-gradient-to-tr from-indigo-50/50 to-purple-50/30 rounded-full blur-2xl" />

      <div className="relative z-10 p-6 lg:p-8">

        {/* ── Row 1: Identity ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          
          {/* Avatar + Name */}
          <div className="flex items-center gap-4">
            {/* Avatar with AI score ring */}
            <div className="relative shrink-0">
              <div className="w-[68px] h-[68px] rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center border-[3px] border-white shadow-lg overflow-hidden">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt={firstName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-black text-indigo-600">{initials}</span>
                )}
              </div>
              {/* Online dot */}
              <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white shadow-sm" />
            </div>

            {/* Text */}
            <div>
              <div className="flex items-center flex-wrap gap-2 mb-0.5">
                <h1 className="text-[22px] lg:text-[26px] font-black text-slate-900 leading-tight">
                  {firstName ? `${greeting}, ${firstName} 👋` : `${greeting}! 👋`}
                </h1>
                {user?.track && (
                  <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-full border border-indigo-100 uppercase tracking-wider shrink-0">
                    {user.track}
                  </span>
                )}
              </div>
              <p className="text-[13px] text-slate-500 font-medium">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                {' · '}
                <span className="text-indigo-500 font-semibold">Career Command Center</span>
              </p>
            </div>
          </div>

          {/* AI Career Score – ring display */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 shrink-0">
            <ScoreRing score={aiScore} size={72} />
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">AI Career Score</p>
              <p className={`text-[14px] font-black ${readinessColor.text}`}>{readinessColor.label}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp size={10} className="text-emerald-500" />
                <span className="text-[10px] font-bold text-emerald-600">Career Readiness</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 2: Stats Grid ── */}
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-6">
          {/* Profile Completion */}
          <Link to="/profile" className="contents">
            <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer relative overflow-hidden group">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-indigo-50/50 to-transparent rounded-2xl" />
              <div className={`relative w-8 h-8 rounded-xl ${profileColor.bg} flex items-center justify-center`}>
                <User size={15} className={profileColor.text} />
              </div>
              <span className={`relative text-[17px] font-black leading-none ${profileColor.text}`}>{profilePct}%</span>
              <span className="relative text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center leading-tight">Profile</span>
              {/* Progress bar at bottom */}
              <div className="relative w-full h-1 bg-slate-100 rounded-full overflow-hidden mt-0.5">
                <div
                  className={`h-full rounded-full ${profileColor.ring} transition-all duration-1000 ease-out`}
                  style={{ width: `${profilePct}%` }}
                />
              </div>
            </div>
          </Link>

          {/* Resume Score */}
          <Link to="/resume-review" className="contents">
            <div className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group relative overflow-hidden ${hasInsights ? 'border-slate-100' : 'border-dashed border-slate-200'}`}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-violet-50/50 to-transparent rounded-2xl" />
              <div className={`relative w-8 h-8 rounded-xl ${hasInsights ? 'bg-violet-50' : 'bg-slate-50'} flex items-center justify-center`}>
                <FileText size={15} className={hasInsights ? 'text-violet-600' : 'text-slate-400'} />
              </div>
              <span className={`relative text-[17px] font-black leading-none ${hasInsights ? 'text-violet-700' : 'text-slate-400'}`}>
                {hasInsights ? resumeScore : '–'}
              </span>
              <span className="relative text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center leading-tight">Resume</span>
              <div className={`relative w-full h-1 rounded-full overflow-hidden mt-0.5 ${hasInsights ? 'bg-slate-100' : 'bg-transparent'}`}>
                {hasInsights && (
                  <div
                    className={`h-full rounded-full ${getScoreColor(resumeScore).ring} transition-all duration-1000 ease-out`}
                    style={{ width: `${resumeScore}%` }}
                  />
                )}
              </div>
            </div>
          </Link>

          {/* Applications */}
          <StatPill icon={Briefcase} label="Applications" value={totalApplications} color="indigo" to="/applications" />

          {/* Saved */}
          <StatPill icon={BookmarkCheck} label="Saved" value={savedCount} color="violet" to="/saved" />

          {/* Teams */}
          <StatPill icon={Users2} label="Teams" value={activeTeams} color="emerald" to="/team-finder" />

          {/* Career Readiness % */}
          <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border border-slate-100 bg-gradient-to-b from-indigo-50/60 to-white shadow-sm relative overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-white/80 flex items-center justify-center shadow-sm">
              <Sparkles size={15} className="text-[#6C4CF1]" />
            </div>
            <span className="text-[17px] font-black leading-none text-[#6C4CF1]">{aiScore}%</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center leading-tight">AI Score</span>
            <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mt-0.5">
              <div
                className="h-full rounded-full bg-[#6C4CF1] transition-all duration-1000 ease-out"
                style={{ width: `${aiScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* ── Row 3: Divider ── */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-5" />

        {/* ── Row 4: Quick Actions ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Zap size={13} className="text-[#6C4CF1]" />
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Quick Actions</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <QuickAction icon={User} label="Complete Profile" to="/profile" primary />
            <QuickAction icon={FileText} label="Improve Resume" to="/resume-review" />
            <QuickAction icon={Target} label="Find Opportunities" to="/opportunities" />
            <QuickAction icon={Users2} label="Create Team" to="/team-finder" />
            <Link
              to="/opportunities"
              className="flex items-center gap-1 text-[11px] font-bold text-[#6C4CF1] hover:text-indigo-800 transition-colors ml-1"
            >
              Explore all <ChevronRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
