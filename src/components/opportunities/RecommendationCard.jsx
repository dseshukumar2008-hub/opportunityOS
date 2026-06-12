import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Bookmark, CheckCircle2, AlertCircle } from 'lucide-react';
import OpportunityMatchBadge from './OpportunityMatchBadge';

export default function RecommendationCard({ opp, isSaved, onSave, onApply }) {
  const navigate = useNavigate();
  const matchData = opp.matchData;
  const matchScore = matchData?.score || 0;
  
  const reasons = matchData?.reasons || [];
  const matchedSkillsCount = matchData?.matchedSkillsCount || 0;
  const totalSkillsCount = matchData?.totalSkillsCount || 0;

  return (
    <div className="bg-white rounded-[20px] border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-[#6C4CF1]/30 transition-all duration-300 p-6 flex flex-col relative h-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4 items-start">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 p-2.5 shrink-0 flex items-center justify-center overflow-hidden shadow-sm">
            <img 
              src={opp.logo} 
              alt={opp.company} 
              className="w-full h-full object-contain"
              onError={(e) => { e.target.src = "/placeholder-company-logo.png"; }}
            />
          </div>
          <div>
            <h3 className="text-[16px] font-bold text-slate-900 leading-snug mb-1 line-clamp-2">{opp.title}</h3>
            <p className="text-[14px] font-medium text-slate-500">{opp.company}</p>
          </div>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onSave(opp); }}
          className={`p-2 rounded-xl transition-colors shrink-0
            ${isSaved ? 'text-[#6C4CF1] bg-indigo-50' : 'text-slate-400 hover:text-[#6C4CF1] hover:bg-slate-50'}`
          }
        >
          <Bookmark size={20} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Meta */}
      <div className="flex flex-col gap-2 mb-5 pb-5 border-b border-slate-50">
        <div className="flex items-center gap-3">
          <OpportunityMatchBadge score={matchScore} />
          {totalSkillsCount > 0 && (
            <span className="text-[12px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
              {matchedSkillsCount}/{totalSkillsCount} Skills Match
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-4 text-[13px] font-medium text-slate-500 mt-2">
          <div className="flex items-center gap-1.5">
            <MapPin size={14} className="text-slate-400" />
            <span className="line-clamp-1">{opp.location || 'Location Not Specified'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-indigo-500 font-bold px-2 py-0.5 bg-indigo-50 rounded text-[11px] uppercase tracking-wider">{opp.source || 'JSearch'}</span>
          </div>
        </div>
      </div> 

      {/* Why Recommended */}
      <div className="mb-6 flex-1 relative group">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Why Recommended?</h4>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              const text = reasons.length > 0 
                ? reasons.map(r => `- ${r}`).join('\n') 
                : 'General recommendation based on your profile category.';
              navigator.clipboard.writeText(`Opportunity: ${opp.title} at ${opp.company}\nWhy Recommended:\n${text}`);
              import('react-hot-toast').then(m => m.toast.success('Copied recommendation details ✓'));
            }}
            className="p-1 text-slate-400 hover:text-indigo-600 bg-white hover:bg-indigo-50 border border-transparent hover:border-slate-200 rounded-md opacity-0 group-hover:opacity-100 transition-all focus-visible:opacity-100"
            title="Copy Recommendation"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          </button>
        </div>
        <ul className="space-y-2.5">
          {reasons.slice(0, 3).map((reason, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-[13px] font-semibold text-slate-700 leading-tight">{reason}</span>
            </li>
          ))}
          {reasons.length === 0 && (
            <li className="flex items-start gap-2 text-slate-500">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span className="text-[13px] font-medium leading-tight">General recommendation based on your profile category.</span>
            </li>
          )}
        </ul>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-auto">
        <button 
          onClick={() => navigate(`/opportunity/${opp.id}`)}
          className="flex-1 py-2.5 px-3 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-[13px] font-bold transition-all text-center shadow-sm"
        >
          View Details
        </button>
        <button 
          onClick={(e) => onApply(e, opp)}
          className="flex-1 py-2.5 px-3 bg-[#6C4CF1] hover:bg-[#5b3fda] text-white rounded-xl text-[13px] font-bold transition-all shadow-[0_2px_10px_rgba(108,76,241,0.2)] text-center"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
}
