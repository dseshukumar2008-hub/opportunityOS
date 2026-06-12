import { useState } from 'react';
import { Bookmark, MapPin, Building, ArrowUpRight, Search, Clock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useApplications } from '../../contexts/ApplicationContext';
import { useSavedOpportunities } from '../../contexts/SavedOpportunitiesContext';
import EmptyState from '../../components/ui/EmptyState';

export default function SavedPage() {
  const navigate = useNavigate();
  const { applications, addApplication } = useApplications();
  
  const { savedOpportunities, toggleSavedOpportunity, loading } = useSavedOpportunities();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');

  const displayOpportunities = savedOpportunities.filter(opp => {
    const titleMatch = (opp.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const companyMatch = (opp.company || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearch = titleMatch || companyMatch;
    const matchesFilter = filterType === 'All' || opp.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const toggleSave = (e, opp) => {
    e.stopPropagation();
    toggleSavedOpportunity(opp);
  };

  const handleApply = (e, opp) => {
    e.stopPropagation();
    const isDuplicate = applications.some(
      (app) => app.title === opp.title && app.company === opp.company
    );

    if (isDuplicate) {
      toast.error('You have already applied to this opportunity.');
      return;
    }

    const application = {
      company: opp.company || 'Unknown',
      title: opp.title || 'Opportunity',
      role: opp.title || 'Opportunity',
      type: opp.type || '',
      status: 'Applied',
      appliedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      url: opp.url || '',
    };

    addApplication(application);
    toast.success('Application Added Successfully');
    navigate('/applications');
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-full relative p-4 lg:p-6">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-extrabold text-slate-900 tracking-tight mb-2">Saved Opportunities</h1>
          <p className="text-[14px] text-slate-500 font-medium">Manage your bookmarked internships, hackathons, and scholarships.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder="Search saved..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:border-[#6C4CF1] focus:ring-1 focus:ring-[#6C4CF1] transition-all"
            />
          </div>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] font-medium text-slate-700 focus:outline-none focus:border-[#6C4CF1] focus:ring-1 focus:ring-[#6C4CF1] transition-all cursor-pointer"
          >
            <option value="All">All Types</option>
            <option value="Internship">Internship</option>
            <option value="Hackathon">Hackathon</option>
            <option value="Scholarship">Scholarship</option>
            <option value="Fellowship">Fellowship</option>
            <option value="Job">Job</option>
          </select>
        </div>
      </div>

      <div className="flex-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#6C4CF1] mb-4" />
            <p className="text-[14px] font-medium text-slate-500">Loading saved opportunities...</p>
          </div>
        ) : displayOpportunities.length === 0 ? (
          <EmptyState
            icon={Bookmark}
            title="No Saved Opportunities Yet"
            description="Bookmark opportunities to view them later."
            actionText="Browse Opportunities"
            actionLink="/opportunities"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {displayOpportunities.map((opp) => (
              <div 
                key={opp.opportunityId} 
                onClick={() => navigate(`/opportunity/${opp.opportunityId}`)}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-[#6C4CF1]/30 transition-all duration-300 p-5 flex flex-col group relative cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 p-2.5 shrink-0 flex items-center justify-center overflow-hidden font-bold text-slate-400 text-[20px] uppercase">
                    {/* Fallback avatar generated from company name if no logo exists */}
                    {opp.company?.charAt(0) || opp.title?.charAt(0) || 'O'}
                  </div>
                  <button 
                    onClick={(e) => toggleSave(e, opp)}
                    className="p-2 text-[#6C4CF1] hover:text-slate-400 hover:bg-slate-50 rounded-lg transition-colors"
                    title="Remove Bookmark"
                  >
                    <Bookmark size={20} fill="currentColor" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                   {opp.type && (
                     <span className="px-3 py-1 rounded-full text-[12px] font-bold tracking-wide bg-indigo-50 text-[#6C4CF1]">
                       {opp.type}
                     </span>
                   )}
                   {opp.source && (
                     <span className="px-3 py-1 rounded-full text-[12px] font-bold tracking-wide bg-slate-100 text-slate-600">
                       {opp.source}
                     </span>
                   )}
                </div>

                <div className="mb-3">
                  <h3 className="text-[17px] font-bold text-slate-900 leading-tight mb-1 group-hover:text-[#6C4CF1] transition-colors line-clamp-2">{opp.title}</h3>
                  <p className="text-[14px] font-medium text-slate-500 flex items-center gap-1.5 line-clamp-1">
                    <Building size={14} className="shrink-0" />
                    {opp.company}
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-100">
                  <button 
                    onClick={(e) => { e.stopPropagation(); navigate(`/opportunity/${opp.opportunityId}`); }}
                    className="flex-1 h-10 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-[13px] font-bold transition-all text-center"
                  >
                    Details
                  </button>
                  <button 
                    onClick={(e) => handleApply(e, opp)}
                    className="flex-1 h-10 bg-[#6C4CF1] hover:bg-[#5b3fda] text-white rounded-xl text-[13px] font-bold transition-all shadow-[0_2px_10px_rgba(108,76,241,0.2)] flex items-center justify-center gap-1.5"
                  >
                    Apply Now
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
