import { Map, CheckCircle2, Briefcase, Award, AlertTriangle, TrendingUp, Lightbulb, GitBranch, RefreshCw, Target, CalendarDays } from 'lucide-react';
import { useCareerRoadmap } from '../../hooks/useCareerRoadmap';
import CareerReadinessPanel from '../../components/dashboard/CareerReadinessPanel';
import AchievementsShowcase from '../../components/profile/AchievementsShowcase';
import EmptyState from '../../components/ui/EmptyState';

const PHASE_COLORS = {
  '30_days': { border: 'border-t-blue-500', badge: 'bg-blue-50 text-blue-700 border-blue-200', icon: 'text-blue-500' },
  '90_days': { border: 'border-t-indigo-500', badge: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: 'text-indigo-500' },
  '6_months': { border: 'border-t-purple-500', badge: 'bg-purple-50 text-purple-700 border-purple-200', icon: 'text-purple-500' },
  '12_months': { border: 'border-t-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: 'text-emerald-500' },
};

function PhasePlanCard({ phaseKey, phase }) {
  const colors = PHASE_COLORS[phaseKey] || PHASE_COLORS['30_days'];
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 border-t-4 ${colors.border} p-6 shadow-sm flex flex-col gap-5`}>
      <div>
        <span className={`inline-block px-3 py-1 rounded-lg border text-[12px] font-extrabold uppercase tracking-wider mb-2 ${colors.badge}`}>
          {phase.title}
        </span>
        <p className="text-[13px] text-slate-500 font-medium leading-relaxed">{phase.focus}</p>
      </div>

      {phase.skills?.length > 0 && (
        <div>
          <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Lightbulb size={12} /> Skills to Learn
          </h4>
          <div className="flex flex-wrap gap-2">
            {phase.skills.map((s, i) => (
              <span key={i} className="bg-slate-50 border border-slate-200 text-slate-700 text-[12px] font-bold px-2.5 py-1 rounded-lg">{s}</span>
            ))}
          </div>
        </div>
      )}

      {phase.projects?.length > 0 && (
        <div>
          <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Briefcase size={12} /> Projects to Build
          </h4>
          <ul className="space-y-1">
            {phase.projects.map((p, i) => (
              <li key={i} className="text-[13px] text-slate-700 font-medium flex items-start gap-2">
                <span className="text-indigo-400 mt-0.5 shrink-0">•</span>{p}
              </li>
            ))}
          </ul>
        </div>
      )}

      {phase.certifications?.length > 0 && (
        <div>
          <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Award size={12} /> Certifications
          </h4>
          <ul className="space-y-1">
            {phase.certifications.map((c, i) => (
              <li key={i} className="text-[13px] text-slate-700 font-medium flex items-start gap-2">
                <span className="text-amber-400 mt-0.5 shrink-0">•</span>{c}
              </li>
            ))}
          </ul>
        </div>
      )}

      {phase.opportunities?.length > 0 && (
        <div>
          <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Target size={12} /> Opportunities to Pursue
          </h4>
          <ul className="space-y-1">
            {phase.opportunities.map((o, i) => (
              <li key={i} className="text-[13px] text-slate-700 font-medium flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5 shrink-0">•</span>{o}
              </li>
            ))}
          </ul>
        </div>
      )}

      {phase.actions?.length > 0 && (
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
          <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2">Action Steps</h4>
          <ul className="space-y-1.5">
            {phase.actions.map((a, i) => (
              <li key={i} className="text-[13px] text-slate-700 font-medium flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />{a}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function CareerRoadmapPage() {
  const { isLoading, error, roadmapData, generateRoadmap } = useCareerRoadmap();

  if (isLoading) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-16 flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 border-4 border-indigo-100 border-t-[#6C4CF1] rounded-full animate-spin"></div>
        <h3 className="text-[18px] font-bold text-slate-900">Generating your personalized roadmap...</h3>
        <p className="text-[14px] text-slate-500">This may take a few seconds. Powered by Gemini AI.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-16 flex flex-col items-center justify-center gap-4">
        <AlertTriangle size={40} className="text-red-400" />
        <h3 className="text-[18px] font-bold text-slate-900">Unable to generate roadmap.</h3>
        <p className="text-[14px] text-slate-500">{error}</p>
        <button
          onClick={() => generateRoadmap(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors"
        >
          <RefreshCw size={16} /> Try Again
        </button>
      </div>
    );
  }

  if (!roadmapData) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-16">
        <EmptyState
          icon={GitBranch}
          title="No roadmap generated yet"
          description="Complete your profile or add career goals to generate a personalized AI roadmap."
          actionText="Complete Profile"
          actionLink="/profile"
        />
      </div>
    );
  }

  const { goals = [], milestones = [], plan = {} } = roadmapData;
  const phaseKeys = ['30_days', '90_days', '6_months', '12_months'];

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-[28px] font-extrabold text-slate-900 tracking-tight mb-1 flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-[#6C4CF1]/10 flex items-center justify-center">
              <Map size={20} className="text-[#6C4CF1]" />
            </div>
            Career Roadmap
          </h1>
          <p className="text-[15px] text-slate-500 font-medium">
            Personalized AI-generated path based on your skills, goals, and resume.
          </p>
        </div>
        <button
          onClick={() => generateRoadmap(true)}
          className="flex items-center gap-2 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold px-4 py-2.5 rounded-xl transition-colors text-[13px]"
        >
          <RefreshCw size={15} /> Regenerate
        </button>
      </div>

      <CareerReadinessPanel />

      {/* Goals & Milestones */}
      {(goals.length > 0 || milestones.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h2 className="text-[16px] font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                <Target size={16} className="text-[#6C4CF1]" /> Career Goals
              </h2>
              <ul className="space-y-2">
                {goals.map((g, i) => (
                  <li key={i} className="flex items-start gap-2 text-[14px] text-slate-700 font-medium">
                    <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />{g}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {milestones.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h2 className="text-[16px] font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-[#6C4CF1]" /> Key Milestones
              </h2>
              <ul className="space-y-2">
                {milestones.map((m, i) => (
                  <li key={i} className="flex items-start gap-2 text-[14px] text-slate-700 font-medium">
                    <CalendarDays size={16} className="text-indigo-400 mt-0.5 shrink-0" />{m}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Phase Plans Grid */}
      <div>
        <h2 className="text-[20px] font-extrabold text-slate-900 mb-6 flex items-center gap-2">
          <GitBranch size={20} className="text-[#6C4CF1]" /> Your AI Roadmap
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {phaseKeys.map(key => plan[key] ? (
            <PhasePlanCard key={key} phaseKey={key} phase={plan[key]} />
          ) : null)}
        </div>
      </div>

      {/* Achievements */}
      <div className="mt-8">
        <AchievementsShowcase />
      </div>
    </div>
  );
}
