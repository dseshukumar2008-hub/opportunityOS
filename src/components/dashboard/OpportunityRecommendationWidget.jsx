import { Link } from 'react-router-dom';
import { Bookmark, BookmarkCheck, MapPin, Building, Info, TrendingUp, ChevronRight } from 'lucide-react';
import { useRecommendations } from '../../hooks/useRecommendations';
import { useSavedOpportunities } from '../../contexts/SavedOpportunitiesContext';
import OpportunityMatchBadge from '../opportunities/OpportunityMatchBadge';

export default function OpportunityRecommendationWidget() {
  const { recommendations, isLoading } = useRecommendations();
  const { isSaved, toggleSaved } = useSavedOpportunities();

  if (isLoading) {
    return (
      <div className="w-full mb-6 animate-pulse">
        <div className="h-6 w-48 bg-slate-200 rounded mb-4"></div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="min-w-[260px] h-32 bg-white rounded-2xl border border-slate-100 shrink-0"></div>
          ))}
        </div>
      </div>
    );
  }

  const topOpportunities = recommendations?.slice(0, 5) || [];

  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-[16px] font-black text-slate-900">Top Opportunity Matches</h3>
        <Link to="/opportunities" className="text-[12px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1">
          View all matches <ChevronRight size={14} />
        </Link>
      </div>

      {topOpportunities.length > 0 ? (
        <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          {topOpportunities.map((opp) => {
            const saved = isSaved(opp.id);
            return (
              <div 
                key={opp.id} 
                className="flex flex-col p-4 rounded-[16px] border border-slate-200 bg-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all min-w-[240px] max-w-[260px] shrink-0 relative group"
              >
                {/* Logo and Match Badge */}
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl border border-slate-100 p-1 bg-white shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                    {opp.logo ? (
                      <img src={opp.logo} alt={opp.company} className="w-full h-full object-contain" />
                    ) : (
                      <Building size={18} className="text-slate-400" />
                    )}
                  </div>
                  <button
                    onClick={(e) => { e.preventDefault(); toggleSaved(opp); }}
                    className={`absolute top-4 right-4 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all ${
                      saved ? 'text-indigo-600 bg-indigo-50 opacity-100' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                    }`}
                  >
                    {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                  </button>
                </div>

                {/* Title & Company */}
                <h4 className="text-[14px] font-black text-slate-900 truncate mb-1">
                  {opp.title}
                </h4>
                <p className="text-[12px] font-bold text-slate-500 truncate mb-3">
                  {opp.company}
                </p>

                {/* Match Badge */}
                <div className="mb-3">
                   <OpportunityMatchBadge score={opp.matchData?.score || 0} />
                </div>

                {/* Footer: Location & Type */}
                <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  <span className="flex items-center gap-1 truncate max-w-[60%]">
                    <MapPin size={10} />
                    <span className="truncate">{opp.location || 'Remote'}</span>
                  </span>
                  <span>{opp.type || 'Internship'}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 bg-white rounded-[16px] border border-slate-200 shadow-sm">
           <Info className="text-slate-400 mb-3" size={24} />
           <p className="text-[14px] font-bold text-slate-700">No matches available</p>
        </div>
      )}
    </div>
  );
}
