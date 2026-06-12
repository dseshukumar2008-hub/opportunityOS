import { useApplications } from '../../contexts/ApplicationContext';
import { ArrowDown } from 'lucide-react';

export default function ApplicationFunnelWidget() {
  const { applications } = useApplications();

  const totalApplications = (applications || []).length;
  const interviewCount = (applications || []).filter(a => a.status === 'Interview').length;
  const offerCount = (applications || []).filter(a => a.status === 'Offer').length;

  const appliedCount = totalApplications;
  const interviewRate = appliedCount > 0 ? Math.round((interviewCount / appliedCount) * 100) : 0;
  const offerRate = appliedCount > 0 ? Math.round((offerCount / appliedCount) * 100) : 0;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col min-h-[320px] w-full">
      <div className="mb-6">
        <h3 className="text-[16px] font-bold text-slate-800">Application Funnel</h3>
      </div>
      
      <div className="flex-1 flex w-full">
        {/* Left Side: Boxes */}
        <div className="flex flex-col items-center w-1/2 shrink-0">
          {/* APPLIED Box */}
          <div className="w-full h-20 bg-white border border-indigo-200 rounded-[16px] flex flex-col items-center justify-center shadow-sm">
            <span className="text-[11px] font-extrabold text-[#6C4CF1] tracking-wider uppercase mb-1">Applied</span>
            <span className="text-[28px] font-extrabold text-slate-900 leading-none">{appliedCount}</span>
          </div>

          <div className="h-10 flex items-center justify-center">
            <ArrowDown className="text-[#6C4CF1]" size={20} strokeWidth={2.5} />
          </div>

          {/* INTERVIEW Box */}
          <div className="w-[85%] h-20 bg-white border border-indigo-200 rounded-[16px] flex flex-col items-center justify-center shadow-sm">
            <span className="text-[11px] font-extrabold text-[#6C4CF1] tracking-wider uppercase mb-1">Interview</span>
            <div className="flex items-baseline gap-2 leading-none">
              <span className="text-[28px] font-extrabold text-slate-900">{interviewCount}</span>
              <span className="text-[15px] font-bold text-[#6C4CF1]">{interviewRate}%</span>
            </div>
          </div>

          <div className="h-10 flex items-center justify-center">
            <ArrowDown className="text-[#6C4CF1]" size={20} strokeWidth={2.5} />
          </div>

          {/* OFFER Box */}
          <div className="w-[70%] h-20 bg-white border border-indigo-200 rounded-[16px] flex flex-col items-center justify-center shadow-sm">
            <span className="text-[11px] font-extrabold text-[#6C4CF1] tracking-wider uppercase mb-1">Offer</span>
            <div className="flex items-baseline gap-2 leading-none">
              <span className="text-[28px] font-extrabold text-slate-900">{offerCount}</span>
              <span className="text-[15px] font-bold text-[#6C4CF1]">{offerRate}%</span>
            </div>
          </div>
        </div>

        {/* Right Side: Conversion Info */}
        <div className="flex flex-col flex-1 pl-6 pt-[60px] pb-[60px] justify-between h-[280px]">
          {/* Interview Conversion */}
          <div className="flex flex-col items-center text-center -mt-4">
            <span className="text-[11px] font-medium text-slate-500 mb-1">Interview Conversion Rate</span>
            <span className="text-[22px] font-extrabold text-slate-900 leading-none mb-1">{interviewRate}%</span>
            <span className="text-[10px] font-medium text-slate-400">({interviewCount} / {appliedCount} applications)</span>
          </div>

          {/* Offer Conversion */}
          <div className="flex flex-col items-center text-center pb-4">
            <span className="text-[11px] font-medium text-slate-500 mb-1">Offer Conversion Rate</span>
            <span className="text-[22px] font-extrabold text-slate-900 leading-none mb-1">{offerRate}%</span>
            <span className="text-[10px] font-medium text-slate-400">({offerCount} / {appliedCount} applications)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
