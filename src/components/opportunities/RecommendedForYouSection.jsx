import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, History, SearchX } from 'lucide-react';
import { useRecommendations } from '../../hooks/useRecommendations';
import { useSavedOpportunities } from '../../contexts/SavedOpportunitiesContext';
import RecommendationCard from './RecommendationCard';
import { toast } from 'react-hot-toast';

export default function RecommendedForYouSection({ limit = 0, layout = 'grid' }) {
  const { recommendations, isLoading } = useRecommendations();
  const { toggleSavedOpportunity, isSaved } = useSavedOpportunities();

  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Internship', 'Job', 'Hackathon', 'Scholarship', 'Competition'];

  const filteredRecommendations = (recommendations || []).filter(opp => {
    if (activeFilter === 'All') return true;
    return opp.type === activeFilter;
  });

  const displayList = limit > 0 ? filteredRecommendations.slice(0, limit) : filteredRecommendations;

  const handleApply = (e, opp) => {
    e.stopPropagation();
    const targetUrl = opp.url || opp.applyLink;
    if (targetUrl && targetUrl !== '#') {
      window.open(targetUrl, '_blank');
    } else {
      toast.error('Application link not available.');
    }
  };

  const handleSave = (opp) => {
    toggleSavedOpportunity(opp);
  };

  return (
    <div className="mb-10 w-full">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-[20px] font-extrabold text-slate-900 flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#6C4CF1]/10 flex items-center justify-center">
              <Sparkles size={16} className="text-[#6C4CF1]" />
            </div>
            Personalized Recommendations
          </h2>
          <p className="text-[14px] text-slate-500 font-medium mt-1">
            Opportunities matched to your skills, goals, and resume.
          </p>
        </div>
        <Link
          to="/recommendations/history"
          className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-xl text-[13px] font-bold transition-colors border border-slate-200 hover:border-indigo-200"
        >
          <History size={16} />
          Track Improvement
        </Link>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide mb-2">
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-xl text-[13px] font-bold whitespace-nowrap transition-all ${
              activeFilter === filter
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Loading skeleton */}
      {isLoading ? (
        <div className={`grid gap-6 ${layout === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="animate-pulse bg-white rounded-2xl p-6 border border-slate-100 h-[220px]">
              <div className="flex gap-4 mb-4">
                <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-3 bg-slate-200 rounded"></div>
                <div className="h-3 bg-slate-200 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : displayList.length === 0 ? (
        /* Empty State — no hardcoded fallback */
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white border border-slate-100 rounded-2xl shadow-sm">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <SearchX size={28} className="text-slate-400" />
          </div>
          <h3 className="text-[16px] font-bold text-slate-800 mb-2">No opportunities currently available.</h3>
          <p className="text-[13px] text-slate-500 font-medium max-w-xs leading-relaxed">
            {activeFilter !== 'All'
              ? `No ${activeFilter} matches found. Try selecting a different filter or updating your profile.`
              : 'Complete your profile and add skills to start getting personalized matches.'}
          </p>
          {activeFilter !== 'All' && (
            <button
              onClick={() => setActiveFilter('All')}
              className="mt-4 text-[13px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Show all types
            </button>
          )}
        </div>
      ) : (
        <div className={`grid gap-6 ${layout === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
          {displayList.map((opp) => (
            <RecommendationCard
              key={opp.id}
              opp={opp}
              isSaved={isSaved(opp.id)}
              onSave={handleSave}
              onApply={handleApply}
            />
          ))}
        </div>
      )}
    </div>
  );
}
