import { FileText, Users, Briefcase, Bookmark } from 'lucide-react';
import { useApplications } from '../../contexts/ApplicationContext';
import { useSavedOpportunities } from '../../contexts/SavedOpportunitiesContext';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

export default function DashboardWidgets() {
  const { applications } = useApplications();
  const { savedOpportunities } = useSavedOpportunities();
  const savedCount = savedOpportunities.length;

  const generateData = () => Array.from({ length: 15 }, () => ({ value: Math.random() * 100 }));

  const widgetData = [
    {
      id: 1,
      title: 'Applications',
      value: (applications || []).length.toString(),
      label: 'This month',
      trend: '↑ 25%',
      icon: FileText,
      iconColor: 'text-[#6D5DF6]',
      iconBg: 'bg-[#6D5DF6]/10',
      chartColor: '#6D5DF6',
      data: generateData()
    },
    {
      id: 2,
      title: 'Interviews',
      value: (applications || []).filter(a => a.status === 'Interview').length.toString(),
      label: 'This month',
      trend: '↑ 20%',
      icon: Users,
      iconColor: 'text-[#00D084]',
      iconBg: 'bg-[#00D084]/10',
      chartColor: '#00D084',
      data: generateData()
    },
    {
      id: 3,
      title: 'Offers',
      value: (applications || []).filter(a => a.status === 'Offer').length.toString(),
      label: 'This month',
      trend: '↑ 100%',
      icon: Briefcase,
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-100',
      chartColor: '#F59E0B',
      data: generateData()
    },
    {
      id: 4,
      title: 'Saved',
      value: savedCount.toString(),
      label: 'Total saved',
      trend: '↑ 12%',
      icon: Bookmark,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-100',
      chartColor: '#3B82F6',
      data: generateData()
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
      {widgetData.map((widget) => {
        const Icon = widget.icon;
        return (
          <div 
            key={widget.id} 
            className="group card-standard p-5 flex flex-col h-[130px] justify-between relative overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${widget.iconBg}`}>
                  <Icon size={18} strokeWidth={2.5} className={widget.iconColor} />
                </div>
                <span className="text-[14px] font-extrabold text-slate-800">{widget.title}</span>
              </div>
            </div>
            
            <div className="flex items-end justify-between mt-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[32px] font-black text-slate-900 leading-none tracking-tight">
                    {widget.value}
                  </span>
                  <span className={`text-[12px] font-bold flex items-center gap-0.5 ${widget.trend.includes('↑') ? 'text-emerald-500' : 'text-red-500'}`}>
                    {widget.trend}
                  </span>
                </div>
                <span className="text-[12px] font-semibold text-slate-500 leading-none">{widget.label}</span>
              </div>

              {/* Sparkline */}
              <div className="w-[80px] h-[35px] -mb-1 -mr-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={widget.data}>
                    <Line type="monotone" dataKey="value" stroke={widget.chartColor} strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
