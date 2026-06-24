import { Sun, CheckSquare, Smile, Users, CheckCircle } from 'lucide-react';

export default function StatisticsSection() {
  return (
    <section className="w-full max-w-[1400px] mx-auto px-6 py-12 flex justify-between gap-4 overflow-x-auto">
      <div className="bg-white border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-2xl p-6 flex items-center gap-4 min-w-[220px] flex-1">
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
          <Sun size={24} />
        </div>
        <div>
          <h4 className="text-2xl font-bold text-slate-900 leading-tight">10K+</h4>
          <p className="text-xs text-slate-500 font-medium">Opportunities Listed</p>
        </div>
      </div>

      <div className="bg-white border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-2xl p-6 flex items-center gap-4 min-w-[220px] flex-1">
        <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
          <CheckSquare size={24} />
        </div>
        <div>
          <h4 className="text-2xl font-bold text-slate-900 leading-tight">25K+</h4>
          <p className="text-xs text-slate-500 font-medium">Applications Tracked</p>
        </div>
      </div>

      <div className="bg-white border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-2xl p-6 flex items-center gap-4 min-w-[220px] flex-1">
        <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
          <Smile size={24} />
        </div>
        <div>
          <h4 className="text-2xl font-bold text-slate-900 leading-tight">15K+</h4>
          <p className="text-xs text-slate-500 font-medium">Students Helped</p>
        </div>
      </div>

      <div className="bg-white border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-2xl p-6 flex items-center gap-4 min-w-[220px] flex-1">
        <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
          <Users size={24} />
        </div>
        <div>
          <h4 className="text-2xl font-bold text-slate-900 leading-tight">2K+</h4>
          <p className="text-xs text-slate-500 font-medium">Teams Formed</p>
        </div>
      </div>  

      <div className="bg-white border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-2xl p-6 flex items-center gap-4 min-w-[220px] flex-1">
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
          <CheckCircle size={24} />
        </div>
        <div>
          <h4 className="text-2xl font-bold text-slate-900   leading-tight">98%</h4>
          <p className="text-xs text-slate-500 font-medium">Satisfaction Rate</p>
        </div>
      </div>
    </section>
  );
}
