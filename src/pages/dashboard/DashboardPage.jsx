import { WidgetErrorBoundary } from '../../components/common/GlobalErrorBoundary';

import DashboardHeroWidget from '../../components/dashboard/DashboardHeroWidget';
import DashboardKPIsWidget from '../../components/dashboard/DashboardKPIsWidget';
import OpportunityRecommendationWidget from '../../components/dashboard/OpportunityRecommendationWidget';
import AICopilotSection from '../../components/dashboard/AICopilotSection';
import CareerHealthWidget from '../../components/dashboard/CareerHealthWidget';
import RecentActivityWidget from '../../components/dashboard/RecentActivityWidget';
import TeamActivityWidget from '../../components/dashboard/TeamActivityWidget';
import SkillGapWidget from '../../components/dashboard/SkillGapWidget';
import ApplicationTrackerWidget from '../../components/dashboard/ApplicationTrackerWidget';
import ResumeInsightsWidget from '../../components/dashboard/ResumeInsightsWidget';
import DashboardQuickActions from '../../components/dashboard/DashboardQuickActions';

export default function DashboardPage() {
  return (
    <div className="w-full max-w-[1600px] mx-auto p-4 lg:p-8 bg-[#F8FAFC]">
      <div className="flex flex-col gap-6">

        {/* ── Zone 1: Hero Section ── */}
        <WidgetErrorBoundary>
          <DashboardHeroWidget />
        </WidgetErrorBoundary>

        {/* ── Zone 2: KPI Statistics Row ── */}
        <WidgetErrorBoundary>
          <DashboardKPIsWidget />
        </WidgetErrorBoundary>

        {/* ── Zone 3: Top Opportunity Matches ── */}
        <WidgetErrorBoundary>
          <OpportunityRecommendationWidget />
        </WidgetErrorBoundary>

        {/* ── Zone 4: AI Career Copilot Section ── */}
        <WidgetErrorBoundary>
          <AICopilotSection />
        </WidgetErrorBoundary>

        {/* ── Zone 5: Three-Column Analytics Row ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <WidgetErrorBoundary>
            <CareerHealthWidget />
          </WidgetErrorBoundary>
          <WidgetErrorBoundary>
            <RecentActivityWidget />
          </WidgetErrorBoundary>
          <WidgetErrorBoundary>
            <TeamActivityWidget />
          </WidgetErrorBoundary>
        </div>

        {/* ── Zone 6: Three-Column Insights Row ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <WidgetErrorBoundary>
            <SkillGapWidget />
          </WidgetErrorBoundary>
          <WidgetErrorBoundary>
            <ApplicationTrackerWidget />
          </WidgetErrorBoundary>
          <WidgetErrorBoundary>
            <ResumeInsightsWidget />
          </WidgetErrorBoundary>
        </div>

        {/* ── Zone 7: Quick Actions Row ── */}
        <WidgetErrorBoundary>
          <DashboardQuickActions />
        </WidgetErrorBoundary>

      </div>
    </div>
  );
}
