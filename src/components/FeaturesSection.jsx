import { ArrowRight, Check, AlertTriangle, Sparkles, Bot, Wand2 } from 'lucide-react';

export default function FeaturesSection() {
  const showcases = [
    {
      title: 'Analyze Resume',
      desc: 'Get instant feedback on your resume. Optimize for ATS tracking with precise keyword suggestions and action verb improvements.',
      mockup: (
        <div className="absolute inset-0 p-8 flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50/50">
          <div className="bg-white p-5 rounded-xl shadow-lg shadow-emerald-900/5 border border-emerald-100 w-full max-w-sm transform group-hover:scale-105 group-hover:-rotate-1 transition-transform duration-500">
            <div className="flex items-center justify-between mb-4">
              <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <FileTextMockupIcon /> Resume Analysis
              </div>
              <div className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">92% ATS Match</div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 mt-0.5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0"><Check size={10} strokeWidth={3} /></div>
                <div className="text-[11px] text-slate-600 font-medium">Strong action verbs used in the experience section.</div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 mt-0.5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0"><AlertTriangle size={10} strokeWidth={2.5} /></div>
                <div className="text-[11px] text-slate-600 font-medium">Missing keywords: "React", "Node.js". Consider adding these to your skills.</div>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-emerald-500 w-[92%] rounded-full relative">
                  <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'AI Career Coach',
      desc: 'Receive personalized daily guidance, skill gap analysis, and tailored roadmaps to land your dream role faster.',
      mockup: (
        <div className="absolute inset-0 p-8 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50/50">
          <div className="bg-white rounded-xl shadow-lg shadow-indigo-900/5 border border-indigo-100 w-full max-w-sm flex flex-col overflow-hidden transform group-hover:-translate-y-2 transition-transform duration-500">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-3.5 flex items-center gap-3 shadow-inner">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm"><Sparkles size={16} /></div>
              <div>
                <div className="text-white text-xs font-bold leading-none">Career Coach</div>
                <div className="text-indigo-200 text-[9px] mt-1">Online</div>
              </div>
            </div>
            <div className="p-4 space-y-4 bg-slate-50/50">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mt-1 shadow-sm"><Bot size={12} /></div>
                <div className="bg-white border border-slate-100 shadow-sm p-3 rounded-xl text-[11px] text-slate-700 rounded-tl-none font-medium leading-relaxed">
                  Based on your goal to become a Frontend Engineer, I recommend completing the <strong className="text-indigo-700">Meta React Native</strong> certificate to close your mobile dev gap.
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <div className="bg-indigo-600 shadow-sm p-2.5 rounded-xl text-[11px] text-white font-medium rounded-tr-none hover:bg-indigo-700 cursor-pointer transition-colors">
                  Show me the syllabus
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'AI Recruiter',
      desc: 'For employers: instantly rank candidates based on precise match scores analyzing skills, experience, and project quality.',
      mockup: (
        <div className="absolute inset-0 p-8 flex items-center justify-center bg-gradient-to-br from-purple-50 to-fuchsia-50/50">
          <div className="bg-white p-5 rounded-xl shadow-lg shadow-purple-900/5 border border-purple-100 w-full max-w-sm transform group-hover:scale-105 group-hover:rotate-1 transition-transform duration-500">
            <div className="font-bold text-slate-800 text-sm mb-4 flex items-center justify-between">
              Top Candidates
              <span className="text-[10px] text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">SWE Intern</span>
            </div>
            <div className="space-y-2.5">
              {[
                { name: 'Sarah Jenkins', score: 98, uni: 'Stanford University', avatar: '10', color: 'text-emerald-600', border: 'border-emerald-500' },
                { name: 'Michael Chen', score: 94, uni: 'MIT', avatar: '11', color: 'text-emerald-500', border: 'border-emerald-400' },
                { name: 'Jessica Patel', score: 89, uni: 'UC Berkeley', avatar: '12', color: 'text-amber-500', border: 'border-amber-400' }
              ].map((cand, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-lg transition-colors border border-slate-100 shadow-sm bg-white cursor-pointer group/item">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm group-hover/item:border-purple-100 transition-colors">
                       <img src={`https://i.pravatar.cc/100?img=${cand.avatar}`} alt="avatar" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">{cand.name}</div>
                      <div className="text-[10px] text-slate-500">{cand.uni}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full border-2 ${cand.border} ${cand.color} flex items-center justify-center text-[11px] font-bold bg-white`}>
                      {cand.score}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'OpportunityOS Copilot',
      desc: 'Navigate the platform via a natural language conversation interface. Ask questions, discover opportunities, and execute actions instantly.',
      mockup: (
        <div className="absolute inset-0 p-8 flex items-center justify-center bg-gradient-to-br from-rose-50 to-orange-50/50">
          <div className="bg-white p-4.5 rounded-xl shadow-lg shadow-rose-900/5 border border-rose-100 w-full max-w-sm flex flex-col h-[220px] transform group-hover:-translate-y-1 group-hover:shadow-xl transition-all duration-500">
            <div className="flex-1 overflow-hidden relative">
              <div className="absolute bottom-0 w-full space-y-3 pb-3">
                <div className="flex gap-2.5">
                   <div className="w-6 h-6 rounded bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 shadow-sm"><Wand2 size={12}/></div>
                   <div className="bg-white border border-slate-100 shadow-sm p-2.5 text-[11px] text-slate-700 rounded-xl rounded-tl-none font-medium">
                     I found 3 new hackathons matching your Python skills. Should I draft applications for them?
                   </div>
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 bg-white">
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                <div className="whitespace-nowrap px-3 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] text-slate-700 font-medium hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 cursor-pointer transition-colors shadow-sm">Yes, draft them</div>
                <div className="whitespace-nowrap px-3 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] text-slate-700 font-medium hover:bg-slate-50 cursor-pointer transition-colors shadow-sm">Show me the list</div>
              </div>
              <div className="relative mt-1">
                <input type="text" placeholder="Ask Copilot..." className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3.5 text-xs outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all placeholder:text-slate-400" disabled />
                <div className="absolute right-3 top-2.5 text-rose-500 bg-white p-0.5 rounded"><Sparkles size={14}/></div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="features" className="w-full max-w-[1400px] mx-auto px-6 py-24 flex flex-col items-center">
      <div className="text-cent er mb-20 max-w-2xl">
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight">Everything you need to succeed, supercharged by AI.</h2>
        <p className="text-lg text-slate-600 leading-relaxed">Experience a workspace that doesn't just store your data, but actively works to accelerate your career.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
        {showcases.map((feature, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-500 flex flex-col group cursor-pointer">
            {/* Mockup Area */}
            <div className="h-72 border-b border-slate-100 flex items-center justify-center relative overflow-hidden bg-slate-50">
               {feature.mockup}
            </div>
            {/* Text Area */}
            <div className="p-8">
               <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{feature.title}</h3>
               <p className="text-slate-600 text-sm mb-6 leading-relaxed">{feature.desc}</p>
               <button className="text-indigo-600 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all bg-indigo-50 px-4 py-2 rounded-lg w-max hover:bg-indigo-100">
                 Learn More <ArrowRight size={16} />
               </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FileTextMockupIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <line x1="10" y1="9" x2="8" y2="9"></line>
    </svg>
  )
}
