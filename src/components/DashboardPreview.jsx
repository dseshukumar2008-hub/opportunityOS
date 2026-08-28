import { 
// eslint-disable-next-line no-unused-vars
  LayoutDashboard, Search, Bell, FileText, 
  GitBranch, Target, BarChart3, Settings,
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-unused-vars
  TrendingUp, Rocket, ChevronRight, Briefcase, Code2, Sparkles, FileCheck, Brain
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
        <div className="w-[180px] xl:w-[220px] bg-[#FDFDFD] border-r border-slate-200/60 flex flex-col p-4 shrink-0">
          <div className="flex items-center gap-2 mb-8 px-2">
            <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">O</div>
            <span className="font-semibold text-sm text-slate-900 tracking-tight">OpportunityOS</span>
          </div>

          <div className="flex flex-col gap-1 overflow-y-auto">
            <a href="#" className="flex items-center gap-2.5 px-2 py-1.5 rounded-md bg-slate-100 text-slate-900 text-xs font-medium">
              <BarChart3 size={14} className="text-slate-600" />
              Analytics
            </a>
            {[
              { icon: <FileText size={14}/>, label: 'Resume Builder' },
              { icon: <FileCheck size={14}/>, label: 'Resume Analyzer' },
              { icon: <GitBranch size={14}/>, label: 'GitHub Analyzer' },
              { icon: <Target size={14}/>, label: 'Career Explorer' },
              { icon: <Code2 size={14}/>, label: 'Skill Gap Analysis' },
              { icon: <Brain size={14}/>, label: 'Interview Prep' },
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
        <div className="flex-1 bg-[#FAFAFA] p-6 xl:p-8 flex flex-col overflow-y-auto">
          
          <div className="flex justify-between items-center mb-6 shrink-0">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 tracking-tight">Career Intelligence</h2>
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
              { label: 'Career Readiness', value: '85%', subtext: 'Good Progress', color: 'text-indigo-600', icon: Target },
              { label: 'Resume Score', value: '92%', subtext: 'Excellent', color: 'text-emerald-500', icon: FileText },
              { label: 'GitHub Alignment', value: '78%', subtext: 'Moderate', color: 'text-orange-500', icon: GitBranch },
              { label: 'Skill Coverage', value: '60%', subtext: 'Needs Improvement', color: 'text-blue-500', icon: Code2 }
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200/60 p-4 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col justify-between hover:shadow-[0_4px_12px_rgb(0,0,0,0.04)] transition-all h-[110px]">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon size={14} className={stat.color} />
                  <p className="text-[11px] font-semibold text-slate-700 leading-none">{stat.label}</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">{stat.value}</h3>
                  <p className={`text-[10px] font-medium ${stat.color}`}>{stat.subtext}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Middle & Right Section */}
          <div className="flex-1 min-h-0 flex flex-col">
            
            {/* Career Insights (Expanded) */}
            <div className="bg-white rounded-xl border border-slate-200/60 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col flex-1 p-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp size={16} className="text-indigo-600" />
                <h3 className="text-[14px] font-bold text-slate-900">Career Insights</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-8 flex-1">
                {/* Left Side: Welcome and Progress */}
                <div className="flex flex-col justify-between h-full">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 shadow-sm border border-indigo-100/50">
                      <Rocket className="text-indigo-600" size={20} />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-indigo-600 mb-1.5">Your Career Journey Starts Here!</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed max-w-xs">Complete a few steps to view your skill gaps and next best actions.</p>
                    </div>
                  </div>

                  <div className="w-full mt-auto pt-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[11px] font-bold text-slate-700">Profile Setup Progress</span>
                      <span className="text-[11px] font-medium text-slate-500">4 of 5 completed</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full w-4/5"></div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Next Step */}
                <div className="flex flex-col justify-center border-l border-slate-100 pl-8">
                  <h4 className="text-[12px] font-bold text-slate-700 mb-4">Recommended Next Step</h4>
                  <div className="p-4 bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors rounded-xl flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100/50">
                        <GitBranch size={18} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-slate-900 mb-0.5 group-hover:text-indigo-600 transition-colors">Analyze GitHub Profile</p>
                        <p className="text-[11px] text-slate-500">Analyze your repositories and skills.</p>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all">
                      <ChevronRight size={16} className="text-slate-400 group-hover:text-indigo-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
