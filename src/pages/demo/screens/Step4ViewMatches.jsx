import { Sparkles, ArrowRight, Target, Briefcase, GraduationCap, Code, Trophy, HelpCircle } from 'lucide-react';
import OpportunityMatchBadge from '../../../components/opportunities/OpportunityMatchBadge';

export default function Step4ViewMatches() {
  return (
    <div className="w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200/60 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
            <Target size={20} className="text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Let's find your best matches</h2>
            <p className="text-sm font-medium text-slate-500">Discover opportunities that perfectly align with your optimized profile.</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
          <div className="text-sm text-right">
            <div className="font-bold text-slate-900">Overall Match Quality</div>
            <div className="text-xs text-slate-500">Based on 120+ active roles</div>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center border-2 border-emerald-100">
             <span className="text-sm font-black text-emerald-600">89%</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 bg-[#FAFAFA]">
        
        {/* Left Col: Match Categories Dashboard */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
             <h3 className="text-sm font-bold text-slate-900 mb-4">Category Match Scores</h3>
             <div className="space-y-4">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                     <Briefcase size={14} className="text-emerald-600" />
                   </div>
                   <span className="text-sm font-bold text-slate-700">Internships</span>
                 </div>
                 <span className="text-sm font-bold text-emerald-600">92%</span>
               </div>
               
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                     <Code size={14} className="text-blue-600" />
                   </div>
                   <span className="text-sm font-bold text-slate-700">Hackathons</span>
                 </div>
                 <span className="text-sm font-bold text-blue-600">88%</span>
               </div>

               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                     <GraduationCap size={14} className="text-amber-600" />
                   </div>
                   <span className="text-sm font-bold text-slate-700">Scholarships</span>
                 </div>
                 <span className="text-sm font-bold text-amber-600">81%</span>
               </div>

               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
                     <Trophy size={14} className="text-rose-600" />
                   </div>
                   <span className="text-sm font-bold text-slate-700">Competitions</span>
                 </div>
                 <span className="text-sm font-bold text-rose-600">75%</span>
               </div>
             </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 shadow-md text-white relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-emerald-400" />
              <h4 className="text-xs font-bold tracking-widest uppercase text-slate-300">AI Match Engine</h4>
            </div>
            <p className="text-sm leading-relaxed text-slate-300 font-medium mb-4">
              Your recent addition of "React" and "TypeScript" boosted your Internship match score by 14%. You are currently in the top 5% of candidates for Frontend roles.
            </p>
          </div>
        </div>

        {/* Right Col: Ranked Opportunities */}
        <div className="col-span-2 bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-900">Ranked Opportunities</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 transition-colors">Highest Match</button>
              <button className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-600 transition-colors">Latest</button>
            </div>
          </div>
          
          <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {/* Top Match */}
            <div className="p-4 rounded-xl border-2 border-emerald-500 bg-emerald-50/30 flex items-center gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-bl-lg">#1 Match</div>
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm text-lg font-black" style={{ color: '#ea4335' }}>
                G
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-900">Software Engineering Intern, Summer 2026</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-medium text-slate-500">Google • Mountain View, CA</span>
                </div>
              </div>
              <OpportunityMatchBadge score={94} />
            </div>

            {/* Match 2 */}
            <div className="p-4 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-slate-50 flex items-center gap-4 transition-colors cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm text-lg font-black text-slate-800">
                M
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-900">Frontend Developer Internship</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-medium text-slate-500">Meta • Remote</span>
                </div>
              </div>
              <OpportunityMatchBadge score={89} />
            </div>

            {/* Match 3 */}
            <div className="p-4 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-slate-50 flex items-center gap-4 transition-colors cursor-pointer">
               <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm text-lg font-black text-slate-800 bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                <Code size={20}/>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-900">Global Web3 Hackathon</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-medium text-slate-500">Ethereum Foundation • Online</span>
                </div>
              </div>
              <OpportunityMatchBadge score={85} />
            </div>
            
            {/* Match 4 */}
            <div className="p-4 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-slate-50 flex items-center gap-4 transition-colors cursor-pointer opacity-80">
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm text-lg font-black text-slate-800 bg-slate-900 text-white">
                N
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-900">Software Engineer Co-op</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-medium text-slate-500">Netflix • Los Gatos, CA</span>
                </div>
              </div>
              <OpportunityMatchBadge score={82} />
            </div>
          </div>
        </div>

      </div>

      {/* Footer CTA */}
      <div className="px-8 py-5 border-t border-slate-100 bg-white flex items-center justify-between shrink-0">
        <button className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2">
          Back
        </button>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md shadow-purple-200 transition-all">
          Explore Matches <ArrowRight size={16}/>
        </button>
      </div>
    </div>
  );
}
