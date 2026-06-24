import { Link } from 'react-router-dom';
import { FileEdit, Search, Bot, Target, Users, BarChart3, ArrowRight } from 'lucide-react';

const actions = [
  { icon: FileEdit,   label: 'Create Resume',      sub: 'Build your profile',          path: '/resume-builder',  color: 'indigo' },
  { icon: Bot,        label: 'Analyze Resume',     sub: 'Get AI-powered feedback',     path: '/resume-review',   color: 'violet' },
  { icon: Target,     label: 'Skill Gap Analysis', sub: 'Identify missing skills',     path: '/skill-gap',  color: 'emerald' },
  { icon: Users,      label: 'Interview Prep',     sub: 'Practice with AI',            path: '/interview-prep',   color: 'amber' },
  { icon: Target,     label: 'Career Coach',       sub: 'Plan your next steps',        path: '/career-coach',  color: 'emerald' },
  { icon: BarChart3,  label: 'View Analytics',     sub: 'Track your progress',         path: '/analytics',     color: 'rose' },
];

const colorMap = {
  indigo:  { icon: 'text-indigo-600',  bg: 'bg-indigo-50',  border: 'border-indigo-100',  hover: 'hover:border-indigo-300' },
  violet:  { icon: 'text-violet-600',  bg: 'bg-violet-50',  border: 'border-violet-100',  hover: 'hover:border-violet-300' },
  emerald: { icon: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', hover: 'hover:border-emerald-300' },
  amber:   { icon: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-100',   hover: 'hover:border-amber-300' },
  rose:    { icon: 'text-rose-600',    bg: 'bg-rose-50',    border: 'border-rose-100',    hover: 'hover:border-rose-300' },
};

export default function DashboardQuickActions() {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-[16px] font-black text-slate-900">Quick Actions</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((action, idx) => {
          const c = colorMap[action.color] || colorMap.indigo;
          return (
            <Link
              key={idx}
              to={action.path}
              className={`group flex flex-col p-4 bg-white border ${c.border} ${c.hover} rounded-[16px] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}
            >
              <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center mb-3`}>
                <action.icon size={17} className={c.icon} />
              </div>
              <p className="text-[13px] font-bold text-slate-900 mb-0.5">{action.label}</p>
              <p className="text-[11px] font-medium text-slate-500 leading-tight mb-3">{action.sub}</p>
              <div className="mt-auto flex items-center gap-1">
                <span className={`text-[11px] font-bold ${c.icon}`}>Go</span>
                <ArrowRight size={11} className={`${c.icon} group-hover:translate-x-0.5 transition-transform`} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
