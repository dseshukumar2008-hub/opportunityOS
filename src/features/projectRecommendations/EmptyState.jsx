import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Monitor, BrainCircuit, BarChart, ShieldCheck, Laptop, Cpu, Zap, Settings, Building, MoreHorizontal,
  Code2, Layers, BarChart2, Bot, Infinity as InfinityIcon, Shield, Cloud, User, Smartphone, Sparkles, ArrowRight
} from 'lucide-react';

const SPECIALIZATIONS = [
  { id: 'Computer Science', label: 'Computer Science', icon: Monitor, color: 'text-indigo-500' },
  { id: 'AI & ML', label: 'AI & ML', icon: BrainCircuit, color: 'text-blue-500' },
  { id: 'Data Science', label: 'Data Science', icon: BarChart, color: 'text-purple-500' },
  { id: 'Cyber Security', label: 'Cyber Security', icon: ShieldCheck, color: 'text-emerald-500' },
  { id: 'Information Technology', label: 'Information Technology', icon: Laptop, color: 'text-sky-500' },
  { id: 'ECE', label: 'ECE', icon: Cpu, color: 'text-teal-500' },
  { id: 'EEE', label: 'EEE', icon: Zap, color: 'text-violet-500' },
  { id: 'Mechanical', label: 'Mechanical', icon: Settings, color: 'text-slate-500' },
  { id: 'Civil', label: 'Civil', icon: Building, color: 'text-blue-400' },
  { id: 'Other', label: 'Other', icon: MoreHorizontal, color: 'text-slate-600' }
];

const TARGET_ROLES = [
  { id: 'Software Engineer', label: 'Software Engineer', icon: Code2, color: 'text-indigo-500' },
  { id: 'Full Stack Developer', label: 'Full Stack Developer', icon: Layers, color: 'text-emerald-500' },
  { id: 'Data Scientist', label: 'Data Scientist', icon: BarChart2, color: 'text-purple-500' },
  { id: 'AI/ML Engineer', label: 'AI/ML Engineer', icon: Bot, color: 'text-emerald-500' },
  { id: 'DevOps Engineer', label: 'DevOps Engineer', icon: InfinityIcon, color: 'text-indigo-500' },
  { id: 'Cyber Security Engineer', label: 'Cyber Security Engineer', icon: Shield, color: 'text-emerald-600' },
  { id: 'Cloud Engineer', label: 'Cloud Engineer', icon: Cloud, color: 'text-sky-500' },
  { id: 'Product Manager', label: 'Product Manager', icon: User, color: 'text-violet-500' },
  { id: 'Mobile App Developer', label: 'Mobile App Developer', icon: Smartphone, color: 'text-blue-500' },
  { id: 'Other', label: 'Other', icon: MoreHorizontal, color: 'text-slate-600' }
];

function SelectionCard({ item, selected, onClick }) {
  const Icon = item.icon;
  return (
    <button
      onClick={() => onClick(item.id)}
      className={`relative w-full p-4 rounded-2xl border transition-all duration-200 flex flex-col items-center justify-center gap-3 bg-white hover:border-[#6D4AFF] group ${
        selected 
          ? 'border-[#6D4AFF] bg-[#6D4AFF]/[0.02] shadow-[0_4px_20px_-4px_rgba(109,74,255,0.1)]' 
          : 'border-slate-200 shadow-sm'
      }`}
    >
      <div className={`p-2 rounded-xl transition-colors ${selected ? 'bg-[#6D4AFF]/10' : 'bg-slate-50 group-hover:bg-[#6D4AFF]/5'}`}>
        <Icon className={`w-6 h-6 ${selected ? 'text-[#6D4AFF]' : item.color}`} />
      </div>
      <span className={`text-[13px] font-bold ${selected ? 'text-[#6D4AFF]' : 'text-slate-700'}`}>
        {item.label}
      </span>
      {selected && (
        <div className="absolute top-3 right-3 w-5 h-5 bg-[#6D4AFF] rounded-full flex items-center justify-center text-white">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
      )}
    </button>
  );
}

