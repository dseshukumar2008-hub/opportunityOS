import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Toaster, ToastBar, toast } from 'react-hot-toast';
import { X } from 'lucide-react';
import { AuthProvider } from './contexts/AuthContext';
import { ApplicationProvider } from './contexts/ApplicationContext';
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
import ApplicationsSkeleton from './components/loaders/ApplicationsSkeleton';
import ResumeBuilderSkeleton from './components/loaders/ResumeBuilderSkeleton';
import PresentationSkeleton from './components/loaders/PresentationSkeleton';


const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
const DemoPage = lazy(() => import('./pages/demo/DemoPage'));
const PresentationPage = lazy(() => import('./pages/presentation/PresentationPage'));
const ProfilePage = lazy(() => import('./pages/dashboard/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/dashboard/SettingsPage'));
const OpportunitiesPage = lazy(() => import('./pages/dashboard/OpportunitiesPage'));
const SavedPage = lazy(() => import('./pages/dashboard/SavedPage'));
const ApplicationsPage = lazy(() => import('./pages/dashboard/ApplicationsPage'));
const AnalyticsPage = lazy(() => import('./pages/dashboard/AnalyticsPage'));
import { SavedOpportunitiesProvider } from './contexts/SavedOpportunitiesContext';
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




const ResumeBuilderPage = lazy(() => import('./pages/dashboard/ResumeBuilderPage'));
const ResumeReviewPage = lazy(() => import('./pages/dashboard/ResumeReviewPage'));
const TeamFinderPage = lazy(() => import('./pages/dashboard/TeamFinderPage'));
const TeamDetailsPage = lazy(() => import('./pages/dashboard/TeamDetailsPage'));
const TeamManagementPage = lazy(() => import('./pages/dashboard/TeamManagementPage'));
const OpportunityDetailsPage = lazy(() => import('./pages/dashboard/OpportunityDetailsPage'));
const NotificationsPage = lazy(() => import('./pages/dashboard/NotificationsPage'));
const MessagesPage = lazy(() => import('./pages/dashboard/MessagesPage'));
const AdminDashboardPage = lazy(() => import('./pages/dashboard/AdminDashboardPage'));
const UserProfilePage = lazy(() => import('./pages/dashboard/UserProfilePage'));
const DeadlinesPage = lazy(() => import('./pages/dashboard/DeadlinesPage'));
const RecommendationHistoryPage = lazy(() => import('./pages/dashboard/RecommendationHistoryPage'));
const CareerRoadmapPage = lazy(() => import('./pages/dashboard/CareerRoadmapPage'));
const GoalsPage = lazy(() => import('./pages/dashboard/GoalsPage'));
const ConnectionsPage = lazy(() => import('./pages/dashboard/ConnectionsPage'));
const ConnectionRequestsPage = lazy(() => import('./pages/dashboard/ConnectionRequestsPage'));
const NetworkDirectoryPage = lazy(() => import('./pages/dashboard/NetworkDirectoryPage'));
const CareerCoachPage = lazy(() => import('./pages/dashboard/CareerCoachPage'));
const SkillGapAnalysisPage = lazy(() => import('./pages/dashboard/SkillGapAnalysisPage'));
const MatchEnginePage = lazy(() => import('./pages/dashboard/MatchEnginePage'));
const ProjectRecommendationPage = lazy(() => import('./features/projectRecommendations/ProjectRecommendationPage'));
import { EmployerProvider } from './contexts/EmployerContext';
import EmployerProtectedRoute from './components/routing/EmployerProtectedRoute';
import EmployerLayout from './components/layout/EmployerLayout';

const EmployerDashboard = lazy(() => import('./pages/employer/EmployerDashboard'));
const EmployerOpportunities = lazy(() => import('./pages/employer/EmployerOpportunities'));
const EmployerApplicants = lazy(() => import('./pages/employer/EmployerApplicants'));
const CompanyProfile = lazy(() => import('./pages/employer/CompanyProfile'));

