import { useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useDashboardInsights } from '../../hooks/useDashboardInsights';

export default function DailyDigestStrip() {
  const { user } = useAuth();
  const { recommendedOpportunities, applicationInsights, isLoading } = useDashboardInsights();

  const firstName = user?.name?.split(' ')[0] || 'there';
  
  const newMatches = recommendedOpportunities?.length ?? 0;
  const activeApps = applicationInsights?.active ?? 0;

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* Profile & Greeting */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 border-[3px] border-white shadow-md overflow-hidden">
          {user?.photo_url ? (
            <img src={user.photo_url} alt={firstName} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xl font-black text-indigo-600">{firstName.charAt(0)}</span>
          )}
        </div>
        <div className="shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-[22px] font-black text-slate-900 leading-tight">
              Welcome back, {firstName} 👋
            </h1>
            <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-100 uppercase tracking-wider">
              {user?.track || 'Software Engineering'}
            </span>
          </div>
          <p className="text-[13px] font-medium text-slate-500">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} • Ready to make progress?
          </p>
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className="flex items-center gap-4 bg-slate-50 px-5 py-2.5 rounded-xl border border-slate-100">
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Active Apps</span>
          <span className="text-[18px] font-black text-slate-800 leading-none">{activeApps}</span>
        </div>
        <div className="h-8 w-px bg-slate-200"></div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Pending Invites</span>
          <span className="text-[18px] font-black text-slate-800 leading-none">2</span>
        </div>
        <div className="h-8 w-px bg-slate-200"></div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">New Matches</span>
          <span className="text-[18px] font-black text-indigo-600 leading-none">{newMatches}</span>
        </div>
      </div>
    </div>
  );
}
