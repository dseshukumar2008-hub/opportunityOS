import { Link } from 'react-router-dom';
import { Sparkles, Target, Code2, TrendingUp, MessageSquare } from 'lucide-react';
import { useAICopilot } from '../../hooks/useAICopilot';
import { useDashboardInsights } from '../../hooks/useDashboardInsights';

export default function AICopilotSection() {
  const { plan, isLoading } = useAICopilot();
  const { skillGap } = useDashboardInsights();

  const missingSkillsCount = skillGap?.missing?.length || 3;

  if (isLoading) {
    return (
      <div className="w-full h-[240px] rounded-[24px] bg-slate-200 animate-pulse"></div>
    );
  }

  return (
    <div className="w-full rounded-[24px] bg-gradient-to-br from-[#6C4CF1] via-[#5a3dd4] to-[#4527c4] p-6 lg:p-8 shadow-lg shadow-indigo-500/20 relative overflow-hidden">
      {/* Decorative blurred circles */}
      <div className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
            <Sparkles size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-[20px] font-black text-white leading-tight mb-1">AI Career Copilot</h2>
            <p className="text-[13px] font-medium text-white/80">Your personal AI coach for career growth</p>
          </div>
        </div>
        <Link 
          to="/career-coach" 
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white text-[13px] font-bold transition-all backdrop-blur-sm whitespace-nowrap"
        >
          <MessageSquare size={16} />
          Ask Career Coach
        </Link>
      </div>

      {/* 4 Cards Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today's Focus */}
        <div className="bg-white/10 border border-white/20 rounded-2xl p-5 backdrop-blur-md flex flex-col h-full hover:bg-white/15 transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-emerald-400 flex items-center justify-center shrink-0">
               <Target size={12} className="text-white" />
            </div>
            <span className="text-[12px] font-extrabold text-white uppercase tracking-wider">Today's Focus</span>
          </div>
          <h3 className="text-[15px] font-bold text-white mb-2 leading-snug">
            {plan?.focus_area || "Improve your ATS score"}
          </h3>
          <p className="text-[12px] font-medium text-white/70 mb-4 leading-relaxed">
            Optimize your resume with missing keywords
          </p>
          <div className="mt-auto pt-2">
            <Link to="/resume-review" className="inline-block px-4 py-2 bg-white text-[#6C4CF1] rounded-xl text-[12px] font-bold hover:bg-slate-50 transition-colors">
              Improve Resume
            </Link>
          </div>
        </div>

        {/* Card 2: Skill Gap */}
        <div className="bg-white/10 border border-white/20 rounded-2xl p-5 backdrop-blur-md flex flex-col h-full hover:bg-white/15 transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-blue-400 flex items-center justify-center shrink-0">
               <Code2 size={12} className="text-white" />
            </div>
            <span className="text-[12px] font-extrabold text-white uppercase tracking-wider">Skill Gap</span>
          </div>
          <h3 className="text-[15px] font-bold text-white mb-2 leading-snug">
            {missingSkillsCount} skills to learn
          </h3>
          <p className="text-[12px] font-medium text-white/70 mb-4 leading-relaxed">
            React, System Design, PostgreSQL...
          </p>
          <div className="mt-auto pt-2">
            <Link to="/analytics" className="inline-block px-4 py-2 bg-white/20 border border-white/10 text-white rounded-xl text-[12px] font-bold hover:bg-white/30 transition-colors">
              View Skill Gap
            </Link>
          </div>
        </div>

        {/* Card 3: Next Best Action */}
        <div className="bg-white/10 border border-white/20 rounded-2xl p-5 backdrop-blur-md flex flex-col h-full hover:bg-white/15 transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-emerald-400 flex items-center justify-center shrink-0">
               <TrendingUp size={12} className="text-white" />
            </div>
            <span className="text-[12px] font-extrabold text-white uppercase tracking-wider">Next Best Action</span>
          </div>
          <h3 className="text-[15px] font-bold text-white mb-2 leading-snug">
            Plan your next steps
          </h3>
          <p className="text-[12px] font-medium text-white/70 mb-4 leading-relaxed">
            Generate an AI-powered career roadmap
          </p>
          <div className="mt-auto pt-2">
            <Link to="/career-roadmap" className="inline-block px-4 py-2 bg-white/20 border border-white/10 text-white rounded-xl text-[12px] font-bold hover:bg-white/30 transition-colors">
              Generate Roadmap
            </Link>
          </div>
        </div>

        {/* Card 4: Weekly Progress */}
        <div className="bg-white/10 border border-white/20 rounded-2xl p-5 backdrop-blur-md flex flex-col h-full hover:bg-white/15 transition-colors">
          <div className="mb-3">
            <span className="text-[12px] font-extrabold text-white uppercase tracking-wider">Weekly Progress</span>
          </div>
          
          {plan?.weekly_progress?.length > 0 ? (
            <div className="flex-1 w-full flex items-end justify-between relative mt-2">
              <div className="absolute left-0 bottom-0 top-0 w-full flex flex-col justify-between text-[8px] font-bold text-white/40 pb-5">
                 <span>100%</span>
                 <span>50%</span>
                 <span>0%</span>
              </div>
              <div className="pl-6 w-full h-full relative">
                {/* Dynamic SVG implementation would go here, currently using empty state logic if not enough data */}
              </div>
            </div>
          ) : (
            <div className="flex-1 w-full flex flex-col items-center justify-center text-center mt-2 opacity-80">
               <TrendingUp size={20} className="text-white/40 mb-2" />
               <p className="text-[11px] font-semibold text-white/60 leading-tight">No activity tracked yet this week.</p>
               <p className="text-[9px] text-white/40 mt-1">Complete tasks to see your progress here.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
