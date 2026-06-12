import { Trophy, Flame, Star, Users, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AchievementsWidget() {
  const achievements = [
    {
      label: 'Badges',
      value: '14',
      icon: Trophy,
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-100',
    },
    {
      label: 'Streak',
      value: '12',
      suffix: 'days',
      icon: Flame,
      iconColor: 'text-orange-500',
      iconBg: 'bg-orange-100',
    },
    {
      label: 'Reviews',
      value: '8',
      icon: Star,
      iconColor: 'text-red-500',
      iconBg: 'bg-red-100',
    },
    {
      label: 'Connections',
      value: '46',
      icon: Users,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-100',
    }
  ];

  return (
    <div className="card-standard p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[16px] font-bold text-slate-900">Achievements</h3>
        <Link to="/profile" className="text-[12px] font-bold text-[#6D5DF6] hover:text-[#5a4add] transition-colors">
          View all
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {achievements.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex flex-col items-center justify-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${item.iconBg} mb-3`}>
                <Icon size={20} className={item.iconColor} strokeWidth={2.5} />
              </div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">{item.label}</span>
              <div className="flex items-baseline gap-1">
                <span className="text-[20px] font-black text-slate-900 leading-none">{item.value}</span>
                {item.suffix && <span className="text-[11px] font-bold text-slate-400">{item.suffix}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
