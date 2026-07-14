import { Link } from 'react-router-dom';
import { FileText, AlertTriangle, Zap, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useResumeInsights } from '../../hooks/useResumeInsights';

export default function ResumeInsightsWidget() {
  const { isLoading, hasInsights, atsScore, topWeakness } = useResumeInsights();

  if (isLoading) {
    return (
      <div className="card-standard p-6 h-full animate-pulse flex flex-col gap-4">
        <div className="h-5 w-40 bg-slate-200 rounded"></div>
        <div className="w-20 h-20 rounded-full bg-slate-200 mx-auto"></div>
        <div className="h-3 w-full bg-slate-100 rounded"></div>
        <div className="h-3 w-3/4 bg-slate-100 rounded"></div>
      </div>
    );
  }

  // No Resume Uploaded State
  if (!hasInsights) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 h-full flex flex-col shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[16px] font-black text-slate-900">Resume Insights</h3>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-4">
            <FileText size={24} className="text-indigo-500" />
          </div>
          <p className="text-[14px] font-bold text-slate-700 mb-2">No Resume Uploaded</p>
          <p className="text-[12px] font-medium text-slate-500 mb-6 max-w-[200px]">
            Upload your resume to get ATS score and personalized improvement tips.
          </p>
          <Link
            to="/resume-review"
            className="inline-flex items-center gap-2 bg-[#6C4CF1] text-white font-bold text-[13px] px-5 py-2.5 rounded-xl transition-all hover:bg-indigo-700 shadow-md shadow-indigo-300"
          >
            Upload Resume <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  let scoreColor = 'text-red-500';
  let scoreBg = 'bg-red-50';
  let scoreStroke = '#EF4444';
  if (atsScore >= 80) { scoreColor = 'text-emerald-500'; scoreBg = 'bg-emerald-50'; scoreStroke = '#10B981'; }
  else if (atsScore >= 60) { scoreColor = 'text-amber-500'; scoreBg = 'bg-amber-50'; scoreStroke = '#F59E0B'; }

  const strokeDash = `${atsScore} 100`;

  const tips = topWeakness
    ? [{ text: topWeakness, type: 'weakness' }]
    : [{ text: 'High ATS compatibility — looking great!', type: 'good' }];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 h-full flex flex-col shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[16px] font-black text-slate-900">Resume Insights</h3>
        <Link to="/resume-review" className="text-[12px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
          Full Report →
        </Link>
      </div>

      {/* Score Ring */}
      <div className="flex items-center gap-5 mb-5">
        <div className="relative w-[80px] h-[80px] shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#F1F5F9" strokeWidth="3.5" />
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={scoreStroke} strokeWidth="3.5" strokeDasharray={strokeDash} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-[22px] font-black leading-none ${scoreColor}`}>{atsScore}</span>
            <span className="text-[9px] font-bold text-slate-400">ATS</span>
          </div>
        </div>

        <div className="flex-1">
          <p className="text-[13px] font-black text-slate-900 mb-0.5">ATS Score</p>
          <p className="text-[11px] font-medium text-slate-500">
            {atsScore >= 80 ? 'Your resume is highly optimized!' : atsScore >= 60 ? 'Good score, room to improve.' : 'Consider optimizing your resume.'}
          </p>
        </div>
      </div>

      {/* Issues */}
      <div className="flex flex-col gap-2 mb-5">
        {tips.map((tip, i) => (
          <div key={i} className={`flex items-start gap-2 p-3 rounded-xl text-[12px] font-medium ${tip.type === 'weakness' ? 'bg-amber-50 border border-amber-100 text-amber-800' : 'bg-emerald-50 border border-emerald-100 text-emerald-800'}`}>
            {tip.type === 'weakness'
              ? <AlertTriangle size={13} className="text-amber-500 mt-0.5 shrink-0" />
              : <CheckCircle2 size={13} className="text-emerald-500 mt-0.5 shrink-0" />}
            {tip.text}
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-auto flex">
        <Link to="/resume-review" className="w-full flex items-center justify-center gap-1.5 bg-[#6C4CF1] hover:bg-indigo-700 text-white font-bold text-[13px] px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-300">
          <Zap size={14} /> View Full Resume Analysis
        </Link>
      </div>
    </div>
  );
}
