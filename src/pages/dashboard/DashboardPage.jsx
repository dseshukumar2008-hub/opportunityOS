import React, { Suspense} from 'react';
import { WidgetErrorBoundary } from '../../components/common/GlobalErrorBoundary';
import { useAuth } from '../../contexts/AuthContext';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useResume } from '../../contexts/ResumeContext';
import { useActivity } from '../../contexts/ActivityContext';

import DashboardHeroWidget from '../../components/dashboard/DashboardHeroWidget';
import DashboardKPIsWidget from '../../components/dashboard/DashboardKPIsWidget';
import DashboardNextActionWidget from '../../components/dashboard/DashboardNextActionWidget';
import RecommendedForYouWidget from '../../components/dashboard/RecommendedForYouWidget';

import { HeroSkeleton, KPISkeleton, AnalyticsWidgetSkeleton } from '../../components/dashboard/skeletons/DashboardSkeletons';

// Lazy loaded non-critical widgets
const RecentActivityTimeline = React.lazy(() => import('../../components/dashboard/RecentActivityTimeline'));
const CareerJourneyWidget = React.lazy(() => import('../../components/dashboard/CareerJourneyWidget'));

export default function DashboardPage() {
// eslint-disable-next-line no-unused-vars
  const { user } = useAuth();
  const { profile, isLoading: profileLoading } = useUserProfile();
  const { resumes, loading: resumeLoading } = useResume();
  const { activities, loading: activityLoading } = useActivity();

  const isLoading = profileLoading || resumeLoading || activityLoading;

  // If loading, show skeletons
  if (isLoading) {
    return (
      <div className="w-full max-w-[1440px] mx-auto p-4 lg:p-8 bg-[#F8FAFC]">
        <div className="flex flex-col gap-6">
          <HeroSkeleton />
          <KPISkeleton />
          <AnalyticsWidgetSkeleton />
        </div>
      </div>
    );
  }

  // Derive meaningful user state
  const hasProfile = profile?.onboardingCompleted || (profile && Object.keys(profile).length > 2 && (profile.firstName || profile.targetRole));
  const hasResume = resumes && resumes.length > 0;
  const hasActivity = activities && activities.length > 0;
  
  const isNewUser = !hasProfile && !hasResume && !hasActivity;

  const userState = {
    hasProfile,
    hasResume,
    hasActivity,
    isNewUser
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto p-4 lg:p-8 bg-[#F8FAFC]">
      <div className="flex flex-col gap-6">

        {/* ── Zone 1: Hero Section ── */}
        <WidgetErrorBoundary>
          <DashboardHeroWidget userState={userState} />
        </WidgetErrorBoundary>

        {/* ── Zone 2: KPI Statistics Row ── */}
        <WidgetErrorBoundary>
          <DashboardKPIsWidget userState={userState} />
        </WidgetErrorBoundary>

        {/* ── Zone 3: Next Best Action ── */}
        <WidgetErrorBoundary>
          <DashboardNextActionWidget userState={userState} />
        </WidgetErrorBoundary>

        {/* ── Zone 4: Career Progress + Recent Activity ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <WidgetErrorBoundary>
              <Suspense fallback={<AnalyticsWidgetSkeleton />}>
                <CareerJourneyWidget userState={userState} />
              </Suspense>
            </WidgetErrorBoundary>
          </div>
          <div className="lg:col-span-1">
            <WidgetErrorBoundary>
              <Suspense fallback={<AnalyticsWidgetSkeleton />}>
                <RecentActivityTimeline userState={userState} />
              </Suspense>
            </WidgetErrorBoundary>
          </div>
        </div>

        {/* ── Zone 5: Recommended for You ── */}
        <WidgetErrorBoundary>
          <RecommendedForYouWidget userState={userState} />
        </WidgetErrorBoundary>

      </div>
    </div>
  );
}
