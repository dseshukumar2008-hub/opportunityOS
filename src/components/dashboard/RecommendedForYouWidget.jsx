import { Link } from 'react-router-dom';
import { FileText, Briefcase, Code, ArrowRight } from 'lucide-react';
import { useDashboardInsights } from '../../hooks/useDashboardInsights';

export default function RecommendedForYouWidget({ userState }) {
  const { isNewUser } = userState || {};
  const { recommendations } = useDashboardInsights(); // Assuming recommendations exist

// eslint-disable-next-line no-useless-assignment
  let actions = [];

  if (isNewUser) {
    actions = [
      { 
        icon: FileText, 
        title: 'Build Your Profile', 
        description: 'Get started by completing your details.', 
        path: '/profile', 
        color: 'indigo' 
      },
      { 
        icon: Code, 
        title: 'Create Your Resume', 
        description: 'Build or upload a resume to get feedback.', 
        path: '/resume-review', 
        color: 'emerald' 
      },
      { 
        icon: Briefcase, 
        title: 'Explore Opportunities', 
        description: 'Find roles that match your career goals.', 
        path: '/opportunities', 
        color: 'amber' 
      }
    ];
  } else {
    // If we have actual dynamic recommendations, map them. Otherwise, default actions.
    actions = recommendations?.length > 0 ? recommendations : [
      { 
        icon: FileText, 
        title: 'Improve Your Resume', 
        description: 'Get a higher ATS score and stand out to recruiters.', 
        path: '/resume-review', 
        color: 'indigo' 
      },
      { 
        icon: Code, 
        title: 'Build Missing Skills', 
        description: 'Learn in-demand skills and strengthen your profile.', 
        path: '/skill-gap', 
        color: 'emerald' 
      },
      { 
        icon: Briefcase, 
        title: 'Explore Opportunities', 
        description: 'Find relevant jobs and internships for you.', 
        path: '/opportunities', 
        color: 'amber' 
      }
    ];
  }

  const colorMap = {
    indigo:  { icon: 'text-indigo-600',  bg: 'bg-indigo-50',  border: 'border-indigo-100',  hover: 'hover:border-indigo-300' },
    emerald: { icon: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', hover: 'hover:border-emerald-300' },
    amber:   { icon: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-100',   hover: 'hover:border-amber-300' },
    rose:    { icon: 'text-rose-600',    bg: 'bg-rose-50',    border: 'border-rose-100',    hover: 'hover:border-rose-300' },
    violet:  { icon: 'text-violet-600',  bg: 'bg-violet-50',  border: 'border-violet-100',  hover: 'hover:border-violet-300' },
  };

  return (
    <div className="w-full">
      <div className="mb-4 px-1">
        <h3 className="text-[16px] font-black text-slate-900">Recommended for You</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action, idx) => {
          const c = colorMap[action.color] || colorMap.indigo;
          const Icon = action.icon;
          return (
            <Link
              key={idx}
              to={action.path}
              className={`group flex items-center p-5 bg-white border ${c.border} ${c.hover} rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}
            >
              <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center shrink-0 mr-4`}>
                <Icon size={20} className={c.icon} />
              </div>
              <div className="flex-1">
                <h4 className="text-[14px] font-bold text-slate-900 mb-0.5">{action.title}</h4>
                <p className="text-[12px] font-medium text-slate-500 leading-snug pr-4">{action.description}</p>
              </div>
              <div className="shrink-0 text-slate-300 group-hover:text-slate-600 transition-colors">
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
