import React, { Suspense } from 'react';
import { WidgetErrorBoundary } from '../../components/common/GlobalErrorBoundary';
import { useAuth } from '../../contexts/AuthContext';

import DashboardHeroWidget from '../../components/dashboard/DashboardHeroWidget';
import DashboardKPIsWidget from '../../components/dashboard/DashboardKPIsWidget';
import DashboardQuickActions from '../../components/dashboard/DashboardQuickActions';
import { HeroSkeleton, KPISkeleton, OpportunitySkeleton, AnalyticsWidgetSkeleton } from '../../components/dashboard/skeletons/DashboardSkeletons';

// Lazy loaded non-critical widgets
const AICopilotSection = React.lazy(() => import('../../components/dashboard/AICopilotSection'));
const CareerHealthWidget = React.lazy(() => import('../../components/dashboard/CareerHealthWidget'));
const RecentActivityWidget = React.lazy(() => import('../../components/dashboard/RecentActivityWidget'));
const SkillGapWidget = React.lazy(() => import('../../components/dashboard/SkillGapWidget'));
const ResumeInsightsWidget = React.lazy(() => import('../../components/dashboard/ResumeInsightsWidget'));

export default function DashboardPage() {
  const { user } = useAuth();

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


        {/* ── Zone 4: AI Career Copilot Section ── */}
        <WidgetErrorBoundary>
          <Suspense fallback={<div />}>
            <AICopilotSection />
          </Suspense>
        </WidgetErrorBoundary>

        {/* ── Zone 5: Two-Column Analytics Row ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <WidgetErrorBoundary>
            <Suspense fallback={<AnalyticsWidgetSkeleton />}>
              <CareerHealthWidget />
            </Suspense>
          </WidgetErrorBoundary>
          <WidgetErrorBoundary>
            <Suspense fallback={<AnalyticsWidgetSkeleton />}>
              <RecentActivityWidget />
            </Suspense>
          </WidgetErrorBoundary>
        </div>

        {/* ── Zone 6: Two-Column Insights Row ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <WidgetErrorBoundary>
            <Suspense fallback={<AnalyticsWidgetSkeleton />}>
              <SkillGapWidget />
            </Suspense>
          </WidgetErrorBoundary>
          <WidgetErrorBoundary>
            <Suspense fallback={<AnalyticsWidgetSkeleton />}>
              <ResumeInsightsWidget />
            </Suspense>
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
