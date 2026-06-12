import { Link } from 'react-router-dom';
import { Target, ArrowRight, User, FileText, Code, AlertTriangle, Briefcase, Zap } from 'lucide-react';
import { useDashboardInsights } from '../../hooks/useDashboardInsights';

export default function NextBestActionWidget() {
  const { nextBestAction, isLoading } = useDashboardInsights();

  if (isLoading) {
    return (
      <div className="card-standard p-6 animate-pulse bg-gradient-to-br from-indigo-50 to-white">
        <div className="h-6 w-32 bg-indigo-100 rounded mb-4"></div>
        <div className="h-4 w-3/4 bg-slate-100 rounded mb-6"></div>
        <div className="h-10 w-32 bg-indigo-200 rounded-lg"></div>
      </div>
    );
  }

  const { text, cta, link, icon } = nextBestAction;

  const IconMap = {
    User,
    FileText,
    Code,
    AlertTriangle,
    Briefcase,
    Zap
  };
  
  const ActionIcon = IconMap[icon] || Target;

  return (
    <div className="card-standard p-6 bg-gradient-to-br from-[#6C4CF1] to-[#4F35C2] text-white relative overflow-hidden shadow-lg shadow-indigo-500/20">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <ActionIcon size={120} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 border border-white/10">
            <Target size={16} className="text-white" />
          </div>
          <h3 className="text-[14px] font-extrabold uppercase tracking-widest text-indigo-100">Next Best Action</h3>
        </div>
        
        <p className="text-[18px] font-bold text-white mb-6 leading-snug max-w-[90%]">
          {text}
        </p>
        
        <Link 
          to={link || "/"}
          className="inline-flex items-center gap-2 bg-white text-[#6C4CF1] hover:bg-indigo-50 font-bold text-sm px-6 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          {cta}
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
