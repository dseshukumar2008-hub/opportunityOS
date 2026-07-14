import React from 'react';
import { Rocket, ArrowRight, Clock, Target, CheckCircle2 } from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Personal Details', desc: 'Tell us about yourself', icon: '👤', iconBg: 'bg-gradient-to-br from-[#997CFF] to-[#6D5CFF] shadow-[0_0_14px_rgba(109,92,255,0.4)]', accentBorder: 'border-l-[#8B5CFF]', cardBg: 'bg-gradient-to-br from-[#F5F3FF] to-[#FCFAFF]', badgeBg: 'bg-[#EDE9FE]', badgeText: 'text-[#6D5CFF]', cardShadow: 'shadow-[0_4px_12px_rgba(109,92,255,0.08)]', hoverCardShadow: 'hover:shadow-[0_8px_20px_rgba(109,92,255,0.2)]' },
  { id: 2, title: 'Education', desc: 'Add your academic background', icon: '🎓', iconBg: 'bg-gradient-to-br from-[#7DD3FC] to-[#0284C7] shadow-[0_0_14px_rgba(56,189,248,0.4)]', accentBorder: 'border-l-[#38BDF8]', cardBg: 'bg-gradient-to-br from-[#F0F9FF] to-[#F7FCFF]', badgeBg: 'bg-[#E0F2FE]', badgeText: 'text-[#0284C7]', cardShadow: 'shadow-[0_4px_12px_rgba(56,189,248,0.08)]', hoverCardShadow: 'hover:shadow-[0_8px_20px_rgba(56,189,248,0.2)]' },
  { id: 3, title: 'Skills', desc: 'Select your technical skills', icon: '💻', iconBg: 'bg-gradient-to-br from-[#6EE7B7] to-[#059669] shadow-[0_0_14px_rgba(52,211,153,0.4)]', accentBorder: 'border-l-[#34D399]', cardBg: 'bg-gradient-to-br from-[#F0FDF4] to-[#F5FEFA]', badgeBg: 'bg-[#DCFCE7]', badgeText: 'text-[#059669]', cardShadow: 'shadow-[0_4px_12px_rgba(52,211,153,0.08)]', hoverCardShadow: 'hover:shadow-[0_8px_20px_rgba(52,211,153,0.2)]' },
  { id: 4, title: 'Career Interests', desc: 'Choose your career goals', icon: '🎯', iconBg: 'bg-gradient-to-br from-[#A5B4FC] to-[#4F46E5] shadow-[0_0_14px_rgba(129,140,248,0.4)]', accentBorder: 'border-l-[#818CF8]', cardBg: 'bg-gradient-to-br from-[#EEF2FF] to-[#F8F9FF]', badgeBg: 'bg-[#E0E7FF]', badgeText: 'text-[#4F46E5]', cardShadow: 'shadow-[0_4px_12px_rgba(129,140,248,0.08)]', hoverCardShadow: 'hover:shadow-[0_8px_20px_rgba(129,140,248,0.2)]' },
  { id: 5, title: 'About Me', desc: 'Introduce yourself', icon: '📝', iconBg: 'bg-gradient-to-br from-[#FDBA74] to-[#EA580C] shadow-[0_0_14px_rgba(251,146,60,0.4)]', accentBorder: 'border-l-[#FB923C]', cardBg: 'bg-gradient-to-br from-[#FFF7ED] to-[#FFFCF9]', badgeBg: 'bg-[#FFEDD5]', badgeText: 'text-[#EA580C]', cardShadow: 'shadow-[0_4px_12px_rgba(251,146,60,0.08)]', hoverCardShadow: 'hover:shadow-[0_8px_20px_rgba(251,146,60,0.2)]' },
  { id: 6, title: 'Resume Upload', desc: 'Unlock AI Resume Analysis', icon: '📄', iconBg: 'bg-gradient-to-br from-[#F9A8D4] to-[#DB2777] shadow-[0_0_14px_rgba(244,114,182,0.4)]', accentBorder: 'border-l-[#F472B6]', cardBg: 'bg-gradient-to-br from-[#FDF2F8] to-[#FFF9FC]', badgeBg: 'bg-[#FCE7F3]', badgeText: 'text-[#DB2777]', cardShadow: 'shadow-[0_4px_12px_rgba(244,114,182,0.08)]', hoverCardShadow: 'hover:shadow-[0_8px_20px_rgba(244,114,182,0.2)]' },
];

