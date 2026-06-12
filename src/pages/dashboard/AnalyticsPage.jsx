import { 
  FileText,
  Users,
  Briefcase,
  Bookmark
} from 'lucide-react';
import { useApplications } from '../../contexts/ApplicationContext';
import { useSavedOpportunities } from '../../contexts/SavedOpportunitiesContext';
import MonthlyActivityChart from '../../components/dashboard/MonthlyActivityChart';
import CategoryBreakdownChart from '../../components/dashboard/CategoryBreakdownChart';
import StatusDistributionChart from '../../components/dashboard/StatusDistributionChart';
import PersonalInsights from '../../components/dashboard/PersonalInsights';
import RecentActivityTimeline from '../../components/dashboard/RecentActivityTimeline';
import ApplicationFunnelWidget from '../../components/dashboard/ApplicationFunnelWidget';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';

export default function AnalyticsPage() {
  const { applications } = useApplications();
  const { savedOpportunities } = useSavedOpportunities();

  const totalApplications = (applications || []).length;
  const interviewCount = (applications || []).filter(a => a.status === 'Interview').length;
  const offerCount = (applications || []).filter(a => a.status === 'Offer').length;
  const savedCount = savedOpportunities.length;

  const interviewRate = totalApplications > 0 ? Math.round((interviewCount / totalApplications) * 100) : 0;
  const offerRate = totalApplications > 0 ? Math.round((offerCount / totalApplications) * 100) : 0;



  const overviewCards = [
    {
      id: 1,
      title: 'Total Applications',
      value: totalApplications.toString(),
      subtext: '↗ 12% from last month',
      subtextColor: 'text-emerald-500',
      icon: FileText,
      iconColor: 'text-indigo-500',
      iconBg: 'bg-indigo-50'
    },
    {
      id: 2,
      title: 'Interview Rate',
      value: `${interviewRate}%`,
      subtext: '↗ 8% from last month',
      subtextColor: 'text-emerald-500',
      icon: Users,
      iconColor: 'text-emerald-500',
      iconBg: 'bg-emerald-50'
    },
    {
      id: 3,
      title: 'Offer Rate',
      value: `${offerRate}%`,
      subtext: '↗ 2% from last month',
      subtextColor: 'text-emerald-500',
      icon: Briefcase,
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-50'
    },
    {
      id: 4,
      title: 'Saved Opportunities',
      value: savedCount.toString(),
      subtext: '↗ 20% from last month',
      subtextColor: 'text-emerald-500',
      icon: Bookmark,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-50'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-full relative space-y-8 pb-12 p-4 lg:p-6">
      {/* Page Header */}
      <div className="mb-2">
        <h1 className="page-header mb-1">Analytics &amp; Insights</h1>
        <p className="page-subheader">Track your application performance and career progress.</p>
      </div>

      {/* No-data empty state */}
      {totalApplications === 0 && (
        <EmptyState
          icon={FileText}
          title="No analytics data yet"
          description="Start applying to opportunities to see your application funnel, interview rate, and progress charts here."
          actionText="Browse Opportunities"
          actionLink="/opportunities"
          secondaryText="Track Manually"
          secondaryLink="/applications"
        />
      )}

      {/* Section 1: Overview Cards */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {overviewCards.map((card) => {
            const Icon = card.icon;
            // Split subtext to highlight arrow and percentage vs "from last month"
            // Assuming format "↗ 12% from last month"
            const subtextParts = card.subtext.split(' ');
            const highlightText = subtextParts[0] + ' ' + subtextParts[1];
            const remainingText = subtextParts.slice(2).join(' ');

            return (
              <div 
                key={card.id} 
                className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm hover:-translate-y-[2px] hover:shadow-md transition-all duration-300 flex flex-col h-[130px] justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 ${card.iconBg}`}>
                    <Icon size={20} strokeWidth={2.5} className={card.iconColor} />
                  </div>
                  <span className="text-[14px] font-bold text-slate-700">{card.title}</span>
                </div>
                
                <div className="flex flex-col gap-1 mt-3">
                  <span className="text-[32px] font-extrabold text-slate-900 leading-none tracking-tight">
                    {card.value}
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`text-[12px] font-bold ${card.subtextColor}`}>{highlightText}</span>
                    <span className="text-[12px] font-medium text-slate-400">{remainingText}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3-Column Layout for Main Content */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          <ApplicationFunnelWidget />
          <CategoryBreakdownChart />
        </div>

        {/* Middle Column */}
        <div className="flex flex-col gap-6">
          <MonthlyActivityChart />
          <StatusDistributionChart />
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          <PersonalInsights />
          <RecentActivityTimeline />
        </div>
      </section>
    </div>
  );
}
