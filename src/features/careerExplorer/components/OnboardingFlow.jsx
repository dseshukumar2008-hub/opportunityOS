import React, { useState } from 'react';
import { onboardingOptions } from '../data/careerPathsDb';
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Sparkles,
  Rocket,
  Code, 
  PenTool, 
  BarChart3, 
  Cpu, 
  Briefcase, 
  Megaphone, 
  Cloud, 
  Shield, 
  Package,
  Lightbulb,
  Palette,
  MessageSquare,
  Flag,
  Search,
  Heart,
  Zap,
  Globe,
  Building,
  User,
  Users,
  MessageCircle,
  Settings
} from 'lucide-react';

const ICON_MAP = {
  Code, 
  PenTool, 
  BarChart3, 
  Cpu, 
  Briefcase, 
  Megaphone, 
  Cloud, 
  Shield, 
  Package,
  Lightbulb,
  Palette,
  MessageSquare,
  Flag,
  Search,
  Heart,
  Zap,
  Globe,
  Building,
  User,
  Users,
  MessageCircle,
  Settings
};

export default function OnboardingFlow({ onComplete, initialData }) {
  const [step, setStep] = useState(1);
  const [selections, setSelections] = useState(initialData);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);

  const toggleSelection = (category, itemId) => {
    setSelections(prev => {
      const current = prev[category];
      if (current.includes(itemId)) {
        return { ...prev, [category]: current.filter(i => i !== itemId) };
      } else {
        return { ...prev, [category]: [...current, itemId] };
      }
    });
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsAnalyzing(true);
      const aiSteps = [
        "Analyzing your interests...",
        "Evaluating technical skills...",
        "Aligning with career goals...",
        "Matching with industry paths...",
        "Discovering hidden opportunities...",
        "Generating personalized recommendations..."
      ];
      
      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        if (currentStep < aiSteps.length) {
          setAnalysisStep(currentStep);
        } else {
          clearInterval(interval);
          setTimeout(() => onComplete(selections), 600);
        }
      }, 700);
    }
  };

  const steps = [
    { num: 1, label: 'Interests' },
    { num: 2, label: 'Skills' },
    { num: 3, label: 'Goals' }
  ];

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-[#111827] tracking-tight mb-1 lg:mb-2">What are you interested in?</h2>
              <p className="text-[#64748B] text-base">
                Pick the fields or topics that excite you the most. You can <span className="text-[#6D5DF6] font-semibold">choose multiple</span>.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
            {onboardingOptions.interests.map((option) => {
              const isSelected = selections.interests.includes(option.id);
              const IconComp = ICON_MAP[option.icon] || Code;
              
              return (
                <button
                  key={option.id}
                  onClick={() => toggleSelection('interests', option.id)}
                  className={`relative text-left p-4 lg:p-5 rounded-2xl border-2 transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg bg-white overflow-hidden flex flex-col h-full ${
                    isSelected 
                      ? 'border-[#6D5DF6] shadow-[0_8px_30px_rgba(109,93,246,0.12)]' 
                      : 'border-transparent shadow-[0_2px_15px_rgba(0,0,0,0.04)] hover:border-indigo-100'
                  }`}
                >
                  {/* Selection Indicator */}
                  <div className={`absolute top-5 right-5 w-5 h-5 rounded-full border-2 transition-colors flex items-center justify-center ${
                    isSelected ? 'border-[#6D5DF6] bg-[#6D5DF6]' : 'border-slate-200'
                  }`}>
                    {isSelected && <Check size={12} className="text-white" />}
                  </div>

                  {/* Icon Circle */}
                  <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full mb-2 lg:mb-3 flex items-center justify-center ${
                    isSelected ? 'bg-indigo-50' : 'bg-slate-50 group-hover:bg-indigo-50/50'
                  } transition-colors`}>
                    <IconComp size={20} className={isSelected ? 'text-[#6D5DF6]' : 'text-slate-500 group-hover:text-[#6D5DF6]'} />
                  </div>

                  <h3 className="font-bold text-[#111827] text-sm lg:text-base mb-1">{option.title}</h3>
                  <p className="text-xs lg:text-sm text-[#64748B] leading-snug pr-2 flex-1">
                    {option.desc}
                  </p>
                  
                  {/* Glassmorphism Glow Effect behind selected items */}
                  {isSelected && (
                    <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 blur-xl -z-10 pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      );
    } 
    
    if (step === 3) {
      return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-[#111827] tracking-tight mb-1 lg:mb-2">How do you prefer to work?</h2>
              <p className="text-[#64748B] text-base">
                Select the work environments and collaboration styles that suit you best.
              </p>
            </div>
            <div className="bg-indigo-50 text-[#6D5DF6] px-4 py-1.5 rounded-full text-sm font-bold shadow-sm whitespace-nowrap">
              {selections.workPreferences.length} selected
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {onboardingOptions.workPreferences.map((option) => {
              const isSelected = selections.workPreferences.includes(option.id);
              const IconComp = ICON_MAP[option.icon] || Code;
              
              return (
                <button
                  key={option.id}
                  onClick={() => toggleSelection('workPreferences', option.id)}
                  className={`relative text-left p-4 rounded-2xl border-2 transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg bg-white overflow-hidden flex flex-col h-full ${
                    isSelected 
                      ? 'border-[#6D5DF6] shadow-[0_8px_30px_rgba(109,93,246,0.12)]' 
                      : 'border-transparent shadow-[0_2px_15px_rgba(0,0,0,0.04)] hover:border-indigo-100'
                  }`}
                >
                  <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 transition-colors flex items-center justify-center ${
                    isSelected ? 'border-[#6D5DF6] bg-[#6D5DF6]' : 'border-slate-200'
                  }`}>
                    {isSelected && <Check size={12} className="text-white" />}
                  </div>

                  <div className={`w-10 h-10 rounded-full mb-3 flex items-center justify-center ${
                    isSelected ? 'bg-indigo-50' : 'bg-slate-50 group-hover:bg-indigo-50/50'
                  } transition-colors`}>
                    <IconComp size={18} className={isSelected ? 'text-[#6D5DF6]' : 'text-slate-500 group-hover:text-[#6D5DF6]'} />
                  </div>

                  <h3 className="font-bold text-[#111827] text-sm mb-1">{option.title}</h3>
                  <p className="text-xs text-[#64748B] leading-snug">
                    {option.desc}
                  </p>
                  
                  {isSelected && (
                    <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 blur-xl -z-10 pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    // Fallback UI for any unexpected step
    let title, description, category, options;
    if (step === 2) {
      return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-[#111827] tracking-tight mb-1 lg:mb-2">What are your top strengths?</h2>
              <p className="text-[#64748B] text-base">
                Choose the skills where you naturally excel. You can <span className="text-[#6D5DF6] font-semibold">choose multiple</span>.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
            {onboardingOptions.strengths.map((option) => {
              const isSelected = selections.strengths.includes(option.id);
              const IconComp = ICON_MAP[option.icon] || Code;
              
              return (
                <button
                  key={option.id}
                  onClick={() => toggleSelection('strengths', option.id)}
                  className={`relative text-left p-4 lg:p-5 rounded-2xl border-2 transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg bg-white overflow-hidden flex flex-col h-full ${
                    isSelected 
                      ? 'border-[#6D5DF6] shadow-[0_8px_30px_rgba(109,93,246,0.12)]' 
                      : 'border-transparent shadow-[0_2px_15px_rgba(0,0,0,0.04)] hover:border-indigo-100'
                  }`}
                >
                  <div className={`absolute top-5 right-5 w-5 h-5 rounded-full border-2 transition-colors flex items-center justify-center ${
                    isSelected ? 'border-[#6D5DF6] bg-[#6D5DF6]' : 'border-slate-200'
                  }`}>
                    {isSelected && <Check size={12} className="text-white" />}
                  </div>

                  <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full mb-2 lg:mb-3 flex items-center justify-center ${
                    isSelected ? 'bg-indigo-50' : 'bg-slate-50 group-hover:bg-indigo-50/50'
                  } transition-colors`}>
                    <IconComp size={20} className={isSelected ? 'text-[#6D5DF6]' : 'text-slate-500 group-hover:text-[#6D5DF6]'} />
                  </div>

                  <h3 className="font-bold text-[#111827] text-sm lg:text-base mb-1">{option.title}</h3>
                  <p className="text-xs lg:text-sm text-[#64748B] leading-snug pr-2 flex-1">
                    {option.desc}
                  </p>
                  
                  {isSelected && (
                    <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 blur-xl -z-10 pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  if (isAnalyzing) {
    const aiSteps = [
      "Analyzing your interests...",
      "Evaluating technical skills...",
      "Aligning with career goals...",
      "Matching with industry paths...",
      "Discovering hidden opportunities...",
      "Generating personalized recommendations..."
    ];

    return (
      <div className="relative min-h-[calc(100vh-140px)] flex flex-col items-center justify-center pt-0 px-4">
        <div className="fixed top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="fixed bottom-20 right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="text-center max-w-md w-full animate-in fade-in zoom-in-95 duration-700 relative z-10">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full animate-pulse blur-xl opacity-50" />
            <div className="relative w-full h-full bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-indigo-50">
              <Sparkles className="w-10 h-10 text-indigo-500" />
            </div>
          </div>
          
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">AI Career Architect</h2>
          <p className="text-slate-500 text-sm mb-8">We are building your personalized career roadmap...</p>
          
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white text-left">
            {aiSteps.map((text, idx) => (
              <div key={idx} className={`flex items-center gap-4 mb-4 last:mb-0 transition-all duration-500 ${
                idx === analysisStep ? 'opacity-100 translate-x-0' :
                idx < analysisStep ? 'opacity-50 translate-x-0' : 'opacity-0 translate-x-4 hidden'
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                  idx < analysisStep ? 'bg-emerald-100 text-emerald-600' : 
                  idx === analysisStep ? 'bg-indigo-100 text-indigo-600 animate-pulse' : 'bg-slate-100 text-slate-400'
                }`}>
                  {idx < analysisStep ? <Check size={14} /> : <div className="w-2 h-2 rounded-full bg-current" />}
                </div>
                <span className={`text-sm font-semibold ${
                  idx === analysisStep ? 'text-indigo-600' : 'text-slate-600'
                }`}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-140px)] flex flex-col pt-0">
      
      {/* Background ambient glows */}
      <div className="fixed top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Area */}
      <div className="w-full flex flex-col md:flex-row md:items-center justify-between mb-4 lg:mb-6 px-4 lg:px-0">
        <div className="flex items-center gap-3 lg:gap-4 mb-4 md:mb-0">
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white transform -rotate-12 shrink-0">
            <Rocket size={20} className="transform rotate-12 lg:w-6 lg:h-6" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Career Explorer <Sparkles size={20} className="text-purple-400" />
            </h1>
            <p className="text-slate-500 text-xs lg:text-sm mt-0.5 lg:mt-1">Discover personalized career paths based on your unique profile.</p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center bg-white px-6 py-3 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white/50 backdrop-blur-xl">
          {steps.map((s, idx) => {
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;
            return (
              <React.Fragment key={s.num}>
                <div className="flex flex-col items-center gap-1 min-w-[60px]">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    isCurrent ? 'bg-[#6D5DF6] text-white shadow-md shadow-indigo-500/30' :
                    isCompleted ? 'bg-indigo-50 text-[#6D5DF6]' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {s.num}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    isCurrent ? 'text-[#6D5DF6]' : 'text-slate-400'
                  }`}>
                    {s.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`h-[2px] w-8 mx-2 rounded-full transition-colors duration-300 ${
                    step > s.num ? 'bg-[#6D5DF6]' : 'bg-slate-100'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Content Card */}
      <div className="flex-1 bg-white/70 backdrop-blur-xl border border-white rounded-[24px] lg:rounded-[32px] shadow-[0_8px_40px_rgba(0,0,0,0.04)] p-5 lg:p-8 flex flex-col relative z-10">
        
        <div className="flex-1">
          {renderStepContent()}
        </div>

        {/* Bottom Section */}
        <div className="mt-4 lg:mt-6 flex flex-col md:flex-row items-center justify-between pt-4 lg:pt-6 border-t border-slate-200/60 gap-4 lg:gap-6">
          
          {/* Info Banner */}
          <div className="flex items-start gap-2 lg:gap-3 bg-indigo-50/50 px-4 py-2 lg:px-5 lg:py-3 rounded-xl border border-indigo-100/50 flex-1">
            <Lightbulb size={18} className="text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs lg:text-sm font-bold text-slate-800">Don't worry, you can change your selection later.</p>
              <p className="text-[10px] lg:text-xs text-slate-500 mt-0.5">We'll personalize everything based on your interests.</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-4 shrink-0">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2.5 lg:px-6 lg:py-3.5 rounded-xl font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="group flex items-center gap-2 px-6 py-2.5 lg:px-8 lg:py-3.5 bg-gradient-to-r from-[#6D5DF6] to-[#5a4add] hover:from-[#5a4add] hover:to-[#4a39d8] text-white rounded-xl font-bold transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
            >
              {step === 3 ? (
                <>Discover Paths <Sparkles size={18} className="group-hover:rotate-12 transition-transform" /></>
              ) : (
                <>Continue <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