export default function WelcomeStep({ onNext, onSkip }) {
  return (
    <div className="flex flex-col w-full px-4 py-8 lg:px-12 lg:pt-10 lg:pb-6 relative bg-transparent">
      
      {/* 2-Column Layout */}
      <div className="flex flex-col lg:flex-row w-full gap-10 lg:gap-14 mb-8">
        
        {/* Left Column - ~45% */}
        <div className="w-full lg:w-[45%] flex flex-col items-center text-center justify-start mt-2">
          
          {/* Decorative Background Glows */}
          <div className="absolute top-10 left-4 w-12 h-12 bg-gradient-to-tr from-[#E9D5FF]/60 to-transparent rounded-full blur-md"></div>
          <div className="absolute bottom-20 right-10 w-16 h-16 bg-gradient-to-br from-[#BAE6FD]/40 to-transparent rounded-full blur-lg"></div>
          <div className="absolute top-1/2 left-2 w-8 h-8 bg-gradient-to-r from-[#FFEDD5]/50 to-transparent rounded-full blur-md"></div>

          <div className="w-[52px] h-[52px] bg-gradient-to-br from-[#7C66FF] to-[#997CFF] rounded-full flex items-center justify-center relative mb-5 shadow-[0_8px_16px_-4px_rgba(124,102,255,0.4)]">
            <Rocket size={22} className="text-white -rotate-12" />
            {/* Particles */}
            <div className="absolute top-0 -right-2 w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
            <div className="absolute bottom-1 -left-2 w-1 h-1 bg-pink-400 rounded-full"></div>
            <div className="absolute top-1 -left-3 text-[10px] text-yellow-300 animate-pulse">✨</div>
            <div className="absolute bottom-1 -right-3 text-[10px] text-yellow-400 animate-pulse" style={{ animationDelay: '300ms' }}>✦</div>
          </div>

          <h1 className="text-[26px] font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
            Welcome to <span className="text-[#6D5CFF]">OpportunityOS</span> 🚀
          </h1>
          
          <p className="text-[14px] text-slate-700 font-medium leading-relaxed mb-3">
            Let's personalize your AI Career Operating System.
          </p>
          
          <p className="text-[12.5px] text-slate-500 leading-relaxed mb-5 max-w-[320px]">
            This quick setup helps us understand you better and deliver personalized opportunities.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F5F3FF] rounded-full mb-8">
            <Clock size={14} className="text-[#6D5CFF]" />
            <span className="text-[12px] font-bold text-[#6D5CFF]">Takes less than 2 minutes to complete</span>
          </div>

          {/* Info Card - Left Aligned content but card itself is centered */}
          <div className="w-full bg-gradient-to-br from-white to-[#F8F5FF] rounded-[16px] p-6 border border-[#E9D5FF]/50 relative overflow-hidden group text-left shadow-sm">
            <div className="absolute top-3 right-3 text-[#E9D5FF] text-lg">✨</div>
            <h3 className="text-[13.5px] font-bold text-[#6D5CFF] mb-4 relative z-10">
              Here's what we'll set up together
            </h3>
            <ul className="space-y-4 relative z-10">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-[#6D5CFF] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[12px] font-bold text-slate-800 leading-tight mb-0.5">Build your profile</p>
                  <p className="text-[11px] text-slate-500 leading-tight">Help us know you better</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-[#6D5CFF] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[12px] font-bold text-slate-800 leading-tight mb-0.5">Discover opportunities</p>
                  <p className="text-[11px] text-slate-500 leading-tight">Personalized for your goals</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-[#6D5CFF] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[12px] font-bold text-slate-800 leading-tight mb-0.5">AI powered recommendations</p>
                  <p className="text-[11px] text-slate-500 leading-tight">Tailored to your skills & interests</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-[#6D5CFF] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[12px] font-bold text-slate-800 leading-tight mb-0.5">Connect & grow</p>
                  <p className="text-[11px] text-slate-500 leading-tight">With the right people and networks</p>
                </div>
              </li>
            </ul>
            
            <Target size={120} className="absolute -bottom-6 -right-6 text-[#6D5CFF] opacity-[0.05] transform -rotate-12" strokeWidth={1.5} />
          </div>
        </div>

        {/* Right Column - ~55% */}
        <div className="w-full lg:w-[55%] flex flex-col pt-1">
          
          <div className="flex justify-between items-center mb-3.5">
            <span className="text-[13px] font-bold text-slate-800 flex items-center gap-1.5 tracking-tight">
              <span className="text-yellow-500 text-sm">✨</span> Setup Progress
            </span>
            <span className="text-[11.5px] font-bold text-[#6D5CFF]">0 of 6 completed</span>
          </div>
          
          <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mb-7">
            <div className="h-full bg-gradient-to-r from-[#6D5CFF] to-[#8B5CFF] w-[5%] rounded-full shadow-[0_0_8px_rgba(109,92,255,0.6)] transition-all duration-500"></div>
          </div>

          <div className="flex flex-col gap-[11px] relative flex-1">
            {/* Timeline connector - perfectly centered and bound to first/last steps */}
            <div className="absolute left-[42px] top-[34.5px] bottom-[34.5px] w-[2px] bg-gradient-to-b from-[#8B5CFF] via-[#34D399] to-[#F472B6] z-0 hidden lg:block rounded-full shadow-[0_0_12px_rgba(139,92,255,0.4)] opacity-60"></div>
            
            {STEPS.map((step) => (
              <div 
                key={step.id}
                className={`group relative z-10 flex items-center gap-4 px-4 py-[11.5px] ${step.cardBg} border border-white/60 border-l-[5px] ${step.accentBorder} rounded-[14px] ${step.cardShadow} ${step.hoverCardShadow} hover:-translate-y-[3px] transition-all duration-300 ease-out cursor-pointer overflow-hidden`}
              >
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-transparent pointer-events-none"></div>
                
                {/* Left icon circle */}
                <div className={`w-[44px] h-[44px] rounded-full ${step.iconBg} flex items-center justify-center shrink-0 border border-white/50 relative group-hover:scale-[1.08] transition-transform duration-300 z-10`}>
                  <span className="text-[18px] relative z-10 drop-shadow-sm">{step.icon}</span>
                  {/* Premium step number badge */}
                  <div className="absolute -bottom-1 -right-1 flex items-center justify-center w-[18px] h-[18px] bg-white rounded-full border border-slate-200/80 text-[9px] font-bold text-slate-500 shadow-sm z-20">
                    {step.id}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0 pr-2 relative z-10">
                  <h4 className="text-[13px] font-bold text-slate-800 leading-tight mb-0.5 group-hover:text-slate-900 transition-colors">
                    {step.title}
                  </h4>
                  <p className="text-[11.5px] text-slate-500 font-medium leading-tight truncate">{step.desc}</p>
                </div>

                {/* Minimal Pending Badge */}
                <div className={`shrink-0 px-2.5 py-1 ${step.badgeBg} border border-white/40 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.05)] relative z-10`}>
                  <span className={`text-[9px] font-extrabold ${step.badgeText} tracking-wider`}>PENDING</span>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </div>

      {/* Bottom CTA Area - Spans Full Width */}
      <div className="w-full flex flex-col items-center mt-2">
        <button 
          onClick={onNext}
          className="w-full lg:w-[50%] h-[48px] bg-[#6D5CFF] hover:bg-[#5E4CE0] text-white rounded-[12px] font-bold text-[14px] transition-all duration-300 shadow-[0_4px_14px_rgba(109,92,255,0.3)] flex items-center justify-center gap-2"
        >
          <Rocket size={16} />
          Start My Journey
        </button>
        
        <button 
          onClick={onSkip}
          className="text-center text-[12px] text-slate-400 font-medium hover:text-slate-600 transition-colors mt-3"
        >
          Skip for now
        </button>
      </div>

    </div>
  );
}
