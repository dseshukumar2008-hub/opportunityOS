import { Link } from 'react-router-dom';
import { Sparkles, FileText, ChevronRight, Target } from 'lucide-react';
import { useDashboardInsights } from '../../hooks/useDashboardInsights';

export default function DashboardNextActionWidget({ userState }) {
  const { hasProfile, hasResume, isNewUser } = userState || {};
  const { plan } = useDashboardInsights();

// eslint-disable-next-line no-useless-assignment
  let title = '';
// eslint-disable-next-line no-useless-assignment
  let description = '';
// eslint-disable-next-line no-useless-assignment
  let mainAction = null;
// eslint-disable-next-line no-useless-assignment
  let subActions = [];

  if (isNewUser || !hasProfile) {
    title = 'Complete your profile';
    description = 'Add your missing details to improve opportunity matching.';
    mainAction = { label: 'Complete Profile', to: '/profile' };
    subActions = [
      { label: 'Improve Resume', to: '/resume-review', icon: FileText },
      { label: 'View Skill Gaps', to: '/skill-gap', icon: Target }
    ];
  } else if (!hasResume) {
    title = 'Build your resume';
    description = 'Upload your existing resume to get an ATS score and personalized improvements.';
    mainAction = { label: 'Create Resume', to: '/resume-review' };
    subActions = [
      { label: 'Identify Skill Gaps', to: '/skill-gap', icon: Target },
      { label: 'Career Roadmap', to: '/career-roadmap', icon: Sparkles }
    ];
  } else {
    // Existing user with meaningful data
    title = plan?.focus_area || 'Improve your ATS score';
    description = 'Optimize your resume with missing keywords and tailored project descriptions.';
    mainAction = { label: 'Improve Resume', to: '/resume-review' };
    subActions = [
      { label: 'Explore Opportunities', to: '/opportunities', icon: Sparkles },
      { label: 'Career Roadmap', to: '/career-roadmap', icon: Target }
    ];
  }

  return (
    <div className="card-standard p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none opacity-60"></div>
      
      <div className="flex-1 relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} className="text-[#6C4CF1]" />
          <span className="text-[14px] font-black text-slate-900 tracking-wide">Next Best Action</span>
        </div>
        
        <Link to={mainAction.to} className="bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-4 max-w-2xl flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors group block">
          <div>
            <h3 className="text-[16px] font-bold text-slate-900 mb-1">{title}</h3>
            <p className="text-[13px] text-slate-500 font-medium">{description}</p>
          </div>
          <div className="shrink-0 text-slate-400 group-hover:text-[#6C4CF1] transition-colors ml-4">
            <ChevronRight size={20} />
          </div>
        </Link>
        
        <div className="flex flex-wrap gap-3">
          {subActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <Link key={idx} to={action.to} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[12px] font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm">
                <Icon size={14} className="text-indigo-400" />
                {action.label} <ChevronRight size={14} className="text-slate-400 ml-1" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
