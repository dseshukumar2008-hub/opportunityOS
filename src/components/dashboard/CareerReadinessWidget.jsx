import { Award, CheckCircle2, Circle } from 'lucide-react';
import { useDashboardInsights } from '../../hooks/useDashboardInsights';

export default function CareerReadinessWidget() {
  const { careerReadiness, isLoading } = useDashboardInsights();

  if (isLoading) {
    return (
      <div className="card-standard p-6 h-full flex flex-col justify-center items-center">
        <div className="animate-pulse w-full">
          <div className="h-6 bg-slate-200 rounded w-1/2 mb-4 mx-auto"></div>
          <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-6"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-4 bg-slate-200 rounded w-full"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const { score, breakdown } = careerReadiness;

  const getStrokeColor = (score) => {
    if (score >= 80) return '#10B981'; // emerald-500
    if (score >= 50) return '#F59E0B'; // amber-500
    return '#EF4444'; // red-500
  };

  const strokeColor = getStrokeColor(score);
  const strokeDasharray = `${score} 100`;

  return (
    <div className="card-standard p-6 h-full flex flex-col relative overflow-hidden group">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
          <Award size={16} className="text-indigo-600" />
        </div>
        <h3 className="text-[16px] font-bold text-slate-900">Career Readiness</h3>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center">
        {/* Circular Progress Ring */}
        <div className="relative w-32 h-32 mb-6 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            {/* Background Circle */}
            <path
              className="text-slate-100"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
            />
            {/* Progress Circle */}
            <path
              stroke={strokeColor}
              strokeDasharray={strokeDasharray}
              className="transition-all duration-1000 ease-out"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-[32px] font-black text-slate-900 leading-none tracking-tight">
              {score}<span className="text-[18px] text-slate-400">%</span>
            </span>
          </div>
        </div>

        {/* Breakdown Checklist */}
        <div className="w-full space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Profile Completion</span>
            {breakdown?.profile?.done ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Circle size={16} className="text-slate-300" />}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Resume Upload</span>
            {breakdown?.resume?.done ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Circle size={16} className="text-slate-300" />}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Core Skills Added</span>
            {breakdown?.skills?.done ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Circle size={16} className="text-slate-300" />}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Applications Submitted</span>
            {breakdown?.applications?.done ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Circle size={16} className="text-slate-300" />}
          </div>
        </div>
      </div>
    </div>
  );
}

