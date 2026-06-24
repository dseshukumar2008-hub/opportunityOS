import { Sparkles, ArrowRight, Target, TrendingUp, CheckCircle2, Zap, AlertCircle, BarChart2 } from 'lucide-react';

export default function Step8CareerReadiness() {
  return (
    <div className="w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200/60 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
            <Target size={20} className="text-violet-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Measure your career readiness</h2>
            <p className="text-sm font-medium text-slate-500">Track your holistic progress towards landing your dream role.</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
           <div className="text-sm text-right">
            <div className="font-bold text-slate-900">Current Status</div>
            <div className="text-xs text-violet-600 font-bold">Market Ready</div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 bg-[#FAFAFA] overflow-y-auto custom-scrollbar">
        
        {/* Left Col */}
        <div className="col-span-1 space-y-6">
           
           {/* Progress Ring */}
           <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-violet-50 rounded-full blur-2xl"></div>
             <div className="relative w-36 h-36 mb-4">
               <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                 <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f1f5f9" strokeWidth="4" />
                 <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#8b5cf6" strokeWidth="4" strokeDasharray="82 18" strokeDashoffset="0" strokeLinecap="round" />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-4xl font-black text-slate-900">82</span>
                 <span className="text-[10px] font-bold text-slate-500 uppercase mt-1">Score</span>
               </div>
             </div>
             <h3 className="text-lg font-bold text-slate-900">Top 15% of Students</h3>
             <p className="text-xs text-slate-500 mt-2">You are consistently improving your readiness metrics week over week.</p>
           </div>

           {/* AI Coach */}
           <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-6 shadow-md text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-violet-200" />
              <h4 className="text-xs font-bold tracking-widest uppercase text-violet-100">AI Coach Recommendations</h4>
            </div>
            <p className="text-sm leading-relaxed font-medium mb-4">
              You are currently classified as "Market Ready". Completing one more mock interview will elevate you to "Top Tier", significantly increasing your visibility to partner companies.
            </p>
            <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/20">
              <Zap size={16} className="text-amber-300 shrink-0" />
              <p className="text-xs font-semibold">Priority: Schedule Behavioral Mock Interview</p>
            </div>
          </div>

          {/* Skill Progress */}
          <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><BarChart2 size={16} className="text-violet-500"/> Skill Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700">Technical Skills</span>
                  <span className="text-violet-600">90%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500 w-[90%] rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700">Communication</span>
                  <span className="text-violet-600">75%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500 w-[75%] rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700">Problem Solving</span>
                  <span className="text-violet-600">85%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500 w-[85%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col */}
        <div className="col-span-2 space-y-6">
          
          <div className="grid grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-white rounded-2xl border border-emerald-200/60 p-6 shadow-sm relative overflow-hidden">
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-50 rounded-full blur-2xl"></div>
              <h3 className="text-sm font-bold text-slate-900 mb-4">Strength Areas</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2"><CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" /><span className="text-sm font-medium text-slate-700">Excellent ATS Resume Score (88)</span></div>
                <div className="flex items-start gap-2"><CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" /><span className="text-sm font-medium text-slate-700">Strong Technical Keyword Alignment</span></div>
                <div className="flex items-start gap-2"><CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" /><span className="text-sm font-medium text-slate-700">Active Github Contributions</span></div>
              </div>
            </div>

            {/* Improvements */}
            <div className="bg-white rounded-2xl border border-amber-200/60 p-6 shadow-sm relative overflow-hidden">
               <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-50 rounded-full blur-2xl"></div>
              <h3 className="text-sm font-bold text-slate-900 mb-4">Improvement Areas</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2"><AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" /><span className="text-sm font-medium text-slate-700">Lacking Behavioral Interview Prep</span></div>
                <div className="flex items-start gap-2"><AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" /><span className="text-sm font-medium text-slate-700">Low Profile Visibility</span></div>
                <div className="flex items-start gap-2"><AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" /><span className="text-sm font-medium text-slate-700">Missing Portfolio Link</span></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2"><TrendingUp size={18} className="text-violet-500"/> Career Growth Timeline</h3>
            
            <div className="relative border-l-2 border-slate-100 ml-3 space-y-6">
              
              <div className="relative flex items-center">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center absolute -left-[13px] ring-4 ring-white shadow-sm">
                  <CheckCircle2 size={12} strokeWidth={3} />
                </div>
                <div className="ml-8">
                  <h4 className="text-sm font-bold text-slate-900">Profile Optimized</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Resume ATS score reached 88+</p>
                </div>
              </div>

              <div className="relative flex items-center">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center absolute -left-[13px] ring-4 ring-white shadow-sm">
                  <CheckCircle2 size={12} strokeWidth={3} />
                </div>
                <div className="ml-8">
                  <h4 className="text-sm font-bold text-slate-900">Network Expanded</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Connected with 5 industry professionals</p>
                </div>
              </div>

              <div className="relative flex items-center">
                <div className="w-6 h-6 rounded-full bg-violet-500 text-white flex items-center justify-center absolute -left-[13px] ring-4 ring-violet-50 shadow-sm animate-pulse">
                  <Zap size={12} strokeWidth={3} fill="currentColor" />
                </div>
                <div className="ml-8">
                  <h4 className="text-sm font-bold text-slate-900">Interview Prep</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Complete 2 AI mock interviews</p>
                  <div className="mt-3 flex items-center gap-3">
                     <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-violet-500 rounded-full w-1/2"></div>
                     </div>
                     <span className="text-xs font-bold text-slate-600">1/2</span>
                  </div>
                </div>
              </div>

              <div className="relative flex items-center">
                <div className="w-6 h-6 rounded-full bg-white border-2 border-slate-200 text-slate-300 flex items-center justify-center absolute -left-[13px] ring-4 ring-white">
                  <span className="text-[10px] font-bold">4</span>
                </div>
                <div className="ml-8 opacity-60">
                  <h4 className="text-sm font-bold text-slate-900">Send Applications</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Apply to top 3 matched roles</p>
                </div>
              </div>

            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
             <div>
               <h4 className="text-sm font-bold text-white mb-1">Weekly Goal: Interview Practice</h4>
               <p className="text-xs text-slate-400">Complete a behavioral mock interview this week to reach Tier 1.</p>
             </div>
             <button className="w-full md:w-auto px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-bold transition-colors shadow-sm">
               Start Mock Interview
             </button>
          </div>
        </div>

      </div>

      {/* Footer CTA */}
      <div className="px-8 py-5 border-t border-slate-100 bg-white flex items-center justify-between shrink-0 z-10">
        <button className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2">
          Back
        </button>
        <button className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md shadow-violet-200 transition-all">
          Improve Readiness <ArrowRight size={16}/>
        </button>
      </div>
    </div>
  );
}
