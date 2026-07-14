import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Toaster, ToastBar, toast } from 'react-hot-toast';
import { X } from 'lucide-react';
import { AuthProvider } from './contexts/AuthContext';
import LandingPage from './LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import DashboardLayout from './layouts/DashboardLayout';
import PageLoader from './components/ui/PageLoader';
import { GlobalErrorBoundary, RouteErrorBoundary } from './components/common/GlobalErrorBoundary';
import NetworkStatusManager from './components/common/NetworkStatusManager';

import DashboardSkeleton from './components/loaders/DashboardSkeleton';
import OpportunitiesSkeleton from './components/loaders/OpportunitiesSkeleton';
import ResumeReviewSkeleton from './components/loaders/ResumeReviewSkeleton';
import TeamFinderSkeleton from './components/loaders/TeamFinderSkeleton';
import NetworkingSkeleton from './components/loaders/NetworkingSkeleton';
import MessagesSkeleton from './components/loaders/MessagesSkeleton';
import AnalyticsSkeleton from './components/loaders/AnalyticsSkeleton';

import ResumeBuilderSkeleton from './components/loaders/ResumeBuilderSkeleton';
import PresentationSkeleton from './components/loaders/PresentationSkeleton';

const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
const DemoPage = lazy(() => import('./pages/demo/DemoPage'));
const PresentationPage = lazy(() => import('./pages/presentation/PresentationPage'));
const ProfilePage = lazy(() => import('./pages/dashboard/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/dashboard/SettingsPage'));
const AnalyticsPage = lazy(() => import('./pages/dashboard/AnalyticsPage'));
import { ResumeProvider } from './contexts/ResumeContext';
import { TeamProvider } from './contexts/TeamContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { MessageProvider } from './contexts/MessageContext';
import { ActivityProvider } from './contexts/ActivityContext';
import { GoalProvider } from './contexts/GoalContext';
import { AchievementProvider } from './contexts/AchievementContext';
import ProtectedRoute from './components/routing/ProtectedRoute';
import { OnlineStatusProvider } from './contexts/OnlineStatusContext';
import { ConnectionProvider } from './contexts/ConnectionContext';
import { ProfileProvider } from './contexts/ProfileContext';
import { CareerProvider } from './contexts/CareerContext';

const ResumeDashboardPage = lazy(() => import('./pages/dashboard/ResumeDashboardPage'));
const ResumeBuilderPage = lazy(() => import('./pages/dashboard/ResumeBuilderPage'));
const ResumeReviewPage = lazy(() => import('./pages/dashboard/ResumeReviewPage'));
const NotificationsPage = lazy(() => import('./pages/dashboard/NotificationsPage'));
const AdminDashboardPage = lazy(() => import('./pages/dashboard/AdminDashboardPage'));
const UserProfilePage = lazy(() => import('./pages/dashboard/UserProfilePage'));

const RecommendationHistoryPage = lazy(() => import('./pages/dashboard/RecommendationHistoryPage'));
const CareerRoadmapPage = lazy(() => import('./pages/dashboard/CareerRoadmapPage'));
const GoalsPage = lazy(() => import('./pages/dashboard/GoalsPage'));
const CareerCoachPage = lazy(() => import('./pages/dashboard/CareerCoachPage'));
const SkillGapAnalysisPage = lazy(() => import('./pages/dashboard/SkillGapAnalysisPage'));
const MatchEnginePage = lazy(() => import('./pages/dashboard/MatchEnginePage'));
const ProjectRecommendationPage = lazy(() => import('./features/projectRecommendations/ProjectRecommendationPage'));
const InterviewPrepPage = lazy(() => import('./features/interviewPrep/InterviewPrepPage'));
const LinkedInAnalyzerPage = lazy(() => import('./features/linkedinAnalyzer/LinkedInAnalyzerPage'));
const GithubAnalyzerPage = lazy(() => import('./features/githubAnalyzer/GithubAnalyzerPage'));
const CareerExplorerPage = lazy(() => import('./features/careerExplorer/CareerExplorerPage'));
const HiddenPotentialPage = lazy(() => import('./pages/career/HiddenPotentialPage'));

