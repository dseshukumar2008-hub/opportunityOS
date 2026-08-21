import { CheckCircle2, AlertCircle, Sparkles} from 'lucide-react';

function CircularScore({ score }) {
  const r = 36;
  const strokeDasharray = 2 * Math.PI * r;
  const strokeDashoffset = strokeDasharray - (strokeDasharray * score) / 100;
  
  let colorClass = 'text-[#F97316]';
  if (score >= 80) colorClass = 'text-[#10B981]';
  else if (score >= 65) colorClass = 'text-[#F59E0B]';

  return (
    <div className="relative w-[96px] h-[96px] flex items-center justify-center shrink-0">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={r} fill="none" stroke="#F1F5F9" strokeWidth="8" />
        <circle 
          cx="48" 
          cy="48" 
          r={r} 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="8" 
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className={`${colorClass} transition-all duration-1000 ease-out`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-[28px] font-black tracking-tight text-[#111827] leading-none">{score}</span>
        <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mt-0.5">/ 100</span>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, bg }) {
  return (
    <div className="bg-[#FAFBFF] border border-[#E5E7EB] rounded-xl p-4 flex flex-col items-center text-center justify-center h-full shadow-sm">
      <div className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center mb-3 shadow-sm`}>
        <Icon size={18} strokeWidth={2.5} />
      </div>
      <span className="text-[22px] font-black text-[#111827] mb-1 leading-none">{value}</span>
      <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">{label}</span>
    </div>
  );
}

export default function Step3AIResumeAnalysis() {
  const score = 88;
  const extractedSkills = ['React', 'Node.js', 'Python', 'AWS', 'Docker'];
  const missingKeywords = ['Kubernetes', 'GraphQL'];
// eslint-disable-next-line no-unused-vars
  const suggestedRole = 'Full Stack Developer';
  const summary = 'Your resume demonstrates strong frontend and backend experience. To optimize for senior roles, consider adding metrics to your achievements.';
// eslint-disable-next-line no-unused-vars
  const strengths = ['Clear impact statements', 'Strong technical skills section', 'Consistent formatting'];
// eslint-disable-next-line no-unused-vars
  const areasForGrowth = ['Missing cloud infrastructure keywords', 'Action verbs could be stronger'];
// eslint-disable-next-line no-unused-vars
  const qualityRating = 'Excellent';

  return (
    <div className="space-y-6 max-w-5xl mx-auto w-full p-4 lg:p-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Sparkles className="text-indigo-500" size={24} />
          AI Resume Analysis
        </h2>
      </div>

      <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#E5E7EB] p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="flex flex-col shrink-0 w-full md:w-[320px] md:border-r border-[#E5E7EB] md:pr-8">
          <div className="flex items-center gap-6">
            <CircularScore score={score} />
            <div className="flex flex-col justify-center">
              <h3 className="text-[18px] font-extrabold text-[#111827] leading-tight mb-1">ATS Compatibility</h3>
              <p className="text-[14px] font-semibold text-[#64748B] mb-3">{score}% Match</p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border bg-[#FAFBFF] border-[#E5E7EB] self-start">
                <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
                <span className="text-[12px] font-bold text-[#334155] tracking-wide uppercase">Excellent</span>
              </div>
            </div>
          </div>
          <p className="text-[13px] text-[#64748B] font-medium mt-6 leading-relaxed">
            Based on resume structure, keywords and content quality
          </p>
        </div>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full">
           <StatCard icon={CheckCircle2} label="Skills" value={extractedSkills.length} color="text-[#10B981]" bg="bg-[#ECFDF5]" />
           <StatCard icon={AlertCircle} label="Missing" value={missingKeywords.length} color="text-[#F97316]" bg="bg-[#FFF7ED]" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-blue-50/50 rounded-2xl shadow-sm border border-indigo-100 p-6 md:p-8">
         <div className="flex items-center gap-2 mb-4">
           <Sparkles size={20} className="text-indigo-600" />
           <h3 className="text-base font-bold text-indigo-900">AI Profile Summary</h3>
         </div>
         <div className="bg-white/50 p-5 rounded-xl border border-white/60">
           <p className="text-sm font-semibold text-indigo-900/90 leading-relaxed">{summary}</p>
         </div>
      </div>
    </div>
  );
}
