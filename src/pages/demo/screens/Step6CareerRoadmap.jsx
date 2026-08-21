import { useState } from 'react';
import { 
// eslint-disable-next-line no-unused-vars
  CheckCircle2, Circle, ChevronDown, ChevronRight, Trophy,
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-unused-vars
  Clock, Target, BookOpen, FolderOpen, PlaySquare,
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-unused-vars
  Zap, TrendingUp, RotateCcw, Star, FileText, Code, Briefcase, ArrowRight
} from 'lucide-react';

const PHASE_COLORS = [
  { bg: 'bg-[#6C4CF1]', text: 'text-[#6C4CF1]', light: 'bg-indigo-50', border: 'border-[#6C4CF1]' },
  { bg: 'bg-emerald-500', text: 'text-emerald-500', light: 'bg-emerald-50', border: 'border-emerald-400' },
  { bg: 'bg-amber-500', text: 'text-amber-500', light: 'bg-amber-50', border: 'border-amber-400' },
];

function ProgressRing({ pct, size = 120, stroke = 8, color = '#ffffff', trackColor = 'rgba(255,255,255,0.2)' }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke}/>
        <circle
          cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (pct / 100) * c}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-black" style={{ fontSize: size * 0.26, lineHeight: 1 }}>{pct}%</span>
        <span className="font-bold tracking-widest uppercase" style={{ fontSize: size * 0.09, marginTop: size * 0.02 }}>READY</span>
      </div>
    </div>
  );
}

function ProgressRingSmall({ pct, size = 40, stroke = 3, color = '#6C4CF1' }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F1F5F9" strokeWidth={stroke}/>
        <circle
          cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (pct / 100) * c}
        />
      </svg>
      <span className="absolute text-[10px] font-bold" style={{ color }}>{pct}%</span>
    </div>
  );
}

export default function Step6CareerRoadmap() {
  const [expanded, setExpanded] = useState(0);
  
  const overallProgress = 33;
  const phases = [
    { title: 'Foundation', description: 'Master the basics of computer science.', icon: BookOpen },
    { title: 'Core Skills', description: 'Data structures, algorithms, and web tech.', icon: Code },
    { title: 'Advanced', description: 'System design and architecture.', icon: Target }
  ];

  return (
    <div className="h-[700px] overflow-y-auto max-w-4xl mx-auto w-full p-4 lg:p-8 animate-in fade-in duration-500 custom-scrollbar">
      <div className="relative bg-gradient-to-br from-[#6246EA] to-[#4B30C4] rounded-2xl p-6 overflow-hidden text-white shadow-[0_10px_40px_rgba(98,70,234,0.3)] mb-8">
        <div className="absolute top-0 right-0 w-2/3 h-full opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.4) 0%, transparent 70%)' }}></div>
        <div className="relative flex flex-col md:flex-row items-center gap-6 mb-6 z-10">
          <ProgressRing pct={overallProgress} size={86} stroke={6} />
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-extrabold mb-2">Software Engineering Roadmap</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-medium text-white/80 mb-4">
              <span className="flex items-center gap-1.5"><Clock size={14}/> Estimated Time: 12 Months</span>
              <span className="flex items-center gap-1.5"><RotateCcw size={14}/> Last Updated: Today</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">Next Milestone</p>
              <button className="flex items-center gap-1.5 text-[15px] font-bold text-white/90">
                Complete Core Skills <ChevronRight size={16} className="p-0.5 bg-white/20 rounded-full"/>
              </button>
            </div>
          </div>
        </div>

        <div className="relative bg-white rounded-2xl p-3 px-5 flex flex-wrap items-center justify-between gap-3 z-10 shadow-lg text-slate-800">
          <div className="flex items-center gap-3 flex-1 min-w-[120px]">
            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center"><TrendingUp size={16} className="text-[#6C4CF1]"/></div>
            <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Phases</p><p className="text-[15px] font-black leading-tight">3</p></div>
          </div>
          <div className="flex items-center gap-3 flex-1 min-w-[120px]">
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center"><CheckCircle2 size={16} className="text-emerald-500"/></div>
            <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Tasks Done</p><p className="text-[15px] font-black leading-tight">4 / 12</p></div>
          </div>
          <div className="flex items-center gap-3 flex-1 min-w-[120px]">
            <div className="w-8 h-8 rounded-full bg-violet-50 flex items-center justify-center"><Zap size={16} className="text-violet-500"/></div>
            <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Current Phase</p><p className="text-[15px] font-black leading-tight">Core Skills</p></div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {phases.map((phase, i) => {
          const isActive = i === 1;
          const isDone = i === 0;
          const pct = isDone ? 100 : isActive ? 50 : 0;
          const pcol = PHASE_COLORS[i];
          const isExpanded = expanded === i;

          return (
            <div key={i} className={`bg-white rounded-2xl border transition-all duration-300 ${isActive ? 'border-[#6C4CF1]/30 shadow-[0_8px_30px_rgba(108,76,241,0.08)]' : 'border-slate-200 shadow-sm'}`}>
              <div onClick={() => setExpanded(i)} className="py-3 px-5 md:py-4 md:px-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors rounded-t-2xl">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 ${isActive ? 'bg-[#6C4CF1] text-white' : `${pcol.light} ${pcol.text}`}`}>
                    <phase.icon size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-0.5">
                      <h3 className="text-lg font-semibold text-slate-900 leading-tight">{phase.title}</h3>
                      {isActive && <span className="px-2 py-0.5 bg-indigo-50 text-[#6C4CF1] text-[10px] font-bold rounded-md uppercase tracking-wider">Current Phase</span>}
                    </div>
                    <p className="text-sm text-slate-500 leading-tight">{phase.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:block">
                    <ProgressRingSmall pct={pct} color={isActive ? '#6C4CF1' : isDone ? '#10B981' : '#94a3b8'} />
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isExpanded ? 'bg-slate-100' : 'bg-slate-50'}`}>
                    {isExpanded ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}
                  </div>
                </div>
              </div>
              
              {isExpanded && (
                <div className="border-t border-slate-100 p-5 md:p-8 bg-slate-50/30">
                  <div className="space-y-3">
                    {[1,2,3].map(task => (
                      <div key={task} className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-white">
                        <div className="flex items-center gap-4">
                          <Circle size={24} className="text-slate-300" />
                          <span className="text-[14px] font-bold text-slate-700">Mock Task {task}</span>
                        </div>
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-slate-50 text-slate-400">Not Started</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
