import { User, CheckCircle2, Circle, ChevronRight } from 'lucide-react';
import { useDashboardInsights } from '../../hooks/useDashboardInsights';
import { Link } from 'react-router-dom';

export default function ProfileCompletionWidget() {
  const { profileCompletion, isLoading } = useDashboardInsights();

  if (isLoading) {
    return (
      <div className="card-standard p-6 animate-pulse">
        <div className="h-5 w-40 bg-slate-200 rounded mb-4"></div>
        <div className="h-2 w-full bg-slate-100 rounded mb-6"></div>
        <div className="space-y-3">
           <div className="h-8 bg-slate-100 rounded"></div>
           <div className="h-8 bg-slate-100 rounded"></div>
        </div>
      </div>
    );
  }

  const { score, missing } = profileCompletion;
  const isComplete = score === 100;

  return (
    <div className="card-standard p-6 h-full flex flex-col relative overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
          <User size={16} className="text-indigo-600" />
        </div>
        <h3 className="text-[16px] font-bold text-slate-900">Profile Completion</h3>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
          <span className="text-[28px] font-black text-slate-900 leading-none">{score}%</span>
          <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">{isComplete ? 'Complete' : 'Incomplete'}</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${isComplete ? 'bg-emerald-500' : 'bg-indigo-600'}`}
            style={{ width: `${score}%` }}
          ></div>
        </div>
      </div>

      <div className="flex-grow flex flex-col justify-center">
        {isComplete ? (
          <div className="flex flex-col items-center text-center p-4">
            <CheckCircle2 size={32} className="text-emerald-500 mb-2" />
            <p className="text-[13px] font-bold text-slate-700">Your profile is fully optimized!</p>
            <p className="text-[12px] text-slate-500 mt-1">You are ready to get matched with top opportunities.</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Missing Items</p>
            {missing.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
                <div className="flex items-center gap-2">
                  <Circle size={14} className="text-slate-300" />
                  <span className="text-[13px] font-medium text-slate-700 capitalize">{item === 'resume' ? 'Upload Resume' : `Add ${item}`}</span>
                </div>
                <Link to={item === 'resume' ? "/resume-review" : "/profile"} className="text-indigo-600 p-1 hover:bg-indigo-50 rounded">
                  <ChevronRight size={14} />
                </Link>
              </div>
            ))}
            {missing.length > 3 && (
              <p className="text-[11px] text-slate-400 text-center mt-2">+{missing.length - 3} more items</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
