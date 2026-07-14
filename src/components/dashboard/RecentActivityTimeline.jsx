import { useMemo } from 'react';
import { useActivity } from '../../contexts/ActivityContext';
import { 
  Send, 
  Calendar, 
  Award, 
  XCircle, 
  Bookmark, 
  Clock,
  ArrowRight,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RecentActivityTimeline() {
  const { activities: rawActivities } = useActivity();

  const activities = useMemo(() => {
    let feed = [];
    const now = Date.now();

    rawActivities.forEach((act) => {
      feed.push({
        id: act.id,
        type: act.type,
        text: act.description || act.action || 'Performed an action',
        date: new Date(act.timestamp).getTime(),
        timeString: new Date(act.timestamp).toLocaleDateString(),
        icon: Activity,
        iconColor: 'text-[#6C4CF1]',
        bgColor: 'bg-indigo-50'
      });
    });

    return feed.sort((a, b) => b.date - a.date).slice(0, 5); 
  }, [rawActivities]);

  if (activities.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center min-h-[320px] h-fit w-full">
        <Clock className="text-[#6C4CF1] mb-3 opacity-40" size={32} />
        <h3 className="text-[16px] font-bold text-slate-800 mb-1">Recent Activity</h3>
        <p className="text-[13px] text-slate-500 font-medium mb-6 text-center">Your latest actions and updates.</p>
        <p className="text-slate-400 text-sm">No recent activity available</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full w-full">
      <div className="mb-6 shrink-0">
        <h3 className="text-[16px] font-bold text-slate-800 mb-1">Recent Activity</h3>
        <p className="text-[13px] text-slate-500 font-medium">Your latest actions and updates.</p>
      </div>
      
      <div className="flex-1 relative flex flex-col justify-between">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-indigo-50 rounded-full z-0"></div>
          
          <div className="flex flex-col gap-6 relative z-10">
            {activities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="relative flex gap-4 group items-center">
                  <div className="relative z-10 shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-[3px] border-white ${activity.bgColor} ${activity.iconColor} shadow-sm group-hover:scale-110 transition-transform`}>
                      <Icon size={16} strokeWidth={2.5} />
                    </div>
                  </div>
                  <div className="flex flex-col flex-1">
                    <p className="text-[13px] font-bold text-slate-800 leading-tight pr-16 truncate">
                      {activity.text}
                    </p>
                  </div>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2">
                    <span className="text-[11px] font-medium text-slate-400">
                      {activity.timeString}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Link to="/analytics" className="text-[13px] font-bold text-[#6C4CF1] hover:text-indigo-700 flex items-center gap-1 group transition-colors">
            View all activity 
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </div>
  );
}
