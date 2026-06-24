import { useCareerRoadmap } from '../../hooks/useCareerRoadmap';
import RoadmapWizard    from '../../components/roadmap/RoadmapWizard';
import RoadmapDashboard from '../../components/roadmap/RoadmapDashboard';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import ContextualBackButton from '../../components/navigation/ContextualBackButton';

export default function CareerRoadmapPage() {
  const { state, generate, toggleTask, reset } = useCareerRoadmap();
  const { status, roadmap, error, genError } = state;

  // ── 1. Auth resolving ────────────────────────────────────────────────────
  if (status === 'idle') {
    return (
      <div className="flex items-center justify-center h-[60vh] gap-3">
        <div className="w-8 h-8 rounded-full border-3 border-slate-200 border-t-[#6C4CF1] animate-spin" />
        <span className="text-sm font-semibold text-slate-400">Initializing…</span>
      </div>
    );
  }

  // ── 2. Fetching Firestore ─────────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-[60vh] flex-col gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-100 border-t-[#6C4CF1] animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Loading your roadmap…</p>
      </div>
    );
  }

  // ── 3. Unrecoverable fetch error ──────────────────────────────────────────
  if (status === 'error') {
    return (
      <div className="max-w-sm mx-auto px-4 py-24 flex flex-col items-center text-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
          <AlertTriangle size={28} className="text-red-400" />
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 mb-1">Could Not Load Roadmap</h3>
          <p className="text-sm text-slate-500">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 bg-[#6C4CF1] text-white font-bold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
        >
          <RefreshCw size={15} /> Try Again
        </button>
      </div>
    );
  }

  // ── 4. Wizard (no roadmap yet, or reset) ──────────────────────────────────
  if (status === 'wizard' || status === 'generating') {
    return (
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ContextualBackButton />
        <RoadmapWizard
          onGenerate={generate}
          isGenerating={status === 'generating'}
          genError={genError}
        />
      </div>
    );
  }

  // ── 5. Dashboard (roadmap loaded or just generated) ───────────────────────
  if (status === 'ready' && roadmap) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ContextualBackButton />
        <RoadmapDashboard
          roadmap={roadmap}
          toggleTask={toggleTask}
          onReset={reset}
        />
      </div>
    );
  }

  // Fallback — should never reach here
  return null;
}
