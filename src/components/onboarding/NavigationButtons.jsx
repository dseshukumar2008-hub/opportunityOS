import React, { useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function NavigationButtons({ onNext, onBack, isFirstStep, isLastStep }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        onNext();
      } else if (e.key === 'ArrowLeft') {
        if (!isFirstStep) onBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onBack, isFirstStep]);

  return (
    <div className="flex items-center justify-between w-full mt-8 pt-4 border-t border-slate-100">
      <button
        onClick={onBack}
        disabled={isFirstStep}
        className={`h-11 px-5 flex items-center gap-2 font-bold text-[14px] rounded-xl transition-all ${
          isFirstStep 
            ? 'opacity-0 pointer-events-none' 
            : 'text-slate-600 hover:bg-slate-100 bg-white border border-slate-200 shadow-sm'
        }`}
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <button
        onClick={onNext}
        className="h-11 px-6 flex items-center gap-2 font-bold text-[14px] text-white bg-gradient-to-r from-[#6C4CF1] to-[#4F46E5] hover:from-[#5b3fda] hover:to-[#4338ca] rounded-xl transition-all shadow-[0_4px_15px_rgba(108,76,241,0.2)]"
      >
        {isLastStep ? 'Complete Setup' : 'Next'}
        {isLastStep ? <CheckCircle2 size={16} /> : <ArrowRight size={16} />}
      </button>
    </div>
  );
}
