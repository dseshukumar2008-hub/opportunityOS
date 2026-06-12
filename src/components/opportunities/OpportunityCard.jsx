import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Bookmark } from 'lucide-react';
import OpportunityMatchBadge from './OpportunityMatchBadge';
import { useMatchScore } from '../../hooks/useMatchScore';

const badgeColors = {
  purple: 'bg-purple-50 text-purple-600',
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  red: 'bg-red-50 text-red-600',
  orange: 'bg-orange-50 text-orange-600',
};

export default function OpportunityCard({ opp, isSaved, onSave, onApply }) {
  const navigate = useNavigate();
  const matchData = useMatchScore(opp);

  return (
    <div className="card-standard card-hover p-6 flex flex-col relative h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 p-2 shrink-0 flex items-center justify-center overflow-hidden">
          <img 
            src={opp.logo} 
            alt={opp.company} 
            className="w-full h-full object-contain"
            onError={(e) => { e.target.src = "/placeholder-company-logo.png"; }}
          />
        </div>
        <div className="flex items-center gap-2">
          {matchData && <OpportunityMatchBadge score={matchData.score} size="sm" />}
          <button 
            onClick={(e) => { e.stopPropagation(); onSave(opp); }}
            className={`p-2 rounded-lg transition-colors
              ${isSaved ? 'text-[#6C4CF1]' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`
            }
          >
            <Bookmark size={20} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="card-title leading-snug mb-1 line-clamp-2 min-h-[44px]">{opp.title}</h3>
        <p className="text-[14px] font-medium text-slate-500">{opp.company}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {(opp.tags || []).map((tag, idx) => (
          <span 
            key={idx} 
            className={`px-3 py-1 rounded-full text-[12px] font-bold tracking-wide ${badgeColors[tag.color] || badgeColors.blue}`}
          >
            {tag.label}
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center gap-4 text-[13px] font-medium text-slate-500">
          <div className="flex items-center gap-1.5">
            <MapPin size={14} className="text-slate-400" />
            <span>{opp.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-slate-400" />
            <span>{opp.duration || opp.type || 'Not Specified'}</span>
          </div>
        </div>
        <p className="text-[13px] font-bold text-red-600">{opp.deadline || 'Apply ASAP'}</p>
      </div>

      <p className="text-[13px] text-slate-600 line-clamp-2 leading-relaxed mb-6 flex-1">
        {opp.shortDescription || (opp.description ? (opp.description.length > 150 ? opp.description.substring(0, 150) + '...' : opp.description) : 'No description available.')}
      </p>

      <div className="flex items-center gap-3 mt-auto">
        <button 
          onClick={() => navigate(`/opportunity/${opp.id}`)}
          className="btn-secondary flex-1 px-3 text-[13px] text-center"
        >
          View Details
        </button>
        <button 
          onClick={(e) => onApply(e, opp)}
          className="btn-primary flex-1 px-3 text-[13px] text-center"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
}
