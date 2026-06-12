import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Briefcase, FileText, TrendingUp, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useDashboardInsights } from '../../hooks/useDashboardInsights';
import { useResumeInsights } from '../../hooks/useResumeInsights';

function getGreeting() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'Good morning';
  if (h >= 12 && h < 17) return 'Good afternoon';
  if (h >= 17 && h < 21) return 'Good evening';
  return 'Good night';
}

function StatPill({ icon: Icon, label, value, colorClass, href }) {
  const content = (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[12px] font-bold whitespace-nowrap transition-all hover:shadow-sm ${colorClass}`}>
      <Icon size={12} />
      <span className="font-black">{value}</span>
      <span className="font-semibold opacity-70">{label}</span>
    </span>
  );
  return href ? <Link to={href}>{content}</Link> : content;
}

export default function HeroSection() {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { recommendedOpportunities, applicationInsights, careerReadiness, bestOpportunity, isLoading } =
    useDashboardInsights();
  const { atsScore, hasInsights } = useResumeInsights();

  const greeting = useMemo(() => getGreeting(), []);
  const firstName = profile?.name?.split(' ')[0] || user?.name?.split(' ')[0] || 'there';
  const initials = (profile?.name || user?.name || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const readiness = careerReadiness?.score ?? 0;
  const activeApps = applicationInsights?.active ?? 0;
  const newMatches = recommendedOpportunities?.length ?? 0;
  const bestMatchScore = bestOpportunity?.matchData?.score ?? null;

  const readinessColor =
    readiness >= 80
      ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
      : readiness >= 50
      ? 'text-amber-600 bg-amber-50 border-amber-200'
      : 'text-red-500 bg-red-50 border-red-200';

  const atsColor =
    hasInsights && atsScore >= 75
      ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
      : hasInsights
      ? 'text-amber-600 bg-amber-50 border-amber-200'
      : 'text-slate-500 bg-slate-50 border-slate-200';

  const pills = [
    {
      icon: TrendingUp,
      label: 'Readiness',
      value: `${readiness}%`,
      colorClass: readinessColor,
      href: '/analytics',
    },
    {
      icon: FileText,
      label: 'ATS Score',
      value: hasInsights ? `${atsScore ?? '--'}` : '--',
      colorClass: atsColor,
      href: '/resume-review',
    },
    {
      icon: Briefcase,
      label: 'Active Apps',
      value: activeApps,
      colorClass: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      href: '/applications',
    },
    {
      icon: Clock,
      label: 'New Matches',
      value: newMatches,
      colorClass: 'text-blue-600 bg-blue-50 border-blue-200',
      href: '/opportunities',
    },
    ...(bestMatchScore != null
      ? [
          {
            icon: Users,
            label: 'Best Fit',
            value: `${bestMatchScore}%`,
            colorClass: 'text-purple-600 bg-purple-50 border-purple-200',
            href: '/opportunities',
          },
        ]
      : []),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative w-full bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
    >
      {/* Top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      {/* Background decorative orb */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/60 rounded-full blur-3xl translate-x-1/3 -translate-y-1/2 pointer-events-none" />

      <div className="relative z-10 px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-indigo-100 shadow-md">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[20px] font-black">
                  {initials}
                </div>
              )}
            </div>
            {/* Online dot */}
            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white" />
          </div>

          {/* Identity */}
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <h1 className="text-[22px] font-black text-slate-900 leading-tight flex items-center gap-2 flex-wrap">
              {greeting}, {firstName}!
              <span className="text-[20px]">👋</span>
            </h1>
            {profile?.college && (
              <p className="text-[13px] font-semibold text-slate-500 mt-0.5 truncate">
                {profile.branch ? `${profile.branch} · ` : ''}
                {profile.college}
                {profile.gradYear ? ` · ${profile.gradYear}` : ''}
              </p>
            )}
          </div>

          {/* Gemini Badge */}
          <div className="shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-200 text-indigo-700 text-[12px] font-bold">
              <Sparkles size={13} className="text-indigo-500" />
              Powered by Gemini
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100 my-4" />

        {/* Pills row + briefing */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {isLoading
              ? [1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className="h-7 w-24 bg-slate-100 rounded-full animate-pulse"
                  />
                ))
              : pills.map((p, i) => <StatPill key={i} {...p} />)}
          </div>

          {/* Briefing caption */}
          {!isLoading && (
            <p className="text-[12px] font-semibold text-slate-400 sm:text-right shrink-0 max-w-[200px] leading-relaxed">
              Your career briefing is ready below ↓
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
