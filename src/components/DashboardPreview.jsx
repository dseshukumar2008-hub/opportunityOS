import { 
  LayoutDashboard, Search, Bell, Briefcase, FileText, 
  Users, Clock, BarChart3, Settings, ArrowRight,
  Circle, Sparkles
} from 'lucide-react';

export default function DashboardPreview() {
  return (
    <div className="w-full h-full flex flex-col bg-[#FAFAFA] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200/60 overflow-hidden relative z-10 transition-transform duration-500 hover:-translate-y-1">
      
      {/* Minimal Mac-style Header */}
      <div className="h-12 bg-white/50 backdrop-blur-sm border-b border-slate-200/60 flex items-center px-4 relative shrink-0">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
        </div>
        <div className="mx-auto flex items-center gap-2 text-[11px] font-medium text-slate-400 bg-white border border-slate-200/50 px-3 py-1 rounded-md shadow-sm">
          app.opportunityos.com
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden h-[560px]">
        {/* Minimal Sidebar */}
        <div className="w-[180px] xl:w-[220px] bg-[#FDFDFD] border-r border-slate-200/60 flex flex-col p-4">
          <div className="flex items-center gap-2 mb-8 px-2">
            <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">O</div>
            <span className="font-semibold text-sm text-slate-900 tracking-tight">OpportunityOS</span>
          </div>

          <div className="flex flex-col gap-1">
            <a href="#" className="flex items-center gap-2.5 px-2 py-1.5 rounded-md bg-slate-100 text-slate-900 text-xs font-medium">
              <LayoutDashboard size={14} className="text-slate-600" />
              Dashboard
            </a>
            {[
              { icon: <Briefcase size={14}/>, label: 'Opportunities' },
              { icon: <FileText size={14}/>, label: 'Applications' },
              { icon: <Users size={14}/>, label: 'Network' },
              { icon: <Clock size={14}/>, label: 'Schedule' },
              { icon: <BarChart3 size={14}/>, label: 'Analytics' },
              { icon: <Settings size={14}/>, label: 'Settings' }
            ].map((item, i) => (
              <a key={i} href="#" className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-slate-500 hover:bg-slate-50 hover:text-slate-900 text-xs font-medium transition-colors">
                <span className="text-slate-400">{item.icon}</span>
                {item.label}
              </a>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-[#FAFAFA] p-6 xl:p-8 flex flex-col overflow-hidden">
          
          <div className="flex justify-between items-center mb-8 shrink-0">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 tracking-tight">Overview</h2>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-slate-400 hover:text-slate-600 transition-colors"><Search size={16}/></button>
              <button className="text-slate-400 hover:text-slate-600 transition-colors"><Bell size={16}/></button>
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-sm border border-white"></div>
            </div>
          </div>

          {/* KPI Cards (Top Row) */}
          <div className="grid grid-cols-4 gap-4 mb-6 shrink-0">
            {[
              { label: 'Applications', value: '16', trend: '+2 this week' },
              { label: 'Interviews', value: '5', trend: '1 upcoming' },
              { label: 'Offers', value: '2', trend: 'Deciding' },
              { label: 'Saved', value: '24', trend: '4 new matches' }
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200/60 p-4 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col justify-between hover:shadow-[0_4px_12px_rgb(0,0,0,0.04)] transition-all">
                <p className="text-[11px] font-medium text-slate-500 mb-2 uppercase tracking-wider">{stat.label}</p>
                <div>
                  <h3 className="text-2xl font-semibold text-slate-900 tracking-tight mb-1">{stat.value}</h3>
                  <p className="text-[10px] text-slate-400 font-medium">{stat.trend}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Middle & Right Section */}
          <div className="grid grid-cols-3 gap-6 flex-1 min-h-0">
            
            {/* AI Recommendations */}
            <div className="col-span-2 bg-white rounded-xl border border-slate-200/60 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-[13px] font-semibold text-slate-900 flex items-center gap-2">
                  <Sparkles size={14} className="text-indigo-500" />
                  AI Matches
                </h3>
                <span className="text-[11px] font-medium text-indigo-600 cursor-pointer">View all</span>
              </div>
              <div className="p-2 flex flex-col gap-1 overflow-y-auto">
                {[
                  { name: 'Software Engineering Intern', company: 'Google', location: 'Mountain View, CA', match: '98%' },
                  { name: 'Space Apps Challenge 2026', company: 'NASA', location: 'Remote', match: '95%' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded border border-slate-200 bg-white flex items-center justify-center shrink-0 shadow-sm">
                        <span className="text-xs font-bold text-slate-700">{item.company[0]}</span>
                      </div>
                      <div>
                        <h4 className="text-[13px] font-semibold text-slate-900 leading-tight">{item.name}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">{item.company} • {item.location}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-[10px] font-semibold tracking-wide border border-green-100">
                        {item.match} MATCH
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Panel: Progress Ring */}
            <div className="col-span-1 bg-white rounded-xl border border-slate-200/60 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col p-5 items-center justify-center relative overflow-hidden">
              <h3 className="text-[13px] font-semibold text-slate-900 mb-6 w-full text-left">Pipeline</h3>
              
              <div className="relative w-28 h-28 xl:w-32 xl:h-32">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#F1F5F9" strokeWidth="4" />
                  {/* Applied (60%) */}
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#3B82F6" strokeWidth="4" strokeDasharray="60 40" strokeDashoffset="0" strokeLinecap="round" />
                  {/* Interview (25%) */}
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#8B5CF6" strokeWidth="4" strokeDasharray="25 75" strokeDashoffset="-60" strokeLinecap="round" />
                  {/* Offer (10%) */}
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#10B981" strokeWidth="4" strokeDasharray="10 90" strokeDashoffset="-85" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl xl:text-2xl font-bold text-slate-900 tracking-tight">16</span>
                  <span className="text-[9px] xl:text-[10px] font-medium text-slate-500 uppercase tracking-wider mt-0.5">Active</span>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2 w-full px-2">
                <div className="flex items-center justify-between text-[11px] font-medium">
                  <div className="flex items-center gap-1.5"><Circle size={6} className="fill-blue-500 text-blue-500"/> <span className="text-slate-600">Applied</span></div>
                  <span className="text-slate-900">10</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-medium">
                  <div className="flex items-center gap-1.5"><Circle size={6} className="fill-purple-500 text-purple-500"/> <span className="text-slate-600">Interview</span></div>
                  <span className="text-slate-900">4</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-medium">
                  <div className="flex items-center gap-1.5"><Circle size={6} className="fill-green-500 text-green-500"/> <span className="text-slate-600">Offer</span></div>
                  <span className="text-slate-900">2</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
