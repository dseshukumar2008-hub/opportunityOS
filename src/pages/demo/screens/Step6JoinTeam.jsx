import { Sparkles, ArrowRight, Users, UserPlus, Code, Database, Layout, PenTool, BrainCircuit } from 'lucide-react';

export default function Step6JoinTeam() {
  return (
    <div className="w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200/60 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
            <Users size={20} className="text-teal-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Find your ideal team</h2>
            <p className="text-sm font-medium text-slate-500">Discover teams looking for your exact skill set for upcoming hackathons.</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
          <div className="text-sm text-right">
            <div className="font-bold text-slate-900">Team Compatibility</div>
            <div className="text-xs text-slate-500">Based on shared goals</div>
          </div>
          <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center border-2 border-teal-100">
             <span className="text-sm font-black text-teal-600">95%</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 bg-[#FAFAFA] overflow-y-auto custom-scrollbar">
        
        {/* Left Col: Suggested Team details */}
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm flex flex-col sm:flex-row gap-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shrink-0 shadow-inner">
              <Code size={40} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-slate-900">Hackathon Heroes</h3>
                <span className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-full">Top Match</span>
              </div>
              <p className="text-sm text-slate-600 mb-4">Building a decentralized AI application for the Global Web3 Hackathon. Looking for a frontend specialist to complete our full-stack roster.</p>
              
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold">AL</div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-pink-500 text-white flex items-center justify-center text-[10px] font-bold">MR</div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold">JD</div>
                </div>
                <span className="text-xs font-bold text-slate-500">3/4 Members • Need Frontend</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 mb-4">Current Team Skills</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700"><Database size={14}/> Backend</div>
                    <div className="text-[10px] font-bold text-slate-400">Excellent</div>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full"><div className="w-[95%] h-full bg-slate-800 rounded-full"></div></div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700"><BrainCircuit size={14}/> ML/AI</div>
                    <div className="text-[10px] font-bold text-slate-400">Strong</div>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full"><div className="w-[85%] h-full bg-slate-800 rounded-full"></div></div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700"><PenTool size={14}/> UI/UX Design</div>
                    <div className="text-[10px] font-bold text-slate-400">Good</div>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full"><div className="w-[60%] h-full bg-slate-500 rounded-full"></div></div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-teal-600"><Layout size={14}/> Frontend</div>
                    <div className="text-[10px] font-bold text-teal-500 uppercase">Critical Need</div>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full"><div className="w-[10%] h-full bg-teal-500 rounded-full"></div></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm flex flex-col items-center justify-center text-center">
              <h4 className="text-sm font-bold text-slate-900 mb-2">The Missing Piece</h4>
              <p className="text-xs text-slate-500 mb-6">This team desperately needs your React skills to finish their dashboard.</p>
              <div className="w-20 h-20 rounded-full border-[3px] border-dashed border-teal-300 bg-teal-50 flex items-center justify-center relative animate-pulse">
                <UserPlus size={28} className="text-teal-600" />
                <div className="absolute -top-3 -right-3 bg-white rounded-full p-1 shadow-sm">
                  <Sparkles size={18} className="text-amber-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: AI & Other Teams */}
        <div className="col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl p-6 shadow-md text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <Sparkles size={16} className="text-emerald-100" />
              <h4 className="text-xs font-bold tracking-widest uppercase text-emerald-50">AI Team Matcher</h4>
            </div>
            <div className="relative z-10 bg-white/10 border border-white/20 p-4 rounded-xl mb-4 backdrop-blur-sm">
               <div className="flex items-center justify-between mb-2 border-b border-white/20 pb-2">
                 <span className="text-xs font-bold">Synergy Rating</span>
                 <span className="text-xs font-black bg-white text-teal-700 px-2 rounded">95%</span>
               </div>
               <p className="text-xs leading-relaxed font-medium">
                "Hackathon Heroes" lacks frontend expertise. Your profile shows 3+ React projects. Joining them heavily increases their chance of winning and complements their strong ML backend.
               </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 mb-4">Other Open Teams</h4>
            <div className="space-y-3">
              <div className="p-3 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs">QC</div>
                   <div>
                    <h5 className="text-xs font-bold text-slate-900">Quantum Coders</h5>
                    <p className="text-[10px] text-slate-500">Needs UX Designer</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-400">82%</span>
              </div>
              <div className="p-3 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-black text-xs">FW</div>
                   <div>
                    <h5 className="text-xs font-bold text-slate-900">FinTech Wizards</h5>
                    <p className="text-[10px] text-slate-500">Needs Full Stack</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-400">78%</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Footer CTA */}
      <div className="px-8 py-5 border-t border-slate-100 bg-white flex items-center justify-between shrink-0">
        <button className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2">
          Keep Browsing
        </button>
        <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md shadow-teal-200 transition-all">
          Join Team <ArrowRight size={16}/>
        </button>
      </div>
    </div>
  );
}
