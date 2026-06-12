import { Check } from 'lucide-react';

export default function DemoTimeline({ steps, currentStep }) {
  return (
    <div className="relative border-l-2 border-slate-100 ml-4 py-4 space-y-8">
      {steps.map((step, index) => {
        const stepNum = index + 1;
        const isCompleted = stepNum < currentStep;
        const isActive = stepNum === currentStep;
        
        let circleClasses = "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm absolute -left-[17px] transition-all duration-300";
        let textClasses = "ml-8 transition-all duration-300";
        
        if (isCompleted) {
          circleClasses += " bg-[#6C4CF1] text-white shadow-md shadow-indigo-200";
          textClasses += " opacity-60";
        } else if (isActive) {
          circleClasses += " bg-[#6C4CF1] text-white ring-4 ring-indigo-50 scale-110 shadow-lg shadow-indigo-200";
          textClasses += " font-bold transform translate-x-1";
        } else {
          circleClasses += " bg-white border-2 border-slate-200 text-slate-400";
          textClasses += " text-slate-500";
        }

        return (
          <div key={step.id} className="relative flex items-center">
            <div className={circleClasses}>
              {isCompleted ? <Check size={16} strokeWidth={3} /> : stepNum}
            </div>
            <div className={textClasses}>
              <h3 className={`text-[15px] ${isActive ? 'text-slate-900 font-bold' : 'text-slate-700 font-medium'}`}>
                {step.title}
              </h3>
              {isActive && (
                <p className="text-[13px] text-slate-500 mt-1 font-medium leading-relaxed">
                  {step.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
