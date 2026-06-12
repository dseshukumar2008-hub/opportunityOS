import { ArrowUp, Calendar, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function YourActivityWidget() {
  const activities = [
    {
      id: 1,
      title: 'AI Resume Review',
      description: 'Improved score by 18%',
      time: '2h ago',
      icon: <ArrowUp size={16} className="text-emerald-500" />,
      iconBg: 'bg-emerald-50'
    },
    {
      id: 2,
      title: 'Applied to',
      description: 'Google SWE Intern',
      time: '5h ago',
      image: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg'
    },
    {
      id: 3,
      title: 'Interview Scheduled',
      description: 'Microsoft Explore',
      time: '1d ago',
      icon: <Calendar size={16} className="text-[#6D5DF6]" />,
      iconBg: 'bg-[#6D5DF6]/10'
    },
    {
      id: 4,
      title: 'New Connection',
      description: 'Rahul Sharma',
      time: '2d ago',
      image: 'https://api.dicebear.com/7.x/notionists/svg?seed=Rahul&backgroundColor=e2e8f0',
      trend: <ArrowUp size={12} className="text-emerald-500" />
    }
  ];

  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[16px] font-bold text-slate-900">Recent Activity</h3>
        <Link to="/profile" className="text-[12px] font-bold text-[#6D5DF6] hover:text-[#5a4add] transition-colors">
          View all
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {activities.map((act) => (
          <div key={act.id} className="card-standard p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden ${act.iconBg || 'border border-slate-100 bg-white p-1.5'}`}>
              {act.image ? (
                <img src={act.image} alt={act.title} className="w-full h-full object-contain" />
              ) : (
                act.icon
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[12px] font-bold text-slate-900 truncate leading-tight mb-0.5">{act.title}</span>
              <span className="text-[11px] font-semibold text-slate-500 truncate leading-tight flex items-center gap-1">
                {act.description}
              </span>
              <div className="flex items-center gap-1 mt-1">
                {act.trend && act.trend}
                <span className="text-[10px] font-bold text-slate-400">{act.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
