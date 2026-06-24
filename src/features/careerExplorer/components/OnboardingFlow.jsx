import React, { useState } from 'react';
import { onboardingOptions } from '../data/careerPathsDb';
import { ChevronRight, ChevronLeft, Check, Sparkles } from 'lucide-react';

export default function OnboardingFlow({ onComplete, initialData }) {
  const [step, setStep] = useState(1);
  const [selections, setSelections] = useState(initialData);

  const toggleSelection = (category, item) => {
    setSelections(prev => {
      const current = prev[category];
      if (current.includes(item)) {
        return { ...prev, [category]: current.filter(i => i !== item) };
      } else {
        return { ...prev, [category]: [...current, item] };
      }
    });
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else onComplete(selections);
  };

  const renderStepContent = () => {
    let title, description, category, options;

    if (step === 1) {
      title = "What are you interested in?";
      description = "Select the fields or topics that excite you the most.";
      category = "interests";
      options = onboardingOptions.interests;
    } else if (step === 2) {
      title = "What are your top strengths?";
      description = "Choose the skills where you naturally excel.";
      category = "strengths";
      options = onboardingOptions.strengths;
    } else {
      title = "How do you prefer to work?";
      description = "Let us know your ideal working environment.";
      category = "workPreferences";
      options = onboardingOptions.workPreferences;
    }

    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{title}</h2>
        <p className="text-slate-500 mb-8">{description}</p>
        
        <div className="flex flex-wrap gap-3">
          {options.map(option => {
            const isSelected = selections[category].includes(option);
            return (
              <button
                key={option}
                onClick={() => toggleSelection(category, option)}
                className={`px-4 py-3 rounded-xl text-[14px] font-semibold transition-all duration-200 flex items-center gap-2 border-2 ${
                  isSelected 
                    ? 'bg-indigo-50 border-[#6D5DF6] text-[#6D5DF6] shadow-sm' 
                    : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {isSelected && <Check size={16} className="text-[#6D5DF6]" />}
                {option}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mt-4">
      {/* Progress Indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex-1 flex items-center gap-2">
            <div className={`h-2 flex-1 rounded-full transition-colors duration-300 ${i <= step ? 'bg-[#6D5DF6]' : 'bg-slate-100'}`} />
          </div>
        ))}
      </div>

      <div className="min-h-[300px]">
        {renderStepContent()}
      </div>

      <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-100">
        <button
          onClick={() => setStep(step - 1)}
          disabled={step === 1}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-colors ${
            step === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          <ChevronLeft size={18} /> Back
        </button>
        
        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#6D5DF6] hover:bg-[#5a4add] text-white rounded-xl font-bold transition-colors shadow-sm"
        >
          {step === 3 ? (
            <>Discover Paths <Sparkles size={18} /></>
          ) : (
            <>Continue <ChevronRight size={18} /></>
          )}
        </button>
      </div>
    </div>
  );
}
