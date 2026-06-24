import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useDeadlineReminders } from '../hooks/useDeadlineReminders';
import { useOnlineStatus } from '../contexts/OnlineStatusContext';
import StatusDot from '../components/ui/StatusDot';
import GlobalSearchModal from '../components/navigation/GlobalSearchModal';
import { useNavigate, useLocation, Outlet, Link } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, FileText, FileEdit, Users,
  BarChart3, User, Settings, LogOut, Bell, Search, Menu,
  Bookmark, MessageSquare, ChevronDown, Home, Clock,
  CheckCircle, Trash2, AlertCircle, CalendarClock, Link2, UserCheck, Globe, Bot, Map, Target, Sparkles, BookOpen, Code, Compass
} from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import OpportunityOSCopilot from '../components/copilot/OpportunityOSCopilot';
import { useResume } from '../contexts/ResumeContext';
import { useGoals } from '../contexts/GoalContext';
import OnboardingModal from '../components/onboarding/OnboardingModal';
import LocationMigrationModal from '../components/onboarding/LocationMigrationModal';
import { getUserFullName, getUserFirstName } from '../utils/userUtils';

const formatTime = (isoString) => {
  const date = new Date(isoString);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
};

const getCategoryIcon = (category) => {
  switch (category) {
    case 'Applications': return <Briefcase size={16} className="text-blue-500" />;
    case 'Teams': return <Users size={16} className="text-emerald-500" />;
    case 'Opportunities': return <CalendarClock size={16} className="text-[#6C4CF1]" />;
    case 'System': return <AlertCircle size={16} className="text-amber-500" />;
    default: return <Bell size={16} className="text-slate-400" />;
  }
};

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { profile } = useProfile();
  const { notifications, getUnreadCount, markAsRead, deleteNotification } = useNotifications();
  const { myStatus, setOffline } = useOnlineStatus();
  const unreadCount = getUnreadCount();
  useDeadlineReminders();
  
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);

  const { resumeData, getResumeStrength } = useResume();
  const { goals } = useGoals();

  const studentContext = {
    user: {
      name: getUserFullName(user, profile),
      email: user?.email
    },
    profile,
    resume: resumeData,
    atsScore: getResumeStrength ? getResumeStrength() : 0,
    skillGapResults: [], // Mocking missing function
    goals
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target)) {
        setIsNotificationDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogout = async () => {
    setOffline();
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    navigate('/');
  };



  return (
    <div className="h-screen bg-[#F8FAFC] font-sans flex overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside 
        role="navigation"
        aria-label="Main Navigation"
        className={`
        fixed lg:sticky top-0 left-0 z-50
        w-64 bg-white border-r border-slate-200 
        flex flex-col h-screen transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="relative flex items-center justify-center w-7 h-7">
              <div className="absolute inset-0 border-[3px] border-indigo-600 rounded-full opacity-50"></div>
              <div className="absolute inset-1 border-[3px] border-indigo-600 rounded-full opacity-80"></div>
              <div className="absolute inset-2 bg-[#6C4CF1] rounded-full"></div>
            </div>
            <span className="font-bold tracking-tight text-slate-900">OpportunityOS</span>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-0.5 scrollbar-hide">

          {/* Main */}
          {[
            { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <button
                key={item.name}
                onClick={() => { navigate(item.path); setIsSidebarOpen(false); }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-[12px] text-[14px] font-semibold transition-colors w-full ${
                  isActive ? 'bg-[#6D5DF6]/10 text-[#6D5DF6]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-[#6D5DF6]' : 'text-slate-400'} />
                <span className="flex-1 text-left">{item.name}</span>
              </button>
            );
          })}

          {/* Career Development Section */}
          <div className="mt-3 mb-1 px-4">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Career Development</p>
          </div>
          {[
            { name: 'Resume Builder', path: '/resume-builder', icon: FileEdit },
            { name: 'Resume Analyzer', path: '/resume-review', icon: Bot },
            { name: 'LinkedIn Analyzer', path: '/linkedin-analyzer', icon: Sparkles },
            { name: 'GitHub Analyzer', path: '/github-analyzer', icon: Sparkles },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => { navigate(item.path); setIsSidebarOpen(false); }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-[12px] text-[14px] font-semibold transition-colors w-full ${
                  isActive ? 'bg-[#6D5DF6]/10 text-[#6D5DF6]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-[#6D5DF6]' : 'text-slate-400'} />
                <span className="flex-1 text-left">{item.name}</span>
              </button>
            );
          })}

          {/* Growth & Planning Section */}
          <div className="mt-3 mb-1 px-4">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Growth & Planning</p>
          </div>
          {[
            { name: 'Career Explorer', path: '/career-explorer', icon: Target },
            { name: 'Hidden Potential', path: '/hidden-potential', icon: Compass },
            { name: 'Skill Gap Analysis', path: '/skill-gap', icon: Target },
            { name: 'Career Roadmap', path: '/career-roadmap', icon: Map },
            { name: 'Project Recommendations', path: '/project-recommendations', icon: Code },
            { name: 'Interview Prep', path: '/interview-prep', icon: Sparkles },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => { navigate(item.path); setIsSidebarOpen(false); }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-[12px] text-[14px] font-semibold transition-colors w-full ${
                  isActive ? 'bg-[#6D5DF6]/10 text-[#6D5DF6]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-[#6D5DF6]' : 'text-slate-400'} />
                <span className="flex-1 text-left">{item.name}</span>
              </button>
            );
          })}

          {/* AI Guidance Section */}
          <div className="mt-3 mb-1 px-4">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">AI Guidance</p>
          </div>
          {[
            { name: 'Career Coach', path: '/career-coach', icon: Bot },
            { name: 'Analytics',  path: '/analytics',  icon: BarChart3 },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => { navigate(item.path); setIsSidebarOpen(false); }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-[12px] text-[14px] font-semibold transition-colors w-full ${
                  isActive ? 'bg-[#6D5DF6]/10 text-[#6D5DF6]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-[#6D5DF6]' : 'text-slate-400'} />
                <span className="flex-1 text-left">{item.name}</span>
              </button>
            );
          })}

        </div>

        {/* Sidebar Footer / Profile */}
        <div className="p-4 border-t border-slate-100 flex flex-col gap-4">
          
          {/* Profile Card */}
          <div 
            className="flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors rounded-[12px] p-2 -mx-2"
            onClick={() => { navigate('/user/me'); setIsSidebarOpen(false); }}
          >
            <div className="flex items-center gap-3">
              <img src={profile?.avatar_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${getUserFullName(user, profile)}&backgroundColor=e2e8f0`} alt="Avatar" className="w-10 h-10 rounded-full bg-slate-200 object-cover" />
              <div>
                <p className="text-[13px] font-extrabold text-slate-900 leading-none">{getUserFullName(user, profile)}</p>
                <p className="text-[11px] font-semibold text-slate-500 mt-1.5 leading-none">{profile?.headline || 'Student'}</p>
              </div>
            </div>
            <ChevronDown size={14} className="text-slate-400" />
          </div>

          {/* Upgrade to Pro Card */}
          <div className="bg-[#F3F0FF] border border-[#6D5DF6]/10 rounded-[16px] p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#6D5DF6]/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
            <h4 className="text-[13px] font-extrabold text-[#6D5DF6] flex items-center gap-1.5 mb-1.5">
              Upgrade to Pro <Sparkles size={12} className="text-[#6D5DF6]" />
            </h4>
            <p className="text-[11px] font-semibold text-slate-600 leading-snug mb-3 max-w-[90%]">
              Get AI-powered insights, unlimited reviews & more.
            </p>
            <button className="w-full bg-[#6D5DF6] hover:bg-[#5a4add] text-white text-[12px] font-bold py-2 rounded-[10px] transition-colors shadow-sm">
              Upgrade Now
            </button>
          </div>

        </div>
      </aside>


      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-[70px] bg-white border-b border-slate-100 flex items-center justify-between px-6 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open mobile menu"
              className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg focus-visible:ring-2 focus-visible:ring-[#6C4CF1] focus-visible:outline-none"
            >
              <Menu size={20} />
            </button>

            {/* Search Bar */}
            <div className="relative hidden md:block">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <button
                onClick={() => setIsSearchOpen(true)}
                className="pl-10 pr-12 py-2 w-[340px] bg-[#F8FAFC] border border-transparent rounded-[10px] text-[13px] font-medium text-slate-400 text-left hover:bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
              >
                Search jobs, companies, or people...
              </button>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                <kbd className="hidden sm:inline-block border border-slate-200 bg-white rounded-[4px] px-1.5 text-[10px] font-bold text-slate-400 shadow-[0_2px_0_0_rgba(226,232,240,1)]">
                  Ctrl K
                </kbd>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button 
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open search"
              className="md:hidden text-slate-400 hover:text-slate-600 transition-colors focus-visible:ring-2 focus-visible:ring-[#6C4CF1] focus-visible:outline-none rounded-lg p-1"
            >
              <Search size={20} />
            </button>
            <div className="relative" ref={notificationDropdownRef}>
              <button 
                onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
                aria-label="Notifications"
                aria-expanded={isNotificationDropdownOpen}
                aria-haspopup="true"
                className="relative text-slate-400 hover:text-slate-600 transition-colors focus-visible:ring-2 focus-visible:ring-[#6C4CF1] focus-visible:outline-none rounded-lg p-1"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1 w-4 h-4 bg-[#4F46E5] text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white leading-none">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {isNotificationDropdownOpen && (
                <div className="absolute right-0 top-full mt-4 w-[340px] sm:w-[380px] bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-100 py-3 z-50">
                  <div className="flex items-center justify-between px-5 mb-2 pb-3 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900">Notifications</h3>
                    <span className="bg-indigo-50 text-[#6C4CF1] text-[11px] font-bold px-2 py-0.5 rounded-full">
                      {unreadCount} New
                    </span>
                  </div>

                  <div className="flex flex-col max-h-[360px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-8">
                        <EmptyState
                          icon={Bell}
                          title="No notifications yet"
                          description="You're all caught up! Check back later."
                        />
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((notification) => (
                        <div 
                          key={notification.id} 
                          onClick={() => {
                            if (!notification.read) markAsRead(notification.id);
                            if (notification.targetUrl) {
                              navigate(notification.targetUrl);
                              setIsNotificationDropdownOpen(false);
                            }
                          }}
                          className={`group relative flex gap-3 px-5 py-3 transition-colors cursor-pointer ${!notification.read ? 'bg-indigo-50/30 hover:bg-indigo-50/50' : 'hover:bg-slate-50'}`}
                        >
                          {!notification.read && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-[#6C4CF1] rounded-r-full" />
                          )}
                          <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center shrink-0 mt-0.5 relative shadow-sm">
                            {getCategoryIcon(notification.type)}
                            {!notification.read && (
                              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#6C4CF1] border-2 border-white rounded-full"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0 pr-12">
                            <h4 className={`text-[13px] leading-tight mb-1 truncate ${!notification.read ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                              {notification.title}
                            </h4>
                            <p className="text-[12px] text-slate-500 truncate mb-1">
                              {notification.message}
                            </p>
                            <span className="text-[11px] font-medium text-slate-400">
                              {formatTime(notification.createdAt)}
                            </span>
                          </div>
                          
                          {/* Actions */}
                          <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm p-1 rounded-lg border border-slate-100 shadow-sm">
                            {!notification.read && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }}
                                className="w-7 h-7 rounded-md text-[#6C4CF1] hover:bg-indigo-50 flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-[#6C4CF1] focus-visible:outline-none"
                                title="Mark as Read"
                                aria-label="Mark notification as read"
                              >
                                <CheckCircle size={14} />
                              </button>
                            )}
                            <button 
                                onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}
                                className="w-7 h-7 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
                                title="Delete"
                                aria-label="Delete notification"
                              >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div className="px-5 pt-3 mt-1 border-t border-slate-100">
                      <Link 
                        to="/notifications"
                        onClick={() => setIsNotificationDropdownOpen(false)}
                        className="block w-full py-2 text-center text-[13px] font-bold text-[#6C4CF1] hover:text-indigo-700 hover:bg-indigo-50 rounded-xl transition-colors"
                      >
                        View All Notifications
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="relative" ref={profileDropdownRef}>
              <div
                className="flex items-center gap-3 pl-5 border-l border-slate-100 cursor-pointer hover:opacity-80 transition-opacity focus-visible:ring-2 focus-visible:ring-[#6C4CF1] focus-visible:outline-none"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                tabIndex={0}
                role="button"
                aria-expanded={isProfileDropdownOpen}
                aria-haspopup="true"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsProfileDropdownOpen(!isProfileDropdownOpen);
                  }
                }}
              >
                <div className="relative">
                  <img
                    src={profile?.avatar_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${getUserFullName(user, profile)}&backgroundColor=e2e8f0`}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full border border-slate-200 bg-slate-100"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5">
                    <StatusDot status={myStatus} size="sm" />
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-[13px] font-bold text-slate-900 leading-none">{getUserFirstName(user, profile) || getUserFullName(user, profile)}</p>
                  <p className="text-[11px] font-medium text-slate-500 mt-1 leading-none">Student</p>
                </div>
                <ChevronDown size={14} className={`text-slate-400 ml-1 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-2">
                    <button
                      onClick={() => { setIsProfileDropdownOpen(false); navigate('/profile'); }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-[13px] font-semibold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <User size={16} />
                      My Profile
                    </button>
                    <button
                      onClick={() => { setIsProfileDropdownOpen(false); navigate('/settings'); }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-[13px] font-semibold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Settings size={16} />
                      Settings
                    </button>
                    <button
                      onClick={() => { setIsProfileDropdownOpen(false); navigate('/'); }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-[13px] font-semibold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Home size={16} />
                      Home
                    </button>
                  </div>
                  <div className="border-t border-slate-100 p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-[13px] font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
        {/* Global Search Modal */}
        <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        
        {/* OpportunityOS Copilot (Student) */}
        <OpportunityOSCopilot mode="student" contextData={studentContext} />

        {/* First Time User Onboarding */}
        <OnboardingModal />
        
        {/* Existing User Location Migration */}
        <LocationMigrationModal />
      </main>
    </div>
  );
}
