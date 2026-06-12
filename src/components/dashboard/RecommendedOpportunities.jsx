import { Bookmark, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useApplications } from '../../contexts/ApplicationContext';
import { useSavedOpportunities } from '../../contexts/SavedOpportunitiesContext';
import { useLiveOpportunities } from '../../hooks/useLiveOpportunities';
import OpportunityMatchBadge from '../opportunities/OpportunityMatchBadge';
import { useMatchScore } from '../../hooks/useMatchScore';

function RecommendedItem({ opp, navigate, handleApply, toggleSave, isSaved }) {
  const matchData = useMatchScore(opp);

  return (
    <div 
      onClick={() => navigate(`/opportunity/${opp.id}`)}
      className="group bg-white border border-slate-100 rounded-[16px] p-4 flex gap-4 transition-all duration-300 hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.08)] hover:border-[#6C4CF1]/30 cursor-pointer"
    >
      {/* Logo */}
      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 p-2 shrink-0 flex items-center justify-center overflow-hidden">
        <img 
          src={opp.logo} 
          alt={opp.company} 
          className="w-full h-fit object-contain"
          onError={(e) => { e.target.src = "/placeholder-company-logo.png"; }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-[14px] font-bold text-slate-900 truncate group-hover:text-[#6C4CF1] transition-colors">{opp.title}</h3>
          {matchData && <OpportunityMatchBadge score={matchData.score} size="sm" />}
        </div>
        <p className="text-[12px] font-medium text-slate-500 truncate mb-2">{opp.company}</p>
        
        <div className="flex items-center justify-between mt-auto">
          <p className="text-[11px] font-bold text-slate-400">
            <span className="text-slate-600 font-extrabold text-[#6C4CF1]">Deadline:</span> {opp.deadline}
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => handleApply(e, opp)}
              className="px-3 py-1.5 text-[11px] font-bold text-[#4F46E5] bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
            >
              Apply
            </button>
            <button 
              onClick={(e) => toggleSave(e, opp)}
              className={`p-1.5 rounded-lg transition-colors ${isSaved ? 'text-[#6C4CF1] bg-indigo-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
            >
              <Bookmark size={14} fill={isSaved ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RecommendedOpportunities() {
  const navigate = useNavigate();
  const { applications, addApplication } = useApplications();
  const { toggleSavedOpportunity, isSaved } = useSavedOpportunities();
  const { opportunities: liveOpportunities, isLoading } = useLiveOpportunities();

  const handleApply = (e, opp) => {
    e.stopPropagation();
    const isDuplicate = applications.some(
      (app) => app.title === opp.title && app.company === opp.company
    );

    if (isDuplicate) {
      toast.error('You have already applied to this opportunity.');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineObj = new Date(opp.deadline);
    deadlineObj.setHours(0, 0, 0, 0);

    if (!isNaN(deadlineObj.getTime()) && deadlineObj < today) {
      toast.error('Cannot apply: The deadline has already passed.');
      return;
    }

    const application = {
      company: opp.company,
      title: opp.title,
      role: opp.title,
      type: opp.type,
      status: 'Applied',
      appliedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      deadline: opp.deadline,
      logo: opp.logo,
      location: 'Remote',
      duration: '3 Months',
    };

    addApplication(application);
    toast.success('Redirecting to application...');
    if (opp.applyLink) {
      window.open(opp.applyLink, '_blank');
    }
    navigate('/applications');
  };

  const toggleSave = (e, opp) => {
    e.stopPropagation();
    toggleSavedOpportunity(opp);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[16px] font-bold text-slate-900 tracking-tight">Recommended Opportunities</h2>
        <button className="text-[13px] font-semibold text-[#4F46E5] hover:text-indigo-700 transition-colors">View all</button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-[120px] bg-white rounded-[16px] border border-slate-100 p-4"></div>
            ))}
          </div>
        ) : (
          liveOpportunities.slice(0, 4).map((opp) => (
            <RecommendedItem 
              key={opp.id} 
              opp={opp} 
              navigate={navigate} 
              handleApply={handleApply} 
              toggleSave={toggleSave} 
              isSaved={isSaved(opp.id)} 
            />
          ))
        )}

        <button className="w-full mt-2 py-3 text-[14px] font-bold text-[#4F46E5] hover:text-indigo-700 flex items-center justify-center gap-1.5 transition-colors border-t border-slate-50 pt-5">
          View all opportunities
          <ArrowRight size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
