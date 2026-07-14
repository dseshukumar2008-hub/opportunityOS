import React from 'react';
import { Bot, ArrowRight, ArrowLeft } from 'lucide-react';

export default function MentorScreen({ onNext, onBack, firstName = "User" }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-[#F8FAFC] p-6 animate-in fade-in zoom-in-95 duration-500">
      
      <div className="max-w-2xl w-full flex flex-col items-center">
        
        {/* AI Avatar */}
        <div className="relative mb-12">
          <div className="absolute -inset-8 bg-gradient-to-tr from-[#6C4CF1]/20 to-[#4F46E5]/20 blur-2xl rounded-full animate-pulse"></div>
          <div className="w-32 h-32 bg-white rounded-[2rem] shadow-xl flex items-center justify-center relative z-10 border border-slate-100">
            <Bot size={56} className="text-[#6C4CF1]" />
          </div>
          {/* Decorative floating dots */}
          <div className="absolute top-0 -right-4 w-4 h-4 bg-[#10B981] rounded-full shadow-md animate-bounce" style={{ animationDelay: '200ms' }}></div>
          <div className="absolute bottom-4 -left-6 w-6 h-6 bg-[#F59E0B] rounded-full shadow-md animate-bounce" style={{ animationDelay: '500ms' }}></div>
        </div>

        {/* Message Bubble */}
        <div className="bg-white rounded-3xl rounded-tl-sm p-8 shadow-lg border border-slate-100 mb-12 max-w-xl w-full relative">
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-sm">
            <Bot size={16} className="text-[#6C4CF1]" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-4">
            Hi {firstName} 👋
          </h2>
          
          <div className="space-y-3 text-[16px] text-slate-600 font-medium leading-relaxed">
            <p>I'm your AI Career Coach.</p>
            <p>I'll help you build your career step by step.</p>
            <p>Before we begin, I'd like to know a little about you so I can personalize everything.</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
          <button 
            onClick={onBack}
            className="w-full sm:w-1/3 h-14 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl font-bold text-[16px] transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          
          <button 
            onClick={onNext}
            className="w-full sm:w-2/3 h-14 bg-[#6C4CF1] hover:bg-[#5b3fda] text-white rounded-2xl font-bold text-[16px] transition-all shadow-[0_4px_20px_rgba(108,76,241,0.25)] hover:shadow-[0_6px_25px_rgba(108,76,241,0.35)] flex items-center justify-center gap-2"
          >
            Let's Begin
            <ArrowRight size={20} />
          </button>
        </div>

      </div>
    </div>
  );
}
