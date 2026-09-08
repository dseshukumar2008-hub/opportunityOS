import { Link } from 'react-router-dom';
import { Sparkles, FileText, ChevronRight, Target, TrendingUp, CheckCircle2, Circle } from 'lucide-react';

export default function DashboardNextActionWidget({ userState }) {
  const { profile, insights, hasProfile, hasResume, isNewUser } = userState || {};
  const { nextBestAction } = insights || {};

  let title;
  let description;
  let mainAction;
  let subActions;

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
    title = nextBestAction?.text || 'Improve your ATS score';
    description = 'Optimize your resume with missing keywords and tailored project descriptions.';
    mainAction = { label: nextBestAction?.cta || 'Improve Resume', to: nextBestAction?.link || '/resume-review' };
    subActions = [
      { label: 'Career Roadmap', to: '/career-roadmap', icon: Target }
    ];
  }

  // Calculate Progress
  const hasGithub = !!profile?.githubAnalysis;
  const hasRoadmap = !!profile?.hasRoadmap || !!profile?.roadmapProgress;
  
  const steps = [
    { name: 'Complete Profile', completed: hasProfile },
    { name: 'Upload Resume', completed: hasResume },
    { name: 'Analyze GitHub', completed: hasGithub },
    { name: 'Generate Roadmap', completed: hasRoadmap }
  ];
  
  const completedCount = steps.filter(s => s.completed).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* Left Card: Next Best Action */}
      <div className="card-standard p-5 flex flex-col relative overflow-hidden w-full h-full border-slate-200">

        
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
              <Sparkles size={16} className="text-indigo-600" />
            </div>
            <h3 className="text-[16px] font-bold text-slate-900">Next Best Action</h3>
          </div>
          
          <Link to={mainAction.to} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-3 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors group">
            <div>
              <h3 className="text-[16px] font-bold text-slate-900 mb-0.5">{title}</h3>
              <p className="text-[13px] text-slate-500 font-medium leading-relaxed max-w-[340px]">{description}</p>
            </div>
            <div className="shrink-0 text-slate-400 group-hover:text-[#6C4CF1] transition-colors ml-3">
              <ChevronRight size={20} />
            </div>
          </Link>
          
          <div className="flex flex-wrap gap-2.5 mt-auto">
            {subActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <Link key={idx} to={action.to} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[12px] font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm">
                  <Icon size={14} className="text-indigo-400" />
                  {action.label} <ChevronRight size={14} className="text-slate-400 ml-0.5" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Card: Career Progress */}
      <div className="card-standard p-5 flex flex-col relative overflow-hidden w-full h-full border-slate-200">

        
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
              <TrendingUp size={16} className="text-emerald-600" />
            </div>
            <h3 className="text-[16px] font-bold text-slate-900">Career Progress</h3>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-3 flex items-center gap-4 cursor-default">
            <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                <path className="text-slate-200" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-emerald-500 transition-all duration-1000 ease-out" strokeDasharray={`${progressPercent}, 100`} strokeWidth="4" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <span className="absolute text-[12px] font-bold text-slate-800">{progressPercent}%</span>
            </div>
            
            <div>
              <h4 className="text-[16px] font-bold text-slate-900 mb-0.5">Setup Progress</h4>
              <p className="text-[13px] text-slate-500 font-medium leading-relaxed max-w-[280px]">
                {completedCount === steps.length 
                  ? "Your profile is fully optimized!" 
                  : "Complete your profile to receive personalized recommendations."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mt-auto">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl shadow-sm">
                {step.completed ? (
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                ) : (
                  <Circle size={14} className="text-slate-300 shrink-0" />
                )}
                <span className={`text-[12px] font-bold truncate ${step.completed ? 'text-slate-700' : 'text-slate-400'}`}>
                  {step.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