export default function App() {
  return (
    <GlobalErrorBoundary>
      <AuthProvider>
        <EmployerProvider>
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

              {/* Employer Protected Routes */}
              <Route path="/employer" element={
                <EmployerProtectedRoute>
                  <EmployerLayout />
                </EmployerProtectedRoute>
              }>
                <Route index element={<Suspense fallback={<PageLoader />}><EmployerDashboard /></Suspense>} />
                <Route path="dashboard" element={<Suspense fallback={<PageLoader />}><EmployerDashboard /></Suspense>} />
                <Route path="opportunities" element={<Suspense fallback={<PageLoader />}><EmployerOpportunities /></Suspense>} />
                <Route path="applicants" element={<Suspense fallback={<PageLoader />}><EmployerApplicants /></Suspense>} />
                <Route path="company-profile" element={<Suspense fallback={<PageLoader />}><CompanyProfile /></Suspense>} />
              </Route>

              {/* Student Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={
                  <ActivityProvider>
                    <NotificationProvider>
                      <ApplicationProvider>
                        <SavedOpportunitiesProvider>
                          <ResumeProvider>
                            <TeamProvider>
                              <MessageProvider>
                                <OnlineStatusProvider>
                                  <ProfileProvider>
                                    <ConnectionProvider>
                                      <GoalProvider>
                                        <AchievementProvider>
                                          <DashboardLayout />
                                        </AchievementProvider>
                                      </GoalProvider>
                                    </ConnectionProvider>
                                  </ProfileProvider>
                                </OnlineStatusProvider>
                              </MessageProvider>
                            </TeamProvider>
                          </ResumeProvider>
                        </SavedOpportunitiesProvider>
                      </ApplicationProvider>
                    </NotificationProvider>
                  </ActivityProvider>
                }>
                  <Route element={<RouteErrorBoundary><Suspense fallback={<PageLoader />}><Outlet /></Suspense></RouteErrorBoundary>}>
                    <Route path="/dashboard" element={<Suspense fallback={<DashboardSkeleton />}><DashboardPage /></Suspense>} />
                    <Route path="/admin" element={<Suspense fallback={<PageLoader />}><AdminDashboardPage /></Suspense>} />
                    <Route path="/applications" element={<Suspense fallback={<ApplicationsSkeleton />}><ApplicationsPage /></Suspense>} />
                    <Route path="/analytics" element={<Suspense fallback={<AnalyticsSkeleton />}><AnalyticsPage /></Suspense>} />
                    <Route path="/opportunities" element={<Suspense fallback={<OpportunitiesSkeleton />}><OpportunitiesPage /></Suspense>} />
                    <Route path="/opportunity/:id" element={<OpportunityDetailsPage />} />
                    <Route path="/recommendations/history" element={<RecommendationHistoryPage />} />
                    <Route path="/career-roadmap" element={<CareerRoadmapPage />} />
                    <Route path="/skill-gap" element={<Suspense fallback={<PageLoader />}><SkillGapAnalysisPage /></Suspense>} />
                    <Route path="/match-engine" element={<Suspense fallback={<PageLoader />}><MatchEnginePage /></Suspense>} />
                    <Route path="/project-recommendations" element={<Suspense fallback={<PageLoader />}><ProjectRecommendationPage /></Suspense>} />
                    <Route path="/goals" element={<GoalsPage />} />
                    <Route path="/saved" element={<SavedPage />} />
                    <Route path="/resume-builder" element={<Suspense fallback={<ResumeBuilderSkeleton />}><ResumeBuilderPage /></Suspense>} />
                    <Route path="/resume-review" element={<Suspense fallback={<ResumeReviewSkeleton />}><ResumeReviewPage /></Suspense>} />
                    <Route path="/team-finder" element={<Suspense fallback={<TeamFinderSkeleton />}><TeamFinderPage /></Suspense>} />
                    <Route path="/team/:teamId" element={<TeamDetailsPage />} />
                    <Route path="/team/:teamId/manage" element={<TeamManagementPage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                    <Route path="/messages" element={<Suspense fallback={<MessagesSkeleton />}><MessagesPage /></Suspense>} />
                    <Route path="/deadlines" element={<DeadlinesPage />} />
                    <Route path="/network" element={<Suspense fallback={<NetworkingSkeleton />}><NetworkDirectoryPage /></Suspense>} />
                    <Route path="/network/connections" element={<ConnectionsPage />} />
                    <Route path="/network/requests" element={<ConnectionRequestsPage />} />
                    <Route path="/user/:userId" element={<UserProfilePage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/career-coach" element={<Suspense fallback={<PageLoader />}><CareerCoachPage /></Suspense>} />
                  </Route>
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </EmployerProvider>
      </AuthProvider>
    </GlobalErrorBoundary>
  );
}
