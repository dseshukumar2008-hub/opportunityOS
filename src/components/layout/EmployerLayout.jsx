import { Outlet, Link, useLocation } from 'react-router-dom';
import { Briefcase, Users, Building, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useEmployer } from '../../contexts/EmployerContext';
import OpportunityOSCopilot from '../copilot/OpportunityOSCopilot';

export default function EmployerLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { companyProfile, opportunities, applicants, reviews } = useEmployer();

  const employerContext = {
    user: {
      name: user?.name || user?.user_metadata?.full_name || 'Employer',
      email: user?.email
    },
    companyProfile,
    opportunities,
    applicants,
    candidateReviews: reviews
  };

  const navItems = [
    { name: 'Dashboard', path: '/employer/dashboard', icon: LayoutDashboard },
    { name: 'Opportunities', path: '/employer/opportunities', icon: Briefcase },
    { name: 'Applicants', path: '/employer/applicants', icon: Users },
    { name: 'Company Profile', path: '/employer/company-profile', icon: Building },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 h-full">
        <div>
          <div className="p-6">
            <h1 className="text-2xl font-extrabold text-[#6C4CF1] tracking-tight flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#6C4CF1] flex items-center justify-center">
                <Briefcase size={18} className="text-white" />
              </div>
              OppOS <span className="text-slate-800">Employer</span>
            </h1>
          </div>
          
          <nav className="px-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-bold transition-all ${
                    isActive 
                      ? 'bg-[#6C4CF1] text-white shadow-sm' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100">
          {companyProfile ? (
            <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                {companyProfile.logo_url ? (
                  <img src={companyProfile.logo_url} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <Building size={16} className="text-slate-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-slate-900 truncate">{companyProfile.company_name}</p>
              </div>
            </div>
          ) : (
            <div className="px-4 py-2 mb-2">
              <p className="text-[12px] font-bold text-amber-600">Complete Company Profile</p>
            </div>
          )}
          
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-[14px] font-bold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto h-full relative z-0">
        <Outlet />
      </div>

      {/* OpportunityOS Copilot (Employer) */}
      <OpportunityOSCopilot mode="employer" contextData={employerContext} />
    </div>
  );
}
