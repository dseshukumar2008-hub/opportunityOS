import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line } from 'recharts';
import { CheckCircle2 } from 'lucide-react';

export default function AnalyticsWidget() {
  const radarData = [
    { subject: 'React', A: 80, B: 60, fullMark: 100 },
    { subject: 'DSA', A: 65, B: 85, fullMark: 100 },
    { subject: 'System Design', A: 40, B: 70, fullMark: 100 },
    { subject: 'Node.js', A: 85, B: 50, fullMark: 100 },
    { subject: 'SQL', A: 70, B: 60, fullMark: 100 },
    { subject: 'Communication', A: 90, B: 80, fullMark: 100 },
  ];

  const lineData = Array.from({ length: 15 }, () => ({ value: 30 + Math.random() * 40 })).map((d, i) => ({ ...d, value: d.value + i * 2 }));

  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const activeDays = [true, true, true, true, true, false, false];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full mb-6">
      
      {/* Skills Radar */}
      <div className="card-standard p-6 flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-[16px] font-bold text-slate-900">Skills Radar</h3>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
              <span className="w-2 h-2 rounded-full bg-[#6D5DF6]"></span> You
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
              <span className="w-2 h-2 rounded-full bg-slate-200"></span> Top 25%
            </div>
          </div>
        </div>
        <div className="flex-1 w-full h-[180px] -mt-2 -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
              <PolarGrid stroke="#f1f5f9" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Top 25%" dataKey="B" stroke="#cbd5e1" fill="#f1f5f9" fillOpacity={0.5} />
              <Radar name="You" dataKey="A" stroke="#6D5DF6" fill="#6D5DF6" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Offer Probability */}
      <div className="card-standard p-6 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[16px] font-bold text-slate-900">Offer Probability</h3>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wide">High</span>
        </div>
        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-[36px] font-black text-slate-900 leading-none mb-2">65%</span>
            <span className="text-[12px] font-bold text-emerald-500 mb-1">↑ 15% this month</span>
            <span className="text-[11px] font-semibold text-slate-400">Based on your profile & activity</span>
          </div>
          <div className="w-[100px] h-[60px] -mb-1 -mr-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <Line type="monotone" dataKey="value" stroke="#6D5DF6" strokeWidth={3} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Learning Streak */}
      <div className="card-standard p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[16px] font-bold text-slate-900 flex items-center gap-2">
            Learning Streak <span className="text-orange-500">🔥</span>
          </h3>
        </div>
        <div className="mb-4">
          <span className="text-[32px] font-black text-slate-900 leading-none mr-2">12</span>
          <span className="text-[14px] font-bold text-slate-500">days</span>
          <p className="text-[12px] font-semibold text-slate-400 mt-1">Keep the momentum!</p>
        </div>
        <div className="flex items-center justify-between mt-auto">
          {days.map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400">{day}</span>
              {activeDays[i] ? (
                <CheckCircle2 size={20} className="text-[#00D084]" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-slate-200"></div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
