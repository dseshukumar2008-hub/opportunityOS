import { useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useDashboardInsights } from '../../hooks/useDashboardInsights';
import { TrendingUp, Zap, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getUserFirstName } from '../../utils/userUtils';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function ScoreRing({ score, size = 140 }) {
  const strokeColor = score >= 80 ? '#10B981' : score >= 50 ? '#F59E0B' : '#6C4CF1';
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 36 36" className="-rotate-90 absolute inset-0">
        <circle cx="18" cy="18" r="14" fill="none" stroke="#F1F5F9" strokeWidth="3.5" />
        <circle
          cx="18" cy="18" r="14" fill="none"
          stroke={strokeColor}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={`${score} 100`}
          strokeDashoffset="0"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="relative z-10 flex flex-col items-center">
        <span className="text-[30px] font-black leading-none text-slate-900">{score}%</span>
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Readiness</span>
      </div>
    </div>
  );
}

export default function DashboardHeroWidget() {
  const { user } = useAuth();
  const { profile, isLoading: profileLoading } = useUserProfile();
  const { careerReadiness, isLoading: insightsLoading } = useDashboardInsights();

  const greeting = useMemo(() => getGreeting(), []);
  const isLoading = profileLoading || insightsLoading;
  const firstName = getUserFirstName(user, profile);
  const aiScore = careerReadiness?.score ?? 62;
  const nextMilestone = aiScore < 70 ? 70 : aiScore < 85 ? 85 : 100;

  if (isLoading) {
    return <div className="h-[200px] bg-white rounded-[24px] border border-slate-100 animate-pulse" />;
  }

  return (
    <div className="w-full bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row items-center gap-8">

        {/* Left: Score Ring */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <ScoreRing score={aiScore} size={150} />
          <div className="flex items-center gap-1.5 mt-4 bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[12px] font-bold">
            <TrendingUp size={12} />
            ↑ 8% this week
          </div>
        </div>

        {/* Center: Greeting + Progress */}
        <div className="flex-1 max-w-xl">
          <p className="text-[13px] font-bold text-indigo-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <Zap size={13} /> Career Readiness
          </p>
          <h1 className="text-[26px] lg:text-[30px] font-black text-slate-900 mb-1 leading-tight">
            {firstName ? `${greeting}, ${firstName}! 👋` : `${greeting}! 👋`}
          </h1>
          <p className="text-[14px] text-slate-500 font-medium mb-6">
            Let's make progress toward your dream career.
          </p>

          {/* Progress Bar */}
          <div className="w-full mb-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[12px] font-bold text-slate-600">Progress to next milestone</span>
              <span className="text-[12px] font-bold text-[#6C4CF1]">Next: {nextMilestone}%</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#6C4CF1] to-indigo-400 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min((aiScore / nextMilestone) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Action Chips */}
          <div className="flex flex-wrap gap-2 mt-5">
            <Link to="/resume-review" className="flex items-center gap-1.5 px-4 py-2 bg-[#6C4CF1] text-white rounded-xl text-[12px] font-bold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
              <Zap size={13} /> Improve Resume
            </Link>
            <Link to="/opportunities" className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-[12px] font-bold hover:bg-slate-50 transition-colors">
              <Target size={13} className="text-indigo-500" /> Browse Matches
            </Link>
          </div>
        </div>

        {/* Right: Illustration */}
        <div className="hidden lg:flex items-center justify-center shrink-0 w-[220px]">
          <div className="relative w-full h-[160px] bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl border border-indigo-100 flex items-center justify-center overflow-hidden">
            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-indigo-100/40 blur-xl" />
            <img
              src="https://api.dicebear.com/7.x/notionists/svg?seed=career&backgroundColor=transparent"
              alt="Career Illustration"
              className="w-[120px] h-[120px] object-contain opacity-90"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
