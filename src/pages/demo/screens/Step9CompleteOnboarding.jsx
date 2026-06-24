import { Rocket, CheckCircle2, Award, ArrowRight, User, FileText, Target, Network, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Step9CompleteOnboarding() {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200/60 overflow-hidden flex flex-col relative">
      {/* Decorative Confetti/Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-20 -left-20 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/2 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl -translate-x-1/2"></div>
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Massive Celebration Header */}
        <div className="pt-16 pb-12 flex flex-col items-center justify-center bg-transparent shrink-0 text-center px-8">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-200 mb-6 relative">
            <div className="absolute inset-0 bg-white/20 rounded-3xl border border-white/40"></div>
            <Rocket size={48} className="text-white relative z-10" />
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center border-4 border-white shadow-sm z-20">
              <SparkleIcon />
            </div>
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mb-3">You're ready to win opportunities</h2>
          <p className="text-base font-medium text-slate-500 max-w-lg">
            Your profile is fully optimized, your resume is ATS-ready, and top companies can now discover you.
          </p>
        </div>

        {/* Success Summary Dashboard Grid */}
        <div className="px-8 pb-12 grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
          
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 p-5 shadow-sm flex flex-col items-center text-center group hover:border-emerald-200 transition-colors">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <User size={20} className="text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 mb-1">100%</div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Profile Complete</div>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 p-5 shadow-sm flex flex-col items-center text-center group hover:border-blue-200 transition-colors">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FileText size={20} className="text-blue-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 mb-1">88/100</div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">ATS Score</div>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 p-5 shadow-sm flex flex-col items-center text-center group hover:border-purple-200 transition-colors">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Target size={20} className="text-purple-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 mb-1">94%</div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Top Match Rate</div>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 p-5 shadow-sm flex flex-col items-center text-center group hover:border-amber-200 transition-colors">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Award size={20} className="text-amber-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 mb-1">Tier 1</div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Readiness</div>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 p-5 shadow-sm flex flex-col items-center justify-center col-span-2 lg:col-span-4 mt-2">
            <div className="w-full max-w-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                  <CheckCircle2 size={20} className="text-indigo-500" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-slate-900">All Systems Go</div>
                  <div className="text-xs text-slate-500">You have 12 applications ready to be submitted.</div>
                </div>
              </div>
              <div className="flex gap-4 text-xs font-bold text-slate-400">
                <span className="flex items-center gap-1"><Network size={14}/> Network Setup</span>
                <span className="flex items-center gap-1"><Users size={14}/> Team Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Massive Footer CTA */}
        <div className="px-8 py-8 border-t border-slate-100 bg-white/50 backdrop-blur-xl flex flex-col items-center justify-center shrink-0">
          <button 
            onClick={() => navigate('/signup')}
            className="w-full max-w-sm bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-2xl text-base font-black flex items-center justify-center gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all transform hover:-translate-y-0.5"
          >
            Launch OpportunityOS <ArrowRight size={20}/>
          </button>
          <p className="text-xs font-bold text-slate-400 mt-4 uppercase tracking-widest">Welcome to the future of your career</p>
        </div>
      </div>
    </div>
  );
}

function SparkleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="white"/>
    </svg>
  );
}
