import { Sparkles, ArrowRight, Upload, Trophy, FileText, LayoutList, Search, FileSignature, Target, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Step3AnalyzeResume() {
  return (
    <div className="w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200/60 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="pt-10 pb-6 flex flex-col items-center justify-center bg-white shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={24} className="text-indigo-500" />
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Let's analyze your resume</h2>
        </div>
        <p className="text-sm font-medium text-slate-500">Our AI will review your resume and provide actionable insights.</p>
      </div>

      {/* Main Grid */}
      <div className="px-8 pb-8 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white">
        
        {/* Top Left: Overall Score */}
        <div className="bg-white rounded-2xl border border-slate-200/60 p-8 shadow-sm flex items-center gap-8">
          <div className="relative w-32 h-32 shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f1f5f9" strokeWidth="4" />
              <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4" strokeDasharray="88 12" strokeDashoffset="0" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-slate-900 tracking-tighter">88</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">ATS Score</span>
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full mb-3 uppercase tracking-wide">
              <Trophy size={14} /> Excellent
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Your resume is highly optimized!</h3>
            <p className="text-sm text-slate-500 mb-4 leading-relaxed">
              Great job! Your resume is well-structured and meets most ATS requirements.
            </p>
            <button className="text-indigo-600 text-sm font-bold flex items-center gap-1 hover:text-indigo-700 transition-colors">
              View detailed analysis <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Top Right: Score Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200/60 p-8 shadow-sm flex flex-col justify-center">
          <h3 className="text-sm font-bold text-slate-900 mb-5">Score Breakdown</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded bg-indigo-50 flex items-center justify-center shrink-0"><FileText size={12} className="text-indigo-500" /></div>
              <span className="text-xs font-bold text-slate-600 w-20">Formatting</span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{width: '92%'}}></div>
              </div>
              <span className="text-xs font-bold text-slate-900 w-10 text-right">92<span className="text-slate-400">/100</span></span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded bg-indigo-50 flex items-center justify-center shrink-0"><FileSignature size={12} className="text-indigo-500" /></div>
              <span className="text-xs font-bold text-slate-600 w-20">Content</span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{width: '85%'}}></div>
              </div>
              <span className="text-xs font-bold text-slate-900 w-10 text-right">85<span className="text-slate-400">/100</span></span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded bg-indigo-50 flex items-center justify-center shrink-0"><Search size={12} className="text-indigo-500" /></div>
              <span className="text-xs font-bold text-slate-600 w-20">Keywords</span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{width: '90%'}}></div>
              </div>
              <span className="text-xs font-bold text-slate-900 w-10 text-right">90<span className="text-slate-400">/100</span></span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded bg-indigo-50 flex items-center justify-center shrink-0"><LayoutList size={12} className="text-indigo-500" /></div>
              <span className="text-xs font-bold text-slate-600 w-20">Structure</span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{width: '88%'}}></div>
              </div>
              <span className="text-xs font-bold text-slate-900 w-10 text-right">88<span className="text-slate-400">/100</span></span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded bg-indigo-50 flex items-center justify-center shrink-0"><Target size={12} className="text-indigo-500" /></div>
              <span className="text-xs font-bold text-slate-600 w-20">Relevance</span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{width: '84%'}}></div>
              </div>
              <span className="text-xs font-bold text-slate-900 w-10 text-right">84<span className="text-slate-400">/100</span></span>
            </div>
          </div>
        </div>

        {/* Bottom Left: Strengths & Areas */}
        <div className="bg-white rounded-2xl border border-slate-200/60 p-8 shadow-sm relative overflow-hidden">
          <Target size={120} className="absolute -bottom-10 -right-10 text-slate-50 opacity-50" strokeWidth={1} />
          <div className="relative z-10">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Strengths</h3>
            <div className="space-y-2 mb-8">
              <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /><span className="text-xs font-medium text-slate-600">Clear and professional summary</span></div>
              <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /><span className="text-xs font-medium text-slate-600">Strong use of action verbs</span></div>
              <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /><span className="text-xs font-medium text-slate-600">Good keyword alignment</span></div>
              <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /><span className="text-xs font-medium text-slate-600">Well-structured experience section</span></div>
            </div>
            
            <h3 className="text-sm font-bold text-slate-900 mb-4">Areas to Improve</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2"><AlertCircle size={16} className="text-amber-500" /><span className="text-xs font-medium text-slate-600">Add more quantifiable achievements</span></div>
              <div className="flex items-center gap-2"><AlertCircle size={16} className="text-amber-500" /><span className="text-xs font-medium text-slate-600">Include more relevant keywords</span></div>
              <div className="flex items-center gap-2"><AlertCircle size={16} className="text-amber-500" /><span className="text-xs font-medium text-slate-600">Improve skills section visibility</span></div>
              <div className="flex items-center gap-2"><AlertCircle size={16} className="text-amber-500" /><span className="text-xs font-medium text-slate-600">Add links to portfolio or projects</span></div>
            </div>
          </div>
        </div>

        {/* Bottom Right: Keywords & Tip */}
        <div className="bg-white rounded-2xl border border-slate-200/60 p-8 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Top Keywords</h3>
            <span className="text-xs font-bold text-indigo-600 cursor-pointer">View all</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-auto">
            {['JavaScript', 'React', 'Node.js', 'TypeScript'].map(k => (
              <span key={k} className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">{k}</span>
            ))}
            {['Teamwork', 'Problem Solving', 'Git', 'SQL'].map(k => (
              <span key={k} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">{k}</span>
            ))}
            {['Communication', 'Leadership', 'REST API'].map(k => (
              <span key={k} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full">{k}</span>
            ))}
          </div>

          <div className="mt-8 bg-[#F8FAFC] rounded-xl p-4 border border-slate-100 flex items-start gap-3">
            <Sparkles size={18} className="text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-slate-900 mb-1">Tip</div>
              <div className="text-xs text-slate-600 leading-relaxed">
                Add more keywords from the job description to increase your match score.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Action Bar */}
      <div className="px-8 py-5 mx-8 mb-8 rounded-2xl bg-[#F8FAFC] border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
            <FileText size={20} className="text-indigo-600" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Want to improve your score?</h4>
            <p className="text-xs text-slate-500">Upload a new version of your resume and get updated feedback.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-indigo-600 rounded-xl text-sm font-bold transition-colors">
            <Upload size={16} /> Upload New Resume
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-[#6C4CF1] hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-200 transition-colors">
            Proceed to Next Step <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
