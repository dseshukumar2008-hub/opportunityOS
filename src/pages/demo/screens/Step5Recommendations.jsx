import { Sparkles, ArrowRight, BrainCircuit, ExternalLink, Bookmark, Building, Trophy, Code } from 'lucide-react';

export default function Step5Recommendations() {
  return (
    <div className="w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200/60 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
            <BrainCircuit size={20} className="text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">AI Recommendations for You</h2>
            <p className="text-sm font-medium text-slate-500">Handpicked opportunities based on your skills and career trajectory.</p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 bg-[#FAFAFA]">
        
        {/* Left Col: AI Reasoning Panel */}
        <div className="col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-orange-500 to-rose-500 rounded-2xl p-6 shadow-md text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles size={16} className="text-orange-200" />
                <h4 className="text-xs font-bold tracking-widest uppercase text-orange-100">AI Reasoning</h4>
              </div>
              <h3 className="text-xl font-black mb-4 leading-tight">Why we selected these for you</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-sm font-bold">1</div>
                  <p className="text-sm text-orange-50 font-medium">Your Python skills align with quantitative and backend roles.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-sm font-bold">2</div>
                  <p className="text-sm text-orange-50 font-medium">Hackathons are suggested to build the 'Experience' section missing from your resume.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-sm font-bold">3</div>
                  <p className="text-sm text-orange-50 font-medium">Scholarships match your current university and major requirements.</p>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Trending Tags for You</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">#Frontend</span>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">#Remote</span>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">#Web3</span>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">#AI</span>
            </div>
          </div>
        </div>

        {/* Right Col: Opportunity Cards */}
        <div className="col-span-2 space-y-4 overflow-y-auto custom-scrollbar pr-2">
          
          <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm hover:border-orange-200 transition-colors group cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-100 shrink-0">
                  <Building size={24} className="text-orange-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors">Software Engineering Intern</h4>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded">94% Match</span>
                  </div>
                  <p className="text-sm text-slate-500 font-medium mt-0.5">Google • Summer 2026</p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-orange-500 transition-colors">
                <Bookmark size={20} />
              </button>
            </div>
            <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
              Join our engineering team to build products used by billions. We are looking for students with a strong foundation in computer science, algorithms, and frontend development.
            </p>
            <div className="flex items-center justify-between">
               <div className="flex gap-2">
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">React</span>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">TypeScript</span>
              </div>
              <button className="text-xs font-bold text-orange-600 flex items-center gap-1 group-hover:underline">
                Apply <ExternalLink size={14} />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm hover:border-blue-200 transition-colors group cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0">
                  <Code size={24} className="text-blue-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Global Web3 Hackathon</h4>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-black uppercase rounded">85% Match</span>
                  </div>
                  <p className="text-sm text-slate-500 font-medium mt-0.5">Ethereum Foundation • Online</p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-blue-500 transition-colors">
                <Bookmark size={20} />
              </button>
            </div>
            <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
              Build the future of decentralized applications. $50,000 in prizes. Great opportunity to boost your resume and meet top developers.
            </p>
            <div className="flex items-center justify-between">
               <div className="flex gap-2">
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">Solidity</span>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">Node.js</span>
              </div>
              <button className="text-xs font-bold text-blue-600 flex items-center gap-1 group-hover:underline">
                Register <ExternalLink size={14} />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm hover:border-amber-200 transition-colors group cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100 shrink-0">
                  <Trophy size={24} className="text-amber-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors">Women in Tech Scholarship</h4>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-black uppercase rounded">81% Match</span>
                  </div>
                  <p className="text-sm text-slate-500 font-medium mt-0.5">Tech Forward Org • $10,000</p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-amber-500 transition-colors">
                <Bookmark size={20} />
              </button>
            </div>
            <div className="flex items-center justify-between mt-4">
               <div className="flex gap-2">
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">Deadline: Oct 15</span>
              </div>
              <button className="text-xs font-bold text-amber-600 flex items-center gap-1 group-hover:underline">
                Apply <ExternalLink size={14} />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Footer CTA */}
      <div className="px-8 py-5 border-t border-slate-100 bg-white flex items-center justify-between shrink-0">
        <button className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2">
          Back
        </button>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md shadow-orange-200 transition-all">
          View All Opportunities <ArrowRight size={16}/>
        </button>
      </div>
    </div>
  );
}