export default function App() {
  return (
    <GlobalErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <NetworkStatusManager />
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#1e293b',
                borderRadius: '12px',
                boxShadow: '0 4px 20px -4px rgba(0,0,0,0.1)',
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: '600',
                border: '1px solid #f1f5f9',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          >
            {(t) => (
              <ToastBar toast={t}>
                {({ icon, message }) => (
                  <div className="flex items-center gap-2 pr-1">
                    {icon}
                    <div className="flex-1">{message}</div>
                    {t.type !== 'loading' && (
                      <button
                        onClick={() => toast.dismiss(t.id)}
                        className="ml-3 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
                      >
                        <X size={14} strokeWidth={2.5} />
                      </button>
                    )}
                  </div>
                )}
              </ToastBar>
            )}
          </Toaster>

          <Routes>
            {/* Public Route */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/demo" element={<Suspense fallback={<PageLoader />}><DemoPage /></Suspense>} />
            <Route path="/presentation" element={<Suspense fallback={<PresentationSkeleton />}><PresentationPage /></Suspense>} />

            {/* Guest Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />



            {/* Student Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={
                <ActivityProvider>
                  <NotificationProvider>
                    <TeamProvider>
                      <MessageProvider>
                        <ConnectionProvider>
                          <ResumeProvider>
                            <OnlineStatusProvider>
                              <ProfileProvider>
                                <GoalProvider>
                                  <AchievementProvider>
                                    <CareerProvider>
                                      <DashboardLayout />
                                    </CareerProvider>
                                  </AchievementProvider>
                                </GoalProvider>
                              </ProfileProvider>
                            </OnlineStatusProvider>
                          </ResumeProvider>
                        </ConnectionProvider>
                      </MessageProvider>
                    </TeamProvider>
                  </NotificationProvider>
                </ActivityProvider>
              }>
                <Route element={<RouteErrorBoundary><Suspense fallback={<PageLoader />}><Outlet /></Suspense></RouteErrorBoundary>}>
                  <Route path="/dashboard" element={<Suspense fallback={<DashboardSkeleton />}><DashboardPage /></Suspense>} />
                  <Route path="/admin" element={<Suspense fallback={<PageLoader />}><AdminDashboardPage /></Suspense>} />
                  <Route path="/analytics" element={<Suspense fallback={<AnalyticsSkeleton />}><AnalyticsPage /></Suspense>} />
                  <Route path="/recommendations/history" element={<RecommendationHistoryPage />} />
                  <Route path="/career-roadmap" element={<CareerRoadmapPage />} />
                  <Route path="/career-explorer" element={<Suspense fallback={<PageLoader />}><CareerExplorerPage /></Suspense>} />
                  <Route path="/hidden-potential" element={<Suspense fallback={<PageLoader />}><HiddenPotentialPage /></Suspense>} />
                  <Route path="/skill-gap" element={<Suspense fallback={<PageLoader />}><SkillGapAnalysisPage /></Suspense>} />
                  <Route path="/match-engine" element={<Suspense fallback={<PageLoader />}><MatchEnginePage /></Suspense>} />
                  <Route path="/project-recommendations" element={<Suspense fallback={<PageLoader />}><ProjectRecommendationPage /></Suspense>} />
                  <Route path="/interview-prep" element={<Suspense fallback={<PageLoader />}><InterviewPrepPage /></Suspense>} />
                  <Route path="/linkedin-analyzer" element={<Suspense fallback={<PageLoader />}><LinkedInAnalyzerPage /></Suspense>} />
                  <Route path="/github-analyzer" element={<Suspense fallback={<PageLoader />}><GithubAnalyzerPage /></Suspense>} />
                  <Route path="/goals" element={<GoalsPage />} />
                  <Route path="/resume-builder" element={<Suspense fallback={<PageLoader />}><ResumeDashboardPage /></Suspense>} />
                  <Route path="/resume-builder/:id" element={<Suspense fallback={<ResumeBuilderSkeleton />}><ResumeBuilderPage /></Suspense>} />
                  <Route path="/resume-review" element={<Suspense fallback={<ResumeReviewSkeleton />}><ResumeReviewPage /></Suspense>} />
                  <Route path="/notifications" element={<NotificationsPage />} />

                  <Route path="/user/:userId" element={<UserProfilePage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/career-coach" element={<Suspense fallback={<PageLoader />}><CareerCoachPage /></Suspense>} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </GlobalErrorBoundary>
  );
}
