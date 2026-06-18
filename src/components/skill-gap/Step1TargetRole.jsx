import { useState, useEffect, useRef } from 'react';
import { Target, ChevronRight, Code, Bot, BarChart2, Layers, ShieldCheck, Cloud, Infinity, Briefcase, Plus, CheckCircle2, Edit2 } from 'lucide-react';
import { useGoals } from '../../contexts/GoalContext';

const ROLES = [
  { id: 'Software Engineer', title: 'Software Engineer', desc: 'Design, build and maintain scalable software systems.', icon: Code, color: 'text-[#6C4CF1]', bg: 'bg-[#F4F1FE]' },
  { id: 'AI Engineer', title: 'AI Engineer', desc: 'Build intelligent systems using ML, NLP and GenAI.', icon: Bot, color: 'text-[#6C4CF1]', bg: 'bg-[#F4F1FE]' },
  { id: 'Data Scientist', title: 'Data Scientist', desc: 'Extract insights from data and build predictive models.', icon: BarChart2, color: 'text-[#6C4CF1]', bg: 'bg-[#F4F1FE]' },
  { id: 'Full Stack Developer', title: 'Full Stack Developer', desc: 'Work on frontend, backend and databases.', icon: Layers, color: 'text-[#10B981]', bg: 'bg-emerald-50' },
  { id: 'Cyber Security Engineer', title: 'Cyber Security Engineer', desc: 'Protect systems and data from cyber threats.', icon: ShieldCheck, color: 'text-[#EF4444]', bg: 'bg-red-50' },
  { id: 'Cloud Engineer', title: 'Cloud Engineer', desc: 'Design and manage secure cloud infrastructure.', icon: Cloud, color: 'text-[#0EA5E9]', bg: 'bg-sky-50' },
  { id: 'DevOps Engineer', title: 'DevOps Engineer', desc: 'Automate, deploy and scale applications seamlessly.', icon: Infinity, color: 'text-[#F59E0B]', bg: 'bg-amber-50' },
  { id: 'Product Manager', title: 'Product Manager', desc: 'Lead product strategy and build user-centric solutions.', icon: Briefcase, color: 'text-[#8B5CF6]', bg: 'bg-purple-50' },
  { id: 'other', title: 'Other / Custom Role', desc: 'Define a custom role and get a tailored analysis.', icon: Plus, color: 'text-slate-500', bg: 'bg-slate-100' },
];