export default function EmptyState({ 
  specialization, 
  setSpecialization, 
  targetRole, 
  setTargetRole, 
  onGenerate 
}) {
  const [step, setStep] = useState(1);

  const handleContinue = () => {
    if (specialization) setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setTargetRole(''); // Optional: clear target role if going back
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 mb-3 flex items-center justify-center gap-2">
          Let's build something amazing <span className="text-2xl">🚀</span>
        </h2>
        <p className="text-slate-500 text-sm">
          Tell us your academic background and the role you're aiming for.<br/>
          We'll generate project ideas that help you get there.
        </p>
      </div>

      <div className="w-full max-w-[1100px] bg-white border border-[#EAEAEA] rounded-[20px] p-8 md:p-10 shadow-sm">
        
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            {/* Section 1 */}
            <div className="mb-12">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-8 h-8 rounded-full bg-[#6D4AFF] text-white flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">What is your specialization?</h3>
                  <p className="text-sm text-slate-500 mt-1">Select your primary field of study or expertise.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 ml-12">
                {SPECIALIZATIONS.map(spec => (
                  <SelectionCard 
                    key={spec.id} 
                    item={spec} 
                    selected={specialization === spec.id}
                    onClick={setSpecialization}
                  />
                ))}
              </div>
            </div>

            {/* CTA Step 1 */}
            <div className="flex flex-col items-center justify-center pt-8 border-t border-slate-100">
              <button
                onClick={handleContinue}
                disabled={!specialization}
                className={`px-8 py-4 rounded-[14px] font-bold text-[15px] flex items-center gap-2 transition-all shadow-[0_4px_14px_rgba(109,74,255,0.3)] ${
                  specialization 
                    ? 'bg-gradient-to-r from-[#6D4AFF] to-[#8668FF] text-white hover:shadow-[0_6px_20px_rgba(109,74,255,0.4)] hover:-translate-y-0.5' 
                    : 'bg-slate-100 text-slate-400 shadow-none cursor-not-allowed'
                }`}
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            
            {/* Display Selected Specialization */}
            <div className="mb-8 ml-12 flex items-center justify-between bg-indigo-50/50 border border-indigo-100 rounded-xl p-4">
              <div>
                <p className="text-xs font-bold text-[#6D4AFF] uppercase tracking-wider mb-1">Selected Specialization</p>
                <p className="text-slate-800 font-semibold">{SPECIALIZATIONS.find(s => s.id === specialization)?.label || specialization}</p>
              </div>
              <button onClick={handleBack} className="text-sm font-medium text-slate-500 hover:text-[#6D4AFF] transition-colors underline">
                Change
              </button>
            </div>

            {/* Section 2 */}
            <div className="mb-12">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-8 h-8 rounded-full bg-[#6D4AFF] text-white flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">What role are you targeting?</h3>
                  <p className="text-sm text-slate-500 mt-1">Select the career role you're working towards.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 ml-12">
                {TARGET_ROLES.map(role => (
                  <SelectionCard 
                    key={role.id} 
                    item={role} 
                    selected={targetRole === role.id}
                    onClick={setTargetRole}
                  />
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="flex flex-col items-center justify-center pt-8 border-t border-slate-100">
              <button
                onClick={onGenerate}
                disabled={!targetRole}
                className={`px-8 py-4 rounded-[14px] font-bold text-[15px] flex items-center gap-2 transition-all shadow-[0_4px_14px_rgba(109,74,255,0.3)] ${
                  targetRole 
                    ? 'bg-gradient-to-r from-[#6D4AFF] to-[#8668FF] text-white hover:shadow-[0_6px_20px_rgba(109,74,255,0.4)] hover:-translate-y-0.5' 
                    : 'bg-slate-100 text-slate-400 shadow-none cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-5 h-5" />
                Generate Project Ideas
              </button>
              <p className="text-slate-500 text-[13px] mt-4 font-medium">
                We'll suggest real-world, portfolio-worthy projects just for you.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
