import { useMemo } from 'react';
import { useActivity } from '../../contexts/ActivityContext';
import { 
// eslint-disable-next-line no-unused-vars
  Send, 
// eslint-disable-next-line no-unused-vars
  Calendar, 
// eslint-disable-next-line no-unused-vars
  Award, 
// eslint-disable-next-line no-unused-vars
  XCircle, 
// eslint-disable-next-line no-unused-vars
  Bookmark, 
// eslint-disable-next-line no-unused-vars
  Clock,
  ArrowRight,
  Activity,
  FileText,
  GitBranch,
  Map
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RecentActivityTimeline({ userState }) {
  const { activities: rawActivities } = useActivity();
  const { isNewUser } = userState || {};

  const activities = useMemo(() => {
    let feed = [];

    const getRelativeTime = (timestamp) => {
      const diffInSeconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
      if (diffInSeconds < 60) return 'Just now';
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
      return new Date(timestamp).toLocaleDateString();
    };

    const iconMap = {
      FileText: FileText,
      GitBranch: GitBranch,
      Map: Map,
      Activity: Activity
    };

    rawActivities.forEach((act) => {
      const IconComp = iconMap[act.iconType] || Activity;
      
      feed.push({
        id: act.id,
        type: act.type,
        text: act.title || act.description || act.action || 'Performed an action',
        date: new Date(act.timestamp).getTime(),
        timeString: getRelativeTime(act.timestamp),
        icon: IconComp,
        iconColor: act.color ? act.color.split(' ')[1] : 'text-[#6C4CF1]',
        bgColor: act.color ? act.color.split(' ')[0] : 'bg-indigo-50'
      });
    });

    return feed.sort((a, b) => b.date - a.date).slice(0, 5); 
  }, [rawActivities]);

  if (activities.length === 0) {
    return (
      <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center min-h-[320px] h-fit w-full text-center">
        <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
          <Activity className="text-[#6C4CF1] opacity-60" size={32} />
        </div>
        <h3 className="text-[16px] font-bold text-slate-800 mb-2">Your activity will appear here</h3>
        <p className="text-[13px] text-slate-500 font-medium mb-6 max-w-[240px]">
          Complete your first profile action to start tracking your progress.
        </p>
        {isNewUser && (
          <Link to="/profile" className="px-5 py-2.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-[13px] font-bold transition-colors">
            Complete Profile
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full w-full">
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
                <div key={activity.id} className="relative flex items-start sm:items-center gap-4 group">
                  <div className="relative z-10 shrink-0 pt-0.5 sm:pt-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-[3px] border-white ${activity.bgColor} ${activity.iconColor} shadow-sm group-hover:scale-110 transition-transform`}>
                      <Icon size={16} strokeWidth={2.5} />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center flex-1 min-w-0 gap-1 sm:gap-4">
                    <div className="flex flex-col flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-slate-800 leading-tight line-clamp-2">
                        {activity.text}
                      </p>
                    </div>
                    <div className="shrink-0">
                      <span className="text-[11px] font-medium text-slate-400">
                        {activity.timeString}
                      </span>
                    </div>
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