export default function Step1TargetRole({ onSubmit, initialRole }) {
  const { goals } = useGoals();
  const [role, setRole] = useState(initialRole || '');
  const [customRole, setCustomRole] = useState('');
  const customInputRef = useRef(null);

  useEffect(() => {
    if (!initialRole && goals && goals.length > 0) {
      const activeGoal = goals.find(g => g.isActive) || goals[0];
      if (activeGoal && activeGoal.targetCareer) {
        if (ROLES.some(r => r.id === activeGoal.targetCareer)) {
          setRole(activeGoal.targetCareer);
        } else {
          setRole('other');
          setCustomRole(activeGoal.targetCareer);
        }
      }
    }
  }, [initialRole, goals]);

  const handleRoleSelect = (id) => {
    if (id === 'other') {
      setRole('other');
      setTimeout(() => customInputRef.current?.focus(), 50);
    } else {
      setRole(id);
      setCustomRole('');
    }
  };

  const handleCustomRoleChange = (e) => {
    setCustomRole(e.target.value);
    setRole('other');
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const finalRole = role === 'other' ? customRole.trim() : role.trim();
    if (finalRole) {
      onSubmit(finalRole);
    }
  };

  const activeRoleText = role === 'other' ? customRole : role;
  const canContinue = activeRoleText && activeRoleText.trim().length > 0;

  return (
    <div className="w-full max-w-[900px] bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden animate-in fade-in zoom-in-95 duration-500 flex flex-col">
      <div className="pt-6 px-6 lg:px-8 pb-0">
        
        {/* Top Section */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-10 h-10 bg-[#F8F6FE] rounded-xl flex items-center justify-center mb-3 border border-[#E9E4FC] shadow-sm">
            <Target size={20} className="text-[#6C4CF1]" />
          </div>
          <h1 className="text-xl lg:text-2xl font-black text-slate-900 mb-1 tracking-tight">What role are you preparing for?</h1>
          <p className="text-slate-500 font-medium text-[13px] max-w-xl">
            Select the career you're aiming for. We'll analyze your current skills and identify the gaps.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {ROLES.map((r) => {
              const isSelected = role === r.id;
              const Icon = r.icon;
              return (
                <div
                  key={r.id}
                  onClick={() => handleRoleSelect(r.id)}
                  className={`relative p-3 rounded-xl border-2 transition-all cursor-pointer group flex flex-col min-h-[90px] ${
                    isSelected 
                      ? 'border-[#6C4CF1] bg-[#F8F6FE] shadow-[0_4px_12px_-4px_rgba(108,76,241,0.12)]' 
                      : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="absolute top-3 right-3">
                    {isSelected ? (
                      <div className="w-4 h-4 rounded-full bg-[#6C4CF1] flex items-center justify-center shadow-sm">
                        <CheckCircle2 size={10} className="text-white" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-slate-200 group-hover:border-slate-300 transition-colors" />
                    )}
                  </div>

                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${r.bg}`}>
                    <Icon size={16} className={r.color} />
                  </div>
                  <h3 className="font-bold text-slate-900 text-[13px] mb-0.5">{r.title}</h3>
                  <p className="text-[11px] text-slate-500 font-medium leading-tight pr-4 line-clamp-2">{r.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* OR Divider */}
        <div className="flex items-center justify-center py-1 mb-3">
          <div className="h-px bg-slate-100 flex-1" />
          <span className="px-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">OR</span>
          <div className="h-px bg-slate-100 flex-1" />
        </div>

        {/* Custom Role Input */}
        <div 
          onClick={() => {
            setRole('other');
            customInputRef.current?.focus();
          }}
          className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-text mb-6 ${
            role === 'other'
              ? 'border-[#6C4CF1] bg-[#F8F6FE] shadow-[0_4px_12px_-4px_rgba(108,76,241,0.12)]'
              : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/50'
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-[#F8F6FE] flex items-center justify-center shrink-0">
            <Edit2 size={16} className="text-[#6C4CF1]" />
          </div>
          <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <div className="min-w-[140px]">
              <h3 className="font-bold text-slate-900 text-[13px]">Can't find your role?</h3>
              <p className="text-[11px] text-slate-500 font-medium">Enter target role here.</p>
            </div>
            <input
              ref={customInputRef}
              type="text"
              value={customRole}
              onChange={handleCustomRoleChange}
              placeholder="e.g. Robotics Engineer"
              className={`flex-1 w-full px-3 py-2 rounded-lg border text-[13px] font-semibold outline-none transition-all placeholder:font-medium placeholder:text-slate-400 ${
                role === 'other'
                  ? 'bg-white border-[#6C4CF1]/30 shadow-sm focus:border-[#6C4CF1] focus:ring-2 focus:ring-[#6C4CF1]/10 text-slate-900'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Bottom Sticky Selection Bar */}
      <div className="bg-[#F8F6FE] border-t border-[#E9E4FC] px-6 py-4 flex items-center justify-between mt-auto">
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Selected Role</span>
          {activeRoleText ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-[6px] bg-[#6C4CF1] flex items-center justify-center">
                <Code size={10} className="text-white" />
              </div>
              <span className="font-black text-slate-900 text-[14px]">{activeRoleText}</span>
              <button 
                onClick={() => {
                  setRole('');
                  setCustomRole('');
                }}
                className="text-[11px] font-bold text-[#6C4CF1] hover:text-[#5a3bc2] transition-colors ml-2"
              >
                Change
              </button>
            </div>
          ) : (
            <span className="text-[14px] font-bold text-slate-400 italic">None selected</span>
          )}
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={!canContinue}
          className="w-[220px] h-[52px] bg-[#6C4CF1] hover:bg-[#5A3BC2] disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-[14px] font-semibold text-[16px] flex items-center justify-center gap-[10px] shadow-[0_4px_14px_rgba(108,76,241,0.39)] hover:shadow-[0_6px_20px_rgba(108,76,241,0.23)] hover:-translate-y-0.5 disabled:hover:translate-y-0 disabled:shadow-none transition-all duration-200 active:scale-[0.98] disabled:active:scale-100 overflow-visible"
        >
          Continue <ChevronRight size={18} className="text-white" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
