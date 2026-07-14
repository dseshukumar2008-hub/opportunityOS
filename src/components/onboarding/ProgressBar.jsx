import React from 'react';

export default function ProgressBar({ currentStep, totalSteps }) {
  // If we are on success step (6), treat it as 100%
  const activeStep = Math.min(currentStep, totalSteps);
  const percentage = (activeStep / totalSteps) * 100;

  return (
    <div className="w-full flex flex-col items-center justify-center gap-3">
      <div className="text-[13px] font-bold text-slate-500 uppercase tracking-widest animate-in fade-in">
        Step {activeStep} of {totalSteps}
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-[#6C4CF1] to-[#4F46E5] transition-all duration-700 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
