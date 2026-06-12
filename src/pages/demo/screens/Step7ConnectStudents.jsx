import { Sparkles, ArrowRight, UserPlus, Network, LineChart, MessageSquare, CheckCircle2 } from 'lucide-react';

export default function Step7ConnectStudents() {
  return (
    <div className="w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200/60 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
            <UserPlus size={20} className="text-pink-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Grow your network</h2>
            <p className="text-sm font-medium text-slate-500">Connect with peers, alumni, and recruiters in your field.</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
          <div className="text-sm text-right">
            <div className="font-bold text-slate-900">Network Reach</div>
            <div className="text-xs text-slate-500">Top 15% in your major</div>
          </div>
          <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center border-2 border-pink-100">
             <Network size={20} className="text-pink-600"/>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 bg-[#FAFAFA]">
        
        {/* Left Col: Analytics & AI */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><LineChart size={16} className="text-pink-500"/> Network Growth</h3>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+24%</span>
            </div>
            
            <div className="h-32 flex items-end justify-between gap-3 mb-4">
              {[
                { h: 30, day: 'Mon' },
                { h: 45, day: 'Tue' },
                { h: 60, day: 'Wed' },
                { h: 40, day: 'Thu' },
                { h: 75, day: 'Fri' },
                { h: 90, day: 'Sat' },
                { h: 100, day: 'Sun' }
              ].map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full bg-slate-100 rounded-t-lg relative flex-1">
                    <div className={`absolute bottom-0 left-0 w-full rounded-t-lg transition-all ${i === 6 ? 'bg-pink-500' : 'bg-slate-200 group-hover:bg-pink-300'}`} style={{height: `${item.h}%`}}></div>
                  </div>
                  <span className={`text-[10px] font-bold ${i === 6 ? 'text-pink-600' : 'text-slate-400'}`}>{item.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 shadow-md text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
             <div className="flex items-center gap-2 mb-4 relative z-10">
              <Sparkles size={16} className="text-rose-200" />
              <h4 className="text-xs font-bold tracking-widest uppercase text-rose-100">AI Networking Coach</h4>
            </div>
            <div className="relative z-10 bg-white/10 border border-white/20 p-4 rounded-xl mb-4 backdrop-blur-sm">
              <p className="text-sm font-semibold mb-2">Insight:</p>
              <p className="text-xs leading-relaxed text-pink-50">
                You share 4 technical skills with Sarah Chen, a recruiter at Google. Sending a connection request now will place you in the top 5% of early applicants for the Summer 2026 cohort.
              </p>
            </div>
            <button className="relative z-10 w-full bg-white hover:bg-slate-50 text-pink-700 py-2.5 rounded-xl text-xs font-bold transition-colors shadow-sm">
              Draft Message
            </button>
          </div>
        </div>

        {/* Right Col: Suggested Connections */}
        <div className="col-span-2 bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm flex flex-col">
          <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center justify-between">
            <span>Suggested Connections</span>
            <span className="text-xs font-bold text-pink-600 cursor-pointer hover:underline">View All</span>
          </h3>
          
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            
            {/* Connection 1 */}
            <div className="p-4 rounded-xl border border-slate-100 hover:border-pink-200 hover:bg-pink-50/30 hover:shadow-sm transition-all flex items-center gap-4 group cursor-pointer">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 text-white flex items-center justify-center text-xl font-black shadow-sm shrink-0">
                SC
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">Sarah Chen</h4>
                  <span className="px-2 py-0.5 bg-rose-50 text-rose-700 text-[10px] font-black uppercase rounded border border-rose-100">Recruiter</span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">University Tech Recruiting @ Google</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-semibold text-slate-600 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm"><CheckCircle2 size={10} className="text-emerald-500"/> Shared Interest: AI</span>
                  <span className="text-[10px] font-semibold text-slate-600 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full shadow-sm">Stanford Alumni</span>
                </div>
              </div>
              <button className="w-10 h-10 rounded-full bg-white border border-slate-200 hover:border-pink-300 hover:bg-pink-50 hover:text-pink-600 flex items-center justify-center transition-colors shadow-sm">
                <MessageSquare size={16} className="text-slate-500 hover:text-pink-600 transition-colors" />
              </button>
              <button className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors hidden sm:block shadow-sm">
                Connect
              </button>
            </div>

            {/* Connection 2 */}
            <div className="p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 hover:shadow-sm transition-all flex items-center gap-4 group cursor-pointer">
               <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 text-white flex items-center justify-center text-xl font-black shadow-sm shrink-0">
                DK
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">David Kim</h4>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-black uppercase rounded border border-blue-100">Peer</span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">CS Major @ MIT | Hackathon Winner</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-semibold text-slate-600 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm"><CheckCircle2 size={10} className="text-emerald-500"/> 4 Shared Skills</span>
                </div>
              </div>
              <button className="w-10 h-10 rounded-full bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 flex items-center justify-center transition-colors shadow-sm">
                <MessageSquare size={16} className="text-slate-500 transition-colors" />
              </button>
              <button className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors hidden sm:block shadow-sm">
                Connect
              </button>
            </div>

            {/* Connection 3 */}
            <div className="p-4 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/30 hover:shadow-sm transition-all flex items-center gap-4 group cursor-pointer">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-xl font-black shadow-sm shrink-0">
                EJ
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">Elena James</h4>
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-black uppercase rounded border border-amber-100">Mentor</span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Senior Product Manager @ Stripe</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-semibold text-slate-600 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm"><CheckCircle2 size={10} className="text-emerald-500"/> Willing to mentor</span>
                </div>
              </div>
              <button className="w-10 h-10 rounded-full bg-white border border-slate-200 hover:border-amber-300 hover:bg-amber-50 flex items-center justify-center transition-colors shadow-sm">
                <MessageSquare size={16} className="text-slate-500 transition-colors" />
              </button>
              <button className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors hidden sm:block shadow-sm">
                Connect
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Footer CTA */}
      <div className="px-8 py-5 border-t border-slate-100 bg-white flex items-center justify-between shrink-0">
        <button className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2">
          Skip
        </button>
        <button className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md shadow-pink-200 transition-all">
          Connect Now <ArrowRight size={16}/>
        </button>
      </div>
    </div>
  );
}
