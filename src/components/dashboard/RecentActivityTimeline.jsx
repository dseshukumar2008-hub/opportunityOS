import { useMemo } from 'react';
import { useApplications } from '../../contexts/ApplicationContext';
import { useSavedOpportunities } from '../../contexts/SavedOpportunitiesContext';
import { 
  Send, 
  Calendar, 
  Award, 
  XCircle, 
  Bookmark, 
  Clock,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RecentActivityTimeline() {
  const { applications } = useApplications();
  const { savedOpportunities } = useSavedOpportunities();

  const activities = useMemo(() => {
    let feed = [];
    // eslint-disable-next-line react-hooks/purity
    const now = Date.now();

    applications.forEach((app) => {
      // Mocking relative times to look like the reference design
      // Applied: 3 days ago, Saved: 2 days ago, Interview: 1 day ago, Offer: 2 hours ago
      // We will assign stable mock offsets based on status for demonstration purposes
      let offset = 3 * 24 * 60 * 60 * 1000; // 3 days
      let timeString = '3 days ago';

      if (app.status === 'Interview') {
        offset = 1 * 24 * 60 * 60 * 1000; // 1 day
        timeString = '1 day ago';
      } else if (app.status === 'Offer') {
        offset = 2 * 60 * 60 * 1000; // 2 hours
        timeString = '2 hours ago';
      } else if (app.status === 'Rejected') {
        offset = 5 * 60 * 60 * 1000; // 5 hours
        timeString = '5 hours ago';
      }

      feed.push({
        id: `apply-${app.id}`,
        type: 'apply',
        text: `Applied to ${app.company} ${app.role}`,
        date: now - (3 * 24 * 60 * 60 * 1000), // always put apply at 3 days ago
        timeString: '3 days ago',
        icon: Send,
        iconColor: 'text-[#6C4CF1]', // using purple for all to match reference style
        bgColor: 'bg-indigo-50'
      });

      if (app.status === 'Interview') {
        feed.push({
          id: `status-${app.id}`,
          type: 'interview',
          text: `Interview scheduled with ${app.company} ${app.role}`,
          date: now - offset,
          timeString,
          icon: Calendar,
          iconColor: 'text-[#6C4CF1]',
          bgColor: 'bg-indigo-50'
        });
      } else if (app.status === 'Offer') {
        feed.push({
          id: `status-${app.id}`,
          type: 'offer',
          text: `Offer received from ${app.company} ${app.role}`,
          date: now - offset,
          timeString,
          icon: Award,
          iconColor: 'text-[#10B981]', // Green for offer
          bgColor: 'bg-emerald-50'
        });
      } else if (app.status === 'Rejected') {
        feed.push({
          id: `status-${app.id}`,
          type: 'rejected',
          text: `Application rejected by ${app.company} ${app.role}`,
          date: now - offset,
          timeString,
          icon: XCircle,
          iconColor: 'text-rose-500',
          bgColor: 'bg-rose-50'
        });
      }
    });

    savedOpportunities.forEach((opp, index) => {
      feed.push({
        id: `saved-${opp.id || index}`,
        type: 'saved',
        text: `Saved ${opp.company ? opp.company + ' ' : ''}${opp.title || opp.role || 'Opportunity'}`,
        date: now - (2 * 24 * 60 * 60 * 1000) - index * 1000, 
        timeString: '2 days ago',
        icon: Bookmark,
        iconColor: 'text-[#3B82F6]',
        bgColor: 'bg-blue-50'
      });
    });

    return feed.sort((a, b) => b.date - a.date).slice(0, 5); // Show top 5
  }, [applications, savedOpportunities]);

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
