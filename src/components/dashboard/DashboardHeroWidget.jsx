import { useMemo } from 'react';
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

export default function DashboardHeroWidget({ userState }) {
  const { user, profile, insights, hasProfile, isNewUser } = userState || {};
  const careerReadiness = insights?.careerReadiness;

  const greeting = useMemo(() => getGreeting(), []);
  const isLoading = insights?.isLoading;
  const firstName = getUserFirstName(user, profile);



  const aiScore = isNewUser ? 0 : (careerReadiness?.score ?? 0);
  const nextMilestone = aiScore < 70 ? 70 : aiScore < 85 ? 85 : 100;


  const readinessLabel = isNewUser ? 'Getting started' : `${aiScore}%`;
  const progressBarWidth = isNewUser ? '0%' : `${Math.min((aiScore / nextMilestone) * 100, 100)}%`;

  if (isLoading) {
    return <div className="h-[200px] bg-white rounded-[24px] border border-slate-100 animate-pulse" />;
  }

  return (
    <div className="w-full bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row items-center gap-8">

        {/* Left: Score Ring */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <ScoreRing score={aiScore} size={150} />
          {!isNewUser && aiScore > 0 && (
            <div className="flex items-center gap-1.5 mt-4 bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[12px] font-bold">
              <TrendingUp size={12} />
              ↑ 8% this week
            </div>
          )}
        </div>

        {/* Center: Greeting + Progress */}
        <div className="flex-1 max-w-xl">
          <p className="text-[13px] font-bold text-indigo-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <Zap size={13} /> Career Readiness: {isNewUser ? 'Getting started' : `${aiScore}%`}
          </p>
          <h1 className="text-[26px] lg:text-[30px] font-black text-slate-900 mb-1 leading-tight">
            {firstName ? `${greeting}, ${firstName}! 👋` : `${greeting}! 👋`}
          </h1>
          <p className="text-[14px] text-slate-500 font-medium mb-6">
            {isNewUser ? "Let's get your career profile ready." : "Let's make progress toward your dream career."}
          </p>


          {/* Action Chips */}
          <div className="flex flex-wrap gap-2 mt-5">
            {isNewUser || !hasProfile ? (
              <Link to="/profile" className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl text-[12px] font-bold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
                <Target size={13} /> Complete Profile →
              </Link>
            ) : (
              <>
                <Link to="/resume-review" className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl text-[12px] font-bold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
                  <Zap size={13} /> Improve Resume
                </Link>
                <Link to="/skill-gap" className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-[12px] font-bold hover:bg-slate-50 transition-colors">
                  <Target size={13} className="text-indigo-500" /> Identify Skill Gaps
                </Link>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
