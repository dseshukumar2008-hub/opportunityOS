import { CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import { useMatchScore } from '../../hooks/useMatchScore';

export default function OpportunityMatchDetails({ opportunity }) {
  const matchData = useMatchScore(opportunity);

  if (!matchData) return null;

  const { score, potentialScore, reasons, missing } = matchData;

  let colorGroup;

  if (score >= 90) {
    colorGroup = { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', icon: 'text-emerald-500', bar: 'bg-emerald-500', lightBar: 'bg-emerald-100' };
  } else if (score >= 70) {
    colorGroup = { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', icon: 'text-orange-500', bar: 'bg-orange-500', lightBar: 'bg-orange-100' };
  } else {
    colorGroup = { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: 'text-red-500', bar: 'bg-red-500', lightBar: 'bg-red-100' };
  }

  return (
    <div className={`rounded-2xl border ${colorGroup.border} p-6 shadow-sm`}>
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Score Ring */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className={colorGroup.lightBar} />
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className={colorGroup.bar} strokeDasharray={`${score * 2.83} 283`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-black ${colorGroup.text}`}>{score}%</span>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${colorGroup.text} opacity-70`}>Match</span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Reasons */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              Why it's a match
            </h4>
            <ul className="space-y-2">
              {reasons.length > 0 ? reasons.map((reason, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  <span className="text-sm font-medium text-slate-600">{reason}</span>
                </li>
              )) : (
                <li className="text-sm text-slate-500 italic">Not enough matching data.</li>
              )}
            </ul>
          </div>

          {/* Missing / Feedback */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <AlertCircle size={16} className="text-red-500" />
              What's Missing
            </h4>
            <ul className="space-y-2 mb-4">
              {missing.length > 0 ? missing.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span className="text-sm font-medium text-slate-600">{item}</span>
                </li>
              )) : (
                <li className="text-sm text-slate-500 italic">You meet all primary criteria!</li>
              )}
            </ul>

            {missing.length > 0 && (
              <div  className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg">
                <TrendingUp size={14} className="text-indigo-600" />
                <span className="text-xs font-bold text-indigo-800">Potential Score: {potentialScore}%</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
