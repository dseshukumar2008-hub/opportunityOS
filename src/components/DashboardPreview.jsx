import {
  LayoutDashboard, FileText, Search, Briefcase, Settings, User,
  Bell, ArrowRight, BarChart2, Compass
} from 'lucide-react';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: FileText,        label: 'Resume Builder' },
  { icon: Compass,         label: 'Career Explorer' },
  { icon: BarChart2,       label: 'Skill Arcade' },
  { icon: Briefcase,       label: 'Opportunities' },
  { icon: User,            label: 'Profile' },
  { icon: Settings,        label: 'Settings' },
];

const FEATURE_CARDS = [
  {
    icon: FileText,
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    arrowColor: 'text-indigo-500',
    title: 'Build Your Resume',
    desc: 'Create and improve your resume',
  },
  {
    icon: Compass,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    arrowColor: 'text-emerald-500',
    title: 'Explore Careers',
    desc: 'Discover roles and opportunities',
  },
  {
    icon: BarChart2,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    arrowColor: 'text-amber-500',
    title: 'Analyze Your Skills',
    desc: 'Identify skill gaps and grow',
  },
  {
    icon: Briefcase,
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-600',
    arrowColor: 'text-rose-500',
    title: 'Find Opportunities',
    desc: 'Apply to hackathons, internships and more',
  },
];

export default function DashboardPreview() {
  return (
    <div className="w-full flex items-center justify-center">
      {/* Outer browser-like frame */}
      <div className="w-full max-w-[580px] xl:max-w-[640px] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.10)] border border-slate-200 overflow-hidden bg-white transition-transform duration-500 hover:-translate-y-1">

        {/* App top-bar */}
        <div className="h-12 bg-white border-b border-slate-100 flex items-center justify-between px-4 shrink-0">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
              <div className="w-3 h-3 rounded-full bg-white opacity-90" />
            </div>
            <span className="font-bold text-sm text-slate-900 tracking-tight">OpportunityOS</span>
          </div>
          {/* Right controls */}
          <div className="flex items-center gap-3">
            <button aria-label="Notifications" className="text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={15} />
            </button>
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">S</div>
              <span className="text-xs font-medium text-slate-700 hidden sm:inline">Student</span>
              <svg className="w-3 h-3 text-slate-400" viewBox="0 0 12 12" fill="none">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Body: sidebar + main */}
        <div className="flex" style={{ height: '360px' }}>

          {/* Sidebar */}
          <div className="w-[150px] xl:w-[160px] shrink-0 border-r border-slate-100 bg-white flex flex-col py-3 px-2 gap-0.5 overflow-hidden">
            {NAV_ITEMS.map(({ icon: Icon, label, active }) => (
              <button
                key={label}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                  active
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-medium'
                }`}
              >
                <Icon size={13} className={active ? 'text-indigo-600' : 'text-slate-400'} />
                <span className="text-[11px] truncate">{label}</span>
              </button>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 bg-[#F8F9FD] p-4 overflow-hidden flex flex-col">
            {/* Welcome */}
            <div className="mb-3">
              <h2 className="text-[15px] font-bold text-slate-900">Welcome back!</h2>
              <p className="text-[11px] text-slate-500 mt-0.5">Explore tools to plan, prepare and grow your career.</p>
            </div>

            {/* Feature cards grid */}
            <div className="grid grid-cols-2 gap-2.5 flex-1 min-h-0">
              {FEATURE_CARDS.map(({ icon: Icon, iconBg, iconColor, arrowColor, title, desc }) => (
                <div
                  key={title}
                  className="bg-white rounded-xl border border-slate-100 p-3 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-slate-200 transition-all cursor-pointer group"
                >
                  <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center mb-2`}>
                    <Icon size={15} className={iconColor} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-[11px] font-bold text-slate-800 leading-snug">{title}</p>
                      <ArrowRight size={12} className={`${arrowColor} shrink-0 group-hover:translate-x-0.5 transition-transform`} />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
