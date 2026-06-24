import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2, Circle, ChevronDown, ChevronRight, Trophy,
  Clock, Target, BookOpen, FolderOpen, PlaySquare,
  Zap, TrendingUp, RotateCcw, Star, FileText, Code, Briefcase, Sparkles, ArrowRight, ExternalLink, Download
} from 'lucide-react';
import { generateRoadmapPDF } from '../../utils/generateRoadmapPDF';
import { useProfile } from '../../contexts/ProfileContext';
import roadmapResources from '../../data/roadmapResources.json';
import ConfirmationModal from '../common/ConfirmationModal';

const PHASE_COLORS = [
  { bg: 'bg-[#6C4CF1]', text: 'text-[#6C4CF1]', light: 'bg-indigo-50', border: 'border-[#6C4CF1]' },
  { bg: 'bg-emerald-500', text: 'text-emerald-500', light: 'bg-emerald-50', border: 'border-emerald-400' },
  { bg: 'bg-amber-500', text: 'text-amber-500', light: 'bg-amber-50', border: 'border-amber-400' },
  { bg: 'bg-blue-500', text: 'text-blue-500', light: 'bg-blue-50', border: 'border-blue-400' },
  { bg: 'bg-rose-500', text: 'text-rose-500', light: 'bg-rose-50', border: 'border-rose-400' },
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
          style={{ transition: 'stroke-dashoffset 1s ease' }}
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
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <span className="absolute text-[10px] font-bold" style={{ color }}>{pct}%</span>
    </div>
  );
}

