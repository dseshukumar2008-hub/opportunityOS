import { Briefcase, ChevronRight, Clock, AlertCircle } from 'lucide-react';
import { useApplications } from '../../contexts/ApplicationContext';
import { Link } from 'react-router-dom';


function getDeadlineInfo(deadline) {
  if (!deadline) return null;
  const d = new Date(deadline);
  if (isNaN(d.getTime())) return null;
  
  const isOverdue = d < new Date();
  const diffTime = d - new Date();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (isOverdue) return { text: 'Overdue', color: 'text-red-600 bg-red-50 border-red-100', urgent: true };
  if (diffDays <= 3) return { text: `Due in ${diffDays} day${diffDays > 1 ? 's' : ''}`, color: 'text-red-600 bg-red-50 border-red-100', urgent: true };
  if (diffDays <= 7) return { text: `Due in ${diffDays} days`, color: 'text-amber-600 bg-amber-50 border-amber-100', urgent: false };
  return { text: `Due in ${diffDays} days`, color: 'text-slate-500 bg-slate-50 border-slate-100', urgent: false };
}

export default function ApplicationTrackerWidget() {
  const { applications, loading } = useApplications();

  if (loading) {
    return (
      <div className="card-standard p-5 h-full animate-pulse flex flex-col gap-4">
        <div className="h-4 w-32 bg-slate-200 rounded mb-2"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 bg-slate-100 rounded-xl" />
        ))}
      </div>
    );
  }

  const activeApps = applications
    .filter(a => ['Applied', 'In Review', 'Assessment', 'Interview'].includes(a.status))
    .sort((a, b) => {
      // Sort by deadline urgency
      if (a.deadline && !b.deadline) return -1;
      if (!a.deadline && b.deadline) return 1;
      if (a.deadline && b.deadline) {
        return new Date(a.deadline) - new Date(b.deadline);
      }
      return new Date(b.timestamp) - new Date(a.timestamp);
    })
    .slice(0, 4);

  return (
    <div className="card-standard p-5 h-full flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
          <Briefcase size={14} className="text-indigo-600" />
        </div>
        <h3 className="text-[16px] font-black text-slate-900">Active Applications</h3>
        <Link to="/opportunities" className="ml-auto text-[12px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5">
          View all <ChevronRight size={14} />
        </Link>
      </div>

      {activeApps.length > 0 ? (
        <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto pr-1">
          {activeApps.map(app => {
            const deadlineInfo = getDeadlineInfo(app.deadline);
            
            return (
              <div key={app.id} className="p-3 rounded-xl border border-slate-100 bg-white hover:border-indigo-100 hover:shadow-sm transition-all group flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold text-slate-900 leading-tight truncate">{app.role}</p>
                  <p className="text-[11px] font-medium text-slate-500 mb-2 truncate">{app.company}</p>
                  <div className="flex item/s-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-slate-100 bg-slate-50 text-slate-600">
                      {app.status}
                    </span>
                    {deadlineInfo && (
                      <span className={`flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded border ${deadlineInfo.color} uppercase tracking-wider`}>
                        {deadlineInfo.urgent ? <AlertCircle size={10} /> : <Clock size={10} />}
                        {deadlineInfo.text}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center items-center text-center p-4 bg-slate-50 rounded-xl border border-slate-100">
          <Clock className="text-slate-300 mb-2" size={24} />
          <p className="text-[12px] font-bold text-slate-600">No active applications</p>
          <p className="text-[11px] text-slate-400 mt-0.5">You're all caught up!</p>
        </div>
      )}
    </div>
  );
}
