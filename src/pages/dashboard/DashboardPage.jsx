import React, { Suspense } from 'react';
import { WidgetErrorBoundary } from '../../components/common/GlobalErrorBoundary';
import { useAuth } from '../../contexts/AuthContext';
import { useUserProfile } from '../../hooks/useUserProfile';
import NewUserDashboard from '../../components/dashboard/NewUserDashboard';

import DashboardHeroWidget from '../../components/dashboard/DashboardHeroWidget';
import DashboardKPIsWidget from '../../components/dashboard/DashboardKPIsWidget';
import DashboardQuickActions from '../../components/dashboard/DashboardQuickActions';
import { HeroSkeleton, KPISkeleton, OpportunitySkeleton, AnalyticsWidgetSkeleton } from '../../components/dashboard/skeletons/DashboardSkeletons';

// Lazy loaded non-critical widgets
const AICopilotSection = React.lazy(() => import('../../components/dashboard/AICopilotSection'));
const CareerHealthWidget = React.lazy(() => import('../../components/dashboard/CareerHealthWidget'));
const RecentActivityTimeline = React.lazy(() => import('../../components/dashboard/RecentActivityTimeline'));
const SkillGapWidget = React.lazy(() => import('../../components/dashboard/SkillGapWidget'));
const ResumeInsightsWidget = React.lazy(() => import('../../components/dashboard/ResumeInsightsWidget'));
const CareerJourneyWidget = React.lazy(() => import('../../components/dashboard/CareerJourneyWidget'));
const RecommendedConnectionsWidget = React.lazy(() => import('../../components/network/RecommendedConnectionsWidget'));
const CareerCoachWidget = React.lazy(() => import('../../components/dashboard/CareerCoachWidget'));


export default function DashboardPage() {
  const { user } = useAuth();
  const { profile, isLoading } = useUserProfile();

  // If loading, show skeletons
  if (isLoading) {
    return (
      <div className="w-full max-w-[1600px] mx-auto p-4 lg:p-8 bg-[#F8FAFC]">
        <div className="flex flex-col gap-6">
          <HeroSkeleton />
          <KPISkeleton />
          <AnalyticsWidgetSkeleton />
        </div>
      </div>
    );
  }

  // Determine if onboarding is completed
  const isLocallyCompleted = user ? localStorage.getItem(`onboarding_${user.uid}`) === 'completed' : false;
  const isOnboardingComplete = isLocallyCompleted || profile?.onboardingCompleted;

  if (!isOnboardingComplete) {
    return <NewUserDashboard />;
  }

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
              <RecentActivityTimeline />
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

        {/* ── Zone 8: Discovery & Coach Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <WidgetErrorBoundary>
              <Suspense fallback={<AnalyticsWidgetSkeleton />}>
                <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm">
                  <CareerJourneyWidget />
                </div>
              </Suspense>
            </WidgetErrorBoundary>
            <WidgetErrorBoundary>
              <Suspense fallback={<AnalyticsWidgetSkeleton />}>
                <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
                  <RecommendedConnectionsWidget limit={4} />
                </div>
              </Suspense>
            </WidgetErrorBoundary>
          </div>
          <div className="lg:col-span-1">
            <WidgetErrorBoundary>
              <Suspense fallback={<AnalyticsWidgetSkeleton />}>
                <CareerCoachWidget />
              </Suspense>
            </WidgetErrorBoundary>
          </div>
        </div>

      </div>
    </div>
  );
}
