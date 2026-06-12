import { motion } from 'framer-motion';
import { Award, CheckCircle2, Circle, ChevronRight, FileText, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDashboardInsights } from '../../hooks/useDashboardInsights';
import { useResumeInsights } from '../../hooks/useResumeInsights';
import { useCareerRoadmap } from '../../hooks/useCareerRoadmap';

function StatPill({ label, value, color }) {
  return (
    <div className="flex-1 bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
      <p className={`text-[20px] font-black leading-none mb-0.5 ${color}`}>{value}</p>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{label}</p>
    </div>
  );
}

export default function CareerHealthWidget() {
  const { careerReadiness, profileCompletion, applicationInsights, isLoading: isDashboardLoading } = useDashboardInsights();
  const { atsScore, hasInsights } = useResumeInsights();
  const { roadmapData, isLoading: isRoadmapLoading } = useCareerRoadmap();
  
  const isLoading = isDashboardLoading || isRoadmapLoading;

  if (isLoading) {
    return (
      <div className="card-standard p-6 h-full animate-pulse flex flex-col gap-4">
        <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto" />
        <div className="h-3 bg-slate-100 rounded w-3/4 mx-auto" />
        <div className="h-3 bg-slate-100 rounded w-1/2 mx-auto" />
        <div className="flex gap-3 mt-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 h-14 bg-slate-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const { score: readiness = 0, breakdown } = careerReadiness ?? {};
  const { score: profilePct = 0, missing = [] } = profileCompletion ?? {};
  const activeApps = applicationInsights?.active ?? 0;

  const getReadinessColor = (s) => {
    if (s >= 80) return '#10B981';
    if (s >= 50) return '#F59E0B';
    return '#EF4444';
  };

  const strokeColor = getReadinessColor(readiness);
  const strokeDasharray = `${readiness} 100`;

  const readinessLabel = readiness >= 80 ? 'Excellent' : readiness >= 50 ? 'Good' : 'Needs Work';

  const checklist = [
    { label: 'Profile', done: breakdown?.profile?.done },
    { label: 'Resume', done: breakdown?.resume?.done },
    { label: 'Skills', done: breakdown?.skills?.done },
    { label: 'Applied', done: breakdown?.applications?.done },
  ];

  return (
    <div className="card-standard p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
          <Award size={14} className="text-indigo-600" />
        </div>
        <h3 className="text-[16px] font-black text-slate-900">Career Health</h3>
        <Link to="/analytics" className="ml-auto text-[12px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5">
          View details <ChevronRight size={14} />
        </Link>
      </div>

      {/* Readiness Ring */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-[88px] h-[88px] shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#F1F5F9"
              strokeWidth="3.5"
            />
            <motion.path
              initial={{ strokeDasharray: '0 100' }}
              animate={{ strokeDasharray }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              stroke={strokeColor}
              strokeDasharray={strokeDasharray}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[22px] font-black text-slate-900 leading-none">{readiness}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">%</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-black text-slate-900 leading-tight">{readinessLabel}</p>
          <p className="text-[11px] text-slate-500 font-medium mb-3">Career Readiness</p>
          {/* Profile bar */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold text-slate-500">Profile</span>
              <span className="text-[10px] font-bold text-slate-700">{profilePct}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${profilePct}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-full rounded-full ${profilePct === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Condensed Milestone Stepper */}
      <div className="mb-4 pt-4 border-t border-slate-100">
        <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Career Milestones</h4>
        {roadmapData?.milestones ? (
          <div className="flex flex-col gap-3 relative">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-slate-100 -z-10"></div>
            {roadmapData.milestones.slice(0, 3).map((milestone, idx) => (
              <div key={idx} className="flex items-start gap-3">
                {idx === 0 ? (
                  <CheckCircle2 size={15} className="text-emerald-500 shrink-0 bg-white" />
                ) : (
                  <Circle size={15} className="text-slate-300 shrink-0 bg-white" />
                )}
                <span className={`text-[12px] font-semibold leading-tight pt-0.5 ${idx === 0 ? 'text-slate-700' : 'text-slate-500'}`}>
                  {milestone}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                <div className="h-3 bg-slate-100 rounded w-full"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stat Pills */}
      <div className="flex gap-2 mt-auto">
        <StatPill
          label="ATS Score"
          value={hasInsights ? `${atsScore ?? '--'}` : '--'}
          color={
            hasInsights && atsScore >= 70
              ? 'text-emerald-600'
              : hasInsights
              ? 'text-amber-500'
              : 'text-slate-400'
          }
        />
        <StatPill label="Active Apps" value={activeApps} color="text-indigo-600" />
      </div>

      {/* Quick Actions */}
      {missing.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Improve your score
          </p>
          <div className="flex flex-col gap-1">
            {missing.slice(0, 2).map((item, idx) => (
              <Link
                key={idx}
                to={item === 'resume' ? '/resume-review' : '/profile'}
                className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  {item === 'resume' ? (
                    <FileText size={12} className="text-slate-400" />
                  ) : (
                    <Briefcase size={12} className="text-slate-400" />
                  )}
                  <span className="text-[11px] font-semibold text-slate-600 capitalize">
                    {item === 'resume' ? 'Upload Resume' : `Add ${item}`}
                  </span>
                </div>
                <ChevronRight size={12} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