function PhaseCard({ phase, index, isActive, isExpanded, onToggle, completedTasks, toggleTask }) {
  const [activeTab, setActiveTab] = useState('Overview');
  
  const tasks = phase.tasks || [];
  const doneCount = tasks.filter(t => completedTasks.includes(t.id)).length;
  const pct = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;
  
  const pcol = PHASE_COLORS[index % PHASE_COLORS.length];
  const Icon = index === 0 ? BookOpen : index === 1 ? Code : index === 2 ? FolderOpen : index === 3 ? Briefcase : Target;

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-300 mb-4 ${isActive ? 'border-[#6C4CF1]/30 shadow-[0_8px_30px_rgba(108,76,241,0.08)]' : 'border-slate-200 shadow-sm hover:border-slate-300'}`}>
      
      {/* Clickable Header */}
      <div onClick={onToggle} className="py-3 px-5 md:py-4 md:px-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors rounded-t-2xl">
        <div className="flex items-center gap-4 overflow-hidden">
          <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 transition-colors ${isActive ? 'bg-[#6C4CF1] text-white shadow-md shadow-indigo-200' : `${pcol.light} ${pcol.text}`}`}>
            <Icon size={22} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-0.5">
              <h3 className="text-lg font-semibold text-slate-900 truncate leading-tight">{phase.title}</h3>
              {isActive && <span className="shrink-0 px-2 py-0.5 bg-indigo-50 text-[#6C4CF1] text-[10px] font-bold rounded-md uppercase tracking-wider leading-none">Current Phase</span>}
            </div>
            <p className="text-sm text-slate-500 truncate leading-tight">{phase.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 shrink-0 pl-2">
          <div className="hidden sm:block">
            <ProgressRingSmall pct={pct} color={isActive ? '#6C4CF1' : '#94a3b8'} />
          </div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0 ${isExpanded ? 'bg-slate-100 text-slate-600' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>
            {isExpanded ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
          
          {/* Tabs */}
          <div className="flex overflow-x-auto border-b border-slate-100 px-4 md:px-6 hide-scrollbar">
            {['Overview', 'Tasks', 'Resources', 'Projects', 'Milestones'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap px-4 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === tab ? 'border-[#6C4CF1] text-[#6C4CF1]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-5 md:p-8 bg-slate-50/30 rounded-b-2xl">
            {activeTab === 'Overview' && (
              <div className="text-slate-600 text-[14px] leading-relaxed">
                {phase.overview || 'No overview provided.'}
                <div className="mt-6">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Key Skills Acquired</p>
                  <div className="flex flex-wrap gap-2">
                    {(phase.skills || []).map(s => <span key={s} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 shadow-sm">{s}</span>)}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Tasks' && (
              <div className="space-y-3">
                {tasks.map((t) => {
                  const isDone = completedTasks.includes(t.id);
                  let statusBadge = isDone ? 'Completed' : (t.status || 'Not Started');
                  return (
                    <div key={t.id} onClick={() => toggleTask(t.id, !isDone)} className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-[#6C4CF1]/30 hover:shadow-sm transition-all cursor-pointer group bg-white">
                      <div className="flex items-center gap-4 pr-4">
                        <button className={`shrink-0 transition-colors ${isDone ? 'text-emerald-500' : 'text-slate-300 group-hover:text-[#6C4CF1]'}`}>
                          {isDone ? <CheckCircle2 size={24}/> : <Circle size={24}/>}
                        </button>
                        <span className={`text-[14px] font-bold ${isDone ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{t.title}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`hidden sm:inline-flex text-[11px] font-bold px-2.5 py-1 rounded-md ${isDone ? 'bg-emerald-50 text-emerald-600' : statusBadge === 'In Progress' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400'}`}>
                          {statusBadge}
                        </span>
                        <ChevronRight size={18} className="text-slate-300"/>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {activeTab === 'Resources' && (
              <div className="grid sm:grid-cols-2 gap-4">
                {(phase.resources || []).length === 0 && <p className="text-sm text-slate-500">No resources specified.</p>}
                {(phase.resources || []).map((r, i) => {
                  const hasUrl = r.url && r.url.length > 5 && r.url.startsWith('http');
                  const finalUrl = hasUrl 
                    ? r.url 
                    : `https://www.google.com/search?q=${encodeURIComponent(`${r.title} ${r.provider || ''} ${r.type || 'course'}`)}`;
                  
                  return (
                    <a 
                      key={i} 
                      href={finalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col gap-2 cursor-pointer hover:shadow-sm hover:border-[#6C4CF1]/30 hover:-translate-y-0.5 transition-all group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-max px-2 py-1 bg-indigo-50 text-[#6C4CF1] text-[10px] font-black uppercase rounded">{r.type || 'Resource'}</span>
                        {r.provider && <span className="text-[11px] font-bold text-slate-400 truncate">{r.provider}</span>}
                      </div>
                      <p className="font-bold text-slate-800 text-sm line-clamp-2 group-hover:text-[#6C4CF1] transition-colors">{r.title}</p>
                      
                      <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#6C4CF1] mt-auto pt-2">
                        View Resource <ExternalLink size={14} />
                      </div>
                    </a>
                  );
                })}
              </div>
            )}

            {activeTab === 'Projects' && (
              <div className="space-y-4">
                {(phase.projects || []).length === 0 && <p className="text-sm text-slate-500">No projects specified.</p>}
                {(phase.projects || []).map((p, i) => (
                  <div key={i} className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center shrink-0"><FolderOpen size={18} className="text-violet-500"/></div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-[15px] mb-1">{p.title}</h4>
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded">{p.difficulty}</span>
                      <p className="text-sm text-slate-500 mt-2 leading-relaxed">{p.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Milestones' && (
              <div className="space-y-3">
                {(phase.milestones || []).length === 0 && <p className="text-sm text-slate-500">No milestones specified.</p>}
                {(phase.milestones || []).map((m, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-amber-50/30 border border-amber-100 rounded-2xl">
                    <Star size={20} className="text-amber-500 shrink-0"/>
                    <span className="font-bold text-slate-800 text-[14px]">{m}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


export default function RoadmapDashboard({ roadmap, toggleTask, onReset }) {
  const {
    roadmapData = {},
    completedTasks = [],
    updatedAt,
  } = roadmap || {};

  const { profile } = useProfile();

  const { header = {}, phases = [], sidebar = {} } = roadmapData;

  const totalTasks = phases.reduce((acc, p) => acc + (p.tasks?.length || 0), 0);
  const doneTasks = completedTasks.length;
  const overallProgress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  // Compute active phase
  const activePhaseIdx = useMemo(() => {
    for (let i = 0; i < phases.length; i++) {
      const tasks = phases[i].tasks || [];
      const done = tasks.filter(t => completedTasks.includes(t.id)).length;
      if (done < tasks.length || tasks.length === 0) return i;
    }
    return phases.length - 1 >= 0 ? phases.length - 1 : 0;
  }, [phases, completedTasks]);

  // Compute dynamic resource
  const dynamicResource = useMemo(() => {
    if (!phases || phases.length === 0) return null;
    const activePhase = phases[activePhaseIdx];
    if (!activePhase) return null;

    const tasks = activePhase.tasks || [];
    
    // 1. Try to find resource by next incomplete task
    const nextTask = tasks.find(t => !completedTasks.includes(t.id));
    if (nextTask) {
      const matchingKey = Object.keys(roadmapResources).find(k => 
        nextTask.title.toLowerCase().includes(k.toLowerCase())
      );
      if (matchingKey) return roadmapResources[matchingKey];
    }

    // 2. Try to find resource by phase skills
    if (activePhase.skills && activePhase.skills.length > 0) {
      for (const skill of activePhase.skills) {
        const matchingKey = Object.keys(roadmapResources).find(k => 
          skill.toLowerCase().includes(k.toLowerCase())
        );
        if (matchingKey) return roadmapResources[matchingKey];
      }
    }

    // 3. Try to find resource by phase title
    const matchingPhaseKey = Object.keys(roadmapResources).find(k => 
      activePhase.title.toLowerCase().includes(k.toLowerCase())
    );
    if (matchingPhaseKey) return roadmapResources[matchingPhaseKey];

    return null;
  }, [phases, activePhaseIdx, completedTasks]);

  const [showResetModal, setShowResetModal] = useState(false);
  const [showProgressResetModal, setShowProgressResetModal] = useState(false);

  // Expand the active phase by default
  const [expandedPhases, setExpandedPhases] = useState({});
  useEffect(() => {
    setExpandedPhases({ [activePhaseIdx]: true });
  }, [activePhaseIdx]);

  const lastUpdated = updatedAt?.toDate ? updatedAt.toDate().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recently';

  const togglePhase = (idx) => {
    setExpandedPhases(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleDownloadPDF = () => {
    generateRoadmapPDF(roadmapData, profile, {
      overallProgress,
      doneTasks,
      totalTasks,
      currentPhaseTitle: header.currentPhase || phases[activePhaseIdx]?.title || 'Foundation',
      completedTasks
    });
  };

  return (
    <div className="space-y-6 pb-8">
      {/* ── HEADER CARD ── */}
      <div className="relative bg-gradient-to-br from-[#6246EA] to-[#4B30C4] rounded-2xl p-6 overflow-hidden text-white shadow-[0_10px_40px_rgba(98,70,234,0.3)]">
        <div className="absolute top-0 right-0 w-2/3 h-full opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.4) 0%, transparent 70%)' }}></div>
        <div className="absolute -bottom-24 -right-10 w-96 h-96 border-[40px] border-white/5 rounded-full blur-xl pointer-events-none"></div>

        <div className="relative flex flex-col md:flex-row items-center gap-6 mb-6 z-10">
          <ProgressRing pct={overallProgress} size={86} stroke={6} />
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-extrabold mb-2">{header.careerTitle || 'Career Roadmap'}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-medium text-white/80 mb-4">
              <span className="flex items-center gap-1.5"><Clock size={14}/> Estimated Time: {header.estimatedDuration || '12 Months'}</span>
              <span className="flex items-center gap-1.5"><RotateCcw size={14}/> Last Updated: {lastUpdated}</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">Next Milestone</p>
              <button className="flex items-center gap-1.5 text-[15px] font-bold hover:text-indigo-200 transition-colors">
                {header.nextMilestone || 'Complete Current Phase'} <ChevronRight size={16} className="p-0.5 bg-white/20 rounded-full"/>
              </button>
            </div>
          </div>
          
          <div className="absolute top-0 right-0 flex flex-wrap justify-end gap-2 sm:gap-3">
            <button onClick={handleDownloadPDF} className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-[#6246EA] hover:bg-white/90 shadow-lg rounded-xl text-xs font-bold transition-all">
              <Download size={14}/> Download PDF
            </button>
            <button onClick={() => setShowResetModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold backdrop-blur-md transition-all">
              <Target size={14}/> Change Goal
            </button>
            <button onClick={() => setShowProgressResetModal(true)} className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold backdrop-blur-md transition-all">
              <RotateCcw size={14}/> Reset
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="relative bg-white rounded-2xl p-3 px-5 flex flex-wrap items-center justify-between gap-3 z-10 shadow-lg text-slate-800">
          <div className="flex items-center gap-3 flex-1 min-w-[120px]">
            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center"><TrendingUp size={16} className="text-[#6C4CF1]"/></div>
            <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Phases</p><p className="text-[15px] font-black leading-tight">{phases.length}</p></div>
          </div>
          <div className="hidden sm:block w-px h-8 bg-slate-100"></div>
          <div className="flex items-center gap-3 flex-1 min-w-[120px]">
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center"><CheckCircle2 size={16} className="text-emerald-500"/></div>
            <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Tasks Done</p><p className="text-[15px] font-black leading-tight">{doneTasks} / {totalTasks}</p></div>
          </div>
          <div className="hidden sm:block w-px h-8 bg-slate-100"></div>
          <div className="flex items-center gap-3 flex-1 min-w-[120px]">
            <div className="w-8 h-8 rounded-full bg-violet-50 flex items-center justify-center"><Zap size={16} className="text-violet-500"/></div>
            <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Current Phase</p><p className="text-[15px] font-black leading-tight truncate max-w-[120px]">{header.currentPhase || phases[activePhaseIdx]?.title || 'Foundation'}</p></div>
          </div>
          <div className="hidden sm:block w-px h-8 bg-slate-100"></div>
          <div className="flex items-center gap-3 flex-1 min-w-[120px]">
            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center"><Trophy size={16} className="text-amber-500"/></div>
            <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Overall Rank</p><p className="text-[15px] font-black leading-tight">{header.overallRank || 'Beginner'}</p></div>
          </div>
        </div>
      </div>

      {/* ── RESET MODAL ── */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4 text-red-500">
              <Target size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Start a New Career Roadmap?</h3>
            <p className="text-sm text-slate-500 mb-6">
              You are about to create a completely new roadmap. Your current roadmap progress will be replaced.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowResetModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowResetModal(false);
                  onReset();
                }}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-[#6C4CF1] hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all"
              >
                Start Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PROGRESS RESET CONFIRMATION MODAL ── */}
      <ConfirmationModal
        isOpen={showProgressResetModal}
        onClose={() => setShowProgressResetModal(false)}
        onConfirm={() => {
          setShowProgressResetModal(false);
          onReset();
        }}
        title="Reset Progress"
        message={
          <>
            Are you sure you want to reset your current progress?
            {'\n\n'}This action cannot be undone.
          </>
        }
        confirmText="Reset Progress"
        isDestructive={true}
      />

      {/* ── ROADMAP JOURNEY TIMELINE ── */}
      <div>
        <h3 className="text-[14px] font-extrabold text-slate-900 mb-4">Roadmap Journey</h3>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 max-w-4xl mx-auto">
          {phases.map((p, i) => {
            const isActive = i === activePhaseIdx;
            const tks = p.tasks || [];
            const isDone = tks.length > 0 && tks.every(t => completedTasks.includes(t.id));
            
            const isNextDone = i < phases.length - 1 && phases[i+1]?.tasks?.length > 0 && phases[i+1].tasks.every(t => completedTasks.includes(t.id));
            const isPathActive = isDone || (i < activePhaseIdx);
            
            const iconBg = isDone ? 'bg-[#6C4CF1]' : isActive ? 'bg-[#6C4CF1]' : 'bg-white';
            const iconBorder = isDone || isActive ? 'border-transparent' : 'border-slate-200';
            const iconCol = isDone || isActive ? 'text-white' : 'text-slate-400';
            
            return (
              <div key={i} className="flex flex-col sm:flex-row items-center sm:flex-1">
                {/* Phase Item */}
                <div className="flex flex-col items-center gap-2 bg-white relative group shrink-0">
                  <div className={`w-14 h-14 rounded-2xl ${iconBg} border-2 ${iconBorder} flex items-center justify-center shadow-sm transition-all duration-300 z-10 ${isActive ? 'scale-110 shadow-indigo-200 ring-4 ring-indigo-50' : ''}`}>
                    {i === 0 ? <BookOpen size={28} className={iconCol}/> :
                     i === 1 ? <Code size={28} className={iconCol}/> :
                     i === 2 ? <FolderOpen size={28} className={iconCol}/> :
                     i === 3 ? <Briefcase size={28} className={iconCol}/> :
                     <Target size={28} className={iconCol}/>}
                  </div>
                  <div className="text-center mt-1 w-24">
                    <p className={`text-[12px] sm:text-[11px] font-bold ${isActive ? 'text-[#6C4CF1]' : 'text-slate-600'}`}>{p.title}</p>
                    <p className={`text-[11px] sm:text-[10px] font-extrabold ${isDone ? 'text-[#6C4CF1]' : 'text-slate-400'}`}>
                      {tks.length > 0 ? Math.round((tks.filter(t => completedTasks.includes(t.id)).length / tks.length) * 100) : 0}%
                    </p>
                  </div>
                </div>

                {/* Connector */}
                {i < phases.length - 1 && (
                  <div className="flex sm:flex-1 items-center justify-center py-3 sm:py-0 sm:px-2 w-full h-12 sm:h-auto">
                    <div className="flex items-center justify-center relative w-1 h-full sm:w-full sm:h-1">
                      {/* Line */}
                      <div className={`absolute w-1 h-full sm:w-full sm:h-[3px] rounded-full ${isPathActive ? 'bg-[#6C4CF1]' : 'bg-slate-100'}`}></div>
                      {/* Arrow Icon */}
                      <div className={`relative z-10 bg-white p-1 rounded-full ${isPathActive ? 'text-[#6C4CF1]' : 'text-slate-300'}`}>
                        <ArrowRight size={16} className="rotate-90 sm:rotate-0" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        {/* ── LEFT COLUMN: MAIN CONTENT (ALL PHASES) ── */}
        <div className="lg:col-span-2 space-y-2">
          {phases.map((phase, i) => (
            <PhaseCard
              key={phase.id || i}
              phase={phase}
              index={i}
              isActive={i === activePhaseIdx}
              isExpanded={!!expandedPhases[i]}
              onToggle={() => togglePhase(i)}
              completedTasks={completedTasks}
              toggleTask={toggleTask}
            />
          ))}
          
          <div className="pt-8 pb-4 text-center border-t border-slate-200 mt-8">
            <h3 className="text-[18px] font-black text-slate-900 mb-2">Ready to apply?</h3>
            <p className="text-[14px] text-slate-500 mb-6">Discover roles that match your new career goals.</p>
            <Link to="/opportunities" className="inline-flex items-center gap-2 px-8 py-3 bg-[#6C4CF1] hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md">
              Find Matching Opportunities <ArrowRight size={18} />
            </Link>
          </div>
          
          <p className="text-[11px] font-bold text-slate-400 text-center pt-4 flex items-center justify-center gap-2">
            <Sparkles size={12}/> Roadmap generated with AI based on your profile and goals.
          </p>
        </div>

        {/* ── RIGHT COLUMN: SIDEBAR ── */}
        <div className="space-y-6">
          {/* Current Focus */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target size={16} className="text-[#6C4CF1]"/>
              <h3 className="text-[14px] font-extrabold text-slate-900">Current Focus</h3>
            </div>
            <div className="bg-indigo-50/60 rounded-2xl p-6 border border-indigo-100/50">
              <h4 className="text-[18px] font-black text-slate-900 mb-2">{sidebar.currentFocus?.title || phases[activePhaseIdx]?.title || 'Foundation'}</h4>
              <p className="text-[13px] text-slate-600 font-medium leading-relaxed mb-6">{sidebar.currentFocus?.description || phases[activePhaseIdx]?.description}</p>
              <button onClick={() => setExpandedPhases({[activePhaseIdx]: true})} className="w-full py-3 bg-[#6C4CF1]/10 text-[#6C4CF1] hover:bg-[#6C4CF1]/20 rounded-xl font-bold text-sm transition-colors">
                View Active Phase
              </button>
            </div>
          </div>

          {/* Recommended Resource */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText size={16} className="text-blue-500"/>
              <h3 className="text-[14px] font-extrabold text-slate-900">Recommended Resource</h3>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col items-center text-center">
              {dynamicResource ? (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 mb-4 shadow-sm">
                    <PlaySquare size={32} />
                  </div>
                  <h4 className="text-[15px] font-extrabold text-slate-900 mb-1">{dynamicResource.title}</h4>
                  <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-2">{dynamicResource.platform || dynamicResource.provider}</p>
                  <div className="flex items-center gap-1 text-[12px] font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded mb-5">
                    <Star size={12} className="fill-amber-500"/> {dynamicResource.rating}
                  </div>
                  <a href={dynamicResource.url} target="_blank" rel="noopener noreferrer" className="w-full py-3 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-sm transition-colors text-center block">
                    Watch Now
                  </a>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mb-4 shadow-sm">
                    <BookOpen size={32} />
                  </div>
                  <h4 className="text-[15px] font-extrabold text-slate-900 mb-1">No recommended resource available yet.</h4>
                  <p className="text-[12px] font-medium text-slate-500 mb-5">Check back later or explore manually.</p>
                  <button disabled className="w-full py-3 bg-slate-100 text-slate-400 rounded-xl font-bold text-sm cursor-not-allowed">
                    Watch Now
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} className="text-emerald-500"/>
              <h3 className="text-[14px] font-extrabold text-slate-900">Quick Stats</h3>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                <span className="text-[13px] font-bold text-slate-500">Skills Acquired</span>
                <span className="text-[15px] font-black text-slate-900">{sidebar.quickStats?.skillsAcquired || 0}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                <span className="text-[13px] font-bold text-slate-500">Projects Built</span>
                <span className="text-[15px] font-black text-slate-900">{sidebar.quickStats?.projectsBuilt || 0}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                <span className="text-[13px] font-bold text-slate-500">Certifications</span>
                <span className="text-[15px] font-black text-slate-900">{sidebar.quickStats?.certifications || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-slate-500">Streak</span>
                <span className="text-[15px] font-black text-slate-900 flex items-center gap-1">{sidebar.quickStats?.streak || 1} Days <span>🔥</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
