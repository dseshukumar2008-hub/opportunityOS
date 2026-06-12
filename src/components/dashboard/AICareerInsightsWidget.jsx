import { Sparkles } from 'lucide-react';

export default function AICareerInsightsWidget() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-[16px] font-bold text-slate-900 tracking-tight">AI Career Insights</h2>
        <span className="bg-indigo-50 text-[#4F46E5] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
          New
        </span>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6 relative overflow-hidden h-[120px]">
        <div className="pr-16 relative z-10">
          <p className="text-[14px] font-medium text-slate-600 leading-relaxed max-w-[80%]">
            Complete your profile to get personalized recommendations.
          </p>
        </div>

        {/* Abstract Illustration */}
        <div className="absolute right-[-20px] bottom-[-20px] w-32 h-32 bg-[#EAE8FF] rounded-full flex items-center justify-center opacity-80">
          <Sparkles size={40} className="text-[#4F46E5] transform -translate-x-3 -translate-y-3" strokeWidth={1.5} />
        </div>
        <div className="absolute right-4 bottom-14 w-2 h-2 rounded-full bg-[#4F46E5] opacity-40"></div>
        <div className="absolute right-16 bottom-6 w-3 h-3 rounded-full bg-[#4F46E5] opacity-20"></div>
      </div>
    </div>
  );
}


