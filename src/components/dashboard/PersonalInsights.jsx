import { useMemo } from 'react';
import { useApplications } from '../../contexts/ApplicationContext';
import { useSavedOpportunities } from '../../contexts/SavedOpportunitiesContext';
import { 
  TrendingUp, 
  Award, 
  Calendar, 
  Bookmark, 
  Target, 
  BarChart2,
  Folder
} from 'lucide-react';

export default function PersonalInsights() {
  const { applications } = useApplications();
  const { savedOpportunities } = useSavedOpportunities();

  const insights = useMemo(() => {
    const appliedCount = (applications || []).length;
    const interviewCount = (applications || []).filter(a => a.status === 'Interview').length;
    const offerCount = (applications || []).filter(a => a.status === 'Offer').length;
    const savedCount = savedOpportunities.length;
    
    const categoryCounts = {};
    let mostAppliedCategory = 'N/A';
    let maxCatCount = 0;

    const monthCounts = {};
    let mostActiveMonth = 'N/A';
    let maxMonthCount = 0;
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    applications.forEach(app => {
      if (app.type) {
        categoryCounts[app.type] = (categoryCounts[app.type] || 0) + 1;
        if (categoryCounts[app.type] > maxCatCount) {
          maxCatCount = categoryCounts[app.type];
          mostAppliedCategory = app.type;
        }
      }

      if (app.appliedDate) {
        const d = new Date(app.appliedDate);
        if (!isNaN(d)) {
          const monthStr = monthNames[d.getMonth()];
          monthCounts[monthStr] = (monthCounts[monthStr] || 0) + 1;
          if (monthCounts[monthStr] > maxMonthCount) {
            maxMonthCount = monthCounts[monthStr];
            mostActiveMonth = monthStr;
          }
        }
      }
    });

    const interviewRate = appliedCount > 0 ? Math.round((interviewCount / appliedCount) * 100) : 0;
    const offerRate = appliedCount > 0 ? Math.round((offerCount / appliedCount) * 100) : 0;
    const totalTracked = appliedCount + savedCount;

    // Pluralize category if possible
    if (mostAppliedCategory !== 'N/A' && !mostAppliedCategory.endsWith('s')) {
      mostAppliedCategory += 's';
    }

    return {
      mostAppliedCategory,
      mostActiveMonth,
      interviewRate,
      offerRate,
      savedCount,
      totalTracked,
      appliedCount,
      interviewCount,
      offerCount,
      hasData: appliedCount > 0 || savedCount > 0
    };
  }, [applications, savedOpportunities]);

  if (!insights.hasData) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center min-h-[320px] w-full h-fit">
        <TrendingUp className="text-[#6C4CF1] mb-3 opacity-40" size={32} />
        <h3 className="text-[16px] font-bold text-slate-800 mb-1">Personal Insights</h3>
        <p className="text-[13px] text-slate-500 font-medium mb-6 text-center">Key insights about your application journey.</p>
        <p className="text-slate-400 text-sm">Not enough data to generate insights yet.</p>
      </div>
    );
  }

  const listItems = [
    {
      icon: Target,
      iconColor: 'text-[#6C4CF1]',
      iconBg: 'bg-indigo-50',
      label: 'Most Applied Category',
      value: insights.mostAppliedCategory,
      subtext: null
    },
    {
      icon: Calendar,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-50',
      label: 'Most Active Month',
      value: insights.mostActiveMonth,
      subtext: null
    },
    {
      icon: BarChart2,
      iconColor: 'text-emerald-500',
      iconBg: 'bg-emerald-50',
      label: 'Interview Conversion',
      value: `${insights.interviewRate}%`,
      subtext: `(${insights.interviewCount} out of ${insights.appliedCount} applications)`
    },
    {
      icon: Award,
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-50',
      label: 'Offer Success Rate',
      value: `${insights.offerRate}%`,
      subtext: `(${insights.offerCount} out of ${insights.appliedCount} applications)`
    },
    {
      icon: Bookmark,
      iconColor: 'text-rose-500',
      iconBg: 'bg-rose-50',
      label: 'Saved Opportunities',
      value: insights.savedCount.toString(),
      subtext: null
    },
    {
      icon: Folder,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
      label: 'Total Opportunities Tracked',
      value: insights.totalTracked.toString(),
      subtext: `(${insights.appliedCount} applied + ${insights.savedCount} saved)`
    }
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col w-full h-full">
      <div className="mb-6">
        <h3 className="text-[16px] font-bold text-slate-800 mb-1">Personal Insights</h3>
        <p className="text-[13px] text-slate-500 font-medium">Key insights about your application journey.</p>
      </div>

      <div className="flex flex-col gap-5 flex-1">
        {listItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex gap-4 items-start group cursor-default">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.iconBg} ${item.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={18} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col justify-center min-h-[40px]">
                <span className="text-[12px] font-bold text-slate-500 leading-tight mb-1">
                  {item.label}
                </span>
                <div className="flex flex-col">
                  <span className="text-[15px] font-extrabold text-slate-900 leading-tight">
                    {item.value}
                  </span>
                  {item.subtext && (
                    <span className="text-[11px] font-medium text-slate-400 mt-0.5">
                      {item.subtext}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
