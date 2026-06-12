import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';

const applicationData = [
  { name: 'Jan', apps: 120 }, { name: 'Feb', apps: 210 },
  { name: 'Mar', apps: 450 }, { name: 'Apr', apps: 680 },
  { name: 'May', apps: 890 }, { name: 'Jun', apps: 1243 }
];

const atsData = [
  { name: 'Week 1', score: 45 }, { name: 'Week 2', score: 58 },
  { name: 'Week 3', score: 72 }, { name: 'Week 4', score: 84 }
];

const teamData = [
  { name: 'Hackathons', value: 45 },
  { name: 'Startups', value: 25 },
  { name: 'Open Source', value: 20 },
  { name: 'Study Groups', value: 10 }
];

const readinessData = [
  { name: 'Month 1', score: 20 }, { name: 'Month 2', score: 35 },
  { name: 'Month 3', score: 55 }, { name: 'Month 4', score: 76 }
];

const networkingData = [
  { name: 'W1', connections: 5 }, { name: 'W2', connections: 15 },
  { name: 'W3', connections: 42 }, { name: 'W4', connections: 89 },
  { name: 'W5', connections: 156 }
];

const oppCategoriesData = [
  { name: 'Internships', value: 350 },
  { name: 'Hackathons', value: 220 },
  { name: 'Scholarships', value: 150 },
  { name: 'Competitions', value: 100 }
];

const funnelData = [
  { name: 'Applied', value: 1243, color: '#6C4CF1' },
  { name: 'Screened', value: 680, color: '#3b82f6' },
  { name: 'Interview', value: 310, color: '#14b8a6' },
  { name: 'Offer', value: 112, color: '#f59e0b' },
  { name: 'Accepted', value: 89, color: '#10b981' },
];

const COLORS = ['#6C4CF1', '#14b8a6', '#f59e0b', '#3b82f6'];

const tooltipStyle = {
  borderRadius: '12px',
  border: 'none',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  fontSize: '13px'
};

export default function PresentationCharts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">

      {/* Chart 1: Applications */}
      <div className="card-standard p-6">
        <h3 className="text-[15px] font-bold text-slate-900 mb-0.5">Platform Adoption</h3>
        <p className="text-[12px] text-slate-400 font-medium mb-5">Monthly applications submitted</p>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={applicationData}>
              <defs>
                <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6C4CF1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6C4CF1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="apps" stroke="#6C4CF1" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: ATS */}
      <div className="card-standard p-6">
        <h3 className="text-[15px] font-bold text-slate-900 mb-0.5">ATS Score Improvement</h3>
        <p className="text-[12px] text-slate-400 font-medium mb-5">Average weekly progression</p>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={atsData} maxBarSize={36}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
              <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
              <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={tooltipStyle} />
              <Bar dataKey="score" fill="#14b8a6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: Career Readiness */}
      <div className="card-standard p-6">
        <h3 className="text-[15px] font-bold text-slate-900 mb-0.5">Career Readiness Growth</h3>
        <p className="text-[12px] text-slate-400 font-medium mb-5">Monthly average score</p>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={readinessData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
              <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 4: Team Types */}
      <div className="card-standard p-6">
        <h3 className="text-[15px] font-bold text-slate-900 mb-0.5">Team Participation</h3>
        <p className="text-[12px] text-slate-400 font-medium mb-5">By category type</p>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={teamData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={5} dataKey="value">
                {teamData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend verticalAlign="bottom" height={32} iconType="circle" iconSize={8} wrapperStyle={{fontSize: '12px', fontWeight: 600}} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 5: Networking */}
      <div className="card-standard p-6">
        <h3 className="text-[15px] font-bold text-slate-900 mb-0.5">Networking Growth</h3>
        <p className="text-[12px] text-slate-400 font-medium mb-5">Weekly connections made</p>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={networkingData}>
              <defs>
                <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="connections" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorNet)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 6: Opportunity Breakdown */}
      <div className="card-standard p-6">
        <h3 className="text-[15px] font-bold text-slate-900 mb-0.5">Opportunity Breakdown</h3>
        <p className="text-[12px] text-slate-400 font-medium mb-5">Listings by category</p>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={oppCategoriesData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
              <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={tooltipStyle} />
              <Bar dataKey="value" fill="#6C4CF1" radius={[0, 4, 4, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 7: Application Funnel — full width */}
      <div className="card-standard p-6 md:col-span-2 xl:col-span-3">
        <h3 className="text-[15px] font-bold text-slate-900 mb-0.5">Application Funnel</h3>
        <p className="text-[12px] text-slate-400 font-medium mb-6">From first application to accepted offer</p>
        <div className="flex flex-col sm:flex-row items-stretch gap-4 sm:gap-0">
          {funnelData.map((stage, i) => {
            const pct = Math.round((stage.value / funnelData[0].value) * 100);
            return (
              <div key={i} className="flex-1 flex flex-col items-center px-4 relative">
                {/* Mini bar */}
                <div className="w-full h-2 rounded-full mb-4" style={{ backgroundColor: stage.color + '20' }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, backgroundColor: stage.color }}
                  />
                </div>
                <div className="text-center">
                  <div className="text-[26px] font-black leading-none mb-1" style={{ color: stage.color }}>
                    {stage.value.toLocaleString()}
                  </div>
                  <div className="text-[13px] font-bold text-slate-700">{stage.name}</div>
                  <div className="text-[11px] text-slate-400 font-medium mt-0.5">{pct}% of applied</div>
                </div>
                {i < funnelData.length - 1 && (
                  <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-px bg-slate-100" />
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
