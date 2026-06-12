import { useApplications } from '../../contexts/ApplicationContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function StatusDistributionChart() {
  const { applications } = useApplications();
  const totalApps = (applications || []).length;

  const statuses = ['Applied', 'Interview', 'Offer', 'Rejected'];

  const dataMap = {};
  statuses.forEach(s => dataMap[s] = 0);

  applications.forEach(app => {
    if (app.status && dataMap[app.status] !== undefined) {
      dataMap[app.status] += 1;
    }
  });

  const rawData = statuses.map(s => ({
    name: s,
    value: dataMap[s]
  })).filter(d => d.value > 0).sort((a, b) => b.value - a.value);

  if (rawData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center min-h-[320px] w-full h-fit">
        <h3 className="text-[16px] font-bold text-slate-800 mb-1">Application Status Distribution</h3>
        <p className="text-[13px] text-slate-500 font-medium mb-6 text-center">Understand the current state of your applications.</p>
        <p className="text-slate-400 text-sm">No status data available</p>
      </div>
    );
  }

  // Exact colors from mockup
  const colorMapping = {
    'Applied': '#6C4CF1',   // Purple
    'Interview': '#10B981', // Green
    'Offer': '#F59E0B',     // Yellow
    'Rejected': '#F43F5E'   // Red
  };

  const data = rawData.map(item => ({
    ...item,
    fill: colorMapping[item.name] || '#6C4CF1'
  }));

  // Moved outside component to satisfy react-hooks/static-components rule
  const customTooltipRenderer = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value, fill } = payload[0].payload;
      const percentage = totalApps > 0 ? Math.round((value / totalApps) * 100) : 0;
      return (
        <div className="bg-white border border-slate-100 p-3 rounded-xl shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)]">
          <p className="text-sm font-bold text-slate-800 mb-2">{name}</p>
          <div className="text-sm text-slate-600 flex flex-col gap-1">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: fill }}></span>
              <span className="font-semibold text-slate-700">Count:</span> {value}
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-transparent"></span>
              <span className="font-semibold text-slate-700">Percentage:</span> {percentage}%
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    
    if (percent < 0.05) return null;

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col min-h-[320px] w-full h-full">
      <div className="mb-4">
        <h3 className="text-[16px] font-bold text-slate-800 mb-1">Application Status Distribution</h3>
        <p className="text-[13px] text-slate-500 font-medium">Understand the current state of your applications.</p>
      </div>

      <div className="flex-1 flex flex-row items-center w-full">
        {/* Left Side: Doughnut Chart */}
        <div className="w-[55%] h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={customTooltipRenderer} />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                labelLine={false}
                label={renderCustomizedLabel}
                dataKey="value"
                animationDuration={1500}
                stroke="white"
                strokeWidth={2}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Right Side: Legend */}
        <div className="w-[45%] flex flex-col justify-center gap-3 pl-4">
          {data.map((entry, index) => {
            const percentage = totalApps > 0 ? Math.round((entry.value / totalApps) * 100) : 0;
            return (
              <div key={index} className="flex items-center justify-between text-[12px]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.fill }}></div>
                  <span className="font-semibold text-slate-700">{entry.name}</span>
                </div>
                <div className="flex items-center gap-2 text-right">
                  <span className="font-bold text-slate-900 w-4">{entry.value}</span>
                  <span className="text-slate-400 font-medium w-9">({percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-4 flex justify-center">
        <span className="text-[13px] font-bold text-slate-800">Total: {totalApps} Applications</span>
      </div>
    </div>
  );
}
