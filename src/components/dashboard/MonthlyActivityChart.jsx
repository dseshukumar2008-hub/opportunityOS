import { useApplications } from '../../contexts/ApplicationContext';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function MonthlyActivityChart() {
  const { applications } = useApplications();

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthCounts = Array(12).fill(0);

  let hasData = false;

  applications.forEach(app => {
    if (app.appliedDate) {
      const d = new Date(app.appliedDate);
      if (!isNaN(d)) {
        monthCounts[d.getMonth()] += 1;
        hasData = true;
      }
    }
  });

  const data = months.map((month, index) => ({
    name: month,
    count: monthCounts[index]
  }));

  if (!hasData) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center min-h-[320px] w-full h-fit">
        <h3 className="text-[16px] font-bold text-slate-800 mb-1">Monthly Application Activity</h3>
        <p className="text-[13px] text-slate-500 font-medium mb-6">Track how many opportunities you applied for each month.</p>
        <p className="text-slate-400 text-sm">No application data available yet</p>
      </div>
    );
  }

  const customTooltipRenderer = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-100 p-3 rounded-xl shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)]">
          <p className="text-sm font-bold text-slate-800 mb-1">{label}</p>
          <p className="text-sm text-[#6C4CF1] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6C4CF1]"></span>
            <span className="font-semibold">Applications:</span>
            {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col min-h-[320px] w-full h-full">
      <div className="mb-6">
        <h3 className="text-[16px] font-bold text-slate-800 mb-1">Monthly Application Activity</h3>
        <p className="text-[13px] text-slate-500 font-medium">Track how many opportunities you applied for each month.</p>
      </div>
      <div className="flex-1 w-full min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
              allowDecimals={false}
            />
            <Tooltip 
              content={customTooltipRenderer} 
              cursor={{ fill: 'transparent' }} 
            />
            <Bar 
              dataKey="count" 
              fill="#F3F0FF" 
              barSize={16} 
              radius={[4, 4, 0, 0]} 
              animationDuration={1500}
            />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="#6C4CF1" 
              strokeWidth={3}
              dot={{ fill: '#ffffff', stroke: '#6C4CF1', strokeWidth: 2, r: 4 }}
              activeDot={{ fill: '#6C4CF1', stroke: '#ffffff', strokeWidth: 2, r: 6 }}
              animationDuration={1500}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex items-center justify-center gap-2">
        <div className="w-3 h-3 rounded bg-[#6C4CF1]"></div>
        <span className="text-[12px] font-bold text-slate-600">Applications</span>
      </div>
    </div>
  );
}
