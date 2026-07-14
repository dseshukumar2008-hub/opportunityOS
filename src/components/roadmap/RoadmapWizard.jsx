import { useState, useEffect } from 'react';
import {
  ChevronRight, ChevronLeft, Sparkles, GraduationCap,
  GitBranch, CalendarDays, Target, CheckCircle2, AlertTriangle,
  Code, Bot, LineChart, Layers, ShieldCheck, Settings, Cloud, 
  Briefcase, Palette, Rocket, Microscope
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────

const STEPS = [
  { num: 1, label: 'Course',      icon: GraduationCap },
  { num: 2, label: 'Branch',      icon: GitBranch },
  { num: 3, label: 'Year',        icon: CalendarDays },
  { num: 4, label: 'Career Goal', icon: Target },
  { num: 5, label: 'Generate',    icon: Sparkles },
];

const COURSES = ['B.Tech', 'M.Tech', 'BCA', 'MCA', 'MBA', 'B.Sc', 'M.Sc', 'Diploma', 'B.Com', 'BA', 'Other'];

const BRANCHES_BY_COURSE = {
  'B.Tech':  ['Computer Science', 'AI & ML', 'Data Science', 'Information Technology', 'Cyber Security', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Chemical', 'Other'],
  'M.Tech':  ['Computer Science', 'AI & ML', 'Data Science', 'Cyber Security', 'VLSI', 'Robotics', 'Other'],
  'BCA':     ['Computer Applications', 'Data Science', 'AI', 'Web Development', 'Other'],
  'MCA':     ['Computer Applications', 'Software Engineering', 'AI & ML', 'Other'],
  'MBA':     ['Marketing', 'Finance', 'HR', 'Operations', 'Business Analytics', 'Entrepreneurship', 'Other'],
  default:   ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Commerce', 'Science', 'Arts', 'Other'],
};

const YEARS = ['1st Year', '2nd Year', '3rd Year', 'Final Year', 'Graduate'];

const CAREERS = [
  { label: 'Software Engineer',       icon: Code,        desc: 'Build scalable software systems' },
  { label: 'AI Engineer',             icon: Bot,         desc: 'Build AI applications, agents and ML systems' },
  { label: 'Data Scientist',          icon: LineChart,   desc: 'Analyze data and build predictive models' },
  { label: 'Full Stack Developer',    icon: Layers,      desc: 'Develop complete frontend and backend applications' },
  { label: 'Cyber Security Engineer', icon: ShieldCheck, desc: 'Protect systems and applications' },
  { label: 'DevOps Engineer',         icon: Settings,    desc: 'Automate deployment and infrastructure' },
  { label: 'Cloud Engineer',          icon: Cloud,       desc: 'Build and manage cloud platforms' },
  { label: 'Product Manager',         icon: Briefcase,   desc: 'Lead product strategy and execution' },
  { label: 'UI/UX Designer',          icon: Palette,     desc: 'Design user experiences and interfaces' },
  { label: 'Entrepreneur',            icon: Rocket,      desc: 'Build and launch startups' },
  { label: 'Higher Studies',          icon: Microscope,  desc: 'Prepare for Masters, Research or PhD' },
];

const GEN_STAGES = [
  'Analyzing your profile…',
  'Mapping career requirements…',
  'Designing your 5 phases…',
  'Curating resources & projects…',
  'Finalizing your roadmap…',
];

// ─── Option button ─────────────────────────────────────────────────────────────

function OptionButton({ label, icon, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-start gap-2 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
        selected
          ? 'border-[#6C4CF1] bg-[#6C4CF1]/5 shadow-md'
          : 'border-slate-100 bg-white hover:border-indigo-200 hover:bg-slate-50'
      }`}
    >
      {selected && (
        <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[#6C4CF1] flex items-center justify-center">
          <CheckCircle2 size={12} strokeWidth={3} className="text-white" />
        </div>
      )}
      {icon && <span className="text-2xl leading-none">{icon}</span>}
      <span className={`text-[13px] font-bold leading-snug ${selected ? 'text-[#6C4CF1]' : 'text-slate-800'}`}>{label}</span>
    </button>
  );
}

function CareerOptionButton({ label, icon: Icon, desc, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-start gap-2 p-4 rounded-2xl border text-left transition-all duration-200 h-[115px] ${
        selected
          ? 'border-[#6C4CF1] bg-[#6C4CF1]/5 shadow-md shadow-indigo-100'
          : 'border-slate-200 bg-white hover:border-[#6C4CF1]/40 hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      {selected && (
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#6C4CF1] flex items-center justify-center">
          <CheckCircle2 size={12} strokeWidth={3} className="text-white" />
        </div>
      )}
      {Icon && <Icon size={20} className={selected ? 'text-[#6C4CF1]' : 'text-slate-500'} />}
      <div className="mt-auto w-full">
        <span className={`block text-[13px] font-bold leading-tight mb-1 truncate ${selected ? 'text-[#6C4CF1]' : 'text-slate-800'}`}>{label}</span>
        <span className={`block text-[11px] font-medium leading-tight line-clamp-2 ${selected ? 'text-indigo-600/80' : 'text-slate-500'}`}>{desc}</span>
      </div>
    </button>
  );
}

// ─── Step indicator ────────────────────────────────────────────────────────────

function StepTrack({ current }) {
  return (
    <div className="flex items-center gap-1.5">
      {STEPS.map((s) => {
        const Icon    = s.icon;
        const past    = s.num < current;
        const active  = s.num === current;
        return (
          <div key={s.num} className="flex items-center gap-1.5">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
              past ? 'bg-emerald-500' : active ? 'bg-[#6C4CF1]' : 'bg-slate-100'
            }`}>
              {past
                ? <CheckCircle2 size={14} className="text-white" strokeWidth={3} />
                : <Icon size={13} className={active ? 'text-white' : 'text-slate-400'} />}
            </div>
            {s.num < STEPS.length && (
              <div className={`w-5 h-0.5 rounded-full ${s.num < current ? 'bg-emerald-400' : 'bg-slate-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Generating screen ────────────────────────────────────────────────────────
// Self-contained — manages its own stage ticker via useEffect (properly cleaned up)

function GeneratingScreen({ targetCareer }) {
  const [stageIdx, setStageIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStageIdx(prev => {
        const next = prev + 1;
        if (next >= GEN_STAGES.length) {
          clearInterval(timer);
          return prev; // stop at last stage
        }
        return next;
      });
    }, 1800);
    // Cleanup clears interval when isGenerating becomes false and component unmounts
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
      <div className="relative w-20 h-20 mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
        <div className="absolute inset-0 rounded-full border-4 border-t-[#6C4CF1] border-x-transparent border-b-transparent animate-spin" />
        <div className="absolute inset-3 rounded-full bg-indigo-50 flex items-center justify-center">
          <Sparkles size={20} className="text-[#6C4CF1]" />
        </div>
      </div>
      <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Building Your Career OS</h2>
      <p className="text-slate-500 text-sm font-medium mb-8">
        Creating a personalized roadmap for{' '}
        <span className="text-[#6C4CF1] font-bold">{targetCareer}</span>
      </p>
      <div className="space-y-3 w-full max-w-xs">
        {GEN_STAGES.map((stage, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 transition-opacity duration-500 ${i > stageIdx ? 'opacity-20' : 'opacity-100'}`}
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
              i < stageIdx   ? 'bg-emerald-500' :
              i === stageIdx ? 'bg-[#6C4CF1] animate-pulse' : 'bg-slate-200'
            }`}>
              {i < stageIdx
                ? <CheckCircle2 size={11} strokeWidth={3} className="text-white" />
                : <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
            <span className={`text-sm font-semibold ${i === stageIdx ? 'text-slate-900' : 'text-slate-400'}`}>
              {stage}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Wizard ──────────────────────────────────────────────────────────────

import { useLocation } from 'react-router-dom';

export default function RoadmapWizard({ onGenerate, isGenerating, genError }) {
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(() => {
    const params = new URLSearchParams(location.search);
    const targetRole = params.get('targetRole');
    return { course: '', branch: '', year: '', targetCareer: targetRole || '' };
  });

  const set      = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
  const branches = BRANCHES_BY_COURSE[form.course] || BRANCHES_BY_COURSE.default;

  const isStepValid = () => {
    if (step === 1) return !!form.course;
    if (step === 2) return !!form.branch;
    if (step === 3) return !!form.year;
    if (step === 4) return !!form.targetCareer;
    return true;
  };

  const handleNext = () => {
    if (step < 5) { setStep(s => s + 1); return; }
    // Step 5 → kick off generation (parent controls isGenerating state)
    onGenerate(form);
  };

  // Show generating screen — entirely controlled by isGenerating prop from parent
  if (isGenerating) {
    return <GeneratingScreen targetCareer={form.targetCareer} />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Career Roadmap Setup</h1>
          <p className="text-sm font-medium text-slate-500 mt-0.5">Step {step} of 5</p>
        </div>
        <StepTrack current={step} />
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-8">
        <div
          className="h-full bg-gradient-to-r from-indigo-400 to-[#6C4CF1] rounded-full transition-all duration-500"
          style={{ width: `${(step / 5) * 100}%` }}
        />
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 min-h-[380px] flex flex-col">
        <div className="flex-1">

          {/* Step 1 */}
          {step === 1 && (
            <>
              <p className="text-xl font-extrabold text-slate-900 mb-1">What are you studying?</p>
              <p className="text-sm text-slate-500 font-medium mb-6">Select your current degree program.</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {COURSES.map(c => (
                  <OptionButton key={c} label={c} selected={form.course === c} onClick={() => set('course', c)} />
                ))}
              </div>
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <p className="text-xl font-extrabold text-slate-900 mb-1">Your specialization?</p>
              <p className="text-sm text-slate-500 font-medium mb-6">Select the branch closest to yours.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {branches.map(b => (
                  <OptionButton key={b} label={b} selected={form.branch === b} onClick={() => set('branch', b)} />
                ))}
              </div>
            </>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <>
              <p className="text-xl font-extrabold text-slate-900 mb-1">Where are you in your journey?</p>
              <p className="text-sm text-slate-500 font-medium mb-6">This helps us tailor your timeline.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {YEARS.map(y => (
                  <OptionButton key={y} label={y} selected={form.year === y} onClick={() => set('year', y)} />
                ))}
              </div>
            </>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <>
              <p className="text-xl font-extrabold text-slate-900 mb-1">What's your dream career?</p>
              <p className="text-sm text-slate-500 font-medium mb-6">Every phase will be built around this goal.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {CAREERS.map(c => (
                  <CareerOptionButton 
                    key={c.label} 
                    label={c.label} 
                    icon={c.icon} 
                    desc={c.desc} 
                    selected={form.targetCareer === c.label} 
                    onClick={() => set('targetCareer', c.label)} 
                  />
                ))}
              </div>
            </>
          )}

          {/* Step 5 — Review & Generate */}
          {step === 5 && (
            <>
              <p className="text-xl font-extrabold text-slate-900 mb-1">Ready to build your roadmap? 🚀</p>
              <p className="text-sm text-slate-500 font-medium mb-6">
                Gemini AI will generate a personalized 5-phase roadmap saved to your account.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { k: 'Course',      v: form.course,       e: '🎓' },
                  { k: 'Branch',      v: form.branch,       e: '🔀' },
                  { k: 'Year',        v: form.year,         e: '📅' },
                  { k: 'Career Goal', v: form.targetCareer, e: '🎯' },
                ].map(item => (
                  <div key={item.k} className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-xl">{item.e}</span>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.k}</p>
                      <p className="text-[13px] font-bold text-slate-800">{item.v}</p>
                    </div>
                  </div>
                ))}
              </div>



              <p className="text-xs text-center text-slate-400 font-medium">
                ✨ Powered by OpportunityOS Intelligence · Takes 15–30 seconds
              </p>
            </>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
          <button
            onClick={() => setStep(s => Math.max(s - 1, 1))}
            disabled={step === 1}
            className="flex items-center gap-1.5 px-4 py-2.5 font-bold text-slate-500 hover:text-slate-800 disabled:opacity-0 rounded-xl hover:bg-slate-50 transition-all"
          >
            <ChevronLeft size={18} /> Back
          </button>

          <button
            onClick={handleNext}
            disabled={!isStepValid()}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white transition-all disabled:opacity-40 ${
              step === 5
                ? 'bg-gradient-to-r from-indigo-500 to-[#6C4CF1] hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5'
                : 'bg-[#6C4CF1] hover:bg-indigo-700'
            }`}
          >
            {step === 5
              ? <><Sparkles size={15} /> Generate Roadmap</>
              : <>Continue <ChevronRight size={17} /></>}
          </button>
        </div>
      </div>
    </div>
  );
}
