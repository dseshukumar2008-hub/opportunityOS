import { useMemo } from 'react';
import { TrendingUp, ExternalLink, Clock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLiveOpportunities } from '../../hooks/useLiveOpportunities';

function timeAgo(dateStr) {
  if (!dateStr) return 'Recently';
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

const RANK_COLORS = [
  'from-amber-500 to-orange-500',
  'from-slate-500 to-slate-600',
  'from-orange-400 to-red-400',
  'from-indigo-500 to-purple-500',
  'from-teal-500 to-emerald-500',
];

export default function TrendingOpportunitiesWidget() {
  const { opportunities, isLoading } = useLiveOpportunities();

  // "Trending" = most recently posted, limited to 5
  const trending = useMemo(() => {
    if (!opportunities?.length) return [];
    return [...opportunities]
      .sort((a, b) => new Date(b.postedDate || 0) - new Date(a.postedDate || 0))
      .slice(0, 5);
  }, [opportunities]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 animate-pulse">
        <div className="flex items-center justify-between mb-5">
          <div className="h-5 w-44 bg-slate-200 rounded" />
          <div className="h-4 w-20 bg-slate-100 rounded" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-[68px] bg-slate-50 rounded-xl border border-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[15px] font-bold text-slate-900 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-sm">
            <TrendingUp size={14} className="text-white" />
          </span>
          Trending Right Now
        </h3>
        <Link
          to="/opportunities"
          className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          View all →
        </Link>
      </div>

      {trending.length === 0 ? (
        <div className="text-center py-10">
          <Zap size={32} className="mx-auto text-slate-300 mb-3" />
          <p className="text-sm font-semibold text-slate-500">No trending opportunities yet.</p>
          <p className="text-xs text-slate-400 mt-1">Check back soon — new roles are added daily.</p>
        </div>
      ) : (
        <ol className="space-y-2.5">
          {trending.map((opp, idx) => (
            <li
              key={opp.id}
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-indigo-100 hover:shadow-sm transition-all group cursor-default"
            >
              {/* Rank badge */}
              <div
                className={`w-7 h-7 rounded-lg bg-gradient-to-br ${RANK_COLORS[idx]} flex items-center justify-center text-white text-[11px] font-black shrink-0 shadow-sm`}
              >
                {idx + 1}
              </div>

              {/* Logo */}
              <div className="w-9 h-9 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                <img
                  src={opp.logo}
                  alt={opp.company}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.textContent = (opp.company || 'C')[0].toUpperCase();
                  }}
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-slate-900 truncate leading-tight">
                  {opp.title}
                </p>
                <p className="text-[11px] font-semibold text-slate-500 truncate">
                  {opp.company}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Clock size={10} className="text-slate-400" />
                  <span className="text-[10px] font-medium text-slate-400">{timeAgo(opp.postedDate)}</span>
                  {opp.type && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide bg-indigo-50 text-indigo-600 rounded-md">
                      {opp.type}
                    </span>
                  )}
                </div>
              </div>

              {/* Apply CTA */}
              <a
                href={opp.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors opacity-0 group-hover:opacity-100"
                title="Apply"
              >
                <ExternalLink size={14} />
              </a>
            </li>
          ))}
        </ol>
      )}

      {/* Footer pulse */}
      <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <p className="text-[11px] font-semibold text-slate-400">
          Live data · Updated every 24h
        </p>
      </div>
    </div>
  );
}
