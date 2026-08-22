import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';

import { useOnlineStatus } from '../contexts/OnlineStatusContext';
import StatusDot from '../components/ui/StatusDot';
import UserAvatar from '../components/ui/UserAvatar';
import { useNavigate, useLocation, Outlet} from 'react-router-dom';
import {
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-unused-vars
  LayoutDashboard, Briefcase, FileText, FileEdit, Users,
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-unused-vars
  BarChart3, User, Settings, LogOut, Bell, Search, Menu,
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-unused-vars
  Bookmark, MessageSquare, ChevronDown, Clock,
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-unused-vars
  CheckCircle, Trash2, AlertCircle, CalendarClock, Link2, UserCheck, Globe, Bot, Map, Target, Sparkles, BookOpen, Code, Compass
} from 'lucide-react';

import OpportunityOSCopilot from '../components/copilot/OpportunityOSCopilot';
import { useResume } from '../contexts/ResumeContext';
import { useGoals } from '../contexts/GoalContext';
import FloatingOnboarding from '../components/onboarding/FloatingOnboarding';
import { getUserFullName, getUserFirstName } from '../utils/userUtils';


export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { profile } = useProfile();
  const { myStatus, setOffline } = useOnlineStatus();

  
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

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

    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
    <div className="min-h-screen bg-[#FAFAFA] flex overflow-hidden font-sans">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-indigo-600 focus:font-bold focus:shadow-md focus:rounded-br-lg">
        Skip to main content
      </a>

      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-40
        w-64 bg-[#FDFDFD]
        border-r border-slate-200/60
        transform transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        lg:translate-x-0 lg:static lg:flex-shrink-0
        flex flex-col
        shadow-[4px_0_24px_rgba(0,0,0,0.02)]
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
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

            { name: 'GitHub Analyzer', path: '/github-analyzer', icon: Sparkles },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => { 
                  if (item.path === '/resume-review') {
                    localStorage.removeItem('resumeAnalyzerTab');
                    localStorage.removeItem('resumeAnalyzerShowResults');
                  }
                  navigate(item.path); 
                  setIsSidebarOpen(false); 
                }}
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
            { name: 'Skill Gap Analysis', path: '/skill-gap', icon: Target },
            { name: 'Career Roadmap', path: '/career-roadmap', icon: Map },
            { name: 'Project Recommendations', path: '/project-recommendations', icon: Code },
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


      </aside>


      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
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
          </div>

          <div className="flex items-center gap-5">
            <div className="relative" ref={profileDropdownRef}>
              <div
                className="flex items-center gap-4 pl-6 border-l border-slate-100 cursor-pointer hover:opacity-80 transition-opacity focus-visible:ring-2 focus-visible:ring-[#6C4CF1] focus-visible:outline-none"
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
                  <UserAvatar
                    src={profile?.avatar_url || user?.photoURL}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full border border-slate-200 bg-slate-100"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5">
                    <StatusDot status={myStatus} size="sm" />
                  </span>
                </div>
                <div className="hidden sm:block pr-2">
                  <p className="text-[13px] font-bold text-slate-900 leading-none">{getUserFirstName(user, profile) || getUserFullName(user, profile)}</p>
                  <p className="text-[11px] font-medium text-slate-500 mt-1 leading-none">Student</p>
                </div>
                <ChevronDown size={14} className={`text-slate-400 ml-2 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
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
        <main id="main-content" tabIndex={-1} className="flex-1 overflow-y-auto focus:outline-none">
          <Outlet />
        </main>
        {/* OpportunityOS Copilot (Student) */}
        <OpportunityOSCopilot mode="student" contextData={studentContext} />

        <FloatingOnboarding />
      </div>
    </div>
  );
}
