import React, { useState, useEffect, Suspense } from 'react';
import { WidgetErrorBoundary } from '../../components/common/GlobalErrorBoundary';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

import DashboardHeroWidget from '../../components/dashboard/DashboardHeroWidget';
import DashboardKPIsWidget from '../../components/dashboard/DashboardKPIsWidget';
import DashboardQuickActions from '../../components/dashboard/DashboardQuickActions';
import { HeroSkeleton, KPISkeleton, OpportunitySkeleton, AnalyticsWidgetSkeleton } from '../../components/dashboard/skeletons/DashboardSkeletons';

// Lazy loaded non-critical widgets
const OpportunityRecommendationWidget = React.lazy(() => import('../../components/dashboard/OpportunityRecommendationWidget'));
const AICopilotSection = React.lazy(() => import('../../components/dashboard/AICopilotSection'));
const CareerHealthWidget = React.lazy(() => import('../../components/dashboard/CareerHealthWidget'));
const RecentActivityWidget = React.lazy(() => import('../../components/dashboard/RecentActivityWidget'));
const TeamActivityWidget = React.lazy(() => import('../../components/dashboard/TeamActivityWidget'));
const SkillGapWidget = React.lazy(() => import('../../components/dashboard/SkillGapWidget'));
const ApplicationTrackerWidget = React.lazy(() => import('../../components/dashboard/ApplicationTrackerWidget'));
const ResumeInsightsWidget = React.lazy(() => import('../../components/dashboard/ResumeInsightsWidget'));

export default function DashboardPage() {
  const { user } = useAuth();
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (!user) return;

    let isMounted = true;
    console.time("Dashboard Load");

    const fetchAllData = async () => {
      try {
        const uid = user.id || user.uid;
        
        console.time("Roadmap Fetch");
        const roadmapPromise = getDoc(doc(db, 'career_roadmaps', uid));
        
        console.time("Opportunities Fetch");
        const oppsPromise = getDocs(query(collection(db, 'opportunities'), where('status', '==', 'active')));
        
        const profilePromise = getDoc(doc(db, 'users', uid));
        const applicationsPromise = getDocs(query(collection(db, 'applications'), where('userId', '==', uid)));
        const statsPromise = getDoc(doc(db, 'dashboard_stats', uid));
        const recommendationsPromise = getDocs(query(collection(db, 'recommendations'), where('userId', '==', uid)));

        await Promise.all([
          roadmapPromise,
          oppsPromise,
          profilePromise,
          applicationsPromise,
          statsPromise,
          recommendationsPromise
        ]);

        console.timeEnd("Roadmap Fetch");
        console.timeEnd("Opportunities Fetch");
        
        if (isMounted) setIsDataLoaded(true);
      } catch (err) {
        console.error("Error during parallel data fetch:", err);
        if (isMounted) setIsDataLoaded(true); // Always reveal dashboard to let individual widgets handle errors
      } finally {
        console.timeEnd("Dashboard Load");
      }
    };

    fetchAllData();

    return () => { isMounted = false; };
  }, [user]);
  return (
    <div className="w-full max-w-[1600px] mx-auto p-4 lg:p-8 bg-[#F8FAFC]">
      <div className="flex flex-col gap-6">

        {/* ── Zone 1: Hero Section ── */}
        <WidgetErrorBoundary>
          {!isDataLoaded ? <HeroSkeleton /> : <DashboardHeroWidget />}
        </WidgetErrorBoundary>

        {/* ── Zone 2: KPI Statistics Row ── */}
        <WidgetErrorBoundary>
          {!isDataLoaded ? <KPISkeleton /> : <DashboardKPIsWidget />}
        </WidgetErrorBoundary>

        {/* ── Zone 3: Top Opportunity Matches ── */}
        <WidgetErrorBoundary>
          <Suspense fallback={<OpportunitySkeleton />}>
            {!isDataLoaded ? <OpportunitySkeleton /> : <OpportunityRecommendationWidget />}
          </Suspense>
        </WidgetErrorBoundary>

        {/* ── Zone 4: AI Career Copilot Section ── */}
        <WidgetErrorBoundary>
          <Suspense fallback={<div />}>
            {isDataLoaded && <AICopilotSection />}
          </Suspense>
        </WidgetErrorBoundary>

        {/* ── Zone 5: Three-Column Analytics Row ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <WidgetErrorBoundary>
            <Suspense fallback={<AnalyticsWidgetSkeleton />}>
              {!isDataLoaded ? <AnalyticsWidgetSkeleton /> : <CareerHealthWidget />}
            </Suspense>
          </WidgetErrorBoundary>
          <WidgetErrorBoundary>
            <Suspense fallback={<AnalyticsWidgetSkeleton />}>
              {!isDataLoaded ? <AnalyticsWidgetSkeleton /> : <RecentActivityWidget />}
            </Suspense>
          </WidgetErrorBoundary>
          <WidgetErrorBoundary>
            <Suspense fallback={<AnalyticsWidgetSkeleton />}>
              {!isDataLoaded ? <AnalyticsWidgetSkeleton /> : <TeamActivityWidget />}
            </Suspense>
          </WidgetErrorBoundary>
        </div>

        {/* ── Zone 6: Three-Column Insights Row ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <WidgetErrorBoundary>
            <Suspense fallback={<AnalyticsWidgetSkeleton />}>
              {!isDataLoaded ? <AnalyticsWidgetSkeleton /> : <SkillGapWidget />}
            </Suspense>
          </WidgetErrorBoundary>
          <WidgetErrorBoundary>
            <Suspense fallback={<AnalyticsWidgetSkeleton />}>
              {!isDataLoaded ? <AnalyticsWidgetSkeleton /> : <ApplicationTrackerWidget />}
            </Suspense>
          </WidgetErrorBoundary>
          <WidgetErrorBoundary>
            <Suspense fallback={<AnalyticsWidgetSkeleton />}>
              {!isDataLoaded ? <AnalyticsWidgetSkeleton /> : <ResumeInsightsWidget />}
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
