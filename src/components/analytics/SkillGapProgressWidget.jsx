import React from 'react';
import { Layers, CheckCircle2, Circle } from 'lucide-react';
import { useCareer } from '../../contexts/CareerContext';

export default function SkillGapProgressWidget() {
  const { careerContext } = useCareer();
  
  // We'll use mock "acquired" skills to show progress since we only track "missing" in context right now.
  // In a real scenario, we'd compare a base state with current state.
  const missingSkills = careerContext?.missingSkills || [];
  const totalSkillsIdentified = 12; // Example baseline
  const acquiredSkillsCount = Math.max(0, totalSkillsIdentified - missingSkills.length);
  const progressPercentage = Math.round((acquiredSkillsCount / totalSkillsIdentified) * 100) || 15;

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col justify-between h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
          <Layers size={20} className="text-purple-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800">Skill Gap Progress</h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Target: {careerContext?.targetRole || 'Software Engineer'}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-auto">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-3xl font-black text-slate-800">{progressPercentage}%</span>
            <span className="text-xs font-bold text-slate-400 ml-2 uppercase tracking-wide">Acquired</span>
          </div>
          <div className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md">
            {acquiredSkillsCount} / {totalSkillsIdentified} Skills
          </div>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <CheckCircle2 size={14} className="text-emerald-500" />
            <span>Core Competencies</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <Circle size={14} className="text-slate-300" />
            <span>Advanced Concepts</span>
          </div>
        </div>
      </div>
    </div>
  );
}
