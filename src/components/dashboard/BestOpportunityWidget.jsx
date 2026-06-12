import { ExternalLink, Star, Briefcase, Zap } from 'lucide-react';
import { useDashboardInsights } from '../../hooks/useDashboardInsights';
import OpportunityMatchBadge from '../opportunities/OpportunityMatchBadge';

export default function BestOpportunityWidget() {
  const { bestOpportunity, isLoading } = useDashboardInsights();

  if (isLoading) {
    return (
      <div className="card-standard p-6 animate-pulse">
        <div className="h-5 w-40 bg-slate-200 rounded mb-4"></div>
        <div className="h-16 w-full bg-slate-100 rounded-xl mb-4"></div>
        <div className="h-8 w-24 bg-indigo-100 rounded"></div>
      </div>
    );
  }

  if (!bestOpportunity) {
    return (
      <div className="card-standard p-6 h-full flex flex-col justify-center items-center text-center">
        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
          <Briefcase size={20} className="text-slate-400" />
        </div>
        <h3 className="text-[15px] font-bold text-slate-900 mb-1">No Matches Found</h3>
        <p className="text-[13px] text-slate-500 max-w-[80%] mx-auto">
          Complete your profile and add skills to discover your best opportunity match.
        </p>
      </div>
    );
  }

  return (
    <div className="card-standard p-6 border-2 border-indigo-50 relative overflow-hidden">
      {/* Decorative gradient corner */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl"></div>

      <div className="flex items-center gap-2 mb-5 relative z-10">
        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100">
          <Star size={16} className="text-amber-500" fill="currentColor" />
        </div>
        <h3 className="text-[16px] font-bold text-slate-900">Best Match For You</h3>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-5 shadow-sm relative z-10">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="text-[16px] font-bold text-slate-900 leading-tight">{bestOpportunity.title}</h4>
            <p className="text-[13px] font-medium text-slate-500">{bestOpportunity.company}</p>
          </div>
          <OpportunityMatchBadge score={bestOpportunity.matchData?.score} />
        </div>

        {(bestOpportunity.matchData?.reasons || []).length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
              <Zap size={12} className="text-amber-500" />
              Why it's a match
            </p>
            <ul className="space-y-1">
              {(bestOpportunity.matchData?.reasons || []).slice(0, 3).map((reason, idx) => (
                <li key={idx} className="text-[13px] text-slate-600 font-medium flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  <span className="truncate">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex justify-end relative z-10">
        <a 
          href={bestOpportunity.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-[13px] font-bold rounded-lg hover:bg-slate-800 transition-colors"
        >
          Apply Now
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
